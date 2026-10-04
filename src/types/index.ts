// src/types/index.ts

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Subject = 'IT' | 'Reasoning' | 'English' | 'Quant' | 'Banking & CA';

export type ITModule =
  | 'DBMS'
  | 'Operating Systems'
  | 'Computer Networks'
  | 'Data Structures'
  | 'Algorithms'
  | 'Programming & OOP'
  | 'Software Engineering'
  | 'Cybersecurity'
  | 'Computer Architecture'
  | 'Web Technologies'
  | 'Cloud Computing'
  | 'AI & Machine Learning'
  | 'IoT & Blockchain'
  | 'Other IT';

export type QuestionSource =
  | 'Self-created'
  | 'Personal notes'
  | 'Purchased study material'
  | 'Mock provider'
  | 'Previous-year material'
  | 'Other';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index or string if matched
  explanation: string;
  subject: Subject;
  itModule?: ITModule;
  topic: string;
  difficulty: Difficulty;
  source: QuestionSource;
  tags: string[];
  type: 'MCQ' | 'Multiple' | 'Subjective';
  isImportant?: boolean;
  isDifficult?: boolean;
  isBookmarked?: boolean;
  createdAt: string;
}

export type MistakeReason =
  | 'Conceptual Gap'
  | 'Silly / Misread Question'
  | 'Calculation Mistake'
  | 'Time-Pressure Rush'
  | 'Formula Forgotten'
  | 'Concept gap'
  | 'Forgot information'
  | 'Careless mistake'
  | 'Misread question'
  | 'Calculation error'
  | 'Time pressure'
  | 'Guesswork';

export interface MistakeEntry {
  id: string;
  questionId?: string;
  questionText: string;
  subject: Subject;
  itModule?: ITModule;
  topic: string;
  myAnswer: string;
  correctAnswer: string;
  explanation: string;
  reason: MistakeReason;
  date: string;
  source: string;
  status: 'Open' | 'Reviewing' | 'Resolved';
  reviewCount: number;
  notes?: string;
}

export type ExamStage = 'Prelims' | 'Mains Objective' | 'Mains Descriptive' | 'Combined';
export type QuestionFormat = 'Objective' | 'Descriptive';

export interface ExamSectionConfig {
  id: string;
  name: string;
  subject: Subject;
  questionCount: number;
  maxMarks: number;
  marksPerCorrect: number;
  negativeMarks: number;
  timeLimitMinutes?: number;
  format?: QuestionFormat; // Objective vs Descriptive
  wordLimit?: number; // for descriptive
}

export interface ExamConfig {
  id: string;
  name: string;
  cycle?: string; // e.g. "CRP-SPL-XVI (2026)" or "2027 Cycle"
  stage: ExamStage; // Prelims vs Mains
  description: string;
  isVerified: boolean;
  totalTimeMinutes: number;
  sections: ExamSectionConfig[];
  negativeMarkingEnabled: boolean;
  isOfficialBaseline?: boolean;
}

export interface DescriptiveSubmission {
  id: string;
  questionId: string;
  questionText: string;
  subject: Subject;
  topic: string;
  conceptId?: string;
  userAnswer: string;
  wordCount: number;
  targetWordCount: number;
  timeSpentSeconds: number;
  submittedAt: string;
  selfScore?: number; // 0-10 or 0-20
  maxScore: number;
  selfEvaluationFeedback?: string;
  modelAnswer: string;
  weakTopicsTagged: string[];
  status: 'Draft' | 'Submitted' | 'Evaluated';
}

export interface MockQuestionAttempt {
  questionId: string;
  selectedOptionIndex?: number;
  isMarkedForReview: boolean;
  timeSpentSeconds: number;
  isCorrect?: boolean;
}

export interface SectionScoreSummary {
  sectionName: string;
  subject: Subject;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  marksObtained: number;
  maxMarks: number;
  accuracy: number;
  timeSpentSeconds: number;
}

