import type { Prompt } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  image: 'bg-violet-50 text-violet-700',
  video: 'bg-blue-50 text-blue-700',
  website: 'bg-emerald-50 text-emerald-700',
};

const CATEGORY_LABELS: Record<string, string> = {
  image: 'Image',
  video: 'Video',
  website: 'Website',
};

interface PromptCardProps {
  prompt: Prompt;
  onClick: () => void;
}

export default function PromptCard({ prompt, onClick }: PromptCardProps) {
  return (
    <article
      onClick={onClick}
      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:border-gray-300 hover:shadow-md transition-all duration-200"
    >
      {/* Preview image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={prompt.preview_url}
          alt={prompt.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${prompt.id}/800/600`;
          }}
        />
        {/* Featured badge */}
        {prompt.is_featured && (
          <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full">
            Featured
          </span>
        )}
        {/* Lock overlay for inaccessible prompts */}
        {!prompt.accessible && !prompt.is_free && (
          <div className="absolute inset-0 bg-black/10 flex items-end justify-end p-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
              <svg className="w-3 h-3 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-[10px] font-semibold text-gray-700">Pro</span>
            </div>
          </div>
        )}
        {/* Free badge */}
        {prompt.is_free && (
          <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            Free
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[prompt.category]}`}>
            {CATEGORY_LABELS[prompt.category]}
          </span>
          <span className="text-[11px] text-gray-400 font-medium">{prompt.ai_tool}</span>
        </div>

        <h3 className="text-sm font-semibold text-black mb-1.5 leading-snug line-clamp-1">
          {prompt.title}
        </h3>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">
          {prompt.description}
        </p>

        <div className="flex items-center justify-between">
          {prompt.is_free ? (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Free access</span>
          ) : prompt.accessible ? (
            <span className="text-xs font-semibold text-black bg-gray-100 px-2 py-0.5 rounded-full">Pro · Unlocked</span>
          ) : (
            <span className="text-xs font-semibold text-gray-500">Requires Pro</span>
          )}

          <span className="text-xs font-semibold text-gray-900 group-hover:underline flex items-center gap-1">
            {prompt.accessible ? 'Copy prompt' : 'See preview'}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </article>
  );
}
