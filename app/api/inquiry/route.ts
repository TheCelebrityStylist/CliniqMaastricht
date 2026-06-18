import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createSanityLead } from '@/lib/sanity/leads'

const schema = z.object({
  type: z.string().optional(),
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
  website: z.string().optional(),
  sourcePage: z.string().optional(),
}).passthrough()

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const parsed = schema.safeParse(body)

  if (!parsed.success || parsed.data.website) {
    return NextResponse.json({ ok: false, error: 'Invalid submission' }, { status: 400 })
  }

  const data = parsed.data

  try {
    await createSanityLead({
      type: data.type || 'contact',
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message || '',
      sourcePage: data.sourcePage || '',
      payload: body,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[sanity-inquiry] save failed', error)
    return NextResponse.json({ ok: false, error: 'Could not save inquiry' }, { status: 500 })
  }
}
