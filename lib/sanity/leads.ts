import { hasSanityConfig, sanityWriteClient } from './client'
import type { SanityLeadDocument, SanityLeadInput, SanityLeadType } from './types'

export function normalizeLeadType(input: string): SanityLeadType {
  if (input === 'event-space' || input === 'event_space' || input === 'eventSpace') return 'eventSpace'
  if (input === 'workshop' || input === 'job') return input
  return 'contact'
}

export async function createSanityLead(input: SanityLeadInput) {
  if (!hasSanityConfig() || !process.env.SANITY_API_WRITE_TOKEN) throw new Error('Form backend not configured')

  const submittedAt = new Date().toISOString()
  const doc: SanityLeadDocument = {
    _type: 'lead',
    type: normalizeLeadType(input.type),
    status: 'new',
    name: input.name,
    email: input.email,
    phone: input.phone || '',
    message: input.message || '',
    sourcePage: input.sourcePage || '',
    submittedAt,
    payload: input.payload || {},
    internalNotes: '',
  }

  return sanityWriteClient.create(doc)
}
