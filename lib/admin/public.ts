import { defaultStore } from './defaults'
import { readStore } from './store'
import type { AgendaEvent, Lang, MediaAsset } from './types'
import { images } from '@/lib/site'
import { fetchSanity } from '@/lib/sanity/client'

export type PhotoSection = 'homepage' | 'uitgaan' | 'workshop' | 'event-space' | 'contact'

type StoreLike = typeof defaultStore

type SanityEvent = {
  _id: string
  title?: string
  slug?: string
  date?: string
  djName?: string
  djImageUrl?: string
  eventImageUrl?: string
  customTitleNl?: string
  customTitleEn?: string
  eventType?: 'regular' | 'featured' | 'special' | 'private'
  openingTime?: string
  closingTime?: string
  minimumAge?: string
  published?: boolean
  featured?: boolean
  showDetailPage?: boolean
  descriptionNl?: string
  descriptionEn?: string
  ticketUrl?: string
  albumSlug?: string
}

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
  galleryImages?: { url?: string }[]
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

type SanityAlbum = {
  _id: string
  slug?: string
  titleNl?: string
  titleEn?: string
  descriptionNl?: string
  descriptionEn?: string
  date?: string
  coverImageUrl?: string
  photos?: { imageUrl?: string; altNl?: string; altEn?: string }[]
  published?: boolean
}

type SanityFaq = {
  _id: string
  pageKey?: string
  questionNl?: string
  questionEn?: string
  answerNl?: string
  answerEn?: string
  order?: number
  published?: boolean
}

type SanitySettings = {
  address?: string
  phone?: string
  email?: string
  instagramUrl?: string
  tiktokUrl?: string
}

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

function mediaFromUrl(id: string, url?: string, title = 'CLINIQ image', altNl = title, altEn = title): MediaAsset | null {
  if (!url) return null

  return {
    id,
    url,
    title,
    altNl,
    altEn,
    usage: [],
    focalPoint: 'center',
    createdAt: new Date().toISOString(),
  }
}

function fallbackPage(key: string) {
  const currentKey = toCurrentKey(pageKeyMap[key] || key)
  return fallbackStore().pages.find((item) => item.key === currentKey) || null
}

async function getSanityPage(slug: string) {
  const pageKey = pageKeyMap[slug] || slug

  return fetchSanity<SanityPage | null>(
    `*[_type == "page" && pageKey == $pageKey][0]{
      title,
      pageKey,
      headlineNl,
      headlineEn,
      introNl,
      introEn,
      bodyNl,
      bodyEn,
      primaryButtonNl,
      primaryButtonEn,
      secondaryButtonNl,
      secondaryButtonEn,
      "heroImageUrl": heroImage.asset->url,
      "galleryImages": galleryImages[]{"url": asset->url},
      seoTitleNl,
      seoTitleEn,
      seoDescriptionNl,
      seoDescriptionEn,
      ogTitleNl,
      ogTitleEn,
      ogDescriptionNl,
      ogDescriptionEn,
      "ogImageUrl": ogImage.asset->url
    }`,
    { pageKey },
  )
}

