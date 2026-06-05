import Link from 'next/link'
import { notFound } from 'next/navigation'
import SafeImage from '@/components/ui/SafeImage'
import { getPhotoAlbumBySlug } from '@/lib/admin/public'
import { metadata } from '@/lib/seo'
import { images } from '@/lib/site'
import { ui } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const album = await getPhotoAlbumBySlug(slug)
  if (!album) return metadata('Album niet gevonden', 'Dit Cliniq fotoalbum is niet gevonden.', `/fotos/${slug}`)
  return metadata(`${album.titleNl} | Cliniq foto’s Maastricht`, album.descriptionNl || `Bekijk alle foto's van ${album.titleNl} bij Cliniq Maastricht.`, `/fotos/${album.slug}`)
}

export default async function PhotoAlbumDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams?: Promise<{ photo?: string }> }) {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const album = await getPhotoAlbumBySlug(slug)
  if (!album) notFound()
  const activeIndex = Math.min(Math.max(Number(query?.photo || 0), 0), Math.max(album.photos.length - 1, 0))
  const active = album.photos[activeIndex]
  const t = ui.nl
  return <section className="container-premium pt-36 pb-24"><Link href="/fotos" className="text-white/70 hover:text-white">← {t.common.backAlbums}</Link><div className="mt-8 grid gap-8 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow">{album.date} · {t.albums.eyebrow}</p><h1 className="h1 mt-5">{album.titleNl}</h1><p className="prose-premium mt-6">{album.descriptionNl || t.albums.detailIntro}</p><div className="mt-8 flex gap-3"><Link className="btn-primary" href={`/fotos/${album.slug}?photo=${Math.max(activeIndex - 1, 0)}`}>{t.common.previous}</Link><Link className="btn-secondary" href={`/fotos/${album.slug}?photo=${Math.min(activeIndex + 1, album.photos.length - 1)}`}>{t.common.next}</Link></div></div><div className="image-frame aspect-[4/5]"><SafeImage src={active?.url || album.cover?.url} fallbackSrc={images.fallbackWide} alt={active?.altNl || album.titleNl} fill priority sizes="(min-width:1024px) 55vw, 100vw" className="object-cover brightness-[1.08]" objectPosition={active?.focalPoint || album.cover?.focalPoint || 'center'} /></div></div><div className="mt-12 grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">{album.photos.map((photo, index)=><Link key={photo.id} href={`/fotos/${album.slug}?photo=${index}`} className={`image-frame aspect-square rounded-2xl ${index===activeIndex?'ring-2 ring-gold':''}`}><SafeImage src={photo.url} fallbackSrc={images.fallbackWide} alt={photo.altNl || album.titleNl} fill sizes="20vw" className="object-cover brightness-[1.08]" objectPosition={photo.focalPoint || 'center'} /></Link>)}</div></section>
}
