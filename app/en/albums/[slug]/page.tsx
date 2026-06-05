import Link from 'next/link'
import { notFound } from 'next/navigation'
import SafeImage from '@/components/ui/SafeImage'
import { getPhotoAlbumBySlug } from '@/lib/admin/public'
import { metadata } from '@/lib/seo'
import { images } from '@/lib/site'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const album = await getPhotoAlbumBySlug(slug)
  if (!album) return metadata('Album not found', 'This Cliniq photo album could not be found.', `/en/albums/${slug}`, 'en')
  return metadata(`${album.titleEn || album.titleNl} | Cliniq Maastricht photos`, `Browse all photos from ${album.titleEn || album.titleNl} at Cliniq Maastricht.`, `/en/albums/${album.slug}`, 'en')
}

export default async function AlbumDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams?: Promise<{ photo?: string }> }) {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const album = await getPhotoAlbumBySlug(slug)
  if (!album) notFound()
  const title = album.titleEn || album.titleNl
  const activeIndex = Math.min(Math.max(Number(query?.photo || 0), 0), Math.max(album.photos.length - 1, 0))
  const active = album.photos[activeIndex]
  return <section className="container-premium pt-36 pb-24"><Link href="/en/albums" className="text-white/70 hover:text-white">← All albums</Link><div className="mt-8 grid gap-8 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">{album.date} · Maastricht nightlife photos</p><h1 className="h1 mt-5">{title}</h1><p className="prose-premium mt-6">A curated selection from this Cliniq night. Share the album link or open a photo to browse through the evening.</p><div className="mt-8 flex gap-3"><Link className="btn-primary" href={`/en/albums/${album.slug}?photo=${Math.max(activeIndex - 1, 0)}`}>Previous</Link><Link className="btn-secondary" href={`/en/albums/${album.slug}?photo=${Math.min(activeIndex + 1, album.photos.length - 1)}`}>Next</Link></div></div><div className="image-frame aspect-[4/5]"><SafeImage src={active?.url || album.cover?.url} fallbackSrc={images.fallbackWide} alt={active?.altEn || title} fill priority sizes="(min-width:1024px) 55vw, 100vw" className="object-cover brightness-[1.08]" objectPosition={active?.focalPoint || album.cover?.focalPoint || 'center'} /></div></div><div className="mt-12 grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">{album.photos.map((photo, index)=><Link key={photo.id} href={`/en/albums/${album.slug}?photo=${index}`} className={`image-frame aspect-square rounded-2xl ${index===activeIndex?'ring-2 ring-gold':''}`}><SafeImage src={photo.url} fallbackSrc={images.fallbackWide} alt={photo.altEn || title} fill sizes="20vw" className="object-cover brightness-[1.08]" objectPosition={photo.focalPoint || 'center'} /></Link>)}</div></section>
}
