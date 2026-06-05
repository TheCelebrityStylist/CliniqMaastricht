'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { put } from '@vercel/blob'
import { createLead, createMedia, readStore, upsertEvent, writeStore } from './store'
import { clearAdminCookie, hasAdminCredentials, setAdminCookie, signAdminSession, validateAdminCredentials } from './auth'

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
    ticketUrl: String(formData.get('ticketUrl') || ''),
    imageUrl: String(formData.get('manualImageUrl') || formData.get('imageUrl') || ''),
    featured: formData.get('featured') === 'on',
    published: formData.get('published') === 'on',
  })
  revalidatePath('/')
  revalidatePath('/uitgaan')
  revalidatePath('/en/nightlife')
  redirect('/admin/events?saved=1')
}

export async function saveMediaAction(formData: FormData) {
  const file = formData.get('file')
  let url = String(formData.get('url') || '')

  if (file instanceof File && file.size > 0) {
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
      const blob = await put(`cliniq/${Date.now()}-${safeName}`, file, { access: 'public' })
      url = blob.url
    } catch (error) {
      console.error('Vercel Blob upload failed.', error)
      redirect('/admin/media?error=blob-token')
    }
  }

  if (!url) redirect('/admin/media?error=image-required')
  await createMedia({ url, title: String(formData.get('title') || ''), altNl: String(formData.get('altNl') || ''), altEn: String(formData.get('altEn') || ''), usage: String(formData.get('usage') || '').split(',').map((item) => item.trim()).filter(Boolean) })
  revalidatePath('/admin/media')
  redirect('/admin/media?saved=1')
}

export async function savePageAction(formData: FormData) {
  const store = await readStore()
  const key = String(formData.get('key'))
  const page = store.pages.find((item) => item.key === key)
  if (page) {
    page.heroTitleNl = String(formData.get('heroTitleNl') || '')
    page.heroTitleEn = String(formData.get('heroTitleEn') || '')
    page.heroSubtitleNl = String(formData.get('heroSubtitleNl') || '')
    page.heroSubtitleEn = String(formData.get('heroSubtitleEn') || '')
    page.primaryCtaNl = String(formData.get('primaryCtaNl') || '')
    page.primaryCtaEn = String(formData.get('primaryCtaEn') || '')
    page.heroImageId = String(formData.get('heroImageId') || '')
  }
  await writeStore(store)
  revalidatePath('/')
  redirect('/admin/pages?saved=1')
}

export async function saveFaqAction(formData: FormData) {
  const store = await readStore()
  store.faqs.unshift({ id: `faq-${Date.now()}`, pageKey: String(formData.get('pageKey') || ''), language: String(formData.get('language') || 'nl') as 'nl' | 'en', question: String(formData.get('question') || ''), answer: String(formData.get('answer') || ''), published: true, order: Number(formData.get('order') || 0) })
  await writeStore(store)
  revalidatePath('/')
  redirect('/admin/faqs?saved=1')
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
  revalidatePath('/')
  redirect('/admin/seo?saved=1')
}

export async function saveSettingsAction(formData: FormData) {
  const store = await readStore()
  store.settings = { phone: String(formData.get('phone') || ''), email: String(formData.get('email') || ''), whatsapp: String(formData.get('whatsapp') || ''), address: String(formData.get('address') || ''), instagram: String(formData.get('instagram') || ''), tiktok: String(formData.get('tiktok') || ''), openingHours: String(formData.get('openingHours') || '').split('\n').map((line) => line.trim()).filter(Boolean) }
  await writeStore(store)
  revalidatePath('/')
  redirect('/admin/settings?saved=1')
}

export async function createLeadAction(input: Parameters<typeof createLead>[0]) {
  return createLead(input)
}
