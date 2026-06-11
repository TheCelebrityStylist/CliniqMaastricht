export type SanityLeadType = 'contact' | 'workshop' | 'eventSpace' | 'job'
export type SanityLeadStatus = 'new' | 'contacted' | 'handled'

export type SanityLeadInput = {
  type: string
  name: string
  email: string
  phone?: string
  message?: string
  sourcePage?: string
  payload?: Record<string, unknown>
}

export type SanityLeadDocument = {
  _type: 'lead'
  type: SanityLeadType
  status: SanityLeadStatus
  name: string
  email: string
  phone?: string
  message?: string
  sourcePage?: string
  submittedAt: string
  payload?: Record<string, unknown>
  internalNotes?: string
}

export type SanityImageRef = {
  _type: 'image'
  asset?: { _ref?: string; _type?: 'reference' }
  altNl?: string
  altEn?: string
}

export type SanityPageKey = 'homepage' | 'uitgaan' | 'cocktailWorkshop' | 'eventSpace' | 'contact' | 'vacatures' | 'houseRules' | 'fotos'
