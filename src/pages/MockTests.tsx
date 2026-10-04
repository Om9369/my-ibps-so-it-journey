// src/pages/MockTests.tsx
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { questionProvider } from '../services/questionProvider';
import { mockProvider, generateTest, calculateMockResults } from '../services/mockProvider';
import {
  getActiveMockDraft,
  saveActiveMockDraft,
  clearActiveMockDraft,
  getAllItems,
  putItem,
} from '../services/db';
import {
  MockTestAttempt,
  ExamConfig,
  Question,
  Difficulty,
  RevisionItem,
  Subject,
  ITModule,
} from '../types';
import { LogMistakeModal } from '../components/LogMistakeModal';
import {
  FileText,
  Clock,
  PlayCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Bookmark,
  Repeat,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const MockTests: React.FC = () => {
  // Screen: 'Hub' | 'Runner' | 'Results' | 'Analysis'
  const [screen, setScreen] = useState<'Hub' | 'Runner' | 'Results' | 'Analysis'>('Hub');
  const [configs, setConfigs] = useState<ExamConfig[]>([]);
  const [history, setHistory] = useState<MockTestAttempt[]>([]);
  const [activeTest, setActiveTest] = useState<MockTestAttempt | null>(null);

  // Runner state
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(2700); // 45 min default
  const [showLowTimeWarning, setShowLowTimeWarning] = useState<boolean>(false);

  // Custom Generator Form
  const [customTitle, setCustomTitle] = useState('Custom IBPS SO Sectional Mock');
  const [customSubject, setCustomSubject] = useState<Subject>('IT');
  const [customQuestionCount, setCustomQuestionCount] = useState<number>(30);
  const [customTimeMinutes, setCustomTimeMinutes] = useState<number>(30);
  const [customDifficulty, setCustomDifficulty] = useState<Difficulty | 'Mixed'>('Mixed');

  // Question Analysis & Mistake state
  const [mistakeModalQuestion, setMistakeModalQuestion] = useState<{ question: Question; myAnswerText: string } | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
    // Check for draft in progress
    const draft = getActiveMockDraft();
    if (draft && draft.status === 'In Progress') {
      setActiveTest(draft);
      const used = draft.timeUsedSeconds || 0;
      const totalSec = (draft.timeLimitMinutes || 45) * 60;
      setRemainingSeconds(Math.max(0, totalSec - used));
      setScreen('Runner');
    }
  }, []);

  const loadData = async () => {
    const [cfgList, pastList] = await Promise.all([
      getAllItems<ExamConfig>('examConfigs'),
      mockProvider.getHistory(),
    ]);
    setConfigs(cfgList);
    setHistory(pastList.filter((m) => m.status === 'Completed'));
  };

  // Timer Tick
  useEffect(() => {
    let timer: any = null;
    if (screen === 'Runner' && activeTest) {
      timer = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmitTest();
            return 0;
          }
          if (prev === 300) {
            setShowLowTimeWarning(true);
          }
          // Increment timeUsed in test draft
          if (activeTest) {
            activeTest.timeUsedSeconds = (activeTest.timeUsedSeconds || 0) + 1;
            saveActiveMockDraft(activeTest);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [screen, activeTest]);

  // Launch Full Mock using ExamConfig
  const handleLaunchConfigMock = async (config: ExamConfig) => {
    const test = await generateTest({
      title: config.name,
      testType: 'Full Mock',
      config,
      timeLimitMinutes: config.totalTimeMinutes,
      randomize: true,
    });

    setActiveTest(test);
    setCurrentIdx(0);
    setRemainingSeconds(config.totalTimeMinutes * 60);
    setShowLowTimeWarning(false);
    setScreen('Runner');
  };

  // Launch Sectional Mock
  const handleLaunchSectionalMock = async (subject: Subject, count: number, mins: number) => {
    const test = await generateTest({
      title: `${subject} Sectional Mock Test`,
      testType: 'Sectional',
      subject,
      questionCount: count,
      timeLimitMinutes: mins,
      randomize: true,
    });

    setActiveTest(test);
    setCurrentIdx(0);
    setRemainingSeconds(mins * 60);
    setShowLowTimeWarning(false);
    setScreen('Runner');
  };

  // Launch Custom Mock
  const handleLaunchCustomMock = async (e: React.FormEvent) => {
    e.preventDefault();
    const test = await generateTest({
      title: customTitle,
      testType: 'Custom Practice',
      subject: customSubject,
      difficulty: customDifficulty,
      questionCount: customQuestionCount,
      timeLimitMinutes: customTimeMinutes,
      randomize: true,
    });

    setActiveTest(test);
    setCurrentIdx(0);
    setRemainingSeconds(customTimeMinutes * 60);
    setShowLowTimeWarning(false);
    setScreen('Runner');
  };

  // Answer Option Selection
  const handleSelectAnswer = (optionIdx: number) => {
    if (!activeTest) return;
    const q = activeTest.questions[currentIdx];
    const prev = activeTest.attempts[q.id] || {
      questionId: q.id,
      isMarkedForReview: false,
      timeSpentSeconds: 0,
    };

    activeTest.attempts[q.id] = {
      ...prev,
      selectedOptionIndex: optionIdx,
    };

    saveActiveMockDraft(activeTest);
    setActiveTest({ ...activeTest });
  };

  // Clear Response
  const handleClearResponse = () => {
    if (!activeTest) return;
    const q = activeTest.questions[currentIdx];
    if (activeTest.attempts[q.id]) {
      delete activeTest.attempts[q.id].selectedOptionIndex;
      saveActiveMockDraft(activeTest);
      setActiveTest({ ...activeTest });
    }
  };

  // Toggle Mark for Review
  const handleToggleReview = () => {
    if (!activeTest) return;
    const q = activeTest.questions[currentIdx];
    const prev = activeTest.attempts[q.id] || {
      questionId: q.id,
      timeSpentSeconds: 0,
    };

    activeTest.attempts[q.id] = {
      ...prev,
      isMarkedForReview: !prev.isMarkedForReview,
    };

    saveActiveMockDraft(activeTest);
    setActiveTest({ ...activeTest });
  };

  // Submit test (User or Auto)
  const handleAutoSubmitTest = async () => {
    if (!activeTest) return;
    const totalSec = (activeTest.timeLimitMinutes || 45) * 60;
    activeTest.timeUsedSeconds = Math.max(1, totalSec - remainingSeconds);

    const cfg = configs.find((c) => c.id === activeTest.configId);
    const evaluated = calculateMockResults(activeTest, cfg);
    await mockProvider.saveMockAttempt(evaluated);

    // Sync question performance to Syllabus Engine
    try {
      const { getFlatConcepts, recordConceptAttempt } = await import('../services/syllabusEngine');
      const concepts = Array.from(getFlatConcepts().values());
      for (const q of evaluated.questions) {
        const attempt = evaluated.attempts[q.id];
        if (attempt && attempt.selectedOptionIndex !== undefined) {
          const isCorrect = attempt.isCorrect || false;
          const matched = concepts.find(
            (c) =>
              c.title.toLowerCase() === q.topic.toLowerCase() ||
              q.topic.toLowerCase().includes(c.title.toLowerCase()) ||
              c.title.toLowerCase().includes(q.topic.toLowerCase())
          );
          if (matched) {
            await recordConceptAttempt(matched.id, isCorrect, q.difficulty);
          }
        }
      }
    } catch (e) {
      console.warn('Error recording mock syllabus attempts:', e);
    }

    setActiveTest(evaluated);
    clearActiveMockDraft();
    setScreen('Results');
    loadData();
  };

  // Bookmark question helper
  const handleBookmarkToggle = async (q: Question) => {
    const updated = { ...q, isBookmarked: !q.isBookmarked };
    await questionProvider.updateQuestion(updated);
    const nextSet = new Set(bookmarkedIds);
    if (updated.isBookmarked) nextSet.add(q.id);
    else nextSet.delete(q.id);
    setBookmarkedIds(nextSet);
  };

  // Add to Revision helper
  const handleAddToRevision = async (q: Question) => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 2); // 2 days spaced interval
    const rev: RevisionItem = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      subject: q.subject,
      itModule: q.itModule,
      topic: q.topic,
      title: `Revise concept: ${q.topic} (${q.subject})`,
      keyPoints: q.explanation,
      addedDate: new Date().toISOString(),
      dueDate: dueDate.toISOString().split('T')[0],
      intervalDays: 2,
      repetitionCount: 0,
      status: 'Pending',
    };
    await putItem('revisions', rev);
    alert(`Added "${q.topic}" to your Revision Tracker due on ${rev.dueDate}!`);
  };

  // Formatting timer
  const timerMins = Math.floor(remainingSeconds / 60);
  const timerSecs = remainingSeconds % 60;
  const timerDisplay = `${String(timerMins).padStart(2, '0')}:${String(timerSecs).padStart(2, '0')}`;

  const currentQ = activeTest?.questions[currentIdx];
  const currentAttempt = currentQ && activeTest ? activeTest.attempts[currentQ.id] : undefined;

  return (
    <div className="space-y-6 pb-12">
      <Header
        title="Mock Test Engine & Exam Simulator"
        subtitle="Full-length IBPS SO IT Officer mocks, sectionals, real countdown timer, question palette, and module-wise analytics."
        showExamConfigWarning={true}
      />

      {/* Mistake Logger Modal */}
      {mistakeModalQuestion && (
        <LogMistakeModal
          isOpen={Boolean(mistakeModalQuestion)}
          onClose={() => setMistakeModalQuestion(null)}
          question={mistakeModalQuestion.question}
          myAnswerText={mistakeModalQuestion.myAnswerText}
          sourceContext={activeTest?.title || 'Mock Test'}
        />
      )}

      {/* Low Time Alert */}
      {showLowTimeWarning && screen === 'Runner' && (
        <div className="bg-rose-500 text-white px-4 py-3 rounded-2xl flex items-center justify-between shadow-lg animate-pulse">
          <div className="flex items-center space-x-2 text-xs font-bold">
            <AlertTriangle className="w-5 h-5 text-white" />
            <span>Time Warning: Less than 5 minutes remaining! Review your marked answers.</span>
          </div>
          <button
            onClick={() => setShowLowTimeWarning(false)}
            className="text-xs bg-white text-rose-800 px-3 py-1 rounded-lg font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* SCREEN 1: MOCK HUB & GENERATOR */}
      {screen === 'Hub' && (
        <div className="space-y-6">
          {/* Official Verification Banner as strictly required */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-800">
                Official Recruitment Cycle Notice:
              </p>
              <p className="text-amber-700 mt-0.5">
                "Verify this configuration against the official IBPS notification for your recruitment cycle."
                Exam patterns (number of questions, marks per question, and negative marking) are fully configurable in Settings.
              </p>
            </div>
          </div>

          {/* Quick Mock Presets Cards */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center space-x-2">
              <span className="w-2 h-4 bg-indigo-600 rounded-full"></span>
              <span>Available Exam Patterns</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {configs.map((cfg) => (
                <div
                  key={cfg.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-all space-y-4"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {cfg.sections.length} Section{cfg.sections.length > 1 ? 's' : ''}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{cfg.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{cfg.description}</p>

                    <div className="pt-2 text-xs space-y-1 text-slate-600">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <strong className="text-slate-800">{cfg.totalTimeMinutes} Minutes</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Questions:</span>
                        <strong className="text-slate-800">
                          {cfg.sections.reduce((acc, s) => acc + s.questionCount, 0)} Qs
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Negative Marking:</span>
                        <strong className="text-rose-600">
                          {cfg.negativeMarkingEnabled ? 'Enabled (-0.25)' : 'Disabled'}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLaunchConfigMock(cfg)}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Start Test</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTIONAL MOCKS (Requirement #1) */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center space-x-2">
              <span className="w-2 h-4 bg-emerald-500 rounded-full"></span>
              <span>Sectional Mock Tests</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="font-bold text-slate-900 text-sm">Professional Knowledge (IT)</div>
                <div className="text-xs text-slate-500">60 Questions • 45 Mins</div>
                <button
                  onClick={() => handleLaunchSectionalMock('IT', 60, 45)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                >
                  Start IT Sectional
                </button>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="font-bold text-slate-900 text-sm">Reasoning Ability</div>
                <div className="text-xs text-slate-500">50 Questions • 40 Mins</div>
                <button
                  onClick={() => handleLaunchSectionalMock('Reasoning', 50, 40)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                >
                  Start Reasoning
                </button>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="font-bold text-slate-900 text-sm">English Language</div>
                <div className="text-xs text-slate-500">50 Questions • 40 Mins</div>
                <button
                  onClick={() => handleLaunchSectionalMock('English', 50, 40)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                >
                  Start English
                </button>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="font-bold text-slate-900 text-sm">Quantitative Aptitude</div>
                <div className="text-xs text-slate-500">50 Questions • 40 Mins</div>
                <button
                  onClick={() => handleLaunchSectionalMock('Quant', 50, 40)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                >
                  Start Quant
                </button>
              </div>
            </div>
          </div>

          {/* CUSTOM TEST GENERATOR (Requirement #1) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 max-w-2xl">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Generate Custom Practice Test</h3>
              <p className="text-xs text-slate-500">
                Choose subject, question volume, time limit, and difficulty.
              </p>
            </div>

            <form onSubmit={handleLaunchCustomMock} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Test Title</label>
                  <input
                    type="text"
                    required
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="IT">Professional Knowledge (IT)</option>
                    <option value="Reasoning">Reasoning</option>
                    <option value="English">English</option>
                    <option value="Quant">Quantitative Aptitude</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Questions</label>
                  <input
                    type="number"
                    min={5}
                    max={100}
                    value={customQuestionCount}
                    onChange={(e) => setCustomQuestionCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time (Minutes)</label>
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={customTimeMinutes}
                    onChange={(e) => setCustomTimeMinutes(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={customDifficulty}
                    onChange={(e) => setCustomDifficulty(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Mixed">Mixed</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                Generate & Start Custom Test
              </button>
            </form>
          </div>

          {/* PAST MOCK HISTORY TABLE (Requirement #16) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm">Completed Mock History</h3>
              <span className="text-xs text-slate-500 font-semibold">{history.length} attempts</span>
            </div>

            {history.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No mock test attempts recorded yet. Launch one of the tests above!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/60 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Test Title</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4 text-right">Score</th>
                      <th className="py-3 px-4 text-right">Accuracy</th>
                      <th className="py-3 px-4 text-right">Attempt Rate</th>
                      <th className="py-3 px-4 text-right">Time Used</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {new Date(m.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">{m.title}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                            {m.testType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-black text-indigo-600">
                          {m.score} / {m.maxMarks} ({m.percentage}%)
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-600">{m.accuracy}%</td>
                        <td className="py-3 px-4 text-right font-semibold text-slate-700">{m.attemptRate}%</td>
                        <td className="py-3 px-4 text-right text-slate-600">
                          {Math.round(m.timeUsedSeconds / 60)} min
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              setActiveTest(m);
                              setScreen('Results');
                            }}
                            className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-bold rounded-lg transition-colors"
                          >
                            View Result
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SCREEN 2: FULL MOCK TEST RUNNER (Requirement #5) */}
      {screen === 'Runner' && activeTest && currentQ && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question & Option Workspace */}
          <div className="lg:col-span-3 space-y-4">
            {/* Top Info Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                  {activeTest.title}
                </span>
                <h3 className="font-black text-slate-900 text-base">
                  Question {currentIdx + 1} of {activeTest.questions.length}
                </h3>
              </div>

              {/* Countdown Timer */}
              <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl border font-mono font-black text-sm ${
                  remainingSeconds < 300
                    ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Time Left: {timerDisplay}</span>
              </div>
            </div>

            {/* Question Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                    {currentQ.subject}
                  </span>
                  {currentQ.itModule && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                      {currentQ.itModule}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                    {currentQ.topic}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                    Marks: +1.00 / -0.25
                  </span>
                </div>

                <div className="text-base font-bold text-slate-900 leading-snug">
                  {currentQ.question}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = currentAttempt?.selectedOptionIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectAnswer(idx)}
                      className={`w-full text-left p-4 rounded-xl border text-xs md:text-sm transition-all flex items-center space-x-3 ${
                        isSelected
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white border border-slate-300 text-slate-700'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Footer Controls: Mark for review, clear, prev, next */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-100 text-xs">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleToggleReview}
                    className={`px-3.5 py-2 rounded-xl font-bold border transition-colors ${
                      currentAttempt?.isMarkedForReview
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                    }`}
                  >
                    {currentAttempt?.isMarkedForReview ? 'Marked for Review ✓' : 'Mark for Review'}
                  </button>

                  <button
                    onClick={handleClearResponse}
                    disabled={currentAttempt?.selectedOptionIndex === undefined}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl disabled:opacity-40"
                  >
                    Clear Response
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    disabled={currentIdx === 0}
                    onClick={() => setCurrentIdx(currentIdx - 1)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl disabled:opacity-40"
                  >
                    &larr; Previous
                  </button>

                  {currentIdx < activeTest.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIdx(currentIdx + 1)}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow"
                    >
                      Save & Next &rarr;
                    </button>
                  ) : (
                    <button
                      onClick={handleAutoSubmitTest}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow"
                    >
                      Submit Test
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Question Palette Sidebar (Requirement #5) */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Question Palette
                </h4>
                <span className="text-[11px] text-slate-500 font-semibold">
                  {Object.values(activeTest.attempts).filter((a) => a.selectedOptionIndex !== undefined).length} /{' '}
                  {activeTest.questions.length} Attempted
                </span>
              </div>

              {/* Palette Legend */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-emerald-500"></span>
                  <span>Attempted</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-slate-200"></span>
                  <span>Unattempted</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-purple-500"></span>
                  <span>Marked Review</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-indigo-600"></span>
                  <span>Ans & Review</span>
                </div>
              </div>

              {/* Grid of question buttons */}
              <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto p-1 custom-scrollbar">
                {activeTest.questions.map((q, idx) => {
                  const att = activeTest.attempts[q.id];
                  const hasAnswer = att?.selectedOptionIndex !== undefined;
                  const isMarked = att?.isMarkedForReview;
                  const isCurrent = idx === currentIdx;

                  let colorClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
                  if (hasAnswer && isMarked) {
                    colorClass = 'bg-indigo-600 text-white font-bold';
                  } else if (hasAnswer) {
                    colorClass = 'bg-emerald-500 text-white font-bold';
                  } else if (isMarked) {
                    colorClass = 'bg-purple-500 text-white font-bold';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${colorClass} ${
                        isCurrent ? 'ring-2 ring-amber-400 ring-offset-2' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Submit Test Button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={handleAutoSubmitTest}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
                >
                  Submit Mock Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 3: MOCK TEST RESULTS (Requirement #7) */}
      {screen === 'Results' && activeTest && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Test Submitted Successfully
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">{activeTest.title}</h2>
              <div className="text-xs text-slate-500">{new Date(activeTest.date).toLocaleString()}</div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setScreen('Analysis')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                Question-by-Question Analysis &rarr;
              </button>
              <button
                onClick={() => setScreen('Hub')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
              >
                Return to Hub
              </button>
            </div>
          </div>

          {/* OVERALL SCORECARD */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Total Score</div>
              <div className="text-2xl font-black text-indigo-600 mt-1">
                {activeTest.score} <span className="text-xs text-slate-400">/ {activeTest.maxMarks}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">{activeTest.percentage}% Marks</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Accuracy</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">{activeTest.accuracy}%</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Precision rate</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Attempt Rate</div>
              <div className="text-2xl font-black text-slate-800 mt-1">{activeTest.attemptRate}%</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {activeTest.totalAttempted}/{activeTest.totalQuestions} Qs
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Correct / Wrong</div>
              <div className="text-2xl font-black text-slate-800 mt-1">
                <span className="text-emerald-600">{activeTest.totalCorrect}</span> :{' '}
                <span className="text-rose-600">{activeTest.totalIncorrect}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">{activeTest.totalUnattempted} Skipped</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Time Used</div>
              <div className="text-2xl font-black text-slate-800 mt-1">
                {Math.round(activeTest.timeUsedSeconds / 60)} min
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Limit: {activeTest.timeLimitMinutes} min
              </div>
            </div>
          </div>

          {/* SECTION-WISE PERFORMANCE */}
          {activeTest.sectionSummaries && activeTest.sectionSummaries.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-slate-900 text-sm">Section-Wise Performance Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/60 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Section</th>
                      <th className="py-2.5 px-3 text-right">Total Qs</th>
                      <th className="py-2.5 px-3 text-right">Attempted</th>
                      <th className="py-2.5 px-3 text-right">Correct</th>
                      <th className="py-2.5 px-3 text-right">Incorrect</th>
                      <th className="py-2.5 px-3 text-right">Accuracy</th>
                      <th className="py-2.5 px-3 text-right">Marks Obtained</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeTest.sectionSummaries.map((sec, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{sec.sectionName}</td>
                        <td className="py-2.5 px-3 text-right font-medium text-slate-600">{sec.totalQuestions}</td>
                        <td className="py-2.5 px-3 text-right font-semibold text-slate-800">{sec.attempted}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-600">{sec.correct}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-rose-600">{sec.incorrect}</td>
                        <td className="py-2.5 px-3 text-right font-black text-indigo-600">{sec.accuracy}%</td>
                        <td className="py-2.5 px-3 text-right font-black text-slate-900">
                          {sec.marksObtained} / {sec.maxMarks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* IT MODULE-WISE BREAKDOWN (Requirement #7 Example: DBMS, Networks) */}
          {activeTest.moduleSummaries && Object.keys(activeTest.moduleSummaries).length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-slate-900 text-sm">Professional Knowledge: IT Module Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {Object.entries(activeTest.moduleSummaries).map(([modName, mod]) => (
                  <div key={modName} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="font-bold text-slate-900">{modName}</div>
                    <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-500">
                      <div>Attempted: <strong className="text-slate-800">{mod.attempted}</strong></div>
                      <div>Correct: <strong className="text-emerald-600">{mod.correct}</strong></div>
                      <div>Incorrect: <strong className="text-rose-600">{mod.incorrect}</strong></div>
                      <div>Accuracy: <strong className="text-indigo-600">{mod.accuracy}%</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SCREEN 4: QUESTION-BY-QUESTION ANALYSIS (Requirement #8 & #9) */}
      {screen === 'Analysis' && activeTest && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                Detailed Solutions & Mistake Tagging
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">Review: {activeTest.title}</h2>
            </div>
            <button
              onClick={() => setScreen('Results')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
            >
              &larr; Back to Results
            </button>
          </div>

          <div className="space-y-4">
            {activeTest.questions.map((q, idx) => {
              const attempt = activeTest.attempts[q.id];
              const isAttempted = attempt && attempt.selectedOptionIndex !== undefined;
              const isCorrect = isAttempted && attempt.selectedOptionIndex === q.correctAnswer;
              const userAnsText = isAttempted ? q.options[attempt.selectedOptionIndex!] : 'Unattempted';
              const correctAnsText = q.options[q.correctAnswer];
              const isBookmarked = bookmarkedIds.has(q.id) || q.isBookmarked;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border text-xs space-y-3 ${
                    !isAttempted
                      ? 'bg-slate-50 border-slate-200'
                      : isCorrect
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900">Question {idx + 1}</span>
                      <span className="px-2 py-0.5 rounded bg-white text-slate-700 font-semibold border border-slate-200">
                        {q.subject}
                      </span>
                      {q.itModule && (
                        <span className="px-2 py-0.5 rounded bg-white text-slate-700 font-semibold border border-slate-200">
                          {q.itModule}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-white text-slate-600 font-medium">
                        {q.topic}
                      </span>
                      <span className="px-2 py-0.5 rounded font-bold bg-white text-indigo-700 border border-slate-200">
                        {q.difficulty}
                      </span>
                      {attempt?.isMarkedForReview && (
                        <span className="px-2 py-0.5 rounded font-bold bg-purple-100 text-purple-700 border border-purple-200">
                          Marked for Review
                        </span>
                      )}
                    </div>

                    {/* Actions: Add to Mistake, Add to Revision, Bookmark, Retry */}
                    <div className="flex items-center space-x-1.5 self-end sm:self-auto">
                      {!isCorrect && (
                        <button
                          onClick={() =>
                            setMistakeModalQuestion({
                              question: q,
                              myAnswerText: userAnsText,
                            })
                          }
                          className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-700 font-bold text-[11px] rounded-lg border border-rose-300 shadow-sm"
                        >
                          Add to Mistake Notebook
                        </button>
                      )}

                      <button
                        onClick={() => handleAddToRevision(q)}
                        className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-indigo-700 font-bold text-[11px] rounded-lg border border-slate-200 shadow-sm"
                        title="Add to Spaced Revision Tracker"
                      >
                        Add to Revision
                      </button>

                      <button
                        onClick={() => handleBookmarkToggle(q)}
                        className={`p-1 rounded-lg border shadow-sm ${
                          isBookmarked
                            ? 'bg-amber-100 border-amber-300 text-amber-700'
                            : 'bg-white border-slate-200 text-slate-400 hover:text-amber-500'
                        }`}
                        title="Bookmark question"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 leading-snug">{q.question}</p>

                  {/* Answers row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-slate-400">Your Selection: </span>
                      <strong className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                        {userAnsText}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-slate-400">Official Correct Answer: </span>
                      <strong className="text-emerald-700">{correctAnsText}</strong>
                    </div>
                  </div>

                  {/* Detailed Explanation */}
                  <div className="text-xs text-slate-700 bg-white/80 p-3 rounded-xl border border-slate-200 leading-relaxed">
                    <strong className="text-slate-900">Explanation & Conceptual Rationale: </strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MockTests;
