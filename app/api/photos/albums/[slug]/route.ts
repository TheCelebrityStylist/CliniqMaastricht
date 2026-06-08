import { NextResponse } from 'next/server'
import { getDriveAlbumBySlug } from '@/lib/google/photosFromDrive'

export const revalidate = 600

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const album = await getDriveAlbumBySlug(slug)
  if (!album) return NextResponse.json({ error: 'Album not found' }, { status: 404 })
  return NextResponse.json(album)
}