export interface ModuleScoreSummary {
  moduleName: string;
  attempted: number;
  correct: number;
  incorrect: number;
  accuracy: number;
}

export interface MockTestAttempt {
  id: string;
  title: string;
  testType: 'Full Mock' | 'Sectional' | 'Custom Practice' | 'Quiz';
  configId?: string;
  date: string;
  timeLimitMinutes: number;
  timeUsedSeconds: number;
  status: 'In Progress' | 'Completed' | 'Abandoned';
  questions: Question[];
  attempts: Record<string, MockQuestionAttempt>;
  // Calculated upon submission:
  totalQuestions?: number;
  totalAttempted?: number;
  totalCorrect?: number;
  totalIncorrect?: number;
  totalUnattempted?: number;
  score?: number;
  maxMarks?: number;
  percentage?: number;
  accuracy?: number;
  attemptRate?: number;
  sectionSummaries?: SectionScoreSummary[];
  moduleSummaries?: Record<string, ModuleScoreSummary>;
  difficultySummaries?: Record<Difficulty, { attempted: number; correct: number; incorrect: number; accuracy: number }>;
}

export interface DailyChecklistItem {
  id: string;
  category: 'IT' | 'Reasoning' | 'English' | 'Quant' | 'Banking & CA' | 'Revision' | 'Custom';
  title: string;
  subject: Subject | 'Other';
  topic: string;
  estimatedMinutes: number;
  actualMinutes?: number;
  completed: boolean;
  notes?: string;
  date: string;
}

export interface StudySession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  subject: Subject;
  itModule?: ITModule;
  topic: string;
  studyType:
    | 'Concept learning'
    | 'Revision'
    | 'Practice'
    | 'Mock analysis'
    | 'Current affairs'
    | 'Vocabulary'
    | 'Mistake review';
  isFocused: boolean;
  notes: string;
}

export interface DailyAnalysis {
  id: string;
  date: string;
  plannedStudyHours: number;
  actualStudyHours: number;
  focusedHours: number;
  sessionsCount: number;
  questionsAttempted: number;
  questionsCorrect: number;
  questionsIncorrect: number;
  accuracy: number;
  attemptRate: number;
  avgTimePerQuestionSeconds: number;
  subjectBreakdown: Record<string, { timeMinutes: number; questions: number; correct: number; incorrect: number }>;
  whatDidILearn: string;
  whatWasDifficult: string;
  whatMistakeDidIRepeat: string;
  whatShouldIRevise: string;
  whatDistractedMe: string;
  whatWentWell: string;
}

export interface RevisionItem {
  id: string;
  subject: Subject;
  itModule?: ITModule;
  topic: string;
  title: string;
  keyPoints: string;
  addedDate: string;
  dueDate: string;
  intervalDays: number;
  repetitionCount: number;
  status: 'Pending' | 'Completed';
  lastRevisedDate?: string;
}

export interface ITTopicProgress {
  id: string;
  module: ITModule;
  subtopic: string;
  status: 'Not Started' | 'In Progress' | 'Mastered' | 'Revision Due';
  questionsPracticed: number;
  accuracy: number;
  notes: string;
  lastStudiedDate?: string;
}

export interface CurrentAffairItem {
  id: string;
  date: string;
  category: 'Banking Awareness' | 'Financial & Economic' | 'IT in Banking' | 'National/RBI' | 'General';
  headline: string;
  summary: string;
  importantNotes: string;
  isImportant: boolean;
}

export interface VocabularyWord {
  id: string;
  word: string;
  meaning: string;
  synonyms: string[];
  antonyms: string[];
  exampleSentence: string;
  ibpsContext?: string;
  mastered: boolean;
  addedDate: string;
}

export interface PrepGoal {
  id: string;
  title: string;
  timeframe: 'Daily' | 'Weekly' | 'Monthly' | 'Exam Cycle';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  isAchieved: boolean;
}
