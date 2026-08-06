import { SITE, HOURS } from '@/lib/content'
import { formatDate } from '@/lib/utils'

// Live info ticker (component-kit spec #00 - plum bar, magenta emphasis, address / tonight's
// event / door time / capacity / days open). Server-rendered, CSS-only marquee (no client JS -
// respects prefers-reduced-motion via the site-wide animation-duration override in globals.css).
// Every fact reused verbatim from existing data (SITE address, HOURS, the real Sanity events
// already fetched by the page) - nothing invented. "Tonight" only appears when there's a real
// event dated today; otherwise the strip just states the address/hours/capacity facts.
export default function EventTicker({ events, lang = 'nl' }: { events: { title: string; date: string }[]; lang?: 'nl' | 'en' }) {
  const todayStr = new Date().toISOString().slice(0, 10)
  const tonight = events.find((event) => event.date === todayStr)
  const daysLabel = HOURS.map((h) => h.abbr[lang]).join(' · ')
  const capacityLabel = lang === 'nl' ? '400 gasten' : '400 guests'

  const items = [
    SITE.address.street,
    ...(tonight ? [{ bold: lang === 'nl' ? 'Vanavond' : 'Tonight', rest: tonight.title }] : []),
    ...(!tonight && events[0] ? [`${formatDate(events[0].date, lang)} — ${events[0].title}`] : []),
    HOURS.map((h) => `${h.abbr[lang]} ${h.time}`).join(' · '),
    capacityLabel,
    daysLabel,
  ]
  const doubled = [...items, ...items]

  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-white/10 bg-plum py-2.5">
      <div className="flex w-max animate-[tickerScroll_32s_linear_infinite] gap-10 whitespace-nowrap motion-reduce:animate-none">
        {doubled.map((item, index) => (
          <span key={index} className="flex shrink-0 items-center gap-10 text-xs font-bold uppercase tracking-[0.2em] text-white/85">
            {typeof item === 'string' ? item : <><b className="text-magenta">{item.bold}</b>&nbsp;{item.rest}</>}
            <span className="text-magenta" aria-hidden="true">•</span>
          </span>
        ))}
      </div>
    </div>
  )
}
