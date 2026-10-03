// src/services/questionProvider.ts
import { Question, Subject, ITModule, Difficulty } from '../types';
import { getAllItems, putItem, deleteItem } from './db';

export interface QuestionFilter {
  subject?: Subject;
  itModule?: ITModule;
  topic?: string;
  difficulty?: Difficulty | 'Mixed';
  source?: string;
  search?: string;
  tags?: string[];
  onlyBookmarked?: boolean;
  onlyImportant?: boolean;
  onlyDifficult?: boolean;
}

export interface IQuestionProvider {
  name: string;
  isConfigured(): boolean;
  getQuestions(filter?: QuestionFilter): Promise<Question[]>;
  getQuestionById(id: string): Promise<Question | undefined>;
  addQuestion(question: Question): Promise<void>;
  updateQuestion(question: Question): Promise<void>;
  deleteQuestion(id: string): Promise<void>;
  bulkAddQuestions(questions: Question[], allowOverwrite?: boolean): Promise<{ added: number; overwritten: number }>;
}

/** Local Question Bank Provider (IndexedDB backed) */
export class LocalQuestionBank implements IQuestionProvider {
  name = 'Local Question Bank';

  isConfigured(): boolean {
    return true;
  }

  async getQuestions(filter?: QuestionFilter): Promise<Question[]> {
    const all = await getAllItems<Question>('questions');
    if (!filter) return all;

    return all.filter((q) => {
      if (filter.subject && q.subject !== filter.subject) return false;
      if (filter.itModule && q.itModule !== filter.itModule) return false;
      if (filter.topic && q.topic.toLowerCase() !== filter.topic.toLowerCase()) return false;
      if (filter.difficulty && filter.difficulty !== 'Mixed' && q.difficulty !== filter.difficulty) return false;
      if (filter.source && q.source !== filter.source) return false;
      if (filter.onlyBookmarked && !q.isBookmarked) return false;
      if (filter.onlyImportant && !q.isImportant) return false;
      if (filter.onlyDifficult && !q.isDifficult) return false;
      if (filter.search) {
        const query = filter.search.toLowerCase();
        const matchesText = q.question.toLowerCase().includes(query);
        const matchesExplanation = q.explanation.toLowerCase().includes(query);
        const matchesTag = q.tags?.some((t) => t.toLowerCase().includes(query));
        const matchesTopic = q.topic.toLowerCase().includes(query);
        if (!matchesText && !matchesExplanation && !matchesTag && !matchesTopic) return false;
      }
      return true;
    });
  }

  async getQuestionById(id: string): Promise<Question | undefined> {
    const all = await this.getQuestions();
    return all.find((q) => q.id === id);
  }

  async addQuestion(question: Question): Promise<void> {
    await putItem('questions', question);
  }

  async updateQuestion(question: Question): Promise<void> {
    await putItem('questions', question);
  }

  async deleteQuestion(id: string): Promise<void> {
    await deleteItem('questions', id);
  }

  async bulkAddQuestions(questions: Question[], allowOverwrite: boolean = false): Promise<{ added: number; overwritten: number }> {
    const existing = await this.getQuestions();
    const existingMap = new Map(existing.map((q) => [q.id, q]));
    let added = 0;
    let overwritten = 0;

    for (const q of questions) {
      if (existingMap.has(q.id)) {
        if (allowOverwrite) {
          await putItem('questions', q);
          overwritten++;
        }
      } else {
        await putItem('questions', q);
        added++;
      }
    }
    return { added, overwritten };
  }
}

/** External API Provider (Modular stub for future legitimate external APIs) */
export class ExternalAPIProvider implements IQuestionProvider {
  name = 'External API Provider';
  private endpointUrl: string = '';
  private apiKey: string = '';

  constructor(endpointUrl?: string, apiKey?: string) {
    this.endpointUrl = endpointUrl || '';
    this.apiKey = apiKey || '';
  }

  isConfigured(): boolean {
    return Boolean(this.endpointUrl && this.apiKey);
  }

  async getQuestions(filter?: QuestionFilter): Promise<Question[]> {
    if (!this.isConfigured()) {
      return [];
    }
    // Future expansion: fetch from secure authenticated backend proxy
    try {
      const resp = await fetch(`${this.endpointUrl}/api/questions`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.json();
    } catch (e) {
      console.warn('External question provider error:', e);
      return [];
    }
  }

  async getQuestionById(id: string): Promise<Question | undefined> {
    const questions = await this.getQuestions();
    return questions.find((q) => q.id === id);
  }

  async addQuestion(_question: Question): Promise<void> {
    throw new Error('Direct write to external question API is disabled in read-only mode.');
  }

  async updateQuestion(_question: Question): Promise<void> {
    throw new Error('Update on external question API not supported.');
  }

  async deleteQuestion(_id: string): Promise<void> {
    throw new Error('Delete on external question API not supported.');
  }

  async bulkAddQuestions(_questions: Question[]): Promise<{ added: number; overwritten: number }> {
    throw new Error('Bulk upload to external API is managed via external portal.');
  }
}

// Active singleton provider instance
export const questionProvider: IQuestionProvider = new LocalQuestionBank();
