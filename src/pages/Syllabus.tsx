// src/pages/Syllabus.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import {
  SyllabusSubject,
  SyllabusConcept,
  MasteryRecord,
  PreparationPhase,
  SubjectAnalyticsSummary,
  ConceptDifficulty,
  ExamPriority,
  MasteryState,
} from '../types/syllabus';
import {
  getAllSubjects,
  getOverallSyllabusMetrics,
  syncMasteryRecords,
  arePrerequisitesMet,
  getSubjectAnalytics,
} from '../services/syllabusEngine';
import { getItemById, putItem } from '../services/db';
import {
  BookOpen,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Repeat,
  Sparkles,
  Compass,
  Search,
  Filter,
  Flame,
  Award,
  Layers,
  Clock,
  ArrowRight,
  X,
  Target,
  BarChart3,
  HelpCircle,
} from 'lucide-react';

export const Syllabus: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [subjects, setSubjects] = useState<SyllabusSubject[]>([]);
  const [masteryMap, setMasteryMap] = useState<Map<string, MasteryRecord>>(new Map());
  const [overallMetrics, setOverallMetrics] = useState<{
    overallCompletionPct: number;
    overallMasteryPct: number;
    totalConcepts: number;
    masteredConcepts: number;
    currentPhase: PreparationPhase;
    subjectSummaries: SubjectAnalyticsSummary[];
  } | null>(null);

  // Filters
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ConceptDifficulty | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<number | 'all'>('all');
  const [selectedMasteryState, setSelectedMasteryState] = useState<MasteryState | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Expand / Collapse State
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  // Subject Modal / Detail Drawer
  const [selectedSubjectDetail, setSelectedSubjectDetail] = useState<SubjectAnalyticsSummary | null>(null);

  // High-Priority Unfinished Modal
  const [showHighPriorityModal, setShowHighPriorityModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const subs = getAllSubjects();
    setSubjects(subs);

    const m = await syncMasteryRecords();
    setMasteryMap(m);

    const metrics = await getOverallSyllabusMetrics();
    setOverallMetrics(metrics);

    // Expand the first module and topic of the first subject by default for convenience
    if (subs.length > 0) {
      const firstSub = subs[0];
      const initialExpanded: Record<string, boolean> = {
        [firstSub.id]: true,
      };
      if (firstSub.modules.length > 0) {
        initialExpanded[firstSub.modules[0].id] = true;
        if (firstSub.modules[0].topics.length > 0) {
          initialExpanded[firstSub.modules[0].topics[0].id] = true;
        }
      }
      setExpandedNodes(initialExpanded);
    }
  };

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const handleMarkConceptComplete = async (concept: SyllabusConcept) => {
    let rec = masteryMap.get(concept.id);
    if (!rec) {
      rec = {
        conceptId: concept.id,
        conceptTitle: concept.title,
        topicId: concept.topicId,
        moduleId: concept.moduleId,
        subjectId: concept.subjectId,
        completionScore: 100,
        practiceAccuracy: 0,
        recentAccuracy: 0,
        difficultyScore: 50,
        revisionConsistency: 10,
        mistakePenalty: 0,
        masteryScore: 30,
        masteryState: 'Learning',
        totalAttempts: 0,
        totalCorrect: 0,
        recentAttempts: 0,
        recentCorrect: 0,
        revisionIntervalDays: 3,
        repetitionCount: 0,
        mistakeCount: 0,
        conceptualErrorCount: 0,
        updatedAt: new Date().toISOString(),
      };
    } else {
      rec.completionScore = 100;
      rec.masteryScore = Math.min(100, Math.max(rec.masteryScore, 35));
      if (rec.masteryState === 'Not Started') rec.masteryState = 'Learning';
      rec.updatedAt = new Date().toISOString();
    }

    await putItem('masteryRecords', rec);
    const newMap = new Map(masteryMap);
    newMap.set(concept.id, rec);
    setMasteryMap(newMap);

    const metrics = await getOverallSyllabusMetrics();
    setOverallMetrics(metrics);
  };

  const handlePracticeConcept = (concept: SyllabusConcept) => {
    navigate('/practice', {
      state: {
        subject: concept.subjectId.startsWith('sub-comp') || ['sub-os', 'sub-dbms', 'sub-cn', 'sub-dsa', 'sub-prog-oop', 'sub-se', 'sub-cyber', 'sub-bank-tech', 'sub-emerging'].includes(concept.subjectId)
          ? 'IT'
          : concept.subjectId === 'sub-reas'
          ? 'Reasoning'
          : concept.subjectId === 'sub-eng'
          ? 'English'
          : concept.subjectId === 'sub-quant'
          ? 'Quant'
          : 'Banking & CA',
        topic: concept.title,
      },
    });
  };

  const handleOpenSubjectDashboard = async (subjectId: string) => {
    const summary = await getSubjectAnalytics(subjectId);
    setSelectedSubjectDetail(summary);
  };

  // Helper styling for difficulty badge
  const getDifficultyBadge = (d: ConceptDifficulty) => {
    switch (d) {
      case 'L0':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">L0 Familiarity</span>;
      case 'L1':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">L1 Foundation</span>;
      case 'L2':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">L2 Exam Core</span>;
      case 'L3':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">L3 Advanced</span>;
    }
  };

  // Helper styling for Priority badge
  const getPriorityBadge = (p: ExamPriority) => {
    switch (p) {
      case 5:
        return <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1"><Flame className="w-3 h-3 text-rose-600 fill-rose-500" /> P5 Critical</span>;
      case 4:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">P4 High</span>;
      case 3:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">P3 Medium</span>;
      case 2:
      case 1:
        return <span className="px-2 py-0.5 rounded text-[10px] text-slate-600 bg-slate-100">P{p} Standard</span>;
    }
  };

  // Helper styling for Mastery badge
  const getMasteryBadge = (state: MasteryState, score: number) => {
    switch (state) {
      case 'Mastered':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Mastered ({score}%)</span>;
      case 'Strong':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">Strong ({score}%)</span>;
      case 'Developing':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-800">Developing ({score}%)</span>;
      case 'Learning':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">Learning ({score}%)</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">Not Started</span>;
    }
  };

  // Concept filter evaluation
  const isConceptMatchingFilters = (concept: SyllabusConcept): boolean => {
    if (selectedDifficulty !== 'all' && concept.difficulty !== selectedDifficulty) return false;
    if (selectedPriority !== 'all' && concept.examPriority !== selectedPriority) return false;

    const rec = masteryMap.get(concept.id);
    const mState = rec?.masteryState || 'Not Started';
    if (selectedMasteryState !== 'all' && mState !== selectedMasteryState) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = concept.title.toLowerCase().includes(q);
      const matchDesc = concept.description.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    return true;
  };

  // High priority unfinished concepts collection
  const allConceptsList: SyllabusConcept[] = [];
  subjects.forEach((s) => {
    s.modules.forEach((m) => {
      m.topics.forEach((t) => {
        t.subtopics.forEach((st) => {
          st.concepts.forEach((c) => {
            allConceptsList.push(c);
          });
        });
      });
    });
  });

  const highPriorityUnfinished = allConceptsList.filter((c) => {
    const rec = masteryMap.get(c.id);
    const score = rec?.masteryScore || 0;
    return c.examPriority >= 4 && score < 70;
  });

  return (
    <div className="space-y-6 pb-16">
      <Header
        title="IBPS SO IT Syllabus Engine"
        subtitle="Adaptive, hierarchical intelligence layer: 15 Major Subjects, Mastery tracking, Prerequisites, and August 2027 Roadmaps."
      />

      {/* Top High-Level Metrics Cockpit */}
      {overallMetrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="text-xs font-semibold text-slate-500">Overall Mastery</div>
            <div className="text-2xl font-black text-indigo-600 mt-1">{overallMetrics.overallMasteryPct}%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {overallMetrics.masteredConcepts} of {overallMetrics.totalConcepts} Mastered
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${overallMetrics.overallMasteryPct}%` }}></div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Syllabus Covered</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{overallMetrics.overallCompletionPct}%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Concept Study Completion</div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${overallMetrics.overallCompletionPct}%` }}></div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Target Cycle Phase</div>
            <div className="text-sm font-black text-slate-900 mt-1 truncate">{overallMetrics.currentPhase.name}</div>
            <div className="text-[11px] text-indigo-600 font-bold mt-0.5">August 2027 Exam Goal</div>
            <div className="text-[10px] text-slate-400 mt-1 truncate">{overallMetrics.currentPhase.targetMonths}</div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-semibold text-slate-500">Critical Unfinished</div>
            <div className="text-2xl font-black text-rose-600 mt-1">{highPriorityUnfinished.length}</div>
            <button
              onClick={() => setShowHighPriorityModal(true)}
              className="text-[11px] text-rose-600 hover:text-rose-800 font-bold mt-0.5 flex items-center space-x-1 underline"
            >
              <span>View P4 & P5 topics</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Target Roadmap Phase Progression Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-indigo-400 flex items-center space-x-1.5">
              <Compass className="w-4 h-4" />
              <span>Syllabus Phased Roadmap &bull; Target: August 2027</span>
            </div>
            <h3 className="font-bold text-base text-white mt-1">
              Phase 1: Foundation Building &bull; Hardware, Number Systems, Math & Grammar
            </h3>
          </div>
          <button
            onClick={() => navigate('/goals')}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl self-start md:self-auto transition-colors"
          >
            Review Cycle Milestone
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 mt-4 text-[11px]">
          {[
            { p: 0, title: 'Phase 0', sub: 'Diagnostic', active: false },
            { p: 1, title: 'Phase 1', sub: 'Foundations', active: true },
            { p: 2, title: 'Phase 2', sub: 'Core IT (OS/DB/CN)', active: false },
            { p: 3, title: 'Phase 3', sub: 'Advanced IT/Sec', active: false },
            { p: 4, title: 'Phase 4', sub: 'Banking Tech', active: false },
            { p: 5, title: 'Phase 5', sub: 'Mocks & Speed', active: false },
            { p: 6, title: 'Phase 6', sub: 'Final Revision', active: false },
          ].map((item) => (
            <div
              key={item.p}
              className={`p-2 rounded-xl border text-center transition-all ${
                item.active
                  ? 'bg-indigo-600/30 border-indigo-400 text-white font-bold ring-1 ring-indigo-400'
                  : 'bg-slate-800/40 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-[10px]">{item.title}</div>
              <div className="truncate font-semibold">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts across 15 subjects (e.g. Subnetting, BCNF, Semaphores, CPI)..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="text-xs font-semibold p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
            >
              <option value="all">All 15 Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
              className="text-xs font-semibold p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
            >
              <option value="all">All Difficulties</option>
              <option value="L0">L0 (Familiarity)</option>
              <option value="L1">L1 (Foundation)</option>
              <option value="L2">L2 (Exam Application)</option>
              <option value="L3">L3 (Advanced)</option>
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="text-xs font-semibold p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
            >
              <option value="all">All Priorities</option>
              <option value="5">Priority 5 (Critical)</option>
              <option value="4">Priority 4 (High)</option>
              <option value="3">Priority 3 (Medium)</option>
            </select>

            <select
              value={selectedMasteryState}
              onChange={(e) => setSelectedMasteryState(e.target.value as any)}
              className="text-xs font-semibold p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
            >
              <option value="all">All Mastery States</option>
              <option value="Not Started">Not Started</option>
              <option value="Learning">Learning</option>
              <option value="Developing">Developing</option>
              <option value="Strong">Strong</option>
              <option value="Mastered">Mastered</option>
            </select>
          </div>
        </div>
      </div>

      {/* 15 Subjects Grid / Expandable Tree */}
      <div className="space-y-4">
        {subjects
          .filter((sub) => selectedSubjectId === 'all' || sub.id === selectedSubjectId)
          .map((subject) => {
            const summary = overallMetrics?.subjectSummaries.find((s) => s.subjectId === subject.id);
            const isSubExpanded = !!expandedNodes[subject.id];

            return (
              <div
                key={subject.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all"
              >
                {/* Subject Header Banner */}
                <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/60 border-b border-slate-100">
                  <div
                    onClick={() => toggleNode(subject.id)}
                    className="flex items-center space-x-3 cursor-pointer select-none flex-1"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                      {subject.code}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="font-black text-slate-900 text-sm md:text-base">{subject.name}</h2>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded">
                          Weight: {subject.weightageWeight}x
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{subject.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end md:self-auto">
                    {summary && (
                      <div className="text-right text-xs">
                        <div className="font-black text-slate-800">
                          {summary.completionPct}% covered &bull; {summary.avgMastery}% mastery
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {summary.masteredConcepts} / {summary.totalConcepts} concepts mastered
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleOpenSubjectDashboard(subject.id)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-xs transition-colors flex items-center space-x-1"
                      title="Open Subject Dashboard"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Analytics</span>
                    </button>

                    <button
                      onClick={() => toggleNode(subject.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                      aria-label="Toggle Subject"
                    >
                      {isSubExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Subject Body: Modules -> Topics -> Subtopics -> Concepts */}
                {isSubExpanded && (
                  <div className="p-4 md:p-6 space-y-6">
                    {subject.modules.map((module) => {
                      const isModExpanded = expandedNodes[module.id] !== false; // default open

                      return (
                        <div key={module.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                          <div
                            onClick={() => toggleNode(module.id)}
                            className="p-3 bg-slate-100/70 flex items-center justify-between cursor-pointer select-none hover:bg-slate-100"
                          >
                            <div className="flex items-center space-x-2">
                              <Layers className="w-4 h-4 text-indigo-600" />
                              <h3 className="font-bold text-slate-800 text-xs md:text-sm">{module.name}</h3>
                              <span className="text-[10px] text-slate-400 font-medium">
                                ({module.topics.length} topics)
                              </span>
                            </div>
                            <div className="text-slate-400">
                              {isModExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </div>
                          </div>

                          {isModExpanded && (
                            <div className="p-3 md:p-4 space-y-4">
                              {module.topics.map((topic) => {
                                const isTopExpanded = expandedNodes[topic.id] !== false;

                                return (
                                  <div key={topic.id} className="border border-slate-100 rounded-xl p-3 bg-slate-50/30">
                                    <div
                                      onClick={() => toggleNode(topic.id)}
                                      className="flex items-center justify-between cursor-pointer select-none"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                        <h4 className="font-bold text-slate-800 text-xs">{topic.name}</h4>
                                        {getPriorityBadge(topic.examPriority)}
                                      </div>
                                      <div className="text-slate-400">
                                        {isTopExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                      </div>
                                    </div>

                                    {isTopExpanded && (
                                      <div className="mt-3 space-y-3">
                                        {topic.subtopics.map((subtopic) => {
                                          const filteredConcepts = subtopic.concepts.filter(isConceptMatchingFilters);
                                          if (filteredConcepts.length === 0 && (selectedDifficulty !== 'all' || selectedPriority !== 'all' || selectedMasteryState !== 'all' || searchQuery.trim())) {
                                            return null;
                                          }

                                          return (
                                            <div key={subtopic.id} className="ml-2 md:ml-4 pl-3 border-l-2 border-indigo-100 space-y-2">
                                              <div className="text-[11px] font-bold text-slate-600 flex items-center space-x-1">
                                                <span>{subtopic.name}</span>
                                              </div>

                                              <div className="space-y-2">
                                                {subtopic.concepts.filter(isConceptMatchingFilters).map((concept) => {
                                                  const rec = masteryMap.get(concept.id);
                                                  const mScore = rec?.masteryScore || 0;
                                                  const mState = rec?.masteryState || 'Not Started';
                                                  const { met: prereqMet, missingPrereqs } = arePrerequisitesMet(concept, masteryMap);

                                                  return (
                                                    <div
                                                      key={concept.id}
                                                      className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-indigo-200 transition-colors"
                                                    >
                                                      <div className="space-y-1 flex-1">
                                                        <div className="flex flex-wrap items-center gap-1.5">
                                                          <span className="font-bold text-xs text-slate-900">{concept.title}</span>
                                                          {getDifficultyBadge(concept.difficulty)}
                                                          {getPriorityBadge(concept.examPriority)}
                                                          {getMasteryBadge(mState, mScore)}
                                                        </div>
                                                        <p className="text-[11px] text-slate-500 leading-relaxed">{concept.description}</p>

                                                        {/* Prerequisite Alert if not met */}
                                                        {!prereqMet && (
                                                          <div className="flex items-center space-x-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 w-fit">
                                                            <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                                                            <span>Prerequisites missing: Complete {missingPrereqs.join(', ')}</span>
                                                          </div>
                                                        )}
                                                      </div>

                                                      {/* Practice & Mastery Actions */}
                                                      <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
                                                        {rec && rec.totalAttempts > 0 && (
                                                          <div className="text-right text-[10px] text-slate-500 mr-1 hidden sm:block">
                                                            <div className="font-bold">{rec.practiceAccuracy}% Acc</div>
                                                            <div>{rec.totalAttempts} Qs</div>
                                                          </div>
                                                        )}

                                                        <button
                                                          onClick={() => handleMarkConceptComplete(concept)}
                                                          className={`p-1.5 rounded-lg border transition-colors ${
                                                            rec?.completionScore === 100
                                                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                                              : 'bg-white text-slate-400 hover:text-emerald-600 border-slate-200'
                                                          }`}
                                                          title="Mark Concept Complete"
                                                        >
                                                          <CheckCircle2 className="w-4 h-4" />
                                                        </button>

                                                        <button
                                                          onClick={() => handlePracticeConcept(concept)}
                                                          className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg border border-indigo-200 flex items-center space-x-1 transition-colors"
                                                          title="Launch Targeted Practice"
                                                        >
                                                          <PlayCircle className="w-3.5 h-3.5" />
                                                          <span>Practice</span>
                                                        </button>
                                                      </div>
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Subject Dashboard Deep-Dive Modal */}
      {selectedSubjectDetail && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Subject Cockpit</span>
                <h3 className="font-black text-lg text-slate-900">{selectedSubjectDetail.name}</h3>
              </div>
              <button
                onClick={() => setSelectedSubjectDetail(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-slate-500 font-semibold">Mastery Index</div>
                <div className="text-xl font-black text-indigo-600 mt-1">{selectedSubjectDetail.avgMastery}%</div>
                <div className="text-[10px] text-slate-400">{selectedSubjectDetail.masteredConcepts} concepts mastered</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-slate-500 font-semibold">Syllabus Covered</div>
                <div className="text-xl font-black text-emerald-600 mt-1">{selectedSubjectDetail.completionPct}%</div>
                <div className="text-[10px] text-slate-400">{selectedSubjectDetail.completedConcepts} of {selectedSubjectDetail.totalConcepts} done</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-slate-500 font-semibold">Question Practice</div>
                <div className="text-xl font-black text-slate-800 mt-1">{selectedSubjectDetail.totalQuestionsAttempted}</div>
                <div className="text-[10px] text-slate-400">{selectedSubjectDetail.accuracy}% overall accuracy</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-slate-500 font-semibold">Critical Unfinished</div>
                <div className="text-xl font-black text-rose-600 mt-1">{selectedSubjectDetail.criticalUnfinishedCount}</div>
                <div className="text-[10px] text-slate-400">P4/P5 exam topics</div>
              </div>
            </div>

            <div className="space-y-2 text-xs bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Weakest Topic:</span>
                <span className="font-bold text-rose-600 capitalize">{selectedSubjectDetail.weakestTopic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Strongest Topic:</span>
                <span className="font-bold text-emerald-600 capitalize">{selectedSubjectDetail.strongestTopic}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setSelectedSubjectDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedSubjectDetail(null);
                  navigate('/practice');
                }}
                className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow"
              >
                Launch Subject Practice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* High-Priority Unfinished Topics Modal */}
      {showHighPriorityModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">Exam Priority 4 & 5</span>
                <h3 className="font-black text-lg text-slate-900">Critical Unfinished Topics ({highPriorityUnfinished.length})</h3>
              </div>
              <button
                onClick={() => setShowHighPriorityModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              These high-yield topics carry maximum weightage in IBPS SO IT Mains & Prelims and currently have mastery under 70%.
            </p>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {highPriorityUnfinished.map((c) => {
                const rec = masteryMap.get(c.id);
                return (
                  <div key={c.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{c.title}</span>
                        {getPriorityBadge(c.examPriority)}
                        {getDifficultyBadge(c.difficulty)}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{c.description}</p>
                    </div>

                    <button
                      onClick={() => {
                        setShowHighPriorityModal(false);
                        handlePracticeConcept(c);
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shrink-0 transition-colors"
                    >
                      Practice Now
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowHighPriorityModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Syllabus;
