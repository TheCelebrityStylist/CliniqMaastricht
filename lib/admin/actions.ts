'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { put } from '@vercel/blob'
import { createLead, createMedia, readStore, slugify, upsertAlbum, upsertEvent, writeStore } from './store'
import { clearAdminCookie, hasAdminCredentials, setAdminCookie, signAdminSession, validateAdminCredentials } from './auth'
import type { AgendaEvent, MediaAsset } from './types'

function formFiles(formData: FormData, key = 'files') {
  const files = formData.getAll(key).filter((file): file is File => file instanceof File && file.size > 0)
  const legacyFile = formData.get('file')
  if (legacyFile instanceof File && legacyFile.size > 0) files.push(legacyFile)
  return files
}

async function uploadFiles(files: File[]): Promise<Array<{ url: string; name: string }>> {
  if (!files.length) return []
  try {
    return await Promise.all(files.map(async (file) => {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
      const blob = await put(`cliniq/${Date.now()}-${safeName}`, file, { access: 'public' })
      return { url: blob.url, name: file.name }
    }))
  } catch (error) {
    console.error('Vercel Blob upload failed.', error)
    redirect('/admin/media?error=blob-token')
    return []
  }
}

function assertImageFile(file: File) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  const allowedNames = /\.(jpe?g|png|webp)$/i
  if (!allowedTypes.includes(file.type) && !allowedNames.test(file.name)) throw new Error('Only JPG, PNG and WebP images are allowed.')
  if (file.size > 10 * 1024 * 1024) throw new Error('Image must be 10MB or smaller.')
}

async function uploadFileToPath(file: File, pathPrefix: string) {
  assertImageFile(file)
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const blob = await put(`${pathPrefix}/${stamp}-${Date.now()}-${safeName}`, file, { access: 'public' })
  return blob.url
}

function mediaFromUpload(input: { url: string; name?: string; title: string; altNl?: string; altEn?: string; usage?: string[]; focalPoint?: string }): MediaAsset {
  const title = input.title || input.name || 'Cliniq photo'
  return {
    id: slugify(`${title}-${Date.now()}-${Math.random().toString(16).slice(2)}`),
    url: input.url,
    title,
    altNl: input.altNl || `${title} bij Cliniq Maastricht`,
    altEn: input.altEn || `${title} at Cliniq Maastricht`,
    usage: input.usage || [],
    focalPoint: input.focalPoint || 'center',
    createdAt: new Date().toISOString(),
  }
}

function revalidatePublic() {
  revalidatePath('/')
  revalidatePath('/en')
  revalidatePath('/uitgaan')
  revalidatePath('/en/nightlife')
  revalidatePath('/cocktail-workshop')
  revalidatePath('/en/cocktail-workshop')
  revalidatePath('/event-space')
  revalidatePath('/en/event-space')
  revalidatePath('/albums')
  revalidatePath('/en/albums')
  revalidatePath('/fotos')
  revalidatePath('/en/photos')
}

export async function loginAction(formData: FormData) {
  const username = String(formData.get('username') || '')
  const password = String(formData.get('password') || '')

  if (!hasAdminCredentials()) redirect('/admin/login?error=config')
  if (!validateAdminCredentials(username, password)) redirect('/admin/login?error=invalid')

  await setAdminCookie(signAdminSession(username))
  redirect('/admin')
}

export async function logoutAction() {
  await clearAdminCookie()
  redirect('/admin/login')
}

function checked(formData: FormData, key: string, fallback = false) {
  const values = formData.getAll(key).map(String)
  if (!values.length) return fallback
  return values.includes('on') || values.includes('true')
}

function weekdayDefaults(date: string) {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay()
  if (day === 4) return { startTime: '22:00', endTime: '02:00', ageLimit: '18+' }
  if (day === 5 || day === 6) return { startTime: '22:00', endTime: '03:00', ageLimit: '21+' }
  return { startTime: '', endTime: '', ageLimit: '' }
}

function normalizeArtistName(input: string) {
  const value = input.trim()
  const lower = value.toLowerCase()
  if (lower === 'sidney') return 'DJ SDNX'
  if (lower === 'len') return 'DJ Hadless'
  if (lower === 'big rob') return 'DJ BIG ROB'
  return value || 'CLINIQ'
}

