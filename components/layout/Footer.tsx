'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { localizedPaths, navItems } from '@/lib/i18n'
import { images, site } from '@/lib/site'
import SafeImage from '@/components/ui/SafeImage'

export default function Footer() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return <footer className="relative overflow-hidden border-t border-white/10 bg-[#080607] pt-20">
    <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_70%_0%,rgba(240,38,136,.24),transparent_34rem)]" />
    <div className="container-premium relative">
      <div className="luxury-panel grid gap-8 p-6 md:p-10 lg:grid-cols-[1.15fr_.85fr]">
        <div><p className="eyebrow">Cliniq Maastricht</p><h2 className="mt-4 text-5xl font-black leading-none tracking-[-0.055em] md:text-7xl">De nacht hoeft niet gewoon te zijn.</h2><p className="prose-premium mt-6 max-w-2xl">Kom voor de agenda, boek een cocktail workshop of huur de ruimte voor een bedrijfsfeest, verjaardag of private event. Eén locatie in hartje Maastricht waar bar, licht, sound en sfeer al kloppen.</p><div className="mt-8 flex flex-wrap gap-3"><Link className="btn-primary" href="/uitgaan">Bekijk agenda</Link><Link className="btn-secondary" href="/event-space">Vraag ruimte aan</Link><a data-track="locker_click" className="btn-secondary" href="/lockers">Lockers</a></div></div>
        <div className="grid grid-cols-3 gap-3">{[images.bar, images.club, images.party].map((src, index)=><div key={src} className={`image-frame aspect-[3/4] rounded-3xl ${index===1?'mt-10':''}`}><SafeImage src={src} fallbackSrc={images.fallbackWide} alt={`Cliniq Maastricht footer sfeerbeeld ${index+1}`} fill sizes="16vw" className="object-cover brightness-[1.08]" /></div>)}</div>
      </div>
      <div className="grid gap-10 py-14 lg:grid-cols-[1.2fr_.8fr_.8fr_.8fr]">
        <div><p className="text-2xl font-black tracking-[0.35em]">CLINIQ</p><p className="mt-4 max-w-md text-white/70">Premium nightlife, cocktail workshops, photo albums and event space in the heart of Maastricht.</p><div className="mt-5 flex gap-3"><a className="text-gold hover:text-white" href={site.instagram}>Instagram</a><a className="text-gold hover:text-white" href={site.tiktok}>TikTok</a></div></div>
        <div><h2 className="eyebrow">Navigation</h2><div className="mt-4 grid gap-2">{navItems.map((item) => <Link className="text-white/70 hover:text-white" key={item.key} href={localizedPaths[item.key].nl}>{item.labels.nl}</Link>)}<Link className="text-white/70 hover:text-white" href="/albums">Fotoalbums</Link><Link className="text-white/70 hover:text-white" href="/vacatures">Vacatures</Link><Link className="text-white/70 hover:text-white" href="/house-rules">House rules</Link></div></div>
        <div><h2 className="eyebrow">Contact</h2><address className="mt-4 not-italic text-white/70"><p>{site.address.street}</p><p>{site.address.postalCode} {site.address.city}</p><p className="mt-3"><a href={`tel:${site.phone}`}>{site.phone}</a></p><p><a href={`mailto:${site.email}`}>{site.email}</a></p></address></div>
        <div><h2 className="eyebrow">Voor groepen</h2><div className="mt-4 grid gap-2"><Link className="text-white/70 hover:text-white" href="/cocktail-workshop">Vrijgezellenfeest</Link><Link className="text-white/70 hover:text-white" href="/event-space">Bedrijfsfeest</Link><Link className="text-white/70 hover:text-white" href="/event-space">Feestzaal Maastricht</Link><Link className="text-white/70 hover:text-white" href="/contact">Route & contact</Link></div></div>
      </div>
    </div>
  </footer>
}
