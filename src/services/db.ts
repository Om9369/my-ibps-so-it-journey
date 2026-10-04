// src/services/db.ts
import { openDB, IDBPDatabase } from 'idb';
import { initialQuestions } from '../data/seedQuestions';
import { defaultExamConfigs, initialITTopics, initialChecklist, initialGoals, initialVocabulary, initialCurrentAffairs } from '../data/seedData';
import {
  Question,
  MockTestAttempt,
  ExamConfig,
  MistakeEntry,
  DailyChecklistItem,
  StudySession,
  DailyAnalysis,
  RevisionItem,
  ITTopicProgress,
  CurrentAffairItem,
  VocabularyWord,
  PrepGoal,
} from '../types';

const DB_NAME = 'MyIBPSSOITJourneyDB';
const DB_VERSION = 3;

let dbPromise: Promise<IDBPDatabase<any>> | null = null;

export async function getDB(): Promise<IDBPDatabase<any>> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('questions')) {
          db.createObjectStore('questions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('mockTests')) {
          db.createObjectStore('mockTests', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('examConfigs')) {
          db.createObjectStore('examConfigs', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('mistakes')) {
          db.createObjectStore('mistakes', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('checklist')) {
          db.createObjectStore('checklist', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('studySessions')) {
          db.createObjectStore('studySessions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('dailyAnalyses')) {
          db.createObjectStore('dailyAnalyses', { keyPath: 'date' });
        }
        if (!db.objectStoreNames.contains('revisions')) {
          db.createObjectStore('revisions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('itProgress')) {
          db.createObjectStore('itProgress', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('currentAffairs')) {
          db.createObjectStore('currentAffairs', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('vocabulary')) {
          db.createObjectStore('vocabulary', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('goals')) {
          db.createObjectStore('goals', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('masteryRecords')) {
          db.createObjectStore('masteryRecords', { keyPath: 'conceptId' });
        }
        if (!db.objectStoreNames.contains('conceptProgress')) {
          db.createObjectStore('conceptProgress', { keyPath: 'conceptId' });
        }
        if (!db.objectStoreNames.contains('syllabusState')) {
          db.createObjectStore('syllabusState', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('descriptiveSubmissions')) {
          db.createObjectStore('descriptiveSubmissions', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

// Fallback LocalStorage helpers if IndexedDB is unavailable
function getLS<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function setLS<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

export async function initAppDatabase(): Promise<void> {
  try {
    const db = await getDB();

    // Check if questions are seeded
    const qCount = await db.count('questions');
    if (qCount === 0) {
      const tx = db.transaction('questions', 'readwrite');
      for (const q of initialQuestions) {
        await tx.store.put(q);
      }
      await tx.done;
    }

    // Seed or update official exam configurations
    const txCfg = db.transaction('examConfigs', 'readwrite');
    for (const c of defaultExamConfigs) {
      const existing = await txCfg.store.get(c.id);
      if (!existing) {
        await txCfg.store.put(c);
      }
    }
    await txCfg.done;

    // Seed IT progress
    const itCount = await db.count('itProgress');
    if (itCount === 0) {
      const tx = db.transaction('itProgress', 'readwrite');
      for (const item of initialITTopics) {
        await tx.store.put(item);
      }
      await tx.done;
    }

    // Seed Checklist
    const chkCount = await db.count('checklist');
    if (chkCount === 0) {
      const tx = db.transaction('checklist', 'readwrite');
      for (const item of initialChecklist) {
        await tx.store.put(item);
      }
      await tx.done;
    }

    // Seed Goals
    const goalCount = await db.count('goals');
    if (goalCount === 0) {
      const tx = db.transaction('goals', 'readwrite');
      for (const g of initialGoals) {
        await tx.store.put(g);
      }
      await tx.done;
    }

    // Seed Vocab
    const vocCount = await db.count('vocabulary');
    if (vocCount === 0) {
      const tx = db.transaction('vocabulary', 'readwrite');
      for (const v of initialVocabulary) {
        await tx.store.put(v);
      }
      await tx.done;
    }

    // Seed CA
    const caCount = await db.count('currentAffairs');
    if (caCount === 0) {
      const tx = db.transaction('currentAffairs', 'readwrite');
      for (const ca of initialCurrentAffairs) {
        await tx.store.put(ca);
      }
      await tx.done;
    }

    // Initialize/Sync Mastery Records for the 15-subject syllabus hierarchy
    try {
      const { syncMasteryRecords } = await import('./syllabusEngine');
      await syncMasteryRecords();
    } catch (e) {
      console.warn('Mastery records sync error:', e);
    }
  } catch (err) {
    console.warn('IndexedDB initialization failed, falling back to localStorage:', err);
    if (!localStorage.getItem('prep_seeded')) {
      setLS('prep_questions', initialQuestions);
      setLS('prep_configs', defaultExamConfigs);
      setLS('prep_it_progress', initialITTopics);
      setLS('prep_checklist', initialChecklist);
      setLS('prep_goals', initialGoals);
      setLS('prep_vocabulary', initialVocabulary);
      setLS('prep_ca', initialCurrentAffairs);
      localStorage.setItem('prep_seeded', 'true');
    }
  }

  // Automatic one-time cleanup to start fresh for Week 1 starting Monday Oct 5, 2026
  if (localStorage.getItem('prep_fresh_start_20261005') !== 'true') {
    await cleanPracticeDataStartingMonday();
  }
}

/**
 * Resets all daily practice, study sessions, daily analysis, and past mistakes,
 * while preserving the Question Bank, Quizzes, Exam Configurations, and Vocabulary.
 * Seeds Week 1 Day 1 checklist for Monday, 2026-10-05.
 */
export async function cleanPracticeDataStartingMonday(): Promise<void> {
  try {
    const db = await getDB();
    // Clear dynamic practice stores
    await db.clear('studySessions');
    await db.clear('dailyAnalyses');
    await db.clear('mistakes');
    await db.clear('mockTests');
    await db.clear('revisions');

    // Fresh checklist for Monday (2026-10-05) Week 1 Day 1
    await db.clear('checklist');
    const txChk = db.transaction('checklist', 'readwrite');
    for (const item of initialChecklist) {
      await txChk.store.put(item);
    }
    await txChk.done;

    // Fresh Goals including Aug 2027 Exam milestone
    await db.clear('goals');
    const txGoals = db.transaction('goals', 'readwrite');
    for (const g of initialGoals) {
      await txGoals.store.put(g);
    }
    await txGoals.done;

    // Reset IT syllabus topics to clean 0 progress
    await db.clear('itProgress');
    const txIT = db.transaction('itProgress', 'readwrite');
    for (const t of initialITTopics) {
      await txIT.store.put(t);
    }
    await txIT.done;
  } catch (e) {
    console.warn('Error clearing IndexedDB stores, resetting local storage:', e);
  }

  // Clear LocalStorage practice keys
  clearActiveMockDraft();
  localStorage.removeItem('prep_studySessions');
  localStorage.removeItem('prep_dailyAnalyses');
  localStorage.removeItem('prep_mistakes');
  localStorage.removeItem('prep_mockTests');
  localStorage.removeItem('prep_revisions');
  localStorage.removeItem('sunday_workflow_steps');
  localStorage.removeItem('sunday_next_week_plan');
  setLS('prep_checklist', initialChecklist);
  setLS('prep_goals', initialGoals);
  setLS('prep_it_progress', initialITTopics);

  localStorage.setItem('prep_fresh_start_20261005', 'true');
}

// Backwards compatibility alias
export const cleanPracticeDataStartingToday = cleanPracticeDataStartingMonday;

// Generic Storage Operations
export async function getAllItems<T>(storeName: string): Promise<T[]> {
  try {
    const db = await getDB();
    return (await db.getAll(storeName)) as T[];
  } catch (e) {
    return getLS<T[]>(`prep_${storeName}`, []);
  }
}

export async function getItemById<T>(storeName: string, key: string): Promise<T | undefined> {
  try {
    const db = await getDB();
    return (await db.get(storeName, key)) as T | undefined;
  } catch (e) {
    const items = getLS<T[]>(`prep_${storeName}`, []);
    return items.find((i: any) => i.id === key || i.date === key);
  }
}

export async function putItem<T extends { id?: string; date?: string }>(storeName: string, item: T): Promise<void> {
  try {
    const db = await getDB();
    await db.put(storeName, item);
  } catch (e) {
    const items = getLS<T[]>(`prep_${storeName}`, []);
    const key = item.id || item.date;
    const idx = items.findIndex((i: any) => (i.id || i.date) === key);
    if (idx >= 0) {
      items[idx] = item;
    } else {
      items.push(item);
    }
    setLS(`prep_${storeName}`, items);
  }
}

export async function deleteItem(storeName: string, key: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete(storeName, key);
  } catch (e) {
    const items = getLS<any[]>(`prep_${storeName}`, []);
    const filtered = items.filter((i: any) => (i.id || i.date) !== key);
    setLS(`prep_${storeName}`, filtered);
  }
}

// Active Mock persistence (for refresh protection)
export const ACTIVE_MOCK_STORAGE_KEY = 'ibps_active_mock_attempt';

export function saveActiveMockDraft(mock: MockTestAttempt): void {
  try {
    localStorage.setItem(ACTIVE_MOCK_STORAGE_KEY, JSON.stringify(mock));
  } catch (e) {
    console.error('Error saving active mock draft:', e);
  }
}

export function getActiveMockDraft(): MockTestAttempt | null {
  try {
    const raw = localStorage.getItem(ACTIVE_MOCK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function clearActiveMockDraft(): void {
  try {
    localStorage.removeItem(ACTIVE_MOCK_STORAGE_KEY);
  } catch (e) {
    console.error('Error clearing active mock draft:', e);
  }
}

// Complete Full Backup & Restore
export async function exportAllDataAsJSON(): Promise<string> {
  const [
    questions,
    mockTests,
    examConfigs,
    mistakes,
    checklist,
    studySessions,
    dailyAnalyses,
    revisions,
    itProgress,
    currentAffairs,
    vocabulary,
    goals,
    masteryRecords,
    conceptProgress,
    descriptiveSubmissions,
  ] = await Promise.all([
    getAllItems<Question>('questions'),
    getAllItems<MockTestAttempt>('mockTests'),
    getAllItems<ExamConfig>('examConfigs'),
    getAllItems<MistakeEntry>('mistakes'),
    getAllItems<DailyChecklistItem>('checklist'),
    getAllItems<StudySession>('studySessions'),
    getAllItems<DailyAnalysis>('dailyAnalyses'),
    getAllItems<RevisionItem>('revisions'),
    getAllItems<ITTopicProgress>('itProgress'),
    getAllItems<CurrentAffairItem>('currentAffairs'),
    getAllItems<VocabularyWord>('vocabulary'),
    getAllItems<PrepGoal>('goals'),
    getAllItems<any>('masteryRecords'),
    getAllItems<any>('conceptProgress'),
    getAllItems<any>('descriptiveSubmissions'),
  ]);

  const backupData = {
    version: '3.0',
    exportDate: new Date().toISOString(),
    appName: 'My IBPS SO IT Journey',
    data: {
      questions,
      mockTests,
      examConfigs,
      mistakes,
      checklist,
      studySessions,
      dailyAnalyses,
      revisions,
      itProgress,
      currentAffairs,
      vocabulary,
      goals,
      masteryRecords,
      conceptProgress,
      descriptiveSubmissions,
    },
  };

  return JSON.stringify(backupData, null, 2);
}

export async function restoreAllDataFromJSON(jsonString: string): Promise<{ success: boolean; message: string; count?: number }> {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.data) {
      throw new Error('Invalid backup file format: missing "data" key');
    }
    const data = parsed.data;
    const db = await getDB();

    const stores: (keyof typeof data)[] = [
      'questions',
      'mockTests',
      'examConfigs',
      'mistakes',
      'checklist',
      'studySessions',
      'dailyAnalyses',
      'revisions',
      'itProgress',
      'currentAffairs',
      'vocabulary',
      'goals',
      'masteryRecords',
      'conceptProgress',
      'descriptiveSubmissions',
    ];

    let totalRestored = 0;
    for (const store of stores) {
      const items = data[store];
      if (Array.isArray(items)) {
        const tx = db.transaction(store as any, 'readwrite');
        for (const item of items) {
          await tx.store.put(item);
          totalRestored++;
        }
        await tx.done;
      }
    }

    return { success: true, message: `Successfully restored ${totalRestored} total records!`, count: totalRestored };
  } catch (err: any) {
    return { success: false, message: `Restore failed: ${err.message}` };
  }
}

export async function resetAllDataToDefault(): Promise<void> {
  const db = await getDB();
  const stores = [
    'questions',
    'mockTests',
    'examConfigs',
    'mistakes',
    'checklist',
    'studySessions',
    'dailyAnalyses',
    'revisions',
    'itProgress',
    'currentAffairs',
    'vocabulary',
    'goals',
  ];

  for (const s of stores) {
    try {
      await db.clear(s as any);
    } catch (e) {
      // ignore
    }
  }

  localStorage.clear();
  await initAppDatabase();
}
