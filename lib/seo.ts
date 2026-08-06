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
  return {
    '@context': 'https://schema.org',
    '@type': ['NightClub', 'EventVenue', 'LocalBusiness'],
    '@id': 'https://www.cliniqmaastricht.nl/#business',
    name: 'Cliniq Maastricht',
    alternateName: ['CLINIQ', 'Cafe Cliniq', 'Club Cliniq Maastricht'],
    url: 'https://www.cliniqmaastricht.nl',
    telephone: '+31612530987',
    email: 'contact@cafecliniq.com',
    description: 'Uitgaan in Maastricht? CLINIQ is dé nachtclub op de Platielstraat 9A. Open elke donderdag, vrijdag en zaterdag. Clubavonden met wisselende DJ\'s, cocktail workshops en ruimte voor besloten feesten en bedrijfsfeesten.',
    image: [
      'https://www.cliniqmaastricht.nl/og-image.jpg',
    ],
    logo: 'https://www.cliniqmaastricht.nl/icon.png',
    hasMap: 'https://maps.google.com/?q=Platielstraat+9A,+6211+GV+Maastricht',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Platielstraat 9A',
      addressLocality: 'Maastricht',
      addressRegion: 'Limburg',
      postalCode: '6211 GV',
      addressCountry: 'NL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 50.8489,
      longitude: 5.7025,
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '22:00', closes: '02:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '22:00', closes: '03:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '22:00', closes: '03:00' },
    ],
    sameAs: [
      'https://www.instagram.com/cliniqmaastricht',
      'https://www.tiktok.com/@cliniqmaastricht',
      'https://www.facebook.com/cliniqmaastricht',
    ],
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Credit Card, Debit Card',
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Dancefloor', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'DJ', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Bar', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Private Events', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Cocktail Workshop', value: true },
    ],
    areaServed: [
      { '@type': 'City', name: 'Maastricht' },
      { '@type': 'State', name: 'Limburg' },
    ],
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function cocktailWorkshopSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': 'https://www.cliniqmaastricht.nl/cocktail-workshop#service',
    name: 'Cocktail Workshop Maastricht',
    description: 'Cocktail workshop in Maastricht bij CLINIQ. Leer cocktails maken met je groep, begeleid door onze bartenders. Vanaf 15 personen, €15 per cocktail. Ideaal voor vrijgezellenfeesten, bedrijfsuitjes en vriendinnengroepen.',
    provider: {
      '@type': 'LocalBusiness',
      '@id': 'https://www.cliniqmaastricht.nl/#business',
    },
    areaServed: { '@type': 'City', name: 'Maastricht' },
    serviceType: 'Cocktail Workshop',
    offers: {
      '@type': 'Offer',
      price: '15',
      priceCurrency: 'EUR',
      description: '€15 per cocktail, minimaal 3 per persoon. Groepen vanaf 15 personen.',
    },
    url: 'https://www.cliniqmaastricht.nl/cocktail-workshop',
  }
}


export function eventVenueSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EventVenue',
    '@id': 'https://www.cliniqmaastricht.nl/event-space#venue',
    name: 'Cliniq Maastricht — Eventlocatie',
    url: 'https://www.cliniqmaastricht.nl/event-space',
    description: 'Exclusieve eventlocatie in het centrum van Maastricht met bar, licht, geluid en dansvloer voor tot 400 gasten.',
    image: ['https://www.cliniqmaastricht.nl/og-image.jpg'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: 'Limburg',
      postalCode: site.address.postalCode,
      addressCountry: 'NL',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 50.8489, longitude: 5.7025 },
    maximumAttendeeCapacity: 400,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Bar', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Dancefloor', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Sound system', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Lighting rig', value: true },
    ],
    containedInPlace: { '@id': 'https://www.cliniqmaastricht.nl/#business' },
  }
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) }
}