function parseBulkEventRows(rows: string) {
  return rows.split('\n').map((line, index) => {
    const [dateRaw, artistRaw] = line.split(',').map((item) => item?.trim() || '')
    const title = normalizeArtistName(artistRaw)
    const defaults = weekdayDefaults(dateRaw)
    return {
      row: index + 1,
      valid: /^\d{4}-\d{2}-\d{2}$/.test(dateRaw),
      date: dateRaw,
      title,
      ...defaults,
    }
  }).filter((row) => row.date || row.title !== 'CLINIQ')
}

export async function saveEventAction(formData: FormData) {
  const store = await readStore()
  const files = formFiles(formData, 'eventImageFiles')
  const uploaded = await uploadFiles(files)
  const uploadedMedia = uploaded.map((item, index) => mediaFromUpload({
    url: item.url,
    name: item.name,
    title: `${String(formData.get('title') || 'Event image')} ${index + 1}`,
    usage: ['event', 'uitgaan'],
    focalPoint: String(formData.get('imagePosition') || 'center'),
  }))
  if (uploadedMedia.length) {
    store.media.unshift(...uploadedMedia)
    await writeStore(store)
  }

  const date = String(formData.get('date') || '')
  const defaults = weekdayDefaults(date)
  const eventType = String(formData.get('eventType') || 'regular') as AgendaEvent['eventType']
  const title = normalizeArtistName(String(formData.get('title') || ''))

  await upsertEvent({
    _id: String(formData.get('_id') || '') || undefined,
    title,
    titleNl: String(formData.get('titleNl') || '') || title,
    titleEn: String(formData.get('titleEn') || '') || title,
    subtitleNl: String(formData.get('subtitleNl') || ''),
    subtitleEn: String(formData.get('subtitleEn') || ''),
    date,
    startTime: String(formData.get('startTime') || '') || defaults.startTime,
    endTime: String(formData.get('endTime') || '') || defaults.endTime,
    ageLimit: String(formData.get('ageLimit') || '') || defaults.ageLimit,
    shortDescriptionNl: eventType === 'regular' ? '' : String(formData.get('shortDescriptionNl') || ''),
    shortDescriptionEn: eventType === 'regular' ? '' : String(formData.get('shortDescriptionEn') || ''),
    fullDescriptionNl: eventType === 'regular' ? '' : String(formData.get('fullDescriptionNl') || ''),
    fullDescriptionEn: eventType === 'regular' ? '' : String(formData.get('fullDescriptionEn') || ''),
    ticketUrl: eventType === 'regular' ? '' : String(formData.get('ticketUrl') || ''),
    relatedAlbumId: String(formData.get('relatedAlbumId') || ''),
    imageUrl: uploadedMedia[0]?.url || String(formData.get('manualImageUrl') || formData.get('imageUrl') || ''),
    imagePosition: String(formData.get('imagePosition') || 'center'),
    featured: checked(formData, 'featured'),
    eventType,
    showDetailCTA: eventType === 'regular' ? false : checked(formData, 'showDetailCTA'),
    published: checked(formData, 'published', true),
  })
  revalidatePublic()
  redirect('/admin/events?saved=1')
}

export async function saveBulkEventsAction(formData: FormData) {
  const rows = parseBulkEventRows(String(formData.get('rows') || ''))
  const existingStore = await readStore()
  const validRows = rows.filter((row) => row.valid && !existingStore.events.some((event) => event.date === row.date))
  for (const row of validRows) {
    await upsertEvent({
      title: row.title,
      titleNl: row.title,
      titleEn: row.title,
      date: row.date,
      startTime: row.startTime,
      endTime: row.endTime,
      ageLimit: row.ageLimit,
      eventType: 'regular',
      featured: false,
      showDetailCTA: false,
      published: true,
    })
  }
  revalidatePublic()
  redirect(`/admin/bulk-events?saved=${validRows.length}`)
}


