// src/pages/MyGrowth.tsx
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { computeGrowthAnalytics, GrowthAnalyticsData } from '../services/analyticsService';
import {
  TrendingUp,
  Award,
  Clock,
  Target,
  AlertCircle,
  Cpu,
  BarChart2,
  PieChart as PieIcon,
  ShieldCheck,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';

export const MyGrowth: React.FC = () => {
  const [data, setData] = useState<GrowthAnalyticsData | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const analytics = await computeGrowthAnalytics();
    setData(analytics);
  };

  if (!data) {
    return <div className="p-8 text-center text-slate-400 text-xs">Computing growth analytics...</div>;
  }

  const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="space-y-6 pb-12">
      <Header
        title="My Growth & Performance Analytics"
        subtitle="Long-term performance trends across mock scores, accuracy, IT module mastery, and mistake patterns."
      />

      {/* High-Level Benchmark Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Mocks Completed</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">{data.totalMocksCompleted}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Strict timed tests</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Average Accuracy</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{data.avgAccuracy}%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across all mock tests</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Deep Work Hours</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {data.studyConsistency.deepFocusHours}h
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Total {data.studyConsistency.totalHours}h logged
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Avg Time / Question</div>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {data.timeManagement.avgTimePerQuestionSeconds}s
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Target: 45s / question</div>
        </div>
      </div>

      {/* TRENDS: Score Trend Over Time & Accuracy Trend (Requirement #17) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Trend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Mock Score Trend (% Score)</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-semibold">Real Mock Data</span>
          </div>

          <div className="h-60 w-full pt-2">
            {data.scoreTrend.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                Complete at least one full mock test to generate score trends.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.scoreTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="percentage"
                    name="Score %"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#4f46e5' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Accuracy Trend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Accuracy Trend (% Accuracy)</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-semibold">Precision metric</span>
          </div>

          <div className="h-60 w-full pt-2">
            {data.accuracyTrend.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                Complete at least one mock test to visualize accuracy.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.accuracyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    name="Accuracy %"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* IT MODULE PERFORMANCE & DIFFICULTY DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* IT Module Breakdown (Requirement #17: DBMS, OS, Networks, etc.) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>Professional Knowledge: IT Module Accuracy %</span>
          </h3>

          <div className="h-60 w-full pt-2">
            {data.itModuleBreakdown.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No IT module mock attempts recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.itModuleBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="module" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="accuracy" name="Accuracy %" radius={[6, 6, 0, 0]}>
                    {data.itModuleBreakdown.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Difficulty Analysis (Requirement #12: Easy, Medium, Hard) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <BarChart2 className="w-4 h-4 text-emerald-600" />
            <span>Performance by Question Difficulty</span>
          </h3>
          <p className="text-xs text-slate-500">
            Descriptive performance breakdown across Easy, Medium, and Hard tiers (no arbitrary ability rating).
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {data.difficultyStats.map((st) => (
              <div key={st.difficulty} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-1">
                <div
                  className={`text-xs font-bold uppercase ${
                    st.difficulty === 'Easy'
                      ? 'text-emerald-700'
                      : st.difficulty === 'Medium'
                      ? 'text-indigo-700'
                      : 'text-rose-700'
                  }`}
                >
                  {st.difficulty}
                </div>
                <div className="text-xl font-black text-slate-900">{st.accuracy}%</div>
                <div className="text-[11px] text-slate-500">
                  {st.correct}C • {st.incorrect}W ({st.attempted} Qs)
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <strong>Key Insight: </strong>
            {data.difficultyStats.find((d) => d.difficulty === 'Easy')?.incorrect || 0 > 0
              ? 'Warning: Errors are occurring in Easy questions. Prioritize eliminating careless mistakes and reading questions thoroughly.'
              : 'Consistent accuracy on Easy questions. Focus on mastering edge-case algorithms in Medium and Hard categories.'}
          </div>
        </div>
      </div>

      {/* MISTAKE PATTERNS & ROOT CAUSES (Requirement #9 & #17) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Mistake Patterns & Root Causes Breakdown</span>
          </h3>
          <span className="text-xs text-slate-500">Identifies repetitive cognitive errors</span>
        </div>

        {data.mistakePatternCounts.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No mistakes recorded yet. Errors logged during practice and full mocks will be aggregated here.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {data.mistakePatternCounts.map((pat) => (
              <div key={pat.reason} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-xs">{pat.reason}</div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl font-black text-rose-600">{pat.count}</span>
                  <span className="text-[11px] text-slate-500">total errors</span>
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold">
                  {pat.resolvedCount} resolved
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGrowth;
