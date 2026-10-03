// src/services/importExport.ts
import { Question, Subject, Difficulty, QuestionSource, ITModule } from '../types';

export interface ImportValidationResult {
  validQuestions: Question[];
  errors: { row: number; reason: string }[];
}

// Generate an example CSV template
export function getExampleCSVTemplate(): string {
  const headers = [
    'question',
    'optionA',
    'optionB',
    'optionC',
    'optionD',
    'correctAnswer',
    'explanation',
    'subject',
    'itModule',
    'topic',
    'difficulty',
    'source',
    'tags',
  ];

  const sampleRow1 = [
    '"What is the primary key in a relational database?"',
    '"A non-unique column"',
    '"A column or set of columns uniquely identifying a row"',
    '"Any foreign key reference"',
    '"A column with only NULL values"',
    '"B"',
    '"Primary key enforces entity integrity and uniqueness with NOT NULL constraint."',
    '"IT"',
    '"DBMS"',
    '"Keys"',
    '"Easy"',
    '"Personal notes"',
    '"DBMS;Keys;Relational"',
  ];

  const sampleRow2 = [
    '"Which layer of OSI model provides end-to-end communication?"',
    '"Network"',
    '"Data Link"',
    '"Transport"',
    '"Session"',
    '"C"',
    '"Transport layer (TCP/UDP) handles host-to-host or end-to-end communication."',
    '"IT"',
    '"Computer Networks"',
    '"OSI model"',
    '"Easy"',
    '"Self-created"',
    '"Networks;OSI;Transport"',
  ];

  return [headers.join(','), sampleRow1.join(','), sampleRow2.join(',')].join('\n');
}

// Generate an example JSON template
export function getExampleJSONTemplate(): string {
  const exampleData = [
    {
      question: 'Which scheduling algorithm is non-preemptive and selects the job with the lowest CPU burst time?',
      options: ['Round Robin', 'Shortest Job First (SJF)', 'Priority Scheduling', 'Multilevel Queue'],
      correctAnswer: 1,
      explanation: 'SJF executes the process with the shortest CPU burst time next.',
      subject: 'IT',
      itModule: 'Operating Systems',
      topic: 'Scheduling',
      difficulty: 'Easy',
      source: 'Previous-year material',
      tags: ['OS', 'Scheduling', 'CPU'],
      type: 'MCQ',
    },
  ];
  return JSON.stringify(exampleData, null, 2);
}

// Parse CSV line taking care of quotes
function parseCSVLine(text: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur.trim());
  return result;
}

