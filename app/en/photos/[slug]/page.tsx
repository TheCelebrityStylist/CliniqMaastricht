import Link from 'next/link'
import { notFound } from 'next/navigation'
import SafeImage from '@/components/ui/SafeImage'
import PhotoLightbox from '@/components/gallery/PhotoLightbox'
import { getPhotoAlbumBySlug } from '@/lib/admin/public'
import { metadata } from '@/lib/seo'
import { images } from '@/lib/site'
import { ui } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const album = await getPhotoAlbumBySlug(slug)
  if (!album) return metadata('Album not found', 'This CLINIQ photo album was not found.', `/en/photos/${slug}`, 'en')
  return metadata(`${album.titleEn || album.titleNl} | CLINIQ Maastricht photos`, album.descriptionEn || `View photos from ${album.titleEn || album.titleNl} at CLINIQ Maastricht.`, `/en/photos/${album.slug}`, 'en')
}

export default async function PhotoAlbumDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams?: Promise<{ photo?: string }> }) {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const album = await getPhotoAlbumBySlug(slug)
  if (!album) notFound()
  const activeIndex = Math.min(Math.max(Number(query?.photo || 0), 0), Math.max(album.photos.length - 1, 0))
  const t = ui.en
  const title = album.titleEn || album.titleNl
  return <section className="container-premium pt-36 pb-24">
    <PhotoLightbox photos={album.photos} activeIndex={activeIndex} basePath={`/en/photos/${album.slug}`} title={title} backLabel={t.common.backAlbums} previousLabel={t.common.previous} nextLabel={t.common.next} />
    <div className="mt-12 columns-2 gap-3 md:columns-3 lg:columns-4">{album.photos.map((photo, index)=><Link key={photo.id} href={`/en/photos/${album.slug}?photo=${index}`} className={`image-frame mb-3 block break-inside-avoid rounded-2xl ${index===activeIndex?'ring-2 ring-gold':''}`}><div className="relative aspect-[3/4]"><SafeImage src={photo.url} fallbackSrc={images.fallbackWide} alt={photo.altEn || title} fill sizes="25vw" className="object-cover brightness-[1.08] transition duration-500 hover:scale-105" objectPosition={photo.focalPoint || 'center'} /></div></Link>)}</div>
  </section>
}
