import { ReactNode } from 'react';

interface Section {
  heading: string;
  content: ReactNode;
}

interface PolicyLayoutProps {
  title: string;
  subtitle: string;
  effectiveDate: string;
  accentColor: string;
  sections: Section[];
}

export default function PolicyLayout({ title, subtitle, effectiveDate, accentColor, sections }: PolicyLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Banner ─────────────────────────────────────────────────────── */}
      <div className="relative bg-[#0a0a0a] pt-32 pb-24 px-6 overflow-hidden">
        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Soft glow blobs */}
        <div className="absolute top-10 left-1/3 w-80 h-80 rounded-full blur-3xl" style={{ background: accentColor, opacity: 0.06 }} />
        <div className="absolute bottom-0 right-1/4 w-56 h-56 rounded-full blur-2xl" style={{ background: accentColor, opacity: 0.04 }} />

        <div className="relative max-w-3xl mx-auto">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-4">
            PromptX
          </span>
          <h1 className="text-4xl md:text-[56px] font-bold text-white leading-tight tracking-tight mb-4">
            {title}
          </h1>
          <p className="text-gray-400 text-base mb-2">{subtitle}</p>
          <p className="text-gray-600 text-xs font-medium">Effective date: {effectiveDate}</p>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Intro divider */}
        <div className="h-px bg-gray-100 mb-12" />

        <div className="space-y-12">
          {sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-lg font-bold text-black mb-4 flex items-start gap-3">
                <span className="shrink-0 text-xs font-bold text-gray-300 mt-1 tabular-nums w-6">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {section.heading}
              </h2>
              <div className="pl-9 text-[14.5px] text-gray-600 leading-[1.85] space-y-3">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        {/* Footer rule */}
        <div className="h-px bg-gray-100 mt-16 mb-10" />
        <p className="text-xs text-gray-400 text-center">
          Questions? Email us at{' '}
          <a href="mailto:legal@promptx.ai" className="text-black font-medium hover:underline">
            legal@promptx.ai
          </a>
        </p>
      </div>
    </div>
  );
}
