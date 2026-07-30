'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getClubStatus, type ClubStatusEvent } from '@/lib/clubStatus'
import type { Lang } from '@/lib/i18n'

// Replaces the old hero-floating HeroStatus chip: the bordered box over the hero photo read as
// disconnected from the rest of the design, and "next night" belongs with the agenda it's
// describing, not floating on top of a photo. Same getClubStatus data and live per-second tick as
// before - only where and how it renders changed, from a bordered glass chip to a single quiet
// line (no box, no background) sitting above the agenda's event cards.
export default function NextNightLine({ events, lang, initialNow }: { events: ClubStatusEvent[]; lang: Lang; initialNow: number }) {
  const [now, setNow] = useState(initialNow)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const { doorLabel, value, sub, href } = getClubStatus(new Date(now), events, lang)

  return (
    <Link href={href} className="focus-ring group mb-6 inline-flex min-h-11 flex-col items-start gap-0.5 sm:flex-row sm:items-baseline sm:gap-2.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-magenta">{doorLabel}</span>
      <span className="font-display text-lg font-extrabold tabular-nums tracking-tight text-white transition group-hover:text-coral-text sm:text-xl">
        {value}
        {sub ? <span className="ml-2 font-sans text-[13px] font-normal normal-case tracking-normal text-white/60">· {sub}</span> : null}
      </span>
    </Link>
  )
}
