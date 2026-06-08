import { unstable_cache } from 'next/cache'
import { put } from '@vercel/blob'
import { getGoogleAccessToken, googleSyncConfigured } from './auth'

export type PhotoSection = 'homepage' | 'uitgaan' | 'workshop' | 'event-space' | 'contact'

export type GoogleDrivePhoto = {
  id: string
  name: string
  url: string
  thumbnailUrl: string
  alt: { nl: string; en: string }
  folder: string
  category: string
}

export type GoogleDriveAlbum = {
  slug: string
  title: { nl: string; en: string }
  date: string
  coverImage: GoogleDrivePhoto | null
  photoCount: number
  photos: GoogleDrivePhoto[]
}

export type PhotosSyncStatus = {
  syncedAt: string
  configured: boolean
  status: 'OK' | 'Error' | 'Not configured'
  folderCounts: Record<string, number>
  albumCount: number
  error?: string
}

type DriveFile = {
  id: string
  name: string
  mimeType: string
  thumbnailLink?: string
  webContentLink?: string
  webViewLink?: string
}

const SECTION_FOLDERS: Record<PhotoSection, { env: string; label: string }> = {
  homepage: { env: 'GOOGLE_DRIVE_HOMEPAGE_FOLDER_ID', label: 'Homepage' },
  uitgaan: { env: 'GOOGLE_DRIVE_UITGAAN_FOLDER_ID', label: 'Uitgaan' },
  workshop: { env: 'GOOGLE_DRIVE_WORKSHOP_FOLDER_ID', label: 'Cocktail Workshop' },
  'event-space': { env: 'GOOGLE_DRIVE_EVENT_SPACE_FOLDER_ID', label: 'Ruimte Huren' },
  contact: { env: 'GOOGLE_DRIVE_CONTACT_FOLDER_ID', label: 'Contact' },
}

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp'])

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function isImage(file: DriveFile) {
  const extension = file.name.split('.').pop()?.toLowerCase() || ''
  return file.mimeType.startsWith('image/') && IMAGE_EXTENSIONS.has(extension)
}

function configuredForDrive() {
  return googleSyncConfigured()
}

export function getDriveFolderConfig() {
  return {
    sections: Object.fromEntries(Object.entries(SECTION_FOLDERS).map(([section, config]) => [section, { ...config, folderId: process.env[config.env] || '' }])),
    albumsRootFolderId: process.env.GOOGLE_DRIVE_ALBUMS_ROOT_FOLDER_ID || '',
  }
}

async function driveFetch<T>(path: string) {
  const token = await getGoogleAccessToken('https://www.googleapis.com/auth/drive.readonly')
  const response = await fetch(`https://www.googleapis.com/drive/v3/${path}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Google Drive fetch failed: ${response.status} ${body}`)
  }
  return response.json() as Promise<T>
}

async function listChildren(folderId: string, foldersOnly = false) {
  const q = [`'${folderId}' in parents`, 'trashed = false']
  if (foldersOnly) q.push("mimeType = 'application/vnd.google-apps.folder'")
  const params = new URLSearchParams({
    q: q.join(' and '),
    fields: 'files(id,name,mimeType,thumbnailLink,webContentLink,webViewLink)',
    orderBy: 'name',
    pageSize: '1000',
    supportsAllDrives: 'true',
    includeItemsFromAllDrives: 'true',
  })
  const data = await driveFetch<{ files?: DriveFile[] }>(`files?${params.toString()}`)
  return data.files || []
}

async function downloadDriveFile(fileId: string) {
  const token = await getGoogleAccessToken('https://www.googleapis.com/auth/drive.readonly')
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
  if (!response.ok) throw new Error(`Google Drive media download failed: ${response.status}`)
  return response
}

