import { readStore } from './store'
import type { Lang } from './types'
import { images } from '@/lib/site'

export async function getAgendaEvents(includePast = false) {
  const store = await readStore()
  const today = new Date().toISOString().slice(0, 10)
  return store.events
    .filter((event) => event.published !== false)
    .filter((event) => includePast || event.date >= today)
    .sort((a, b) => `${a.date} ${a.startTime || ''}`.localeCompare(`${b.date} ${b.startTime || ''}`))
    .map((event) => ({ ...event, imageUrl: event.imageUrl || images.fallbackEvent }))
}

export async function getAgendaEventBySlug(slug: string) {
  const events = await getAgendaEvents(true)
  return events.find((event) => event.slug?.current === slug || event._id === slug) || null
}

export async function getJobs() {
  const store = await readStore()
  return store.jobs.filter((job) => job.published !== false)
}

export async function getPageContent(slug: string, lang: Lang = 'nl') {
  const store = await readStore()
  const page = store.pages.find((item) => item.key === slug)
  if (!page) return null
  const pageFaqs = store.faqs.filter((faq) => faq.pageKey === slug && faq.language === lang && faq.published).sort((a, b) => a.order - b.order).map(({ question, answer }) => ({ question, answer }))
  const image = store.media.find((item) => item.id === page.heroImageId)
  const gallery = (page.galleryImageIds || []).map((id) => store.media.find((item) => item.id === id)).filter(Boolean)
  const pageImages = [image, ...gallery].filter(Boolean) as typeof store.media
  return {
    ...page,
    heroTitle: lang === 'en' ? page.heroTitleEn : page.heroTitleNl,
    heroSubtitle: lang === 'en' ? page.heroSubtitleEn : page.heroSubtitleNl,
    ctaLabel: lang === 'en' ? page.primaryCtaEn : page.primaryCtaNl,
    secondaryCtaLabel: lang === 'en' ? page.secondaryCtaEn : page.secondaryCtaNl,
    body: lang === 'en' ? page.bodyEn : page.bodyNl,
    faqs: pageFaqs,
    price: page.price,
    minimumGroupSize: page.minimumGroupSize,
    capacity: page.capacity,
    images: pageImages.map((item) => ({ url: item.url, alt: lang === 'en' ? item.altEn : item.altNl, focalPoint: item.focalPoint || 'center' })),
  }
}

export async function getSeoSettings(pageKey: string, language: Lang) {
  const store = await readStore()
  const seo = store.seo.find((item) => item.pageKey === pageKey && item.language === language)
  if (!seo) return null
  const social = store.media.find((item) => item.id === seo.socialImageId)
  return { ...seo, socialImageUrl: social?.url }
}

export async function getSiteSettings() {
  const store = await readStore()
  return store.settings
}
