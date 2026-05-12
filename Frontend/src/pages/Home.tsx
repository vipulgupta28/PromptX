import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import PromptCard from '../components/PromptCard';
import PromptModal from '../components/PromptModal';
import { api } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import type { Prompt, Category } from '../types';

const CATEGORY_TITLES: Record<string, string> = {
  all: 'All Prompts',
  image: 'Image Prompts',
  video: 'Video Prompts',
  website: 'Website Prompts',
};

const CATEGORY_DESCS: Record<string, string> = {
  all: 'Browse our full library of expert AI prompts for images, videos, and websites.',
  image: 'Craft stunning visuals with battle-tested prompts for Midjourney, DALL·E 3, and Stable Diffusion.',
  video: 'Produce cinematic AI videos with expert prompts for Sora, Runway ML, and Pika Labs.',
  website: 'Generate complete, production-ready websites and landing pages with a single prompt.',
};

interface HomeProps {
  onAuthRequired: () => void;
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
      <div className="p-4 space-y-2.5">
        <div className="flex gap-2">
          <div className="h-4 w-16 bg-gray-100 rounded-full animate-pulse" />
          <div className="h-4 w-20 bg-gray-100 rounded-full animate-pulse" />
        </div>
        <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
        <div className="h-3 bg-gray-100 rounded animate-pulse" />
        <div className="h-3 w-5/6 bg-gray-100 rounded animate-pulse" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 w-12 bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function Home({ onAuthRequired }: HomeProps) {
  const { user } = useAuth();
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Prompt | null>(null);
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.prompts.list(category !== 'all' ? { category } : {});
      setPrompts(data);
    } catch {
      // show empty state
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const counts = prompts.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const filtered = search.trim()
    ? prompts.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.ai_tool.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      )
    : prompts;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="border-b border-gray-100 bg-white pt-24 pb-10 px-6">
        <div className="max-w-screen-2xl mx-auto">
          {/* Pro banner for non-pro logged-in users */}
          {user && !user.is_pro && (
            <div className="flex items-center justify-between bg-black text-white rounded-2xl px-5 py-3.5 mb-6 max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold">You're on the free plan</p>
                  <p className="text-xs text-white/60">2 free prompts available. Upgrade for full access.</p>
                </div>
              </div>
              <button
                onClick={async () => {
                  try {
                    const { url } = await api.payments.createProCheckout();
                    window.location.href = url;
                  } catch { /* handled in modal */ }
                }}
                className="text-xs font-bold bg-white text-black px-3.5 py-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0 ml-4"
              >
                Unlock all · $10
              </button>
            </div>
          )}
          {/* Pro badge */}
          {user?.is_pro && (
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full px-3.5 py-1.5 mb-5 text-xs font-semibold">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Pro — all prompts unlocked
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight leading-tight mb-4">
            The marketplace for expert AI prompts.
          </h1>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <div className="flex gap-10">
          {/* Sidebar with animated width */}
          <div
            className="shrink-0 overflow-hidden transition-all duration-200"
            style={{ width: sidebarOpen ? '240px' : '0px', opacity: sidebarOpen ? 1 : 0 }}
          >
            <Sidebar
              active={category}
              onChange={(cat) => { setCategory(cat); setSearch(''); }}
              counts={category === 'all' ? counts : {}}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                {/* Sidebar toggle */}
                <button
                  onClick={() => setSidebarOpen((v) => !v)}
                  title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-black hover:border-gray-400 transition-colors shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </button>
                <div>
                  <h2 className="text-lg font-bold text-black">{CATEGORY_TITLES[category]}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">{CATEGORY_DESCS[category]}</p>
                </div>
              </div>

              {/* Search */}
              <div className="relative hidden sm:block">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search prompts…"
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-black w-56 transition-colors placeholder-gray-400"
                />
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-black">No prompts found</p>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search or category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onClick={() => setSelected(prompt)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prompt Modal */}
      {selected && (
        <PromptModal
          prompt={selected}
          onClose={() => setSelected(null)}
          onAuthRequired={() => { setSelected(null); onAuthRequired(); }}
        />
      )}
    </div>
  );
}