export async function saveDjImageAction(formData: FormData) {
  const store = await readStore()
  const id = String(formData.get('id') || '')
  const name = String(formData.get('name') || '').trim()
  const returnTo = String(formData.get('returnTo') || '/admin/dj-images')
  let dj = store.djImages.find((item) => item.id === id)
  if (!dj && name) {
    const normalized = name.toLowerCase().trim()
    dj = store.djImages.find((item) => item.name.toLowerCase() === normalized || item.aliases.some((alias) => alias.toLowerCase() === normalized))
  }
  if (!dj && name) {
    const slug = slugify(name)
    dj = {
      id: `dj-${slug}`,
      name,
      slug,
      aliases: [],
      imageUrl: null,
      imageAltNl: `DJ ${name} bij CLINIQ Maastricht`,
      imageAltEn: `DJ ${name} at CLINIQ Maastricht`,
      active: true,
      updatedAt: new Date().toISOString(),
    }
    store.djImages.push(dj)
  }
  if (!dj) {
    redirect(`${returnTo}?error=missing`)
    return
  }
  const file = formFiles(formData, 'image')[0]
  if (!file) {
    redirect(`${returnTo}?error=image-required`)
    return
  }
  try {
    const imageUrl = await uploadFileToPath(file, `dj-images/${dj.slug}`)
    dj.imageUrl = imageUrl
    dj.imageAltNl = `DJ ${dj.name} bij CLINIQ Maastricht`
    dj.imageAltEn = `DJ ${dj.name} at CLINIQ Maastricht`
    dj.updatedAt = new Date().toISOString()
    await writeStore(store)
    revalidatePublic()
  } catch (error) {
    console.error('DJ image upload failed.', error)
    redirect(`${returnTo}?error=upload&edit=${dj.id}`)
  }
  redirect(`${returnTo}?saved=${dj.id}`)
}

export async function removeDjImageAction(formData: FormData) {
  const store = await readStore()
  const id = String(formData.get('id') || '')
  const dj = store.djImages.find((item) => item.id === id)
  if (dj) {
    dj.imageUrl = null
    dj.updatedAt = new Date().toISOString()
    await writeStore(store)
  }
  revalidatePublic()
  redirect('/admin/dj-images?removed=1')
}

export async function useDjImageAction(formData: FormData) {
  const store = await readStore()
  const id = String(formData.get('id') || '')
  const event = store.events.find((item) => item._id === id)
  if (event) event.imageUrl = ''
  await writeStore(store)
  revalidatePublic()
  redirect('/admin/events?saved=1')
}

export async function saveMediaAction(formData: FormData) {
  const files = formFiles(formData)
  const uploaded = await uploadFiles(files)
  const urls = [
    ...String(formData.get('url') || '').split('\n').map((item) => item.trim()).filter(Boolean).map((url) => ({ url, name: '' })),
    ...uploaded,
  ]

  if (!urls.length) redirect('/admin/media?error=image-required')
  const usage = String(formData.get('usage') || '').split(',').map((item) => item.trim()).filter(Boolean)
  const focalPoint = String(formData.get('focalPoint') || 'center')
  const title = String(formData.get('title') || '')
  await Promise.all(urls.map((item, index) => createMedia({ url: item.url, title: title || item.name || `Cliniq image ${index + 1}`, altNl: String(formData.get('altNl') || ''), altEn: String(formData.get('altEn') || ''), usage, focalPoint })))
  revalidatePath('/admin/media')
  revalidatePublic()
  redirect('/admin/media?saved=1')
}

export async function saveAlbumAction(formData: FormData) {
  const existingIds = formData.getAll('imageIds').map(String).filter(Boolean)
  const files = formFiles(formData)
  const uploaded = await uploadFiles(files)
  const usage = ['album', 'nightlife', 'gallery']
  const uploadedMedia = uploaded.map((item, index) => mediaFromUpload({ url: item.url, name: item.name, title: `${String(formData.get('titleNl') || 'Album photo')} ${index + 1}`, usage, focalPoint: String(formData.get('focalPoint') || 'center') }))

  const store = await readStore()
  store.media.unshift(...uploadedMedia)
  await writeStore(store)

  const imageIds = [...existingIds, ...uploadedMedia.map((media) => media.id)]
  await upsertAlbum({
    id: String(formData.get('id') || '') || undefined,
    titleNl: String(formData.get('titleNl') || ''),
    titleEn: String(formData.get('titleEn') || ''),
    descriptionNl: String(formData.get('descriptionNl') || ''),
    descriptionEn: String(formData.get('descriptionEn') || ''),
    date: String(formData.get('date') || ''),
    relatedEventId: String(formData.get('relatedEventId') || ''),
    coverImageId: String(formData.get('coverImageId') || '') || imageIds[0],
    imageIds,
    published: checked(formData, 'published', true),
  })
  revalidatePublic()
  redirect('/admin/albums?saved=1')
}

