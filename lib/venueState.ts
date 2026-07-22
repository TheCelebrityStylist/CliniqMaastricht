export type VenueState = 'day' | 'night'

// Thursday/Friday/Saturday close times, mirrors site.hours (lib/site.ts) - duplicated as a plain
// day-index map because it needs to be cheap to evaluate on every request server-side.
const OPEN_DAYS: Record<number, { close: string }> = {
  4: { close: '02:00' }, // Thursday
  5: { close: '03:00' }, // Friday
  6: { close: '03:00' }, // Saturday
}

// The dual-state system's default: "the truth of the venue now" - the waiting room (day) on a
// Tuesday afternoon, the treatment (night) from early evening through close on an open night.
// Deliberately generous on the pre-open side (from 18:00, not 22:00) so the site is already "the
// treatment" while people are getting ready to go out, not just during the two-to-five hour
// window the doors are literally open.
export function getVenueState(now = new Date()): VenueState {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Amsterdam',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now)

  const weekdayShort = parts.find((p) => p.type === 'weekday')?.value ?? ''
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0')
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '0')
  const minutesNow = hour * 60 + minute

  const WEEKDAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  const dayIndex = WEEKDAY_INDEX[weekdayShort]

  // Night if today is an open night and it's past 18:00 local time...
  if (OPEN_DAYS[dayIndex] && minutesNow >= 18 * 60) return 'night'

  // ...or if it's still the early hours of the morning after an open night (yesterday's window
  // running past midnight, e.g. Friday 22:00 -> Saturday 03:00).
  const yesterdayIndex = (dayIndex + 6) % 7
  const yesterdayRule = OPEN_DAYS[yesterdayIndex]
  if (yesterdayRule) {
    const [closeH, closeM] = yesterdayRule.close.split(':').map(Number)
    if (minutesNow < closeH * 60 + closeM) return 'night'
  }

  return 'day'
}

export const VENUE_STATE_COOKIE = 'cliniq_venue_state'
