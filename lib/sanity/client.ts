import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const sanityConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-06-01',
  useCdn: true,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: 'published',
})

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: unknown) {
  return builder.image(source as never)
}

export type AgendaEvent = {
  _id: string
  title: string
  slug?: { current: string }
  date: string
  startTime?: string
  endTime?: string
  ageLimit?: string
  shortDescription?: string
  fullDescription?: string
  ticketUrl?: string
  featured?: boolean
  recurring?: string
  imageUrl?: string
  imageAlt?: string
}

export type Faq = { question: string; answer: string }
export type Job = { _id: string; title: string; type?: string; description?: string; requirements?: string[]; published?: boolean }
export type Artist = { _id: string; name: string; bio?: string; role?: string; imageUrl?: string; instagram?: string; soundcloud?: string }
export type PageContent = Record<string, unknown> & { faqs?: Faq[]; images?: { url: string; alt?: string }[] }

const fallbackEvents: AgendaEvent[] = [
  { _id: 'fallback-1', title: 'Friday Club Night', date: new Date(Date.now() + 1000*60*60*24*9).toISOString().slice(0,10), startTime: '22:00', endTime: '03:00', ageLimit: '21+', shortDescription: 'Premium clubnacht met house, hits en signature cocktails.', featured: true },
  { _id: 'fallback-2', title: 'Saturday Social', date: new Date(Date.now() + 1000*60*60*24*17).toISOString().slice(0,10), startTime: '22:00', endTime: '03:00', ageLimit: '21+', shortDescription: 'Een stijlvolle zaterdagavond in hartje Maastricht.', featured: false },
]

export async function getAgendaEvents(includePast = false): Promise<AgendaEvent[]> {
  if (!sanityConfigured) return fallbackEvents
  const today = new Date().toISOString().slice(0, 10)
  const filter = includePast ? '' : '&& date >= $today'
  const query = `*[_type == "agendaEvent" && status == "published" ${filter}] | order(date asc, startTime asc) { _id, title, slug, date, startTime, endTime, ageLimit, shortDescription, fullDescription, ticketUrl, featured, recurring, "imageUrl": poster.asset->url, "imageAlt": poster.alt }`
  return sanityClient.fetch(query, { today }, { next: { revalidate: 300 } })
}

export async function getJobs(): Promise<Job[]> {
  if (!sanityConfigured) return [{ _id: 'open', title: 'Open sollicitatie', type: 'Parttime', description: 'Wij zoeken hospitality talent voor bar, floor en events.', requirements: ['Gastvrij', 'Beschikbaar in avonden/weekenden', 'Teamspeler'], published: true }]
  return sanityClient.fetch(`*[_type == "job" && published == true] | order(title asc) { _id, title, type, description, requirements, published }`, {}, { next: { revalidate: 600 } })
}

export async function getArtists(): Promise<Artist[]> {
  if (!sanityConfigured) return [{ _id: 'resident', name: 'Cliniq Residents', role: 'Resident DJs', bio: 'Onze residents bouwen avonden met warm-up finesse, herkenbare energie en Maastricht nightlife gevoel.' }]
  return sanityClient.fetch(`*[_type == "artist" && published == true] | order(name asc) { _id, name, role, bio, instagram, soundcloud, "imageUrl": photo.asset->url }`, {}, { next: { revalidate: 600 } })
}

export async function getPageContent(slug: string): Promise<PageContent | null> {
  if (!sanityConfigured) return null
  return sanityClient.fetch(`*[_type == "pageContent" && slug.current == $slug][0]`, { slug }, { next: { revalidate: 600 } })
}


export async function getAgendaEventBySlug(slug: string): Promise<AgendaEvent | null> {
  if (!sanityConfigured) return fallbackEvents.find((event) => event.slug?.current === slug) || null
  return sanityClient.fetch(`*[_type == "agendaEvent" && status == "published" && slug.current == $slug][0] { _id, title, slug, date, startTime, endTime, ageLimit, shortDescription, fullDescription, ticketUrl, featured, recurring, "imageUrl": poster.asset->url, "imageAlt": poster.alt }`, { slug }, { next: { revalidate: 300 } })
}
