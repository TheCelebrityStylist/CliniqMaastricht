import type { MetadataRoute } from 'next'
import { getAgendaEvents } from '@/lib/admin/public'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://www.cliniqmaastricht.nl'
  const now = new Date()
  const events = await getAgendaEvents()

  // Only featured events get a real detail page (see the redirect guard on the [slug] routes),
  // so only those 5 belong in the sitemap. lastModified uses each event's own date rather than
  // `now` for every entry - a truthful per-page signal instead of a blanket "changed today".
  const eventEntries = events.filter((event) => event.featured).flatMap((event) => {
    const slug = event.slug?.current || event._id
    const eventDate = new Date(`${event.date}T00:00:00`)
    const lastModified = Number.isNaN(eventDate.getTime()) ? now : eventDate
    return [
      { url: `${base}/uitgaan/${slug}`, lastModified, changeFrequency: 'weekly' as const, priority: 0.7 },
      { url: `${base}/en/nightlife/${slug}`, lastModified, changeFrequency: 'weekly' as const, priority: 0.6 },
    ]
  })

  return [
    { url: base,                                        lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/uitgaan`,                           lastModified: now, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${base}/cocktail-workshop`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.92 },
    { url: `${base}/nachtclub-maastricht`,              lastModified: now, changeFrequency: 'monthly', priority: 0.90 },
    { url: `${base}/discotheek-maastricht`,             lastModified: now, changeFrequency: 'monthly', priority: 0.90 },
    { url: `${base}/event-space`,                       lastModified: now, changeFrequency: 'monthly', priority: 0.88 },
    { url: `${base}/feest`,                             lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${base}/vrijgezellenavond`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/bedrijfsfeest`,                     lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/studentenavond`,                    lastModified: now, changeFrequency: 'monthly', priority: 0.82 },
    { url: `${base}/privefeest`,                        lastModified: now, changeFrequency: 'monthly', priority: 0.78 },
    { url: `${base}/fotos`,                             lastModified: now, changeFrequency: 'weekly',  priority: 0.65 },
    { url: `${base}/contact`,                           lastModified: now, changeFrequency: 'monthly', priority: 0.60 },
    { url: `${base}/vacatures`,                         lastModified: now, changeFrequency: 'monthly', priority: 0.45 },
    { url: `${base}/house-rules`,                       lastModified: now, changeFrequency: 'yearly',  priority: 0.25 },
    { url: `${base}/en`,                                lastModified: now, changeFrequency: 'weekly',  priority: 0.90 },
    { url: `${base}/en/nightlife`,                      lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${base}/en/cocktail-workshop`,              lastModified: now, changeFrequency: 'monthly', priority: 0.78 },
    { url: `${base}/en/event-space`,                    lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${base}/en/party`,                          lastModified: now, changeFrequency: 'monthly', priority: 0.70 },
    ...eventEntries,
  ]
}
