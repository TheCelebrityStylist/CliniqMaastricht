'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { put } from '@vercel/blob'
import { createLead, createMedia, readStore, slugify, upsertAlbum, upsertEvent, writeStore } from './store'
import { clearAdminCookie, hasAdminCredentials, setAdminCookie, signAdminSession, validateAdminCredentials } from './auth'
import type { MediaAsset } from './types'

function formFiles(formData: FormData, key = 'files') {
  const files = formData.getAll(key).filter((file): file is File => file instanceof File && file.size > 0)
  const legacyFile = formData.get('file')
  if (legacyFile instanceof File && legacyFile.size > 0) files.push(legacyFile)
  return files
}

async function uploadFiles(files: File[]) {
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
  }
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

export async function saveEventAction(formData: FormData) {
  await upsertEvent({
    _id: String(formData.get('_id') || '') || undefined,
    title: String(formData.get('title') || ''),
    titleNl: String(formData.get('titleNl') || ''),
    titleEn: String(formData.get('titleEn') || ''),
    subtitleNl: String(formData.get('subtitleNl') || ''),
    subtitleEn: String(formData.get('subtitleEn') || ''),
    date: String(formData.get('date') || ''),
    startTime: String(formData.get('startTime') || ''),
    endTime: String(formData.get('endTime') || ''),
    ageLimit: String(formData.get('ageLimit') || ''),
    shortDescriptionNl: String(formData.get('shortDescriptionNl') || ''),
    shortDescriptionEn: String(formData.get('shortDescriptionEn') || ''),
    fullDescriptionNl: String(formData.get('fullDescriptionNl') || ''),
    fullDescriptionEn: String(formData.get('fullDescriptionEn') || ''),
    ticketUrl: String(formData.get('ticketUrl') || ''),
    imageUrl: String(formData.get('manualImageUrl') || formData.get('imageUrl') || ''),
    imagePosition: String(formData.get('imagePosition') || 'center'),
    featured: formData.get('featured') === 'on',
    published: formData.get('published') === 'on',
  })
  revalidatePublic()
  redirect('/admin/events?saved=1')
}

export async function saveMediaAction(formData: FormData) {
  const files = formFiles(formData)
  const uploaded = await uploadFiles(files)
  const urls = [
    ...String(formData.get('url') || '').split('\n').map((item) => item.trim()).filter(Boolean).map((url) => ({ url })),
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
    date: String(formData.get('date') || ''),
    relatedEventId: String(formData.get('relatedEventId') || ''),
    coverImageId: String(formData.get('coverImageId') || '') || imageIds[0],
    imageIds,
    published: formData.get('published') === 'on',
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
    const files = formFiles(formData, 'pageImageFiles')
    const uploaded = await uploadFiles(files)
    const uploadedMedia = uploaded.map((item, index) => mediaFromUpload({ url: item.url, name: item.name, title: `${page.titleNl} gallery ${index + 1}`, usage: [page.key, 'gallery'], focalPoint: 'center' }))
    store.media.unshift(...uploadedMedia)

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
    page.heroImageId = String(formData.get('heroImageId') || '') || page.heroImageId || uploadedMedia[0]?.id || ''
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
