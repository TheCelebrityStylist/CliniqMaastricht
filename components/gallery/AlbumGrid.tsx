import Link from 'next/link'
import SafeImage from '@/components/ui/SafeImage'
import { images } from '@/lib/site'
import { localizedPaths, ui } from '@/lib/i18n'
import type { MediaAsset } from '@/lib/admin/types'

type AlbumCard = { slug: string; titleNl: string; titleEn?: string; descriptionNl?: string; descriptionEn?: string; date: string; cover?: MediaAsset; photos?: MediaAsset[] }

export function AlbumGrid({ albums, lang = 'nl' }: { albums: AlbumCard[]; lang?: 'nl' | 'en' }) {
  const base = localizedPaths.albums[lang]
  const t = ui[lang]
  return <div className="grid gap-5 md:grid-cols-3">
    {albums.map((album) => {
      const title = lang === 'en' ? album.titleEn || album.titleNl : album.titleNl
      const description = lang === 'en' ? album.descriptionEn || album.descriptionNl : album.descriptionNl
      const alt = (lang === 'en' ? album.cover?.altEn : album.cover?.altNl) || title
      return <Link key={album.slug} href={`${base}/${album.slug}`} className="group image-frame aspect-[4/5] p-5">
        <SafeImage src={album.cover?.url} fallbackSrc={images.fallbackWide} alt={alt} fill sizes="(min-width:1024px) 33vw, 100vw" className="-z-10 object-cover brightness-[1.08] transition duration-700 group-hover:scale-105" objectPosition={album.cover?.focalPoint || 'center'} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/35 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5"><p className="eyebrow">{album.date} · {album.photos?.length || 0} {t.common.photos}</p><h3 className="mt-2 text-3xl font-black tracking-[-0.025em]">{title}</h3>{description ? <p className="mt-3 line-clamp-2 text-sm text-white/70">{description}</p> : null}<p className="mt-3 font-black text-gold">{t.common.allPhotos} →</p></div>
      </Link>
    })}
  </div>
}
