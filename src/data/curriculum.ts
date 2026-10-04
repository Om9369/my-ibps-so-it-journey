// src/data/curriculum.ts
import { DailyChecklistItem, Subject } from '../types';

export interface CurriculumDayTemplate {
  dayNumber: number;
  title: string;
  tasks: {
    category: 'IT' | 'Reasoning' | 'English' | 'Quant' | 'Banking & CA' | 'Revision';
    subject: Subject;
    title: string;
    topic: string;
    estimatedMinutes: number;
    notes?: string;
  }[];
}

export const PROGRESSIVE_CURRICULUM: CurriculumDayTemplate[] = [
  // DAY 1: Foundations - Hardware, Number Systems, Speed Math, Grammar Basics
  {
    dayNumber: 1,
    title: 'Foundations: Computer Architecture, Speed Math & Grammar',
    tasks: [
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT Basics: Computer Architecture Fundamentals & Memory Hierarchy (Bits, Bytes, Cache L1-L3, RAM, ROM)',
        topic: 'Computer Architecture Fundamentals',
        estimatedMinutes: 45,
        notes: 'Focus on CPU registers, memory access times, and instruction cycle (Fetch-Decode-Execute).',
      },
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT Basics Practice: 15 Questions on Number Systems (Binary, Octal, Hex, 2\'s Complement)',
        topic: 'Number Systems Practice',
        estimatedMinutes: 25,
        notes: 'Practice conversions between radix systems and binary arithmetic on timer.',
      },
      {
        category: 'Reasoning',
        subject: 'Reasoning',
        title: 'Reasoning Basics: Alphabetical & Alphanumeric Series rules + 10 questions',
        topic: 'Alphabetical Series',
        estimatedMinutes: 25,
        notes: 'Memorize forward & reverse positions (EJOTY rule) and alternate skipping patterns.',
      },
      {
        category: 'Quant',
        subject: 'Quant',
        title: 'Quant Basics: Speed Math, Squares (1-50), Cubes (1-30) & Percent-to-Fraction table',
        topic: 'Speed Math & Fractions',
        estimatedMinutes: 30,
        notes: 'Daily foundation drill: multiplication shortcuts and fraction equivalents.',
      },
      {
        category: 'English',
        subject: 'English',
        title: 'English Basics: 8 Parts of Speech & Subject-Verb Agreement Rules + Editorial Reading',
        topic: 'Grammar Foundations',
        estimatedMinutes: 25,
        notes: 'Read The Hindu/Indian Express editorial; note down 5 vocabulary words with context.',
      },
      {
        category: 'Banking & CA',
        subject: 'Banking & CA',
        title: 'Banking Basics: Structure of Indian Banking System & RBI Origin / Preamble',
        topic: 'Banking History & RBI',
        estimatedMinutes: 15,
        notes: 'Scheduled commercial banks, nationalization history, and RBI functions.',
      },
      {
        category: 'Revision',
        subject: 'IT',
        title: 'Daily Reflection & Error Review: Review notes and log concepts in Mistake Notebook',
        topic: 'Daily Review',
        estimatedMinutes: 15,
        notes: 'Consolidate today’s formulas and self-correction rules in Mistake Notebook.',
      },
    ],
  },

  // DAY 2: DBMS Foundations, Simplification, Direction Sense
  {
    dayNumber: 2,
    title: 'DBMS Foundations, Simplification & Direction Sense',
    tasks: [
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT DBMS Basics: Three-Tier Architecture, Data Independence & ER Model (Entities, Attributes, Relationships)',
        topic: 'DBMS Architecture & ER Model',
        estimatedMinutes: 45,
        notes: 'Study conceptual/logical/physical levels, 1:1, 1:N, M:N mapping cardinalities.',
      },
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT Practice: 15 Questions on Primary, Candidate, Super, Foreign Keys & Integrity Constraints',
        topic: 'Relational Model Keys',
        estimatedMinutes: 25,
        notes: 'Entity integrity vs referential integrity rules and identifying candidate keys.',
      },
      {
        category: 'Reasoning',
        subject: 'Reasoning',
        title: 'Reasoning Basics: Direction Sense & Distance (Shortest path, Pythagoras, Angle rotations) + 10 Qs',
        topic: 'Direction & Distance',
        estimatedMinutes: 25,
        notes: 'Draw compass clearly; handle shadow concepts (sunrise vs sunset).',
      },
      {
        category: 'Quant',
        subject: 'Quant',
        title: 'Quant Basics: Simplification & Approximation (BODMAS, Surds, Decimals) + 15 practice questions',
        topic: 'Simplification & Approximation',
        estimatedMinutes: 30,
        notes: 'Focus on speed: estimate unit digits and approximate fractions quickly.',
      },
      {
        category: 'English',
        subject: 'English',
        title: 'English: Noun & Pronoun Error Detection Rules + 10 Vocab Flashcards + Editorial',
        topic: 'Noun & Pronoun Rules',
        estimatedMinutes: 25,
        notes: 'Relative pronouns (who vs whom, which vs that) and collective noun agreements.',
      },
      {
        category: 'Banking & CA',
        subject: 'Banking & CA',
        title: 'Banking Basics: Types of Bank Accounts (CASA, Fixed, Recurring) & KYC/AML Guidelines',
        topic: 'Bank Accounts & KYC',
        estimatedMinutes: 15,
        notes: 'Officially Valid Documents (OVDs), risk categorization (Low, Medium, High).',
      },
      {
        category: 'Revision',
        subject: 'IT',
        title: 'Daily Reflection & Spaced Review of Day 1 Architecture & Math tables',
        topic: 'Spaced Review',
        estimatedMinutes: 15,
        notes: 'Quick 15-minute recall without looking at formulas.',
      },
    ],
  },

  // DAY 3: Operating System Fundamentals, Number Series, Syllogism
  {
    dayNumber: 3,
    title: 'OS Fundamentals, Number Series & Syllogism Basics',
    tasks: [
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT OS Basics: Process Management, Process Control Block (PCB), Process States & Context Switching',
        topic: 'Process Management',
        estimatedMinutes: 45,
        notes: 'New, Ready, Running, Waiting, Terminated states; process vs thread differences.',
      },
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT Practice: 15 Questions on CPU Scheduling Algorithms (FCFS, SJF, SRTF, Round Robin)',
        topic: 'CPU Scheduling Practice',
        estimatedMinutes: 25,
        notes: 'Calculate turnaround time and waiting time from Gantt charts.',
      },
      {
        category: 'Reasoning',
        subject: 'Reasoning',
        title: 'Reasoning: Syllogism Fundamentals (All, Some, No, Some-Not Venn diagrams) + 10 questions',
        topic: 'Syllogism Fundamentals',
        estimatedMinutes: 25,
        notes: 'Understand definite conclusions vs possibilities; standard 2-statement problems.',
      },
      {
        category: 'Quant',
        subject: 'Quant',
        title: 'Quant: Missing Number Series Patterns (Difference, Double-diff, Prime, Multiply+Add) + 15 drills',
        topic: 'Number Series',
        estimatedMinutes: 30,
        notes: 'Identify pattern acceleration (addition vs geometrical multiplication).',
      },
      {
        category: 'English',
        subject: 'English',
        title: 'English: Verb Tenses & Conditional Clauses (Zero, 1st, 2nd, 3rd Conditionals) + Editorial',
        topic: 'Verb Tenses',
        estimatedMinutes: 25,
        notes: 'Pay special attention to past perfect ("had done") vs simple past.',
      },
      {
        category: 'Banking & CA',
        subject: 'Banking & CA',
        title: 'Banking: Negotiable Instruments Act 1881 (Cheques, Promissory Notes, Endorsements, Section 138)',
        topic: 'Negotiable Instruments',
        estimatedMinutes: 15,
        notes: 'General vs special crossing, bearer vs order cheques, dishonour of cheques.',
      },
      {
        category: 'Revision',
        subject: 'IT',
        title: 'Daily Reflection: Log CPU Scheduling & Syllogism edge cases in Mistake Notebook',
        topic: 'Error Logging',
        estimatedMinutes: 15,
        notes: 'Document exact reasons for any wrong answers from today’s sessions.',
      },
    ],
  },

  // DAY 4: Networking Basics, Blood Relations, Quadratic Equations
  {
    dayNumber: 4,
    title: 'Networking Basics, Blood Relations & Quadratic Equations',
    tasks: [
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT Networks: OSI 7-Layer Reference Model vs TCP/IP Suite (Protocols & Functions per layer)',
        topic: 'OSI Reference Model',
        estimatedMinutes: 45,
        notes: 'Physical, Data Link, Network, Transport, Session, Presentation, Application layers.',
      },
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT Practice: 15 Questions on Data Link Layer (Framing, Flow Control, Stop-and-Wait, Go-Back-N)',
        topic: 'Data Link Layer Practice',
        estimatedMinutes: 25,
        notes: 'Calculate efficiency and window sizes for sliding window protocols.',
      },
      {
        category: 'Reasoning',
        subject: 'Reasoning',
        title: 'Reasoning: Blood Relations (Direct, Coded relations & Family Tree construction) + 10 questions',
        topic: 'Blood Relations',
        estimatedMinutes: 25,
        notes: 'Use standard family tree symbols (+ for male, - for female, = for couple).',
      },
      {
        category: 'Quant',
        subject: 'Quant',
        title: 'Quant: Quadratic Equations (Sign Method Shortcut: ax² + bx + c = 0) + 15 comparison questions',
        topic: 'Quadratic Equations',
        estimatedMinutes: 30,
        notes: 'Master sign conversion table (+ + becomes - -, - + becomes + +).',
      },
      {
        category: 'English',
        subject: 'English',
        title: 'English: Prepositions & Phrasal Verbs (Common confusions: between/among, since/for) + Editorial',
        topic: 'Prepositions & Phrasal Verbs',
        estimatedMinutes: 25,
        notes: 'Identify preposition errors in sentence correction exercises.',
      },
      {
        category: 'Banking & CA',
        subject: 'Banking & CA',
        title: 'Banking: Payment & Settlement Systems in India (NEFT, RTGS, IMPS, UPI, CTS, NPCI)',
        topic: 'Digital Payment Systems',
        estimatedMinutes: 15,
        notes: 'Operating hours, minimum/maximum limits, transaction timings, and NPCI products.',
      },
      {
        category: 'Revision',
        subject: 'IT',
        title: 'Daily Reflection & Review of OSI layers & Quadratic signs in Revision Tracker',
        topic: 'Daily Review',
        estimatedMinutes: 15,
        notes: 'Active recall drill on network layers and port numbers.',
      },
    ],
  },

  // DAY 5: Data Structures Basics, Percentages, Order & Ranking
  {
    dayNumber: 5,
    title: 'Data Structures Basics, Percentages & Order/Ranking',
    tasks: [
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT Data Structures: Arrays (Row/Column Major Memory Address calculations) & Singly Linked Lists',
        topic: 'Arrays & Linked Lists',
        estimatedMinutes: 45,
        notes: 'Base address + ((i * N) + j) * size formula; pointer manipulation.',
      },
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT Practice: 15 Questions on Singly vs Doubly Linked Lists & Big-O Asymptotic Complexity',
        topic: 'Linked Lists & Complexity',
        estimatedMinutes: 25,
        notes: 'Insertion/deletion time complexities; finding circular loops in lists.',
      },
      {
        category: 'Reasoning',
        subject: 'Reasoning',
        title: 'Reasoning: Order & Ranking (Total persons formula, overlapping positions, interchanging seats) + 10 Qs',
        topic: 'Order & Ranking',
        estimatedMinutes: 25,
        notes: 'Total = Left + Right - 1; minimum count in overlapping scenarios.',
      },
      {
        category: 'Quant',
        subject: 'Quant',
        title: 'Quant: Percentage Fundamentals & Applications in Bank DI calculations + 15 practice drills',
        topic: 'Percentage Foundations',
        estimatedMinutes: 30,
        notes: 'A is what % of B, % more/less formulas, net % change shortcut (a + b + ab/100).',
      },
      {
        category: 'English',
        subject: 'English',
        title: 'English: Reading Comprehension Strategies (Skimming, tone of author, inference questions) + Editorial',
        topic: 'Reading Comprehension',
        estimatedMinutes: 25,
        notes: 'Solve 1 short banking/economics RC passage in 7 minutes.',
      },
      {
        category: 'Banking & CA',
        subject: 'Banking & CA',
        title: 'Banking: RBI Monetary Policy Framework (Repo, Reverse Repo, SDF, MSF, Bank Rate, CRR, SLR)',
        topic: 'Monetary Policy',
        estimatedMinutes: 15,
        notes: 'Quantitative vs qualitative credit control tools and latest MPC policy rates.',
      },
      {
        category: 'Revision',
        subject: 'IT',
        title: 'Daily Reflection & Error Review: Update Mistake Notebook on Array and Percentage mistakes',
        topic: 'Daily Review',
        estimatedMinutes: 15,
        notes: 'Verify concepts where mistakes occurred today.',
      },
    ],
  },

  // DAY 6: SQL Basics, Ratio & Proportion, Coding-Decoding
  {
    dayNumber: 6,
    title: 'SQL Fundamentals, Ratio & Proportion, Coding-Decoding',
    tasks: [
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT DBMS: SQL Fundamentals (DDL: CREATE/ALTER/DROP, DML: INSERT/UPDATE/DELETE, DCL, TCL)',
        topic: 'SQL DDL & DML Commands',
        estimatedMinutes: 45,
        notes: 'Study primary keys, unique constraints, foreign key ON DELETE CASCADE.',
      },
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT Practice: 15 Questions on SQL Joins (INNER, LEFT, RIGHT, FULL OUTER) and GROUP BY / HAVING',
        topic: 'SQL Joins Practice',
        estimatedMinutes: 25,
        notes: 'WHERE vs HAVING clause filtering; nested subquery mechanics.',
      },
      {
        category: 'Reasoning',
        subject: 'Reasoning',
        title: 'Reasoning: Coding-Decoding (Pattern shifts, Direct substitution, Chinese coding) + 10 questions',
        topic: 'Coding-Decoding',
        estimatedMinutes: 25,
        notes: 'Use elimination technique for common words in coded message statements.',
      },
      {
        category: 'Quant',
        subject: 'Quant',
        title: 'Quant: Ratio & Proportion, Partnership & Ages concepts with fast methods + 15 questions',
        topic: 'Ratio, Partnership & Ages',
        estimatedMinutes: 30,
        notes: 'Investment × Time = Profit ratio rule; age differences remain constant over time.',
      },
      {
        category: 'English',
        subject: 'English',
        title: 'English: Cloze Test & Fillers (Grammar cues, collocation, word elimination) + Editorial',
        topic: 'Cloze Test & Fillers',
        estimatedMinutes: 25,
        notes: 'Read full passage first to identify tone before filling blanks.',
      },
      {
        category: 'Banking & CA',
        subject: 'Banking & CA',
        title: 'Banking: Priority Sector Lending (PSL) Categories (Agriculture, MSME, Education, Housing, Renewable)',
        topic: 'Priority Sector Lending',
        estimatedMinutes: 15,
        notes: '40% PSL target for Domestic Commercial Banks; RIDF penalties for shortfalls.',
      },
      {
        category: 'Revision',
        subject: 'IT',
        title: 'Pre-Sunday Mock Consolidation: Revise formulas, short tricks, and open mistake notebook entries',
        topic: 'Pre-Mock Consolidation',
        estimatedMinutes: 15,
        notes: 'Prepare mentally for tomorrow\'s full-length Sunday simulation.',
      },
    ],
  },

  // DAY 7: Sunday Mock & Deep Analysis Ritual
  {
    dayNumber: 7,
    title: 'Sunday Mock Simulation & Weekly Audit Ritual',
    tasks: [
      {
        category: 'IT',
        subject: 'IT',
        title: 'Sunday Mock Test Simulation: Full-Length or Sectional Exam under strict timer in Mock Tests section',
        topic: 'Full Mock Test Simulation',
        estimatedMinutes: 75,
        notes: 'Simulate real exam pressure without interruptions; focus on accuracy before attempt count.',
      },
      {
        category: 'Revision',
        subject: 'IT',
        title: 'Comprehensive Mock Audit: Review all incorrect and unattempted questions question-by-question',
        topic: 'Post-Mock Audit',
        estimatedMinutes: 45,
        notes: 'Classify errors into Conceptual, Calculation, Misread, or Time-pressure in Mistake Notebook.',
      },
      {
        category: 'IT',
        subject: 'IT',
        title: 'Targeted IT Weak-Area Deep Dive: Re-study 2 concepts where questions were missed in mock',
        topic: 'Weak Area Revision',
        estimatedMinutes: 25,
        notes: 'Open IT Preparation module and reread subtopic notes.',
      },
      {
        category: 'Reasoning',
        subject: 'Reasoning',
        title: 'Reasoning & Quant Mock Re-solve: Re-attempt challenging puzzles and arithmetic from today\'s mock',
        topic: 'Mock Re-solve',
        estimatedMinutes: 20,
        notes: 'Solve without timer to understand the clean logical sequence.',
      },
      {
        category: 'Banking & CA',
        subject: 'Banking & CA',
        title: 'Sunday Review Ritual: Fill Next Week Blueprint and review weekly progress in Sunday Review page',
        topic: 'Sunday Review Wizard',
        estimatedMinutes: 15,
        notes: 'Lock in weekly goals and commit to continuous improvement for the upcoming week.',
      },
    ],
  },

  // DAY 8: DBMS Normalization, Linear Seating, Profit & Loss
  {
    dayNumber: 8,
    title: 'DBMS Normalization, Linear Seating & Profit/Loss',
    tasks: [
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT DBMS: Normalization (1NF, 2NF, 3NF, BCNF, Functional Dependencies & Lossless Decomposition)',
        topic: 'DBMS Normalization',
        estimatedMinutes: 45,
        notes: 'Identify partial dependencies (2NF) and transitive dependencies (3NF).',
      },
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT Practice: 15 Questions on Finding Candidate Keys & Normal Form Classification',
        topic: 'Normalization Practice',
        estimatedMinutes: 25,
        notes: 'Calculate attribute closures (X+) to prove super keys and candidate keys.',
      },
      {
        category: 'Reasoning',
        subject: 'Reasoning',
        title: 'Reasoning: Linear Seating Arrangement (Single row, Facing North / South) + 2 puzzle sets',
        topic: 'Linear Seating Arrangement',
        estimatedMinutes: 25,
        notes: 'Work with parallel possibilities; do not guess.',
      },
      {
        category: 'Quant',
        subject: 'Quant',
        title: 'Quant: Profit, Loss & Discount (Cost Price, Marked Price, Successive Discounts, Dishonest Dealer)',
        topic: 'Profit, Loss & Discount',
        estimatedMinutes: 30,
        notes: 'MP/CP = (100 + P%) / (100 - D%) relationship formula.',
      },
      {
        category: 'English',
        subject: 'English',
        title: 'English: Sentence Rearrangement / Para Jumbles (Identifying intro sentence, mandatory pairs) + Editorial',
        topic: 'Para Jumbles',
        estimatedMinutes: 25,
        notes: 'Look for chronological clues, transition words (however, furthermore, consequently).',
      },
      {
        category: 'Banking & CA',
        subject: 'Banking & CA',
        title: 'Banking: Non-Performing Assets (NPA) Classifications: SMA-0, SMA-1, SMA-2, Substandard, Doubtful, Loss',
        topic: 'NPA Management',
        estimatedMinutes: 15,
        notes: 'Overdue periods (30, 60, 90 days), provisioning norms for standard and doubtful assets.',
      },
      {
        category: 'Revision',
        subject: 'IT',
        title: 'Daily Reflection & Error Review: Update Mistake Notebook on Normalization and Linear Puzzles',
        topic: 'Daily Review',
        estimatedMinutes: 15,
        notes: 'Reinforce attribute closure steps.',
      },
    ],
  },

  // DAY 9: OS Deadlocks & Concurrency, Circular Seating, SI & CI
  {
    dayNumber: 9,
    title: 'OS Deadlocks, Circular Seating & Simple/Compound Interest',
    tasks: [
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT OS: Concurrency & Deadlocks (Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait)',
        topic: 'Deadlocks & Synchronization',
        estimatedMinutes: 45,
        notes: 'Banker\'s Algorithm for deadlock avoidance (Need = Max - Allocation).',
      },
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT Practice: 15 Questions on Semaphores (Counting vs Binary), Mutex & Resource Allocation Graphs',
        topic: 'Synchronization Practice',
        estimatedMinutes: 25,
        notes: 'Producer-Consumer, Dining Philosophers, and Readers-Writers synchronization problems.',
      },
      {
        category: 'Reasoning',
        subject: 'Reasoning',
        title: 'Reasoning: Circular Seating Arrangement (All facing center & Mixed facing) + 2 puzzle sets',
        topic: 'Circular Seating Arrangement',
        estimatedMinutes: 25,
        notes: 'Clockwise/Anti-clockwise orientation with respect to center orientation.',
      },
      {
        category: 'Quant',
        subject: 'Quant',
        title: 'Quant: Simple Interest & Compound Interest (Difference formulas for 2 & 3 years, CI rate tables)',
        topic: 'Simple & Compound Interest',
        estimatedMinutes: 30,
        notes: 'Diff (2 yrs) = P(R/100)²; Diff (3 yrs) = P(R/100)²(3 + R/100).',
      },
      {
        category: 'English',
        subject: 'English',
        title: 'English: Advanced Error Spotting (Dangling modifiers, Parallelism, Inversion rules) + Editorial',
        topic: 'Error Spotting Mastery',
        estimatedMinutes: 25,
        notes: 'Sentences beginning with negative adverbs (hardly, scarcely) require inverted word order.',
      },
      {
        category: 'Banking & CA',
        subject: 'Banking & CA',
        title: 'Banking: NPA Recovery Laws: SARFAESI Act 2002, Insolvency & Bankruptcy Code (IBC 2016) & DRT',
        topic: 'SARFAESI & IBC',
        estimatedMinutes: 15,
        notes: 'Securitisation, reconstruction, enforcement of security interest without court intervention.',
      },
      {
        category: 'Revision',
        subject: 'IT',
        title: 'Daily Reflection & Spaced Review: Review Banker\'s Algorithm & CI shortcuts',
        topic: 'Daily Review',
        estimatedMinutes: 15,
        notes: 'Active recall check on deadlocks.',
      },
    ],
  },

  // DAY 10: Networking Subnetting & Routing, Inequalities, Time & Work
  {
    dayNumber: 10,
    title: 'Subnetting & Routing, Inequalities & Time/Work',
    tasks: [
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT Networks: IP Addressing & Subnetting (IPv4 Classes A/B/C, Subnet Masks, CIDR notation /24 to /30)',
        topic: 'IP Addressing & Subnetting',
        estimatedMinutes: 45,
        notes: 'Network address, Broadcast address, Usable host range (2^H - 2).',
      },
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT Practice: 15 Questions on Routing Protocols (Distance Vector: RIP, Link State: OSPF, BGP)',
        topic: 'Routing Protocols Practice',
        estimatedMinutes: 25,
        notes: 'Count-to-infinity problem, split horizon, poison reverse, Dijkstra shortest path algorithm.',
      },
      {
        category: 'Reasoning',
        subject: 'Reasoning',
        title: 'Reasoning: Inequalities (Direct statements, Either-Or cases, Coded inequalities) + 15 questions',
        topic: 'Inequalities Mastery',
        estimatedMinutes: 25,
        notes: 'Opposite sign blocks (> <); Either-Or requires complementary pair and indeterminate relation.',
      },
      {
        category: 'Quant',
        subject: 'Quant',
        title: 'Quant: Time & Work (Efficiency method, LCM method, Pipe & Cistern basics) + 15 practice questions',
        topic: 'Time & Work',
        estimatedMinutes: 30,
        notes: 'Total Work = LCM of individual times; Efficiency = Total Work / Time.',
      },
      {
        category: 'English',
        subject: 'English',
        title: 'English: Adjective & Adverb Rules (Degrees of comparison, double comparatives) + Editorial',
        topic: 'Adjective & Adverb Rules',
        estimatedMinutes: 25,
        notes: 'Elder vs older, farther vs further, little vs a little vs the little.',
      },
      {
        category: 'Banking & CA',
        subject: 'Banking & CA',
        title: 'Banking: Basel III Norms: Capital Adequacy Ratio (CAR), Tier 1, Tier 2 Capital & CRAR requirements',
        topic: 'Basel III Norms',
        estimatedMinutes: 15,
        notes: 'Minimum CRAR of 9% for Indian scheduled banks (11.5% including CCB).',
      },
      {
        category: 'Revision',
        subject: 'IT',
        title: 'Daily Reflection & Error Review: Log Subnet calculations and Time & Work traps in Mistake Notebook',
        topic: 'Daily Review',
        estimatedMinutes: 15,
        notes: 'Record network bits vs host bits conversions.',
      },
    ],
  },

  // DAY 11: Trees & Graphs, Floor Puzzles, Time Speed Distance
  {
    dayNumber: 11,
    title: 'Trees & BST, Floor Puzzles & Time-Speed-Distance',
    tasks: [
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT Data Structures: Binary Trees, Binary Search Trees (BST), AVL Trees (Rotations: LL, RR, LR, RL)',
        topic: 'Trees & AVL Balancing',
        estimatedMinutes: 45,
        notes: 'Inorder traversal of BST gives sorted keys; height balanced property (-1, 0, +1).',
      },
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT Practice: 15 Questions on Inorder, Preorder, Postorder Traversals & Tree Reconstruction',
        topic: 'Tree Traversal Practice',
        estimatedMinutes: 25,
        notes: 'Reconstructing binary tree given Inorder + Preorder sequences.',
      },
      {
        category: 'Reasoning',
        subject: 'Reasoning',
        title: 'Reasoning: Floor & Box Puzzles (6-8 persons/boxes, single variable) + 2 puzzle sets',
        topic: 'Floor & Box Puzzles',
        estimatedMinutes: 25,
        notes: 'Draw vertical layout with floor numbers 1 to 8; lock definite clues first.',
      },
      {
        category: 'Quant',
        subject: 'Quant',
        title: 'Quant: Time, Speed & Distance: Relative Speed, Trains Crossing & Boats and Streams basics',
        topic: 'Time Speed Distance',
        estimatedMinutes: 30,
        notes: 'Speed conversion (km/h × 5/18 = m/s); Downstream = u + v, Upstream = u - v.',
      },
      {
        category: 'English',
        subject: 'English',
        title: 'English: Idioms & Phrases frequently asked in Bank PO/SO exams + Editorial Reading',
        topic: 'Bank Idioms & Phrases',
        estimatedMinutes: 25,
        notes: 'Study idioms used in financial and economic journalism.',
      },
      {
        category: 'Banking & CA',
        subject: 'Banking & CA',
        title: 'Banking: Government Financial Inclusion Schemes (PMJDY, PMJJBY, PMSBY, APY, Mudra Yojana)',
        topic: 'Financial Inclusion Schemes',
        estimatedMinutes: 15,
        notes: 'Age limits, insurance coverage amounts, premiums, and overdraft benefits.',
      },
      {
        category: 'Revision',
        subject: 'IT',
        title: 'Daily Reflection & Error Review: Update notes on AVL Rotations and Floor puzzle conditions',
        topic: 'Daily Review',
        estimatedMinutes: 15,
        notes: 'Write down LR and RL double-rotation steps.',
      },
    ],
  },

  // DAY 12: Cybersecurity & Cryptography, Input-Output, Data Interpretation
  {
    dayNumber: 12,
    title: 'Cybersecurity, Machine Input-Output & Tabular DI',
    tasks: [
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT Cybersecurity: Cryptography (Symmetric: AES/DES, Asymmetric: RSA, SHA-256 Hashing, PKI)',
        topic: 'Cryptography & PKI',
        estimatedMinutes: 45,
        notes: 'Public/private key pairs, digital certificates, non-repudiation, SSL/TLS handshake.',
      },
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT Practice: 15 Questions on Common Web Attacks (SQL Injection, XSS, CSRF, DDoS) & Countermeasures',
        topic: 'Cybersecurity Practice',
        estimatedMinutes: 25,
        notes: 'Parameterized queries, input sanitization, CSRF tokens, WAF mechanics.',
      },
      {
        category: 'Reasoning',
        subject: 'Reasoning',
        title: 'Reasoning: Machine Input-Output (Number & word arrangement with single/double shift) + 2 sets',
        topic: 'Machine Input-Output',
        estimatedMinutes: 25,
        notes: 'Determine step-by-step sorting logic (alphabetical order, word length, even/odd values).',
      },
      {
        category: 'Quant',
        subject: 'Quant',
        title: 'Quant: Data Interpretation: Tabular DI & Missing Data DI with Banking Calculation Tricks',
        topic: 'Tabular Data Interpretation',
        estimatedMinutes: 30,
        notes: 'Compute ratios and percentage shares directly without calculating absolute denominators.',
      },
      {
        category: 'English',
        subject: 'English',
        title: 'English: Sentence Improvement & Phrase Replacement drills + Editorial Reading',
        topic: 'Sentence Improvement',
        estimatedMinutes: 25,
        notes: 'Eliminate grammatically redundant and awkward choices.',
      },
      {
        category: 'Banking & CA',
        subject: 'Banking & CA',
        title: 'Banking: Prompt Corrective Action (PCA) Framework of RBI & Risk-Based Supervision',
        topic: 'PCA Framework',
        estimatedMinutes: 15,
        notes: 'Threshold indicators: CRAR, Net NPA ratio, Return on Assets (RoA). Mandatory & discretionary actions.',
      },
      {
        category: 'Revision',
        subject: 'IT',
        title: 'Daily Reflection & Error Review: Log Cryptography and Input-Output rules in Mistake Notebook',
        topic: 'Daily Review',
        estimatedMinutes: 15,
        notes: 'Document RSA mathematical trap questions.',
      },
    ],
  },

  // DAY 13: Software Engineering, Data Sufficiency, Mixed DI
  {
    dayNumber: 13,
    title: 'Software Engineering, Data Sufficiency & Mixed DI',
    tasks: [
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT Software Engineering: SDLC Models (Waterfall, Spiral, Agile/Scrum) & Software Testing',
        topic: 'SDLC & Software Testing',
        estimatedMinutes: 45,
        notes: 'Unit, Integration, System, Acceptance testing; Black-box vs White-box; Cyclomatic complexity.',
      },
      {
        category: 'IT',
        subject: 'IT',
        title: 'IT Practice: 15 Questions on Cohesion, Coupling, Software Metrics & Object-Oriented Design',
        topic: 'Software Engineering Practice',
        estimatedMinutes: 25,
        notes: 'High cohesion and loose coupling; calculation of Cyclomatic Complexity V(G) = E - N + 2P.',
      },
      {
        category: 'Reasoning',
        subject: 'Reasoning',
        title: 'Reasoning: Data Sufficiency (2 statements) across Reasoning concepts + 10 questions',
        topic: 'Data Sufficiency (Reasoning)',
        estimatedMinutes: 25,
        notes: 'Do not calculate final value if statement sufficiency is proven.',
      },
      {
        category: 'Quant',
        subject: 'Quant',
        title: 'Quant: Data Interpretation: Pie Charts & Line Graphs with high-speed calculation drills',
        topic: 'Pie Charts & Line Graphs',
        estimatedMinutes: 30,
        notes: 'Convert 360 degrees to 100% (1% = 3.6 degrees).',
      },
      {
        category: 'English',
        subject: 'English',
        title: 'English: Verbal Word Bank: 20 Banking & Financial words with Synonyms & Antonyms',
        topic: 'Banking Vocabulary',
        estimatedMinutes: 25,
        notes: 'Drill flashcards in Vocabulary section; test antonym recall.',
      },
      {
        category: 'Banking & CA',
        subject: 'Banking & CA',
        title: 'Banking: IT in Banking: Core Banking Solution (CBS), Cloud adoption & ISO 8583 / ISO 20022',
        topic: 'IT in Banking Systems',
        estimatedMinutes: 15,
        notes: 'Finacle/BaNCS architectures, financial messaging standards, electronic clearing.',
      },
      {
        category: 'Revision',
        subject: 'IT',
        title: 'Pre-Sunday Mock Consolidation: Comprehensive review of Week 2 concepts & formula book',
        topic: 'Pre-Mock Consolidation',
        estimatedMinutes: 15,
        notes: 'Prepare for tomorrow’s Sunday Mock test.',
      },
    ],
  },

  // DAY 14: Sunday Mock 2 & Bi-Weekly Strategic Review
  {
    dayNumber: 14,
    title: 'Sunday Mock 2 & Strategic Performance Analysis',
    tasks: [
      {
        category: 'IT',
        subject: 'IT',
        title: 'Sunday Mock Test Simulation: Full IBPS SO IT Mains / Prelims Mock under timed exam conditions',
        topic: 'Full Mock Test Simulation',
        estimatedMinutes: 75,
        notes: 'Track question selection discipline; skip doubtful questions to prevent negative marking penalties.',
      },
      {
        category: 'Revision',
        subject: 'IT',
        title: 'In-Depth Mock Audit: Audit section-wise accuracy and log all mistakes in Mistake Notebook',
        topic: 'Mock Performance Audit',
        estimatedMinutes: 45,
        notes: 'Analyze time spent on unattempted questions vs attempted questions.',
      },
      {
        category: 'IT',
        subject: 'IT',
        title: 'Targeted IT Concept Remediation: Re-solve tricky questions and review detailed explanations',
        topic: 'IT Concept Remediation',
        estimatedMinutes: 25,
        notes: 'Deep dive into IT topics that caused score dips in today\'s mock.',
      },
      {
        category: 'Reasoning',
        subject: 'Reasoning',
        title: 'Reasoning & Quant Mock Re-solve: Step-by-step re-solving of missed puzzles and DI sets',
        topic: 'Puzzles & DI Re-solve',
        estimatedMinutes: 20,
        notes: 'Untangle logical blocks encountered during mock pressure.',
      },
      {
        category: 'Banking & CA',
        subject: 'Banking & CA',
        title: 'Sunday Strategic Review: Complete 8-step Sunday ritual and formulate next week\'s priorities',
        topic: 'Sunday Review Wizard',
        estimatedMinutes: 15,
        notes: 'Inspect score trends in My Growth analytics and commit to weekly target.',
      },
    ],
  },
];

