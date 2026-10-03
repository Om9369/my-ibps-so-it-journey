// src/data/seedData.ts
import { ExamConfig, ITTopicProgress, DailyChecklistItem, PrepGoal, VocabularyWord, CurrentAffairItem } from '../types';

export const defaultExamConfigs: ExamConfig[] = [
  {
    id: 'config-it-mains-default',
    name: 'IBPS SO IT Officer - Mains (Professional Knowledge)',
    description: 'Template pattern for Professional Knowledge (IT). Verify against the official recruitment notification for your cycle.',
    isVerified: false,
    totalTimeMinutes: 45,
    negativeMarkingEnabled: true,
    sections: [
      {
        id: 'sec-it-1',
        name: 'Professional Knowledge (IT)',
        subject: 'IT',
        questionCount: 60,
        maxMarks: 60,
        marksPerCorrect: 1.0,
        negativeMarks: 0.25,
        timeLimitMinutes: 45,
      },
    ],
  },
  {
    id: 'config-it-prelims-default',
    name: 'IBPS SO IT Officer - Prelims',
    description: 'Standard 3-section Prelims pattern: English, Reasoning, Quantitative Aptitude. Verify against official notification.',
    isVerified: false,
    totalTimeMinutes: 120,
    negativeMarkingEnabled: true,
    sections: [
      {
        id: 'sec-prelims-eng',
        name: 'English Language',
        subject: 'English',
        questionCount: 50,
        maxMarks: 25,
        marksPerCorrect: 0.5,
        negativeMarks: 0.125,
        timeLimitMinutes: 40,
      },
      {
        id: 'sec-prelims-reas',
        name: 'Reasoning Ability',
        subject: 'Reasoning',
        questionCount: 50,
        maxMarks: 50,
        marksPerCorrect: 1.0,
        negativeMarks: 0.25,
        timeLimitMinutes: 40,
      },
      {
        id: 'sec-prelims-quant',
        name: 'Quantitative Aptitude',
        subject: 'Quant',
        questionCount: 50,
        maxMarks: 50,
        marksPerCorrect: 1.0,
        negativeMarks: 0.25,
        timeLimitMinutes: 40,
      },
    ],
  },
  {
    id: 'config-sectional-it-quick',
    name: 'Quick IT Sectional Test (30 Questions)',
    description: 'Focused practice test on IT modules (30 mins).',
    isVerified: false,
    totalTimeMinutes: 30,
    negativeMarkingEnabled: true,
    sections: [
      {
        id: 'sec-quick-it',
        name: 'Professional Knowledge IT',
        subject: 'IT',
        questionCount: 30,
        maxMarks: 30,
        marksPerCorrect: 1.0,
        negativeMarks: 0.25,
        timeLimitMinutes: 30,
      },
    ],
  },
];

