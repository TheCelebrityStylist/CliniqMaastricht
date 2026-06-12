export type SanityLeadType = 'contact' | 'workshop' | 'eventSpace' | 'job'
export type SanityLeadStatus = 'new' | 'contacted' | 'handled'

export type SanityLeadInput = {
  type: string
  name: string
  email: string
  phone?: string
  message?: string
  sourcePage: string
  payload: Record<string, unknown>
}

export type SanityLeadDocument = {
  _type: 'lead'
  type: SanityLeadType
  status: SanityLeadStatus
  name: string
  email: string
  phone?: string
  message?: string
  sourcePage: string
  submittedAt: string
  payload: Record<string, unknown>
}
