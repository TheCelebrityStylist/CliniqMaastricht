import { NextResponse } from 'next/server'
import { fetchDriveImage } from '@/lib/google/photosFromDrive'

export const revalidate = 600

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const response = await fetchDriveImage(id)
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Google Drive image proxy failed', error)
    return NextResponse.redirect(new URL('/images/cliniq/fallback-wide.svg', _request.url))
  }
}
