import { defaultStore } from './defaults'
import { readStore } from './store'
import type { AgendaEvent, Lang, MediaAsset } from './types'
import { images, site } from '@/lib/site'
import { sanityFetch } from '@/lib/sanity/client'

export type PhotoSection = 'homepage' | 'uitgaan' | 'workshop' | 'event-space' | 'contact'

type StoreLike = typeof defaultStore

type SanityImage = { url?: string; altNl?: string; altEn?: string; _key?: string }
type SanityPage = {
  title?: string
  pageKey?: string
  headlineNl?: string
  headlineEn?: string
  introNl?: string
  introEn?: string
  bodyNl?: string
  bodyEn?: string
  primaryButtonNl?: string
  primaryButtonEn?: string
  secondaryButtonNl?: string
  secondaryButtonEn?: string
  heroImageUrl?: string
  galleryImages?: SanityImage[]
  seoTitleNl?: string
  seoTitleEn?: string
  seoDescriptionNl?: string
  seoDescriptionEn?: string
  ogTitleNl?: string
  ogTitleEn?: string
  ogDescriptionNl?: string
  ogDescriptionEn?: string
  ogImageUrl?: string
}
type SanityEvent = {
  _id: string
  title?: string
  slug?: { current?: string }
  date: string
  dj?: { name?: string; aliases?: string[]; imageUrl?: string }
  customTitleNl?: string
  customTitleEn?: string
  eventType?: AgendaEvent['eventType']
  openingTime?: string
  closingTime?: string
  minimumAge?: string
  published?: boolean
  featured?: boolean
  showDetailPage?: boolean
  eventImageUrl?: string
  descriptionNl?: string
  descriptionEn?: string
  ticketUrl?: string
  album?: { slug?: { current?: string } }
}
type SanityAlbum = { _id: string; slug?: { current?: string }; titleNl: string; titleEn?: string; date: string; coverImageUrl?: string; photos?: Array<{ url?: string; altNl?: string; altEn?: string; _key?: string }>; published?: boolean; seoDescriptionNl?: string; seoDescriptionEn?: string }
type SanityFaq = { _id: string; pageKey: string; questionNl?: string; questionEn?: string; answerNl?: string; answerEn?: string; order?: number; published?: boolean }
type SanitySettings = { title?: string; address?: string; phone?: string; email?: string; instagramUrl?: string; tiktokUrl?: string; lockerUrl?: string; defaultSeoTitleNl?: string; defaultSeoTitleEn?: string; defaultSeoDescriptionNl?: string; defaultSeoDescriptionEn?: string; defaultOgImageUrl?: string }

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

function mapSanityPage(page: SanityPage | null, requestedKey: string) {
  if (!page) return null
  const key = toCurrentKey(page.pageKey || pageKeyMap[requestedKey] || requestedKey)
  const gallery = (page.galleryImages || []).map((image, index) => mediaFromUrl(`${key}-gallery-${image._key || index}`, image.url, page.title || key, image.altNl || page.title || key, image.altEn || page.title || key)).filter(Boolean) as MediaAsset[]
  return {
    key,
    titleNl: page.title || key,
    titleEn: page.title || key,
    heroTitleNl: page.headlineNl || '',
    heroTitleEn: page.headlineEn || '',
    heroSubtitleNl: page.introNl || '',
    heroSubtitleEn: page.introEn || '',
    bodyNl: page.bodyNl || '',
    bodyEn: page.bodyEn || '',
    primaryCtaNl: page.primaryButtonNl || '',
    primaryCtaEn: page.primaryButtonEn || '',
    secondaryCtaNl: page.secondaryButtonNl || '',
    secondaryCtaEn: page.secondaryButtonEn || '',
    imageUrl: page.heroImageUrl || '',
    gallery,
  }
}

function weekdayDefaults(date: string) {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay()
  if (day === 4) return { startTime: '22:00', endTime: '02:00', ageLimit: '18+' }
  if (day === 5 || day === 6) return { startTime: '22:00', endTime: '03:00', ageLimit: '21+' }
  return { startTime: '22:00', endTime: '03:00', ageLimit: '21+' }
}

