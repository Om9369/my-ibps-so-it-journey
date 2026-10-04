// src/components/LogMistakeModal.tsx
import React, { useState } from 'react';
import { MistakeReason, Question } from '../types';
import { createMistakeFromQuestion } from '../services/mistakeTracker';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LogMistakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
  myAnswerText: string;
  sourceContext: string;
  onSuccess?: () => void;
}

const REASONS: MistakeReason[] = [
  'Conceptual Gap',
  'Silly / Misread Question',
  'Calculation Mistake',
  'Time-Pressure Rush',
  'Formula Forgotten',
  'Concept gap',
  'Forgot information',
  'Careless mistake',
];

export const LogMistakeModal: React.FC<LogMistakeModalProps> = ({
  isOpen,
  onClose,
  question,
  myAnswerText,
  sourceContext,
  onSuccess,
}) => {
  const [selectedReason, setSelectedReason] = useState<MistakeReason>('Concept gap');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await createMistakeFromQuestion({
        question,
        myAnswer: myAnswerText,
        reason: selectedReason,
        source: sourceContext,
        notes,
      });
      setIsDone(true);
      setTimeout(() => {
        setIsDone(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 1000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const correctAnswerText =
    question.options && question.correctAnswer !== undefined
      ? question.options[question.correctAnswer]
      : 'Option ' + (question.correctAnswer + 1);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2 text-rose-600 font-bold text-lg">
            <AlertCircle className="w-5 h-5" />
            <span>Add to Mistake Notebook</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isDone ? (
          <div className="py-8 text-center text-emerald-600 space-y-2">
            <CheckCircle2 className="w-12 h-12 mx-auto animate-bounce" />
            <p className="font-bold text-lg">Logged into Mistake Notebook!</p>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            {/* Question Summary */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="font-semibold text-slate-900 line-clamp-2">{question.question}</div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200">
                <div>
                  <span className="text-slate-400">My Answer: </span>
                  <span className="font-semibold text-rose-600">{myAnswerText || 'Unattempted'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Correct: </span>
                  <span className="font-semibold text-emerald-600">{correctAnswerText}</span>
                </div>
              </div>
            </div>

            {/* Reason Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                What was the root cause?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {REASONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setSelectedReason(reason)}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedReason === reason
                        ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Reflective Notes / Rule to remember (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="e.g. Always check if the question says 'NOT' or 'FALSE'..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md shadow-rose-600/20 disabled:opacity-50"
              >
                {isSaving ? 'Logging...' : 'Save Mistake'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogMistakeModal;
