import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET   || 'production',
  apiVersion: '2024-01-01',
  useCdn:    true,
  stega:     { enabled: false },
})

export async function getAgendaEvents() {
  try {
    return await sanityClient.fetch<AgendaEvent[]>(
      `*[_type == "agendaEvent" && is_visible == true] | order(date asc) { _id, dj, date, day, time, age, description, special }`,
      {},
      { next: { revalidate: 1800 } }
    )
  } catch {
    return []
  }
}

export interface AgendaEvent {
  _id:         string
  dj:          string
  date:        string   // DD-MM-YYYY
  day:         string
  time:        string
  age:         string
  description?: string
  special?:    string
}
