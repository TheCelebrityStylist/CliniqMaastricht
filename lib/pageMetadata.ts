import type { Metadata } from 'next'
import type { Lang } from '@/lib/admin/types'
import { getSeoSettings } from '@/lib/admin/public'
import { images } from '@/lib/site'

type FallbackMetadata = {
  title: string
  description: string
  path: string
  image?: string
}

type SeoSettings = {
  pageKey?: string
  language?: Lang
  seoTitle?: string
  metaDescription?: string
  canonicalUrl?: string
  socialImageUrl?: string
  ogTitle?: string
  ogDescription?: string
}

const siteUrl = 'https://www.cliniqmaastricht.nl'

const fallbackByPage: Record<string, Record<Lang, FallbackMetadata>> = {
  home: {
    nl: {
      title: 'CLINIQ Maastricht | Nights, events & workshops',
      description: 'CLINIQ Maastricht aan de Platielstraat voor uitgaan, events, cocktail workshops en private events.',
      path: '/',
    },
    en: {
      title: 'CLINIQ Maastricht | Nights, events & workshops',
      description: 'CLINIQ Maastricht on Platielstraat for nightlife, events, cocktail workshops and private events.',
      path: '/',
    },
  },
  nightlife: {
    nl: {
      title: 'Uitgaan in Maastricht? Dit is Cliniq — Club & Cocktails aan de Platielstraat',
      description: 'Uitgaan in Maastricht? Cliniq is open do, vr & za tot 03:00 aan de Platielstraat 9A. DJ\'s, cocktails en een dansvloer die niet leegloopt. Check nu de agenda van deze week.',
      path: '/uitgaan',
      image: images.redCrowd,
    },
    en: {
      title: 'Nightlife in Maastricht? This is Cliniq — Club & Cocktails on Platielstraat',
      description: 'Going out in Maastricht? Cliniq is open Thu, Fri & Sat until 03:00 on Platielstraat 9A. DJ\'s, cocktails and a dancefloor that stays full. Check this week\'s agenda.',
      path: '/en/nightlife',
      image: images.redCrowd,
    },
  },
  uitgaan: {
    nl: {
      title: 'Uitgaan in Maastricht? Dit is Cliniq — Club & Cocktails aan de Platielstraat',
      description: 'Uitgaan in Maastricht? Cliniq is open do, vr & za tot 03:00 aan de Platielstraat 9A. DJ\'s, cocktails en een dansvloer die niet leegloopt. Check nu de agenda van deze week.',
      path: '/uitgaan',
      image: images.redCrowd,
    },
    en: {
      title: 'Nightlife in Maastricht? This is Cliniq — Club & Cocktails on Platielstraat',
      description: 'Going out in Maastricht? Cliniq is open Thu, Fri & Sat until 03:00 on Platielstraat 9A. DJ\'s, cocktails and a dancefloor that stays full. Check this week\'s agenda.',
      path: '/en/nightlife',
      image: images.redCrowd,
    },
  },
  workshop: {
    nl: {
      title: 'Cocktail Workshop Maastricht | Cliniq — Boek nu vanaf €15',
      description: 'Cocktail workshop Maastricht voor een vrijgezellenfeest, bedrijfsuitje of verjaardag. 2 uur cocktails maken bij Cliniq. €15 per cocktail, min. 3 p.p. Groepen v.a. 15 personen. Boek direct.',
      path: '/cocktail-workshop',
      image: images.workshopBar,
    },
    en: {
      title: 'Cocktail Workshop Maastricht | Cliniq — Book from €15',
      description: 'Cocktail workshop in Maastricht for a hen party, corporate outing or birthday. 2 hours of cocktail making at Cliniq. €15 per cocktail, min. 3 p.p. Groups from 15 people.',
      path: '/en/cocktail-workshop',
      image: images.workshopBar,
    },
  },
  'cocktail-workshop': {
    nl: {
      title: 'Cocktail Workshop Maastricht | Cliniq — Boek nu vanaf €15',
      description: 'Cocktail workshop Maastricht voor een vrijgezellenfeest, bedrijfsuitje of verjaardag. 2 uur cocktails maken bij Cliniq. €15 per cocktail, min. 3 p.p. Groepen v.a. 15 personen. Boek direct.',
      path: '/cocktail-workshop',
      image: images.workshopBar,
    },
    en: {
      title: 'Cocktail Workshop Maastricht | Cliniq — Book from €15',
      description: 'Cocktail workshop in Maastricht for a hen party, corporate outing or birthday. 2 hours of cocktail making at Cliniq. €15 per cocktail, min. 3 p.p. Groups from 15 people.',
      path: '/en/cocktail-workshop',
      image: images.workshopBar,
    },
  },
  eventSpace: {
    nl: {
      title: 'Eventlocatie Maastricht | Cliniq — Feestzaal Centrum, Tot 400 Personen',
      description: 'Eventlocatie in het centrum van Maastricht. Cliniq aan de Platielstraat 9A biedt exclusieve zaalverhuur tot 400 personen — voor bedrijfsfeesten, borrels, privéfeesten en vrijgezellenavonden.',
      path: '/event-space',
      image: images.redRoom,
    },
    en: {
      title: 'Hire an Event Location in Maastricht | Cliniq — Private Party Venue, Up to 400 Guests',
      description: 'Event location in central Maastricht. Cliniq on Platielstraat 9A offers exclusive private hire for up to 400 guests — for corporate events, drinks, private parties and hen nights.',
      path: '/en/event-space',
      image: images.redRoom,
    },
  },
  'event-space': {
    nl: {
      title: 'Eventlocatie Maastricht | Cliniq — Feestzaal Centrum, Tot 400 Personen',
      description: 'Eventlocatie in het centrum van Maastricht. Cliniq aan de Platielstraat 9A biedt exclusieve zaalverhuur tot 400 personen — voor bedrijfsfeesten, borrels, privéfeesten en vrijgezellenavonden.',
      path: '/event-space',
      image: images.redRoom,
    },
    en: {
      title: 'Event Location Maastricht | Cliniq — City Centre Venue, Up to 400 Guests',
      description: 'Event location in central Maastricht. Cliniq on Platielstraat 9A offers exclusive private hire for up to 400 guests — for corporate events, drinks, private parties and hen nights.',
      path: '/en/event-space',
      image: images.redRoom,
    },
  },
  contact: {
    nl: {
      title: 'Contact | CLINIQ Maastricht',
      description: 'Neem contact op met CLINIQ Maastricht voor reserveringen, events, workshops en vragen.',
      path: '/contact',
    },
    en: {
      title: 'Contact | CLINIQ Maastricht',
      description: 'Contact CLINIQ Maastricht for reservations, events, workshops and questions.',
      path: '/en/contact',
    },
  },
  fotos: {
    nl: {
      title: 'Foto’s | CLINIQ Maastricht',
      description: 'Bekijk fotoalbums van CLINIQ Maastricht.',
      path: '/fotos',
    },
    en: {
      title: 'Photos | CLINIQ Maastricht',
      description: 'View photo albums from CLINIQ Maastricht.',
      path: '/en/photos',
    },
  },
  jobs: {
    nl: {
      title: 'Vacatures | CLINIQ Maastricht',
      description: 'Bekijk vacatures en werken bij CLINIQ Maastricht.',
      path: '/vacatures',
    },
    en: {
      title: 'Jobs | CLINIQ Maastricht',
      description: 'View job openings and work at CLINIQ Maastricht.',
      path: '/en/jobs',
    },
  },
  vacatures: {
    nl: {
      title: 'Vacatures | CLINIQ Maastricht',
      description: 'Bekijk vacatures en werken bij CLINIQ Maastricht.',
      path: '/vacatures',
    },
    en: {
      title: 'Jobs | CLINIQ Maastricht',
      description: 'View job openings and work at CLINIQ Maastricht.',
      path: '/en/jobs',
    },
  },
  houseRules: {
    nl: {
      title: 'Huisregels | CLINIQ Maastricht',
      description: 'Lees de huisregels van CLINIQ Maastricht.',
      path: '/huisregels',
    },
    en: {
      title: 'House Rules | CLINIQ Maastricht',
      description: 'Read the house rules of CLINIQ Maastricht.',
      path: '/en/house-rules',
    },
  },
}

