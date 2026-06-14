import type { Metadata } from 'next'
import type { Lang } from '@/lib/admin/types'
import { getSeoSettings } from '@/lib/admin/public'

type FallbackMetadata = {
  title: string
  description: string
  path: string
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
      title: 'Uitgaan in Maastricht | CLINIQ Maastricht',
      description: 'Bekijk de agenda van CLINIQ Maastricht met DJ-avonden, club nights en speciale events.',
      path: '/uitgaan',
    },
    en: {
      title: 'Nightlife in Maastricht | CLINIQ Maastricht',
      description: 'View the CLINIQ Maastricht agenda with DJ nights, club nights and special events.',
      path: '/en/nightlife',
    },
  },
  uitgaan: {
    nl: {
      title: 'Uitgaan in Maastricht | CLINIQ Maastricht',
      description: 'Bekijk de agenda van CLINIQ Maastricht met DJ-avonden, club nights en speciale events.',
      path: '/uitgaan',
    },
    en: {
      title: 'Nightlife in Maastricht | CLINIQ Maastricht',
      description: 'View the CLINIQ Maastricht agenda with DJ nights, club nights and special events.',
      path: '/en/nightlife',
    },
  },
  workshop: {
    nl: {
      title: 'Cocktail workshop Maastricht | CLINIQ Maastricht',
      description: 'Boek een cocktail workshop bij CLINIQ Maastricht voor groepen, bedrijfsuitjes, verjaardagen en vrijgezellenfeesten.',
      path: '/cocktail-workshop',
    },
    en: {
      title: 'Cocktail workshop Maastricht | CLINIQ Maastricht',
      description: 'Book a cocktail workshop at CLINIQ Maastricht for groups, company outings, birthdays and bachelor or bachelorette parties.',
      path: '/en/cocktail-workshop',
    },
  },
  'cocktail-workshop': {
    nl: {
      title: 'Cocktail workshop Maastricht | CLINIQ Maastricht',
      description: 'Boek een cocktail workshop bij CLINIQ Maastricht voor groepen, bedrijfsuitjes, verjaardagen en vrijgezellenfeesten.',
      path: '/cocktail-workshop',
    },
    en: {
      title: 'Cocktail workshop Maastricht | CLINIQ Maastricht',
      description: 'Book a cocktail workshop at CLINIQ Maastricht for groups, company outings, birthdays and bachelor or bachelorette parties.',
      path: '/en/cocktail-workshop',
    },
  },
  eventSpace: {
    nl: {
      title: 'Ruimte huren Maastricht | CLINIQ Maastricht',
      description: 'Huur CLINIQ Maastricht voor private events, borrels, bedrijfsfeesten en groepsavonden.',
      path: '/event-space',
    },
    en: {
      title: 'Private event venue Maastricht | CLINIQ Maastricht',
      description: 'Hire CLINIQ Maastricht for private events, drinks, company parties and group nights.',
      path: '/en/event-space',
    },
  },
  'event-space': {
    nl: {
      title: 'Ruimte huren Maastricht | CLINIQ Maastricht',
      description: 'Huur CLINIQ Maastricht voor private events, borrels, bedrijfsfeesten en groepsavonden.',
      path: '/event-space',
    },
    en: {
      title: 'Private event venue Maastricht | CLINIQ Maastricht',
      description: 'Hire CLINQ Maastricht for private events, drinks, company parties and group nights.',
      path: '/en/event-space',
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
      images: settings?.socialImageUrl ? [{ url: settings.socialImageUrl }] : undefined,
      locale: lang === 'nl' ? 'nl_NL' : 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: settings?.socialImageUrl ? [settings.socialImageUrl] : undefined,
    },
  }
}

export async function cmsMetadata(pageKey: string, lang: Lang): Promise<Metadata> {
  return buildPageMetadata(pageKey, lang, fallbackFor(pageKey, lang))
}
