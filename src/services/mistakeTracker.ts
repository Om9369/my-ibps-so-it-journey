// src/services/mistakeTracker.ts
import { MistakeEntry, MistakeReason, Question } from '../types';
import { getAllItems, putItem, deleteItem } from './db';

export async function getAllMistakes(): Promise<MistakeEntry[]> {
  const items = await getAllItems<MistakeEntry>('mistakes');
  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function createMistakeFromQuestion(params: {
  question: Question;
  myAnswer: string;
  reason: MistakeReason;
  source: string;
  notes?: string;
}): Promise<MistakeEntry> {
  const { question, myAnswer, reason, source, notes } = params;

  const entry: MistakeEntry = {
    id: `mistake-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    questionId: question.id,
    questionText: question.question,
    subject: question.subject,
    itModule: question.itModule,
    topic: question.topic,
    myAnswer,
    correctAnswer: question.options[question.correctAnswer] || `Option ${question.correctAnswer + 1}`,
    explanation: question.explanation,
    reason,
    date: new Date().toISOString(),
    source,
    status: 'Open',
    reviewCount: 0,
    notes: notes || '',
  };

  await putItem('mistakes', entry);
  return entry;
}

export async function updateMistake(entry: MistakeEntry): Promise<void> {
  await putItem('mistakes', entry);
}

export async function deleteMistake(id: string): Promise<void> {
  await deleteItem('mistakes', id);
}

export async function incrementMistakeReview(id: string): Promise<void> {
  const list = await getAllMistakes();
  const found = list.find((m) => m.id === id);
  if (found) {
    found.reviewCount += 1;
    if (found.status === 'Open' && found.reviewCount >= 2) {
      found.status = 'Reviewing';
    }
    await putItem('mistakes', found);
  }
}

export async function resolveMistake(id: string): Promise<void> {
  const list = await getAllMistakes();
  const found = list.find((m) => m.id === id);
  if (found) {
    found.status = 'Resolved';
    await putItem('mistakes', found);
  }
}
