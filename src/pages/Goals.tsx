// src/pages/Goals.tsx
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { getAllItems, putItem, deleteItem } from '../services/db';
import { PrepGoal } from '../types';
import { Target, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const Goals: React.FC = () => {
  const [goals, setGoals] = useState<PrepGoal[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [timeframe, setTimeframe] = useState<PrepGoal['timeframe']>('Daily');
  const [targetValue, setTargetValue] = useState(50);
  const [currentValue, setCurrentValue] = useState(0);
  const [unit, setUnit] = useState('Questions');

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    const list = await getAllItems<PrepGoal>('goals');
    setGoals(list);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const g: PrepGoal = {
      id: `goal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      timeframe,
      targetValue: Number(targetValue) || 10,
      currentValue: Number(currentValue) || 0,
      unit: unit.trim() || 'Units',
      isAchieved: Number(currentValue) >= Number(targetValue),
    };

    await putItem('goals', g);
    setGoals([...goals, g]);
    setIsAdding(false);
    setTitle('');
  };

  const handleUpdateCurrent = async (g: PrepGoal, val: number) => {
    const updated: PrepGoal = {
      ...g,
      currentValue: val,
      isAchieved: val >= g.targetValue,
    };
    await putItem('goals', updated);
    setGoals(goals.map((item) => (item.id === g.id ? updated : item)));
  };

  const handleDelete = async (id: string) => {
    await deleteItem('goals', id);
    setGoals(goals.filter((g) => g.id !== id));
  };

  return (
    <div className="space-y-6 pb-12">
      <Header
        title="Preparation Targets & Milestones"
        subtitle="Manage short-term daily question volumes, weekly mock quotas, and syllabus mastery goals."
      />

      <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-slate-800 text-xs">Active Targets: {goals.length}</span>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>Add Target Goal</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleSave} className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Add New Goal Target</h3>
            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400">✕</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Goal Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Complete 50 DBMS Questions"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Timeframe</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Exam Cycle">Exam Cycle</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Unit</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Questions / Hours / Mocks"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Value</label>
              <input
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Current Value</label>
              <input
                type="number"
                value={currentValue}
                onChange={(e) => setCurrentValue(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
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
              Save Goal
            </button>
          </div>
        </form>
      )}

      {/* Grid of Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((g) => {
          const pct = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));
          return (
            <div key={g.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[10px] uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {g.timeframe} Target
                </span>
                <button onClick={() => handleDelete(g.id)} className="text-slate-400 hover:text-rose-600 p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="font-bold text-slate-900 text-sm">{g.title}</h3>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>
                    {g.currentValue} / {g.targetValue} {g.unit}
                  </span>
                  <span className="font-bold text-slate-900">{pct}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pct >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-1.5">
                  <span className="text-slate-500">Update count:</span>
                  <input
                    type="number"
                    value={g.currentValue}
                    onChange={(e) => handleUpdateCurrent(g, Number(e.target.value))}
                    className="w-16 p-1 text-center font-bold border border-slate-200 rounded-lg bg-slate-50"
                  />
                </div>
                {pct >= 100 && (
                  <span className="text-emerald-700 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Target Reached!</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Goals;
