// src/pages/WeeklyHistory.tsx
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { mockProvider } from '../services/mockProvider';
import { getAllItems } from '../services/db';
import { MockTestAttempt, StudySession } from '../types';
import { History, Filter, Search, Calendar, FileText, Clock } from 'lucide-react';

export const WeeklyHistory: React.FC = () => {
  const [mocks, setMocks] = useState<MockTestAttempt[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [activeTab, setActiveTab] = useState<'mocks' | 'study'>('mocks');

  // Filters
  const [testTypeFilter, setTestTypeFilter] = useState<string>('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const [mockList, sessionList] = await Promise.all([
      mockProvider.getHistory(),
      getAllItems<StudySession>('studySessions'),
    ]);
    setMocks(mockList.filter((m) => m.status === 'Completed'));
    setSessions(sessionList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const filteredMocks = mocks.filter((m) => {
    if (testTypeFilter !== 'All' && m.testType !== testTypeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!m.title.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      <Header
        title="Weekly History & Test Archive"
        subtitle="Complete chronological audit of your mock test attempts, sectional performances, and weekly study logs."
      />

      {/* Tabs */}
      <div className="flex bg-slate-200/80 p-1 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('mocks')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'mocks' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Mock Test History ({mocks.length})
        </button>
        <button
          onClick={() => setActiveTab('study')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'study' ? 'bg-white text-slate-900 shadow' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Study Session History ({sessions.length})
        </button>
      </div>

      {activeTab === 'mocks' ? (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 text-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search mock test by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <select
                value={testTypeFilter}
                onChange={(e) => setTestTypeFilter(e.target.value)}
                className="w-full sm:w-auto p-1.5 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-700"
              >
                <option value="All">All Test Types</option>
                <option value="Full Mock">Full Mock</option>
                <option value="Sectional">Sectional</option>
                <option value="Custom Practice">Custom Practice</option>
                <option value="Quiz">Quiz</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {filteredMocks.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No past mock attempts found.
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMocks.map((m) => (
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* STUDY SESSIONS ARCHIVE */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {sessions.map((s) => (
              <div key={s.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{s.subject}</span>
                    {s.itModule && (
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {s.itModule}
                      </span>
                    )}
                    <span className="text-slate-500">• {s.topic}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {s.date} • {s.studyType} {s.isFocused ? '• Deep Focus' : ''}
                  </div>
                </div>
                <div className="font-black text-slate-800 text-sm">{s.durationMinutes} min</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyHistory;
