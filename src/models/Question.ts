// src/models/Question.ts
export type Difficulty = "Easy" | "Medium" | "Hard";
export type QuestionType = "MCQ" | "Subjective" | "MatchTheFollowing";

export interface Question {
  id: string; // uuid
  text: string;
  options?: string[]; // for MCQ
  correctOptionIndex?: number; // index in options array
  correctAnswer?: string; // for non‑MCQ
  explanation: string;
  subject: string; // e.g., "IT", "Reasoning"
  itModule?: string; // DBMS, OS, etc.
  topic: string;
  difficulty: Difficulty;
  source: string; // Self‑created, notes, etc.
  tags: string[];
  type: QuestionType;
}
