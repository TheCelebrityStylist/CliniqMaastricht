'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getClubStatus, type ClubStatusEvent } from '@/lib/clubStatus'
import type { Lang } from '@/lib/i18n'

// The Countdown module (component-kit spec #countdown): a rounded-lg card, coral/magenta
// gradient wash, pulsing magenta dot, small magenta doorLabel, big tabular value, muted sub-line.
// Composed inline in the hero's document flow (never a floating pill - the brief's own diagnosis
// was that a fixed badge collided with body copy and the mobile action bar). Server-rendered with
// a real value computed at request time, then upgraded to a live per-second tick on the client;
// first client render matches the server render exactly so there's no hydration flash.
export default function HeroStatus({ events, lang, initialNow }: { events: ClubStatusEvent[]; lang: Lang; initialNow: number }) {
  const [now, setNow] = useState(initialNow)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const { doorLabel, value, sub, href, isOpen } = getClubStatus(new Date(now), events, lang)

  return (
    <Link
      href={href}
      className="focus-ring group mt-6 inline-flex min-h-11 items-center gap-3.5 rounded-[20px] border border-white/10 px-4 py-3.5 transition hover:border-white/25"
      style={{ background: 'linear-gradient(150deg, rgba(219,51,76,.16), rgba(220,72,254,.10))' }}
    >
      <span className="relative flex h-[9px] w-[9px] shrink-0 rounded-full bg-magenta" aria-hidden="true">
        {isOpen ? <span className="absolute inset-0 animate-ping rounded-full bg-magenta motion-reduce:animate-none" /> : null}
      </span>
      <span>
        <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-magenta">{doorLabel}</span>
        <span className="block font-display text-xl font-extrabold tabular-nums tracking-tight text-white sm:text-2xl">{value}</span>
        {sub ? <span className="mt-0.5 block text-[12.5px] text-white/70">{sub}</span> : null}
      </span>
    </Link>
  )
}
