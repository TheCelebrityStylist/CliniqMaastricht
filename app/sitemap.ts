import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.cliniqmaastricht.nl'
  const now = new Date()

  return [
    // Core pages — weekly crawl
    { url: base,                              lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/uitgaan`,                 lastModified: now, changeFrequency: 'weekly',  priority: 0.95 },

    // Commercial pages — monthly
    { url: `${base}/cocktail-workshop`,       lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${base}/event-space`,             lastModified: now, changeFrequency: 'monthly', priority: 0.85 },

    // Campaign landing pages — monthly
    { url: `${base}/vrijgezellenavond`,       lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${base}/bedrijfsfeest`,           lastModified: now, changeFrequency: 'monthly', priority: 0.80 },
    { url: `${base}/privefeest`,              lastModified: now, changeFrequency: 'monthly', priority: 0.75 },

    // Supporting pages
    { url: `${base}/fotos`,                   lastModified: now, changeFrequency: 'weekly',  priority: 0.65 },
    { url: `${base}/contact`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.60 },
    { url: `${base}/vacatures`,               lastModified: now, changeFrequency: 'monthly', priority: 0.45 },
    { url: `${base}/house-rules`,             lastModified: now, changeFrequency: 'yearly',  priority: 0.25 },
  ]
}