async function getSanityEvents(includePast = false) {
  const today = new Date().toISOString().slice(0, 10)

  const events = await fetchSanity<SanityEvent[]>(
    `*[_type == "event" && published != false] | order(date asc){
      _id,
      title,
      "slug": slug.current,
      date,
      "djName": dj->name,
      "djImageUrl": dj->image.asset->url,
      "eventImageUrl": eventImage.asset->url,
      customTitleNl,
      customTitleEn,
      eventType,
      openingTime,
      closingTime,
      minimumAge,
      published,
      featured,
      showDetailPage,
      descriptionNl,
      descriptionEn,
      ticketUrl,
      "albumSlug": album->slug.current
    }`,
  )

  if (!events?.length) return []

  return events
    .filter((event) => includePast || !event.date || event.date >= today)
    .map((event): AgendaEvent & { relatedAlbumSlug?: string; source?: string; imageSource?: string } => {
      const title = event.djName || event.title || 'CLINIQ'
      const titleNl = event.customTitleNl || title
      const titleEn = event.customTitleEn || title
      const imageUrl = event.eventImageUrl || event.djImageUrl || images.fallbackEvent

      return {
        _id: event._id,
        title,
        titleNl,
        titleEn,
        slug: { current: event.slug || event._id },
        date: event.date || '',
        startTime: event.openingTime || '22:00',
        endTime: event.closingTime || '03:00',
        ageLimit: event.minimumAge || '21+',
        shortDescription: event.descriptionNl || event.descriptionEn,
        shortDescriptionNl: event.descriptionNl,
        shortDescriptionEn: event.descriptionEn,
        ticketUrl: event.ticketUrl,
        featured: Boolean(event.featured),
        eventType: event.eventType || 'regular',
        showDetailCTA: Boolean(event.showDetailPage),
        published: event.published !== false,
        imageUrl,
        imageAlt: `${titleNl} bij CLINIQ Maastricht`,
        imagePosition: 'center',
        relatedAlbumSlug: event.albumSlug,
        source: event.eventImageUrl ? 'event' : event.djImageUrl ? 'dj' : 'fallback',
        imageSource: event.eventImageUrl ? 'Event image' : event.djImageUrl ? 'DJ image' : 'Fallback',
      }
    })
}

async function getSanityFaqs(pageKey: string, language: Lang = 'nl') {
  const sanityPageKey = pageKeyMap[pageKey] || pageKey

  const faqs = await fetchSanity<SanityFaq[]>(
    `*[_type == "faq" && pageKey == $pageKey && published != false] | order(order asc){
      _id,
      pageKey,
      questionNl,
      questionEn,
      answerNl,
      answerEn,
      order,
      published
    }`,
    { pageKey: sanityPageKey },
  )

  if (!faqs?.length) return []

  return faqs.map((faq) => ({
    id: faq._id,
    pageKey,
    language,
    question: language === 'en' ? faq.questionEn || faq.questionNl || '' : faq.questionNl || faq.questionEn || '',
    answer: language === 'en' ? faq.answerEn || faq.answerNl || '' : faq.answerNl || faq.answerEn || '',
    published: faq.published !== false,
    order: faq.order || 0,
  }))
}

