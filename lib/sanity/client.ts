export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jlnikrdc'
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const sanityApiVersion = '2025-01-01'

export function hasSanityWriteConfig() {
  return Boolean(sanityProjectId && sanityDataset && process.env.SANITY_API_WRITE_TOKEN)
}

function sanityMutateUrl() {
  return `https://${sanityProjectId}.api.sanity.io/v${sanityApiVersion}/data/mutate/${sanityDataset}`
}

function sanityQueryUrl(query: string, params?: Record<string, string>) {
  const url = new URL(`https://${sanityProjectId}.api.sanity.io/v${sanityApiVersion}/data/query/${sanityDataset}`)
  url.searchParams.set('query', query)

  Object.entries(params || {}).forEach(([key, value]) => {
    url.searchParams.set(`$${key}`, JSON.stringify(value))
  })

  return url.toString()
}

export async function fetchSanity<T>(query: string, params?: Record<string, string>): Promise<T | null> {
  try {
    const response = await fetch(sanityQueryUrl(query, params), {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      console.error('[sanity] query failed', response.status, await response.text().catch(() => ''))
      return null
    }

    const json = await response.json()
    return json.result as T
  } catch (error) {
    console.error('[sanity] fetch failed', error)
    return null
  }
}

export async function createSanityDocument<T extends Record<string, unknown>>(document: T) {
  const token = process.env.SANITY_API_WRITE_TOKEN

  if (!hasSanityWriteConfig() || !token) {
    throw new Error('Form backend not configured')
  }

  const response = await fetch(sanityMutateUrl(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mutations: [{ create: document }],
    }),
  })

  if (!response.ok) {
    console.error('[sanity] document create failed', response.status, await response.text().catch(() => ''))
    throw new Error('Could not save form submission')
  }

  return document
}