export async function toggleAlbumPublishedAction(formData: FormData) {
  const store = await readStore()
  const album = store.albums.find((item) => item.id === String(formData.get('id') || ''))
  if (album) album.published = !album.published
  await writeStore(store)
  revalidatePublic()
  redirect('/admin/albums?saved=1')
}

export async function savePageAction(formData: FormData) {
  const store = await readStore()
  const key = String(formData.get('key'))
  const page = store.pages.find((item) => item.key === key)
  if (page) {
    const heroFiles = formFiles(formData, 'heroImageFiles')
    const galleryFiles = formFiles(formData, 'pageImageFiles')
    const [uploadedHero, uploadedGallery] = await Promise.all([uploadFiles(heroFiles), uploadFiles(galleryFiles)])
    const heroMedia = uploadedHero.map((item, index) => mediaFromUpload({ url: item.url, name: item.name, title: `${page.titleNl} hero ${index + 1}`, usage: [page.key, 'hero'], focalPoint: 'center' }))
    const uploadedMedia = uploadedGallery.map((item, index) => mediaFromUpload({ url: item.url, name: item.name, title: `${page.titleNl} gallery ${index + 1}`, usage: [page.key, 'gallery'], focalPoint: 'center' }))
    store.media.unshift(...heroMedia, ...uploadedMedia)

    page.heroTitleNl = String(formData.get('heroTitleNl') || '')
    page.heroTitleEn = String(formData.get('heroTitleEn') || '')
    page.heroSubtitleNl = String(formData.get('heroSubtitleNl') || '')
    page.heroSubtitleEn = String(formData.get('heroSubtitleEn') || '')
    page.primaryCtaNl = String(formData.get('primaryCtaNl') || '')
    page.primaryCtaEn = String(formData.get('primaryCtaEn') || '')
    page.secondaryCtaNl = String(formData.get('secondaryCtaNl') || '')
    page.secondaryCtaEn = String(formData.get('secondaryCtaEn') || '')
    page.bodyNl = String(formData.get('bodyNl') || '')
    page.bodyEn = String(formData.get('bodyEn') || '')
    page.heroImageId = heroMedia[0]?.id || String(formData.get('heroImageId') || '') || page.heroImageId || uploadedMedia[0]?.id || ''
    page.galleryImageIds = [...formData.getAll('galleryImageIds').map(String).filter(Boolean), ...uploadedMedia.map((media) => media.id)]
  }
  await writeStore(store)
  revalidatePublic()
  redirect('/admin/pages?saved=1')
}

export async function saveFaqAction(formData: FormData) {
  const store = await readStore()
  store.faqs.unshift({ id: `faq-${Date.now()}`, pageKey: String(formData.get('pageKey') || ''), language: String(formData.get('language') || 'nl') as 'nl' | 'en', question: String(formData.get('question') || ''), answer: String(formData.get('answer') || ''), published: true, order: Number(formData.get('order') || 0) })
  await writeStore(store)
  revalidatePublic()
  redirect('/admin/faqs?saved=1')
}

export async function toggleEventPublishedAction(formData: FormData) {
  const store = await readStore()
  const id = String(formData.get('id') || '')
  const event = store.events.find((item) => item._id === id)
  if (event) event.published = event.published === false
  await writeStore(store)
  revalidatePublic()
  redirect('/admin/events?saved=1')
}


export async function deleteEventAction(formData: FormData) {
  const store = await readStore()
  const id = String(formData.get('id') || '')
  store.events = store.events.filter((event) => event._id !== id)
  await writeStore(store)
  revalidatePublic()
  redirect('/admin/events?deleted=1')
}

export async function deleteAlbumAction(formData: FormData) {
  const store = await readStore()
  const id = String(formData.get('id') || '')
  store.albums = store.albums.filter((album) => album.id !== id)
  await writeStore(store)
  revalidatePublic()
  redirect('/admin/albums?deleted=1')
}

