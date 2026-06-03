import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { createClient } from '@sanity/client'

const schema = z.object({
  type: z.enum(['contact', 'workshop', 'event-space', 'job']),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(5).max(3000),
  website: z.string().optional(),
}).passthrough()

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-06-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
})

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success || parsed.data.website) return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  const data = parsed.data

  if (process.env.SANITY_API_WRITE_TOKEN && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    await writeClient.create({ _type: 'formSubmission', formType: data.type, name: data.name, email: data.email, phone: data.phone, message: data.message, payloadJson: JSON.stringify(data), createdAt: new Date().toISOString() })
  }

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: process.env.FORM_FROM_EMAIL || 'Cliniq Website <onboarding@resend.dev>',
      to: process.env.FORM_TO_EMAIL || 'contact@cafecliniq.com',
      subject: `Nieuwe ${data.type} aanvraag van ${data.name}`,
      replyTo: data.email,
      text: Object.entries(data).map(([key, value]) => `${key}: ${String(value)}`).join('\n'),
    })
  }

  return NextResponse.json({ ok: true })
}
