import type { MetadataRoute } from 'next'
import { localizedPaths } from '@/lib/i18n'
import { site } from '@/lib/site'
import { getAgendaEvents, getPhotoAlbums } from '@/lib/admin/public'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticPages = Object.values(localizedPaths).flatMap((paths) => [paths.nl, paths.en]).map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: path.includes('uitgaan') || path.includes('nightlife') ? 'daily' as const : 'weekly' as const,
    priority: path === '/' || path === '/en' ? 1 : 0.85,
  }))
  const campaignPages = ['/vrijgezellenavond', '/bedrijfsfeest', '/privefeest'].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
  const [events, albums] = await Promise.all([getAgendaEvents(), getPhotoAlbums()])
  const eventPages = events.filter((event) => event.slug?.current).flatMap((event) => [
    { url: `${site.url}/uitgaan/${event.slug!.current}`, lastModified: new Date(event.date), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${site.url}/en/nightlife/${event.slug!.current}`, lastModified: new Date(event.date), changeFrequency: 'weekly' as const, priority: 0.7 },
  ])
  const albumPages = albums.flatMap((album) => [
    { url: `${site.url}/fotos/${album.slug}`, lastModified: new Date(album.date), changeFrequency: 'weekly' as const, priority: 0.65 },
    { url: `${site.url}/en/photos/${album.slug}`, lastModified: new Date(album.date), changeFrequency: 'weekly' as const, priority: 0.65 },
  ])
  return [...staticPages, ...campaignPages, ...eventPages, ...albumPages]
}
