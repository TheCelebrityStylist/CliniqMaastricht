import { metadata } from '@/lib/seo'
import { getPhotoAlbums } from '@/lib/admin/public'
import { AlbumGrid } from '@/components/gallery/AlbumGrid'
import { ui } from '@/lib/i18n'

export async function generateMetadata() { return metadata(ui.nl.albums.metaTitle, ui.nl.albums.metaDescription, '/fotos') }

export default async function PhotosPage() {
  const albums = await getPhotoAlbums()
  const t = ui.nl.albums
  return <section className="container-premium pt-36 pb-24"><p className="eyebrow">{t.eyebrow}</p><h1 className="h1 mt-5 max-w-5xl">{t.title}</h1><p className="prose-premium mt-7 max-w-3xl">{t.intro}</p><div className="mt-12"><AlbumGrid albums={albums} /></div></section>
}
