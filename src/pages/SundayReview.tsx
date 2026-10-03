// src/pages/SundayReview.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { getAllItems, putItem } from '../services/db';
import { MockTestAttempt, StudySession, MistakeEntry } from '../types';
import {
  CalendarCheck,
  CheckCircle2,
  PlayCircle,
  FileText,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Sparkles,
  BookOpen,
  Calendar,
} from 'lucide-react';

interface SundayStep {
  id: number;
  title: string;
  desc: string;
  actionText: string;
  route?: string;
  isComplete: boolean;
}

export const SundayReview: React.FC = () => {
  const navigate = useNavigate();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [nextWeekPlan, setNextWeekPlan] = useState('');
  const [weeklyTargetHours, setWeeklyTargetHours] = useState(30);
  const [weakTopicsFocus, setWeakTopicsFocus] = useState('Concurrency & B+ Trees, Pipelining hazards');
  const [isPlanSaved, setIsPlanSaved] = useState(false);

  // Load Sunday state from localStorage
  useEffect(() => {
    try {
      const savedSteps = localStorage.getItem('sunday_workflow_steps');
      if (savedSteps) setCompletedSteps(JSON.parse(savedSteps));
      const savedPlan = localStorage.getItem('sunday_next_week_plan');
      if (savedPlan) setNextWeekPlan(savedPlan);
    } catch {}
  }, []);

  const toggleStep = (id: number) => {
    const next = completedSteps.includes(id)
      ? completedSteps.filter((s) => s !== id)
      : [...completedSteps, id];
    setCompletedSteps(next);
    localStorage.setItem('sunday_workflow_steps', JSON.stringify(next));
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sunday_next_week_plan', nextWeekPlan);
    setIsPlanSaved(true);
    setTimeout(() => setIsPlanSaved(false), 3000);
  };

  const STEPS: SundayStep[] = [
    {
      id: 1,
      title: 'Start Full IBPS SO IT Mock Test',
      desc: 'Simulate full exam conditions: quiet environment, strict timer, no pauses.',
      actionText: 'Launch Mock Test',
      route: '/mock-tests',
      isComplete: completedSteps.includes(1),
    },
    {
      id: 2,
      title: 'Complete Timed Exam Simulation',
      desc: 'Attempt all sections within the allotted official time limit.',
      actionText: 'View Active Test',
      route: '/mock-tests',
      isComplete: completedSteps.includes(2),
    },
    {
      id: 3,
      title: 'Audit Overall & Sectional Scores',
      desc: 'Check total marks, accuracy %, and IT module breakdown (DBMS, OS, Networks).',
      actionText: 'View Test Results',
      route: '/mock-tests',
      isComplete: completedSteps.includes(3),
    },
    {
      id: 4,
      title: 'Question-by-Question Deep Dive',
      desc: 'Analyze every wrong and unattempted question. Understand conceptual gaps.',
      actionText: 'Review Questions',
      route: '/mock-tests',
      isComplete: completedSteps.includes(4),
    },
    {
      id: 5,
      title: 'Log Errors in Mistake Notebook',
      desc: 'Categorize reasons: Concept gap, Careless mistake, Calculation error, Time pressure.',
      actionText: 'Open Mistake Notebook',
      route: '/mistake-notebook',
      isComplete: completedSteps.includes(5),
    },
    {
      id: 6,
      title: 'Add Weak Concepts to Revision Tracker',
      desc: 'Schedule spaced repetition for misunderstood algorithms or protocols.',
      actionText: 'Open Revision Tracker',
      route: '/revision-tracker',
      isComplete: completedSteps.includes(6),
    },
    {
      id: 7,
      title: 'Review Weekly Study & Practice Statistics',
      desc: 'Audit total study hours, deep focus ratio, and practice volume on My Growth.',
      actionText: 'View Growth Trends',
      route: '/my-growth',
      isComplete: completedSteps.includes(7),
    },
    {
      id: 8,
      title: 'Lock In Next Week’s Action Plan',
      desc: 'Define focus topics, weekly question volume, and study schedule below.',
      actionText: 'Formulate Plan Below',
      isComplete: completedSteps.includes(8),
    },
  ];

  const allComplete = STEPS.every((s) => s.isComplete);

  return (
    <div className="space-y-6 pb-12">
      <Header
        title="Sunday Full Mock & Weekly Review Workflow"
        subtitle="The cornerstone ritual: Timed Mock &rarr; Honest Error Audit &rarr; Mistake Logging &rarr; Strategic Planning."
      />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 rounded-2xl shadow-md space-y-3">
        <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Sunday Dedicated Exam Loop</span>
        </div>
        <h2 className="text-xl md:text-2xl font-black tracking-tight">
          Sunday Mock Ritual (8-Step Execution)
        </h2>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Sunday is your primary full-mock benchmark day. Follow each sequential step to convert mock test errors into permanent conceptual mastery before the recruitment exam.
        </p>

        <div className="pt-2 flex items-center space-x-3 text-xs">
          <span className="font-bold text-emerald-400">
            {completedSteps.length} of {STEPS.length} Steps Completed
          </span>
          <div className="flex-1 max-w-xs bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${(completedSteps.length / STEPS.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 8-STEP WORKFLOW LIST (Requirement #18) */}
      <div className="space-y-3">
        {STEPS.map((step) => (
          <div
            key={step.id}
            className={`p-4 md:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              step.isComplete
                ? 'bg-emerald-50/40 border-emerald-200'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-start space-x-3.5 flex-1">
              <button
                onClick={() => toggleStep(step.id)}
                className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                  step.isComplete
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 border border-slate-300 text-slate-400 hover:border-slate-400'
                }`}
              >
                {step.isComplete ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{step.id}</span>}
              </button>

              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <h4 className={`text-sm font-bold ${step.isComplete ? 'text-slate-700 line-through' : 'text-slate-900'}`}>
                    Step {step.id}: {step.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-500">{step.desc}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-end sm:self-auto">
              {step.route && (
                <button
                  onClick={() => navigate(step.route!)}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 flex items-center space-x-1"
                >
                  <span>{step.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => toggleStep(step.id)}
                className={`px-3 py-2 text-xs font-bold rounded-xl border ${
                  step.isComplete
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {step.isComplete ? 'Done ✓' : 'Mark Done'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* STEP 8: NEXT WEEK PLAN FORM */}
      <form onSubmit={handleSavePlan} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Strategic Plan for the Upcoming Week</h3>
            <p className="text-xs text-slate-500">Lock in your targets for Monday through Saturday.</p>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow"
          >
            Save Weekly Plan
          </button>
        </div>

        {isPlanSaved && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Next week's preparation blueprint saved!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Study Hours (Week)</label>
            <input
              type="number"
              value={weeklyTargetHours}
              onChange={(e) => setWeeklyTargetHours(Number(e.target.value))}
              min={10}
              max={70}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Weak Focus Topics to Conquer</label>
            <input
              type="text"
              value={weakTopicsFocus}
              onChange={(e) => setWeakTopicsFocus(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-slate-700 text-xs mb-1">Daily Milestones & Commitments</label>
          <textarea
            rows={4}
            value={nextWeekPlan}
            onChange={(e) => setNextWeekPlan(e.target.value)}
            placeholder="• Mon: Deep dive into Database Concurrency & 2PL&#10;• Tue: Complete 30 Operating System scheduling questions&#10;• Wed: Reasoning Syllogism drills + English cloze tests&#10;• Thu: Networking TCP 3-way handshake & Subnetting&#10;• Fri: Review all open mistakes in Mistake Notebook&#10;• Sat: Sectional mock test + speed drills"
            className="w-full text-xs p-3 rounded-xl border border-slate-200 font-mono"
          />
        </div>
      </form>
    </div>
  );
};

export default SundayReview;