export const DAY_ZERO_ORIENTATION: CurriculumDayTemplate = {
  dayNumber: 0,
  title: 'Kickoff & Orientation: Setup Buffer Before Week 1',
  tasks: [
    {
      category: 'IT',
      subject: 'IT',
      title: 'Syllabus Orientation: Review 15-Subject Adaptive Roadmap & Exam Blueprint',
      topic: 'Syllabus Overview',
      estimatedMinutes: 30,
      notes: 'Inspect the L0 to L3 prerequisite map across Database, OS, Networks, SE, and Data Structures.',
    },
    {
      category: 'Banking & CA',
      subject: 'Banking & CA',
      title: 'Exam Pattern Inspection: CRP-SPL-XVI Blueprint & Sectional Cutoff Strategy',
      topic: 'Exam Pattern Strategy',
      estimatedMinutes: 20,
      notes: 'Preliminary pattern: 125 questions / 125 marks (50 IT Prelims + 75 Reasoning/Eng/Quant).',
    },
    {
      category: 'Revision',
      subject: 'Quant',
      title: 'Environment & Tooling Setup: Setup formula sheets, scratchpad, and timer habits',
      topic: 'Study Setup',
      estimatedMinutes: 20,
      notes: 'Prepare a dedicated notebook for Mistake Notebook offline logs and speed math tables.',
    },
    {
      category: 'Revision',
      subject: 'IT',
      title: 'Mental Preparation & Schedule Alignment for 3-Hour Daily Routine',
      topic: 'Habit Formation',
      estimatedMinutes: 20,
      notes: 'Commit to the 180-minute daily study block beginning tomorrow morning (Monday, Oct 5).',
    },
  ],
};

