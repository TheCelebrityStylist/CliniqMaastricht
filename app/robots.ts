import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/studio/', '/admin/', '/_next/'] },
      { userAgent: 'Googlebot', allow: '/', disallow: ['/api/', '/studio/', '/admin/'] },
    ],
    sitemap: 'https://www.cliniqmaastricht.nl/sitemap.xml',
    host: 'https://www.cliniqmaastricht.nl',
  }
}
