import type { MetadataRoute } from 'next'
import { pages, site } from '@/lib/site'
import { getAgendaEvents } from '@/lib/sanity/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticPages = pages.map((page) => ({ url: `${site.url}${page.path}`, lastModified: now, changeFrequency: page.path === '/uitgaan' ? 'daily' as const : 'weekly' as const, priority: page.path === '/' ? 1 : 0.85 }))
  const events = await getAgendaEvents()
  const eventPages = events.filter((event) => event.slug?.current).map((event) => ({ url: `${site.url}/uitgaan/${event.slug!.current}`, lastModified: new Date(event.date), changeFrequency: 'weekly' as const, priority: 0.7 }))
  return [...staticPages, ...eventPages]
}
