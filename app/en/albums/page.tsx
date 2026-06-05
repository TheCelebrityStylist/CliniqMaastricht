import { metadata } from '@/lib/seo'
import { getPhotoAlbums } from '@/lib/admin/public'
import { AlbumGrid } from '@/components/gallery/AlbumGrid'

export async function generateMetadata() { return metadata('Maastricht nightlife photos | Cliniq albums', 'Browse photo albums from club nights, cocktail workshops and private events at Cliniq Maastricht.', '/en/albums', 'en') }

export default async function AlbumsPage() {
  const albums = await getPhotoAlbums()
  return <section className="container-premium pt-36 pb-24"><p className="eyebrow">Maastricht nightlife photos</p><h1 className="h1 mt-5 max-w-5xl">Nights at Cliniq.</h1><p className="prose-premium mt-7 max-w-3xl">Browse club nights, workshops and private events. Share your favourite night and feel the Cliniq Maastricht atmosphere again.</p><div className="mt-12"><AlbumGrid albums={albums} lang="en" /></div></section>
}
