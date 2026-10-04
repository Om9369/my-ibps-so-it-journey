// src/pages/FullSyllabus.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import {
  FULL_SYLLABUS_DATA,
  EXAM_PATTERN_SCHEME,
  FullSyllabusSubject,
  FullSyllabusTopic,
} from '../data/fullSyllabusData';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  Printer,
  Sparkles,
  Compass,
  ArrowRight,
  Cpu,
  Database,
  Server,
  Network,
  Code,
  Shield,
  CreditCard,
  Cloud,
  TrendingUp,
  Layers,
  HelpCircle,
  Award,
  Clock,
  PenTool,
  Globe,
  FileText,
  ListCollapse,
  ListOrdered,
} from 'lucide-react';

const SECTIONS = [
  'All Sections',
  'Professional Knowledge',
  'Reasoning Ability',
  'Quantitative Aptitude',
  'English Language',
  'General & Banking Awareness',
  'Mains Descriptive',
] as const;

type SectionFilter = (typeof SECTIONS)[number];

export const FullSyllabus: React.FC = () => {
  const navigate = useNavigate();

  // Filter & Search State
  const [selectedSection, setSelectedSection] = useState<SectionFilter>('All Sections');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  // Completed Topics (persistent in localStorage)
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>([]);

  // Expanded Subject Cards
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});

  // Show Pattern Scheme Modal / Banner toggle
  const [showPatternDetails, setShowPatternDetails] = useState(false);

  // Load completed topics on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('full_syllabus_completed_topics');
      if (saved) {
        setCompletedTopicIds(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Error loading completed syllabus topics:', e);
    }

    // Default expand first 3 subjects for immediate viewing
    const initialExpanded: Record<string, boolean> = {};
    FULL_SYLLABUS_DATA.slice(0, 3).forEach((sub) => {
      initialExpanded[sub.id] = true;
    });
    setExpandedSubjects(initialExpanded);
  }, []);

  // Toggle topic completion
  const handleToggleTopic = (topicId: string) => {
    const next = completedTopicIds.includes(topicId)
      ? completedTopicIds.filter((id) => id !== topicId)
      : [...completedTopicIds, topicId];
    setCompletedTopicIds(next);
    localStorage.setItem('full_syllabus_completed_topics', JSON.stringify(next));
  };

  // Expand / Collapse all
  const handleExpandAll = () => {
    const allExp: Record<string, boolean> = {};
    FULL_SYLLABUS_DATA.forEach((s) => {
      allExp[s.id] = true;
    });
    setExpandedSubjects(allExp);
  };

  const handleCollapseAll = () => {
    setExpandedSubjects({});
  };

  const toggleSubject = (subId: string) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subId]: !prev[subId],
    }));
  };

  // Filtered Subjects & Topics
  const filteredData = useMemo(() => {
    return FULL_SYLLABUS_DATA.map((subject) => {
      // Check section match
      if (selectedSection !== 'All Sections' && subject.section !== selectedSection) {
        return null;
      }

      // Filter topics inside subject
      const matchingTopics = subject.topics.filter((topic) => {
        if (priorityFilter !== 'All' && topic.priority !== priorityFilter) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = topic.name.toLowerCase().includes(q);
          const matchesSubtopics = topic.subtopics.some((st) => st.toLowerCase().includes(q));
          const matchesFocus = topic.keyFocusAreas.toLowerCase().includes(q);
          const matchesSubject = subject.name.toLowerCase().includes(q);
          return matchesTitle || matchesSubtopics || matchesFocus || matchesSubject;
        }

        return true;
      });

      if (matchingTopics.length === 0 && searchQuery.trim()) {
        return null;
      }

      return {
        ...subject,
        topics: matchingTopics,
      };
    }).filter(Boolean) as FullSyllabusSubject[];
  }, [selectedSection, searchQuery, priorityFilter]);

  // Overall statistics
  const totalTopicsInSyllabus = useMemo(() => {
    return FULL_SYLLABUS_DATA.reduce((acc, sub) => acc + sub.topics.length, 0);
  }, []);

  const completedCount = completedTopicIds.length;
  const progressPct = totalTopicsInSyllabus > 0 ? Math.round((completedCount / totalTopicsInSyllabus) * 100) : 0;

  // Icon Helper
  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Database':
        return <Database className="w-5 h-5 text-indigo-600" />;
      case 'Server':
        return <Server className="w-5 h-5 text-emerald-600" />;
      case 'Network':
        return <Network className="w-5 h-5 text-blue-600" />;
      case 'Code':
        return <Code className="w-5 h-5 text-amber-600" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-purple-600" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-teal-600" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-rose-600" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-amber-700" />;
      case 'Cloud':
        return <Cloud className="w-5 h-5 text-sky-600" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-violet-600" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-indigo-500" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-orange-500" />;
      case 'PenTool':
        return <PenTool className="w-5 h-5 text-pink-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-16 print:p-0 print:space-y-4">
      {/* Header */}
      <Header
        title="Full Master Syllabus"
        subtitle="Comprehensive 2026/2027 IBPS SO IT (Scale I) blueprint covering Professional Knowledge, Reasoning, Quant, English, Banking, and Descriptive Writing."
      />

      {/* Top Banner & Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 flex flex-col lg:flex-row lg:items-center justify-between gap-6 print:hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
              CRP-SPL-XVI Baseline
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
              Prelims (125 Qs / 125 Marks) + Mains Descriptive
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center space-x-2.5">
            <BookOpen className="w-6 h-6 text-indigo-400 shrink-0" />
            <span>Complete Exhaustive Syllabus Directory</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every topic, subtopic, expected question weightage, and high-yield focus area meticulously structured for your preparation. Track your syllabus completion with one click.
          </p>

          {/* Progress bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-300">Total Syllabus Coverage</span>
              <span className="text-emerald-400 font-bold">{progressPct}% ({completedCount} / {totalTopicsInSyllabus} Topics Studied)</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center space-x-2 border border-white/20 transition-colors shadow-sm"
            title="Print or Save as PDF"
          >
            <Printer className="w-4 h-4 text-slate-200" />
            <span>Print / Save PDF</span>
          </button>

          <button
            onClick={() => navigate('/syllabus')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-2 shadow transition-colors"
          >
            <Compass className="w-4 h-4 text-indigo-200" />
            <span>Open Adaptive Engine &rarr;</span>
          </button>

          <button
            onClick={() => setShowPatternDetails(!showPatternDetails)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center space-x-2 border border-slate-700 transition-colors"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>{showPatternDetails ? 'Hide Exam Pattern' : 'View Exam Scheme'}</span>
          </button>
        </div>
      </div>

      {/* Exam Scheme Summary Card (Expandable) */}
      {showPatternDetails && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Official Examination Scheme & Sectional Timing</h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">IBPS SO IT Scale I (2026/2027)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                  <th className="py-2.5 px-3 font-semibold">Stage</th>
                  <th className="py-2.5 px-3 font-semibold">Section Name</th>
                  <th className="py-2.5 px-3 font-semibold text-center">No. of Qs</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Max Marks</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Duration</th>
                  <th className="py-2.5 px-3 font-semibold">Medium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {EXAM_PATTERN_SCHEME.map((sec, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sec.examStage === 'Preliminary'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {sec.examStage}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{sec.sectionName}</td>
                    <td className="py-2.5 px-3 text-center font-bold">{sec.questionCount}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-indigo-600">{sec.marks}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600">{sec.durationMinutes} Mins</td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">{sec.medium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            * Note: Professional Knowledge carries 50 questions / 50 marks in Preliminary Examination. Each wrong objective answer has a penalty of 0.25 (1/4th) mark.
          </p>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 print:hidden">
        {/* Section Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 custom-scrollbar text-xs">
          {SECTIONS.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedSection === sec
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Search & Topic Priority Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any topic, protocol, concept (e.g. B+ Tree, Syllogism, OSI, Basel, Normalization)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center space-x-1.5 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-700"
              >
                <option value="All">All Priorities</option>
                <option value="High">High Priority Only</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleExpandAll}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1"
                title="Expand All"
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Expand All</span>
              </button>
              <button
                onClick={handleCollapseAll}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1"
                title="Collapse All"
              >
                <ListCollapse className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Collapse</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Syllabus Content List */}
      <div className="space-y-4">
        {filteredData.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No topics matched your filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query or reset the priority filter to explore all subjects.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSection('All Sections');
                setPriorityFilter('All');
              }}
              className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredData.map((subject) => {
            const isExpanded = !!expandedSubjects[subject.id];
            const subjectCompletedCount = subject.topics.filter((t) => completedTopicIds.includes(t.id)).length;
            const subjectPct = subject.topics.length > 0 ? Math.round((subjectCompletedCount / subject.topics.length) * 100) : 0;

            return (
              <div
                key={subject.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200"
              >
                {/* Subject Header Bar */}
                <div
                  onClick={() => toggleSubject(subject.id)}
                  className="p-4 md:p-5 bg-slate-50 hover:bg-slate-100/80 cursor-pointer border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 select-none"
                >
                  <div className="flex items-start md:items-center space-x-3.5">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-200 shrink-0">
                      {getSubjectIcon(subject.iconName)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {subject.section}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Weightage: {subject.expectedMarks}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-slate-900 mt-1 flex items-center space-x-2">
                        <span>{subject.name}</span>
                        <span className="text-xs text-slate-400 font-medium">({subject.topics.length} Topics)</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{subject.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0 justify-between md:justify-end">
                    {/* Completion Mini Pill */}
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-700">
                        {subjectCompletedCount}/{subject.topics.length} Studied
                      </div>
                      <div className="w-24 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${subjectPct}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Topics Container */}
                {isExpanded && (
                  <div className="divide-y divide-slate-100 p-2 md:p-4 bg-slate-50/40 space-y-3">
                    {subject.topics.map((topic) => {
                      const isComplete = completedTopicIds.includes(topic.id);

                      return (
                        <div
                          key={topic.id}
                          className={`p-4 rounded-xl border transition-all ${
                            isComplete
                              ? 'bg-emerald-50/30 border-emerald-200/80'
                              : 'bg-white border-slate-200/80 shadow-sm'
                          }`}
                        >
                          {/* Topic Title Row */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start space-x-3 flex-1">
                              <button
                                onClick={() => handleToggleTopic(topic.id)}
                                className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                                title={isComplete ? 'Mark as Pending' : 'Mark as Studied'}
                              >
                                {isComplete ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                ) : (
                                  <Circle className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                                )}
                              </button>

                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className={`text-sm font-bold ${isComplete ? 'text-emerald-950 line-through decoration-slate-400' : 'text-slate-900'}`}>
                                    {topic.name}
                                  </h4>

                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                    {topic.expectedQuestions}
                                  </span>

                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      topic.priority === 'High'
                                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                        : topic.priority === 'Medium'
                                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                                    }`}
                                  >
                                    {topic.priority} Priority
                                  </span>

                                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                                    {topic.difficulty}
                                  </span>
                                </div>

                                {/* Subtopic Tags List */}
                                <div className="pt-2">
                                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                                    Detailed Subtopics & Concepts:
                                  </div>
                                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-700">
                                    {topic.subtopics.map((st, sIdx) => (
                                      <li key={sIdx} className="flex items-start space-x-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                                        <span className="leading-relaxed">{st}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Key Focus Areas / Golden Tips */}
                                <div className="mt-2.5 p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/60 text-xs text-amber-950 flex items-start space-x-2">
                                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                  <div>
                                    <span className="font-bold text-amber-900">Exam Focus: </span>
                                    <span>{topic.keyFocusAreas}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Direct Actions */}
                            <div className="flex flex-col sm:flex-row items-center gap-1.5 shrink-0 print:hidden">
                              {topic.practiceModule && (
                                <button
                                  onClick={() => navigate('/practice', { state: { module: topic.practiceModule } })}
                                  className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] rounded-lg transition-colors flex items-center space-x-1"
                                  title="Practice Questions"
                                >
                                  <span>Practice</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                onClick={() => handleToggleTopic(topic.id)}
                                className={`px-2.5 py-1.5 font-bold text-[11px] rounded-lg transition-colors whitespace-nowrap ${
                                  isComplete
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                {isComplete ? 'Done ✓' : 'Mark Done'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Navigation Switcher */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div>
          <h4 className="font-bold text-slate-900 text-sm">Need Adaptive Dynamic Scheduling?</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Switch to the 15-Subject Adaptive Syllabus Engine with prerequisite tracking and spaced repetition schedules.
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => navigate('/syllabus')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
          >
            Adaptive Engine &rarr;
          </button>
          <button
            onClick={() => navigate('/daily-checklist')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
          >
            Daily Checklist &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullSyllabus;
