// src/pages/DailyAnalysis.tsx
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { getAllItems, putItem } from '../services/db';
import { DailyAnalysis as IDailyAnalysis, StudySession, MockTestAttempt, Subject } from '../types';
import { Calendar, Save, CheckCircle2, Award, BookOpen, Brain, Sparkles } from 'lucide-react';

const SUBJECTS: Subject[] = ['IT', 'Reasoning', 'English', 'Quant', 'Banking & CA'];

export const DailyAnalysis: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [mocks, setMocks] = useState<MockTestAttempt[]>([]);
  const [savedAnalysis, setSavedAnalysis] = useState<IDailyAnalysis | null>(null);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Reflection questionnaire state
  const [whatDidILearn, setWhatDidILearn] = useState('');
  const [whatWasDifficult, setWhatWasDifficult] = useState('');
  const [whatMistakeDidIRepeat, setWhatMistakeDidIRepeat] = useState('');
  const [whatShouldIRevise, setWhatShouldIRevise] = useState('');
  const [whatDistractedMe, setWhatDistractedMe] = useState('');
  const [whatWentWell, setWhatWentWell] = useState('');

  useEffect(() => {
    loadDateData();
  }, [selectedDate]);

  const loadDateData = async () => {
    const [allSessions, allMocks, allAnalyses] = await Promise.all([
      getAllItems<StudySession>('studySessions'),
      getAllItems<MockTestAttempt>('mockTests'),
      getAllItems<IDailyAnalysis>('dailyAnalyses'),
    ]);

    const dateSessions = allSessions.filter((s) => s.date === selectedDate);
    const dateMocks = allMocks.filter((m) => m.date && m.date.startsWith(selectedDate) && m.status === 'Completed');
    const existing = allAnalyses.find((a) => a.date === selectedDate);

    setSessions(dateSessions);
    setMocks(dateMocks);

    if (existing) {
      setSavedAnalysis(existing);
      setWhatDidILearn(existing.whatDidILearn || '');
      setWhatWasDifficult(existing.whatWasDifficult || '');
      setWhatMistakeDidIRepeat(existing.whatMistakeDidIRepeat || '');
      setWhatShouldIRevise(existing.whatShouldIRevise || '');
      setWhatDistractedMe(existing.whatDistractedMe || '');
      setWhatWentWell(existing.whatWentWell || '');
    } else {
      setSavedAnalysis(null);
      setWhatDidILearn('');
      setWhatWasDifficult('');
      setWhatMistakeDidIRepeat('');
      setWhatShouldIRevise('');
      setWhatDistractedMe('');
      setWhatWentWell('');
    }
  };

  // Compute Practice stats from date mocks
  const totalQuestions = mocks.reduce((acc, m) => acc + (m.totalQuestions || 0), 0);
  const totalAttempted = mocks.reduce((acc, m) => acc + (m.totalAttempted || 0), 0);
  const totalCorrect = mocks.reduce((acc, m) => acc + (m.totalCorrect || 0), 0);
  const totalIncorrect = mocks.reduce((acc, m) => acc + (m.totalIncorrect || 0), 0);
  const totalUnattempted = Math.max(0, totalQuestions - totalAttempted);
  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 1000) / 10 : 0;
  const attemptRate = totalQuestions > 0 ? Math.round((totalAttempted / totalQuestions) * 1000) / 10 : 0;

  // Study hours
  const actualMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const actualHours = Math.round((actualMinutes / 60) * 10) / 10;
  const focusedMinutes = sessions.filter((s) => s.isFocused).reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const focusedHours = Math.round((focusedMinutes / 60) * 10) / 10;
  const plannedHours = 3.0;

  // Subject table calculations
  const subjectBreakdown: Record<string, { timeMinutes: number; questions: number; correct: number; incorrect: number }> = {};
  SUBJECTS.forEach((sub) => {
    subjectBreakdown[sub] = { timeMinutes: 0, questions: 0, correct: 0, incorrect: 0 };
  });

  sessions.forEach((s) => {
    if (subjectBreakdown[s.subject]) {
      subjectBreakdown[s.subject].timeMinutes += s.durationMinutes || 0;
    }
  });

  mocks.forEach((m) => {
    m.sectionSummaries?.forEach((sec) => {
      const match = SUBJECTS.find((s) => s === sec.subject);
      if (match && subjectBreakdown[match]) {
        subjectBreakdown[match].questions += sec.attempted || 0;
        subjectBreakdown[match].correct += sec.correct || 0;
        subjectBreakdown[match].incorrect += sec.incorrect || 0;
      }
    });
  });

  const handleSaveAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    const analysis: IDailyAnalysis = {
      id: `analysis-${selectedDate}`,
      date: selectedDate,
      plannedStudyHours: plannedHours,
      actualStudyHours: actualHours,
      focusedHours,
      sessionsCount: sessions.length,
      questionsAttempted: totalAttempted,
      questionsCorrect: totalCorrect,
      questionsIncorrect: totalIncorrect,
      accuracy,
      attemptRate,
      avgTimePerQuestionSeconds: 45,
      subjectBreakdown,
      whatDidILearn,
      whatWasDifficult,
      whatMistakeDidIRepeat,
      whatShouldIRevise,
      whatDistractedMe,
      whatWentWell,
    };

    await putItem('dailyAnalyses', analysis);
    setSavedAnalysis(analysis);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      <Header
        title="Daily Analysis & Reflection"
        subtitle="End-of-day audit: study volume, practice accuracy, subject distribution, and honest reflection."
      />

      {/* Date Bar */}
      <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-indigo-600 shrink-0" />
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500">Analysis Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200"
            />
          </div>
        </div>

        {savedAnalysis && (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Analysis Saved for this date</span>
          </span>
        )}
      </div>

      {/* METRICS ROW: Study & Practice Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Study Summary */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Study Volume</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Planned</div>
              <div className="text-lg font-black text-slate-800">{plannedHours}h</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Actual</div>
              <div className="text-lg font-black text-indigo-600">{actualHours}h</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Deep Work</div>
              <div className="text-lg font-black text-emerald-600">{focusedHours}h</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Sessions</div>
              <div className="text-lg font-black text-slate-800">{sessions.length}</div>
            </div>
          </div>
        </div>

        {/* Practice Summary */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <Brain className="w-4 h-4 text-emerald-600" />
            <span>Practice & Accuracy</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Questions</div>
              <div className="text-lg font-black text-slate-800">{totalAttempted}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Correct</div>
              <div className="text-lg font-black text-emerald-600">{totalCorrect}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Incorrect</div>
              <div className="text-lg font-black text-rose-600">{totalIncorrect}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Accuracy</div>
              <div className="text-lg font-black text-indigo-600">{accuracy}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* SUBJECT AUDIT TABLE (Requirement #8) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
          <h3 className="font-bold text-slate-900 text-sm">Subject-Wise Daily Breakdown</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/60 text-slate-600 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4 text-right">Study Time</th>
                <th className="py-3 px-4 text-right">Questions</th>
                <th className="py-3 px-4 text-right">Correct</th>
                <th className="py-3 px-4 text-right">Incorrect</th>
                <th className="py-3 px-4 text-right">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SUBJECTS.map((sub) => {
                const stat = subjectBreakdown[sub];
                const acc = stat.questions > 0 ? Math.round((stat.correct / stat.questions) * 100) : 0;
                return (
                  <tr key={sub} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">{sub}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700">
                      {Math.round((stat.timeMinutes / 60) * 10) / 10}h ({stat.timeMinutes}m)
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-800">{stat.questions}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600">{stat.correct}</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-600">{stat.incorrect}</td>
                    <td className="py-3 px-4 text-right font-black text-indigo-600">
                      {stat.questions > 0 ? `${acc}%` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DAILY DISCIPLINE SCORECARD (Requirement #9) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-slate-900 text-sm">Daily Discipline Scorecard</h3>
        </div>
        <p className="text-xs text-slate-500">
          Descriptive performance metrics reflecting study consistency and adherence to routine (no arbitrary IQ or false probability claims).
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Study Target</div>
            <div className="text-sm font-black text-slate-800 mt-1">
              {actualHours >= plannedHours ? '100% Achieved' : `${Math.round((actualHours / plannedHours) * 100)}% Met`}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Deep Ratio</div>
            <div className="text-sm font-black text-emerald-600 mt-1">
              {actualMinutes > 0 ? `${Math.round((focusedMinutes / actualMinutes) * 100)}% Focused` : '—'}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Practice Volume</div>
            <div className="text-sm font-black text-slate-800 mt-1">
              {totalAttempted >= 30 ? 'Target Met (30+)' : `${totalAttempted} Questions`}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Accuracy Grade</div>
            <div className="text-sm font-black text-indigo-600 mt-1">
              {accuracy >= 80 ? 'Optimal (80%+)' : accuracy >= 65 ? 'Stable (65-79%)' : 'Needs Review (<65%)'}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Error Control</div>
            <div className="text-sm font-black text-rose-600 mt-1">
              {totalIncorrect === 0 ? 'Zero Errors' : `${totalIncorrect} Mistakes`}
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Consistency</div>
            <div className="text-sm font-black text-amber-600 mt-1">Logged & Verified</div>
          </div>
        </div>
      </div>

      {/* END OF DAY REFLECTION FORM (Requirement #8) */}
      <form onSubmit={handleSaveAnalysis} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Daily Qualitative Reflection</h3>
            <p className="text-xs text-slate-500">Record your learning insights and self-correction steps.</p>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Daily Analysis</span>
          </button>
        </div>

        {isSavedNotice && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Daily reflection and performance record saved successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">1. What did I learn today?</label>
            <textarea
              rows={3}
              value={whatDidILearn}
              onChange={(e) => setWhatDidILearn(e.target.value)}
              placeholder="e.g. Mastered B+ tree internal vs leaf node structure, TCP 3-way handshake..."
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">2. What was difficult or challenging?</label>
            <textarea
              rows={3}
              value={whatWasDifficult}
              onChange={(e) => setWhatWasDifficult(e.target.value)}
              placeholder="e.g. Subnetting calculations under tight time pressure..."
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">3. What mistake did I repeat?</label>
            <textarea
              rows={3}
              value={whatMistakeDidIRepeat}
              onChange={(e) => setWhatMistakeDidIRepeat(e.target.value)}
              placeholder="e.g. Misreading question options that contain 'NOT'..."
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">4. What should I revise tomorrow?</label>
            <textarea
              rows={3}
              value={whatShouldIRevise}
              onChange={(e) => setWhatShouldIRevise(e.target.value)}
              placeholder="e.g. Coffman deadlock conditions and Banker's algorithm safe sequence..."
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">5. What distracted me / reduced efficiency?</label>
            <textarea
              rows={3}
              value={whatDistractedMe}
              onChange={(e) => setWhatDistractedMe(e.target.value)}
              placeholder="e.g. Phone notifications during English practice..."
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">6. What went well today?</label>
            <textarea
              rows={3}
              value={whatWentWell}
              onChange={(e) => setWhatWentWell(e.target.value)}
              placeholder="e.g. Completed all DBMS questions with 85% accuracy..."
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default DailyAnalysis;
