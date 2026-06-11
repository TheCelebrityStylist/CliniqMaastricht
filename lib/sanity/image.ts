import imageUrlBuilder from '@sanity/image-url'
import { sanityDataset, sanityProjectId } from './client'

const builder = imageUrlBuilder({
  projectId: sanityProjectId || 'placeholder',
  dataset: sanityDataset,
})

export function urlForSanityImage(source: unknown) {
  return builder.image(source)
}