/**
 * Calculates which progressive curriculum day applies for a given date.
 * Baseline start date: 2026-10-05 (Monday = Week 1 Day 1).
 * Dates prior to 2026-10-05 receive the Day 0 Kickoff & Orientation template.
 */
export function getCurriculumTasksForDate(targetDateStr: string): DailyChecklistItem[] {
  const start = new Date('2026-10-05T00:00:00');
  const target = new Date(targetDateStr + 'T00:00:00');
  const diffTime = target.getTime() - start.getTime();
  const dayIndex = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (dayIndex < 0) {
    // Before Week 1 Day 1 (e.g. today Sunday Oct 4, 2026) -> Orientation Day 0
    return DAY_ZERO_ORIENTATION.tasks.map((t, idx) => ({
      id: `chk-${targetDateStr}-d0-${idx + 1}-${Math.random().toString(36).substring(2, 6)}`,
      category: t.category,
      title: t.title,
      subject: t.subject,
      topic: t.topic,
      estimatedMinutes: t.estimatedMinutes,
      actualMinutes: 0,
      completed: false,
      notes: t.notes || '',
      date: targetDateStr,
    }));
  }

  // Cycle through the progressive curriculum roadmap starting from Day 1 on Monday Oct 5
  const templateIndex = dayIndex % PROGRESSIVE_CURRICULUM.length;
  const template = PROGRESSIVE_CURRICULUM[templateIndex];

  return template.tasks.map((t, idx) => ({
    id: `chk-${targetDateStr}-${idx + 1}-${Math.random().toString(36).substring(2, 6)}`,
    category: t.category,
    title: t.title,
    subject: t.subject,
    topic: t.topic,
    estimatedMinutes: t.estimatedMinutes,
    actualMinutes: 0,
    completed: false,
    notes: t.notes || '',
    date: targetDateStr,
  }));
}

