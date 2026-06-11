import { createSanityDocument } from './client'
import type { SanityLeadDocument, SanityLeadInput, SanityLeadType } from './types'

export function normalizeLeadType(input: string): SanityLeadType {
  if (input === 'event-space' || input === 'event_space' || input === 'eventSpace') return 'eventSpace'
  if (input === 'workshop' || input === 'job') return input
  return 'contact'
}

export async function createSanityLead(input: SanityLeadInput) {
  const doc: SanityLeadDocument = {
    _type: 'lead',
    type: normalizeLeadType(input.type),
    status: 'new',
    name: input.name,
    email: input.email,
    phone: input.phone || undefined,
    message: input.message || undefined,
    sourcePage: input.sourcePage,
    submittedAt: new Date().toISOString(),
    payload: input.payload,
  }

  return createSanityDocument(doc)
}
