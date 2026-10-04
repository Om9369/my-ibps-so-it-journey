// src/components/Sidebar.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  Cpu,
  PlayCircle,
  FileText,
  Database,
  AlertCircle,
  Repeat,
  CalendarCheck,
  TrendingUp,
  History,
  Globe,
  BookOpen,
  Target,
  Settings,
  Menu,
  X,
  Sparkles,
  Compass,
  PenTool,
} from 'lucide-react';

interface SidebarProps {
  hasActiveMock?: boolean;
}

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Daily Checklist', path: '/daily-checklist', icon: CheckSquare },
  { name: 'Full Syllabus', path: '/full-syllabus', icon: BookOpen, highlight: true },
  { name: 'Adaptive Syllabus', path: '/syllabus', icon: Compass },
  { name: 'Study Log', path: '/study-log', icon: Clock },
  { name: 'IT Preparation', path: '/it-preparation', icon: Cpu },
  { name: 'Practice', path: '/practice', icon: PlayCircle },
  { name: 'Mains Descriptive', path: '/mains-descriptive', icon: PenTool },
  { name: 'Mock Tests', path: '/mock-tests', icon: FileText, highlight: true },
  { name: 'Question Bank', path: '/question-bank', icon: Database },
  { name: 'Mistake Notebook', path: '/mistake-notebook', icon: AlertCircle },
  { name: 'Revision Tracker', path: '/revision-tracker', icon: Repeat },
  { name: 'Sunday Review', path: '/sunday-review', icon: CalendarCheck, isSundaySpecial: true },
  { name: 'My Growth', path: '/my-growth', icon: TrendingUp },
  { name: 'Weekly History', path: '/weekly-history', icon: History },
  { name: 'Current Affairs', path: '/current-affairs', icon: Globe },
  { name: 'Vocabulary', path: '/vocabulary', icon: BookOpen },
  { name: 'Goals', path: '/goals', icon: Target },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ hasActiveMock }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const today = new Date();
  const isSunday = today.getDay() === 0;
  const isKickoffSunday = isSunday && today.toISOString().split('T')[0] <= '2026-10-04';

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 text-white p-3 sticky top-0 z-40 shadow">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg text-white">
            IB
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight leading-tight">My IBPS SO IT Journey</div>
            <div className="text-[10px] text-indigo-300">Daily Discipline. Weekly Analysis.</div>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-slate-950 text-slate-200 flex flex-col border-r border-slate-800/80 transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand / Title Header */}
        <div className="p-5 border-b border-slate-800/80 bg-slate-950">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-indigo-500/20">
              IT
            </div>
            <div>
              <h1 className="font-black text-base tracking-tight text-white leading-tight">
                My IBPS SO IT Journey
              </h1>
              <span className="inline-block text-[10px] uppercase font-semibold tracking-wider text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/50 mt-0.5">
                Scale I Preparation
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">
            Daily Discipline. Weekly Analysis. Continuous Improvement.
          </p>
        </div>

        {/* Active Mock Alert Banner if running */}
        {hasActiveMock && (
          <div className="mx-3 mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
            <span className="flex items-center space-x-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping mr-1"></span>
              Test In Progress
            </span>
            <NavLink
              to="/mock-tests"
              onClick={() => setMobileOpen(false)}
              className="px-2 py-0.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-[11px] transition-colors"
            >
              Resume
            </NavLink>
          </div>
        )}

        {/* Sunday Focus / Kickoff Highlight Badge */}
        {isKickoffSunday ? (
          <div className="mx-3 mt-3 p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="font-semibold">Prep Kickoff • Week 1 Starts Tomorrow!</span>
          </div>
        ) : isSunday ? (
          <div className="mx-3 mt-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">Sunday Mock Day! Complete your Full Mock today.</span>
          </div>
        ) : null}

        {/* Navigation Links list */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 shrink-0 opacity-80 group-hover:opacity-100" />
                  <span>{item.name}</span>
                </div>
                {item.highlight && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Mocks
                  </span>
                )}
                {item.isSundaySpecial && isSunday && !isKickoffSunday && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Workspace Info Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 text-xs text-slate-400 flex items-center justify-between">
          <div>
            <div className="font-semibold text-slate-300 text-[11px]">Private Preparation Hub</div>
            <div className="text-[10px] text-slate-500">Local-First • Single User</div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" title="Local Storage Active"></span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
