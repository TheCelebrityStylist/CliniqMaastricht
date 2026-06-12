import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createSanityLead } from '@/lib/sanity/leads'

const schema = z.object({
  type: z.enum(['contact', 'workshop', 'event-space', 'event_space', 'eventSpace', 'job']),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(5).max(3000),
  website: z.string().optional(),
  sourcePage: z.string().optional(),
}).passthrough()

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success || parsed.data.website) return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  const data = parsed.data

  try {
    const lead = await createSanityLead({ type: data.type, name: data.name, email: data.email, phone: data.phone, message: data.message, sourcePage: data.sourcePage || '', payload: data })
    return NextResponse.json({ ok: true, id: 'sanity-lead' })
  } catch (error) {
    console.error('[sanity-lead] save failed', error)
    const message = error instanceof Error && error.message === 'Form backend not configured' ? error.message : 'Could not save submission. Please try again.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
