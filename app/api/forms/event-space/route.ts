import { NextResponse } from 'next/server'
import { createLead } from '@/lib/admin/store'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))

  if (body.website) return NextResponse.json({ success: false }, { status: 400 })
  if (!body.name || !body.email) {
    return NextResponse.json({ success: false, error: 'Name and email are required.' }, { status: 400 })
  }

  try {
    const lead = await createLead({
      type: 'event-space',
      name: String(body.name),
      email: String(body.email),
      phone: body.phone ? String(body.phone) : undefined,
      message: body.message ? String(body.message) : '',
      sourcePage: body.sourcePage ? String(body.sourcePage) : '/event-space',
      payload: body,
    })

    return NextResponse.json({ success: true, id: lead.id })
  } catch (error) {
    console.error('[form-event-space] save failed', error)
    return NextResponse.json({ success: false, error: 'Could not save event-space request.' }, { status: 500 })
  }
}
