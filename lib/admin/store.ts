import { promises as fs } from 'fs'
import path from 'path'
import { sql } from '@vercel/postgres'
import { defaultStore } from './defaults'
import type { AdminStore, AgendaEvent, Lead, MediaAsset } from './types'

const isVercel = Boolean(process.env.VERCEL)
const dataDir = isVercel ? path.join('/tmp', 'cliniq-admin') : path.join(process.cwd(), '.data')
const dataFile = path.join(dataDir, 'cliniq-admin.json')

function cloneDefaultStore(): AdminStore {
  return JSON.parse(JSON.stringify(defaultStore)) as AdminStore
}

async function ensureStore() {
  if (process.env.POSTGRES_URL) return
  await fs.mkdir(dataDir, { recursive: true })
  try {
    await fs.access(dataFile)
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(cloneDefaultStore(), null, 2))
  }
}

async function ensureDatabaseStore() {
  if (!process.env.POSTGRES_URL) return
  await sql`CREATE TABLE IF NOT EXISTS cliniq_admin_store (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`
}

async function readDatabaseStore() {
  if (!process.env.POSTGRES_URL) return null
  await ensureDatabaseStore()
  const result = await sql<{ data: AdminStore }>`SELECT data FROM cliniq_admin_store WHERE id = 'main' LIMIT 1`
  return result.rows[0]?.data ? JSON.stringify(result.rows[0].data) : null
}

export async function readStore(): Promise<AdminStore> {
  await ensureStore()
  try {
    let databaseRaw: string | null = null
    try {
      databaseRaw = await readDatabaseStore()
    } catch (error) {
      console.error('Postgres admin store read failed; using file/default fallback.', error)
    }
    let raw = databaseRaw
    if (!raw) {
      try {
        raw = await fs.readFile(dataFile, 'utf8')
      } catch {
        raw = JSON.stringify(cloneDefaultStore())
      }
    }
    const parsed = JSON.parse(raw) as Partial<AdminStore>
    return {
      ...cloneDefaultStore(),
      ...parsed,
      media: parsed.media?.length ? parsed.media : cloneDefaultStore().media,
      events: parsed.events?.length ? parsed.events : cloneDefaultStore().events,
      pages: parsed.pages?.length ? parsed.pages : cloneDefaultStore().pages,
      faqs: parsed.faqs?.length ? parsed.faqs : cloneDefaultStore().faqs,
      leads: parsed.leads || [],
      seo: parsed.seo || [],
      jobs: parsed.jobs?.length ? parsed.jobs : cloneDefaultStore().jobs,
      analytics: parsed.analytics || [],
      settings: parsed.settings || cloneDefaultStore().settings,
    }
  } catch {
    return cloneDefaultStore()
  }
}

export async function writeStore(store: AdminStore) {
  const payload = JSON.stringify(store, null, 2)
  if (process.env.POSTGRES_URL) {
    try {
      await ensureDatabaseStore()
      await sql`INSERT INTO cliniq_admin_store (id, data, updated_at) VALUES ('main', ${payload}::jsonb, NOW()) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`
      return
    } catch (error) {
      console.error('Postgres admin store write failed; using temporary file fallback.', error)
    }
  }

  await fs.mkdir(dataDir, { recursive: true })
  await fs.writeFile(dataFile, payload)
}

export function slugify(input: string) {
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `item-${Date.now()}`
}

export async function upsertEvent(input: Partial<AgendaEvent> & { title: string; date: string }) {
  const store = await readStore()
  const id = input._id || slugify(`${input.title}-${input.date}`)
  const event: AgendaEvent = {
    _id: id,
    title: input.title,
    titleNl: input.titleNl || input.title,
    titleEn: input.titleEn || input.title,
    subtitle: input.subtitle,
    subtitleNl: input.subtitleNl,
    subtitleEn: input.subtitleEn,
    slug: { current: input.slug?.current || slugify(input.title) },
    date: input.date,
    startTime: input.startTime || '22:00',
    endTime: input.endTime || '03:00',
    ageLimit: input.ageLimit || '21+',
    shortDescription: input.shortDescription,
    shortDescriptionNl: input.shortDescriptionNl || input.shortDescription,
    shortDescriptionEn: input.shortDescriptionEn || input.shortDescription,
    fullDescription: input.fullDescription,
    ticketUrl: input.ticketUrl,
    featured: Boolean(input.featured),
    published: input.published !== false,
    imageUrl: input.imageUrl,
    imageAlt: input.imageAlt,
    galleryImageIds: input.galleryImageIds || [],
  }
  const index = store.events.findIndex((item) => item._id === id)
  if (index >= 0) store.events[index] = event
  else store.events.unshift(event)
  await writeStore(store)
  return event
}

export async function createMedia(input: Pick<MediaAsset, 'url' | 'title' | 'altNl' | 'altEn'> & { usage?: string[] }) {
  const store = await readStore()
  const media: MediaAsset = { id: slugify(`${input.title}-${Date.now()}`), url: input.url, title: input.title, altNl: input.altNl, altEn: input.altEn, usage: input.usage || [], createdAt: new Date().toISOString() }
  store.media.unshift(media)
  await writeStore(store)
  return media
}

export async function createLead(input: Omit<Lead, 'id' | 'createdAt' | 'status'> & { status?: Lead['status'] }) {
  const store = await readStore()
  const lead: Lead = { ...input, id: slugify(`${input.formType}-${input.name}-${Date.now()}`), createdAt: new Date().toISOString(), status: input.status || 'new' }
  store.leads.unshift(lead)
  await writeStore(store)
  return lead
}
