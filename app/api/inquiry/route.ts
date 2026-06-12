import { NextResponse } from 'next/server'
import { createLead } from '@/lib/admin/store'

function normalizeType(type: string) {
  if (type === 'event-space' || type === 'event_space' || type === 'eventSpace') return 'event-space'
  if (type === 'workshop') return 'workshop'
  if (type === 'job') return 'job'
  return 'contact'
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))

  if (body.website) return NextResponse.json({ ok: false }, { status: 400 })
  if (!body.name || !body.email) {
    return NextResponse.json({ ok: false, error: 'Name and email are required.' }, { status: 400 })
  }

  try {
    const lead = await createLead({
      type: normalizeType(String(body.type || 'contact')),
      name: String(body.name),
      email: String(body.email),
      phone: body.phone ? String(body.phone) : undefined,
      message: body.message ? String(body.message) : '',
      sourcePage: body.sourcePage ? String(body.sourcePage) : '',
      payload: body,
    })

    return NextResponse.json({ ok: true, id: lead.id })
  } catch (error) {
    console.error('[inquiry] save failed', error)
    return NextResponse.json({ ok: false, error: 'Could not save inquiry.' }, { status: 500 })
  }
}
