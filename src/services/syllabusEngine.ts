// src/services/syllabusEngine.ts
import {
  SyllabusConcept,
  SyllabusSubject,
  MasteryRecord,
  MasteryState,
  ConceptProgress,
  SubjectAnalyticsSummary,
  AdaptiveDailyTaskPlan,
  DailyTimeDistribution,
  PreparationPhase,
  CognitiveErrorType,
} from '../types/syllabus';
import { DailyChecklistItem, MistakeEntry, Question, StudySession } from '../types';
import { SEED_SUBJECTS, INITIAL_PREP_PHASES } from '../data/syllabusSeed';
import { getAllItems, putItem, getItemById } from './db';

// Flat lookup caches for instant traversal
let flatConceptsMap: Map<string, SyllabusConcept> | null = null;
let flatSubjectsMap: Map<string, SyllabusSubject> | null = null;

export function getAllSubjects(): SyllabusSubject[] {
  return SEED_SUBJECTS;
}

export function getFlatConcepts(): Map<string, SyllabusConcept> {
  if (!flatConceptsMap) {
    flatConceptsMap = new Map();
    flatSubjectsMap = new Map();

    for (const sub of SEED_SUBJECTS) {
      flatSubjectsMap.set(sub.id, sub);
      for (const mod of sub.modules) {
        for (const top of mod.topics) {
          for (const subt of top.subtopics) {
            for (const cnc of subt.concepts) {
              flatConceptsMap.set(cnc.id, cnc);
            }
          }
        }
      }
    }
  }
  return flatConceptsMap;
}

export function getConceptById(conceptId: string): SyllabusConcept | undefined {
  return getFlatConcepts().get(conceptId);
}

export function getSubjectById(subjectId: string): SyllabusSubject | undefined {
  getFlatConcepts(); // ensures cache
  return flatSubjectsMap?.get(subjectId);
}

/**
 * Mastery Formula:
 * - Concept completion: 10%
 * - Practice accuracy: 35%
 * - Recent accuracy (last 10): 20%
 * - Question difficulty factor: 10%
 * - Revision consistency: 10%
 * - Mistake penalty: 15% deduction
 * Total = 0 to 100
 */
export function calculateMasteryScore(record: Partial<MasteryRecord>): { score: number; state: MasteryState } {
  const completionScore = Math.min(100, Math.max(0, record.completionScore || 0));
  const practiceAccuracy = Math.min(100, Math.max(0, record.practiceAccuracy || 0));
  const recentAccuracy = Math.min(100, Math.max(0, record.recentAccuracy || (record.totalAttempts ? practiceAccuracy : 0)));
  const difficultyScore = Math.min(100, Math.max(0, record.difficultyScore || 50));
  const revisionConsistency = Math.min(100, Math.max(0, record.revisionConsistency || 0));
  const mistakePenalty = Math.min(100, Math.max(0, record.mistakePenalty || 0));

  // Weighted calculation
  const weighted =
    completionScore * 0.1 +
    practiceAccuracy * 0.35 +
    recentAccuracy * 0.2 +
    difficultyScore * 0.1 +
    revisionConsistency * 0.1 -
    mistakePenalty * 0.15;

  const finalScore = Math.round(Math.min(100, Math.max(0, weighted)));

  let state: MasteryState = 'Not Started';
  if (finalScore >= 85) state = 'Mastered';
  else if (finalScore >= 70) state = 'Strong';
  else if (finalScore >= 50) state = 'Developing';
  else if (finalScore >= 30) state = 'Learning';
  else if (record.totalAttempts || completionScore > 0) state = 'Learning';

  return { score: finalScore, state };
}

/**
 * Check if all prerequisites for a concept have been mastered (mastery >= 50)
 */
export function arePrerequisitesMet(
  concept: SyllabusConcept,
  masteryMap: Map<string, MasteryRecord>
): { met: boolean; missingPrereqs: string[] } {
  if (!concept.prerequisiteIds || concept.prerequisiteIds.length === 0) {
    return { met: true, missingPrereqs: [] };
  }

  const missing: string[] = [];
  for (const pid of concept.prerequisiteIds) {
    const pRecord = masteryMap.get(pid);
    const pConcept = getConceptById(pid);
    const pTitle = pConcept?.title || pid;

    if (!pRecord || pRecord.masteryScore < 50) {
      missing.push(pTitle);
    }
  }

  return { met: missing.length === 0, missingPrereqs: missing };
}

