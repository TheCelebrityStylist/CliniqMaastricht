import { unstable_cache } from 'next/cache'
import { getGoogleAccessToken, googleSyncConfigured } from './auth'

export type GoogleEventType = 'regular' | 'featured' | 'special' | 'private'

export type GoogleSheetEvent = {
  id: string
  slug: string
  date: string
  weekday: string
  title: { nl: string; en: string }
  artistName: string
  eventType: GoogleEventType
  openingTime: string
  closingTime: string
  minimumAge: string
  published: boolean
  featured: boolean
  showDetailPage: boolean
  imageUrl: string | null
  albumUrl: string | null
  ticketUrl: string | null
  description: { nl: string; en: string }
}

export type EventsSyncResult = {
  syncedAt: string
  count: number
  rowCount: number
  skipped: number
  events: GoogleSheetEvent[]
  configured: boolean
}

const REQUIRED_HEADERS = [
  'date',
  'artist_name',
  'display_name',
  'event_type',
  'opening_time',
  'closing_time',
  'minimum_age',
  'published',
  'featured',
  'show_detail_page',
  'image_url',
  'album_url',
  'ticket_url',
  'description_nl',
  'description_en',
]

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function value(row: Record<string, string>, key: string) {
  return (row[key] || '').trim()
}

function parseBoolean(raw: string, fallback: boolean) {
  const normalized = raw.trim().toLowerCase()
  if (!normalized) return fallback
  if (['true', 'yes', 'ja', '1', 'y'].includes(normalized)) return true
  if (['false', 'no', 'nee', '0', 'n'].includes(normalized)) return false
  return fallback
}

function normalizeDate(raw: string) {
  const input = raw.trim()
  let year = ''
  let month = ''
  let day = ''
  let match = input.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (match) [, year, month, day] = match
  else {
    match = input.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/)
    if (!match) return null
    ;[, day, month, year] = match
  }
  const iso = `${year}-${month}-${day}`
  const date = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return null
  if (date.toISOString().slice(0, 10) !== iso) return null
  return iso
}

function weekdayFor(isoDate: string) {
  return WEEKDAYS[new Date(`${isoDate}T00:00:00Z`).getUTCDay()]
}

function defaultsFor(weekday: string) {
  if (weekday === 'Thursday') return { openingTime: '22:00', closingTime: '02:00', minimumAge: '18+' }
  if (weekday === 'Friday' || weekday === 'Saturday') return { openingTime: '22:00', closingTime: '03:00', minimumAge: '21+' }
  return { openingTime: '', closingTime: '', minimumAge: '' }
}

function mapArtistName(name: string) {
  const normalized = name.trim().toLowerCase()
  if (normalized === 'sidney') return 'DJ SDNX'
  if (normalized === 'len') return 'DJ Hadless'
  if (normalized === 'big rob') return 'DJ BIG ROB'
  return name.trim()
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeEventType(raw: string): GoogleEventType {
  const normalized = raw.trim().toLowerCase()
  if (normalized === 'featured' || normalized === 'special' || normalized === 'private') return normalized
  return 'regular'
}

function normalizeRows(values: string[][]): EventsSyncResult {
  const [headerRow = [], ...rows] = values
  const headers = headerRow.map((header) => header.trim())
  const missing = REQUIRED_HEADERS.filter((header) => !headers.includes(header))
  if (missing.length) {
    console.warn(`Google events sheet missing required headers: ${missing.join(', ')}`)
  }

  let skipped = 0
  const events = rows.flatMap((cells, index) => {
    const rowNumber = index + 2
    const row = Object.fromEntries(headers.map((header, cellIndex) => [header, cells[cellIndex] || '']))
    if (!Object.values(row).some((cell) => cell.trim())) return []

    const date = normalizeDate(value(row, 'date'))
    if (!date) {
      skipped += 1
      console.warn(`Skipping Google events row ${rowNumber}: invalid date "${value(row, 'date')}"`)
      return []
    }

    const weekday = weekdayFor(date)
    const defaults = defaultsFor(weekday)
    const eventType = normalizeEventType(value(row, 'event_type'))
    const artistName = value(row, 'artist_name') ? mapArtistName(value(row, 'artist_name')) : 'CLINIQ'
    const displayName = value(row, 'display_name') || artistName || 'CLINIQ'
    const featured = parseBoolean(value(row, 'featured'), false) || eventType === 'featured'
    const published = parseBoolean(value(row, 'published'), true)
    const showDetailFallback = eventType === 'featured' || eventType === 'special'
    const showDetailPage = parseBoolean(value(row, 'show_detail_page'), showDetailFallback)
    const descriptionNl = eventType === 'regular' ? '' : value(row, 'description_nl')
    const descriptionEn = eventType === 'regular' ? '' : value(row, 'description_en')

    return [{
      id: `${date}-${slugify(displayName || artistName || 'cliniq')}-${rowNumber}`,
      slug: `${date}-${slugify(displayName || artistName || 'cliniq')}`,
      date,
      weekday,
      title: { nl: displayName, en: displayName },
      artistName,
      eventType,
      openingTime: value(row, 'opening_time') || defaults.openingTime,
      closingTime: value(row, 'closing_time') || defaults.closingTime,
      minimumAge: value(row, 'minimum_age') || defaults.minimumAge,
      published,
      featured,
      showDetailPage,
      imageUrl: value(row, 'image_url') || null,
      albumUrl: value(row, 'album_url') || null,
      ticketUrl: value(row, 'ticket_url') || null,
      description: { nl: descriptionNl, en: descriptionEn },
    }]
  })

  return {
    syncedAt: new Date().toISOString(),
    count: events.length,
    rowCount: rows.length,
    skipped,
    events,
    configured: true,
  }
}

async function fetchEventsFromSheetUncached(): Promise<EventsSyncResult> {
  if (!googleSyncConfigured() || !process.env.GOOGLE_SHEET_ID) {
    return { syncedAt: new Date().toISOString(), count: 0, rowCount: 0, skipped: 0, events: [], configured: false }
  }

  const sheetName = process.env.GOOGLE_EVENTS_SHEET_NAME || 'Events'
  const token = await getGoogleAccessToken('https://www.googleapis.com/auth/spreadsheets.readonly')
  const range = encodeURIComponent(`${sheetName}!A:Z`)
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/${range}`
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Google Sheets fetch failed: ${response.status} ${body}`)
  }
  const data = await response.json() as { values?: string[][] }
  return normalizeRows(data.values || [])
}

export async function fetchEventsFromSheet(): Promise<EventsSyncResult> {
  try {
    return await fetchEventsFromSheetUncached()
  } catch (error) {
    console.error('Google events sync failed', error)
    return { syncedAt: new Date().toISOString(), count: 0, rowCount: 0, skipped: 0, events: [], configured: googleSyncConfigured() && Boolean(process.env.GOOGLE_SHEET_ID) }
  }
}

export const getCachedEventsFromSheet = unstable_cache(fetchEventsFromSheet, ['google-events-from-sheet'], { revalidate: 600, tags: ['google-events'] })

export async function getEventsFromSheet() {
  const result = await getCachedEventsFromSheet()
  return result.events
}
