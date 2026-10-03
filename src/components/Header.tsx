// src/components/Header.tsx
import React from 'react';
import { Calendar, ShieldAlert } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showExamConfigWarning?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, showExamConfigWarning }) => {
  const todayStr = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="mb-6 space-y-3">
      {/* Official Exam Configuration Verification Alert as required */}
      {showExamConfigWarning && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-amber-900 text-xs md:text-sm flex items-start space-x-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold text-amber-800">
              Exam Configuration Notice:
            </span>{' '}
            Verify this configuration against the official IBPS notification for your recruitment cycle. You can customize section questions, marks, and negative marking anytime in{' '}
            <NavLink to="/settings" className="underline font-semibold hover:text-amber-950">
              Settings &rarr; Exam Configuration
            </NavLink>
            .
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs md:text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center space-x-3 text-xs md:text-sm text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="font-semibold text-slate-700">{todayStr}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
