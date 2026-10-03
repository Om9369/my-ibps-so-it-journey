// src/services/analyticsService.ts
import { MockTestAttempt, MistakeEntry, StudySession, ITModule, Difficulty } from '../types';
import { getAllItems } from './db';

export interface GrowthAnalyticsData {
  totalMocksCompleted: number;
  avgScorePercentage: number;
  avgAccuracy: number;
  scoreTrend: { date: string; title: string; score: number; maxMarks: number; percentage: number; accuracy: number }[];
  accuracyTrend: { date: string; accuracy: number; attemptRate: number }[];
  itModuleBreakdown: { module: string; attempted: number; correct: number; incorrect: number; accuracy: number }[];
  difficultyStats: { difficulty: Difficulty; attempted: number; correct: number; incorrect: number; accuracy: number }[];
  mistakePatternCounts: { reason: string; count: number; resolvedCount: number }[];
  timeManagement: { avgTimePerQuestionSeconds: number; totalTimeSpentMinutes: number };
  subjectScoreAverages: { subject: string; avgScore: number; avgAccuracy: number; testsCount: number }[];
  studyConsistency: {
    totalSessions: number;
    totalHours: number;
    deepFocusHours: number;
    streakDays: number;
  };
}

export async function computeGrowthAnalytics(): Promise<GrowthAnalyticsData> {
  const [allMocks, allMistakes, allSessions] = await Promise.all([
    getAllItems<MockTestAttempt>('mockTests'),
    getAllItems<MistakeEntry>('mistakes'),
    getAllItems<StudySession>('studySessions'),
  ]);

  const completedMocks = allMocks
    .filter((m) => m.status === 'Completed')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Score Trend & Accuracy Trend
  const scoreTrend = completedMocks.map((m) => ({
    date: new Date(m.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    title: m.title,
    score: m.score || 0,
    maxMarks: m.maxMarks || 100,
    percentage: m.percentage || 0,
    accuracy: m.accuracy || 0,
  }));

  const accuracyTrend = completedMocks.map((m) => ({
    date: new Date(m.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    accuracy: m.accuracy || 0,
    attemptRate: m.attemptRate || 0,
  }));

  // IT Modules breakdown aggregation
  const itModuleAgg: Record<string, { attempted: number; correct: number; incorrect: number }> = {};
  completedMocks.forEach((m) => {
    if (m.moduleSummaries) {
      Object.entries(m.moduleSummaries).forEach(([modName, summary]) => {
        if (!itModuleAgg[modName]) {
          itModuleAgg[modName] = { attempted: 0, correct: 0, incorrect: 0 };
        }
        itModuleAgg[modName].attempted += summary.attempted;
        itModuleAgg[modName].correct += summary.correct;
        itModuleAgg[modName].incorrect += summary.incorrect;
      });
    }
  });

  const itModuleBreakdown = Object.entries(itModuleAgg).map(([modName, s]) => ({
    module: modName,
    attempted: s.attempted,
    correct: s.correct,
    incorrect: s.incorrect,
    accuracy: s.attempted > 0 ? Math.round((s.correct / s.attempted) * 1000) / 10 : 0,
  }));

  // Difficulty stats
  const diffAgg: Record<Difficulty, { attempted: number; correct: number; incorrect: number }> = {
    Easy: { attempted: 0, correct: 0, incorrect: 0 },
    Medium: { attempted: 0, correct: 0, incorrect: 0 },
    Hard: { attempted: 0, correct: 0, incorrect: 0 },
  };

  completedMocks.forEach((m) => {
    if (m.difficultySummaries) {
      (['Easy', 'Medium', 'Hard'] as Difficulty[]).forEach((d) => {
        const item = m.difficultySummaries![d];
        if (item) {
          diffAgg[d].attempted += item.attempted;
          diffAgg[d].correct += item.correct;
          diffAgg[d].incorrect += item.incorrect;
        }
      });
    }
  });

  const difficultyStats = (['Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => ({
    difficulty: d,
    attempted: diffAgg[d].attempted,
    correct: diffAgg[d].correct,
    incorrect: diffAgg[d].incorrect,
    accuracy: diffAgg[d].attempted > 0 ? Math.round((diffAgg[d].correct / diffAgg[d].attempted) * 1000) / 10 : 0,
  }));

  // Mistake categories
  const mistakeCounts: Record<string, { total: number; resolved: number }> = {};
  allMistakes.forEach((m) => {
    if (!mistakeCounts[m.reason]) {
      mistakeCounts[m.reason] = { total: 0, resolved: 0 };
    }
    mistakeCounts[m.reason].total += 1;
    if (m.status === 'Resolved') {
      mistakeCounts[m.reason].resolved += 1;
    }
  });

  const mistakePatternCounts = Object.entries(mistakeCounts).map(([reason, stats]) => ({
    reason,
    count: stats.total,
    resolvedCount: stats.resolved,
  }));

  // Time management
  let totalQuestionsAcrossCompleted = 0;
  let totalTimeSecondsAcrossCompleted = 0;
  completedMocks.forEach((m) => {
    totalQuestionsAcrossCompleted += m.totalAttempted || 0;
    totalTimeSecondsAcrossCompleted += m.timeUsedSeconds || 0;
  });

  const avgTimePerQuestionSeconds =
    totalQuestionsAcrossCompleted > 0 ? Math.round(totalTimeSecondsAcrossCompleted / totalQuestionsAcrossCompleted) : 48;

  // Study sessions consistency
  const totalSessions = allSessions.length;
  let totalMinutes = 0;
  let deepMinutes = 0;
  allSessions.forEach((s) => {
    totalMinutes += s.durationMinutes || 0;
    if (s.isFocused) deepMinutes += s.durationMinutes || 0;
  });

  // Calculate streak based on dates
  const uniqueDates = new Set(allSessions.map((s) => s.date));
  const streakDays = uniqueDates.size > 0 ? uniqueDates.size : 1;

  const totalScorePct = completedMocks.reduce((acc, m) => acc + (m.percentage || 0), 0);
  const totalAcc = completedMocks.reduce((acc, m) => acc + (m.accuracy || 0), 0);

  return {
    totalMocksCompleted: completedMocks.length,
    avgScorePercentage: completedMocks.length > 0 ? Math.round((totalScorePct / completedMocks.length) * 10) / 10 : 0,
    avgAccuracy: completedMocks.length > 0 ? Math.round((totalAcc / completedMocks.length) * 10) / 10 : 0,
    scoreTrend,
    accuracyTrend,
    itModuleBreakdown,
    difficultyStats,
    mistakePatternCounts,
    timeManagement: {
      avgTimePerQuestionSeconds,
      totalTimeSpentMinutes: Math.round(totalTimeSecondsAcrossCompleted / 60),
    },
    subjectScoreAverages: [],
    studyConsistency: {
      totalSessions,
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
      deepFocusHours: Math.round((deepMinutes / 60) * 10) / 10,
      streakDays,
    },
  };
}
