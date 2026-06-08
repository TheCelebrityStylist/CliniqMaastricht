import type { Metadata } from 'next'
import { getPhotoAlbums } from '@/lib/admin/public'
import { AlbumGrid } from '@/components/gallery/AlbumGrid'
import { ui } from '@/lib/i18n'
import { COPY } from '@/lib/content'

export const revalidate = 600

export const metadata: Metadata = {
  title: "Foto's Cliniq Maastricht — Clubavonden, Events & Workshops",
  description: "Bekijk foto's van Cliniq Maastricht. Sfeerimpressies van clubavonden, privéfeesten, cocktail workshops en events op de Platielstraat 9A in het centrum van Maastricht.",
  alternates: {
    canonical: 'https://www.cliniqmaastricht.nl/fotos',
  },
  openGraph: {
    title: "Foto's | CLINIQ Maastricht",
    description: "Sfeerimpressies van clubavonden, events en cocktail workshops. Platielstraat 9A, Maastricht.",
    url: 'https://www.cliniqmaastricht.nl/fotos',
    siteName: 'Cliniq Maastricht',
    locale: 'nl_NL',
    type: 'website',
  },
}


export default async function PhotosPage() {
  const albums = await getPhotoAlbums()
  const t = ui.nl.albums
  return <section className="container-premium pt-36 pb-24"><p className="eyebrow">{t.eyebrow}</p><h1 className="h1 mt-5 max-w-5xl">Foto's van Cliniq Maastricht</h1><p className="prose-premium mt-7 max-w-3xl">{t.intro}</p><div className="mt-12">{albums.length ? <AlbumGrid albums={albums} /> : <div className="card rounded-[2rem] p-8"><h2 className="h3">{COPY.nl.fotos.emptyTitle}</h2><p className="mt-3 text-white/70">{COPY.nl.fotos.emptyBody}</p></div>}</div><div className="seo-panel mt-12 rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 text-white/72">{COPY.nl.fotos.seoText}</div></section>
}
