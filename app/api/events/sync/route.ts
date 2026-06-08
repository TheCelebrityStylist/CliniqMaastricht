import { NextResponse } from 'next/server'
import { fetchEventsFromSheet } from '@/lib/google/eventsFromSheet'

export const revalidate = 600

export async function GET() {
  const result = await fetchEventsFromSheet()
  return NextResponse.json({ syncedAt: result.syncedAt, count: result.count, skipped: result.skipped, rowCount: result.rowCount, events: result.events })
}
