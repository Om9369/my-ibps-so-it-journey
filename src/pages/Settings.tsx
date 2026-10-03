// src/pages/Settings.tsx
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import {
  getAllItems,
  putItem,
  exportAllDataAsJSON,
  restoreAllDataFromJSON,
  resetAllDataToDefault,
  cleanPracticeDataStartingToday,
} from '../services/db';
import { questionProvider } from '../services/questionProvider';
import { mockProvider } from '../services/mockProvider';
import { ExamConfig, ExamSectionConfig } from '../types';
import {
  Settings as SettingsIcon,
  ShieldAlert,
  Database,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  FileCode,
  Lock,
  Server,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [configs, setConfigs] = useState<ExamConfig[]>([]);
  const [editingConfig, setEditingConfig] = useState<ExamConfig | null>(null);
  const [restoreMessage, setRestoreMessage] = useState<string>('');
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    const list = await getAllItems<ExamConfig>('examConfigs');
    setConfigs(list);
    if (list.length > 0 && !editingConfig) {
      setEditingConfig(JSON.parse(JSON.stringify(list[0])));
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingConfig) return;
    await putItem('examConfigs', editingConfig);
    alert('Exam configuration updated successfully!');
    loadConfigs();
  };

  const handleUpdateSection = (idx: number, field: keyof ExamSectionConfig, val: any) => {
    if (!editingConfig) return;
    const nextSections = [...editingConfig.sections];
    nextSections[idx] = { ...nextSections[idx], [field]: val };
    setEditingConfig({ ...editingConfig, sections: nextSections });
  };

  const handleAddSection = () => {
    if (!editingConfig) return;
    const newSec: ExamSectionConfig = {
      id: `sec-${Date.now()}`,
      name: 'New Custom Section',
      subject: 'IT',
      questionCount: 30,
      maxMarks: 30,
      marksPerCorrect: 1.0,
      negativeMarks: 0.25,
      timeLimitMinutes: 30,
    };
    setEditingConfig({
      ...editingConfig,
      sections: [...editingConfig.sections, newSec],
    });
  };

  const handleRemoveSection = (idx: number) => {
    if (!editingConfig || editingConfig.sections.length <= 1) return;
    const nextSections = editingConfig.sections.filter((_, i) => i !== idx);
    setEditingConfig({ ...editingConfig, sections: nextSections });
  };

  // Full Database Backup
  const handleExportJSON = async () => {
    const jsonStr = await exportAllDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my_ibps_so_it_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Full Database Restore
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target?.result as string;
      const res = await restoreAllDataFromJSON(content);
      setRestoreMessage(res.message);
      if (res.success) {
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    };
    reader.readAsText(file);
  };

  // Reset all data
  const handleResetData = async () => {
    await resetAllDataToDefault();
    setResetConfirmOpen(false);
    alert('All application data has been reset to defaults.');
    window.location.reload();
  };

  return (
    <div className="space-y-6 pb-12">
      <Header
        title="Settings & Exam Configuration"
        subtitle="Manage official exam patterns, verify recruitment notifications, configure backup/restore, and inspect provider adapters."
        showExamConfigWarning={true}
      />

      {/* Official Exam Pattern Rule Banner (Requirement #3 & #6) */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs md:text-sm flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-900">
            "Verify this configuration against the official IBPS notification for your recruitment cycle."
          </p>
          <p className="text-amber-700 text-xs leading-relaxed">
            The exam pattern is never hardcoded. You can adapt the number of questions, section time limits, marks per correct answer, and negative marks below to strictly conform with the official IBPS notification for Scale I IT Officer.
          </p>
        </div>
      </div>

      {/* EXAM PATTERN CONFIGURATION EDITOR (Requirement #6) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Configure Exam Patterns</h3>
            <p className="text-xs text-slate-500">Edit sections, negative marking, marks and question counts.</p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={editingConfig?.id}
              onChange={(e) => {
                const found = configs.find((c) => c.id === e.target.value);
                if (found) setEditingConfig(JSON.parse(JSON.stringify(found)));
              }}
              className="text-xs font-semibold p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
            >
              {configs.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {editingConfig && (
          <form onSubmit={handleSaveConfig} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Pattern Name</label>
                <input
                  type="text"
                  value={editingConfig.name}
                  onChange={(e) => setEditingConfig({ ...editingConfig, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Total Time (Minutes)</label>
                <input
                  type="number"
                  value={editingConfig.totalTimeMinutes}
                  onChange={(e) =>
                    setEditingConfig({ ...editingConfig, totalTimeMinutes: Number(e.target.value) })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="negEnabled"
                checked={editingConfig.negativeMarkingEnabled}
                onChange={(e) =>
                  setEditingConfig({ ...editingConfig, negativeMarkingEnabled: e.target.checked })
                }
                className="w-4 h-4 rounded text-indigo-600"
              />
              <label htmlFor="negEnabled" className="font-semibold text-slate-700 cursor-pointer">
                Enable Negative Marking Penalty (e.g. 0.25 marks deducted for wrong answer)
              </label>
            </div>

            {/* Sections List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Exam Sections</h4>
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Section</span>
                </button>
              </div>

              <div className="space-y-3">
                {editingConfig.sections.map((sec, idx) => (
                  <div
                    key={sec.id || idx}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-6 gap-3 items-end"
                  >
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Section Name</label>
                      <input
                        type="text"
                        value={sec.name}
                        onChange={(e) => handleUpdateSection(idx, 'name', e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Questions</label>
                      <input
                        type="number"
                        value={sec.questionCount}
                        onChange={(e) => handleUpdateSection(idx, 'questionCount', Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Marks (+ / Q)</label>
                      <input
                        type="number"
                        step="0.05"
                        value={sec.marksPerCorrect}
                        onChange={(e) => handleUpdateSection(idx, 'marksPerCorrect', Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Penalty (- / Q)</label>
                      <input
                        type="number"
                        step="0.05"
                        value={sec.negativeMarks}
                        onChange={(e) => handleUpdateSection(idx, 'negativeMarks', Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(idx)}
                        disabled={editingConfig.sections.length <= 1}
                        className="p-2 text-slate-400 hover:text-rose-600 disabled:opacity-30"
                        title="Remove Section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow"
              >
                Save Exam Configuration
              </button>
            </div>
          </form>
        )}
      </div>

      {/* MODULAR QUESTION & MOCK PROVIDERS ARCHITECTURE (Requirement #14 & #15) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <div className="flex items-center space-x-2">
          <Server className="w-4 h-4 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">Provider Integrations Architecture</h3>
        </div>
        <p className="text-slate-500 leading-relaxed">
          The application uses a modular, decoupled provider architecture. Without external APIs configured, all questions and mock test results operate securely inside local IndexedDB.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900">QuestionProvider</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active: LocalQuestionBank
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Supports LocalQuestionBank, CSV/JSON bulk imports, and ExternalAPIProvider stub. No API credentials required for local offline operation.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900">MockProvider</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active: Internal Mock Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Supports ManualEntryProvider, CSVImportProvider, and ExternalProviderAdapter. Fully functional standalone.
            </p>
          </div>
        </div>
      </div>

      {/* PRIVACY, BACKUP & RESTORE (Requirement #2 & #20) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-slate-900 text-sm">Private Storage & Data Management</h3>
        </div>
        <p className="text-slate-500 leading-relaxed">
          Your preparation data is stored locally in your browser (IndexedDB). No cloud account, tracking, advertising, or public sharing exists. You have complete ownership of your data through JSON backup and restore.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download JSON Backup</span>
          </button>

          <label className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 flex items-center space-x-1.5 cursor-pointer">
            <Upload className="w-4 h-4 text-indigo-600" />
            <span>Restore JSON Backup</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={async () => {
              if (confirm('Reset daily practice, study sessions, and mistakes to start fresh from today (3/10/26)? Your Question Bank, Quizzes, and Mock Tests will be preserved.')) {
                await cleanPracticeDataStartingToday();
                alert('Daily practice reset! Starting fresh from today 3/10/26.');
                window.location.reload();
              }
            }}
            className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-300 flex items-center space-x-1.5"
          >
            <RotateCcw className="w-4 h-4 text-amber-600" />
            <span>Start Fresh from Today (3/10/26)</span>
          </button>

          <button
            onClick={() => setResetConfirmOpen(true)}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 flex items-center space-x-1.5 ml-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Factory Reset All Data</span>
          </button>
        </div>

        {restoreMessage && (
          <div className="p-3 bg-emerald-50 text-emerald-800 font-bold rounded-xl border border-emerald-200 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{restoreMessage}</span>
          </div>
        )}
      </div>

      {/* RESET CONFIRMATION MODAL */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="text-rose-600 font-black text-base flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5" />
              <span>Confirm Data Reset</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              This will clear all logged mock tests, checklist entries, custom questions, and mistakes, resetting everything to the clean initial seed state.
            </p>
            <p className="font-bold text-slate-800">
              Are you sure? We strongly recommend downloading a JSON backup first.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 bg-slate-100 font-semibold text-slate-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow"
              >
                Yes, Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
