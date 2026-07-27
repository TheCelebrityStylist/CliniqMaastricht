import fs from 'node:fs'
import path from 'node:path'
import type { PilePhoto } from '@/components/experience/PhotoPile'

const MANIFEST_PATH = path.join(process.cwd(), 'public', 'photos', 'nights', 'graded', 'manifest.json')

type MediaManifestEntry = { id: string; widths: Record<string, string> }

// Reads the manifest scripts/media.mjs writes at build time (see package.json "prebuild"). Server
// component only - filesystem read, not for client code. Returns [] if the pipeline hasn't run
// yet (e.g. no source photos committed) so callers can skip rendering the pile entirely rather
// than error.
export function getPilePhotos(lang: 'nl' | 'en'): PilePhoto[] {
  let entries: MediaManifestEntry[] = []
  try {
    entries = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
  } catch {
    return []
  }

  return entries.map((entry, index) => ({
    id: entry.id,
    src400: entry.widths['400'],
    src800: entry.widths['800'],
    alt: lang === 'nl' ? `Avond bij CLINIQ Maastricht, foto ${index + 1}` : `Night at CLINIQ Maastricht, photo ${index + 1}`,
  }))
}
