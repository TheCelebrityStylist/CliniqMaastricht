import { pageMeta, localizedPaths, type Lang } from './i18n'
import { metadata } from './seo'
import { getSeoSettings } from './sanity/client'

type PageKey = keyof typeof pageMeta

export async function cmsMetadata(pageKey: PageKey, lang: Lang) {
  const fallback = pageMeta[pageKey][lang]
  const settings = await getSeoSettings(pageKey === 'eventSpace' ? 'event-space' : pageKey === 'houseRules' ? 'house-rules' : pageKey === 'workshop' ? 'cocktail-workshop' : pageKey, lang)
  const path = localizedPaths[pageKey]?.[lang] || '/'
  return metadata(
    settings?.seoTitle || fallback.title,
    settings?.metaDescription || fallback.description,
    settings?.canonicalUrl ? new URL(settings.canonicalUrl).pathname : path,
    lang,
    settings?.socialImageUrl,
  )
}
