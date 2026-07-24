import type { ReactNode } from 'react'

// Component-kit spec #05 `.more`: the remaining full copy behind a disclosure. Present in the DOM
// at load (SSR, crawlable) and visually collapsed - this is how a long block stays complete for
// ranking/GEO without reading as a wall to a human visitor.
export default function ExpandableDetail({ summary, children }: { summary: string; children: ReactNode }) {
  return (
    <details className="group mt-4 overflow-hidden rounded-2xl border border-white/10">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-[18px] py-4 text-[12.5px] font-bold uppercase tracking-[0.1em] group-open:border-b group-open:border-white/10 [&::-webkit-details-marker]:hidden">
        <span>{summary}</span>
        <span aria-hidden="true" className="text-lg leading-none transition-transform duration-200 group-open:rotate-45">+</span>
      </summary>
      <div className="px-[18px] py-[18px] text-[15px] leading-[1.6] text-white/72 [&>p]:mb-3 [&>p:last-child]:mb-0">
        {children}
      </div>
    </details>
  )
}
