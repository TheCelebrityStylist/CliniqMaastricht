import { defaultStore } from './defaults'
import { readStore } from './store'
import type { AgendaEvent, Lang, MediaAsset } from './types'
import { images } from '@/lib/site'

export type PhotoSection = 'homepage' | 'uitgaan' | 'workshop' | 'event-space' | 'contact'

type StoreLike = typeof defaultStore

const pageKeyMap: Record<string, string> = {
  home: 'homepage',
  homepage: 'homepage',
  nightlife: 'uitgaan',
  uitgaan: 'uitgaan',
  'cocktail-workshop': 'cocktailWorkshop',
  workshop: 'cocktailWorkshop',
  'event-space': 'eventSpace',
  eventSpace: 'eventSpace',
  contact: 'contact',
  vacatures: 'vacatures',
  jobs: 'vacatures',
  'house-rules': 'houseRules',
  houseRules: 'houseRules',
  fotos: 'fotos',
}

function toCurrentKey(key: string) {
  if (key === 'homepage') return 'home'
  if (key === 'uitgaan') return 'nightlife'
  if (key === 'cocktailWorkshop') return 'cocktail-workshop'
  if (key === 'eventSpace') return 'event-space'
  if (key === 'houseRules') return 'house-rules'
  return key
}


function mediaFromUrl(id: string, url?: string, title = 'CLINIQ image', altNl = title, altEn = title): MediaAsset | null {
  if (!url) return null
  return { id, url, title, altNl, altEn, usage: [], focalPoint: 'center', createdAt: new Date().toISOString() }
}

function fallbackStore(): StoreLike {
  return defaultStore
}

async function safeAdminStore(context: string): Promise<StoreLike> {
  try {
    return await readStore()
  } catch (error) {
    console.error(`[admin-public] ${context} failed; using fallback content`, error)
    return fallbackStore()
  }
}

function normalizeName(value?: string) {
  return (value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function fallbackPage(key: string) {
  const currentKey = toCurrentKey(pageKeyMap[key] || key)
  return fallbackStore().pages.find((item) => item.key === currentKey) || null
}

export function resolveEventImage(event: { title?: string; titleNl?: string; eventType?: string; imageUrl?: string }, store: StoreLike = fallbackStore()) {
  if (event.imageUrl) return { imageUrl: event.imageUrl, source: 'event' as const, imageSource: 'Event image', altNl: `${event.titleNl || event.title || 'Event'} bij CLINIQ Maastricht`, altEn: `${event.title || event.titleNl || 'Event'} at CLINIQ Maastricht` }
  const eventName = normalizeName(event.titleNl || event.title)
  const djImage = store.djImages.find((item) => item.active !== false && (normalizeName(item.name) === eventName || item.aliases.some((alias) => normalizeName(alias) === eventName)))
  if (djImage?.imageUrl) return { imageUrl: djImage.imageUrl, source: 'dj' as const, imageSource: 'DJ image', altNl: djImage.imageAltNl, altEn: djImage.imageAltEn, djImage }
  return { imageUrl: images.fallbackEvent, source: 'general-fallback' as const, imageSource: 'Fallback', altNl: 'CLINIQ Maastricht event', altEn: 'CLINIQ Maastricht event', djImage }
}

export async function getAgendaEvents(includePast = false) {
  const today = new Date().toISOString().slice(0, 10)
  const store = await safeAdminStore('getAgendaEvents')
  return store.events
    .filter((event) => event.published !== false)
    .filter((event) => includePast || event.date >= today)
    .sort((a, b) => `${a.date} ${a.startTime || ''}`.localeCompare(`${b.date} ${b.startTime || ''}`))
}

export async function getAgendaEventBySlug(slug: string) {
  const events = await getAgendaEvents(true)
  return events.find((event) => event.slug?.current === slug || event._id === slug) || null
}

export async function getPageContent(slug: string, lang: Lang = 'nl') {
  const store = await safeAdminStore(`getPageContent:${slug}`)
  const currentKey = toCurrentKey(pageKeyMap[slug] || slug)
  const fallback = store.pages.find((item) => item.key === currentKey) || fallbackPage(slug)
  if (!fallback) return null
  const image = store.media.find((item) => item.id === fallback.heroImageId)
  const gallery = (fallback.galleryImageIds || []).map((id) => store.media.find((item) => item.id === id)).filter(Boolean) as MediaAsset[]
  return { ...fallback, faqs: await getFaqs(slug, lang), imageUrl: image?.url || fallback.heroImageUrl, gallery }
}

export async function getSectionPhotoMedia(section: PhotoSection, fallbackUrls: string[] = []) {
  const pageSlug = section === 'homepage' ? 'home' : section === 'workshop' ? 'cocktail-workshop' : section === 'uitgaan' ? 'nightlife' : section
  const content = await getPageContent(pageSlug)
  if (content?.gallery?.length) return content.gallery
  return fallbackUrls.map((url, index) => ({ id: `${section}-fallback-${index}`, url, title: `${section} fallback ${index + 1}`, altNl: `Foto van CLINIQ Maastricht - ${section}`, altEn: `Photo of CLINIQ Maastricht - ${section}`, usage: [section], focalPoint: 'center', createdAt: new Date().toISOString() }))
}

export async function getPhotoAlbums(includeDrafts = false) {
  const store = await safeAdminStore('getPhotoAlbums')
  return store.albums.filter((album) => includeDrafts || album.published).sort((a, b) => b.date.localeCompare(a.date)).map((album) => {
    const cover = store.media.find((media) => media.id === album.coverImageId) || store.media.find((media) => album.imageIds.includes(media.id)) || mediaFromUrl(`${album.id}-cover`, album.coverImageUrl, album.titleNl, album.titleNl, album.titleEn)
    const photos = album.photos?.length ? album.photos.map((photo, index) => mediaFromUrl(photo.imageId || `${album.id}-${index}`, photo.imageUrl, album.titleNl, photo.altNl || album.titleNl, photo.altEn || album.titleEn)).filter(Boolean) as MediaAsset[] : album.imageIds.map((id) => store.media.find((media) => media.id === id)).filter(Boolean) as MediaAsset[]
    return { ...album, cover, photos }
  })
}

export async function getPhotoAlbumBySlug(slug: string) {
  const albums = await getPhotoAlbums()
  return albums.find((album) => album.slug === slug || album.id === slug) || null
}

export async function getJobs() {
  const store = await safeAdminStore('getJobs')
  return store.jobs.filter((job) => job.published !== false)
}

export async function getFaqs(pageKey: string, language: Lang = 'nl') {
  const store = await safeAdminStore(`getFaqs:${pageKey}`)
  return store.faqs.filter((faq) => faq.pageKey === pageKey && faq.language === language && faq.published).sort((a, b) => a.order - b.order)
}

export async function getSeo(pageKey: string, language: Lang) {
  const store = await safeAdminStore(`getSeo:${pageKey}`)
  const fallbackSeo = store.seo.find((item) => item.pageKey === pageKey && item.language === language)
  return fallbackSeo ? { ...fallbackSeo, socialImageUrl: undefined } : null
}

export async function getSiteSettings() {
  const store = await safeAdminStore('getSiteSettings')
  return store.settings
}

export const getSeoSettings = getSeo
