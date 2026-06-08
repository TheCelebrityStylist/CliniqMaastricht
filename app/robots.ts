import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/studio/', '/_next/'],
      },
    ],
    sitemap: 'https://www.cliniqmaastricht.nl/sitemap.xml',
    host: 'https://www.cliniqmaastricht.nl',
  }
}
