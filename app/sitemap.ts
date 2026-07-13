import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.cliniqmaastricht.nl'
  const now = new Date()

  return [
    { url: base,                                        lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/uitgaan`,                           lastModified: now, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${base}/cocktail-workshop`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.92 },
    { url: `${base}/nachtclub-maastricht`,              lastModified: now, changeFrequency: 'monthly', priority: 0.90 },
    { url: `${base}/discotheek-maastricht`,             lastModified: now, changeFrequency: 'monthly', priority: 0.90 },
    { url: `${base}/event-space`,                       lastModified: now, changeFrequency: 'monthly', priority: 0.88 },
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
  ]
}
