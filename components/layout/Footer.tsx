'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getLanguageFromPath, localizedPaths, navItems, ui } from '@/lib/i18n'
import { images, site } from '@/lib/site'
import SafeImage from '@/components/ui/SafeImage'

export default function Footer() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  const lang = getLanguageFromPath(pathname || '')
  const t = ui[lang]
  const href = (key: string) => localizedPaths[key][lang]

  return <footer className="relative overflow-hidden border-t border-white/10 bg-[#080607] pt-20">
    <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_70%_0%,rgba(240,38,136,.24),transparent_34rem)]" />
    <div className="container-premium relative">
      <div className="luxury-panel grid gap-8 p-6 md:p-10 lg:grid-cols-[1.15fr_.85fr]">
        <div><p className="eyebrow">Cliniq Maastricht</p><h2 className="mt-4 text-5xl font-black leading-none tracking-[-0.03em] md:text-7xl">{t.footer.headline}</h2><p className="prose-premium mt-6 max-w-2xl">{t.footer.text}</p><div className="mt-8 flex flex-wrap gap-3"><Link className="btn-primary" href={href('nightlife')}>{t.common.viewAgenda}</Link><Link className="btn-secondary" href={href('eventSpace')}>{t.common.requestVenue}</Link><a data-track="locker_click" className="btn-secondary" href="/lockers">{t.footer.lockers}</a></div></div>
        <div className="image-frame min-h-[320px] rounded-3xl bg-black p-8"><SafeImage src={images.footerLogo} fallbackSrc={images.fallbackWide} alt="CLINIQ Maastricht" fill sizes="35vw" className="object-contain p-10" /></div>
      </div>
      <div className="grid gap-10 py-14 lg:grid-cols-[1.2fr_.8fr_.8fr_.8fr]">
        <div><p className="text-2xl font-black tracking-[0.35em]">CLINIQ</p><p className="mt-4 max-w-md text-white/70">{t.footer.intro}</p><div className="mt-5 flex gap-3"><a className="text-gold hover:text-white" href={site.instagram}>Instagram</a><a className="text-gold hover:text-white" href={site.tiktok}>TikTok</a></div></div>
        <div><h2 className="eyebrow">{t.footer.navigation}</h2><div className="mt-4 grid gap-2">{navItems.map((item) => <Link className="text-white/70 hover:text-white" key={item.key} href={localizedPaths[item.key][lang]}>{item.labels[lang]}</Link>)}<Link className="text-white/70 hover:text-white" href={href('jobs')}>{lang === 'nl' ? 'Vacatures' : 'Jobs'}</Link><Link className="text-white/70 hover:text-white" href={href('houseRules')}>House rules</Link></div></div>
        <div><h2 className="eyebrow">Contact</h2><address className="mt-4 not-italic text-white/70"><p>{site.address.street}</p><p>{site.address.postalCode} {site.address.city}</p><p className="mt-3"><a href={`tel:${site.phone}`}>{site.phone}</a></p><p><a href={`mailto:${site.email}`}>{site.email}</a></p></address></div>
        <div><h2 className="eyebrow">{t.footer.groups}</h2><div className="mt-4 grid gap-2"><Link className="text-white/70 hover:text-white" href={href('workshop')}>{t.footer.bachelor}</Link><Link className="text-white/70 hover:text-white" href={href('eventSpace')}>{t.footer.corporate}</Link><Link className="text-white/70 hover:text-white" href={href('eventSpace')}>{t.footer.venue}</Link><Link className="text-white/70 hover:text-white" href={href('contact')}>{t.footer.route}</Link></div></div>
      </div>
    </div>
  </footer>
}
