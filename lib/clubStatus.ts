import { HOURS, INTERACTIVE_COPY } from './content'
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

// getDay() (0=Sun..6=Sat) -> index into HOURS (which only lists the three real club nights),
// reusing the exact weekday abbreviations already shown in the ticker/opening-hours copy instead
// of a second hand-rolled day-name table.
const HOURS_INDEX_BY_WEEKDAY: Record<number, number> = { 4: 0, 5: 1, 6: 2 }

// Short weekday + date, e.g. "Za 2 aug" / "Sat 2 Aug" - used for a night that's a future day, so
// it never renders as a bare countdown of days.
function formatShortDate(date: Date, lang: Lang) {
  const hoursEntry = HOURS[HOURS_INDEX_BY_WEEKDAY[date.getDay()]]
  const weekday = hoursEntry ? hoursEntry.abbr[lang] : ''
  const month = date.toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-GB', { month: 'short' })
  return `${weekday} ${date.getDate()} ${month}`.trim()
}

const DOORS_GRACE_MS = 3 * 60 * 60 * 1000

// Matches the component-kit's Countdown module shape: a small magenta doorLabel, a big tabular
// value, and a muted sub-line - composed inline in the hero, per the kit's #countdown spec.
// Three distinct states, never a days-counter and never a mislabeled "Vanavond" on a night that
// isn't today (the bug this replaces: "Deuren open over 4d 5u · Vanavond · DJ Hadless" - a
// nightclub counting down days is inherently uncool, and the label contradicted the value):
//  - OPEN: live countdown to close, sub = close time (+ tonight's DJ if known).
//  - a night is TODAY but doors aren't open yet: static "Deuren HH:MM" until the final ~3h
//    before doors, then switches to a live per-second countdown ("Deuren open over").
//  - the next night is a future day: no countdown at all - just which day, plainly.
export function getClubStatus(now: Date, events: ClubStatusEvent[], lang: Lang) {
  const t = INTERACTIVE_COPY[lang]
  const { isOpen, closesAt, opensAt, nextOpen } = getClubWindow(now)

  const eventFor = (dateKey: string) => events.find((event) => event.date === dateKey)
  const titleOf = (event: ClubStatusEvent) => (lang === 'nl' ? event.titleNl || event.title : event.titleEn || event.title)
  const hrefFor = (event?: ClubStatusEvent) =>
    event?.slug
      ? lang === 'nl' ? `/uitgaan/${event.slug}` : `/en/nightlife/${event.slug}`
      : lang === 'nl' ? '/uitgaan' : '/en/nightlife'

  let doorLabel: string, value: string, sub: string | null, eventTitle: string | null, href: string

  if (isOpen) {
    const tonight = opensAt ? eventFor(toDateKey(opensAt)) : undefined
    eventTitle = tonight ? titleOf(tonight) : null

    doorLabel = t.status.openNow
    value = closesAt ? formatCountdown(closesAt, now, t.countdown) : t.status.openNow
    const closeLabel = closesAt ? `${t.status.closes} ${formatTime(closesAt)}` : null
    sub = [closeLabel, eventTitle].filter(Boolean).join(' · ') || null
    href = hrefFor(tonight)
  } else if (nextOpen) {
    const isTonight = toDateKey(nextOpen) === toDateKey(now)
    const upcoming = eventFor(toDateKey(nextOpen))
    eventTitle = upcoming ? titleOf(upcoming) : null
    href = hrefFor(upcoming)

    if (isTonight) {
      const msToDoors = nextOpen.getTime() - now.getTime()
      if (msToDoors <= DOORS_GRACE_MS) {
        doorLabel = t.status.doorsOpenIn
        value = formatCountdown(nextOpen, now, t.countdown)
      } else {
        doorLabel = t.status.tonightShort
        value = `${t.status.doorsAt} ${formatTime(nextOpen)}`
      }
      sub = eventTitle
    } else {
      doorLabel = t.status.nextEvent
      value = formatShortDate(nextOpen, lang)
      sub = eventTitle
    }
  } else {
    doorLabel = t.status.closed
    value = '—'
    sub = null
    eventTitle = null
    href = lang === 'nl' ? '/uitgaan' : '/en/nightlife'
  }

  return { doorLabel, value, sub, href, isOpen, eventTitle }
}
