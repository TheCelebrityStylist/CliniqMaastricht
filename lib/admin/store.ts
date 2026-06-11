import { promises as fs } from 'fs'
import path from 'path'
import { createClient } from '@vercel/postgres'
import { defaultAgendaEvents, defaultStore } from './defaults'
import type { AdminStore, AgendaEvent, DjImage, Lead, MediaAsset, PhotoAlbum } from './types'

const dataDir = path.join(process.cwd(), '.data')
const dataFile = path.join(dataDir, 'cliniq-admin.json')
const isProduction = process.env.NODE_ENV === 'production'
const isProductionBuild = process.env.NEXT_PHASE === 'phase-production-build' || process.env.npm_lifecycle_event === 'build'
let loggedDatabaseSource: string | null = null

function cloneDefaultStore(): AdminStore {
  return JSON.parse(JSON.stringify(defaultStore)) as AdminStore
}


export function getDatabaseUrl() {
  const source = process.env.POSTGRES_URL
    ? 'POSTGRES_URL'
    : process.env.DATABASE_URL
      ? 'DATABASE_URL'
      : process.env.PRISMA_DATABASE_URL
        ? 'PRISMA_DATABASE_URL'
        : null
  const url = process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.PRISMA_DATABASE_URL || ''

  if (source && loggedDatabaseSource !== source) {
    console.info(`[admin-store] using ${source} for Postgres persistence`)
    loggedDatabaseSource = source
  }

  return url
}