/**
 * Compute Adaptive Priority Score:
 * priorityScore = examPriority * weaknessFactor * recencyFactor * prerequisiteFactor * errorFactor
 */
export function calculateAdaptivePriority(
  concept: SyllabusConcept,
  mastery: MasteryRecord | undefined,
  masteryMap: Map<string, MasteryRecord>
): { priorityScore: number; reason: string } {
  const examPri = concept.examPriority; // 1 to 5

  // Weakness factor: 0.4 (if mastered) to 2.2 (if weak / not started)
  const currentMastery = mastery?.masteryScore || 0;
  const weaknessFactor = Math.max(0.4, 2.2 - currentMastery / 55);

  // Recency factor: boosts concepts not reviewed recently
  let recencyFactor = 1.0;
  const today = new Date();
  if (mastery?.nextReviewDate) {
    const dueDate = new Date(mastery.nextReviewDate);
    const daysDiff = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff >= 0) {
      recencyFactor = 1.5 + Math.min(1.0, daysDiff * 0.1); // overdue
    }
  } else if (!mastery || mastery.totalAttempts === 0) {
    recencyFactor = 1.2; // new concept
  }

  // Prerequisite factor: penalizes concept if prerequisites are missing, but boosts prerequisites
  const { met, missingPrereqs } = arePrerequisitesMet(concept, masteryMap);
  const prerequisiteFactor = met ? 1.0 : 0.2;

  // Error factor: high if unresolved mistakes exist
  let errorFactor = 1.0;
  if (mastery && mastery.mistakeCount > 0) {
    errorFactor = 1.3 + Math.min(1.2, mastery.conceptualErrorCount * 0.4);
  }

  const rawScore = examPri * weaknessFactor * recencyFactor * prerequisiteFactor * errorFactor;
  const priorityScore = Math.round(rawScore * 10) / 10;

  // Formulate clear diagnostic reason
  let reason = '';
  if (!met) {
    reason = `Prerequisites pending: Complete ${missingPrereqs.join(', ')} first.`;
  } else if (mastery?.nextReviewDate && new Date(mastery.nextReviewDate) <= today) {
    reason = `Overdue spaced revision (Interval: ${mastery.revisionIntervalDays}d).`;
  } else if (mastery && mastery.conceptualErrorCount > 0) {
    reason = `High priority remediation: ${mastery.conceptualErrorCount} conceptual mistake(s) logged. Accuracy: ${mastery.practiceAccuracy}%.`;
  } else if (currentMastery < 40) {
    reason = `High exam priority (P${concept.examPriority}) + foundational mastery needed (${currentMastery}%).`;
  } else {
    reason = `Exam Priority ${concept.examPriority} | Mastery: ${currentMastery}% | Difficulty: ${concept.difficulty}.`;
  }

  return { priorityScore, reason };
}

/**
 * Dynamically rebalances the 180-minute daily budget according to user weaknesses
 */
export async function calculateDynamicTimeDistribution(): Promise<DailyTimeDistribution> {
  const masteryList = await getAllItems<MasteryRecord>('masteryRecords');
  const mistakes = await getAllItems<MistakeEntry>('mistakes');
  const openMistakes = mistakes.filter((m) => m.status === 'Open');

  // Baseline allocation (Total = 180 mins)
  let itConceptMinutes = 70;
  let itPracticeMinutes = 40;
  let quantReasoningMinutes = 30;
  let englishMinutes = 20;
  let bankingCaMinutes = 10;
  let spacedRevisionMinutes = 10;

  // If there are many overdue revisions or open mistakes, give more revision time
  const todayStr = new Date().toISOString().split('T')[0];
  const dueRevisions = masteryList.filter((m) => m.nextReviewDate && m.nextReviewDate <= todayStr);

  if (dueRevisions.length >= 3 || openMistakes.length >= 5) {
    spacedRevisionMinutes = 25;
    itConceptMinutes -= 15;
  }

  // Check IT vs Non-IT average accuracy
  const itRecords = masteryList.filter((m) => m.subjectId.startsWith('sub-comp') || m.subjectId === 'sub-os' || m.subjectId === 'sub-dbms' || m.subjectId === 'sub-cn' || m.subjectId === 'sub-dsa');
  const quantRecords = masteryList.filter((m) => m.subjectId === 'sub-quant' || m.subjectId === 'sub-reas');

  const avgItAcc = itRecords.length ? itRecords.reduce((acc, r) => acc + r.practiceAccuracy, 0) / itRecords.length : 60;
  const avgQuantAcc = quantRecords.length ? quantRecords.reduce((acc, r) => acc + r.practiceAccuracy, 0) / quantRecords.length : 60;

  if (avgQuantAcc < avgItAcc - 15) {
    // Quant/Reasoning needs more practice
    quantReasoningMinutes = Math.min(45, quantReasoningMinutes + 10);
    itPracticeMinutes = Math.max(30, itPracticeMinutes - 10);
  }

  // Ensure exact total of 180
  const sum = itConceptMinutes + itPracticeMinutes + quantReasoningMinutes + englishMinutes + bankingCaMinutes + spacedRevisionMinutes;
  const diff = 180 - sum;
  itConceptMinutes += diff;

  return {
    itConceptMinutes,
    itPracticeMinutes,
    quantReasoningMinutes,
    englishMinutes,
    bankingCaMinutes,
    spacedRevisionMinutes,
    totalMinutes: 180,
  };
}

