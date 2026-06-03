'use client'

import Link from 'next/link'
import { Instagram } from 'lucide-react'
import { useLang } from '@/lib/lang'
import { COPY, SITE, HOURS } from '@/lib/content'

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z"/>
  </svg>
)

const FOOTER_LINKS_NL = [
  { href: '/uitgaan',           label: 'Uitgaan' },
  { href: '/cocktail-workshop', label: 'Cocktail Workshop' },
  { href: '/event-space',       label: 'Ruimte Huren' },
  { href: '/artiesten',         label: 'Artiesten' },
  { href: '/vacatures',         label: 'Vacatures' },
  { href: '/house-rules',       label: 'Huisregels' },
]
const FOOTER_LINKS_EN = [
  { href: '/uitgaan',           label: 'Nightlife' },
  { href: '/cocktail-workshop', label: 'Cocktail Workshop' },
  { href: '/event-space',       label: 'Hire Venue' },
  { href: '/artiesten',         label: 'Artists' },
  { href: '/vacatures',         label: 'Jobs' },
  { href: '/house-rules',       label: 'House Rules' },
]

export default function Footer() {
  const { lang } = useLang()
  const t = COPY[lang]
  const footerLinks = lang === 'nl' ? FOOTER_LINKS_NL : FOOTER_LINKS_EN
  const dayLabels = [t.footer.thursday, t.footer.friday, t.footer.saturday]

  return (
    <footer className="bg-ink border-t border-white/6 pt-20 pb-10 px-8 md:px-16">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="font-display font-black text-xl tracking-[0.45em] text-white hover:text-magenta transition-colors">
              CLINIQ
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mt-5 font-body">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-4 mt-7 text-white/20">
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer"
                 className="hover:text-magenta transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={SITE.tiktok} target="_blank" rel="noopener noreferrer"
                 className="hover:text-magenta transition-colors" aria-label="TikTok">
                <TikTokIcon />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <h4 className="eyebrow mb-6">{t.footer.links.toUpperCase()}</h4>
            <ul className="space-y-3">
              {footerLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/45 text-sm hover:text-white transition-colors font-body"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div className="md:col-span-2">
            <h4 className="eyebrow mb-6">{t.footer.hours.toUpperCase()}</h4>
            <div className="space-y-3">
              {HOURS.map((h, i) => (
                <div key={h.abbr.nl} className="flex justify-between gap-4 text-sm">
                  <span className="text-white/45 font-body">{dayLabels[i]}</span>
                  <span className="text-white/25 font-body tabular-nums">{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="eyebrow mb-6">{t.footer.contact.toUpperCase()}</h4>
            <div className="space-y-3 text-white/45 text-sm font-body">
              <p>
                {SITE.address.street}<br />
                {SITE.address.postal} {SITE.address.city}
              </p>
              <a href={`mailto:${SITE.email}`}
                 className="block hover:text-magenta transition-colors">{SITE.email}</a>
              <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer"
                 className="block hover:text-magenta transition-colors">WhatsApp</a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-white/15 text-[10px] tracking-widest font-display font-black">
            © {new Date().getFullYear()} CLINIQ MAASTRICHT
          </p>
          <p className="text-white/15 text-[10px] tracking-widest font-display font-black">
            {SITE.address.street.toUpperCase()} · {SITE.address.postal} {SITE.address.city.toUpperCase()}
          </p>
        </div>
      </div>
    </footer>
  )
}
