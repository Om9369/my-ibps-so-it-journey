// src/pages/QuestionBank.tsx
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { questionProvider } from '../services/questionProvider';
import {
  parseAndValidateCSV,
  parseAndValidateJSON,
  getExampleCSVTemplate,
  getExampleJSONTemplate,
  exportQuestionsToCSV,
} from '../services/importExport';
import { Question, Subject, ITModule, Difficulty, QuestionSource } from '../types';
import {
  Database,
  Plus,
  Upload,
  Download,
  Search,
  Filter,
  Trash2,
  Edit,
  Bookmark,
  AlertCircle,
  CheckCircle2,
  FileText,
  FileCode,
} from 'lucide-react';

const SUBJECTS: Subject[] = ['IT', 'Reasoning', 'English', 'Quant', 'Banking & CA'];

const IT_MODULES: ITModule[] = [
  'DBMS',
  'Operating Systems',
  'Computer Networks',
  'Data Structures',
  'Algorithms',
  'Programming & OOP',
  'Software Engineering',
  'Cybersecurity',
  'Computer Architecture',
  'Web Technologies',
  'Cloud Computing',
  'AI & Machine Learning',
  'IoT & Blockchain',
  'Other IT',
];

const SOURCES: QuestionSource[] = [
  'Self-created',
  'Personal notes',
  'Purchased study material',
  'Mock provider',
  'Previous-year material',
  'Other',
];

