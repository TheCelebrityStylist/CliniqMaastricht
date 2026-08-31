import { NextResponse } from 'next/server'
import { createLeadRoute } from '@/lib/sanity/formRoute'
import { BOOKING_BLOCKED_MESSAGE, isBlockedBookingDay } from '@/lib/booking'

const handleEventSpaceLead = createLeadRoute('eventSpace')

// Server-side half of the Thu/Fri/Sat booking rule: the client-side BookingDateField already
// blocks it, but a bypassed/typed value must never reach the shared lead pipeline either. This
// only wraps the event-space route - createLeadRoute itself (shared by contact/workshop/job) is
// untouched, so nothing changes for the other form types.
export async function POST(request: Request) {
  const body = await request.clone().json().catch(() => null as Record<string, unknown> | null)
  const lang = typeof body?.sourcePage === 'string' && body.sourcePage.startsWith('/en') ? 'en' : 'nl'

  const blockedDate = ['preferredDate', 'preferredDate2']
    .map((key) => body?.[key])
    .find((value): value is string => typeof value === 'string' && value.length > 0 && isBlockedBookingDay(value))

  if (blockedDate) {
    return NextResponse.json({ success: false, error: 'blocked-date', message: BOOKING_BLOCKED_MESSAGE[lang] }, { status: 400 })
  }

  return handleEventSpaceLead(request)
}
