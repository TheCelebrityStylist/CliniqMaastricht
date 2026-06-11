import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { createLead } from '@/lib/admin/store'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(5).max(3000),
  website: z.string().optional(),
  sourcePage: z.string().optional(),
}).passthrough()

export async function POST(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const [{ type }, body] = await Promise.all([params, request.json().catch(() => ({}))])
  const parsed = schema.safeParse(body)
  if (!parsed.success || parsed.data.website) return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  const data = parsed.data
  const leadType = type === 'event-space' || type === 'event_space' || type === 'eventSpace' ? 'event_space' : type === 'workshop' || type === 'job' ? type : 'contact'

  try {
    const lead = await createLead({ type: leadType, name: data.name, email: data.email, phone: data.phone, message: data.message, sourcePage: data.sourcePage || '', payload: { type: leadType, ...data } })
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: process.env.FORM_FROM_EMAIL || 'Cliniq Website <onboarding@resend.dev>',
          to: process.env.FORM_NOTIFICATION_EMAIL || process.env.FORM_TO_EMAIL || 'contact@cafecliniq.com',
          subject: `Nieuwe ${leadType} aanvraag van ${data.name}`,
          replyTo: data.email,
          text: Object.entries({ type: leadType, ...data }).map(([key, value]) => `${key}: ${String(value)}`).join('\n'),
        })
      } catch (error) {
        console.error('Lead was saved in Postgres, but email notification failed.', error)
      }
    }
    return NextResponse.json({ ok: true, id: lead.id })
  } catch (error) {
    console.error('[admin-lead] save failed', error)
    return NextResponse.json({ error: 'Could not save submission. Please try again.' }, { status: 500 })
  }
}
