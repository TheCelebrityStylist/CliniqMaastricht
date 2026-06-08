import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { getPhotosSyncStatus } from '@/lib/google/photosFromDrive'

export async function POST() {
  revalidateTag('google-photos')
  const status = await getPhotosSyncStatus()
  return NextResponse.json(status)
}

export async function GET() {
  return POST()
}