export const QuestionBank: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [moduleFilter, setModuleFilter] = useState<string>('All');
  const [diffFilter, setDiffFilter] = useState<string>('All');
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);

  // Manual Question Form Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Form Fields
  const [formText, setFormText] = useState('');
  const [formOptions, setFormOptions] = useState<string[]>(['', '', '', '']);
  const [formCorrectIdx, setFormCorrectIdx] = useState<number>(0);
  const [formExplanation, setFormExplanation] = useState('');
  const [formSubject, setFormSubject] = useState<Subject>('IT');
  const [formModule, setFormModule] = useState<ITModule>('DBMS');
  const [formTopic, setFormTopic] = useState('');
  const [formDifficulty, setFormDifficulty] = useState<Difficulty>('Medium');
  const [formSource, setFormSource] = useState<QuestionSource>('Self-created');
  const [formTags, setFormTags] = useState('');

  // Import Modal
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importMode, setImportMode] = useState<'CSV' | 'JSON'>('CSV');
  const [importRawText, setImportRawText] = useState('');
  const [allowOverwrite, setAllowOverwrite] = useState(false);
  const [importErrors, setImportErrors] = useState<{ row: number; reason: string }[]>([]);
  const [importSuccessMsg, setImportSuccessMsg] = useState('');

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const list = await questionProvider.getQuestions();
    setQuestions(list);
  };

  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setFormText('');
    setFormOptions(['', '', '', '']);
    setFormCorrectIdx(0);
    setFormExplanation('');
    setFormSubject('IT');
    setFormModule('DBMS');
    setFormTopic('');
    setFormDifficulty('Medium');
    setFormSource('Self-created');
    setFormTags('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (q: Question) => {
    setEditingQuestion(q);
    setFormText(q.question);
    setFormOptions([...q.options]);
    setFormCorrectIdx(q.correctAnswer);
    setFormExplanation(q.explanation);
    setFormSubject(q.subject);
    if (q.itModule) setFormModule(q.itModule);
    setFormTopic(q.topic);
    setFormDifficulty(q.difficulty);
    setFormSource(q.source);
    setFormTags(q.tags?.join(', ') || '');
    setIsFormOpen(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText.trim()) return;

    const tags = formTags
      .split(/[,;]/)
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingQuestion) {
      const updated: Question = {
        ...editingQuestion,
        question: formText,
        options: formOptions.map((o) => o.trim()),
        correctAnswer: formCorrectIdx,
        explanation: formExplanation,
        subject: formSubject,
        itModule: formSubject === 'IT' ? formModule : undefined,
        topic: formTopic || 'General',
        difficulty: formDifficulty,
        source: formSource,
        tags,
      };
      await questionProvider.updateQuestion(updated);
    } else {
      const created: Question = {
        id: `q-manual-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        question: formText,
        options: formOptions.map((o) => o.trim()),
        correctAnswer: formCorrectIdx,
        explanation: formExplanation,
        subject: formSubject,
        itModule: formSubject === 'IT' ? formModule : undefined,
        topic: formTopic || 'General',
        difficulty: formDifficulty,
        source: formSource,
        tags,
        type: 'MCQ',
        createdAt: new Date().toISOString(),
      };
      await questionProvider.addQuestion(created);
    }

    setIsFormOpen(false);
    loadQuestions();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      await questionProvider.deleteQuestion(id);
      loadQuestions();
    }
  };

  const handleToggleBookmark = async (q: Question) => {
    const updated = { ...q, isBookmarked: !q.isBookmarked };
    await questionProvider.updateQuestion(updated);
    setQuestions(questions.map((item) => (item.id === q.id ? updated : item)));
  };

  // Run Import
  const handleExecuteImport = async () => {
    setImportErrors([]);
    setImportSuccessMsg('');

    if (!importRawText.trim()) {
      setImportErrors([{ row: 0, reason: 'Import input is empty. Paste data or file contents.' }]);
      return;
    }

    let validationResult;
    if (importMode === 'CSV') {
      validationResult = parseAndValidateCSV(importRawText);
    } else {
      validationResult = parseAndValidateJSON(importRawText);
    }

    if (validationResult.errors.length > 0) {
      setImportErrors(validationResult.errors);
      return;
    }

    const { added, overwritten } = await questionProvider.bulkAddQuestions(
      validationResult.validQuestions,
      allowOverwrite
    );

    setImportSuccessMsg(`Successfully imported ${added} new question(s)${overwritten > 0 ? `, and updated ${overwritten} existing question(s)` : ''}!`);
    loadQuestions();
  };

  const handleDownloadTemplate = (type: 'csv' | 'json') => {
    const content = type === 'csv' ? getExampleCSVTemplate() : getExampleJSONTemplate();
    const mime = type === 'csv' ? 'text/csv' : 'application/json';
    const filename = `ibps_question_template.${type}`;
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportQuestions = () => {
    const csvContent = exportQuestionsToCSV(questions);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_question_bank_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered Questions
  const filtered = questions.filter((q) => {
    if (subjectFilter !== 'All' && q.subject !== subjectFilter) return false;
    if (moduleFilter !== 'All' && q.itModule !== moduleFilter) return false;
    if (diffFilter !== 'All' && q.difficulty !== diffFilter) return false;
    if (onlyBookmarks && !q.isBookmarked) return false;
    if (search.trim()) {
      const query = search.toLowerCase();
      const matchText = q.question.toLowerCase().includes(query);
      const matchExp = q.explanation?.toLowerCase().includes(query);
      const matchTag = q.tags?.some((t) => t.toLowerCase().includes(query));
      if (!matchText && !matchExp && !matchTag) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      <Header
        title="Personal Question Bank"
        subtitle="Manage questions, organize IT modules, import via CSV/JSON, export backups, and tag high-yield questions."
      />

      {/* Action Header & Tools */}
      <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Database className="w-5 h-5 text-indigo-600 shrink-0" />
          <div className="text-xs text-slate-600">
            Total Questions in Bank: <strong className="text-slate-900 text-sm">{questions.length}</strong>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>

          <button
            onClick={() => {
              setImportErrors([]);
              setImportSuccessMsg('');
              setIsImportOpen(true);
            }}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center space-x-1.5 border border-slate-200"
          >
            <Upload className="w-4 h-4 text-indigo-600" />
            <span>Import Questions</span>
          </button>

          <button
            onClick={handleExportQuestions}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center space-x-1.5 border border-slate-200"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search question text, tags, or explanation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <select
              value={subjectFilter}
              onChange={(e) => {
                setSubjectFilter(e.target.value);
                if (e.target.value !== 'IT') setModuleFilter('All');
              }}
              className="w-full p-2 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-700"
            >
              <option value="All">All Subjects</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {subjectFilter === 'IT' && (
            <div>
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="w-full p-2 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-700"
              >
                <option value="All">All IT Modules</option>
                {IT_MODULES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <select
              value={diffFilter}
              onChange={(e) => setDiffFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-700"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-1 text-xs">
          <input
            type="checkbox"
            id="bookmarkedOnly"
            checked={onlyBookmarks}
            onChange={(e) => setOnlyBookmarks(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
          />
          <label htmlFor="bookmarkedOnly" className="text-slate-700 font-semibold cursor-pointer">
            Show Bookmarked Questions Only
          </label>
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No questions found matching your filter criteria.
          </div>
        ) : (
          filtered.map((q, idx) => (
            <div
              key={q.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition-all text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">#{idx + 1}</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                    {q.subject}
                  </span>
                  {q.itModule && (
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                      {q.itModule}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                    {q.topic}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold ${
                      q.difficulty === 'Easy'
                        ? 'text-emerald-700 bg-emerald-50'
                        : q.difficulty === 'Medium'
                        ? 'text-indigo-700 bg-indigo-50'
                        : 'text-rose-700 bg-rose-50'
                    }`}
                  >
                    {q.difficulty}
                  </span>
                  <span className="text-slate-400 font-medium text-[11px]">Source: {q.source}</span>
                </div>

                <div className="flex items-center space-x-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => handleToggleBookmark(q)}
                    className={`p-1.5 rounded-lg border ${
                      q.isBookmarked
                        ? 'bg-amber-50 border-amber-300 text-amber-600'
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-500'
                    }`}
                    title="Bookmark"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleOpenEdit(q)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:text-indigo-600"
                    title="Edit"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 hover:text-rose-600"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-sm font-semibold text-slate-900 leading-snug">{q.question}</div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt, oIdx) => {
                  const isCorrect = oIdx === q.correctAnswer;
                  return (
                    <div
                      key={oIdx}
                      className={`p-2.5 rounded-xl border flex items-center space-x-2 ${
                        isCorrect
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                          : 'bg-slate-50/70 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center font-bold text-[10px] shrink-0">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {q.explanation && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 text-xs">
                  <strong className="text-slate-900">Explanation: </strong>
                  {q.explanation}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveQuestion}
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4 text-xs"
          >
            <h3 className="font-bold text-slate-900 text-base">
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </h3>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Question Text</label>
              <textarea
                required
                rows={3}
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
                placeholder="Enter complete question statement..."
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>

            {/* Options */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-700">Answer Options (Select correct option radio)</label>
              {formOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="correctAnswerOption"
                    checked={formCorrectIdx === idx}
                    onChange={() => setFormCorrectIdx(idx)}
                    className="w-4 h-4 text-indigo-600 cursor-pointer"
                  />
                  <span className="font-bold text-slate-700 w-4">{String.fromCharCode(65 + idx)}:</span>
                  <input
                    type="text"
                    required
                    value={opt}
                    onChange={(e) => {
                      const next = [...formOptions];
                      next[idx] = e.target.value;
                      setFormOptions(next);
                    }}
                    placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                    className="flex-1 p-2 rounded-xl border border-slate-200"
                  />
                </div>
              ))}
            </div>

            {/* Subject, Module, Topic */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {formSubject === 'IT' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">IT Module</label>
                  <select
                    value={formModule}
                    onChange={(e) => setFormModule(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    {IT_MODULES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Normalization"
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            {/* Difficulty & Source */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Difficulty</label>
                <select
                  value={formDifficulty}
                  onChange={(e) => setFormDifficulty(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Source</label>
                <select
                  value={formSource}
                  onChange={(e) => setFormSource(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                >
                  {SOURCES.map((src) => (
                    <option key={src} value={src}>{src}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="DBMS, 3NF, Keys"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Explanation & Rationale</label>
              <textarea
                rows={2}
                value={formExplanation}
                onChange={(e) => setFormExplanation(e.target.value)}
                placeholder="Explain why the answer is correct and why other options fail..."
                className="w-full p-2 rounded-xl border border-slate-200"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow"
              >
                {editingQuestion ? 'Update Question' : 'Save Question'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* IMPORT MODAL (Requirement #3) */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Import Question Bank</h3>
              <button onClick={() => setIsImportOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            {/* Mode selection */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setImportMode('CSV')}
                className={`px-4 py-1.5 rounded-xl font-bold border ${
                  importMode === 'CSV' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                CSV Format
              </button>
              <button
                onClick={() => setImportMode('JSON')}
                className={`px-4 py-1.5 rounded-xl font-bold border ${
                  importMode === 'JSON' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                JSON Format
              </button>

              <div className="flex-1 text-right">
                <button
                  onClick={() => handleDownloadTemplate(importMode === 'CSV' ? 'csv' : 'json')}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-slate-200"
                >
                  Download {importMode} Template
                </button>
              </div>
            </div>

            <p className="text-slate-500">
              Paste your raw {importMode} text below. Questions are strictly validated before addition.
            </p>

            <textarea
              rows={8}
              value={importRawText}
              onChange={(e) => setImportRawText(e.target.value)}
              placeholder={
                importMode === 'CSV'
                  ? 'question,optionA,optionB,optionC,optionD,correctAnswer,explanation,subject,topic,difficulty,source,tags\n"What is 3NF?","...","...","...","...","C","...","IT","DBMS","Easy","Self-created","DBMS"'
                  : '[\n  {\n    "question": "Sample?",\n    "options": ["A", "B", "C", "D"],\n    "correctAnswer": 0,\n    "explanation": "..."\n  }\n]'
              }
              className="w-full p-3 font-mono text-[11px] rounded-xl border border-slate-200 bg-slate-50"
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="overwrite"
                checked={allowOverwrite}
                onChange={(e) => setAllowOverwrite(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600"
              />
              <label htmlFor="overwrite" className="font-semibold text-slate-700">
                Allow overwriting existing questions with matching IDs
              </label>
            </div>

            {/* Error notifications */}
            {importErrors.length > 0 && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 space-y-1">
                <div className="font-bold flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>Validation Errors Detected ({importErrors.length}):</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {importErrors.slice(0, 5).map((err, i) => (
                    <li key={i}>
                      {err.row > 0 ? `Row ${err.row}: ` : ''}{err.reason}
                    </li>
                  ))}
                  {importErrors.length > 5 && <li>...and {importErrors.length - 5} more issues.</li>}
                </ul>
              </div>
            )}

            {/* Success notification */}
            {importSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{importSuccessMsg}</span>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsImportOpen(false)}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleExecuteImport}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow"
              >
                Validate & Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;
