// src/pages/MainsDescriptive.tsx
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { DESCRIPTIVE_PROMPTS, DescriptivePrompt } from '../data/descriptiveQuestions';
import { DescriptiveSubmission } from '../types';
import { getAllItems, putItem, deleteItem } from '../services/db';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Save,
  Send,
  Sparkles,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Tag,
  PenTool,
} from 'lucide-react';

export const MainsDescriptive: React.FC = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<DescriptivePrompt>(DESCRIPTIVE_PROMPTS[0]);
  const [userText, setUserText] = useState<string>('');
  const [submissions, setSubmissions] = useState<DescriptiveSubmission[]>([]);
  const [currentSubmission, setCurrentSubmission] = useState<DescriptiveSubmission | null>(null);

  // Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Self Evaluation Mode
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [selfScore, setSelfScore] = useState<number>(15);
  const [evalFeedback, setEvalFeedback] = useState<string>('');
  const [showModelAnswer, setShowModelAnswer] = useState<boolean>(false);

  useEffect(() => {
    loadSubmissions();
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const loadSubmissions = async () => {
    const list = await getAllItems<DescriptiveSubmission>('descriptiveSubmissions');
    setSubmissions(list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()));
  };

  const wordCount = userText
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  const handleSelectPrompt = (prompt: DescriptivePrompt) => {
    setSelectedPrompt(prompt);
    setUserText('');
    setTimerSeconds(0);
    setIsTimerRunning(false);
    setIsEvaluating(false);
    setShowModelAnswer(false);
    setCurrentSubmission(null);
  };

  const handleStartTimer = () => {
    setIsTimerRunning(true);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  const handleSaveDraft = async () => {
    const draft: DescriptiveSubmission = {
      id: currentSubmission?.id || `desc-sub-${Date.now()}`,
      questionId: selectedPrompt.id,
      questionText: selectedPrompt.questionText,
      subject: 'IT',
      topic: selectedPrompt.topic,
      userAnswer: userText,
      wordCount,
      targetWordCount: selectedPrompt.targetWordCount,
      timeSpentSeconds: timerSeconds,
      submittedAt: new Date().toISOString(),
      maxScore: 20,
      modelAnswer: selectedPrompt.modelAnswer,
      weakTopicsTagged: [],
      status: 'Draft',
    };
    await putItem('descriptiveSubmissions', draft);
    setCurrentSubmission(draft);
    loadSubmissions();
    alert('Draft answer saved successfully!');
  };

  const handleSubmitForEvaluation = async () => {
    if (wordCount < 30) {
      alert('Please write at least 30 words before submitting for evaluation.');
      return;
    }
    setIsTimerRunning(false);
    const sub: DescriptiveSubmission = {
      id: currentSubmission?.id || `desc-sub-${Date.now()}`,
      questionId: selectedPrompt.id,
      questionText: selectedPrompt.questionText,
      subject: 'IT',
      topic: selectedPrompt.topic,
      userAnswer: userText,
      wordCount,
      targetWordCount: selectedPrompt.targetWordCount,
      timeSpentSeconds: timerSeconds,
      submittedAt: new Date().toISOString(),
      maxScore: 20,
      modelAnswer: selectedPrompt.modelAnswer,
      weakTopicsTagged: [],
      status: 'Submitted',
    };
    await putItem('descriptiveSubmissions', sub);
    setCurrentSubmission(sub);
    setIsEvaluating(true);
    setShowModelAnswer(true);
    loadSubmissions();
  };

  const handleSaveSelfEvaluation = async () => {
    if (!currentSubmission) return;
    const evaluated: DescriptiveSubmission = {
      ...currentSubmission,
      selfScore,
      selfEvaluationFeedback: evalFeedback,
      status: 'Evaluated',
    };
    await putItem('descriptiveSubmissions', evaluated);
    setCurrentSubmission(evaluated);
    loadSubmissions();
    alert('Self-evaluation saved! Your descriptive score and feedback have been logged.');
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-12">
      <Header
        title="Mains Descriptive Professional Knowledge"
        subtitle="Practice technical essays, architecture explanations, and banking security scenarios with live timers, target word counts, and reference rubrics."
        showExamConfigWarning={true}
      />

      {/* Mode Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm border border-indigo-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 font-black text-[10px] uppercase tracking-wider border border-indigo-400/30">
              Mains Paper
            </span>
            <span className="text-xs text-slate-300 font-semibold">
              Descriptive Technical Writing (CRP-SPL-XVI Architecture)
            </span>
          </div>
          <h2 className="text-lg font-black text-white">
            Professional Knowledge Descriptive Practice Cockpit
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Simulates the descriptive examination layer. Type directly, monitor timing and word-count targets, self-evaluate against benchmark model answers, and identify conceptual gaps.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-950/60 p-3 rounded-xl border border-indigo-500/20 text-center">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Submissions</div>
            <div className="text-xl font-black text-indigo-400">{submissions.length}</div>
          </div>
          <div className="w-[1px] h-8 bg-slate-800"></div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Evaluated</div>
            <div className="text-xl font-black text-emerald-400">
              {submissions.filter((s) => s.status === 'Evaluated').length}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Prompt Selector */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <PenTool className="w-4 h-4 text-indigo-600" />
              <span>Select Descriptive Scenario</span>
            </h3>

            <div className="space-y-2">
              {DESCRIPTIVE_PROMPTS.map((p) => {
                const isSelected = selectedPrompt.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPrompt(p)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all space-y-1.5 ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-500 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold uppercase tracking-wider text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-100">
                        {p.topic}
                      </span>
                      <span className="font-semibold text-slate-500">
                        {p.targetWordCount} words • {p.timeLimitMinutes}m
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs leading-snug line-clamp-2">
                      {p.questionText}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Past Submissions Log */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Previous Submissions
            </h4>
            {submissions.length === 0 ? (
              <p className="text-xs text-slate-400">No submissions recorded yet.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 truncate max-w-[150px]">
                        {sub.topic}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          sub.status === 'Evaluated'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {sub.status === 'Evaluated' ? `${sub.selfScore}/${sub.maxScore} Marks` : sub.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex justify-between">
                      <span>{sub.wordCount} words</span>
                      <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Columns: Writing Canvas & Evaluation Workspace */}
        <div className="lg:col-span-2 space-y-4">
          {/* Question Banner */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold">
                {selectedPrompt.module}
              </span>

              {/* Timer Bar */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 rounded-xl font-mono font-bold text-slate-800">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{formatTimer(timerSeconds)}</span>
                  <span className="text-[10px] text-slate-500 font-normal">/ {selectedPrompt.timeLimitMinutes}m</span>
                </div>
                {!isTimerRunning ? (
                  <button
                    onClick={handleStartTimer}
                    className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded-xl shadow-xs"
                  >
                    Start Timer
                  </button>
                ) : (
                  <button
                    onClick={handlePauseTimer}
                    className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] rounded-xl"
                  >
                    Pause
                  </button>
                )}
                <button
                  onClick={handleResetTimer}
                  className="p-1.5 text-slate-400 hover:text-slate-600"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <h3 className="font-bold text-slate-900 text-base leading-snug">
              {selectedPrompt.questionText}
            </h3>

            {/* Target Gauge */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <div className="flex items-center space-x-2 text-slate-600">
                <span>Word Count:</span>
                <strong className={`font-mono font-bold ${wordCount >= selectedPrompt.targetWordCount * 0.8 ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {wordCount}
                </strong>
                <span className="text-slate-400">/ {selectedPrompt.targetWordCount} target</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Max Marks: 20 • Standard 15-Min Window
              </span>
            </div>
          </div>

          {/* Typing Area */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <textarea
              rows={12}
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder="Type your technical answer here. Structure with key definitions, architectural flow, bulleted components, and security considerations..."
              className="w-full p-4 rounded-xl border border-slate-200 text-xs md:text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-y custom-scrollbar font-sans"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Draft</span>
              </button>

              <button
                type="button"
                onClick={handleSubmitForEvaluation}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center space-x-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit & Self-Evaluate &rarr;</span>
              </button>
            </div>
          </div>

          {/* Self-Evaluation & Model Answer Section */}
          {isEvaluating && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-emerald-950 text-sm">
                      Self-Evaluation Rubric (Max: 20 Marks)
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowModelAnswer(!showModelAnswer)}
                    className="text-xs font-bold text-emerald-800 hover:underline flex items-center space-x-1"
                  >
                    <span>{showModelAnswer ? 'Hide Reference Answer' : 'Show Reference Answer'}</span>
                    {showModelAnswer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Key Checklist Points */}
                <div className="space-y-2 bg-white/80 p-3.5 rounded-xl border border-emerald-100 text-xs">
                  <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                    Essential Points to Check in Your Answer:
                  </div>
                  <ul className="space-y-1.5 text-slate-700">
                    {selectedPrompt.keyEvaluationPoints.map((pt, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Model Answer Preview */}
                {showModelAnswer && (
                  <div className="bg-white p-4 rounded-xl border border-emerald-200 text-xs space-y-2">
                    <div className="font-bold text-indigo-700 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Benchmark Model Answer</span>
                    </div>
                    <div className="text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-lg border border-slate-100 font-sans">
                      {selectedPrompt.modelAnswer}
                    </div>
                  </div>
                )}

                {/* Scoring Slider & Feedback */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">Assign Score:</span>
                    <span className="text-base font-black text-emerald-700 font-mono">
                      {selfScore} / 20 Marks
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    value={selfScore}
                    onChange={(e) => setSelfScore(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Reflection & Identified Gap Notes:
                    </label>
                    <input
                      type="text"
                      value={evalFeedback}
                      onChange={(e) => setEvalFeedback(e.target.value)}
                      placeholder="e.g. Missed the second factor in 2FA; forgot to explain SYN Cookies..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs"
                    />
                  </div>

                  <button
                    onClick={handleSaveSelfEvaluation}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
                  >
                    Confirm & Record Self-Evaluation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainsDescriptive;
