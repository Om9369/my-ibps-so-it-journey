// src/pages/MistakeNotebook.tsx
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import {
  getAllMistakes,
  incrementMistakeReview,
  resolveMistake,
  deleteMistake,
  updateMistake,
} from '../services/mistakeTracker';
import { MistakeEntry, MistakeReason, Subject } from '../types';
import {
  AlertCircle,
  CheckCircle2,
  Filter,
  Search,
  RotateCcw,
  Trash2,
  Tag,
  Check,
} from 'lucide-react';

const REASONS: MistakeReason[] = [
  'Concept gap',
  'Forgot information',
  'Careless mistake',
  'Misread question',
  'Calculation error',
  'Time pressure',
  'Guesswork',
];

export const MistakeNotebook: React.FC = () => {
  const [mistakes, setMistakes] = useState<MistakeEntry[]>([]);
  const [search, setSearch] = useState('');
  const [reasonFilter, setReasonFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [subjectFilter, setSubjectFilter] = useState<string>('All');

  useEffect(() => {
    loadMistakes();
  }, []);

  const loadMistakes = async () => {
    const list = await getAllMistakes();
    setMistakes(list);
  };

  const handleReview = async (id: string) => {
    await incrementMistakeReview(id);
    loadMistakes();
  };

  const handleResolve = async (id: string) => {
    await resolveMistake(id);
    loadMistakes();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this mistake entry?')) {
      await deleteMistake(id);
      loadMistakes();
    }
  };

  const filtered = mistakes.filter((m) => {
    if (reasonFilter !== 'All' && m.reason !== reasonFilter) return false;
    if (statusFilter !== 'All' && m.status !== statusFilter) return false;
    if (subjectFilter !== 'All' && m.subject !== subjectFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchText = m.questionText.toLowerCase().includes(q);
      const matchTopic = m.topic.toLowerCase().includes(q);
      const matchNotes = m.notes?.toLowerCase().includes(q);
      if (!matchText && !matchTopic && !matchNotes) return false;
    }
    return true;
  });

  const openCount = mistakes.filter((m) => m.status === 'Open').length;
  const reviewingCount = mistakes.filter((m) => m.status === 'Reviewing').length;
  const resolvedCount = mistakes.filter((m) => m.status === 'Resolved').length;

  return (
    <div className="space-y-6 pb-12">
      <Header
        title="Mistake Notebook & Error Analysis"
        subtitle="Catalog incorrect attempts, analyze root causes (concept gap vs careless error), and review until mastered."
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Open Errors</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{openCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Needs first review</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">In Review</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{reviewingCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Being revised</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Resolved Errors</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{resolvedCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Mastered & corrected</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Resolution Rate</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">
            {mistakes.length > 0 ? Math.round((resolvedCount / mistakes.length) * 100) : 100}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Total logged: {mistakes.length}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search mistake question or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Reviewing">Reviewing</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div>
            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-700"
            >
              <option value="All">All Reasons</option>
              {REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-700"
            >
              <option value="All">All Subjects</option>
              <option value="IT">IT</option>
              <option value="Reasoning">Reasoning</option>
              <option value="English">English</option>
              <option value="Quant">Quant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mistake Entries List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No mistake entries match your filter. Mistakes logged during practice or full mocks appear here.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border text-xs space-y-3 shadow-sm transition-all ${
                item.status === 'Resolved'
                  ? 'bg-slate-50/70 border-slate-200 opacity-80'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${
                      item.status === 'Open'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : item.status === 'Reviewing'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {item.status}
                  </span>

                  <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {item.subject}
                  </span>
                  {item.itModule && (
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {item.itModule}
                    </span>
                  )}
                  <span className="text-slate-500 font-medium">{item.topic}</span>
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-100">
                    {item.reason}
                  </span>
                  <span className="text-slate-400 text-[11px]">{new Date(item.date).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleReview(item.id)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-200 flex items-center space-x-1"
                    title="Mark reviewed"
                  >
                    <RotateCcw className="w-3 h-3 text-indigo-600" />
                    <span>Reviewed ({item.reviewCount}x)</span>
                  </button>

                  {item.status !== 'Resolved' && (
                    <button
                      onClick={() => handleResolve(item.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm flex items-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Question Statement */}
              <div className="text-sm font-semibold text-slate-900 leading-snug">{item.questionText}</div>

              {/* Answers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                <div className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-200">
                  <span className="text-rose-600 font-semibold">My Incorrect Answer: </span>
                  <strong className="text-rose-800">{item.myAnswer}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-200">
                  <span className="text-emerald-600 font-semibold">Correct Answer: </span>
                  <strong className="text-emerald-800">{item.correctAnswer}</strong>
                </div>
              </div>

              {/* Explanation */}
              {item.explanation && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-xs">
                  <strong className="text-slate-900">Explanation: </strong>
                  {item.explanation}
                </div>
              )}

              {/* Self Reflection Notes */}
              {item.notes && (
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs italic">
                  <strong>Notes to remember: </strong> {item.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MistakeNotebook;
