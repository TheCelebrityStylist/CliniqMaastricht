'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getClubStatus, type ClubStatusEvent } from '@/lib/clubStatus'
import type { Lang } from '@/lib/i18n'

// Replaces StatusBadge: the live open/countdown status composed into the hero as typography
// (in the normal document flow) instead of a fixed floating chip - the brief's own diagnosis was
// that the badge collided with body copy and the mobile action bar. Server-rendered with a real
// label computed at request time (accurate to the page's 60s revalidate window - the countdown
// doesn't need per-second precision to be true, only fresh), then optionally upgraded to a live
// per-second tick on the client once mounted. First client render intentionally matches the
// server render exactly (same computation, same inputs) so there's no hydration flash.
export default function HeroStatus({ events, lang, initialNow }: { events: ClubStatusEvent[]; lang: Lang; initialNow: number }) {
  const [now, setNow] = useState(initialNow)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const { label, href, isOpen, eventTitle } = getClubStatus(new Date(now), events, lang)

  return (
    <Link
      href={href}
      className="focus-ring group mt-6 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.04] py-2 pl-3 pr-4 text-xs font-bold uppercase tracking-[0.06em] text-white/75 backdrop-blur-sm transition hover:border-white/30 hover:text-white"
    >
      <span className={`relative flex h-2 w-2 shrink-0 rounded-full ${isOpen ? 'bg-coral' : 'bg-white/35'}`} aria-hidden="true">
        {isOpen ? <span className="absolute inset-0 animate-ping rounded-full bg-coral motion-reduce:animate-none" /> : null}
      </span>
      <span className="tabular-nums">{label}</span>
      {eventTitle ? <span className="hidden text-white/45 sm:inline">· {eventTitle}</span> : null}
    </Link>
  )
}