function resolveSanityEventImage(event: SanityEvent) {
  const title = event.customTitleNl || event.title || event.dj?.name || 'CLINIQ'
  if (event.eventImageUrl) return { imageUrl: event.eventImageUrl, source: 'event' as const, imageSource: 'Event image', imageAlt: `${title} bij CLINIQ Maastricht` }
  if (event.dj?.imageUrl) return { imageUrl: event.dj.imageUrl, source: 'dj' as const, imageSource: 'DJ image', imageAlt: `${event.dj.name || title} bij CLINIQ Maastricht` }
  return { imageUrl: images.fallbackEvent, source: 'general-fallback' as const, imageSource: 'Fallback', imageAlt: 'CLINIQ Maastricht event' }
}

function mapSanityEvent(event: SanityEvent): AgendaEvent & { relatedAlbumSlug?: string; source?: string; imageSource?: string } {
  const defaults = weekdayDefaults(event.date)
  const title = event.customTitleNl || event.dj?.name || event.title || 'CLINIQ'
  const resolved = resolveSanityEventImage(event)
  return {
    _id: event._id,
    title,
    titleNl: event.customTitleNl || title,
    titleEn: event.customTitleEn || event.customTitleNl || title,
    slug: { current: event.slug?.current || `${event.date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}` },
    date: event.date,
    startTime: event.openingTime || defaults.startTime,
    endTime: event.closingTime || defaults.endTime,
    ageLimit: event.minimumAge || defaults.ageLimit,
    eventType: event.eventType || 'regular',
    featured: Boolean(event.featured),
    showDetailCTA: Boolean(event.showDetailPage),
    published: event.published !== false,
    shortDescriptionNl: event.descriptionNl || '',
    shortDescriptionEn: event.descriptionEn || '',
    fullDescriptionNl: event.descriptionNl || '',
    fullDescriptionEn: event.descriptionEn || '',
    ticketUrl: event.ticketUrl,
    imageUrl: resolved.imageUrl,
    imageAlt: resolved.imageAlt,
    imagePosition: 'center',
    relatedAlbumSlug: event.album?.slug?.current,
    source: resolved.source,
    imageSource: resolved.imageSource,
  }
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
  const query = `*[_type == "event" && published != false && ($includePast || date >= $today)] | order(date asc, openingTime asc) { _id, title, slug, date, customTitleNl, customTitleEn, eventType, openingTime, closingTime, minimumAge, published, featured, showDetailPage, descriptionNl, descriptionEn, ticketUrl, "eventImageUrl": eventImage.asset->url, dj->{name, aliases, "imageUrl": image.asset->url}, album->{slug} }`
  const sanityEvents = await sanityFetch<SanityEvent[]>(query, { today, includePast }, [])
  if (sanityEvents.length) return sanityEvents.map(mapSanityEvent)
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
  const sanityKey = pageKeyMap[slug] || slug
  const query = `*[_type == "page" && pageKey == $pageKey][0] { title, pageKey, headlineNl, headlineEn, introNl, introEn, bodyNl, bodyEn, primaryButtonNl, primaryButtonEn, secondaryButtonNl, secondaryButtonEn, "heroImageUrl": heroImage.asset->url, "galleryImages": galleryImages[]{_key, "url": asset->url} }`
  const page = await sanityFetch<SanityPage | null>(query, { pageKey: sanityKey }, null)
  const mapped = mapSanityPage(page, slug)
  if (mapped) return mapped
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
  const query = `*[_type == "album" && ($includeDrafts || published == true)] | order(date desc) { _id, titleNl, titleEn, slug, date, published, seoDescriptionNl, seoDescriptionEn, "coverImageUrl": coverImage.asset->url, "photos": photos[]{_key, altNl, altEn, "url": image.asset->url} }`
  const sanityAlbums = await sanityFetch<SanityAlbum[]>(query, { includeDrafts }, [])
  if (sanityAlbums.length) return sanityAlbums.map((album) => {
    const photos = (album.photos || []).filter((photo) => photo.url).map((photo, index) => ({ id: photo._key || `${album._id}-${index}`, url: photo.url || '', title: album.titleNl, altNl: photo.altNl || album.titleNl, altEn: photo.altEn || album.titleEn || album.titleNl, usage: ['album'], focalPoint: 'center', createdAt: album.date }))
    const cover = mediaFromUrl(`${album._id}-cover`, album.coverImageUrl || photos[0]?.url, album.titleNl, album.titleNl, album.titleEn || album.titleNl) || undefined
    return { id: album._id, slug: album.slug?.current || album._id, titleNl: album.titleNl, titleEn: album.titleEn || album.titleNl, descriptionNl: album.seoDescriptionNl, descriptionEn: album.seoDescriptionEn, date: album.date, published: album.published !== false, cover, photos }
  })
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
  const sanityKey = pageKeyMap[pageKey] || pageKey
  const query = `*[_type == "faq" && pageKey == $pageKey && published != false] | order(order asc) { _id, pageKey, questionNl, questionEn, answerNl, answerEn, order, published }`
  const faqs = await sanityFetch<SanityFaq[]>(query, { pageKey: sanityKey }, [])
  if (faqs.length) return faqs.map((faq) => ({ id: faq._id, pageKey, language, question: language === 'en' ? faq.questionEn || faq.questionNl || '' : faq.questionNl || faq.questionEn || '', answer: language === 'en' ? faq.answerEn || faq.answerNl || '' : faq.answerNl || faq.answerEn || '', published: faq.published !== false, order: faq.order || 0 }))
  const store = await safeAdminStore(`getFaqs:${pageKey}`)
  return store.faqs.filter((faq) => faq.pageKey === pageKey && faq.language === language && faq.published).sort((a, b) => a.order - b.order)
}

