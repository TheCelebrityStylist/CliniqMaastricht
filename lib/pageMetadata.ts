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

export const cmsMetadata = buildPageMetadata