async function imageUrlFor(file: DriveFile) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const response = await downloadDriveFile(file.id)
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const blob = await put(`google-drive/${file.id}-${slugify(file.name) || 'photo'}.${extension}`, response.body!, {
        access: 'public',
        contentType: response.headers.get('content-type') || file.mimeType,
        addRandomSuffix: false,
      })
      return blob.url
    } catch (error) {
      console.error(`Google Drive to Vercel Blob sync failed for ${file.name}`, error)
    }
  }
  return `/api/photos/file/${file.id}`
}

async function toPhoto(file: DriveFile, folder: string, category: string): Promise<GoogleDrivePhoto> {
  const url = await imageUrlFor(file)
  return {
    id: file.id,
    name: file.name,
    url,
    thumbnailUrl: url,
    alt: {
      nl: `Foto van CLINIQ Maastricht - ${folder}`,
      en: `Photo of CLINIQ Maastricht - ${folder}`,
    },
    folder,
    category,
  }
}

async function getSectionPhotosUncached(section: PhotoSection) {
  if (!configuredForDrive()) return []
  const config = SECTION_FOLDERS[section]
  const folderId = process.env[config.env]
  if (!folderId) return []
  const files = (await listChildren(folderId)).filter(isImage)
  return Promise.all(files.map((file) => toPhoto(file, config.label, section)))
}

async function getAlbumsUncached() {
  if (!configuredForDrive() || !process.env.GOOGLE_DRIVE_ALBUMS_ROOT_FOLDER_ID) return []
  const folders = (await listChildren(process.env.GOOGLE_DRIVE_ALBUMS_ROOT_FOLDER_ID, true))
    .filter((folder) => !folder.name.startsWith('DRAFT') && !folder.name.startsWith('_'))
  const albums = await Promise.all(folders.map(async (folder) => {
    const match = folder.name.match(/^(\d{4}-\d{2}-\d{2})\s+(.+)$/)
    const date = match?.[1] || ''
    const title = match?.[2] || folder.name
    const photos = await Promise.all((await listChildren(folder.id)).filter(isImage).map((file) => toPhoto(file, folder.name, 'album')))
    return {
      slug: slugify(folder.name),
      title: { nl: title, en: title },
      date,
      coverImage: photos[0] || null,
      photoCount: photos.length,
      photos,
    }
  }))
  return albums.filter((album) => album.photoCount > 0).sort((a, b) => b.date.localeCompare(a.date))
}

export const getCachedSectionPhotos = unstable_cache(getSectionPhotosUncached, ['google-drive-section-photos'], { revalidate: 600, tags: ['google-photos'] })
export const getCachedDriveAlbums = unstable_cache(getAlbumsUncached, ['google-drive-albums'], { revalidate: 600, tags: ['google-photos'] })

export async function getPhotosForSection(section: PhotoSection) {
  try {
    return await getCachedSectionPhotos(section)
  } catch (error) {
    console.error(`Google Drive section photo sync failed for ${section}`, error)
    return []
  }
}

export async function getDriveAlbums() {
  try {
    return await getCachedDriveAlbums()
  } catch (error) {
    console.error('Google Drive album sync failed', error)
    return []
  }
}

export async function getDriveAlbumBySlug(slug: string) {
  const albums = await getDriveAlbums()
  return albums.find((album) => album.slug === slug) || null
}

export async function getPhotosSyncStatus(): Promise<PhotosSyncStatus> {
  if (!configuredForDrive()) return { syncedAt: new Date().toISOString(), configured: false, status: 'Not configured', folderCounts: {}, albumCount: 0 }
  try {
    const entries = await Promise.all((Object.keys(SECTION_FOLDERS) as PhotoSection[]).map(async (section) => [section, (await getPhotosForSection(section)).length] as const))
    const albums = await getDriveAlbums()
    return { syncedAt: new Date().toISOString(), configured: true, status: 'OK', folderCounts: Object.fromEntries(entries), albumCount: albums.length }
  } catch (error) {
    console.error('Google Drive sync status failed', error)
    return { syncedAt: new Date().toISOString(), configured: true, status: 'Error', folderCounts: {}, albumCount: 0, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function fetchDriveImage(fileId: string) {
  return downloadDriveFile(fileId)
}
