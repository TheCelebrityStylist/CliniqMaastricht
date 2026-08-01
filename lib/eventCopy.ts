import type { AgendaEvent } from './admin/types'
import type { Lang } from './i18n'

type EventLike = AgendaEvent & { relatedAlbumSlug?: string }

// "Dit weekend" is only ever true when the event's calendar date actually falls on the
// Friday/Saturday of the current (or, late in the week, upcoming) weekend relative to `now` —
// never inferred from a countdown or hardcoded. No spot-count/capacity field exists anywhere in
// the Sanity event schema or the admin fallback data, so "Nog X plekken" / "Bijna vol" are
// deliberately NOT implemented anywhere in this codebase: the brief's own rule is that an urgency
// label must be truthful from data, and there is no real data to back those two.
export function isThisWeekend(dateStr: string, now = new Date()): boolean {
  const date = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(date.getTime())) return false

  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  const dow = today.getDay() // 0 Sun .. 6 Sat
  // Offset (days) from today back/forward to the Friday that anchors the current-or-next weekend:
  // if today already is Fri/Sat/Sun, anchor to that weekend's Friday (0/-1/-2); otherwise anchor
  // forward to the upcoming Friday.
  const fridayOffset = dow === 5 ? 0 : dow === 6 ? -1 : dow === 0 ? -2 : 5 - dow
  const friday = new Date(today)
  friday.setDate(friday.getDate() + fridayOffset)
  const mondayAfter = new Date(friday)
  mondayAfter.setDate(mondayAfter.getDate() + 3) // through end of Sunday

  return date >= friday && date < mondayAfter
}

// Picks the card that gets the full-bleed FeaturedEvent treatment: an explicit Sanity/admin
// `featured` flag wins if one exists among the upcoming events; otherwise the next chronological
// night is featured by default (the brief's own wording: "the next (or flagged) big night").
export function pickFeaturedEvent<T extends { date: string; featured?: boolean }>(events: T[]): T | null {
  if (!events.length) return null
  return events.find((event) => event.featured) || events[0]
}

const MONTHS_NL = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS_NL = ['ZO', 'MA', 'DI', 'WO', 'DO', 'VR', 'ZA']
const WEEKDAYS_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

// Big oversized date block for FeaturedEvent, e.g. { weekday: 'ZA', day: '17', month: 'AUG' }.
export function formatBigDate(dateStr: string, lang: Lang) {
  const date = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(date.getTime())) return { weekday: '', day: '', month: '' }
  const months = lang === 'nl' ? MONTHS_NL : MONTHS_EN
  const weekdays = lang === 'nl' ? WEEKDAYS_NL : WEEKDAYS_EN
  return {
    weekday: weekdays[date.getDay()],
    day: String(date.getDate()),
    month: months[date.getMonth()].toUpperCase(),
  }
}

function weekdayLong(dateStr: string, lang: Lang) {
  const date = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-GB', { weekday: 'long' })
}

function dateLong(dateStr: string, lang: Lang) {
  const date = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-GB', { day: 'numeric', month: 'long' })
}

// Per-event promo body copy, generated from Sanity/admin fields (date, act, theme, age) per the
// approved template. NEW copy - every string this produces is listed for approval in the report,
// never silently shipped as if it were existing/approved body copy.
export function generateEventPromoNl(event: EventLike): string {
  const act = event.titleNl || event.title
  const weekday = weekdayLong(event.date, 'nl')
  const dateStr = dateLong(event.date, 'nl')
  const doors = event.startTime || '22:00'
  const age = event.ageLimit || '21+'
  return `${cap(weekday)} ${dateStr} zet CLINIQ de Platielstraat op z'n kop. ${act} achter de knoppen, cocktails tot in de late uurtjes en de dansvloer waar uitgaan in Maastricht om draait. Deuren ${doors} — open tot ${event.endTime || '03:00'}. ${age}. Beperkt plek — zorg dat je erbij bent.`
}

export function generateEventPromoEn(event: EventLike): string {
  const act = event.titleEn || event.title
  const weekday = weekdayLong(event.date, 'en')
  const dateStr = dateLong(event.date, 'en')
  const doors = event.startTime || '22:00'
  const age = event.ageLimit || '21+'
  return `${cap(weekday)} ${dateStr} CLINIQ turns the Platielstraat upside down. ${act} on the decks, cocktails deep into the night and the dancefloor that defines going out in Maastricht. Doors ${doors} — open until ${event.endTime || '03:00'}. ${age}. Limited spots — be there.`
}

function cap(text: string) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text
}

// GEO answer block for "Wat is er dit weekend te doen in Maastricht?" - the freshness signal is
// real: it lists the actual upcoming Fri/Sat/Sun events from the same data source the agenda
// renders from, not a static claim. Falls back to the standing opening-hours fact when nothing in
// the current data window falls on the upcoming weekend (never fabricates a lineup).
export function weekendAnswerNl(events: EventLike[], now = new Date()): string {
  const weekendEvents = events.filter((event) => isThisWeekend(event.date, now))
  if (!weekendEvents.length) {
    return 'CLINIQ aan de Platielstraat 9A is open op donderdag, vrijdag en zaterdag vanaf 22:00. Bekijk de actuele agenda voor de line-up van dit weekend.'
  }
  const list = weekendEvents.map((event) => `${weekdayLong(event.date, 'nl')} ${dateLong(event.date, 'nl')} — ${event.titleNl || event.title}`).join(', ')
  return `Dit weekend is CLINIQ aan de Platielstraat 9A open met: ${list}. Deuren vanaf 22:00, dansvloer open tot 02:00 of 03:00 afhankelijk van de avond. Bekijk de volledige agenda voor tijden en leeftijdsindicatie.`
}

export function weekendAnswerEn(events: EventLike[], now = new Date()): string {
  const weekendEvents = events.filter((event) => isThisWeekend(event.date, now))
  if (!weekendEvents.length) {
    return 'CLINIQ on Platielstraat 9A is open Thursday, Friday and Saturday from 22:00. Check the live agenda for this weekend\'s line-up.'
  }
  const list = weekendEvents.map((event) => `${weekdayLong(event.date, 'en')} ${dateLong(event.date, 'en')} — ${event.titleEn || event.title}`).join(', ')
  return `This weekend CLINIQ on Platielstraat 9A is open with: ${list}. Doors from 22:00, dancefloor open until 02:00 or 03:00 depending on the night. Check the full agenda for times and age policy.`
}
