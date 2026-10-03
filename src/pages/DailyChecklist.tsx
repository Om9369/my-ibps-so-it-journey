// src/pages/DailyChecklist.tsx
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { getAllItems, putItem, deleteItem } from '../services/db';
import { DailyChecklistItem, Subject } from '../types';
import { CheckSquare, Plus, Trash2, Calendar, Sparkles, Clock, CheckCircle, BookOpen } from 'lucide-react';
import { getCurriculumTasksForDate } from '../data/curriculum';

const CATEGORIES = ['IT', 'Reasoning', 'English', 'Quant', 'Banking & CA', 'Revision', 'Custom'] as const;

export const DailyChecklist: React.FC = () => {
  const [items, setItems] = useState<DailyChecklistItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<(typeof CATEGORIES)[number]>('IT');
  const [newSubject, setNewSubject] = useState<Subject>('IT');
  const [newTopic, setNewTopic] = useState('');
  const [newEstMinutes, setNewEstMinutes] = useState(30);

  useEffect(() => {
    loadChecklist();
  }, [selectedDate]);

  const loadChecklist = async () => {
    const all = await getAllItems<DailyChecklistItem>('checklist');
    const filtered = all.filter((i) => !i.date || i.date === selectedDate);
    setItems(filtered);
  };

  const handleToggle = async (item: DailyChecklistItem) => {
    const updated = { ...item, completed: !item.completed };
    await putItem('checklist', updated);
    setItems(items.map((i) => (i.id === item.id ? updated : i)));
  };

  const handleActualTimeChange = async (item: DailyChecklistItem, minutes: number) => {
    const updated = { ...item, actualMinutes: minutes };
    await putItem('checklist', updated);
    setItems(items.map((i) => (i.id === item.id ? updated : i)));
  };

  const handleNotesChange = async (item: DailyChecklistItem, notes: string) => {
    const updated = { ...item, notes };
    await putItem('checklist', updated);
    setItems(items.map((i) => (i.id === item.id ? updated : i)));
  };

  const handleDelete = async (id: string) => {
    await deleteItem('checklist', id);
    setItems(items.filter((i) => i.id !== id));
  };

  const handleAddNewTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const task: DailyChecklistItem = {
      id: `chk-custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      category: newCategory,
      title: newTitle.trim(),
      subject: newSubject,
      topic: newTopic || 'General',
      estimatedMinutes: Number(newEstMinutes) || 30,
      actualMinutes: 0,
      completed: false,
      date: selectedDate,
    };

    await putItem('checklist', task);
    setItems([...items, task]);
    setNewTitle('');
    setNewTopic('');
    setIsAddingNew(false);
  };

  // Generate Next Day Checklist from Progressive Syllabus + Carried Unfinished Tasks
  const handleAutoGenerateNextDay = async () => {
    const curr = new Date(selectedDate);
    curr.setDate(curr.getDate() + 1);
    const nextDateStr = curr.toISOString().split('T')[0];

    const currentUnfinished = items.filter((i) => !i.completed);
    const progressiveTasks = getCurriculumTasksForDate(nextDateStr);
    const carried: DailyChecklistItem[] = [];

    // Carry forward unfinished tasks
    for (const u of currentUnfinished) {
      carried.push({
        ...u,
        id: `chk-carry-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        date: nextDateStr,
        completed: false,
        notes: `[Carried from ${selectedDate}] ${u.notes || ''}`.trim(),
      });
    }

    const nextBatch = [...carried, ...progressiveTasks];
    for (const g of nextBatch) {
      await putItem('checklist', g);
    }

    setSelectedDate(nextDateStr);
    alert(`Generated progressive checklist for ${nextDateStr} (3.0 Hours allocated) with ${carried.length} carried task(s)!`);
  };

  // Populate progressive curriculum for currently empty day
  const handleLoadCurriculumForSelectedDate = async () => {
    const progressiveTasks = getCurriculumTasksForDate(selectedDate);
    for (const t of progressiveTasks) {
      await putItem('checklist', t);
    }
    await loadChecklist();
  };

  const completedCount = items.filter((i) => i.completed).length;
  const progressPct = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;
  const totalEstMinutes = items.reduce((acc, i) => acc + (i.estimatedMinutes || 0), 0);
  const totalActMinutes = items.reduce((acc, i) => acc + (i.actualMinutes || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      <Header
        title="Daily Checklist"
        subtitle="Maintain daily study discipline across Professional Knowledge, Reasoning, English, Quant, and Current Affairs."
      />

      {/* Date Bar & Generation Actions */}
      <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-indigo-600 shrink-0" />
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Task</span>
          </button>

          <button
            onClick={handleAutoGenerateNextDay}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-colors border border-slate-200"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Generate Next Day Checklist</span>
          </button>
        </div>
      </div>

      {/* Progress & Time Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Tasks Completed</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {completedCount} <span className="text-xs text-slate-400 font-semibold">/ {items.length}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">{items.length - completedCount} pending</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Completion %</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">{progressPct}%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Discipline index</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Planned Study Target</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{Math.round((totalEstMinutes / 60) * 10) / 10}h</div>
          <div className="text-[11px] text-indigo-600 font-bold mt-0.5">3.0h / Day Goal</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Logged Time</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{Math.round((totalActMinutes / 60) * 10) / 10}h</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {totalActMinutes >= 180 ? 'Target Achieved' : `${Math.max(0, 180 - totalActMinutes)}m remaining`}
          </div>
        </div>
      </div>

      {/* Add Custom Task Form Drawer */}
      {isAddingNew && (
        <form onSubmit={handleAddNewTask} className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-sm">Add New Preparation Task</h3>
            <button type="button" onClick={() => setIsAddingNew(false)} className="text-xs text-slate-400 hover:text-slate-600">
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Task Description</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Practice 15 Data Structures questions on AVL balance"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => {
                  const cat = e.target.value as any;
                  setNewCategory(cat);
                  if (cat !== 'Custom') setNewSubject(cat === 'Revision' ? 'IT' : cat);
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Estimated Minutes</label>
              <input
                type="number"
                value={newEstMinutes}
                onChange={(e) => setNewEstMinutes(Number(e.target.value))}
                min={5}
                max={360}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow"
            >
              Save Task
            </button>
          </div>
        </form>
      )}

      {/* Empty State with Progressive Syllabus loader */}
      {items.length === 0 && (
        <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">No tasks logged for {selectedDate}</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Load today's structured 3.0-hour syllabus moving from foundational concepts to advanced bank exam topics.
            </p>
          </div>
          <button
            onClick={handleLoadCurriculumForSelectedDate}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Load Progressive Syllabus for this Date (3.0 Hours)</span>
          </button>
        </div>
      )}

      {/* Task List Grouped by Category */}
      <div className="space-y-6">
        {CATEGORIES.map((cat) => {
          const catTasks = items.filter((i) => i.category === cat);
          if (catTasks.length === 0) return null;

          return (
            <div key={cat} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  <h3 className="font-bold text-slate-900 text-sm">{cat}</h3>
                  <span className="text-[11px] text-slate-400 font-medium">({catTasks.length})</span>
                </div>
                <div className="text-xs text-slate-500 font-semibold">
                  {catTasks.filter((t) => t.completed).length} / {catTasks.length} Done
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {catTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                      task.completed ? 'bg-slate-50/50' : 'hover:bg-slate-50/30'
                    }`}
                  >
                    <div className="flex items-start space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggle(task)}
                        className="w-5 h-5 rounded-md text-indigo-600 focus:ring-indigo-500 cursor-pointer mt-0.5"
                      />
                      <div className="space-y-1">
                        <div
                          className={`text-sm font-semibold cursor-pointer ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}
                          onClick={() => handleToggle(task)}
                        >
                          {task.title}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                          <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-600 border border-slate-200">
                            {task.subject}
                          </span>
                          {task.topic && (
                            <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-600 border border-slate-200">
                              {task.topic}
                            </span>
                          )}
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>Est: {task.estimatedMinutes}m</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 self-end md:self-auto text-xs">
                      <div className="flex items-center space-x-1">
                        <span className="text-slate-500 font-medium">Actual:</span>
                        <input
                          type="number"
                          value={task.actualMinutes || 0}
                          onChange={(e) => handleActualTimeChange(task, Number(e.target.value))}
                          className="w-14 p-1 text-center font-bold text-slate-800 bg-slate-50 rounded-lg border border-slate-200"
                        />
                        <span className="text-slate-400 text-[11px]">m</span>
                      </div>

                      <input
                        type="text"
                        placeholder="Add quick notes..."
                        value={task.notes || ''}
                        onChange={(e) => handleNotesChange(task, e.target.value)}
                        className="text-xs p-1.5 rounded-lg border border-slate-200 w-36 md:w-48 bg-slate-50/50"
                      />

                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyChecklist;
