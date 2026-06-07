import type { Metadata } from 'next'
import { localizedPaths, type Lang } from './i18n'
import { site } from './site'

function alternatesFor(path: string) {
  const match = Object.values(localizedPaths).find((paths) => paths.nl === path || paths.en === path)
  if (!match) return undefined
  return { 'nl-NL': `${site.url}${match.nl}`, 'en': `${site.url}${match.en}`, 'x-default': `${site.url}${match.nl}` }
}

export function metadata(title: string, description: string, path = '/', lang: Lang = 'nl', socialImage?: string): Metadata {
  const url = `${site.url}${path}`
  const languages = alternatesFor(path)
  return {
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: { title, description, url, siteName: site.name, locale: lang === 'nl' ? 'nl_NL' : 'en_US', type: 'website', images: socialImage ? [{ url: socialImage }] : undefined },
    twitter: { card: 'summary_large_image', title, description, images: socialImage ? [socialImage] : undefined },
  }
}

export function organizationSchema() {
  return { '@context': 'https://schema.org', '@type': 'Organization', name: site.name, url: site.url, logo: `${site.url}/icon.png`, sameAs: [site.instagram, site.tiktok], contactPoint: { '@type': 'ContactPoint', telephone: site.phone, email: site.email, contactType: 'customer service' } }
}

export function localBusinessSchema() {
  return { '@context': 'https://schema.org', '@type': ['NightClub', 'EventVenue'], name: site.name, url: site.url, telephone: site.phone, email: site.email, address: { '@type': 'PostalAddress', streetAddress: site.address.street, postalCode: site.address.postalCode, addressLocality: site.address.city, addressCountry: site.address.country }, sameAs: [site.instagram, site.tiktok], priceRange: '€€', openingHoursSpecification: site.hours.map((h) => ({ '@type': 'OpeningHoursSpecification', description: h })) }
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) }
}
