// Venue-hire booking rule: CLINIQ runs its own club nights on Thursday, Friday and Saturday, so
// those weekdays can never be booked for a private event - only Sunday through Wednesday are
// available. Shared between the client-side date field (components/forms/BookingDateField.tsx)
// and the server-side route guard (app/api/forms/event-space/route.ts) so both enforce the exact
// same rule from one place, and neither can drift from the other.
export function isBlockedBookingDay(dateStr: string): boolean {
  const date = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(date.getTime())) return false
  const day = date.getDay() // 0 Sun .. 6 Sat
  return day === 4 || day === 5 || day === 6 // Thu, Fri, Sat - CLINIQ's own open nights
}

export const BOOKING_BLOCKED_MESSAGE = {
  nl: 'Op donderdag, vrijdag en zaterdag is CLINIQ zelf open — die avonden zijn niet te boeken. Kies een dag van zondag t/m woensdag.',
  en: "Thursday, Friday and Saturday are our own club nights — those aren't available to book. Pick a day from Sunday to Wednesday.",
} as const

export const BOOKING_HELPER_TEXT = {
  nl: 'Beschikbaar zondag t/m woensdag. Do/vr/za draaien we onze eigen clubnachten.',
  en: 'Available Sunday–Wednesday. Thu/Fri/Sat are our own club nights.',
} as const

// Cavo's own page caps private-hire end times (they use 02:00) - CLINIQ has no stated policy yet,
// so this mirrors CLINIQ's existing Thursday close time (already the latest of its Sun-Wed-adjacent
// pattern) as a sensible placeholder. Flagged in the report as an owner decision, not a confirmed
// house rule - do not treat this value as authoritative without sign-off.
export const BOOKING_END_TIME_NOTE = {
  nl: 'Richtlijn eindtijd voor besloten avonden: uiterlijk 02:00 (onder voorbehoud, te bevestigen).',
  en: 'Guideline end time for private nights: 02:00 at the latest (provisional, to be confirmed).',
} as const
