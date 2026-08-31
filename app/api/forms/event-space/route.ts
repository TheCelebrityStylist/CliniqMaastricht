import { NextResponse } from 'next/server'
import { createLeadRoute } from '@/lib/sanity/formRoute'
import { BOOKING_BLOCKED_MESSAGE, isBlockedBookingSlot } from '@/lib/booking'

const handleEventSpaceLead = createLeadRoute('eventSpace')

// Server-side half of the daytime-exception booking rule: the client-side BookingScheduleField
// already blocks a Thu/Fri/Sat evening slot, but a bypassed/typed value must never reach the
// shared lead pipeline either. Both date options are checked against the same shared `time` field
// - a Thu/Fri/Sat daytime slot is NOT blocked here, it passes through to the normal pipeline (the
// client already tags it via the hidden availabilityNote field in the payload). This only wraps
// the event-space route - createLeadRoute itself (shared by contact/workshop/job) is untouched,
// so nothing changes for the other form types.
export async function POST(request: Request) {
  const body = await request.clone().json().catch(() => null as Record<string, unknown> | null)
  const lang = typeof body?.sourcePage === 'string' && body.sourcePage.startsWith('/en') ? 'en' : 'nl'
  const time = typeof body?.time === 'string' ? body.time : undefined

  const blockedDate = ['preferredDate', 'preferredDate2']
    .map((key) => body?.[key])
    .find((value): value is string => typeof value === 'string' && value.length > 0 && isBlockedBookingSlot(value, time))

  if (blockedDate) {
    return NextResponse.json({ success: false, error: 'blocked-date', message: BOOKING_BLOCKED_MESSAGE[lang] }, { status: 400 })
  }

  return handleEventSpaceLead(request)
}
