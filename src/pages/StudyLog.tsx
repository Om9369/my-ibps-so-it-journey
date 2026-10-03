// src/pages/StudyLog.tsx
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { getAllItems, putItem, deleteItem } from '../services/db';
import { StudySession, Subject, ITModule } from '../types';
import { Clock, Plus, Trash2, Flame, Play, Pause, RotateCcw, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const STUDY_TYPES = [
  'Concept learning',
  'Revision',
  'Practice',
  'Mock analysis',
  'Current affairs',
  'Vocabulary',
  'Mistake review',
] as const;

const SUBJECTS: Subject[] = ['IT', 'Reasoning', 'English', 'Quant', 'Banking & CA'];

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
  'IoT & Blockchain',
  'Other IT',
];

export const StudyLog: React.FC = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // Live Timer State
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [subject, setSubject] = useState<Subject>('IT');
  const [itModule, setItModule] = useState<ITModule>('DBMS');
  const [topic, setTopic] = useState('');
  const [studyType, setStudyType] = useState<(typeof STUDY_TYPES)[number]>('Concept learning');
  const [isFocused, setIsFocused] = useState(true);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadSessions();
  }, []);

  // Live Timer ticker
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const loadSessions = async () => {
    const list = await getAllItems<StudySession>('studySessions');
    setSessions(list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const session: StudySession = {
      id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date,
      startTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationMinutes: Number(durationMinutes) || 30,
      subject,
      itModule: subject === 'IT' ? itModule : undefined,
      topic: topic || 'General',
      studyType,
      isFocused,
      notes,
    };

    await putItem('studySessions', session);
    setSessions([session, ...sessions]);
    setIsAdding(false);
    setTopic('');
    setNotes('');
  };

  const handleFinishTimer = async () => {
    setIsTimerRunning(false);
    const mins = Math.max(1, Math.round(elapsedSeconds / 60));
    setDurationMinutes(mins);
    setIsAdding(true);
    setElapsedSeconds(0);
  };

  const handleDelete = async (id: string) => {
    await deleteItem('studySessions', id);
    setSessions(sessions.filter((s) => s.id !== id));
  };

  // Aggregations
  const todayStr = new Date().toISOString().split('T')[0];
  const todayMins = sessions.filter((s) => s.date === todayStr).reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalMins = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const focusedMins = sessions.filter((s) => s.isFocused).reduce((acc, s) => acc + s.durationMinutes, 0);

  // Subject-wise hours chart data
  const subjectMap: Record<string, number> = {};
  SUBJECTS.forEach((sub) => (subjectMap[sub] = 0));
  sessions.forEach((s) => {
    subjectMap[s.subject] = (subjectMap[s.subject] || 0) + s.durationMinutes;
  });

  const chartData = Object.entries(subjectMap).map(([name, mins]) => ({
    name,
    hours: Math.round((mins / 60) * 10) / 10,
  }));

  const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

  const timerHours = Math.floor(elapsedSeconds / 3600);
  const timerMins = Math.floor((elapsedSeconds % 3600) / 60);
  const timerSecs = elapsedSeconds % 60;
  const formattedTimer = `${String(timerHours).padStart(2, '0')}:${String(timerMins).padStart(2, '0')}:${String(timerSecs).padStart(2, '0')}`;

  return (
    <div className="space-y-6 pb-12">
      <Header
        title="Study Log & Deep Focus Tracker"
        subtitle="Track focused hours, topic-wise time investment, and maintain study consistency."
      />

      {/* Stopwatch & Summary Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Focus Stopwatch */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm flex flex-col justify-between border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Deep Work Stopwatch</span>
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>

          <div className="my-4 text-center">
            <div className="text-4xl font-mono font-black tracking-widest text-white">
              {formattedTimer}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Focus Timer running locally</div>
          </div>

          <div className="flex items-center justify-center space-x-2">
            {!isTimerRunning ? (
              <button
                onClick={() => setIsTimerRunning(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow"
              >
                <Play className="w-4 h-4" />
                <span>Start Focus</span>
              </button>
            ) : (
              <button
                onClick={() => setIsTimerRunning(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
            )}

            {elapsedSeconds > 0 && (
              <>
                <button
                  onClick={handleFinishTimer}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
                >
                  Log Session
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setElapsedSeconds(0);
                  }}
                  className="p-2 text-slate-400 hover:text-white"
                  title="Reset Stopwatch"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Today's Hours</div>
            <div className="text-2xl font-black text-indigo-600 mt-1">
              {Math.round((todayMins / 60) * 10) / 10}h
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Target: 3.0h</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Total Hours</div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {Math.round((totalMins / 60) * 10) / 10}h
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">{sessions.length} sessions</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Deep Focus %</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {totalMins > 0 ? Math.round((focusedMins / totalMins) * 100) : 100}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">High retention</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Quick Action</div>
            <button
              onClick={() => setIsAdding(true)}
              className="mt-2 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* Manual Entry Form */}
      {isAdding && (
        <form onSubmit={handleSaveSession} className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-sm">Log Completed Study Session</h3>
            <button type="button" onClick={() => setIsAdding(false)} className="text-xs text-slate-400 hover:text-slate-600">
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Duration (Minutes)</label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                min={5}
                max={480}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as Subject)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            {subject === 'IT' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">IT Module</label>
                <select
                  value={itModule}
                  onChange={(e) => setItModule(e.target.value as ITModule)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  {IT_MODULES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Topic</label>
              <input
                type="text"
                placeholder="e.g. Transactions & ACID"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Study Type</label>
              <select
                value={studyType}
                onChange={(e) => setStudyType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                {STUDY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2 pt-5">
              <input
                type="checkbox"
                id="focused"
                checked={isFocused}
                onChange={(e) => setIsFocused(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
              />
              <label htmlFor="focused" className="font-semibold text-slate-800 cursor-pointer">
                Deep / Focused Study Session
              </label>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 text-xs mb-1">Session Notes / Key takeaways</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="What formulas, concepts, or algorithms were covered?"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow"
            >
              Save Session
            </button>
          </div>
        </form>
      )}

      {/* Subject-Wise Time Distribution Chart */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
          <BarChart2 className="w-4 h-4 text-indigo-600" />
          <span>Subject-Wise Total Hours</span>
        </h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-sm">Study Sessions History</h3>
          <span className="text-xs text-slate-500 font-semibold">{sessions.length} sessions logged</span>
        </div>

        {sessions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No study sessions recorded yet. Use the timer or click "Log Session" above.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sessions.map((s) => (
              <div key={s.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{s.subject}</span>
                    {s.itModule && (
                      <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {s.itModule}
                      </span>
                    )}
                    <span className="text-[11px] font-medium text-slate-500">• {s.topic}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <span>{s.date}</span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">{s.studyType}</span>
                    {s.isFocused && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                        Deep Focus
                      </span>
                    )}
                  </div>
                  {s.notes && <p className="text-xs text-slate-600 italic">{s.notes}</p>}
                </div>

                <div className="flex items-center space-x-4 self-end sm:self-auto">
                  <div className="text-right">
                    <div className="text-sm font-black text-slate-800">{s.durationMinutes} min</div>
                    <div className="text-[11px] text-slate-400">
                      {Math.round((s.durationMinutes / 60) * 10) / 10}h
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                    title="Delete session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyLog;
