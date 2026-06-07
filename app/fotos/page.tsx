import { metadata } from '@/lib/seo'
import { getPhotoAlbums } from '@/lib/admin/public'
import { AlbumGrid } from '@/components/gallery/AlbumGrid'
import { ui } from '@/lib/i18n'
import { COPY } from '@/lib/content'

export async function generateMetadata() { return metadata(ui.nl.albums.metaTitle, ui.nl.albums.metaDescription, '/fotos') }

export default async function PhotosPage() {
  const albums = await getPhotoAlbums()
  const t = ui.nl.albums
  return <section className="container-premium pt-36 pb-24"><p className="eyebrow">{t.eyebrow}</p><h1 className="h1 mt-5 max-w-5xl">{t.title}</h1><p className="prose-premium mt-7 max-w-3xl">{t.intro}</p><div className="mt-12">{albums.length ? <AlbumGrid albums={albums} /> : <div className="card rounded-[2rem] p-8"><h2 className="h3">{COPY.nl.fotos.emptyTitle}</h2><p className="mt-3 text-white/70">{COPY.nl.fotos.emptyBody}</p></div>}</div><div className="seo-panel mt-12 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 text-white/72">{COPY.nl.fotos.seoText}</div></section>
}
