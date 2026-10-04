// src/types/syllabus.ts

export type ConceptDifficulty = 'L0' | 'L1' | 'L2' | 'L3';
// L0 = Familiarity, L1 = Foundation, L2 = Exam Application, L3 = Advanced

export type ExamPriority = 1 | 2 | 3 | 4 | 5;
// 1 = Low, 2 = Medium, 3 = High, 4 = Very High, 5 = Critical

export type MasteryState = 'Not Started' | 'Learning' | 'Developing' | 'Strong' | 'Mastered';

export type CognitiveErrorType =
  | 'Conceptual Gap'
  | 'Silly / Misread Question'
  | 'Calculation Mistake'
  | 'Time-Pressure Rush'
  | 'Formula Forgotten';

export interface SyllabusConcept {
  id: string;
  subtopicId: string;
  topicId: string;
  moduleId: string;
  subjectId: string;
  title: string;
  description: string;
  difficulty: ConceptDifficulty;
  examPriority: ExamPriority;
  prerequisiteIds: string[]; // Concept IDs that must be learned first
  estimatedStudyMinutes: number;
  estimatedPracticeMinutes: number;
  examFrequencyNotes?: string;
}

export interface SyllabusSubtopic {
  id: string;
  topicId: string;
  moduleId: string;
  subjectId: string;
  name: string;
  description?: string;
  concepts: SyllabusConcept[];
}

export interface SyllabusTopic {
  id: string;
  moduleId: string;
  subjectId: string;
  name: string;
  examPriority: ExamPriority;
  subtopics: SyllabusSubtopic[];
}

export interface SyllabusModule {
  id: string;
  subjectId: string;
  name: string;
  topics: SyllabusTopic[];
}

export interface SyllabusSubject {
  id: string;
  name: string;
  code: string;
  category: 'IT' | 'Reasoning' | 'English' | 'Quant' | 'Banking & CA';
  weightageWeight: number; // For overall priority in IBPS SO
  description: string;
  iconName: string;
  modules: SyllabusModule[];
}

export interface ConceptProgress {
  conceptId: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Mastered';
  isCompleted: boolean;
  notes: string;
  completedAt?: string;
}

export interface MasteryRecord {
  conceptId: string;
  conceptTitle: string;
  topicId: string;
  moduleId: string;
  subjectId: string;
  // Sub-scores (0 - 100)
  completionScore: number;     // 10% weight
  practiceAccuracy: number;    // 35% weight
  recentAccuracy: number;      // 20% weight
  difficultyScore: number;     // 10% weight (based on L0-L3 tested)
  revisionConsistency: number; // 10% weight
  mistakePenalty: number;      // 15% penalty weight
  // Composite score
  masteryScore: number;        // 0 - 100
  masteryState: MasteryState;
  // Raw metrics
  totalAttempts: number;
  totalCorrect: number;
  recentAttempts: number;      // last 10 attempts
  recentCorrect: number;
  lastPracticedAt?: string;
  lastRevisedAt?: string;
  nextReviewDate?: string;
  revisionIntervalDays: number; // 1, 3, 7, 14, 30
  repetitionCount: number;
  mistakeCount: number;
  conceptualErrorCount: number;
  updatedAt: string;
}

export interface SubjectAnalyticsSummary {
  subjectId: string;
  name: string;
  totalConcepts: number;
  completedConcepts: number;
  masteredConcepts: number;
  completionPct: number;
  avgMastery: number;
  totalQuestionsAttempted: number;
  accuracy: number;
  weakestTopic: string;
  strongestTopic: string;
  nextReviewConcept?: string;
  criticalUnfinishedCount: number;
}

export interface AdaptiveDailyTaskPlan {
  conceptId: string;
  subjectId: string;
  moduleId: string;
  topicId: string;
  taskTitle: string;
  category: 'IT' | 'Reasoning' | 'English' | 'Quant' | 'Banking & CA' | 'Revision';
  activityType: 'Concept Study' | 'Practice' | 'Spaced Revision' | 'Mistake Rectification';
  allocatedMinutes: number;
  difficulty: ConceptDifficulty;
  examPriority: ExamPriority;
  priorityScore: number;
  selectionReason: string;
  prerequisitesMet: boolean;
}

export interface DailyTimeDistribution {
  itConceptMinutes: number;      // default 70
  itPracticeMinutes: number;     // default 40
  quantReasoningMinutes: number; // default 30
  englishMinutes: number;        // default 20
  bankingCaMinutes: number;      // default 10
  spacedRevisionMinutes: number; // default 10
  totalMinutes: number;          // strictly 180
}

export interface PreparationPhase {
  phaseNumber: number; // 0 to 6
  name: string;
  goal: string;
  targetMonths: string;
  targetSubjects: string[];
  isCurrent: boolean;
  completionPct: number;
}
