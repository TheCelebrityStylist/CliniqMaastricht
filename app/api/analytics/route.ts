import { NextResponse } from 'next/server'
import { readStore, writeStore } from '@/lib/admin/store'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const store = await readStore()
  store.analytics.unshift({ id: `analytics-${Date.now()}`, type: String(body.type || body.eventName || 'click'), path: String(body.path || ''), label: String(body.label || ''), createdAt: new Date().toISOString() })
  await writeStore(store)
  return NextResponse.json({ ok: true })
}
