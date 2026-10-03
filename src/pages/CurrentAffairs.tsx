// src/pages/CurrentAffairs.tsx
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { getAllItems, putItem, deleteItem } from '../services/db';
import { CurrentAffairItem } from '../types';
import { Globe, Plus, Trash2, Bookmark, Search, Star } from 'lucide-react';

const CATEGORIES = [
  'Banking Awareness',
  'Financial & Economic',
  'IT in Banking',
  'National/RBI',
  'General',
] as const;

export const CurrentAffairs: React.FC = () => {
  const [items, setItems] = useState<CurrentAffairItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');

  // Form State
  const [headline, setHeadline] = useState('');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('IT in Banking');
  const [summary, setSummary] = useState('');
  const [importantNotes, setImportantNotes] = useState('');
  const [isImportant, setIsImportant] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const list = await getAllItems<CurrentAffairItem>('currentAffairs');
    setItems(list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) return;

    const item: CurrentAffairItem = {
      id: `ca-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: new Date().toISOString().split('T')[0],
      category,
      headline: headline.trim(),
      summary,
      importantNotes,
      isImportant,
    };

    await putItem('currentAffairs', item);
    setItems([item, ...items]);
    setIsAdding(false);
    setHeadline('');
    setSummary('');
    setImportantNotes('');
  };

  const handleDelete = async (id: string) => {
    await deleteItem('currentAffairs', id);
    setItems(items.filter((i) => i.id !== id));
  };

  const filtered = items.filter((i) => {
    if (selectedCat !== 'All' && i.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchHead = i.headline.toLowerCase().includes(q);
      const matchSum = i.summary.toLowerCase().includes(q);
      if (!matchHead && !matchSum) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      <Header
        title="Banking Awareness & IT Current Affairs"
        subtitle="Curated coverage for IBPS SO IT: RBI circulars, digital payments, NPCI tech, fintech regulations, and financial news."
      />

      {/* Header Bar */}
      <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-slate-800 text-xs">Total Notes: {items.length}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAdding(true)}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Banking / IT Update</span>
          </button>
        </div>
      </div>

      {/* Search & Category Pills */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search headline or banking topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCat('All')}
            className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap ${
              selectedCat === 'All' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap ${
                selectedCat === c ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleSave} className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Add Banking / Tech Update</h3>
            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400">
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Headline</label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. RBI guidelines on Digital Lending & Tokenization"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Summary / Context</label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="What happened and key policy figures..."
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Key Takeaway for IBPS SO IT</label>
            <textarea
              rows={2}
              value={importantNotes}
              onChange={(e) => setImportantNotes(e.target.value)}
              placeholder="Architecture, cyber compliance, or exam relevance..."
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
              Save Update
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-[10px] uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {item.category}
                </span>
                <span className="text-slate-400">{item.date}</span>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1 text-slate-400 hover:text-rose-600"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-bold text-slate-900 text-sm">{item.headline}</h3>
            <p className="text-slate-600 leading-relaxed">{item.summary}</p>

            {item.importantNotes && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed">
                <strong>Exam Relevance: </strong> {item.importantNotes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentAffairs;
