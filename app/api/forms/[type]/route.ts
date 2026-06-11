import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { createSanityLead, normalizeLeadType } from '@/lib/sanity/leads'

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
  const leadType = normalizeLeadType(type)

  try {
    const lead = await createSanityLead({ type: leadType, name: data.name, email: data.email, phone: data.phone, message: data.message, sourcePage: data.sourcePage || '', payload: { type: leadType, ...data } })
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
        console.error('Lead was saved in Sanity, but email notification failed.', error)
      }
    }
    return NextResponse.json({ ok: true, id: lead._id })
  } catch (error) {
    console.error('[sanity-lead] save failed', error)
    return NextResponse.json({ error: 'Could not save submission. Please try again.' }, { status: 500 })
  }
}
