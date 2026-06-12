export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const sanityApiVersion = '2026-06-11'

export function hasSanityWriteConfig() {
  return Boolean(sanityProjectId && sanityDataset && process.env.SANITY_API_WRITE_TOKEN)
}

function sanityMutateUrl() {
  if (!sanityProjectId) throw new Error('Form backend not configured')
  return `https://${sanityProjectId}.api.sanity.io/v${sanityApiVersion}/data/mutate/${sanityDataset}`
}

export async function createSanityDocument<T>(document: T): Promise<T> {
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!hasSanityWriteConfig() || !token) throw new Error('Form backend not configured')

  const response = await fetch(sanityMutateUrl(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mutations: [{ create: document }] }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    console.error('[sanity] lead create failed', response.status, detail)
    throw new Error('Could not save form submission')
  }

  return document
}
