import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import PromptModal from '../components/PromptModal';
import type { Prompt } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  image: 'bg-violet-50 text-violet-700',
  video: 'bg-blue-50 text-blue-700',
  website: 'bg-emerald-50 text-emerald-700',
};

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl">
      <div className="w-16 h-16 bg-gray-100 rounded-xl animate-pulse shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 bg-gray-100 rounded animate-pulse" />
        <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
      </div>
    </div>
  );
}

export default function MyPurchases() {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Prompt | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => {
    api.prompts.myPrompts()
      .then(setPrompts)
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = async (e: React.MouseEvent, prompt: Prompt) => {
    e.stopPropagation();
    if (!prompt.prompt_text) return;
    await navigator.clipboard.writeText(prompt.prompt_text);
    setCopied(prompt.id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-16">
        <p className="text-gray-500 text-sm">Please sign in to view your prompts.</p>
        <Link to="/" className="mt-4 text-sm font-semibold text-black hover:underline">
          Go to marketplace
        </Link>
      </div>
    );
  }

  if (!user.is_pro) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-16 px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-black mb-2">Unlock all prompts</h1>
          <p className="text-sm text-gray-500 mb-2">
            Get lifetime access to all 14 prompts — images, videos, and websites.
          </p>
          <p className="text-2xl font-bold text-black mb-6">$10 <span className="text-sm font-normal text-gray-400">one-time</span></p>
          <button
            onClick={async () => {
              const { url } = await api.payments.createProCheckout();
              window.location.href = url;
            }}
            className="w-full bg-black text-white text-sm font-semibold py-3 rounded-xl hover:bg-gray-900 transition-colors mb-3"
          >
            Unlock all prompts
          </button>
          <Link to="/" className="text-sm text-gray-500 hover:text-black">
            Back to marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-black">My Prompts</h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Pro
              </span>
            </div>
            <p className="text-sm text-gray-500">All prompts unlocked. Click to view or copy.</p>
          </div>
          <Link
            to="/"
            className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
          >
            Browse more
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : prompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-sm text-gray-500">No prompts found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {prompts.map((prompt) => (
              <article
                key={prompt.id}
                onClick={() => setSelected(prompt)}
                className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all group"
              >
                <img
                  src={prompt.preview_url}
                  alt={prompt.title}
                  className="w-16 h-16 object-cover rounded-xl shrink-0 bg-gray-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${prompt.id}/200/200`;
                  }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[prompt.category]}`}>
                      {prompt.category.charAt(0).toUpperCase() + prompt.category.slice(1)}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">{prompt.ai_tool}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-black truncate">{prompt.title}</h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5 truncate">{prompt.prompt_preview}</p>
                </div>

                {/* Copy button */}
                <button
                  onClick={(e) => handleCopy(e, prompt)}
                  className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all ${
                    copied === prompt.id
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 group-hover:bg-gray-200'
                  }`}
                >
                  {copied === prompt.id ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <PromptModal
          prompt={selected}
          onClose={() => setSelected(null)}
          onAuthRequired={() => {}}
        />
      )}
    </div>
  );
}