/**
 * Initializes or syncs mastery records for all concepts
 */
export async function syncMasteryRecords(): Promise<Map<string, MasteryRecord>> {
  const allConcepts = getFlatConcepts();
  const existingList = await getAllItems<MasteryRecord>('masteryRecords');
  const masteryMap = new Map<string, MasteryRecord>();

  for (const rec of existingList) {
    masteryMap.set(rec.conceptId, rec);
  }

  const now = new Date().toISOString();
  let updatedCount = 0;

  for (const [id, concept] of allConcepts) {
    if (!masteryMap.has(id)) {
      const initial: MasteryRecord = {
        conceptId: id,
        conceptTitle: concept.title,
        topicId: concept.topicId,
        moduleId: concept.moduleId,
        subjectId: concept.subjectId,
        completionScore: 0,
        practiceAccuracy: 0,
        recentAccuracy: 0,
        difficultyScore: concept.difficulty === 'L0' ? 30 : concept.difficulty === 'L1' ? 50 : concept.difficulty === 'L2' ? 75 : 90,
        revisionConsistency: 0,
        mistakePenalty: 0,
        masteryScore: 0,
        masteryState: 'Not Started',
        totalAttempts: 0,
        totalCorrect: 0,
        recentAttempts: 0,
        recentCorrect: 0,
        revisionIntervalDays: 1,
        repetitionCount: 0,
        mistakeCount: 0,
        conceptualErrorCount: 0,
        updatedAt: now,
      };
      await putItem('masteryRecords', initial);
      masteryMap.set(id, initial);
      updatedCount++;
    }
  }

  return masteryMap;
}

/**
 * Record question attempt for a concept to update real-time mastery
 */
export async function recordConceptAttempt(
  conceptId: string,
  isCorrect: boolean,
  difficulty: 'Easy' | 'Medium' | 'Hard'
): Promise<MasteryRecord | undefined> {
  let record = await getItemById<MasteryRecord>('masteryRecords', conceptId);
  if (!record) {
    const all = await syncMasteryRecords();
    record = all.get(conceptId);
  }
  if (!record) return undefined;

  const now = new Date().toISOString();
  record.totalAttempts = (record.totalAttempts || 0) + 1;
  if (isCorrect) record.totalCorrect = (record.totalCorrect || 0) + 1;

  record.recentAttempts = Math.min(10, (record.recentAttempts || 0) + 1);
  if (isCorrect) {
    record.recentCorrect = Math.min(record.recentAttempts, (record.recentCorrect || 0) + 1);
  } else {
    record.recentCorrect = Math.max(0, (record.recentCorrect || 0) - (record.recentAttempts >= 10 ? 1 : 0));
  }

  record.practiceAccuracy = Math.round((record.totalCorrect / record.totalAttempts) * 100);
  record.recentAccuracy = Math.round((record.recentCorrect / record.recentAttempts) * 100);
  record.lastPracticedAt = now;

  // Spaced repetition progression
  const nextIntervals = [1, 3, 7, 14, 30];
  if (isCorrect && record.recentAccuracy >= 75) {
    const curIdx = nextIntervals.indexOf(record.revisionIntervalDays);
    if (curIdx >= 0 && curIdx < nextIntervals.length - 1) {
      record.revisionIntervalDays = nextIntervals[curIdx + 1];
    }
  } else if (!isCorrect) {
    record.revisionIntervalDays = 1; // reset interval on error
  }

  const nextDue = new Date();
  nextDue.setDate(nextDue.getDate() + record.revisionIntervalDays);
  record.nextReviewDate = nextDue.toISOString().split('T')[0];

  const { score, state } = calculateMasteryScore(record);
  record.masteryScore = score;
  record.masteryState = state;
  record.updatedAt = now;

  await putItem('masteryRecords', record);
  return record;
}

