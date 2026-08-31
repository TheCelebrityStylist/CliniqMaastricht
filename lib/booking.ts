// Venue-hire booking rule: CLINIQ runs its own club nights on Thursday, Friday and Saturday
// evenings, so those slots can never be booked for a private event. Daytime on those same days
// may still be possible - the rule gates on DATE + TIME together, not the date alone. Sunday
// through Wednesday stays open any time of day. Shared between the client-side field
// (components/forms/BookingScheduleField.tsx) and the server-side route guard
// (app/api/forms/event-space/route.ts) so both enforce the exact same rule from one place.
export function isClubNightDay(dateStr: string): boolean {
  const date = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(date.getTime())) return false
  const day = date.getDay() // 0 Sun .. 6 Sat
  return day === 4 || day === 5 || day === 6 // Thu, Fri, Sat - CLINIQ's own open nights
}

// Thu/Fri/Sat bookings starting before this are treated as daytime, not the club-night evening -
// a placeholder cutoff (not an owner-confirmed house rule) since no exact value was supplied.
// Flagged for confirmation in the report, same as the end-time guideline below.
export const DAYTIME_CUTOFF = '18:00'

// No time given at all is treated conservatively as NOT daytime - the primary use case on a
// Thu/Fri/Sat is the club night, so an unspecified time on those days defaults to "assume evening
// unless a daytime time was actually given" rather than silently letting an unspecified booking
// through. The blocked message itself tells the visitor to pick a daytime time to unblock it.
export function isDaytimeSlot(timeStr: string | undefined | null): boolean {
  if (!timeStr) return false
  return timeStr < DAYTIME_CUTOFF // zero-padded "HH:MM" strings compare correctly lexically
}

// True when this date+time combination is genuinely unbookable: a club night (Thu/Fri/Sat)
// without a qualifying daytime time. Sun-Wed is never blocked, at any time.
export function isBlockedBookingSlot(dateStr: string, timeStr?: string | null): boolean {
  if (!isClubNightDay(dateStr)) return false
  return !isDaytimeSlot(timeStr)
}

// True when a Thu/Fri/Sat + daytime combination is being let through as a flagged enquiry rather
// than a normal booking - "possibly available, subject to confirmation," not a guaranteed slot.
export function isDaytimeException(dateStr: string, timeStr?: string | null): boolean {
  return isClubNightDay(dateStr) && isDaytimeSlot(timeStr)
}

export const BOOKING_BLOCKED_MESSAGE = {
  nl: 'Do, vr en za avond draaien we onze eigen clubnachten — die avonden zijn niet te boeken. Overdag kunnen we mogelijk wél iets regelen; kies een tijd overdag of een dag van zondag t/m woensdag.',
  en: "Thursday, Friday and Saturday evenings are our own club nights and can't be booked. Daytime on those days may be possible — pick a daytime slot, or a day from Sunday to Wednesday.",
} as const

export const BOOKING_DAYTIME_NOTE = {
  nl: 'Overdag op do/vr/za: mogelijk, onder voorbehoud van beschikbaarheid — we nemen contact op.',
  en: "Daytime on Thu/Fri/Sat: possibly available, subject to confirmation — we'll be in touch.",
} as const

export const BOOKING_HELPER_TEXT = {
  nl: 'Zo t/m wo: dag en avond. Do/vr/za: alleen overdag mogelijk (avonden zijn clubnachten).',
  en: 'Sun–Wed: day & evening. Thu–Sat: daytime only (evenings are club nights).',
} as const

// Cavo's own page caps private-hire end times (they use 02:00) - CLINIQ has no stated policy yet,
// so this mirrors CLINIQ's existing Thursday close time (already the latest of its Sun-Wed-adjacent
// pattern) as a sensible placeholder. Flagged in the report as an owner decision, not a confirmed
// house rule - do not treat this value as authoritative without sign-off.
export const BOOKING_END_TIME_NOTE = {
  nl: 'Richtlijn eindtijd voor besloten avonden: uiterlijk 02:00 (onder voorbehoud, te bevestigen).',
  en: 'Guideline end time for private nights: 02:00 at the latest (provisional, to be confirmed).',
} as const
