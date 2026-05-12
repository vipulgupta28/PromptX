import type { Category } from '../types';

const categories: { value: Category | 'all'; label: string; icon: () => JSX.Element; count?: number }[] = [
  { value: 'all', label: 'All Prompts', icon: GridIcon },
  { value: 'image', label: 'Images', icon: ImageIcon },
  { value: 'video', label: 'Videos', icon: VideoIcon },
  { value: 'website', label: 'Websites', icon: CodeIcon },
];

interface SidebarProps {
  active: Category | 'all';
  onChange: (cat: Category | 'all') => void;
  counts: Record<string, number>;
}

export default function Sidebar({ active, onChange, counts }: SidebarProps) {
  return (
    <aside className="w-60 shrink-0 hidden lg:flex flex-col gap-1 pt-8">
      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold px-3 mb-2">
        Categories
      </p>
      {categories.map(({ value, label, icon: Icon }) => {
        const isActive = active === value;
        const count = value === 'all'
          ? Object.values(counts).reduce((a, b) => a + b, 0)
          : counts[value] ?? 0;

        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
              isActive
                ? 'bg-black text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-black'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Icon />
              {label}
            </div>
            <span
              className={`text-xs font-medium rounded-full px-2 py-0.5 tabular-nums ${
                isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}

      <div className="mt-8 px-3">
        <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
          <p className="text-xs font-semibold text-black mb-1">Sell your prompts</p>
          <p className="text-xs text-gray-500 mb-3">Share your best AI prompts and earn money.</p>
          <a
            href="mailto:hello@promptx.ai"
            className="block text-center text-xs font-semibold bg-black text-white rounded-lg py-2 hover:bg-gray-900 transition-colors"
          >
            Apply as creator
          </a>
        </div>
      </div>
    </aside>
  );
}

function GridIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.362a1 1 0 01-1.447.894L15 14M4 8h11a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}
