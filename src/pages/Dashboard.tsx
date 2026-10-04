// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import {
  getAllItems,
  getActiveMockDraft,
} from '../services/db';
import {
  MockTestAttempt,
  DailyChecklistItem,
  StudySession,
  PrepGoal,
  MistakeEntry,
} from '../types';
import {
  PlayCircle,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Target,
  Sparkles,
  ArrowRight,
  BookOpen,
  CalendarCheck,
  Zap,
  Compass,
} from 'lucide-react';
import { getOverallSyllabusMetrics } from '../services/syllabusEngine';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [checklist, setChecklist] = useState<DailyChecklistItem[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [mocks, setMocks] = useState<MockTestAttempt[]>([]);
  const [mistakes, setMistakes] = useState<MistakeEntry[]>([]);
  const [goals, setGoals] = useState<PrepGoal[]>([]);
  const [activeDraft, setActiveDraft] = useState<MockTestAttempt | null>(null);
  const [syllabusMetrics, setSyllabusMetrics] = useState<{
    overallCompletionPct: number;
    overallMasteryPct: number;
    currentPhase: { name: string; phaseNumber: number; timeline: string };
    masteredConcepts: number;
    totalConcepts: number;
  } | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const [chk, sess, mks, mst, gls, syl] = await Promise.all([
      getAllItems<DailyChecklistItem>('checklist'),
      getAllItems<StudySession>('studySessions'),
      getAllItems<MockTestAttempt>('mockTests'),
      getAllItems<MistakeEntry>('mistakes'),
      getAllItems<PrepGoal>('goals'),
      getOverallSyllabusMetrics().catch(() => null),
    ]);
    setChecklist(chk);
    setSessions(sess);
    setMocks(mks.filter((m) => m.status === 'Completed'));
    setMistakes(mst);
    setGoals(gls);
    setActiveDraft(getActiveMockDraft());
    if (syl) {
      setSyllabusMetrics(syl);
    }
  };

  // Today calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = checklist.filter((c) => !c.date || c.date === todayStr);
  const completedTasks = todayTasks.filter((c) => c.completed);
  const todayCompletionPct = todayTasks.length > 0 ? Math.round((completedTasks.length / todayTasks.length) * 100) : 0;

  const todaySessions = sessions.filter((s) => s.date === todayStr);
  const actualStudyMinutes = todaySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const actualStudyHours = Math.round((actualStudyMinutes / 60) * 10) / 10;
  const plannedStudyHours = 3.0;

  // Practice stats from today's completed mocks / practice
  const todayMocks = mocks.filter((m) => m.date && m.date.startsWith(todayStr));
  const todayQuestionsAttempted = todayMocks.reduce((acc, m) => acc + (m.totalAttempted || 0), 0);
  const todayQuestionsCorrect = todayMocks.reduce((acc, m) => acc + (m.totalCorrect || 0), 0);
  const todayAccuracy = todayQuestionsAttempted > 0 ? Math.round((todayQuestionsCorrect / todayQuestionsAttempted) * 100) : 0;
  const dailyQuestionTarget = 50;

  // This Week calculations
  const totalWeeklyMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const totalWeeklyHours = Math.round((totalWeeklyMinutes / 60) * 10) / 10;
  const avgDailyHours = Math.round((totalWeeklyHours / 7) * 10) / 10;
  const weeklyMocksQuestions = mocks.reduce((acc, m) => acc + (m.totalAttempted || 0), 0);
  const weeklyMocksCorrect = mocks.reduce((acc, m) => acc + (m.totalCorrect || 0), 0);
  const weeklyAccuracy = weeklyMocksQuestions > 0 ? Math.round((weeklyMocksCorrect / weeklyMocksQuestions) * 100) : 78;

  // Latest completed Mock
  const latestMock = mocks.length > 0 ? mocks[mocks.length - 1] : null;
  const itSectionScore = latestMock?.sectionSummaries?.find((s) => s.subject === 'IT');

  const isSunday = new Date().getDay() === 0;

  return (
    <div className="space-y-6 pb-12">
      <Header
        title="Dashboard"
        subtitle="Track your daily discipline, syllabus mastery, practice accuracy, and Sunday mock workflows."
        showExamConfigWarning={true}
      />

      {/* Active in-progress test banner */}
      {activeDraft && (
        <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <div>
              <div className="font-bold text-amber-900 text-sm">
                Unfinished Test in Progress: "{activeDraft.title}"
              </div>
              <div className="text-xs text-amber-700">
                Started on {new Date(activeDraft.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Progress safely saved locally
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/mock-tests')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow"
          >
            Resume Test &rarr;
          </button>
        </div>
      )}

      {/* Sunday Primary Workflow Banner */}
      {isSunday && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-300" />
              <span className="font-black text-lg">Sunday Full Mock Day</span>
            </div>
            <p className="text-xs text-emerald-100 max-w-xl">
              Recommended loop: Start Full Mock &rarr; Complete Timed Test &rarr; Review Mistakes &rarr; Add Revisions &rarr; Complete Weekly Analysis.
            </p>
          </div>
          <NavLink
            to="/sunday-review"
            className="px-5 py-2.5 bg-white text-emerald-800 font-bold text-xs rounded-xl shadow hover:bg-emerald-50 transition-colors whitespace-nowrap"
          >
            Open Sunday Workflow &rarr;
          </NavLink>
        </div>
      )}

      {/* Adaptive Syllabus Engine & August 2027 Roadmap Widget */}
      {syllabusMetrics && (
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 shadow-md border border-indigo-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                Aug 2027 Target
              </span>
              <span className="text-xs font-semibold text-slate-300">
                Phase {syllabusMetrics.currentPhase.phaseNumber}: {syllabusMetrics.currentPhase.name} ({syllabusMetrics.currentPhase.timeline})
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center space-x-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              <span>Adaptive Syllabus Engine • 15 Subjects</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Dynamically prioritized checklist based on prerequisite dependencies, cognitive error tags, and spaced repetition schedules.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/60 p-3.5 rounded-xl border border-indigo-500/20">
            <div className="text-center px-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Mastery</div>
              <div className="text-xl font-black text-indigo-400">{syllabusMetrics.overallMasteryPct}%</div>
            </div>
            <div className="w-[1px] h-8 bg-slate-800"></div>
            <div className="text-center px-2">
              <div className="text-[10px] uppercase font-bold text-slate-400">Coverage</div>
              <div className="text-xl font-black text-emerald-400">{syllabusMetrics.overallCompletionPct}%</div>
            </div>
            <div className="w-[1px] h-8 bg-slate-800"></div>
            <NavLink
              to="/syllabus"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-colors whitespace-nowrap flex items-center space-x-1.5"
            >
              <span>Explore Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>
        </div>
      )}

      {/* TODAY'S PERFORMANCE ROW */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center space-x-2">
          <span className="w-2 h-4 bg-indigo-600 rounded-full"></span>
          <span>Today</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Checklist %</div>
            <div className="text-2xl font-black text-indigo-600 mt-1">{todayCompletionPct}%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{completedTasks.length}/{todayTasks.length} tasks done</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Study Hours</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{actualStudyHours}h</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Target: {plannedStudyHours}h</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Questions</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{todayQuestionsAttempted}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Target: {dailyQuestionTarget} Qs</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Accuracy</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{todayAccuracy > 0 ? `${todayAccuracy}%` : '—'}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Today's mocks/quiz</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Tasks Remaining</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{todayTasks.length - completedTasks.length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Daily checklist</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Open Mistakes</div>
            <div className="text-2xl font-black text-rose-600 mt-1">{mistakes.filter((m) => m.status === 'Open').length}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Mistake notebook</div>
          </div>
        </div>
      </div>

      {/* TODAY'S PRACTICE CARD + LATEST MOCK PERFORMANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Practice Card (Requirement #11) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-sm">Today's Practice</h3>
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              Daily Target
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Progress toward target</span>
              <span className="font-bold text-slate-900">{todayQuestionsAttempted} / {dailyQuestionTarget} Qs</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (todayQuestionsAttempted / dailyQuestionTarget) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
            <div className="p-2 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Planned</div>
              <div className="text-sm font-black text-slate-800">{dailyQuestionTarget}</div>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Done</div>
              <div className="text-sm font-black text-emerald-600">{todayQuestionsAttempted}</div>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Remaining</div>
              <div className="text-sm font-black text-amber-600">{Math.max(0, dailyQuestionTarget - todayQuestionsAttempted)}</div>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => navigate('/practice')}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1 shadow-sm transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Quick Practice</span>
            </button>
            <button
              onClick={() => navigate('/practice')}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center transition-colors"
            >
              IT Quiz
            </button>
          </div>
        </div>

        {/* Latest Mock Performance Card */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Latest Mock Performance</h3>
            </div>
            <NavLink to="/mock-tests" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center">
              View All Mocks &rarr;
            </NavLink>
          </div>

          {latestMock ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{latestMock.title}</div>
                  <div className="text-xs text-slate-500">
                    {new Date(latestMock.date).toLocaleDateString()} • {latestMock.testType}
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-right">
                  <div>
                    <div className="text-lg font-black text-indigo-600">
                      {latestMock.score} <span className="text-xs text-slate-500">/ {latestMock.maxMarks}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500">{latestMock.percentage}% Score</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Accuracy</div>
                  <div className="text-base font-black text-emerald-600">{latestMock.accuracy}%</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Attempt Rate</div>
                  <div className="text-base font-black text-slate-800">{latestMock.attemptRate}%</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Time Used</div>
                  <div className="text-base font-black text-slate-800">
                    {Math.round(latestMock.timeUsedSeconds / 60)} min
                  </div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">IT Score</div>
                  <div className="text-base font-black text-indigo-600">
                    {itSectionScore ? `${itSectionScore.marksObtained}/${itSectionScore.maxMarks}` : 'N/A'}
                  </div>
                </div>
              </div>

              {latestMock.sectionSummaries && latestMock.sectionSummaries.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Section Scores</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {latestMock.sectionSummaries.map((sec, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-slate-800 truncate max-w-[120px]">{sec.sectionName}</div>
                          <div className="text-[11px] text-slate-500">{sec.correct}C • {sec.incorrect}W</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-slate-900">{sec.marksObtained} M</div>
                          <div className="text-[10px] text-emerald-600 font-semibold">{sec.accuracy}% Acc</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <FileText className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-medium">No full mock tests completed yet.</p>
              <button
                onClick={() => navigate('/mock-tests')}
                className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                Generate First Mock Test &rarr;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* THIS WEEK OVERVIEW & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* This Week Card */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <span className="w-2 h-4 bg-emerald-500 rounded-full"></span>
            <span>This Week Summary</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-xs font-semibold text-slate-500">Total Study</div>
              <div className="text-xl font-black text-slate-900 mt-1">{totalWeeklyHours}h</div>
              <div className="text-[11px] text-slate-400">Avg {avgDailyHours}h / day</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-xs font-semibold text-slate-500">Practice Qs</div>
              <div className="text-xl font-black text-slate-900 mt-1">{weeklyMocksQuestions}</div>
              <div className="text-[11px] text-slate-400">Accuracy: {weeklyAccuracy}%</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-xs font-semibold text-slate-500">Current Streak</div>
              <div className="text-xl font-black text-amber-600 mt-1">4 Days</div>
              <div className="text-[11px] text-slate-400">Discipline unbroken</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-xs font-semibold text-slate-500">Resolved Mistakes</div>
              <div className="text-xl font-black text-emerald-600 mt-1">
                {mistakes.filter((m) => m.status === 'Resolved').length} / {mistakes.length}
              </div>
              <div className="text-[11px] text-slate-400">Mistake notebook</div>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
              <span>Target Milestones</span>
              <NavLink to="/goals" className="text-indigo-600 hover:underline">View All Goals</NavLink>
            </div>
            <div className="space-y-2">
              {goals.slice(0, 2).map((g) => (
                <div key={g.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800">{g.title}</span>
                    <span className="font-bold text-indigo-600">{g.currentValue} / {g.targetValue} {g.unit}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full"
                      style={{ width: `${Math.min(100, (g.currentValue / g.targetValue) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Card (Requirement #5) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Quick Actions</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            <button
              onClick={() => navigate('/practice')}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-left flex items-center justify-between text-xs font-semibold text-slate-800 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <PlayCircle className="w-4 h-4 text-indigo-600" />
                <span>Start Quick Practice</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => navigate('/practice')}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-left flex items-center justify-between text-xs font-semibold text-slate-800 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>Start IT Quiz (10-Min)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => navigate('/mock-tests')}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-left flex items-center justify-between text-xs font-semibold text-slate-800 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Start Full Mock Test</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => navigate('/study-log')}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 text-left flex items-center justify-between text-xs font-semibold text-slate-800 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Add Study Session</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => navigate('/mistake-notebook')}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-300 text-left flex items-center justify-between text-xs font-semibold text-slate-800 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Mistake Notebook</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => navigate('/sunday-review')}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left flex items-center justify-between text-xs font-semibold text-slate-800 transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
                <span>Sunday Review</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
