import type { Metadata } from 'next'
import { site } from './site'

export function metadata(title: string, description: string, path = '/'): Metadata {
  const url = `${site.url}${path}`
  return {
    title, description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: site.name, locale: 'nl_NL', type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export function localBusinessSchema() {
  return { '@context': 'https://schema.org', '@type': ['NightClub', 'BarOrPub', 'EventVenue'], name: site.name, url: site.url, telephone: site.phone, email: site.email, address: { '@type': 'PostalAddress', streetAddress: site.address.street, postalCode: site.address.postalCode, addressLocality: site.address.city, addressCountry: site.address.country }, sameAs: [site.instagram, site.tiktok], priceRange: '€€', openingHoursSpecification: site.hours.map((h) => ({ '@type': 'OpeningHoursSpecification', description: h })) }
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) }
}
