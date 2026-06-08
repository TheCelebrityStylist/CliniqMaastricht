import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { fetchEventsFromSheet } from '@/lib/google/eventsFromSheet'

export async function POST() {
  revalidateTag('google-events')
  const result = await fetchEventsFromSheet()
  return NextResponse.json({ syncedAt: result.syncedAt, count: result.count, skipped: result.skipped, rowCount: result.rowCount, events: result.events })
}

export async function GET() {
  return POST()
}
