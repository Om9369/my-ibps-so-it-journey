// src/pages/Practice.tsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { questionProvider } from '../services/questionProvider';
import { generateTest, calculateMockResults, mockProvider } from '../services/mockProvider';
import { Question, Subject, ITModule, Difficulty, MockTestAttempt } from '../types';
import { LogMistakeModal } from '../components/LogMistakeModal';
import {
  PlayCircle,
  Zap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  RotateCcw,
  Sparkles,
  BookOpen,
  HelpCircle,
  ArrowRight,
  Filter,
} from 'lucide-react';

const SUBJECTS: Subject[] = ['IT', 'Reasoning', 'English', 'Quant'];

const IT_MODULES: ITModule[] = [
  'DBMS',
  'Operating Systems',
  'Computer Networks',
  'Data Structures',
  'Algorithms',
  'Programming & OOP',
  'Software Engineering',
  'Cybersecurity',
  'Computer Architecture',
  'Web Technologies',
  'Cloud Computing',
  'AI & Machine Learning',
];

export const Practice: React.FC = () => {
  const location = useLocation();

  // Mode: 'Setup' | 'Runner' | 'Result'
  const [activeTab, setActiveTab] = useState<'quick' | 'quiz'>('quick');
  const [sessionState, setSessionState] = useState<'Setup' | 'Running' | 'Completed'>('Setup');

  // Quick Practice Form
  const [selectedSubject, setSelectedSubject] = useState<Subject>('IT');
  const [selectedModule, setSelectedModule] = useState<ITModule | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'Mixed'>('Mixed');
  const [questionCount, setQuestionCount] = useState<number>(15);

  // Quiz Mode Options
  const [immediateFeedback, setImmediateFeedback] = useState<boolean>(true);
  const [quizTimerEnabled, setQuizTimerEnabled] = useState<boolean>(true);

  // Active Runner State
  const [activeTest, setActiveTest] = useState<MockTestAttempt | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Mistake modal
  const [mistakeModalQuestion, setMistakeModalQuestion] = useState<{ question: Question; myAnswerText: string } | null>(null);

  useEffect(() => {
    // Check if navigated with preset module
    if (location.state && (location.state as any).module) {
      setSelectedSubject('IT');
      setSelectedModule((location.state as any).module);
    }
  }, [location.state]);

  // Quiz timer
  useEffect(() => {
    let timer: any = null;
    if (sessionState === 'Running') {
      timer = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sessionState]);

  // Launch Quick Practice
  const handleStartQuickPractice = async () => {
    const modules = selectedModule !== 'All' ? [selectedModule] : undefined;
    const test = await generateTest({
      title: `${selectedSubject} Quick Practice (${selectedModule !== 'All' ? selectedModule : 'All Topics'})`,
      testType: 'Custom Practice',
      subject: selectedSubject,
      itModules: modules,
      difficulty: selectedDifficulty,
      questionCount,
      randomize: true,
      timeLimitMinutes: Math.round(questionCount * 1.5),
    });

    setActiveTest(test);
    setCurrentQIndex(0);
    setUserAnswers({});
    setElapsedSeconds(0);
    setSessionState('Running');
  };

  // Launch Preset Quiz
  const handleStartPresetQuiz = async (presetName: string, config: { module?: ITModule; count: number; timeMins: number; weakTopicsOnly?: boolean }) => {
    let pool = await questionProvider.getQuestions();

    if (config.weakTopicsOnly) {
      // Pick topics that have Hard or Medium difficulty
      pool = pool.filter((q) => q.difficulty === 'Hard' || q.difficulty === 'Medium');
    }

    const test = await generateTest({
      title: presetName,
      testType: 'Quiz',
      subject: 'IT',
      itModules: config.module ? [config.module] : undefined,
      questionCount: config.count,
      randomize: true,
      timeLimitMinutes: config.timeMins,
    });

    setActiveTest(test);
    setCurrentQIndex(0);
    setUserAnswers({});
    setElapsedSeconds(0);
    setSessionState('Running');
  };

  // Option Click Handler
  const handleSelectOption = (optionIndex: number) => {
    if (!activeTest) return;
    const q = activeTest.questions[currentQIndex];
    if (!q) return;

    const updatedAnswers = { ...userAnswers, [q.id]: optionIndex };
    setUserAnswers(updatedAnswers);

    // Save in attempt model
    activeTest.attempts[q.id] = {
      questionId: q.id,
      selectedOptionIndex: optionIndex,
      isMarkedForReview: false,
      timeSpentSeconds: 15,
      isCorrect: optionIndex === q.correctAnswer,
    };
  };

  // Submit test
  const handleSubmitSession = async () => {
    if (!activeTest) return;
    activeTest.timeUsedSeconds = elapsedSeconds;
    const evaluated = calculateMockResults(activeTest);
    await mockProvider.saveMockAttempt(evaluated);

    // Update real-time concept mastery in Syllabus Intelligence Engine
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
      console.warn('Error recording syllabus attempts:', e);
    }

    setActiveTest(evaluated);
    setSessionState('Completed');
  };

  const currentQ = activeTest?.questions[currentQIndex];
  const currentSelectedOption = currentQ ? userAnswers[currentQ.id] : undefined;
  const isCurrentAnswered = currentSelectedOption !== undefined;
  const isCurrentCorrect = isCurrentAnswered && currentSelectedOption === currentQ?.correctAnswer;

  return (
    <div className="space-y-6 pb-12">
      <Header
        title="Question Practice & Quizzes"
        subtitle="Sharpen conceptual clarity with Quick Practice sets, 10-minute speed drills, and Weak-Topic quizzes."
      />

      {/* Mistake modal */}
      {mistakeModalQuestion && (
        <LogMistakeModal
          isOpen={Boolean(mistakeModalQuestion)}
          onClose={() => setMistakeModalQuestion(null)}
          question={mistakeModalQuestion.question}
          myAnswerText={mistakeModalQuestion.myAnswerText}
          sourceContext={activeTest?.title || 'Practice Set'}
        />
      )}

      {/* MODE TABS (When in Setup) */}
      {sessionState === 'Setup' && (
        <div className="space-y-6">
          <div className="flex bg-slate-200/80 p-1 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('quick')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'quick' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Quick Practice Generator
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'quiz' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Speed & Weak Topic Quizzes
            </button>
          </div>

          {activeTab === 'quick' ? (
            /* QUICK PRACTICE GENERATOR (Requirement #4) */
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 max-w-2xl">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Configure Quick Practice Set</h3>
                <p className="text-xs text-slate-500">
                  Pulls randomized questions from your personal question bank and automatically tracks errors.
                </p>
              </div>

              {/* Subject Picker */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Subject</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SUBJECTS.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => {
                        setSelectedSubject(sub);
                        if (sub !== 'IT') setSelectedModule('All');
                      }}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                        selectedSubject === sub
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* IT Module Picker (if IT) */}
              {selectedSubject === 'IT' && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">IT Module</label>
                  <select
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                  >
                    <option value="All">All IT Modules (Mixed)</option>
                    {IT_MODULES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Difficulty */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Difficulty</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Mixed', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        selectedDifficulty === diff
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Questions */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Number of Questions</label>
                <div className="flex flex-wrap gap-2">
                  {[10, 20, 30, 50].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuestionCount(num)}
                      className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                        questionCount === num
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {num} Questions
                    </button>
                  ))}
                  <div className="flex items-center space-x-1 pl-2">
                    <span className="text-xs text-slate-500 font-semibold">Custom:</span>
                    <input
                      type="number"
                      min={5}
                      max={100}
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                      className="w-16 p-1.5 text-center text-xs font-bold border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleStartQuickPractice}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/20 transition-all"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Launch Quick Practice Set</span>
              </button>
            </div>
          ) : (
            /* QUIZ MODE PRESETS (Requirement #10) */
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Quiz Preferences</h3>
                  <p className="text-xs text-slate-500">Configure immediate feedback and timer rules for quiz mode.</p>
                </div>
                <div className="flex items-center space-x-4 text-xs font-semibold">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={immediateFeedback}
                      onChange={(e) => setImmediateFeedback(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                    />
                    <span>Immediate Answer Feedback</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={quizTimerEnabled}
                      onChange={(e) => setQuizTimerEnabled(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                    />
                    <span>Countdown Timer</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 10-Minute IT Quiz */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-indigo-300 transition-all">
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">10-Minute IT Speed Quiz</h4>
                    <p className="text-xs text-slate-500">
                      10 rapid Professional Knowledge questions across high-yield IT modules.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">10 Qs • 10 Mins</span>
                    <button
                      onClick={() => handleStartPresetQuiz('10-Minute IT Quiz', { count: 10, timeMins: 10 })}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow"
                    >
                      Start Quiz
                    </button>
                  </div>
                </div>

                {/* DBMS Quiz */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-indigo-300 transition-all">
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">DBMS Mastery Quiz</h4>
                    <p className="text-xs text-slate-500">
                      20 DBMS questions: Normalization, ACID, 2PL, B+ Trees, Indexing, and SQL Joins.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">20 Qs • 20 Mins</span>
                    <button
                      onClick={() => handleStartPresetQuiz('DBMS Quiz', { module: 'DBMS', count: 20, timeMins: 20 })}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow"
                    >
                      Start Quiz
                    </button>
                  </div>
                </div>

                {/* Cybersecurity Quiz */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-indigo-300 transition-all">
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Cybersecurity & Forensics Quiz</h4>
                    <p className="text-xs text-slate-500">
                      15 questions on Asymmetric Cryptography, SQLi, XSS, Digital Signatures, and Firewalls.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">15 Qs • 15 Mins</span>
                    <button
                      onClick={() =>
                        handleStartPresetQuiz('Cybersecurity Quiz', { module: 'Cybersecurity', count: 15, timeMins: 15 })
                      }
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow"
                    >
                      Start Quiz
                    </button>
                  </div>
                </div>

                {/* Daily IT Quiz */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-indigo-300 transition-all">
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Daily IT Refresh Quiz</h4>
                    <p className="text-xs text-slate-500">
                      10 random IT questions to maintain daily consistency and memory retrieval.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">10 Qs • 10 Mins</span>
                    <button
                      onClick={() => handleStartPresetQuiz('Daily IT Quiz', { count: 10, timeMins: 10 })}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
                    >
                      Start Quiz
                    </button>
                  </div>
                </div>

                {/* Weak Topic Quiz */}
                <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-amber-400 transition-all bg-amber-50/20">
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Weak Topic Targeted Quiz</h4>
                    <p className="text-xs text-slate-500">
                      Auto-filters questions from topics with low recorded accuracy to directly plug concept gaps.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700">Targeted Focus</span>
                    <button
                      onClick={() =>
                        handleStartPresetQuiz('Weak Topic Quiz', { count: 12, timeMins: 15, weakTopicsOnly: true })
                      }
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow"
                    >
                      Start Quiz
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ACTIVE PRACTICE / QUIZ RUNNER */}
      {sessionState === 'Running' && activeTest && currentQ && (
        <div className="space-y-5">
          {/* Header Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                {activeTest.title}
              </span>
              <div className="font-bold text-slate-800 text-sm">
                Question {currentQIndex + 1} of {activeTest.questions.length}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>
                  {Math.floor(elapsedSeconds / 60)}:{String(elapsedSeconds % 60).padStart(2, '0')}
                </span>
              </div>

              <button
                onClick={handleSubmitSession}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
              >
                Finish & View Results
              </button>
            </div>
          </div>

          {/* Question Card */}
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
                <span
                  className={`px-2 py-0.5 rounded font-bold ${
                    currentQ.difficulty === 'Easy'
                      ? 'text-emerald-700 bg-emerald-50'
                      : currentQ.difficulty === 'Medium'
                      ? 'text-indigo-700 bg-indigo-50'
                      : 'text-rose-700 bg-rose-50'
                  }`}
                >
                  {currentQ.difficulty}
                </span>
              </div>

              <h3 className="text-base md:text-lg font-bold text-slate-900 leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = currentSelectedOption === idx;
                const isCorrect = idx === currentQ.correctAnswer;
                const showFeedback = immediateFeedback && isCurrentAnswered;

                let optClass = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';

                if (isSelected) {
                  optClass = 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-sm';
                }

                if (showFeedback) {
                  if (isCorrect) {
                    optClass = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                  } else if (isSelected && !isCorrect) {
                    optClass = 'bg-rose-50 border-rose-500 text-rose-900 font-bold';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs md:text-sm transition-all flex items-center justify-between ${optClass}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {showFeedback && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {showFeedback && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Immediate Answer Explanation (if enabled) */}
            {immediateFeedback && isCurrentAnswered && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isCurrentCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {isCurrentCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
                  </span>
                  {!isCurrentCorrect && (
                    <button
                      onClick={() =>
                        setMistakeModalQuestion({
                          question: currentQ,
                          myAnswerText: currentQ.options[currentSelectedOption!],
                        })
                      }
                      className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] rounded-lg border border-rose-200 flex items-center space-x-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Add to Mistake Notebook</span>
                    </button>
                  )}
                </div>
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Explanation: </strong>
                  {currentQ.explanation}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(currentQIndex - 1)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-40"
              >
                &larr; Previous
              </button>

              <div className="text-xs font-semibold text-slate-500">
                {Object.keys(userAnswers).length} of {activeTest.questions.length} Answered
              </div>

              {currentQIndex < activeTest.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQIndex(currentQIndex + 1)}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow"
                >
                  Next &rarr;
                </button>
              ) : (
                <button
                  onClick={handleSubmitSession}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
                >
                  Finish
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* COMPLETED PRACTICE / QUIZ SUMMARY */}
      {sessionState === 'Completed' && activeTest && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Practice Session Completed
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">{activeTest.title}</h2>
            </div>
            <button
              onClick={() => {
                setActiveTest(null);
                setSessionState('Setup');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center space-x-1"
            >
              <RotateCcw className="w-4 h-4" />
              <span>New Practice Set</span>
            </button>
          </div>

          {/* Results Scorecard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Accuracy</div>
              <div className="text-2xl font-black text-emerald-600">{activeTest.accuracy}%</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Correct</div>
              <div className="text-2xl font-black text-emerald-600">{activeTest.totalCorrect}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Incorrect</div>
              <div className="text-2xl font-black text-rose-600">{activeTest.totalIncorrect}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Time Used</div>
              <div className="text-2xl font-black text-slate-800">
                {Math.round(activeTest.timeUsedSeconds / 60)} min
              </div>
            </div>
          </div>

          {/* Question Breakdown List */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-slate-900 text-sm">Review Questions & Add Mistakes</h3>
            <div className="space-y-3">
              {activeTest.questions.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const isAttempted = userAns !== undefined;
                const isCorrect = isAttempted && userAns === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      !isAttempted
                        ? 'bg-slate-50 border-slate-200'
                        : isCorrect
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900">Q{idx + 1}.</span>
                          <span className="text-[11px] font-semibold text-slate-500">[{q.subject} • {q.topic}]</span>
                        </div>
                        <div className="font-medium text-slate-800">{q.question}</div>
                      </div>

                      {!isCorrect && (
                        <button
                          onClick={() =>
                            setMistakeModalQuestion({
                              question: q,
                              myAnswerText: isAttempted ? q.options[userAns] : 'Unattempted',
                            })
                          }
                          className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-700 font-bold text-[11px] rounded-lg border border-rose-200 shrink-0 shadow-sm"
                        >
                          Add Mistake
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                      <div>
                        <span className="text-slate-500">Your Selection: </span>
                        <strong className={isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                          {isAttempted ? q.options[userAns] : 'Not Attempted'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Correct Answer: </span>
                        <strong className="text-emerald-700">{q.options[q.correctAnswer]}</strong>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 bg-white/70 p-2.5 rounded-lg border border-slate-200">
                      <strong>Explanation: </strong> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Practice;