export async function updateMediaAction(formData: FormData) {
  const store = await readStore()
  const id = String(formData.get('id') || '')
  const media = store.media.find((item) => item.id === id)
  if (media) {
    media.title = String(formData.get('title') || media.title)
    media.altNl = String(formData.get('altNl') || '')
    media.altEn = String(formData.get('altEn') || '')
    media.usage = String(formData.get('usage') || '').split(',').map((item) => item.trim()).filter(Boolean)
    media.focalPoint = String(formData.get('focalPoint') || 'center')
    const replacementFiles = formFiles(formData, 'replacementFiles')
    const uploadedReplacement = await uploadFiles(replacementFiles)
    const replacementUrl = uploadedReplacement[0]?.url || String(formData.get('replacementUrl') || '').trim()
    if (replacementUrl) media.url = replacementUrl
  }
  await writeStore(store)
  revalidatePath('/admin/media')
  revalidatePublic()
  redirect('/admin/media?saved=1')
}

export async function deleteMediaAction(formData: FormData) {
  const store = await readStore()
  const id = String(formData.get('id') || '')
  const used = store.pages.some((page) => page.heroImageId === id || page.galleryImageIds?.includes(id)) || store.events.some((event) => event.galleryImageIds?.includes(id)) || store.albums.some((album) => album.coverImageId === id || album.imageIds.includes(id))
  if (!used) {
    store.media = store.media.filter((item) => item.id !== id)
    await writeStore(store)
  }
  revalidatePath('/admin/media')
  redirect(used ? '/admin/media?error=in-use' : '/admin/media?deleted=1')
}


export async function bulkDeleteMediaAction(formData: FormData) {
  const store = await readStore()
  const ids = new Set(formData.getAll('mediaIds').map(String).filter(Boolean))
  const isUsed = (id: string) => store.pages.some((page) => page.heroImageId === id || page.galleryImageIds?.includes(id)) || store.events.some((event) => event.galleryImageIds?.includes(id) || store.media.find((media) => media.id === id)?.url === event.imageUrl) || store.albums.some((album) => album.coverImageId === id || album.imageIds.includes(id))
  const blocked = [...ids].some(isUsed)
  if (!blocked) {
    store.media = store.media.filter((item) => !ids.has(item.id))
    await writeStore(store)
  }
  revalidatePath('/admin/media')
  revalidatePublic()
  redirect(blocked ? '/admin/media?error=in-use' : '/admin/media?deleted=1')
}

export async function updateLeadStatusAction(formData: FormData) {
  const store = await readStore()
  const id = String(formData.get('id'))
  const lead = store.leads.find((item) => item.id === id)
  if (lead) lead.status = String(formData.get('status')) as typeof lead.status
  await writeStore(store)
  redirect('/admin/leads?saved=1')
}

export async function saveSeoAction(formData: FormData) {
  const store = await readStore()
  const pageKey = String(formData.get('pageKey'))
  const language = String(formData.get('language')) as 'nl' | 'en'
  const index = store.seo.findIndex((item) => item.pageKey === pageKey && item.language === language)
  const item = { pageKey, language, seoTitle: String(formData.get('seoTitle') || ''), metaDescription: String(formData.get('metaDescription') || ''), ogTitle: String(formData.get('ogTitle') || ''), ogDescription: String(formData.get('ogDescription') || ''), canonicalUrl: String(formData.get('canonicalUrl') || ''), socialImageId: String(formData.get('socialImageId') || '') }
  if (index >= 0) store.seo[index] = item
  else store.seo.push(item)
  await writeStore(store)
  revalidatePublic()
  redirect('/admin/seo?saved=1')
}

export async function saveSettingsAction(formData: FormData) {
  const store = await readStore()
  store.settings = { phone: String(formData.get('phone') || ''), email: String(formData.get('email') || ''), whatsapp: String(formData.get('whatsapp') || ''), address: String(formData.get('address') || ''), instagram: String(formData.get('instagram') || ''), tiktok: String(formData.get('tiktok') || ''), openingHours: String(formData.get('openingHours') || '').split('\n').map((line) => line.trim()).filter(Boolean) }
  await writeStore(store)
  revalidatePublic()
  redirect('/admin/settings?saved=1')
}

export async function createLeadAction(input: Parameters<typeof createLead>[0]) {
  return createLead(input)
}
