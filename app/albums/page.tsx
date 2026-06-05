import { metadata } from '@/lib/seo'
import { getPhotoAlbums } from '@/lib/admin/public'
import { AlbumGrid } from '@/components/gallery/AlbumGrid'

export async function generateMetadata() { return metadata('Foto’s uitgaan Maastricht | Cliniq albums', 'Bekijk fotoalbums van clubnachten, cocktail workshops en events bij Cliniq Maastricht.', '/albums') }

export default async function AlbumsPage() {
  const albums = await getPhotoAlbums()
  return <section className="container-premium pt-36 pb-24"><p className="eyebrow">Foto’s uitgaan Maastricht</p><h1 className="h1 mt-5 max-w-5xl">Nights at Cliniq.</h1><p className="prose-premium mt-7 max-w-3xl">Blader door foto’s van clubnachten, workshops en private events. Deel je favoriete avond en beleef de sfeer van Cliniq Maastricht opnieuw.</p><div className="mt-12"><AlbumGrid albums={albums} /></div></section>
}
