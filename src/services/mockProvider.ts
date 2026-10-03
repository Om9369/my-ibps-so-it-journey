// src/services/mockProvider.ts
import {
  MockTestAttempt,
  ExamConfig,
  Question,
  Difficulty,
  Subject,
  ITModule,
  SectionScoreSummary,
  ModuleScoreSummary,
} from '../types';
import { questionProvider } from './questionProvider';
import { getAllItems, putItem, deleteItem, saveActiveMockDraft, clearActiveMockDraft } from './db';

export interface IMockProvider {
  name: string;
  isConfigured(): boolean;
  getHistory(): Promise<MockTestAttempt[]>;
  saveMockAttempt(attempt: MockTestAttempt): Promise<void>;
  deleteMockAttempt(id: string): Promise<void>;
}

export class ManualMockProvider implements IMockProvider {
  name = 'Internal Mock Engine';

  isConfigured(): boolean {
    return true;
  }

  async getHistory(): Promise<MockTestAttempt[]> {
    const list = await getAllItems<MockTestAttempt>('mockTests');
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async saveMockAttempt(attempt: MockTestAttempt): Promise<void> {
    await putItem('mockTests', attempt);
  }

  async deleteMockAttempt(id: string): Promise<void> {
    await deleteItem('mockTests', id);
  }
}

export class ExternalMockAdapter implements IMockProvider {
  name = 'External Mock Provider Adapter';
  private endpoint: string = '';
  private token: string = '';

  constructor(endpoint?: string, token?: string) {
    this.endpoint = endpoint || '';
    this.token = token || '';
  }

  isConfigured(): boolean {
    return Boolean(this.endpoint && this.token);
  }