/**
 * Record a mistake linked to a concept
 */
export async function recordConceptMistake(
  conceptId: string,
  errorType: CognitiveErrorType
): Promise<void> {
  const record = await getItemById<MasteryRecord>('masteryRecords', conceptId);
  if (!record) return;

  record.mistakeCount = (record.mistakeCount || 0) + 1;
  if (errorType === 'Conceptual Gap') {
    record.conceptualErrorCount = (record.conceptualErrorCount || 0) + 1;
    record.mistakePenalty = Math.min(100, (record.mistakePenalty || 0) + 25);
  } else {
    record.mistakePenalty = Math.min(100, (record.mistakePenalty || 0) + 10);
  }

  // Shorten review interval to 1 day on mistake
  record.revisionIntervalDays = 1;
  const nextDue = new Date();
  nextDue.setDate(nextDue.getDate() + 1);
  record.nextReviewDate = nextDue.toISOString().split('T')[0];

  const { score, state } = calculateMasteryScore(record);
  record.masteryScore = score;
  record.masteryState = state;
  record.updatedAt = new Date().toISOString();

  await putItem('masteryRecords', record);
}

/**
 * Generate Adaptive Daily Checklist tasks strictly totaling 180 minutes.
 * Satisfies all 10 rules + outputs clear reason for each selection.
 */
