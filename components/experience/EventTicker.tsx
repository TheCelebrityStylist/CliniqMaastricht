import { TICKER_ITEMS } from '@/lib/content'
import { formatDate } from '@/lib/utils'

// Plain server-rendered marquee — no client JS required for the base animation (pure CSS,
// respects prefers-reduced-motion globally via the site-wide animation-duration override in
// globals.css). Combines the existing brand-fact ticker data with real upcoming event titles/
// dates already fetched by the page — re-presents existing data in a new strip, invents nothing.
// Decorative/redundant with the accessible event cards elsewhere on the page, so hidden from
// assistive tech rather than announced twice.
export default function EventTicker({ events, lang = 'nl' }: { events: { title: string; date: string }[]; lang?: 'nl' | 'en' }) {
  const eventItems = events.slice(0, 6).map((event) => `${formatDate(event.date, lang).toUpperCase()} — ${event.title.toUpperCase()}`)
  const items = [...TICKER_ITEMS, ...eventItems]
  const doubled = [...items, ...items]

  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-white/10 bg-white/[0.02] py-3">
      <div className="flex w-max animate-[tickerScroll_38s_linear_infinite] gap-8 whitespace-nowrap motion-reduce:animate-none">
        {doubled.map((item, index) => (
          <span key={`${item}-${index}`} className="flex shrink-0 items-center gap-8 text-xs font-black uppercase tracking-[0.2em] text-white/40">
            {item}
            <span className="text-magenta">•</span>
          </span>
        ))}
      </div>
    </div>
  )
}
