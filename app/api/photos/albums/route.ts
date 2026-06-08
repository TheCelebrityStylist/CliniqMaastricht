import { NextResponse } from 'next/server'
import { getDriveAlbums } from '@/lib/google/photosFromDrive'

export const revalidate = 600

export async function GET() {
  const albums = await getDriveAlbums()
  return NextResponse.json({ count: albums.length, albums })
}