  async getHistory(): Promise<MockTestAttempt[]> {
    if (!this.isConfigured()) return [];
    try {
      const res = await fetch(`${this.endpoint}/api/mocks`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      return await res.json();
    } catch {
      return [];
    }
  }

  async saveMockAttempt(_attempt: MockTestAttempt): Promise<void> {
    // External adapter implementation
  }

  async deleteMockAttempt(_id: string): Promise<void> {
    // External adapter implementation
  }
}

export const mockProvider: IMockProvider = new ManualMockProvider();

// Helper to shuffle questions
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export interface GenerateMockOptions {
  title: string;
  testType: 'Full Mock' | 'Sectional' | 'Custom Practice' | 'Quiz';
  config?: ExamConfig;
  subject?: Subject;
  itModules?: ITModule[];
  topics?: string[];
  difficulty?: Difficulty | 'Mixed';
  questionCount?: number;
  timeLimitMinutes?: number;
  randomize?: boolean;
}

/**
 * Generates a mock test or practice set based on configurable parameters
 */
export async function generateTest(options: GenerateMockOptions): Promise<MockTestAttempt> {
  const allQuestions = await questionProvider.getQuestions();
  let selectedQuestions: Question[] = [];

  if (options.testType === 'Full Mock' && options.config) {
    // Select questions per section according to ExamConfig
    for (const section of options.config.sections) {
      let pool = allQuestions.filter((q) => q.subject === section.subject);
      if (options.randomize !== false) {
        pool = shuffleArray(pool);
      }
      const sectionQuestions = pool.slice(0, section.questionCount);
      selectedQuestions.push(...sectionQuestions);
    }
  } else {
    // Sectional, Quiz or Quick Practice
    let pool = allQuestions;

    if (options.subject) {
      pool = pool.filter((q) => q.subject === options.subject);
    }

    if (options.itModules && options.itModules.length > 0) {
      pool = pool.filter((q) => q.itModule && options.itModules!.includes(q.itModule));
    }

    if (options.topics && options.topics.length > 0) {
      pool = pool.filter((q) => options.topics!.some((t) => q.topic.toLowerCase().includes(t.toLowerCase())));
    }

    if (options.difficulty && options.difficulty !== 'Mixed') {
      pool = pool.filter((q) => q.difficulty === options.difficulty);
    }

    if (options.randomize !== false) {
      pool = shuffleArray(pool);
    }

    const count = options.questionCount || Math.min(pool.length, 20);
    selectedQuestions = pool.slice(0, count);
  }

  // If question bank is smaller than desired count, duplicate or keep available
  if (selectedQuestions.length === 0 && allQuestions.length > 0) {
    selectedQuestions = allQuestions.slice(0, options.questionCount || 10);
  }

  const duration = options.timeLimitMinutes || (options.config ? options.config.totalTimeMinutes : 20);

  const attempt: MockTestAttempt = {
    id: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: options.title,
    testType: options.testType,
    configId: options.config?.id,
    date: new Date().toISOString(),
    timeLimitMinutes: duration,
    timeUsedSeconds: 0,
    status: 'In Progress',
    questions: selectedQuestions,
    attempts: {},
  };

  saveActiveMockDraft(attempt);
  return attempt;
}

/**
 * Evaluates and calculates complete mock results with subject-wise, module-wise, and difficulty-wise breakdowns
 */
export function calculateMockResults(
  mock: MockTestAttempt,
  config?: ExamConfig
): MockTestAttempt {
  let totalAttempted = 0;
  let totalCorrect = 0;
  let totalIncorrect = 0;
  let totalUnattempted = 0;
  let totalScore = 0;
  let maxMarks = 0;

  const sectionMap: Record<string, SectionScoreSummary> = {};
  const moduleMap: Record<string, ModuleScoreSummary> = {};
  const diffMap: Record<Difficulty, { attempted: number; correct: number; incorrect: number; accuracy: number }> = {
    Easy: { attempted: 0, correct: 0, incorrect: 0, accuracy: 0 },
    Medium: { attempted: 0, correct: 0, incorrect: 0, accuracy: 0 },
    Hard: { attempted: 0, correct: 0, incorrect: 0, accuracy: 0 },
  };

  const defaultMarksPerCorrect = 1.0;
  const defaultNegativeMarks = 0.25;

  // Iterate over each question in the test
  mock.questions.forEach((q) => {
    const attempt = mock.attempts[q.id];
    const isAnswered = attempt && attempt.selectedOptionIndex !== undefined;

    // Determine section config
    const secConfig = config?.sections.find((s) => s.subject === q.subject);
    const marksPerCorrect = secConfig ? secConfig.marksPerCorrect : defaultMarksPerCorrect;
    const negativeMarks = config && !config.negativeMarkingEnabled ? 0 : secConfig ? secConfig.negativeMarks : defaultNegativeMarks;

    maxMarks += marksPerCorrect;

    // Track Section Map
    const secKey = secConfig ? secConfig.name : q.subject;
    if (!sectionMap[secKey]) {
      sectionMap[secKey] = {
        sectionName: secKey,
        subject: q.subject,
        totalQuestions: 0,
        attempted: 0,
        correct: 0,
        incorrect: 0,
        unattempted: 0,
        marksObtained: 0,
        maxMarks: 0,
        accuracy: 0,
        timeSpentSeconds: 0,
      };
    }
    sectionMap[secKey].totalQuestions++;
    sectionMap[secKey].maxMarks += marksPerCorrect;

    // Track IT Module
    if (q.itModule) {
      if (!moduleMap[q.itModule]) {
        moduleMap[q.itModule] = {
          moduleName: q.itModule,
          attempted: 0,
          correct: 0,
          incorrect: 0,
          accuracy: 0,
        };
      }
    }

    if (isAnswered) {
      totalAttempted++;
      sectionMap[secKey].attempted++;
      sectionMap[secKey].timeSpentSeconds += attempt.timeSpentSeconds || 0;
      if (q.itModule) moduleMap[q.itModule].attempted++;
      diffMap[q.difficulty].attempted++;

      const isCorrect = attempt.selectedOptionIndex === q.correctAnswer;
      attempt.isCorrect = isCorrect;

      if (isCorrect) {
        totalCorrect++;
        totalScore += marksPerCorrect;
        sectionMap[secKey].correct++;
        sectionMap[secKey].marksObtained += marksPerCorrect;
        if (q.itModule) moduleMap[q.itModule].correct++;
        diffMap[q.difficulty].correct++;
      } else {
        totalIncorrect++;
        totalScore -= negativeMarks;
        sectionMap[secKey].incorrect++;
        sectionMap[secKey].marksObtained -= negativeMarks;
        if (q.itModule) moduleMap[q.itModule].incorrect++;
        diffMap[q.difficulty].incorrect++;
      }
    } else {
      totalUnattempted++;
      sectionMap[secKey].unattempted++;
    }
  });

  // Calculate accuracies
  Object.values(sectionMap).forEach((sec) => {
    sec.accuracy = sec.attempted > 0 ? Math.round((sec.correct / sec.attempted) * 1000) / 10 : 0;
    sec.marksObtained = Math.max(0, Math.round(sec.marksObtained * 100) / 100);
  });

  Object.values(moduleMap).forEach((mod) => {
    mod.accuracy = mod.attempted > 0 ? Math.round((mod.correct / mod.attempted) * 1000) / 10 : 0;
  });

  (['Easy', 'Medium', 'Hard'] as Difficulty[]).forEach((d) => {
    diffMap[d].accuracy = diffMap[d].attempted > 0 ? Math.round((diffMap[d].correct / diffMap[d].attempted) * 1000) / 10 : 0;
  });

  const finalScore = Math.max(0, Math.round(totalScore * 100) / 100);
  const totalQuestions = mock.questions.length;
  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 1000) / 10 : 0;
  const attemptRate = totalQuestions > 0 ? Math.round((totalAttempted / totalQuestions) * 1000) / 10 : 0;
  const percentage = maxMarks > 0 ? Math.round((finalScore / maxMarks) * 1000) / 10 : 0;

  const completedMock: MockTestAttempt = {
    ...mock,
    status: 'Completed',
    totalQuestions,
    totalAttempted,
    totalCorrect,
    totalIncorrect,
    totalUnattempted,
    score: finalScore,
    maxMarks: Math.round(maxMarks * 100) / 100,
    percentage,
    accuracy,
    attemptRate,
    sectionSummaries: Object.values(sectionMap),
    moduleSummaries: moduleMap,
    difficultySummaries: diffMap,
  };

  clearActiveMockDraft();
  return completedMock;
}
