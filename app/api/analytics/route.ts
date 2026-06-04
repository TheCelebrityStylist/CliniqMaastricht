import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const client = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder', dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production', apiVersion: '2024-06-01', token: process.env.SANITY_API_WRITE_TOKEN, useCdn: false })

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { eventName?: string; path?: string; label?: string } | null
  if (!body?.eventName) return NextResponse.json({ ok: false }, { status: 400 })
  if (process.env.SANITY_API_WRITE_TOKEN && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    await client.create({ _type: 'analyticsEvent', eventName: body.eventName, path: body.path, label: body.label, createdAt: new Date().toISOString() })
  }
  return NextResponse.json({ ok: true })
}