async function withDb<T>(callback: (client: ReturnType<typeof createClient>) => Promise<T>) {
  const connectionString = getDatabaseUrl()

  if (!connectionString) {
    throw new Error('No Postgres connection string found. Set POSTGRES_URL, DATABASE_URL or PRISMA_DATABASE_URL.')
  }

  const client = createClient({ connectionString })

  try {
    await client.connect()
    return await callback(client)
  } finally {
    await client.end()
  }
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(',')}}`
  }
  return JSON.stringify(value)
}


function normalizeLead(input: Partial<Lead> & { formType?: string; type?: string; createdAt?: string; submittedAt?: string; status?: string }): Lead {
  const submittedAt = input.submittedAt || input.createdAt || new Date().toISOString()
  const status = input.status === 'contacted' || input.status === 'handled' ? input.status : 'new'
  const type = input.type === 'event_space' || input.formType === 'event-space' || input.formType === 'event_space'
    ? 'event_space'
    : input.type === 'workshop' || input.formType === 'workshop'
      ? 'workshop'
      : input.type === 'job' || input.formType === 'job'
        ? 'job'
        : 'contact'
  return {
    id: input.id || slugify(`${type}-${input.name || 'lead'}-${submittedAt}`),
    type,
    formType: type,
    status,
    sourcePage: input.sourcePage || '',
    name: input.name || 'Unknown',
    email: input.email || '',
    phone: input.phone,
    message: input.message,
    submittedAt,
    createdAt: submittedAt,
    payload: input.payload || {},
    notes: input.notes,
  }
}

function normalizeStore(parsed: Partial<AdminStore>): AdminStore {
  return {
    ...cloneDefaultStore(),
    ...parsed,
    media: parsed.media?.length ? parsed.media : cloneDefaultStore().media,
    events: parsed.events || cloneDefaultStore().events,
    pages: parsed.pages?.length ? parsed.pages : cloneDefaultStore().pages,
    faqs: parsed.faqs && parsed.faqs.length >= 12 ? parsed.faqs : mergeDefaultFaqs(parsed.faqs || []),
    albums: parsed.albums?.length ? parsed.albums : cloneDefaultStore().albums,
    leads: (parsed.leads || []).map((lead) => normalizeLead(lead)),
    seo: parsed.seo || [],
    djImages: mergeDefaultDjImages(parsed.djImages || [], (parsed as { djPresets?: Array<{ name?: string; aliases?: string[]; active?: boolean; defaultImageId?: string }> }).djPresets || [], parsed.media || []),
    jobs: parsed.jobs?.length ? parsed.jobs : cloneDefaultStore().jobs,
    analytics: parsed.analytics || [],
    settings: parsed.settings || cloneDefaultStore().settings,
  }
}


function normalizeEventTitle(value?: string) {
  return (value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function isPlaceholderEvent(event: AgendaEvent) {
  const title = normalizeEventTitle(event.titleNl || event.title)
  return title === 'cliniq friday' || title === 'cliniq saturday' || title === 'friday at cliniq' || title === 'saturday at cliniq'
}

function mergeDefaultEvents(currentEvents: AdminStore['events']) {
  const merged = [...currentEvents]
  for (const planned of defaultAgendaEvents) {
    const sameIdIndex = merged.findIndex((event) => event._id === planned._id)
    const sameDateSameDjIndex = merged.findIndex((event) => event.date === planned.date && normalizeEventTitle(event.titleNl || event.title) === normalizeEventTitle(planned.titleNl || planned.title))
    const placeholderIndex = merged.findIndex((event) => event.date === planned.date && isPlaceholderEvent(event))
    const index = sameIdIndex >= 0 ? sameIdIndex : sameDateSameDjIndex >= 0 ? sameDateSameDjIndex : placeholderIndex

    if (index >= 0) {
      const existing = merged[index]
      const preserveManual = !isPlaceholderEvent(existing)
      merged[index] = {
        ...planned,
        ...(preserveManual ? {
          _id: existing._id,
          slug: existing.slug || planned.slug,
          imageUrl: existing.imageUrl || planned.imageUrl,
          imageAlt: existing.imageAlt || planned.imageAlt,
          imagePosition: existing.imagePosition || planned.imagePosition,
          ticketUrl: existing.ticketUrl,
          eventType: existing.eventType || planned.eventType,
          showDetailCTA: existing.showDetailCTA || planned.showDetailCTA,
          relatedAlbumId: existing.relatedAlbumId,
          galleryImageIds: existing.galleryImageIds,
        } : {}),
        featured: existing.featured === true,
        published: true,
      }
    } else {
      merged.push(planned)
    }
  }
  return merged.sort((a, b) => `${a.date} ${a.startTime || ''}`.localeCompare(`${b.date} ${b.startTime || ''}`))
}


function mergeDefaultFaqs(currentFaqs: AdminStore['faqs']) {
  const defaultFaqs = cloneDefaultStore().faqs
  const seen = new Set(currentFaqs.map((faq) => `${faq.pageKey}:${faq.language}:${faq.question}`))
  return [
    ...currentFaqs,
    ...defaultFaqs.filter((faq) => !seen.has(`${faq.pageKey}:${faq.language}:${faq.question}`)),
  ]
}


function legacyPresetToDjImage(input: Partial<DjImage> & { name?: string; defaultImageId?: string; imageUrl?: string | null; aliases?: string[]; active?: boolean; slug?: string; id?: string }) {
  const name = input.name || 'DJ'
  const slug = input.slug || slugify(name)
  return {
    id: input.id || `dj-${slug}`,
    name,
    slug,
    aliases: input.aliases || [],
    imageUrl: input.imageUrl || null,
    imageAltNl: input.imageAltNl || `DJ ${name} bij CLINIQ Maastricht`,
    imageAltEn: input.imageAltEn || `DJ ${name} at CLINIQ Maastricht`,
    active: input.active !== false,
    updatedAt: input.updatedAt || new Date().toISOString(),
  }
}

function mergeDefaultDjImages(currentImages: DjImage[] = [], legacyPresets: Array<{ name?: string; aliases?: string[]; active?: boolean; defaultImageId?: string }> = [], media: MediaAsset[] = []) {
  const defaults = cloneDefaultStore().djImages
  const convertedLegacy = legacyPresets.map((preset) => {
    const mediaUrl = media.find((item) => item.id === preset.defaultImageId)?.url || null
    return legacyPresetToDjImage({ ...preset, imageUrl: mediaUrl })
  })
  const current = [...currentImages, ...convertedLegacy].map((item) => legacyPresetToDjImage(item))
  const byName = new Map(current.map((image) => [normalizeEventTitle(image.name), image]))
  const merged = defaults.map((image) => byName.get(normalizeEventTitle(image.name)) || image)
  const defaultNames = new Set(defaults.map((image) => normalizeEventTitle(image.name)))
  return [...merged, ...current.filter((image) => !defaultNames.has(normalizeEventTitle(image.name)))]
}

async function ensureStore() {
  if (getDatabaseUrl()) return
  if (isProduction) throw new Error('Production admin persistence requires POSTGRES_URL, DATABASE_URL or PRISMA_DATABASE_URL.')
  await fs.mkdir(dataDir, { recursive: true })
  try {
    await fs.access(dataFile)
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(cloneDefaultStore(), null, 2))
  }
}

async function ensureDatabaseStore() {
  if (!getDatabaseUrl()) return false
  await withDb(async (client) => {
    await client.sql`CREATE TABLE IF NOT EXISTS cliniq_admin_store (id TEXT PRIMARY KEY, data JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`
  })
  return true
}

async function readDatabaseStore() {
  if (!getDatabaseUrl()) return null
  await ensureDatabaseStore()
  const result = await withDb(async (client) => {
    return client.sql<{ data: AdminStore }>`SELECT data FROM cliniq_admin_store WHERE id = 'main' LIMIT 1`
  })
  return result.rows[0]?.data ? JSON.stringify(result.rows[0].data) : null
}

export async function readStore(): Promise<AdminStore> {
  let databaseUrl: string | null
  try {
    databaseUrl = getDatabaseUrl()
  } catch (error) {
    if (isProductionBuild) {
      console.error('[admin-store] Postgres configuration failed during production build; rendering build-time defaults without writing fallback data.', error)
      return normalizeStore(cloneDefaultStore())
    }
    console.error('[admin-store] Postgres configuration failed; no production fallback will be used.', error)
    throw error
  }

  if (databaseUrl) {
    try {
      const raw = await readDatabaseStore()
      return normalizeStore(raw ? JSON.parse(raw) as Partial<AdminStore> : cloneDefaultStore())
    } catch (error) {
      if (isProductionBuild) {
        console.error('[admin-store] Postgres read failed during production build; rendering build-time defaults without writing fallback data.', error)
        return normalizeStore(cloneDefaultStore())
      }
      console.error('[admin-store] Postgres read failed; no production fallback will be used.', error)
      throw new Error('Database read failed. Admin data was not loaded.')
    }
  }

  if (isProductionBuild) return normalizeStore(cloneDefaultStore())

  await ensureStore()
  try {
    const raw = await fs.readFile(dataFile, 'utf8')
    return normalizeStore(JSON.parse(raw) as Partial<AdminStore>)
  } catch (error) {
    if (isProduction) throw new Error('Database read failed. Admin data was not loaded.')
    console.error('[admin-store] Local development file read failed; using defaults.', error)
    return cloneDefaultStore()
  }
}

export async function writeStore(store: AdminStore) {
  const normalizedPayload = JSON.parse(JSON.stringify(store)) as AdminStore
  const payload = JSON.stringify(normalizedPayload, null, 2)
  const databaseUrl = getDatabaseUrl()

  if (databaseUrl) {
    try {
      await ensureDatabaseStore()
      await withDb(async (client) => {
        await client.sql`INSERT INTO cliniq_admin_store (id, data, updated_at) VALUES ('main', ${payload}::jsonb, NOW()) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`
      })
      const result = await withDb(async (client) => {
        return client.sql<{ data: AdminStore }>`SELECT data FROM cliniq_admin_store WHERE id = 'main' LIMIT 1`
      })
      const saved = result.rows[0]?.data
      if (!saved || stableStringify(saved) !== stableStringify(normalizedPayload)) throw new Error('Save failed. Data was not persisted.')
      console.info('[admin-store] Postgres write/read verification succeeded')
      return
    } catch (error) {
      console.error('[admin-store] Postgres write/verification failed; no production fallback will be used.', error)
      throw new Error('Save failed. Data was not persisted.')
    }
  }

  if (isProduction) throw new Error('Production admin persistence requires POSTGRES_URL, DATABASE_URL or PRISMA_DATABASE_URL.')
  await fs.mkdir(dataDir, { recursive: true })
  await fs.writeFile(dataFile, payload)
  const saved = JSON.parse(await fs.readFile(dataFile, 'utf8')) as AdminStore
  if (stableStringify(saved) !== stableStringify(normalizedPayload)) throw new Error('Save failed. Data was not persisted.')
  console.info('[admin-store] Local development file write/read verification succeeded')
}

export async function getDatabaseStatus() {
  try {
    const source = process.env.POSTGRES_URL ? 'POSTGRES_URL' : process.env.DATABASE_URL ? 'DATABASE_URL' : process.env.PRISMA_DATABASE_URL ? 'PRISMA_DATABASE_URL' : 'Missing env var'
    const databaseUrl = getDatabaseUrl()
    if (!databaseUrl) return { status: 'Missing env var' as const, provider: 'Local development file store', message: 'POSTGRES_URL, DATABASE_URL or PRISMA_DATABASE_URL is not set.' }
    await ensureDatabaseStore()
    await withDb(async (client) => {
      await client.sql`SELECT 1 AS ok`
    })
    return { status: 'Connected' as const, provider: source, message: 'Postgres read connection succeeded.' }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database error'
    if (message.includes('Missing Postgres') || message.includes('POSTGRES_URL or DATABASE_URL') || message.includes('No Postgres connection string')) {
      return { status: 'Missing env var' as const, provider: 'Missing env var', message }
    }
    return { status: message.includes('read') ? 'Read failed' as const : 'Write failed' as const, provider: 'Postgres', message }
  }
}

export async function testDatabaseSave() {
  const store = await readStore()
  const marker = `db-test-${Date.now()}`
  const previous = store.settings.address
  store.settings = { ...store.settings, address: marker }
  await writeStore(store)
  const afterWrite = await readStore()
  if (afterWrite.settings.address !== marker) throw new Error('Save failed. Data was not persisted.')
  afterWrite.settings = { ...afterWrite.settings, address: previous }
  await writeStore(afterWrite)
  const restored = await readStore()
  if (restored.settings.address !== previous) throw new Error('Database cleanup verification failed.')
  return { ok: true, marker }
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
    slug: { current: input.slug?.current || slugify(`${input.date}-${input.title}`) },
    date: input.date,
    startTime: input.startTime || '22:00',
    endTime: input.endTime || '03:00',
    ageLimit: input.ageLimit || '21+',
    shortDescription: input.shortDescription,
    shortDescriptionNl: input.shortDescriptionNl || input.shortDescription,
    shortDescriptionEn: input.shortDescriptionEn || input.shortDescription,
    fullDescription: input.fullDescription,
    fullDescriptionNl: input.fullDescriptionNl,
    fullDescriptionEn: input.fullDescriptionEn,
    ticketUrl: input.ticketUrl,
    featured: Boolean(input.featured),
    eventType: input.eventType || (input.featured ? 'featured' : 'regular'),
    showDetailCTA: Boolean(input.showDetailCTA),
    published: input.published !== false,
    imageId: input.imageId,
    imageUrl: input.imageUrl,
    imageAlt: input.imageAlt,
    imagePosition: input.imagePosition || 'center',
    galleryImageIds: input.galleryImageIds || [],
    relatedAlbumId: input.relatedAlbumId,
  }
  const index = store.events.findIndex((item) => item._id === id)
  if (index >= 0) store.events[index] = event
  else store.events.unshift(event)
  await writeStore(store)
  return event
}

export async function createMedia(input: Pick<MediaAsset, 'url' | 'title' | 'altNl' | 'altEn'> & { usage?: string[]; focalPoint?: string }) {
  const store = await readStore()
  const now = new Date().toISOString()
  const media: MediaAsset = { id: slugify(`${input.title}-${Date.now()}`), url: input.url, title: input.title, altNl: input.altNl, altEn: input.altEn, tags: input.usage || [], usage: input.usage || [], focalPoint: input.focalPoint || 'center', createdAt: now, updatedAt: now }
  store.media.unshift(media)
  await writeStore(store)
  return media
}


export async function upsertAlbum(input: Partial<PhotoAlbum> & { titleNl: string; date: string; imageIds?: string[] }) {
  const store = await readStore()
  const id = input.id || slugify(`${input.titleNl}-${input.date}`)
  const album: PhotoAlbum = {
    id,
    slug: input.slug || slugify(`${input.titleNl}-${input.date}`),
    titleNl: input.titleNl,
    titleEn: input.titleEn || input.titleNl,
    descriptionNl: input.descriptionNl,
    descriptionEn: input.descriptionEn,
    date: input.date,
    relatedEventId: input.relatedEventId,
    coverImageId: input.coverImageId || input.imageIds?.[0],
    coverImageUrl: input.coverImageUrl,
    imageIds: input.imageIds || [],
    photos: input.photos || (input.imageIds || []).map((imageId, index) => ({ imageId, imageUrl: '', order: index })),
    published: input.published !== false,
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  const index = store.albums.findIndex((item) => item.id === id)
  if (index >= 0) store.albums[index] = album
  else store.albums.unshift(album)
  await writeStore(store)
  return album
}

function normalizeLeadType(input?: string): Lead['type'] {
  if (input === 'event-space' || input === 'event_space') return 'event_space'
  if (input === 'workshop' || input === 'job' || input === 'contact') return input
  return 'contact'
}

type CreateLeadInput = Omit<Partial<Lead>, 'id' | 'createdAt' | 'submittedAt' | 'status' | 'type' | 'formType'> & { type?: string; formType?: string; status?: Lead['status']; name: string; email: string; message?: string }

export async function createLead(input: CreateLeadInput) {
  const store = await readStore()
  const now = new Date().toISOString()
  const type = normalizeLeadType(input.type || input.formType)
  const lead: Lead = {
    id: slugify(`${type}-${input.name}-${Date.now()}`),
    type,
    formType: type,
    status: input.status || 'new',
    name: input.name,
    email: input.email,
    phone: input.phone,
    message: input.message,
    sourcePage: input.sourcePage || '',
    submittedAt: now,
    createdAt: now,
    payload: input.payload || {},
    notes: input.notes,
  }
  store.leads.unshift(lead)
  await writeStore(store)
  const saved = (await readStore()).leads.find((item) => item.id === lead.id)
  if (!saved || saved.email !== lead.email || saved.submittedAt !== lead.submittedAt) throw new Error('Save failed. Data was not persisted.')
  return saved
}