async function getSanityAlbums(includeDrafts = false) {
  const albums = await fetchSanity<SanityAlbum[]>(
    `*[_type == "album" ${includeDrafts ? '' : '&& published != false'}] | order(date desc){
      _id,
      "slug": slug.current,
      titleNl,
      titleEn,
      descriptionNl,
      descriptionEn,
      date,
      "coverImageUrl": coverImage.asset->url,
      "photos": photos[]{
        "imageUrl": image.asset->url,
        altNl,
        altEn
      },
      published
    }`,
  )

  if (!albums?.length) return []

  return albums.map((album) => {
    const photos = (album.photos || [])
      .map((photo, index) =>
        mediaFromUrl(
          `${album._id}-${index}`,
          photo.imageUrl,
          album.titleNl || 'CLINIQ album',
          photo.altNl || album.titleNl || 'CLINIQ Maastricht foto',
          photo.altEn || album.titleEn || album.titleNl || 'CLINIQ Maastricht photo',
        ),
      )
      .filter(Boolean) as MediaAsset[]

    const cover =
      mediaFromUrl(`${album._id}-cover`, album.coverImageUrl, album.titleNl || 'CLINIQ album', album.titleNl || 'CLINIQ Maastricht foto', album.titleEn || album.titleNl || 'CLINIQ Maastricht photo')
      || photos[0]
      || null

    return {
      id: album._id,
      slug: album.slug || album._id,
      titleNl: album.titleNl || 'CLINIQ album',
      titleEn: album.titleEn || album.titleNl || 'CLINIQ album',
      descriptionNl: album.descriptionNl,
      descriptionEn: album.descriptionEn,
      date: album.date || '',
      coverImageUrl: cover?.url,
      imageIds: photos.map((photo) => photo.id),
      photos,
      cover,
      published: album.published !== false,
      createdAt: album.date || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  })
}

export function resolveEventImage(event: { title?: string; titleNl?: string; eventType?: string; imageUrl?: string }) {
  if (event.imageUrl) {
    return {
      imageUrl: event.imageUrl,
      source: 'event' as const,
      imageSource: 'Event image',
      altNl: `${event.titleNl || event.title || 'Event'} bij CLINIQ Maastricht`,
      altEn: `${event.title || event.titleNl || 'Event'} at CLINIQ Maastricht`,
    }
  }

  return {
    imageUrl: images.fallbackEvent,
    source: 'general-fallback' as const,
    imageSource: 'Fallback',
    altNl: 'CLINIQ Maastricht event',
    altEn: 'CLINIQ Maastricht event',
  }
}

export async function getAgendaEvents(includePast = false) {
  const sanityEvents = await getSanityEvents(includePast)
  if (sanityEvents.length) return sanityEvents

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
  const sanityPage = await getSanityPage(slug)
  const sanityFaqs = await getSanityFaqs(slug, lang)

  if (sanityPage) {
    const mappedKey = toCurrentKey(sanityPage.pageKey || pageKeyMap[slug] || slug)
    const fallback = fallbackPage(slug)

    const gallery = (sanityPage.galleryImages || [])
      .map((item, order) =>
        mediaFromUrl(
          `sanity-${mappedKey}-${order}`,
          item.url,
          sanityPage.title || mappedKey,
          `${sanityPage.title || mappedKey} bij CLINIQ Maastricht`,
          `${sanityPage.title || mappedKey} at CLINIQ Maastricht`,
        ),
      )
      .filter(Boolean) as MediaAsset[]

    return {
      ...(fallback || {
        key: mappedKey,
        titleNl: sanityPage.title || mappedKey,
        titleEn: sanityPage.title || mappedKey,
      }),
      key: mappedKey,
      titleNl: sanityPage.title || fallback?.titleNl || mappedKey,
      titleEn: sanityPage.title || fallback?.titleEn || mappedKey,
      heroTitleNl: sanityPage.headlineNl || fallback?.heroTitleNl,
      heroTitleEn: sanityPage.headlineEn || fallback?.heroTitleEn,
      heroSubtitleNl: sanityPage.introNl || fallback?.heroSubtitleNl,
      heroSubtitleEn: sanityPage.introEn || fallback?.heroSubtitleEn,
      bodyNl: sanityPage.bodyNl || fallback?.bodyNl,
      bodyEn: sanityPage.bodyEn || fallback?.bodyEn,
      primaryCtaNl: sanityPage.primaryButtonNl || fallback?.primaryCtaNl,
      primaryCtaEn: sanityPage.primaryButtonEn || fallback?.primaryCtaEn,
      secondaryCtaNl: sanityPage.secondaryButtonNl || fallback?.secondaryCtaNl,
      secondaryCtaEn: sanityPage.secondaryButtonEn || fallback?.secondaryCtaEn,
      heroImageUrl: sanityPage.heroImageUrl || fallback?.heroImageUrl,
      imageUrl: sanityPage.heroImageUrl || fallback?.heroImageUrl,
      gallery,
      galleryImages: gallery.map((item, order) => ({
        imageId: item.id,
        imageUrl: item.url,
        altNl: item.altNl,
        altEn: item.altEn,
        order,
      })),
      faqs: sanityFaqs,
    }
  }

  const store = await safeAdminStore(`getPageContent:${slug}`)
  const currentKey = toCurrentKey(pageKeyMap[slug] || slug)
  const fallback = store.pages.find((item) => item.key === currentKey) || fallbackPage(slug)

  if (!fallback) return null

  const image = store.media.find((item) => item.id === fallback.heroImageId)
  const gallery = (fallback.galleryImageIds || [])
    .map((id) => store.media.find((item) => item.id === id))
    .filter(Boolean) as MediaAsset[]

  return {
    ...fallback,
    faqs: await getFaqs(slug, lang),
    imageUrl: image?.url || fallback.heroImageUrl,
    gallery,
  }
}

export async function getSectionPhotoMedia(section: PhotoSection, fallbackUrls: string[] = []) {
  const pageSlug = section === 'homepage' ? 'home' : section === 'workshop' ? 'cocktail-workshop' : section === 'uitgaan' ? 'nightlife' : section
  const content = await getPageContent(pageSlug)

  if (content?.gallery?.length) return content.gallery

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

export async function getPhotoAlbums(includeDrafts = false) {
  const sanityAlbums = await getSanityAlbums(includeDrafts)
  if (sanityAlbums.length) return sanityAlbums

  const store = await safeAdminStore('getPhotoAlbums')

  return store.albums
    .filter((album) => includeDrafts || album.published)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((album) => {
      const cover =
        store.media.find((media) => media.id === album.coverImageId)
        || store.media.find((media) => album.imageIds.includes(media.id))
        || mediaFromUrl(`${album.id}-cover`, album.coverImageUrl, album.titleNl, album.titleNl, album.titleEn)

      const photos = album.photos?.length
        ? album.photos.map((photo, index) => mediaFromUrl(photo.imageId || `${album.id}-${index}`, photo.imageUrl, album.titleNl, photo.altNl || album.titleNl, photo.altEn || album.titleEn)).filter(Boolean) as MediaAsset[]
        : album.imageIds.map((id) => store.media.find((media) => media.id === id)).filter(Boolean) as MediaAsset[]

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
  const sanityFaqs = await getSanityFaqs(pageKey, language)
  if (sanityFaqs.length) return sanityFaqs

  const store = await safeAdminStore(`getFaqs:${pageKey}`)

  return store.faqs
    .filter((faq) => faq.pageKey === pageKey && faq.language === language && faq.published)
    .sort((a, b) => a.order - b.order)
}

export async function getSeo(pageKey: string, language: Lang) {
  const sanityPage = await getSanityPage(pageKey)

  if (sanityPage) {
    const seoTitle = language === 'en' ? sanityPage.seoTitleEn || sanityPage.seoTitleNl : sanityPage.seoTitleNl || sanityPage.seoTitleEn
    const metaDescription = language === 'en' ? sanityPage.seoDescriptionEn || sanityPage.seoDescriptionNl : sanityPage.seoDescriptionNl || sanityPage.seoDescriptionEn
    const ogTitle = language === 'en' ? sanityPage.ogTitleEn || sanityPage.ogTitleNl || seoTitle : sanityPage.ogTitleNl || sanityPage.ogTitleEn || seoTitle
    const ogDescription = language === 'en' ? sanityPage.ogDescriptionEn || sanityPage.ogDescriptionNl || metaDescription : sanityPage.ogDescriptionNl || sanityPage.ogDescriptionEn || metaDescription

    if (seoTitle || metaDescription || ogTitle || ogDescription || sanityPage.ogImageUrl) {
      return {
        pageKey,
        language,
        seoTitle,
        metaDescription,
        ogTitle,
        ogDescription,
        socialImageUrl: sanityPage.ogImageUrl,
      }
    }
  }

  const store = await safeAdminStore(`getSeo:${pageKey}`)
  const fallbackSeo = store.seo.find((item) => item.pageKey === pageKey && item.language === language)

  return fallbackSeo ? { ...fallbackSeo, socialImageUrl: undefined } : null
}

export async function getSiteSettings() {
  const sanitySettings = await fetchSanity<SanitySettings | null>(
    `*[_type == "siteSettings"][0]{
      address,
      phone,
      email,
      instagramUrl,
      tiktokUrl
    }`,
  )

  if (sanitySettings) {
    const fallback = fallbackStore().settings

    return {
      ...fallback,
      address: sanitySettings.address || fallback.address,
      phone: sanitySettings.phone || fallback.phone,
      email: sanitySettings.email || fallback.email,
      instagram: sanitySettings.instagramUrl || fallback.instagram,
      tiktok: sanitySettings.tiktokUrl || fallback.tiktok,
    }
  }

  const store = await safeAdminStore('getSiteSettings')
  return store.settings
}

export const getSeoSettings = getSeo