export const initialITTopics: ITTopicProgress[] = [
  // DBMS
  { id: 'top-dbms-1', module: 'DBMS', subtopic: 'DBMS fundamentals & Architecture', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: '3-tier architecture, data independence (physical vs logical).' },
  { id: 'top-dbms-2', module: 'DBMS', subtopic: 'ER model & Relational Model', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Entities, attributes, cardinality, ER to relational schema mapping.' },
  { id: 'top-dbms-3', module: 'DBMS', subtopic: 'Keys (Super, Candidate, Primary, Foreign)', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Minimal super keys are candidate keys.' },
  { id: 'top-dbms-4', module: 'DBMS', subtopic: 'Normalisation (1NF, 2NF, 3NF, BCNF, 4NF)', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Lossless join and dependency preservation properties.' },
  { id: 'top-dbms-5', module: 'DBMS', subtopic: 'SQL & Joins (Inner, Outer, Cross, Self)', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Complex group by, having, subqueries, and window functions.' },
  { id: 'top-dbms-6', module: 'DBMS', subtopic: 'Transactions & ACID properties', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Atomicity, Consistency, Isolation, Durability.' },
  { id: 'top-dbms-7', module: 'DBMS', subtopic: 'Concurrency Control & 2PL (Strict, Rigorous)', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Conflict serializability, view serializability, lock mechanisms.' },
  { id: 'top-dbms-8', module: 'DBMS', subtopic: 'Indexing & B/B+ Trees', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Sparse vs dense index, clustered vs unclustered, B+ tree properties.' },
  { id: 'top-dbms-9', module: 'DBMS', subtopic: 'Query optimisation', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Relational algebra heuristics and cost-based query evaluation.' },
  { id: 'top-dbms-10', module: 'DBMS', subtopic: 'Backup and recovery (WAL, Checkpoints)', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'ARIES recovery algorithm, redo/undo log processing.' },
  { id: 'top-dbms-11', module: 'DBMS', subtopic: 'Database security & Privileges', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'GRANT, REVOKE, role-based access control, SQL injection defense.' },

  // Operating Systems
  { id: 'top-os-1', module: 'Operating Systems', subtopic: 'Processes, Threads & PCB', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Process states, context switching, user vs kernel level threads.' },
  { id: 'top-os-2', module: 'Operating Systems', subtopic: 'CPU Scheduling Algorithms', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'FCFS, SJF, SRTF, Round Robin, Multilevel feedback queues.' },
  { id: 'top-os-3', module: 'Operating Systems', subtopic: 'Process Synchronisation & Semaphores', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Critical section, Peterson solution, counting vs binary semaphores.' },
  { id: 'top-os-4', module: 'Operating Systems', subtopic: 'Deadlocks (Detection, Prevention, Avoidance)', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Banker algorithm, resource allocation graph, Coffman conditions.' },
  { id: 'top-os-5', module: 'Operating Systems', subtopic: 'Memory Management & Paging', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Internal vs external fragmentation, paging hardware, TLB calculation.' },
  { id: 'top-os-6', module: 'Operating Systems', subtopic: 'Virtual Memory & Page Replacement', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Demand paging, FIFO Belady anomaly, LRU, Optimal replacement.' },
  { id: 'top-os-7', module: 'Operating Systems', subtopic: 'File Systems & Disk Scheduling', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'FAT, inode, SSTF, SCAN, C-SCAN disk scheduling.' },
  { id: 'top-os-8', module: 'Operating Systems', subtopic: 'Linux Commands & Architecture', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'chmod, chown, grep, sed, process signals, bash scripting.' },
  { id: 'top-os-9', module: 'Operating Systems', subtopic: 'Windows & OS Security', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Access control lists, kernel protection rings.' },

  // Computer Networks
  { id: 'top-cn-1', module: 'Computer Networks', subtopic: 'OSI Model vs TCP/IP Protocol Stack', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: '7-layer OSI duties, encapsulation and decapsulation.' },
  { id: 'top-cn-2', module: 'Computer Networks', subtopic: 'IP Addressing & Subnetting (CIDR/VLSM)', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Classless addressing, subnet mask calculations, network/broadcast IDs.' },
  { id: 'top-cn-3', module: 'Computer Networks', subtopic: 'Routing Protocols (RIP, OSPF, BGP)', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Distance Vector vs Link State vs Path Vector algorithms.' },
  { id: 'top-cn-4', module: 'Computer Networks', subtopic: 'Transport Layer: TCP vs UDP & Handshake', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'TCP 3-way handshake, 4-way termination, flow control sliding window.' },
  { id: 'top-cn-5', module: 'Computer Networks', subtopic: 'Application Protocols (DNS, HTTP/S, DHCP, FTP, SMTP)', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Port numbers, TLS handshake, persistent vs non-persistent HTTP.' },
  { id: 'top-cn-6', module: 'Computer Networks', subtopic: 'Network Security (Firewalls, IDS/IPS, VPN, IPsec)', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Packet filtering, stateful inspection, AH and ESP in IPsec.' },

  // Data Structures & Algorithms
  { id: 'top-ds-1', module: 'Data Structures', subtopic: 'Arrays, Linked Lists, Stacks & Queues', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Singly, doubly, circular lists, infix to postfix evaluation.' },
  { id: 'top-ds-2', module: 'Data Structures', subtopic: 'Trees, BST & AVL Trees', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Inorder/preorder/postorder traversals, balancing rotations.' },
  { id: 'top-ds-3', module: 'Data Structures', subtopic: 'Graphs (BFS, DFS, Representations)', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Adjacency matrix vs list, cycle detection, topological sort.' },
  { id: 'top-ds-4', module: 'Data Structures', subtopic: 'Hashing & Collision Resolution', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Chaining vs Open Addressing (Linear, Quadratic, Double Hashing).' },
  { id: 'top-algo-1', module: 'Algorithms', subtopic: 'Sorting & Searching (Time & Space Complexity)', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Merge sort, Quick sort, Heap sort, Binary search complexities.' },
  { id: 'top-algo-2', module: 'Algorithms', subtopic: 'Greedy & Dynamic Programming', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Fractional knapsack, 0/1 knapsack, LCS, Huffman coding.' },

  // Software Engineering & Programming
  { id: 'top-se-1', module: 'Software Engineering', subtopic: 'SDLC Models (Waterfall, Agile, Scrum, Spiral)', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Phases, sprint rituals, risk-driven spiral model.' },
  { id: 'top-se-2', module: 'Software Engineering', subtopic: 'Software Testing (White-box, Black-box, Unit, Integration)', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Equivalence partitioning, boundary value analysis, cyclomatic complexity.' },
  { id: 'top-prog-1', module: 'Programming & OOP', subtopic: 'OOP Concepts (Encapsulation, Inheritance, Polymorphism)', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Abstract classes, interfaces, method overloading vs overriding.' },
  { id: 'top-prog-2', module: 'Programming & OOP', subtopic: 'Java / C++ Fundamentals & Memory Management', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Garbage collection, pointers, exception handling mechanisms.' },

  // Cybersecurity
  { id: 'top-cyber-1', module: 'Cybersecurity', subtopic: 'Cryptography (Symmetric: AES/DES, Asymmetric: RSA)', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Public/private key pairs, block ciphers, stream ciphers.' },
  { id: 'top-cyber-2', module: 'Cybersecurity', subtopic: 'Digital Signatures, Certificates & PKI', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'SHA-256 hashing, CA issuance, non-repudiation.' },
  { id: 'top-cyber-3', module: 'Cybersecurity', subtopic: 'Common Web Attacks (SQLi, XSS, CSRF, DDoS)', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Input validation, parameterized queries, CSRF tokens.' },
  { id: 'top-cyber-4', module: 'Cybersecurity', subtopic: 'IT Act 2000 & Cyber Forensics Basics', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Section 66 offenses, digital evidence handling guidelines.' },

  // Computer Architecture, Web, Cloud, AI
  { id: 'top-coa-1', module: 'Computer Architecture', subtopic: 'Pipelining, Hazards & Instruction Set Architecture', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Structural, data, and control hazard resolutions.' },
  { id: 'top-coa-2', module: 'Computer Architecture', subtopic: 'Memory Hierarchy, Cache Mapping & Coherence', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Direct, associative, set-associative cache mappings.' },
  { id: 'top-web-1', module: 'Web Technologies', subtopic: 'HTML5, CSS3, JavaScript & REST APIs', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'HTTP methods, status codes, stateless API design.' },
  { id: 'top-cloud-1', module: 'Cloud Computing', subtopic: 'Cloud Models (IaaS, PaaS, SaaS) & Virtualization', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Hypervisors, private/public/hybrid cloud deployment.' },
  { id: 'top-ai-1', module: 'AI & Machine Learning', subtopic: 'AI/ML Fundamentals & Banking Use Cases', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Supervised vs unsupervised learning, fraud detection systems.' },
  { id: 'top-iot-1', module: 'IoT & Blockchain', subtopic: 'Blockchain in Banking & IoT Protocols', status: 'Not Started', questionsPracticed: 0, accuracy: 0, notes: 'Distributed ledger, consensus algorithms (PoW, PoS), smart contracts.' },
];

/**
 * Foundation Curriculum: Starts from absolute basics and builds up to advanced.
 * Set for a disciplined 3.0 Hours (180 minutes) daily study allocation.
 */
export const initialChecklist: DailyChecklistItem[] = [
  {
    id: 'chk-1',
    category: 'IT',
    title: 'IT Basics: Computer Architecture Fundamentals & Memory Hierarchy (Bits, Bytes, Cache, RAM, ROM)',
    subject: 'IT',
    topic: 'Computer Architecture Fundamentals',
    estimatedMinutes: 45,
    actualMinutes: 0,
    completed: false,
    notes: 'Focus on registers, cache levels (L1/L2/L3), and basic CPU instruction cycles.',
    date: '2026-10-03',
  },
  {
    id: 'chk-2',
    category: 'IT',
    title: 'IT Basics Practice: 15 Questions on Number Systems & Hardware Fundamentals',
    subject: 'IT',
    topic: 'Basic Practice',
    estimatedMinutes: 25,
    actualMinutes: 0,
    completed: false,
    notes: 'Solve on timer; focus on binary, octal, hexadecimal conversions.',
    date: '2026-10-03',
  },
  {
    id: 'chk-3',
    category: 'Reasoning',
    title: 'Reasoning Basics: Alphabetical & Alphanumeric Series rules + 10 questions',
    subject: 'Reasoning',
    topic: 'Alphabetical Series',
    estimatedMinutes: 25,
    actualMinutes: 0,
    completed: false,
    notes: 'Memorize forward & backward letter positions (EJOTY rule).',
    date: '2026-10-03',
  },
  {
    id: 'chk-4',
    category: 'Quant',
    title: 'Quant Basics: Vedic Speed Math, Squares (1-50), Cubes (1-30) & Percent-Fraction Table',
    subject: 'Quant',
    topic: 'Speed Math & Fractions',
    estimatedMinutes: 30,
    actualMinutes: 0,
    completed: false,
    notes: 'Essential foundation for simplification, approximation, and DI.',
    date: '2026-10-03',
  },
  {
    id: 'chk-5',
    category: 'English',
    title: 'English Basics: 8 Parts of Speech & Subject-Verb Agreement Rules + Editorial Reading (15 min)',
    subject: 'English',
    topic: 'Grammar Foundations',
    estimatedMinutes: 25,
    actualMinutes: 0,
    completed: false,
    notes: 'Note down 5 unfamiliar words with synonyms and antonyms.',
    date: '2026-10-03',
  },
  {
    id: 'chk-6',
    category: 'Banking & CA',
    title: 'Banking Basics: Structure of Indian Banking System & RBI Origin / Preamble',
    subject: 'Banking & CA',
    topic: 'Banking History & RBI',
    estimatedMinutes: 15,
    actualMinutes: 0,
    completed: false,
    notes: 'Scheduled commercial banks, nationalization history, and RBI functions.',
    date: '2026-10-03',
  },
  {
    id: 'chk-7',
    category: 'Revision',
    title: 'Daily Reflection & Error Review: Review notes and log concepts in Mistake Notebook',
    subject: 'Revision',
    topic: 'Daily Review',
    estimatedMinutes: 15,
    actualMinutes: 0,
    completed: false,
    notes: 'Consolidate today’s formulas and self-correction rules.',
    date: '2026-10-03',
  },
];

export const initialGoals: PrepGoal[] = [
  {
    id: 'g-exam-aug2027',
    title: 'Target: IBPS SO IT Officer Scale I Exam (August 2027)',
    timeframe: 'Exam Cycle',
    targetValue: 300,
    currentValue: 0,
    unit: 'Days of Disciplined Prep',
    isAchieved: false,
    deadline: '2027-08-31',
  },
  {
    id: 'g-1',
    title: 'Daily Question Target',
    timeframe: 'Daily',
    targetValue: 40,
    currentValue: 0,
    unit: 'Questions',
    isAchieved: false,
  },
  {
    id: 'g-2',
    title: 'Daily Focused Study Target (3.0 Hours)',
    timeframe: 'Daily',
    targetValue: 3,
    currentValue: 0,
    unit: 'Hours',
    isAchieved: false,
  },
  {
    id: 'g-3',
    title: 'Weekly Full Mocks (Sunday Routine)',
    timeframe: 'Weekly',
    targetValue: 2,
    currentValue: 0,
    unit: 'Mocks',
    isAchieved: false,
  },
  {
    id: 'g-4',
    title: 'Master All 14 Core IT Modules before Aug 2027',
    timeframe: 'Monthly',
    targetValue: 14,
    currentValue: 0,
    unit: 'Modules',
    isAchieved: false,
  },
  {
    id: 'g-5',
    title: 'Solve Complete IT Question Bank (2000+ Qs)',
    timeframe: 'Exam Cycle',
    targetValue: 2000,
    currentValue: 0,
    unit: 'Questions',
    isAchieved: false,
  },
];

export const initialVocabulary: VocabularyWord[] = [
  { id: 'voc-1', word: 'Meticulous', meaning: 'Showing great attention to detail; very careful and precise.', synonyms: ['Diligent', 'Scrupulous', 'Fastidious'], antonyms: ['Careless', 'Sloppy'], exampleSentence: 'The database administrator was meticulous when planning the failover migration.', ibpsContext: 'Appears frequently in reading comprehension passages on system integrity.', mastered: false, addedDate: '2026-10-03' },
  { id: 'voc-2', word: 'Obviate', meaning: 'To remove a need or difficulty; prevent or make unnecessary.', synonyms: ['Preclude', 'Prevent', 'Foreclose'], antonyms: ['Necessitate', 'Induce'], exampleSentence: 'Robust database indexing obviates the need for full table scans in read-heavy workloads.', ibpsContext: 'Crucial for cloze test and vocabulary evaluation.', mastered: false, addedDate: '2026-10-03' },
  { id: 'voc-3', word: 'Pragmatic', meaning: 'Dealing with things sensibly and realistically based on practical rather than theoretical considerations.', synonyms: ['Practical', 'Realistic', 'Sensible'], antonyms: ['Idealistic', 'Impractical'], exampleSentence: 'Taking sectional mocks on a strict timer is a pragmatic way to overcome exam pressure.', ibpsContext: 'Common in reading comprehension and passage inference.', mastered: false, addedDate: '2026-10-03' },
];

export const initialCurrentAffairs: CurrentAffairItem[] = [
  { id: 'ca-1', date: '2026-10-03', category: 'IT in Banking', headline: 'RBI guidelines on Digital Payment Intelligence Platform', summary: 'RBI initiatives to curb cyber fraud using real-time network intelligence and AI-driven transaction monitoring across member banks.', importantNotes: 'Key for IBPS SO IT: Network security, banking fraud prevention, and real-time transaction reconciliation architectures.', isImportant: true },
  { id: 'ca-2', date: '2026-10-03', category: 'Banking Awareness', headline: 'RBI Monetary Policy Committee Repo Rate announcement', summary: 'MPC maintains policy repo rate under the liquidity adjustment facility to balance growth and inflation targets.', importantNotes: 'Important for general banking awareness questions.', isImportant: false },
];
