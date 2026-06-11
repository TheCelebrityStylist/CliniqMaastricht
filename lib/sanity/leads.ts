import { sanityWriteClient, hasSanityConfig } from './client'

export type SanityLeadType = 'contact' | 'workshop' | 'eventSpace' | 'job'

export function normalizeLeadType(input: string): SanityLeadType {
  if (input === 'event-space' || input === 'event_space' || input === 'eventSpace') return 'eventSpace'
  if (input === 'workshop' || input === 'job') return input
  return 'contact'
}

export async function createSanityLead(input: { type: string; name: string; email: string; phone?: string; message?: string; sourcePage?: string; payload: Record<string, unknown> }) {
  if (!hasSanityConfig()) throw new Error('Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.')
  if (!process.env.SANITY_API_WRITE_TOKEN) throw new Error('SANITY_API_WRITE_TOKEN is not configured.')
  const submittedAt = new Date().toISOString()
  const doc = {
    _type: 'lead',
    type: normalizeLeadType(input.type),
    status: 'new',
    name: input.name,
    email: input.email,
    phone: input.phone || '',
    message: input.message || '',
    sourcePage: input.sourcePage || '',
    submittedAt,
    payload: JSON.stringify(input.payload || {}, null, 2),
  }
  return sanityWriteClient.create(doc)
}