function fallbackFor(pageKey: string, lang: Lang): FallbackMetadata {
  return (
    fallbackByPage[pageKey]?.[lang] ||
    fallbackByPage[pageKey]?.nl ||
    {
      title: 'CLINIQ Maastricht',
      description: 'Nights, events and workshops at CLINIQ Maastricht.',
      path: lang === 'en' ? '/en' : '/',
    }
  )
}

export async function buildPageMetadata(
  pageKey: string,
  lang: Lang,
  fallback: FallbackMetadata,
): Promise<Metadata> {
  const settings = (await getSeoSettings(pageKey, lang)) as SeoSettings | null

  const canonicalPath = settings?.canonicalUrl
    ? new URL(settings.canonicalUrl, siteUrl).pathname
    : fallback.path

  const canonicalUrl = `${siteUrl}${canonicalPath}`
  const title = settings?.seoTitle || fallback.title
  const description = settings?.metaDescription || fallback.description
  const ogTitle = settings?.ogTitle || title
  const ogDescription = settings?.ogDescription || description
  const ogImage = settings?.socialImageUrl || fallback.image

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        nl: `${siteUrl}${canonicalPath}`,
        en: `${siteUrl}/en${canonicalPath === '/' ? '' : canonicalPath}`,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: 'CLINIQ Maastricht',
      images: ogImage ? [{ url: ogImage }] : undefined,
      locale: lang === 'nl' ? 'nl_NL' : 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export async function cmsMetadata(pageKey: string, lang: Lang): Promise<Metadata> {
  return buildPageMetadata(pageKey, lang, fallbackFor(pageKey, lang))
}
