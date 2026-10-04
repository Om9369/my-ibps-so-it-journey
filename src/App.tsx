// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DailyChecklist from './pages/DailyChecklist';
import StudyLog from './pages/StudyLog';
import DailyAnalysis from './pages/DailyAnalysis';
import ITPreparation from './pages/ITPreparation';
import Syllabus from './pages/Syllabus';
import Practice from './pages/Practice';
import MainsDescriptive from './pages/MainsDescriptive';
import MockTests from './pages/MockTests';
import QuestionBank from './pages/QuestionBank';
import MistakeNotebook from './pages/MistakeNotebook';
import RevisionTracker from './pages/RevisionTracker';
import SundayReview from './pages/SundayReview';
import MyGrowth from './pages/MyGrowth';
import WeeklyHistory from './pages/WeeklyHistory';
import CurrentAffairs from './pages/CurrentAffairs';
import Vocabulary from './pages/Vocabulary';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import { initAppDatabase, getActiveMockDraft } from './services/db';

const App: React.FC = () => {
  const [hasActiveMock, setHasActiveMock] = useState(false);

  useEffect(() => {
    initAppDatabase();
    const active = getActiveMockDraft();
    if (active && active.status === 'In Progress') {
      setHasActiveMock(true);
    }
  }, []);

  return (
    <Router>
      <div className="flex min-h-screen bg-slate-100 text-slate-900 font-sans antialiased">
        <Sidebar hasActiveMock={hasActiveMock} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/daily-checklist" element={<DailyChecklist />} />
            <Route path="/study-log" element={<StudyLog />} />
            <Route path="/daily-analysis" element={<DailyAnalysis />} />
            <Route path="/it-preparation" element={<ITPreparation />} />
            <Route path="/syllabus" element={<Syllabus />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/mains-descriptive" element={<MainsDescriptive />} />
            <Route path="/mock-tests" element={<MockTests />} />
            <Route path="/question-bank" element={<QuestionBank />} />
            <Route path="/mistake-notebook" element={<MistakeNotebook />} />
            <Route path="/revision-tracker" element={<RevisionTracker />} />
            <Route path="/sunday-review" element={<SundayReview />} />
            <Route path="/my-growth" element={<MyGrowth />} />
            <Route path="/weekly-history" element={<WeeklyHistory />} />
            <Route path="/current-affairs" element={<CurrentAffairs />} />
            <Route path="/vocabulary" element={<Vocabulary />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
