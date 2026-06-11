export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const sanityApiVersion = '2026-06-11'

export function hasSanityConfig() {
  return Boolean(sanityProjectId && sanityDataset)
}

function sanityApiUrl(path: string) {
  if (!sanityProjectId) throw new Error('Sanity project ID is not configured')
  return `https://${sanityProjectId}.api.sanity.io/v${sanityApiVersion}${path}`
}

function getReadHeaders() {
  const headers: Record<string, string> = {}
  if (process.env.SANITY_API_READ_TOKEN) headers.Authorization = `Bearer ${process.env.SANITY_API_READ_TOKEN}`
  return headers
}

function getWriteHeaders() {
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) throw new Error('Form backend not configured')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

export const sanityReadClient = {
  async fetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
    const url = new URL(sanityApiUrl(`/data/query/${sanityDataset}`))
    url.searchParams.set('query', query)
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(`$${key}`, JSON.stringify(value))
    }

    const response = await fetch(url, {
      headers: getReadHeaders(),
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      throw new Error(`Sanity read failed with status ${response.status}`)
    }

    const payload = (await response.json()) as { result: T }
    return payload.result
  },
}

export const sanityWriteClient = {
  async create<T>(document: T): Promise<T> {
    const response = await fetch(sanityApiUrl(`/data/mutate/${sanityDataset}`), {
      method: 'POST',
      headers: getWriteHeaders(),
      body: JSON.stringify({ mutations: [{ create: document }] }),
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new Error(`Sanity write failed with status ${response.status}${detail ? `: ${detail}` : ''}`)
    }

    return document
  },
}

export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}, fallback: T): Promise<T> {
  if (!hasSanityConfig()) return fallback
  try {
    return await sanityReadClient.fetch<T>(query, params)
  } catch (error) {
    console.error('[sanity] public fetch failed; using fallback content', error)
    return fallback
  }
}
