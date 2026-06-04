import type { MetadataRoute } from 'next'
import { localizedPaths } from '@/lib/i18n'
import { site } from '@/lib/site'
import { getAgendaEvents } from '@/lib/sanity/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticPages = Object.values(localizedPaths).flatMap((paths) => [paths.nl, paths.en]).map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: path.includes('uitgaan') || path.includes('nightlife') ? 'daily' as const : 'weekly' as const,
    priority: path === '/' || path === '/en' ? 1 : 0.85,
  }))
  const events = await getAgendaEvents()
  const eventPages = events.filter((event) => event.slug?.current).flatMap((event) => [
    { url: `${site.url}/uitgaan/${event.slug!.current}`, lastModified: new Date(event.date), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${site.url}/en/nightlife/${event.slug!.current}`, lastModified: new Date(event.date), changeFrequency: 'weekly' as const, priority: 0.7 },
  ])
  return [...staticPages, ...eventPages]
}
