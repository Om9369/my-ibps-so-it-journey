// src/pages/RevisionTracker.tsx
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { getAllItems, putItem, deleteItem } from '../services/db';
import { RevisionItem, Subject, ITModule } from '../types';
import { Repeat, Plus, Trash2, Check, Calendar, Clock, BookOpen } from 'lucide-react';

const SUBJECTS: Subject[] = ['IT', 'Reasoning', 'English', 'Quant', 'Banking & CA'];

export const RevisionTracker: React.FC = () => {
  const [items, setItems] = useState<RevisionItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<Subject>('IT');
  const [itModule, setItModule] = useState<string>('DBMS');
  const [topic, setTopic] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [intervalDays, setIntervalDays] = useState(3);

  useEffect(() => {
    loadRevisions();
  }, []);

  const loadRevisions = async () => {
    const list = await getAllItems<RevisionItem>('revisions');
    setItems(list.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
  };

  const handleAddNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const due = new Date();
    due.setDate(due.getDate() + (Number(intervalDays) || 3));

    const item: RevisionItem = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      subject,
      itModule: subject === 'IT' ? (itModule as ITModule) : undefined,
      topic: topic || 'General',
      title: title.trim(),
      keyPoints,
      addedDate: new Date().toISOString(),
      dueDate: due.toISOString().split('T')[0],
      intervalDays: Number(intervalDays) || 3,
      repetitionCount: 0,
      status: 'Pending',
    };

    await putItem('revisions', item);
    setItems([...items, item]);
    setIsAdding(false);
    setTitle('');
    setTopic('');
    setKeyPoints('');
  };

  const handleMarkRevised = async (item: RevisionItem) => {
    const nextInterval = item.intervalDays * 2; // Spaced repetition doubling
    const nextDue = new Date();
    nextDue.setDate(nextDue.getDate() + nextInterval);

    const updated: RevisionItem = {
      ...item,
      repetitionCount: item.repetitionCount + 1,
      lastRevisedDate: new Date().toISOString().split('T')[0],
      dueDate: nextDue.toISOString().split('T')[0],
      intervalDays: nextInterval,
      status: item.repetitionCount >= 3 ? 'Completed' : 'Pending',
    };

    await putItem('revisions', updated);
    setItems(items.map((i) => (i.id === item.id ? updated : i)));
  };

  const handleDelete = async (id: string) => {
    await deleteItem('revisions', id);
    setItems(items.filter((i) => i.id !== id));
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const dueToday = items.filter((i) => i.status === 'Pending' && i.dueDate <= todayStr);
  const upcoming = items.filter((i) => i.status === 'Pending' && i.dueDate > todayStr);
  const completed = items.filter((i) => i.status === 'Completed');

  return (
    <div className="space-y-6 pb-12">
      <Header
        title="Spaced Repetition & Revision Tracker"
        subtitle="Combat the forgetting curve with spaced intervals: 1 day, 3 days, 7 days, 14 days, 30 days."
      />

      {/* Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Due Today</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{dueToday.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">High priority</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Upcoming</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">{upcoming.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Scheduled revisions</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Mastered (4x+)</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{completed.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Long-term memory</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="text-xs font-semibold text-slate-500">Action</div>
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow flex items-center justify-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Revision Topic</span>
          </button>
        </div>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleAddNew} className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm space-y-4 text-xs">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-sm">Add Concept to Revision Queue</h3>
            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Concept Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ACID Properties & Conflict Serializability"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">First Interval (Days)</label>
              <input
                type="number"
                min={1}
                max={30}
                value={intervalDays}
                onChange={(e) => setIntervalDays(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Key Formulas / Summary Points</label>
            <textarea
              rows={2}
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder="Crucial rules, formulas, exceptions to remember..."
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow"
            >
              Schedule Revision
            </button>
          </div>
        </form>
      )}

      {/* REVISION QUEUE: Due Today */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-rose-50/60 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-rose-600" />
            <h3 className="font-bold text-rose-950 text-sm">Due for Revision Today</h3>
            <span className="text-xs text-rose-600 font-bold">({dueToday.length})</span>
          </div>
        </div>

        {dueToday.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            🎉 All scheduled revisions for today are complete!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {dueToday.map((item) => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                      {item.subject}
                    </span>
                    <span className="text-[11px] text-slate-500">Repetition #{item.repetitionCount + 1}</span>
                  </div>
                  {item.keyPoints && <p className="text-slate-600 italic">{item.keyPoints}</p>}
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleMarkRevised(item)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow flex items-center space-x-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>Revised & Next Interval ({item.intervalDays * 2}d)</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* UPCOMING REVISIONS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
          <h3 className="font-bold text-slate-900 text-sm">Upcoming Scheduled Revisions ({upcoming.length})</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {upcoming.map((item) => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <div className="font-bold text-slate-800">{item.title}</div>
                <div className="text-[11px] text-slate-400">
                  {item.subject} • Due on {item.dueDate} (in {item.intervalDays} days) • Repetition #{item.repetitionCount}
                </div>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 self-end sm:self-auto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevisionTracker;
