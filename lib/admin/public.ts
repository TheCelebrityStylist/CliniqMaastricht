import { readStore } from './store'
import type { AgendaEvent, Lang, MediaAsset, PhotoAlbum } from './types'
import { images } from '@/lib/site'
import { getEventsFromSheet } from '@/lib/google/eventsFromSheet'
import { getDriveAlbumBySlug, getDriveAlbums, getPhotosForSection, type GoogleDrivePhoto, type PhotoSection } from '@/lib/google/photosFromDrive'

function googleEventToAgendaEvent(event: Awaited<ReturnType<typeof getEventsFromSheet>>[number]): AgendaEvent & { relatedAlbumSlug?: string } {
  const hasDetails = event.eventType === 'featured' || event.eventType === 'special'
  return {
    _id: event.id,
    title: event.title.nl,
    titleNl: event.title.nl,
    titleEn: event.title.en,
    slug: { current: event.slug },
    date: event.date,
    startTime: event.openingTime,
    endTime: event.closingTime,
    ageLimit: event.minimumAge,
    shortDescription: hasDetails ? event.description.nl : '',
    shortDescriptionNl: hasDetails ? event.description.nl : '',
    shortDescriptionEn: hasDetails ? event.description.en : '',
    fullDescription: hasDetails ? event.description.nl : '',
    fullDescriptionNl: hasDetails ? event.description.nl : '',
    fullDescriptionEn: hasDetails ? event.description.en : '',
    ticketUrl: event.ticketUrl || undefined,
    featured: event.featured,
    eventType: event.eventType,
    showDetailCTA: hasDetails && (event.showDetailPage || Boolean(event.ticketUrl)),
    published: event.published,
    imageUrl: event.imageUrl || images.fallbackEvent,
    imageAlt: `${event.title.nl} bij CLINIQ Maastricht`,
    relatedAlbumSlug: event.albumUrl ? event.albumUrl.split('/').filter(Boolean).pop() : undefined,
  }
}

function drivePhotoToMedia(photo: GoogleDrivePhoto): MediaAsset {
  return {
    id: photo.id,
    url: photo.url,
    title: photo.name,
    altNl: photo.alt.nl,
    altEn: photo.alt.en,
    usage: [photo.category, photo.folder],
    focalPoint: 'center',
    createdAt: new Date().toISOString(),
  }
}

function driveAlbumToPublicAlbum(album: Awaited<ReturnType<typeof getDriveAlbums>>[number]) {
  const photos = album.photos.map(drivePhotoToMedia)
  const cover = album.coverImage ? drivePhotoToMedia(album.coverImage) : photos[0]
  return {
    id: album.slug,
    slug: album.slug,
    titleNl: album.title.nl,
    titleEn: album.title.en,
    descriptionNl: `Foto's van ${album.title.nl} bij CLINIQ Maastricht.`,
    descriptionEn: `Photos from ${album.title.en} at CLINIQ Maastricht.`,
    date: album.date,
    coverImageId: cover?.id,
    imageIds: photos.map((photo) => photo.id),
    published: true,
    createdAt: new Date().toISOString(),
    cover,
    photos,
  }
}

export async function getAgendaEvents(includePast = false) {
  const today = new Date().toISOString().slice(0, 10)
  const sheetEvents = await getEventsFromSheet()
  if (sheetEvents.length) {
    return sheetEvents
      .filter((event) => event.published)
      .filter((event) => includePast || event.date >= today)
      .sort((a, b) => `${a.date} ${a.openingTime || ''}`.localeCompare(`${b.date} ${b.openingTime || ''}`))
      .map(googleEventToAgendaEvent)
  }

  const store = await readStore()
  return store.events
    .filter((event) => event.published !== false)
    .filter((event) => includePast || event.date >= today)
    .sort((a, b) => `${a.date} ${a.startTime || ''}`.localeCompare(`${b.date} ${b.startTime || ''}`))
    .map((event) => ({ ...event, imageUrl: event.imageUrl || images.fallbackEvent, relatedAlbumSlug: store.albums.find((album) => album.id === event.relatedAlbumId)?.slug }))
}

export async function getAgendaEventBySlug(slug: string) {
  const events = await getAgendaEvents(true)
  return events.find((event) => event.slug?.current === slug || event._id === slug) || null
}

export async function getSectionPhotoMedia(section: PhotoSection, fallbackUrls: string[] = []) {
  const drivePhotos = await getPhotosForSection(section)
  if (drivePhotos.length) return drivePhotos.map(drivePhotoToMedia)
  return fallbackUrls.map((url, index) => ({
    id: `${section}-fallback-${index}`,
    url,
    title: `${section} fallback ${index + 1}`,
    altNl: `Foto van CLINIQ Maastricht - ${section}`,
    altEn: `Photo of CLINIQ Maastricht - ${section}`,
    focalPoint: 'center',
    createdAt: new Date().toISOString(),
  }))
}

export async function getPhotoAlbums(includeDrafts = false) {
  const driveAlbums = await getDriveAlbums()
  if (driveAlbums.length) return driveAlbums.map(driveAlbumToPublicAlbum)

  const store = await readStore()
  return store.albums
    .filter((album) => includeDrafts || album.published)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((album) => {
      const cover = store.media.find((media) => media.id === album.coverImageId) || store.media.find((media) => album.imageIds.includes(media.id))
      const photos = album.imageIds.map((id) => store.media.find((media) => media.id === id)).filter(Boolean) as typeof store.media
      return { ...album, cover, photos }
    })
}

export async function getPhotoAlbumBySlug(slug: string) {
  const driveAlbum = await getDriveAlbumBySlug(slug)
  if (driveAlbum) return driveAlbumToPublicAlbum(driveAlbum)
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
