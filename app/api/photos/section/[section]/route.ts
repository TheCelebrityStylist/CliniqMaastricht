import { NextResponse } from 'next/server'
import { getPhotosForSection, type PhotoSection } from '@/lib/google/photosFromDrive'

export const revalidate = 600

const validSections = new Set(['homepage', 'uitgaan', 'workshop', 'event-space', 'contact'])

export async function GET(_request: Request, { params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  if (!validSections.has(section)) return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
  const photos = await getPhotosForSection(section as PhotoSection)
  return NextResponse.json({ section, count: photos.length, photos })
}
