// src/pages/Vocabulary.tsx
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { getAllItems, putItem, deleteItem } from '../services/db';
import { VocabularyWord } from '../types';
import { BookOpen, Plus, Trash2, CheckCircle2, RotateCw, Sparkles, Search } from 'lucide-react';

export const Vocabulary: React.FC = () => {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [flashcardMode, setFlashcardMode] = useState(false);
  const [cardIdx, setCardIdx] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  // Form State
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [synonyms, setSynonyms] = useState('');
  const [antonyms, setAntonyms] = useState('');
  const [example, setExample] = useState('');
  const [ibpsContext, setIbpsContext] = useState('');

  useEffect(() => {
    loadVocab();
  }, []);

  const loadVocab = async () => {
    const list = await getAllItems<VocabularyWord>('vocabulary');
    setWords(list.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim()) return;

    const item: VocabularyWord = {
      id: `voc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      word: word.trim(),
      meaning: meaning.trim(),
      synonyms: synonyms.split(/[,;]/).map((s) => s.trim()).filter(Boolean),
      antonyms: antonyms.split(/[,;]/).map((s) => s.trim()).filter(Boolean),
      exampleSentence: example,
      ibpsContext,
      mastered: false,
      addedDate: new Date().toISOString(),
    };

    await putItem('vocabulary', item);
    setWords([item, ...words]);
    setIsAdding(false);
    setWord('');
    setMeaning('');
    setSynonyms('');
    setAntonyms('');
    setExample('');
    setIbpsContext('');
  };

  const handleToggleMastered = async (v: VocabularyWord) => {
    const updated = { ...v, mastered: !v.mastered };
    await putItem('vocabulary', updated);
    setWords(words.map((w) => (w.id === v.id ? updated : w)));
  };

  const handleDelete = async (id: string) => {
    await deleteItem('vocabulary', id);
    setWords(words.filter((w) => w.id !== id));
  };

  const filtered = words.filter((w) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchW = w.word.toLowerCase().includes(q);
      const matchM = w.meaning.toLowerCase().includes(q);
      if (!matchW && !matchM) return false;
    }
    return true;
  });

  const currentCard = words[cardIdx];

  return (
    <div className="space-y-6 pb-12">
      <Header
        title="High-Yield IBPS Vocabulary & Flashcards"
        subtitle="Strengthen English verbal ability for Reading Comprehension, Cloze Tests, and Error Spotting."
      />

      {/* Header bar */}
      <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-slate-800 text-xs">Total Words: {words.length}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setFlashcardMode(!flashcardMode);
              setShowMeaning(false);
            }}
            className={`px-3.5 py-2 font-bold text-xs rounded-xl border flex items-center space-x-1.5 transition-colors ${
              flashcardMode
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{flashcardMode ? 'Exit Flashcard Mode' : 'Flashcard Drill Mode'}</span>
          </button>

          <button
            onClick={() => setIsAdding(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Word</span>
          </button>
        </div>
      </div>

      {/* FLASHCARD DRILL INTERACTION */}
      {flashcardMode && currentCard && (
        <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl max-w-xl mx-auto text-center space-y-6">
          <span className="text-[11px] font-bold tracking-wider uppercase text-amber-400">
            Card {cardIdx + 1} of {words.length}
          </span>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-white">{currentCard.word}</h2>
            {showMeaning ? (
              <div className="space-y-4 pt-4 animate-in fade-in">
                <p className="text-base font-semibold text-slate-200">{currentCard.meaning}</p>
                {currentCard.synonyms.length > 0 && (
                  <div className="text-xs text-slate-400">
                    <strong className="text-emerald-400">Synonyms: </strong>
                    {currentCard.synonyms.join(', ')}
                  </div>
                )}
                {currentCard.exampleSentence && (
                  <p className="text-xs italic text-slate-400">"{currentCard.exampleSentence}"</p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 pt-2">Click below to reveal definition and usage</p>
            )}
          </div>

          <div className="pt-4 flex items-center justify-center space-x-3">
            <button
              onClick={() => setShowMeaning(!showMeaning)}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700"
            >
              {showMeaning ? 'Hide Meaning' : 'Reveal Meaning'}
            </button>

            <button
              onClick={() => {
                setCardIdx((cardIdx + 1) % words.length);
                setShowMeaning(false);
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow"
            >
              Next Word &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Add Word Form */}
      {isAdding && (
        <form onSubmit={handleSave} className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Add High-Yield Word</h3>
            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400">✕</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Word</label>
              <input
                type="text"
                required
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="e.g. Meticulous"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Meaning</label>
              <input
                type="text"
                required
                value={meaning}
                onChange={(e) => setMeaning(e.target.value)}
                placeholder="Showing great attention to detail..."
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Synonyms (Comma-separated)</label>
              <input
                type="text"
                value={synonyms}
                onChange={(e) => setSynonyms(e.target.value)}
                placeholder="Diligent, Scrupulous, Fastidious"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Antonyms (Comma-separated)</label>
              <input
                type="text"
                value={antonyms}
                onChange={(e) => setAntonyms(e.target.value)}
                placeholder="Careless, Sloppy"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Example Sentence</label>
            <input
              type="text"
              value={example}
              onChange={(e) => setExample(e.target.value)}
              placeholder="The DBA was meticulous when configuring the database failover..."
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow"
            >
              Save Word
            </button>
          </div>
        </form>
      )}

      {/* Word Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl border text-xs space-y-3 shadow-sm transition-all flex flex-col justify-between ${
              item.mastered ? 'bg-slate-50/70 border-slate-200' : 'bg-white border-slate-200'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">{item.word}</h3>
                <button
                  onClick={() => handleToggleMastered(item)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    item.mastered
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {item.mastered ? 'Mastered ✓' : 'Learning'}
                </button>
              </div>

              <p className="text-slate-700 font-medium">{item.meaning}</p>

              {item.synonyms.length > 0 && (
                <div className="text-[11px] text-slate-500">
                  <strong className="text-slate-700">Synonyms: </strong>
                  {item.synonyms.join(', ')}
                </div>
              )}

              {item.exampleSentence && (
                <p className="text-[11px] italic text-slate-500 pt-1 border-t border-slate-100">
                  "{item.exampleSentence}"
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => handleDelete(item.id)}
                className="text-slate-400 hover:text-rose-600 p-1"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vocabulary;
