import { put } from '@vercel/blob'

export type UploadedImage = {
  url: string
  pathname: string
  contentType: string
  size: number
  uploadedAt: string
}

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const allowedNames = /\.(jpe?g|png|webp)$/i
const maxSize = 10 * 1024 * 1024

export function assertUploadConfigured() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error('BLOB_READ_WRITE_TOKEN is not configured.')
}

export function validateImageFile(file: File) {
  if (!allowedTypes.has(file.type) && !allowedNames.test(file.name)) throw new Error('Only JPG, PNG and WebP images are allowed.')
  if (file.size > maxSize) throw new Error('Image must be 10MB or smaller.')
}

export async function uploadImage(file: File, pathPrefix: string): Promise<UploadedImage> {
  assertUploadConfigured()
  validateImageFile(file)
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase()
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const pathname = `${pathPrefix.replace(/^\/+|\/+$/g, '')}/${stamp}-${Date.now()}-${safeName}`
  console.info('[image-upload] upload started', { pathname, contentType: file.type, size: file.size })
  const blob = await put(pathname, file, { access: 'public' })
  console.info('[image-upload] upload succeeded', { pathname, url: blob.url })
  return { url: blob.url, pathname, contentType: file.type || 'application/octet-stream', size: file.size, uploadedAt: new Date().toISOString() }
}
