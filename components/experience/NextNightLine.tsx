import Link from 'next/link'
import { getNextNightLine, type ClubStatusEvent } from '@/lib/clubStatus'
import type { Lang } from '@/lib/i18n'

// Plain, un-boxed line above the agenda cards: eyebrow + date/DJ, no border, no dot, no live
// counter. Static per request (SSR, revalidate=60) - a live countdown would need client JS and
// per-second re-renders for no real benefit on a line that's just naming the next date.
export default function NextNightLine({ events, lang }: { events: ClubStatusEvent[]; lang: Lang }) {
  const line = getNextNightLine(new Date(), events, lang)
  if (!line) return null

  return (
    <Link href={line.href} className="focus-ring group mb-6 inline-flex min-h-11 flex-col items-start gap-0.5 sm:flex-row sm:items-baseline sm:gap-2.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-magenta">{line.label}</span>
      <span className="font-display text-lg font-extrabold tracking-tight text-white transition group-hover:text-coral-text sm:text-xl">
        {line.value}
        {line.sub ? <span className="ml-2 font-sans text-[13px] font-normal normal-case tracking-normal text-white/60">{line.value ? '· ' : ''}{line.sub}</span> : null}
      </span>
    </Link>
  )
}
