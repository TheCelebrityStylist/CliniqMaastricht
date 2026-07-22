import { INTERACTIVE_COPY } from './content'
import type { Lang } from './i18n'

export type ClubStatusEvent = {
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

function getClubWindow(now: Date) {
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

function formatTime(date: Date) {
  return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
}

export function getClubStatus(now: Date, events: ClubStatusEvent[], lang: Lang) {
  const t = INTERACTIVE_COPY[lang]
  const { isOpen, closesAt, nextOpen } = getClubWindow(now)
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

  return { label, href, isOpen, eventTitle }
}
