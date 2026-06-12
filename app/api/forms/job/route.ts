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
      type: 'job',
      name: String(body.name),
      email: String(body.email),
      phone: body.phone ? String(body.phone) : undefined,
      message: body.message ? String(body.message) : '',
      sourcePage: body.sourcePage ? String(body.sourcePage) : '/vacatures',
      payload: body,
    })

    return NextResponse.json({ success: true, id: lead.id })
  } catch (error) {
    console.error('[form-job] save failed', error)
    return NextResponse.json({ success: false, error: 'Could not save job application.' }, { status: 500 })
  }
}
