import { readStore } from './store'
import type { AgendaEvent, Lang, MediaAsset } from './types'
import { images } from '@/lib/site'

export type PhotoSection = 'homepage' | 'uitgaan' | 'workshop' | 'event-space' | 'contact'

const sectionTags: Record<PhotoSection, string[]> = {
  homepage: ['homepage', 'home', 'hero'],
  uitgaan: ['uitgaan', 'nightlife', 'event', 'crowd', 'dj'],
  workshop: ['cocktail-workshop', 'workshop'],
  'event-space': ['ruimte-huren', 'event-space', 'private-event', 'bar'],
  contact: ['contact'],
}

function matchesSection(media: MediaAsset, section: PhotoSection) {
  const tags = sectionTags[section]
  return (media.usage || []).some((tag) => tags.includes(tag.toLowerCase()))
}

function fallbackMedia(section: PhotoSection, fallbackUrls: string[] = []): MediaAsset[] {
  return fallbackUrls.map((url, index) => ({
    id: `${section}-fallback-${index}`,
    url,
    title: `${section} fallback ${index + 1}`,
    altNl: `Foto van CLINIQ Maastricht - ${section}`,
    altEn: `Photo of CLINIQ Maastricht - ${section}`,
    usage: [section],
    focalPoint: 'center',
    createdAt: new Date().toISOString(),
  }))
}

export async function getAgendaEvents(includePast = false) {
  const today = new Date().toISOString().slice(0, 10)
  const store = await readStore()

  return store.events
    .filter((event) => event.published !== false)
    .filter((event) => includePast || event.date >= today)
    .sort((a, b) => `${a.date} ${a.startTime || ''}`.localeCompare(`${b.date} ${b.startTime || ''}`))
    .map((event) => ({
      ...event,
      imageUrl: event.imageUrl || images.fallbackEvent,
      relatedAlbumSlug: store.albums.find((album) => album.id === event.relatedAlbumId)?.slug,
    }))
}

export async function getAgendaEventBySlug(slug: string) {
  const events = await getAgendaEvents(true)
  return events.find((event) => event.slug?.current === slug || event._id === slug) || null
}

export async function getSectionPhotoMedia(section: PhotoSection, fallbackUrls: string[] = []) {
  const store = await readStore()
  const media = store.media.filter((item) => matchesSection(item, section))
  return media.length ? media : fallbackMedia(section, fallbackUrls)
}

export async function getPhotoAlbums(includeDrafts = false) {
  const store = await readStore()
  return store.albums
    .filter((album) => includeDrafts || album.published)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((album) => {
      const cover = store.media.find((media) => media.id === album.coverImageId) || store.media.find((media) => album.imageIds.includes(media.id))
      const photos = album.imageIds.map((id) => store.media.find((media) => media.id === id)).filter(Boolean) as MediaAsset[]
      return { ...album, cover, photos }
    })
}

export async function getPhotoAlbumBySlug(slug: string) {
  const albums = await getPhotoAlbums()
  return albums.find((album) => album.slug === slug || album.id === slug) || null
}

export async function getJobs() {
  const store = await readStore()
  return store.jobs.filter((job) => job.published !== false)
}

export async function getPageContent(slug: string, lang: Lang = 'nl') {
  const store = await readStore()
  const page = store.pages.find((item) => item.key === slug)
  if (!page) return null
  const pageFaqs = store.faqs
    .filter((faq) => faq.pageKey === slug && faq.language === lang && faq.published)
    .sort((a, b) => a.order - b.order)
    .map(({ question, answer }) => ({ question, answer }))
  const image = store.media.find((item) => item.id === page.heroImageId)
  const gallery = (page.galleryImageIds || []).map((id) => store.media.find((item) => item.id === id)).filter(Boolean) as MediaAsset[]
  return { ...page, faqs: pageFaqs, imageUrl: image?.url, gallery }
}

export async function getFaqs(pageKey: string, language: Lang = 'nl') {
  const store = await readStore()
  return store.faqs.filter((faq) => faq.pageKey === pageKey && faq.language === language && faq.published).sort((a, b) => a.order - b.order)
}

export async function getSeo(pageKey: string, language: Lang) {
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

export const getSeoSettings = getSeo
