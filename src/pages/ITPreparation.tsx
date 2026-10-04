// src/pages/ITPreparation.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { getAllItems, putItem } from '../services/db';
import { ITTopicProgress, ITModule } from '../types';
import { Cpu, PlayCircle, CheckCircle2, Clock, AlertTriangle, BookOpen, Search, Filter, Compass } from 'lucide-react';

const MODULES: ITModule[] = [
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

const STATUS_OPTIONS: ITTopicProgress['status'][] = ['Not Started', 'In Progress', 'Mastered', 'Revision Due'];

export const ITPreparation: React.FC = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<ITTopicProgress[]>([]);
  const [selectedModule, setSelectedModule] = useState<ITModule | 'All'>('All');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [editingTopic, setEditingTopic] = useState<ITTopicProgress | null>(null);

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    const all = await getAllItems<ITTopicProgress>('itProgress');
    setTopics(all);
  };

  const handleUpdateStatus = async (topic: ITTopicProgress, newStatus: ITTopicProgress['status']) => {
    const updated = { ...topic, status: newStatus };
    await putItem('itProgress', updated);
    setTopics(topics.map((t) => (t.id === topic.id ? updated : t)));
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTopic) return;
    await putItem('itProgress', editingTopic);
    setTopics(topics.map((t) => (t.id === editingTopic.id ? editingTopic : t)));
    setEditingTopic(null);
  };

  const handleQuickPracticeModule = (moduleName: ITModule) => {
    navigate('/practice', { state: { module: moduleName } });
  };

  // Filtered topics
  const filteredTopics = topics.filter((t) => {
    if (selectedModule !== 'All' && t.module !== selectedModule) return false;
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (search.trim() && !t.subtopic.toLowerCase().includes(search.toLowerCase()) && !t.notes?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Overall mastery stats
  const totalCount = topics.length;
  const masteredCount = topics.filter((t) => t.status === 'Mastered').length;
  const inProgressCount = topics.filter((t) => t.status === 'In Progress').length;
  const revisionDueCount = topics.filter((t) => t.status === 'Revision Due').length;
  const masteryPct = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      <Header
        title="IT Professional Knowledge Tracker"
        subtitle="Complete syllabus tracking for IBPS SO IT Officer: DBMS, OS, Networks, Data Structures, Software Engineering, Security & Architecture."
      />

      {/* Link to Full 15-Subject Adaptive Syllabus Engine */}
      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shrink-0 shadow-sm">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Adaptive 15-Subject Syllabus Engine</h3>
            <p className="text-xs text-slate-500">
              Access the complete hierarchy with L0–L3 difficulties, prerequisites, mastery scoring, and August 2027 roadmaps.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/syllabus')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          Open Adaptive Syllabus
        </button>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Mastery Index</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{masteryPct}%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{masteredCount} of {totalCount} mastered</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">In Progress</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">{inProgressCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Active concepts</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Revision Due</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{revisionDueCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Needs refresh</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Total Subtopics</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{totalCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across {MODULES.length} modules</div>
        </div>
      </div>

      {/* Module Selector & Filter Bar */}
      <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Module Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 custom-scrollbar">
          <button
            onClick={() => setSelectedModule('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedModule === 'All'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Modules
          </button>
          {MODULES.map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedModule === mod
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>

        {/* Search & Status Filter */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search IT concepts, subtopics, or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-700"
            >
              <option value="All">All Statuses</option>
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Edit Topic Modal / Drawer */}
      {editingTopic && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4"
          >
            <h3 className="font-bold text-slate-900 text-base">Edit Topic Progress</h3>
            <div className="text-xs text-slate-500 font-semibold">{editingTopic.module} &rarr; {editingTopic.subtopic}</div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={editingTopic.status}
                  onChange={(e) => setEditingTopic({ ...editingTopic, status: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Questions Practiced</label>
                  <input
                    type="number"
                    value={editingTopic.questionsPracticed || 0}
                    onChange={(e) => setEditingTopic({ ...editingTopic, questionsPracticed: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Accuracy %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editingTopic.accuracy || 0}
                    onChange={(e) => setEditingTopic({ ...editingTopic, accuracy: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Concept Notes / High-Yield Formulas</label>
                <textarea
                  rows={3}
                  value={editingTopic.notes || ''}
                  onChange={(e) => setEditingTopic({ ...editingTopic, notes: e.target.value })}
                  placeholder="Key theorems, edge cases, or trap points..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingTopic(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Topics List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              {selectedModule === 'All' ? 'All IT Modules' : selectedModule} Topics
            </h3>
            <span className="text-xs text-slate-400 font-semibold">({filteredTopics.length})</span>
          </div>

          {selectedModule !== 'All' && (
            <button
              onClick={() => handleQuickPracticeModule(selectedModule)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Practice {selectedModule}</span>
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-100">
          {filteredTopics.map((topic) => {
            const statusBg =
              topic.status === 'Mastered'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : topic.status === 'In Progress'
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : topic.status === 'Revision Due'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-100 text-slate-600 border-slate-200';

            return (
              <div
                key={topic.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{topic.subtopic}</span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {topic.module}
                    </span>
                  </div>
                  {topic.notes && (
                    <p className="text-xs text-slate-600 italic max-w-3xl">{topic.notes}</p>
                  )}
                  <div className="flex items-center space-x-3 text-xs text-slate-500">
                    <span>Practiced: <strong className="text-slate-800">{topic.questionsPracticed} Qs</strong></span>
                    <span>•</span>
                    <span>Accuracy: <strong className="text-indigo-600">{topic.accuracy}%</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end md:self-auto text-xs">
                  <select
                    value={topic.status}
                    onChange={(e) => handleUpdateStatus(topic, e.target.value as any)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer ${statusBg}`}
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setEditingTopic(topic)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200"
                  >
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ITPreparation;
