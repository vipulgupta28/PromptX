import { useState } from 'react';
import type { Prompt } from '../types';
import { api } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

const CATEGORY_COLORS: Record<string, string> = {
  image: 'bg-violet-50 text-violet-700',
  video: 'bg-blue-50 text-blue-700',
  website: 'bg-emerald-50 text-emerald-700',
};

const CATEGORY_LABELS: Record<string, string> = {
  image: 'Image Prompt',
  video: 'Video Prompt',
  website: 'Website Prompt',
};

interface PromptModalProps {
  prompt: Prompt;
  onClose: () => void;
  onAuthRequired: () => void;
}

export default function PromptModal({ prompt, onClose, onAuthRequired }: PromptModalProps) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState('');

  const handleCopy = async () => {
    if (!prompt.prompt_text) return;
    await navigator.clipboard.writeText(prompt.prompt_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpgrade = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }
    setPurchasing(true);
    setError('');
    try {
      const { url } = await api.payments.createProCheckout();
      window.location.href = url;
    } catch (err) {
      setError((err as Error).message);
      setPurchasing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Image */}
        <div className="md:w-[55%] bg-gray-100 relative min-h-64 shrink-0">
          <img
            src={prompt.preview_url}
            alt={prompt.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${prompt.id}/800/600`;
            }}
          />
          {prompt.is_featured && (
            <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
              Featured
            </span>
          )}
          {prompt.is_free && (
            <span className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
              Free
            </span>
          )}
        </div>

        {/* Right: Details */}
        <div className="md:w-[45%] flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-0">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[prompt.category]}`}>
              {CATEGORY_LABELS[prompt.category]}
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors ml-4 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 flex-1">
            <h2 className="text-xl font-bold text-black mb-1 leading-tight">{prompt.title}</h2>
            <p className="text-xs text-gray-400 font-medium mb-4">{prompt.ai_tool}</p>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{prompt.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {prompt.tags.map((tag) => (
                <span key={tag} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>

            {/* Prompt section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {prompt.accessible ? 'Prompt' : 'Preview'}
                </p>
                {prompt.accessible && (
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                      copied ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {copied ? (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy prompt
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="relative">
                <div className={`bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs text-gray-700 font-mono leading-relaxed whitespace-pre-wrap break-words min-h-[80px] ${!prompt.accessible ? 'select-none' : ''}`}>
                  {prompt.accessible ? prompt.prompt_text : prompt.prompt_preview}
                </div>
                {!prompt.accessible && (
                  <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white via-white/80 to-transparent rounded-b-xl" />
                )}
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="border-t border-gray-100 p-5">
            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

            {prompt.accessible ? (
              /* Big copy button for accessible prompts */
              <button
                onClick={handleCopy}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                  copied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-black text-white hover:bg-gray-900'
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Copied to clipboard!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy prompt
                  </>
                )}
              </button>
            ) : (
              /* Pro upgrade CTA */
              <div>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-2xl font-bold text-black">$10</span>
                  <span className="text-sm text-gray-500">one-time · all prompts forever</span>
                </div>
                <p className="text-[11px] text-gray-400 mb-3">
                  Unlock all {'{'}14{'}'} prompts instantly — images, videos, and websites.
                </p>
                <button
                  onClick={handleUpgrade}
                  disabled={purchasing}
                  className="w-full flex items-center justify-center gap-2 bg-black text-white text-sm font-semibold py-3 rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {purchasing ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  {purchasing ? 'Redirecting…' : 'Unlock all prompts — $10'}
                </button>
                <p className="text-center text-[11px] text-gray-400 mt-2">Secure payment via Stripe</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
