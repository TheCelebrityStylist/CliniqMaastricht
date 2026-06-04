'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { localizedPaths, navItems } from '@/lib/i18n'
import { site } from '@/lib/site'

export default function Footer() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return <footer className="border-t border-white/10 bg-black py-14">
    <div className="container-premium grid gap-10 lg:grid-cols-[1.2fr_.8fr_.8fr]">
      <div><p className="text-2xl font-black tracking-[0.35em]">CLINIQ</p><p className="mt-4 max-w-md text-white/70">Premium nightlife, cocktail workshops and event space in the heart of Maastricht.</p></div>
      <div><h2 className="eyebrow">Navigation</h2><div className="mt-4 grid gap-2">{navItems.map((item) => <Link className="text-white/70 hover:text-white" key={item.key} href={localizedPaths[item.key].nl}>{item.labels.nl}</Link>)}<Link className="text-white/70 hover:text-white" href="/vacatures">Vacatures</Link><Link className="text-white/70 hover:text-white" href="/house-rules">House rules</Link><a data-track="locker_click" className="text-white/70 hover:text-white" href="/lockers">Lockers</a></div></div>
      <div><h2 className="eyebrow">Contact</h2><address className="mt-4 not-italic text-white/70"><p>{site.address.street}</p><p>{site.address.postalCode} {site.address.city}</p><p className="mt-3"><a href={`tel:${site.phone}`}>{site.phone}</a></p><p><a href={`mailto:${site.email}`}>{site.email}</a></p></address></div>
    </div>
  </footer>
}
