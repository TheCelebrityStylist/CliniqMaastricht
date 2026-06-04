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
    .map((event) => ({ ...event, imageUrl: event.imageUrl || images.club }))
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
  return {
    ...page,
    heroTitle: lang === 'en' ? page.heroTitleEn : page.heroTitleNl,
    heroSubtitle: lang === 'en' ? page.heroSubtitleEn : page.heroSubtitleNl,
    ctaLabel: lang === 'en' ? page.primaryCtaEn : page.primaryCtaNl,
    faqs: pageFaqs,
    price: page.price,
    minimumGroupSize: page.minimumGroupSize,
    capacity: page.capacity,
    images: image ? [{ url: image.url, alt: lang === 'en' ? image.altEn : image.altNl }] : [],
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