export async function generateAdaptiveDailyChecklist(
  targetDateStr: string,
  carriedTasks: DailyChecklistItem[] = []
): Promise<DailyChecklistItem[]> {
  const masteryMap = await syncMasteryRecords();
  const allConcepts = Array.from(getFlatConcepts().values());
  const timeDist = await calculateDynamicTimeDistribution();

  const generatedItems: DailyChecklistItem[] = [];
  let remainingBudget = 180;

  // 1. Carry forward unfinished mandatory tasks
  for (const carried of carriedTasks) {
    const mins = Math.min(remainingBudget, carried.estimatedMinutes || 25);
    if (mins > 0) {
      generatedItems.push({
        ...carried,
        id: `chk-carry-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        date: targetDateStr,
        completed: false,
        estimatedMinutes: mins,
        notes: `[Carried from previous day] ${carried.notes || ''}`.trim(),
      });
      remainingBudget -= mins;
    }
  }

  // 2. Score and rank all eligible concepts by adaptive priority
  const scoredConcepts = allConcepts.map((c) => {
    const m = masteryMap.get(c.id);
    const { priorityScore, reason } = calculateAdaptivePriority(c, m, masteryMap);
    const { met } = arePrerequisitesMet(c, masteryMap);
    return {
      concept: c,
      mastery: m,
      priorityScore,
      selectionReason: reason,
      prerequisitesMet: met,
    };
  });

  // Sort descending by priority score
  scoredConcepts.sort((a, b) => b.priorityScore - a.priorityScore);

  // Group candidates by subject categories
  const itCandidates = scoredConcepts.filter(
    (sc) => sc.prerequisitesMet && sc.concept.subjectId.startsWith('sub-') && !['sub-eng', 'sub-reas', 'sub-quant', 'sub-ba'].includes(sc.concept.subjectId)
  );
  const quantCandidates = scoredConcepts.filter((sc) => sc.prerequisitesMet && sc.concept.subjectId === 'sub-quant');
  const reasCandidates = scoredConcepts.filter((sc) => sc.prerequisitesMet && sc.concept.subjectId === 'sub-reas');
  const engCandidates = scoredConcepts.filter((sc) => sc.prerequisitesMet && sc.concept.subjectId === 'sub-eng');
  const bankCandidates = scoredConcepts.filter((sc) => sc.prerequisitesMet && sc.concept.subjectId === 'sub-ba');

  // Overdue spaced revisions across all subjects
  const today = new Date().toISOString().split('T')[0];
  const overdueRevisions = scoredConcepts.filter(
    (sc) => sc.mastery?.nextReviewDate && sc.mastery.nextReviewDate <= today
  );

  // Helper to add a task safely within budget
  function addTask(
    category: DailyChecklistItem['category'],
    subject: DailyChecklistItem['subject'],
    title: string,
    topic: string,
    minutes: number,
    notes: string
  ) {
    if (remainingBudget <= 0) return;
    const actualMins = Math.min(remainingBudget, Math.max(10, minutes));
    generatedItems.push({
      id: `chk-${targetDateStr}-${category.toLowerCase().replace(/[^a-z]/g, '')}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      category,
      subject,
      title,
      topic,
      estimatedMinutes: actualMins,
      actualMinutes: 0,
      completed: false,
      date: targetDateStr,
      notes,
    });
    remainingBudget -= actualMins;
  }

  // 3. Add Spaced Revision task if overdue
  if (overdueRevisions.length > 0 && remainingBudget >= 15) {
    const rev = overdueRevisions[0];
    addTask(
      'Revision',
      'IT',
      `Spaced Revision: ${rev.concept.title}`,
      rev.concept.title,
      timeDist.spacedRevisionMinutes || 15,
      `Reason: ${rev.selectionReason} (Interval: ${rev.mastery?.revisionIntervalDays || 1}d)`
    );
  }

  // 4. Primary IT Concept Study (High-Priority Concept)
  if (itCandidates.length > 0 && remainingBudget >= 35) {
    const topIt = itCandidates[0];
    const sub = getSubjectById(topIt.concept.subjectId);
    addTask(
      'IT',
      'IT',
      `IT In-Depth Study: ${topIt.concept.title}`,
      sub?.name || 'IT Professional Knowledge',
      Math.min(50, Math.max(30, timeDist.itConceptMinutes - 20)),
      `Reason: ${topIt.selectionReason}`
    );
  }

  // 5. IT Focused Practice Drill (15–20 questions on timer)
  if (itCandidates.length > 1 && remainingBudget >= 25) {
    const pracIt = itCandidates[1] || itCandidates[0];
    addTask(
      'IT',
      'IT',
      `IT Practice Drill: 15–20 Questions on ${pracIt.concept.title}`,
      'Practice Drills',
      Math.min(35, Math.max(20, timeDist.itPracticeMinutes)),
      `Reason: High-yield application practice. ${pracIt.selectionReason}`
    );
  }

  // 6. Quantitative Aptitude / Reasoning exposure
  if (quantCandidates.length > 0 && remainingBudget >= 25) {
    const qTask = quantCandidates[0];
    addTask(
      'Quant',
      'Quant',
      `Quant Practice: ${qTask.concept.title}`,
      'Quantitative Aptitude',
      Math.min(30, remainingBudget >= 40 ? 30 : 20),
      `Reason: ${qTask.selectionReason}`
    );
  } else if (reasCandidates.length > 0 && remainingBudget >= 25) {
    const rTask = reasCandidates[0];
    addTask(
      'Reasoning',
      'Reasoning',
      `Reasoning Drill: ${rTask.concept.title}`,
      'Reasoning Ability',
      25,
      `Reason: ${rTask.selectionReason}`
    );
  }

  // 7. English Language & Verbal exposure
  if (engCandidates.length > 0 && remainingBudget >= 20) {
    const eng = engCandidates[0];
    addTask(
      'English',
      'English',
      `English Editorial & Grammar: ${eng.concept.title}`,
      'English Language',
      20,
      `Reason: Daily verbal discipline. ${eng.selectionReason}`
    );
  }

  // 8. Banking & Current Affairs exposure
  if (bankCandidates.length > 0 && remainingBudget >= 15) {
    const bnk = bankCandidates[0];
    addTask(
      'Banking & CA',
      'Banking & CA',
      `Banking Awareness: ${bnk.concept.title}`,
      'Banking & Current Affairs',
      15,
      `Reason: High exam relevance for SO IT interview & Prelims. ${bnk.selectionReason}`
    );
  }

  // 9. Fill any remainder strictly into Mistake Review / Consolidation
  if (remainingBudget > 0) {
    addTask(
      'Revision',
      'IT',
      'Daily Error Notebook Audit & Formula Consolidation',
      'Daily Reflection',
      remainingBudget,
      'Reason: Lock in daily learnings and review unattempted/incorrect concepts.'
    );
  }

  return generatedItems;
}

/**
 * Compute Subject Analytics Dashboard Summary
 */
export async function getSubjectAnalytics(subjectId: string): Promise<SubjectAnalyticsSummary> {
  const subject = getSubjectById(subjectId);
  const masteryMap = await syncMasteryRecords();

  if (!subject) {
    return {
      subjectId,
      name: 'Unknown',
      totalConcepts: 0,
      completedConcepts: 0,
      masteredConcepts: 0,
      completionPct: 0,
      avgMastery: 0,
      totalQuestionsAttempted: 0,
      accuracy: 0,
      weakestTopic: 'None',
      strongestTopic: 'None',
      criticalUnfinishedCount: 0,
    };
  }

  const subjectConcepts: SyllabusConcept[] = [];
  for (const mod of subject.modules) {
    for (const top of mod.topics) {
      for (const subt of top.subtopics) {
        for (const c of subt.concepts) {
          subjectConcepts.push(c);
        }
      }
    }
  }

  const totalConcepts = subjectConcepts.length;
  let masteredCount = 0;
  let completedCount = 0;
  let totalMasterySum = 0;
  let totalAttempts = 0;
  let totalCorrect = 0;
  let criticalUnfinished = 0;

  // Track weakest and strongest topics
  const topicMasteries: Record<string, { sum: number; count: number }> = {};

  for (const c of subjectConcepts) {
    const rec = masteryMap.get(c.id);
    const mScore = rec?.masteryScore || 0;
    totalMasterySum += mScore;

    if (mScore >= 85) masteredCount++;
    if (mScore >= 50 || rec?.completionScore === 100) completedCount++;
    if (c.examPriority >= 4 && mScore < 70) criticalUnfinished++;

    if (rec) {
      totalAttempts += rec.totalAttempts || 0;
      totalCorrect += rec.totalCorrect || 0;
    }

    if (!topicMasteries[c.topicId]) {
      topicMasteries[c.topicId] = { sum: 0, count: 0 };
    }
    topicMasteries[c.topicId].sum += mScore;
    topicMasteries[c.topicId].count += 1;
  }

  let weakestTopic = 'General';
  let strongestTopic = 'General';
  let minAvg = 999;
  let maxAvg = -1;

  for (const [topId, data] of Object.entries(topicMasteries)) {
    const avg = data.sum / data.count;
    if (avg < minAvg) {
      minAvg = avg;
      weakestTopic = topId.replace('top-', '').replace(/-/g, ' ');
    }
    if (avg > maxAvg) {
      maxAvg = avg;
      strongestTopic = topId.replace('top-', '').replace(/-/g, ' ');
    }
  }

  const avgMastery = totalConcepts > 0 ? Math.round(totalMasterySum / totalConcepts) : 0;
  const completionPct = totalConcepts > 0 ? Math.round((completedCount / totalConcepts) * 100) : 0;
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  return {
    subjectId: subject.id,
    name: subject.name,
    totalConcepts,
    completedConcepts: completedCount,
    masteredConcepts: masteredCount,
    completionPct,
    avgMastery,
    totalQuestionsAttempted: totalAttempts,
    accuracy,
    weakestTopic,
    strongestTopic,
    criticalUnfinishedCount: criticalUnfinished,
  };
}

/**
 * Overall syllabus metrics (completion %, mastery %, phase)
 */
export async function getOverallSyllabusMetrics(): Promise<{
  overallCompletionPct: number;
  overallMasteryPct: number;
  totalConcepts: number;
  masteredConcepts: number;
  currentPhase: PreparationPhase;
  subjectSummaries: SubjectAnalyticsSummary[];
}> {
  const masteryMap = await syncMasteryRecords();
  const allConcepts = Array.from(getFlatConcepts().values());

  let totalCompleted = 0;
  let totalMastered = 0;
  let totalMasterySum = 0;

  for (const c of allConcepts) {
    const rec = masteryMap.get(c.id);
    const m = rec?.masteryScore || 0;
    totalMasterySum += m;
    if (m >= 85) totalMastered++;
    if (m >= 50 || rec?.completionScore === 100) totalCompleted++;
  }

  const overallCompletionPct = allConcepts.length ? Math.round((totalCompleted / allConcepts.length) * 100) : 0;
  const overallMasteryPct = allConcepts.length ? Math.round(totalMasterySum / allConcepts.length) : 0;

  // Compute subject summaries
  const subjectSummaries: SubjectAnalyticsSummary[] = [];
  for (const sub of SEED_SUBJECTS) {
    const summary = await getSubjectAnalytics(sub.id);
    subjectSummaries.push(summary);
  }

  // Determine current preparation phase (Target: Aug 2027)
  const currentPhase = INITIAL_PREP_PHASES.find((p) => p.isCurrent) || INITIAL_PREP_PHASES[1];

  return {
    overallCompletionPct,
    overallMasteryPct,
    totalConcepts: allConcepts.length,
    masteredConcepts: totalMastered,
    currentPhase,
    subjectSummaries,
  };
}
