'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLang } from '@/lib/lang'
import { INTERACTIVE_COPY } from '@/lib/content'

const HIDDEN_PATHS = ['/admin', '/vrijgezellenavond', '/bedrijfsfeest', '/privefeest']

export type StatusBadgeEvent = {
  title: string
  titleNl?: string
  titleEn?: string
  date: string
  startTime?: string
  slug?: string
}

type OpenWindow = { start: Date; end: Date }

const OPEN_DAYS: Record<number, { close: string }> = {
  4: { close: '02:00' }, // Thursday
  5: { close: '03:00' }, // Friday
  6: { close: '03:00' }, // Saturday
}

function buildWindows(from: Date): OpenWindow[] {
  const windows: OpenWindow[] = []
  for (let offset = -1; offset <= 10; offset++) {
    const day = new Date(from)
    day.setHours(0, 0, 0, 0)
    day.setDate(day.getDate() + offset)
    const rule = OPEN_DAYS[day.getDay()]
    if (!rule) continue
    const start = new Date(day)
    start.setHours(22, 0, 0, 0)
    const [closeH, closeM] = rule.close.split(':').map(Number)
    const end = new Date(day)
    end.setDate(end.getDate() + 1)
    end.setHours(closeH, closeM, 0, 0)
    windows.push({ start, end })
  }
  return windows.sort((a, b) => a.start.getTime() - b.start.getTime())
}

function getClubState(now: Date) {
  const windows = buildWindows(now)
  const current = windows.find((w) => now >= w.start && now < w.end)
  const next = windows.find((w) => w.start > now)
  return { isOpen: Boolean(current), closesAt: current?.end, nextOpen: next?.start }
}

function formatCountdown(target: Date, now: Date, t: { days: string; hours: string }) {
  const diffMs = Math.max(0, target.getTime() - now.getTime())
  const totalSeconds = Math.floor(diffMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (days > 0) return `${days}${t.days} ${hours}${t.hours}`
  return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export default function StatusBadge({ events = [] }: { events?: StatusBadgeEvent[] }) {
  const pathname = usePathname()
  const { lang } = useLang()
  const t = INTERACTIVE_COPY[lang]
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  if (HIDDEN_PATHS.some((path) => pathname?.startsWith(path))) return null
  if (!now) return null

  const { isOpen, closesAt, nextOpen } = getClubState(now)
  const upcoming = events.find((event) => {
    const eventDate = new Date(`${event.date}T${event.startTime || '22:00'}:00`)
    return eventDate.getTime() > now.getTime() - 3 * 60 * 60 * 1000
  })

  const eventDate = upcoming ? new Date(`${upcoming.date}T${upcoming.startTime || '22:00'}:00`) : nextOpen
  const eventTitle = upcoming ? (lang === 'nl' ? upcoming.titleNl || upcoming.title : upcoming.titleEn || upcoming.title) : null
  const href = upcoming?.slug
    ? lang === 'nl' ? `/uitgaan/${upcoming.slug}` : `/en/nightlife/${upcoming.slug}`
    : lang === 'nl' ? '/uitgaan' : '/en/nightlife'

  const label = isOpen
    ? `${t.status.openNow} · ${t.status.closesAt} ${closesAt ? formatTime(closesAt) : ''}`
    : eventDate
      ? `${t.status.doorsOpenIn} ${formatCountdown(eventDate, now, t.countdown)}`
      : t.status.closed

  return (
    <Link
      href={href}
      className="status-badge group fixed bottom-20 left-4 z-40 flex max-w-[calc(100vw-2rem)] items-center gap-2.5 rounded-full border border-white/15 bg-ink/85 py-2.5 pl-3 pr-4 text-[11px] font-black uppercase tracking-[0.08em] text-white/85 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:text-white sm:bottom-6 sm:left-6"
      aria-label={`${t.status.tonight}: ${label}`}
    >
      <span className={`relative flex h-2.5 w-2.5 shrink-0 rounded-full ${isOpen ? 'bg-emerald-400' : 'bg-white/35'}`} aria-hidden="true">
        {isOpen ? <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 motion-reduce:animate-none" /> : null}
      </span>
      <span className="truncate tabular-nums">{label}</span>
      {eventTitle ? <span className="hidden truncate text-white/45 sm:inline">· {eventTitle}</span> : null}
    </Link>
  )
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
}
