# My IBPS SO IT Journey 🎯

> **Daily Discipline. Weekly Analysis. Continuous Improvement.**

A private, local-first web application designed for focused preparation for **IBPS Specialist Officer (SO) – IT Officer, Scale I**.

Built with **React 18, TypeScript, Vite, Tailwind CSS, Lucide icons, Recharts, and IndexedDB**.

---

## 🌟 Key Features

1. **Dashboard & Habit Tracking**
   - Daily 3.0 Hours (180 mins) focused study target.
   - Live completion rate, question volume, and real-time accuracy indicators.
   - Today's Practice launch card and Sunday Full Mock highlight banner.

2. **Daily Checklist & Progressive Curriculum**
   - Automatically scheduled study roadmap starting from fundamentals (Architecture, Number Systems, Speed Math, Grammar) advancing to intermediate/advanced topics (Deadlocks, CIDR Subnetting, AVL Trees, Cryptography, Agile SDLC).
   - "Generate Next Day Checklist" carries forward unfinished tasks and loads the next day's 3.0-hour syllabus.
   - Categories: Professional Knowledge (IT), Reasoning, English, Quant, Banking & Current Affairs, and Revision.

3. **Practice & Speed Quizzes**
   - Flexible Quick Practice generator (10, 20, 30, 50 questions or custom count).
   - 5 Targeted Speed Quizzes (10-Min IT Speed Quiz, DBMS Mastery, Cybersecurity, Daily Refresh, and Weak-Topic Targeted Quiz).
   - Instant feedback toggle with step-by-step explanations and one-click mistake logging.

4. **Full Mock Tests & Exam Simulator**
   - Full-length IBPS SO IT Officer Mocks (Mains IT 60 Qs & Prelims 150 Qs).
   - Real-time countdown timer with < 5-minute warning alert and auto-submit.
   - Interactive question palette (Answered, Marked for Review, Unvisited).
   - Refresh protection and auto-draft saving.
   - Sectional breakdowns and comprehensive post-test review.

5. **Personal Question Bank**
   - Pre-seeded questions across IT, Reasoning, English, and Quant.
   - Full CRUD: add custom questions with options, explanations, and cognitive root causes.
   - Bulk CSV / JSON import and export with downloadable templates.

6. **Mistake Notebook & Spaced Repetition**
   - Cognitive root-cause categorization: *Conceptual Gap*, *Silly / Misread*, *Calculation Error*, *Time-Pressure Rush*, *Formula Forgotten*.
   - Review counter and status pipeline (*Open*, *Reviewing*, *Resolved*).
   - Spaced Repetition Tracker with 1d, 3d, 7d, 14d, and 30d review intervals.

7. **Sunday Review & Weekly Analysis**
   - 8-Step Sunday Mock Ritual wizard.
   - Next Week Blueprint formulation with priority topics and mock commitments.
   - Historical archive of weekly mock scores and study sessions.

8. **Long-Term Growth Analytics (Recharts)**
   - Score trends over time with benchmark comparison.
   - Accuracy progression across IT, Quant, Reasoning, and English.
   - IT module mastery breakdown and mistake root-cause distribution.

9. **Banking & Current Affairs**
   - Monthly and topical repository for Banking Awareness, RBI circulars, and IT in Banking innovations (UPI, CBS, ISO 8583, AI/ML in fraud detection).

10. **Vocabulary Word Bank**
    - High-frequency banking exam verbal repository with definitions, synonyms, and antonyms.
    - Interactive Flashcard Drill Mode.

11. **Configurable Exam Settings & Local Data Control**
    - Exam configuration editor (modify question counts, timing, and negative marking per recruitment cycle notification).
    - 100% offline & local-first (IndexedDB with LocalStorage fallback).
    - One-click JSON backup export and restore.
    - Zero external tracking, zero subscriptions, zero cloud dependencies.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/my-ibps-so-it-journey.git

# Navigate into the project folder
cd my-ibps-so-it-journey

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Storage**: IndexedDB (`idb`) with LocalStorage fallback

---

## 📜 License

Private personal preparation project.