// Parse and validate CSV data
export function parseAndValidateCSV(csvText: string): ImportValidationResult {
  const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  const validQuestions: Question[] = [];
  const errors: { row: number; reason: string }[] = [];

  if (lines.length < 2) {
    return { validQuestions: [], errors: [{ row: 0, reason: 'File has no content or missing data rows.' }] };
  }

  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const getIndex = (name: string) => headers.findIndex((h) => h.includes(name.toLowerCase()));

  const idxQ = getIndex('question');
  const idxA = getIndex('optiona');
  const idxB = getIndex('optionb');
  const idxC = getIndex('optionc');
  const idxD = getIndex('optiond');
  const idxCorrect = getIndex('correctanswer') >= 0 ? getIndex('correctanswer') : getIndex('answer');
  const idxExp = getIndex('explanation');
  const idxSub = getIndex('subject');
  const idxMod = getIndex('itmodule');
  const idxTop = getIndex('topic');
  const idxDiff = getIndex('difficulty');
  const idxSrc = getIndex('source');
  const idxTags = getIndex('tags');

  if (idxQ < 0 || idxA < 0 || idxB < 0 || idxCorrect < 0) {
    return {
      validQuestions: [],
      errors: [
        {
          row: 1,
          reason: 'Required header columns missing. Ensure columns "question", "optionA", "optionB", "correctAnswer" exist.',
        },
      ],
    };
  }

  for (let i = 1; i < lines.length; i++) {
    const rowNum = i + 1;
    const cols = parseCSVLine(lines[i]);
    const qText = cols[idxQ]?.trim();
    if (!qText) {
      errors.push({ row: rowNum, reason: 'Question text is empty.' });
      continue;
    }

    const options: string[] = [];
    if (cols[idxA]) options.push(cols[idxA]);
    if (cols[idxB]) options.push(cols[idxB]);
    if (idxC >= 0 && cols[idxC]) options.push(cols[idxC]);
    if (idxD >= 0 && cols[idxD]) options.push(cols[idxD]);

    if (options.length < 2) {
      errors.push({ row: rowNum, reason: 'Must have at least optionA and optionB.' });
      continue;
    }

    const rawCorrect = (cols[idxCorrect] || '').toUpperCase().trim();
    let correctIdx = 0;
    if (rawCorrect === 'A' || rawCorrect === '1' || rawCorrect === '0') correctIdx = 0;
    else if (rawCorrect === 'B' || rawCorrect === '2') correctIdx = 1;
    else if (rawCorrect === 'C' || rawCorrect === '3') correctIdx = 2;
    else if (rawCorrect === 'D' || rawCorrect === '4') correctIdx = 3;
    else {
      // Try to match option text directly
      const foundIdx = options.findIndex((opt) => opt.toLowerCase() === rawCorrect.toLowerCase());
      correctIdx = foundIdx >= 0 ? foundIdx : 0;
    }

    const rawSubject = cols[idxSub] || 'IT';
    let subject: Subject = 'IT';
    if (['reasoning', 'logical'].some((s) => rawSubject.toLowerCase().includes(s))) subject = 'Reasoning';
    else if (['english', 'verbal'].some((s) => rawSubject.toLowerCase().includes(s))) subject = 'English';
    else if (['quant', 'math', 'aptitude'].some((s) => rawSubject.toLowerCase().includes(s))) subject = 'Quant';
    else if (['bank', 'ca', 'current'].some((s) => rawSubject.toLowerCase().includes(s))) subject = 'Banking & CA';

    const rawDiff = (cols[idxDiff] || 'Medium').toLowerCase();
    let difficulty: Difficulty = 'Medium';
    if (rawDiff.includes('easy')) difficulty = 'Easy';
    else if (rawDiff.includes('hard') || rawDiff.includes('difficult')) difficulty = 'Hard';

    const tags = idxTags >= 0 && cols[idxTags] ? cols[idxTags].split(/[,;]/).map((t) => t.trim()).filter(Boolean) : [];

    const newQ: Question = {
      id: `q-csv-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
      question: qText,
      options,
      correctAnswer: correctIdx,
      explanation: (idxExp >= 0 ? cols[idxExp] : '') || 'No explanation provided.',
      subject,
      itModule: idxMod >= 0 && cols[idxMod] ? (cols[idxMod] as ITModule) : undefined,
      topic: (idxTop >= 0 ? cols[idxTop] : '') || 'General',
      difficulty,
      source: (idxSrc >= 0 ? (cols[idxSrc] as QuestionSource) : 'Other') || 'Other',
      tags,
      type: 'MCQ',
      createdAt: new Date().toISOString(),
    };

    validQuestions.push(newQ);
  }

  return { validQuestions, errors };
}

// Parse and validate JSON data
export function parseAndValidateJSON(jsonText: string): ImportValidationResult {
  const validQuestions: Question[] = [];
  const errors: { row: number; reason: string }[] = [];

  let parsed: any;
  try {
    parsed = JSON.parse(jsonText);
  } catch (e: any) {
    return { validQuestions: [], errors: [{ row: 0, reason: `Invalid JSON syntax: ${e.message}` }] };
  }

  const items = Array.isArray(parsed) ? parsed : parsed.questions ? parsed.questions : [parsed];

  items.forEach((item: any, idx: number) => {
    const row = idx + 1;
    if (!item.question || typeof item.question !== 'string') {
      errors.push({ row, reason: 'Field "question" is missing or not a string.' });
      return;
    }
    if (!Array.isArray(item.options) || item.options.length < 2) {
      errors.push({ row, reason: 'Field "options" must be an array with at least 2 items.' });
      return;
    }

    let correctIdx = 0;
    if (typeof item.correctAnswer === 'number') {
      correctIdx = item.correctAnswer;
    } else if (typeof item.correctAnswer === 'string') {
      const upper = item.correctAnswer.toUpperCase();
      if (upper === 'A' || upper === '0') correctIdx = 0;
      else if (upper === 'B' || upper === '1') correctIdx = 1;
      else if (upper === 'C' || upper === '2') correctIdx = 2;
      else if (upper === 'D' || upper === '3') correctIdx = 3;
    }

    const question: Question = {
      id: item.id || `q-json-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      question: item.question.trim(),
      options: item.options.map((o: any) => String(o).trim()),
      correctAnswer: correctIdx,
      explanation: item.explanation || 'No explanation provided.',
      subject: item.subject || 'IT',
      itModule: item.itModule,
      topic: item.topic || 'General',
      difficulty: item.difficulty || 'Medium',
      source: item.source || 'Other',
      tags: Array.isArray(item.tags) ? item.tags : [],
      type: item.type || 'MCQ',
      createdAt: item.createdAt || new Date().toISOString(),
    };

    validQuestions.push(question);
  });

  return { validQuestions, errors };
}

// Export questions as CSV string
export function exportQuestionsToCSV(questions: Question[]): string {
  const headers = [
    'id',
    'question',
    'optionA',
    'optionB',
    'optionC',
    'optionD',
    'correctAnswerIndex',
    'explanation',
    'subject',
    'itModule',
    'topic',
    'difficulty',
    'source',
    'tags',
  ];

  const rows = questions.map((q) => {
    const clean = (val: string) => `"${(val || '').replace(/"/g, '""')}"`;
    return [
      clean(q.id),
      clean(q.question),
      clean(q.options[0] || ''),
      clean(q.options[1] || ''),
      clean(q.options[2] || ''),
      clean(q.options[3] || ''),
      q.correctAnswer,
      clean(q.explanation),
      clean(q.subject),
      clean(q.itModule || ''),
      clean(q.topic),
      clean(q.difficulty),
      clean(q.source),
      clean(q.tags?.join(';') || ''),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}
