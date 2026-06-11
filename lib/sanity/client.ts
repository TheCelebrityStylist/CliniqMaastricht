import { createClient } from 'next-sanity'

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const sanityApiVersion = '2026-06-11'

export function hasSanityConfig() {
  return Boolean(sanityProjectId && sanityDataset)
}

export const sanityReadClient = createClient({
  projectId: sanityProjectId || 'placeholder',
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: true,
  token: process.env.SANITY_API_READ_TOKEN,
})

export const sanityWriteClient = createClient({
  projectId: sanityProjectId || 'placeholder',
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}, fallback: T): Promise<T> {
  if (!hasSanityConfig()) return fallback
  try {
    return await sanityReadClient.fetch<T>(query, params, { next: { revalidate: 60 } })
  } catch (error) {
    console.error('[sanity] public fetch failed; using fallback content', error)
    return fallback
  }
}