export async function getSeo(pageKey: string, language: Lang) {
  const sanityKey = pageKeyMap[pageKey] || pageKey
  const query = `*[_type == "page" && pageKey == $pageKey][0] { seoTitleNl, seoTitleEn, seoDescriptionNl, seoDescriptionEn, ogTitleNl, ogTitleEn, ogDescriptionNl, ogDescriptionEn, "ogImageUrl": ogImage.asset->url }`
  const page = await sanityFetch<SanityPage | null>(query, { pageKey: sanityKey }, null)
  if (page) return { pageKey, language, seoTitle: language === 'en' ? page.seoTitleEn : page.seoTitleNl, metaDescription: language === 'en' ? page.seoDescriptionEn : page.seoDescriptionNl, ogTitle: language === 'en' ? page.ogTitleEn : page.ogTitleNl, ogDescription: language === 'en' ? page.ogDescriptionEn : page.ogDescriptionNl, canonicalUrl: undefined, socialImageUrl: page.ogImageUrl }
  const store = await safeAdminStore(`getSeo:${pageKey}`)
  const fallbackSeo = store.seo.find((item) => item.pageKey === pageKey && item.language === language)
  return fallbackSeo ? { ...fallbackSeo, socialImageUrl: undefined } : null
}

export async function getSiteSettings() {
  const query = `*[_type == "siteSettings"][0] { title, address, phone, email, instagramUrl, tiktokUrl, lockerUrl, defaultSeoTitleNl, defaultSeoTitleEn, defaultSeoDescriptionNl, defaultSeoDescriptionEn, "defaultOgImageUrl": defaultOgImage.asset->url }`
  const settings = await sanityFetch<SanitySettings | null>(query, {}, null)
  const store = await safeAdminStore('getSiteSettings')
  if (!settings) return store.settings
  return { phone: settings.phone || site.phone, email: settings.email || site.email, whatsapp: site.whatsapp, address: settings.address || site.address.street, openingHours: store.settings.openingHours, instagram: settings.instagramUrl || site.instagram, tiktok: settings.tiktokUrl || site.tiktok }
}

export const getSeoSettings = getSeo
