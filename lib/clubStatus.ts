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
  4: { close: '03:00' }, // Thursday - CONFIRM WITH OWNER: some venues run a shorter Thursday
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
  return { isOpen: Boolean(current), closesAt: current?.end, opensAt: current?.start, nextOpen: next?.start }
}

// Local (not UTC) YYYY-MM-DD key, matching how `event.date` strings represent a calendar day and
// how buildWindows already constructs its own day boundaries with local Date methods.
function toDateKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
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

// Matches the component-kit's Countdown module shape: a small magenta doorLabel, a big tabular
// value, and a muted sub-line - composed inline in the hero, per the kit's #countdown spec.
// While OPEN this now counts DOWN to closing time (live, ticking) instead of a static "tot
// 03:00" - a static value read as disconnected from the "it's happening now" moment the open
// state should convey. While CLOSED it still counts down to the next opening, unchanged.
export function getClubStatus(now: Date, events: ClubStatusEvent[], lang: Lang) {
  const t = INTERACTIVE_COPY[lang]
  const { isOpen, closesAt, opensAt, nextOpen } = getClubWindow(now)

  let doorLabel: string, value: string, sub: string | null, eventTitle: string | null, href: string

  if (isOpen) {
    // Only ever attach tonight's actual event to the open state - the 3h grace window used for
    // the closed/upcoming case exists to bridge the gap before doors open, but while already
    // open it could otherwise resolve to a stale/adjacent night's DJ. No match = no DJ name.
    const windowDateKey = opensAt ? toDateKey(opensAt) : null
    const tonight = windowDateKey ? events.find((event) => event.date === windowDateKey) : undefined

    doorLabel = t.status.openNow
    value = closesAt ? formatCountdown(closesAt, now, t.countdown) : t.status.openNow
    eventTitle = tonight ? (lang === 'nl' ? tonight.titleNl || tonight.title : tonight.titleEn || tonight.title) : null
    const closeLabel = closesAt ? `${t.status.closesAt} ${formatTime(closesAt)}` : null
    sub = [closeLabel, eventTitle].filter(Boolean).join(' · ') || null
    href = tonight?.slug
      ? lang === 'nl' ? `/uitgaan/${tonight.slug}` : `/en/nightlife/${tonight.slug}`
      : lang === 'nl' ? '/uitgaan' : '/en/nightlife'
  } else {
    const upcoming = events.find((event) => {
      const eventDate = new Date(`${event.date}T${event.startTime || '22:00'}:00`)
      return eventDate.getTime() > now.getTime() - 3 * 60 * 60 * 1000
    })
    const eventDate = upcoming ? new Date(`${upcoming.date}T${upcoming.startTime || '22:00'}:00`) : nextOpen
    eventTitle = upcoming ? (lang === 'nl' ? upcoming.titleNl || upcoming.title : upcoming.titleEn || upcoming.title) : null

    if (eventDate) {
      doorLabel = t.status.doorsOpenIn
      value = formatCountdown(eventDate, now, t.countdown)
    } else {
      doorLabel = t.status.closed
      value = '—'
    }

    const subLabel = [lang === 'nl' ? 'Vanavond' : 'Tonight', eventTitle].filter(Boolean).join(' · ')
    sub = eventTitle ? subLabel : null
    href = upcoming?.slug
      ? lang === 'nl' ? `/uitgaan/${upcoming.slug}` : `/en/nightlife/${upcoming.slug}`
      : lang === 'nl' ? '/uitgaan' : '/en/nightlife'
  }

  return { doorLabel, value, sub, href, isOpen, eventTitle }
}
