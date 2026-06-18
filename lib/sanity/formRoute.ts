import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createSanityLead } from './leads'
import type { SanityLeadType } from './types'

const formSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
  website: z.string().optional(),
  sourcePage: z.string().optional(),
}).passthrough()

export function createLeadRoute(type: SanityLeadType) {
  return async function POST(request: Request) {
    const body = await request.json().catch(() => ({}))
    const parsed = formSchema.safeParse(body)

    if (!parsed.success || parsed.data.website) {
      return NextResponse.json({ success: false, error: 'Invalid submission' }, { status: 400 })
    }

    const data = parsed.data

    try {
      await createSanityLead({
        type,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message || '',
        sourcePage: data.sourcePage || '',
        payload: { ...body, type },
      })

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error(`[sanity-form-${type}] save failed`, error)

      const message =
        error instanceof Error && error.message === 'Form backend not configured'
          ? 'Form backend not configured'
          : 'Could not save form submission'

      return NextResponse.json({ success: false, error: message }, { status: 500 })
    }
  }
}
