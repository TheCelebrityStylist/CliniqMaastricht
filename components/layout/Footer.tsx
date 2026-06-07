'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Instagram } from 'lucide-react'
import { useLang } from '@/lib/lang'
import { COPY, SITE, HOURS } from '@/lib/content'

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z" />
  </svg>
)

const NAV_NL = [
  { href: '/uitgaan', label: 'Uitgaan' },
  { href: '/cocktail-workshop', label: 'Cocktail workshop' },
  { href: '/event-space', label: 'Ruimte huren' },
  { href: '/fotos', label: "Foto's" },
  { href: '/contact', label: 'Contact' },
  { href: '/vacatures', label: 'Vacatures' },
  { href: '/house-rules', label: 'Huisregels' },
]
const NAV_EN = [
  { href: '/uitgaan', label: 'Nightlife' },
  { href: '/cocktail-workshop', label: 'Cocktail workshop' },
  { href: '/event-space', label: 'Hire venue' },
  { href: '/fotos', label: 'Photos' },
  { href: '/contact', label: 'Contact' },
  { href: '/vacatures', label: 'Jobs' },
  { href: '/house-rules', label: 'House rules' },
]

const GROEPEN_NL = [
  { href: '/vrijgezellenavond', label: 'Vrijgezellenavond' },
  { href: '/bedrijfsfeest', label: 'Bedrijfsfeest' },
  { href: '/privefeest', label: 'Privéfeest' },
  { href: '/cocktail-workshop', label: 'Cocktail workshop' },
  { href: '/event-space', label: 'Feestzaal Maastricht' },
]
const GROEPEN_EN = [
  { href: '/vrijgezellenavond', label: 'Hen party' },
  { href: '/bedrijfsfeest', label: 'Corporate event' },
  { href: '/privefeest', label: 'Private party' },
  { href: '/cocktail-workshop', label: 'Cocktail workshop' },
  { href: '/event-space', label: 'Event venue Maastricht' },
]

const HIDDEN_PATHS = ['/admin', '/vrijgezellenavond', '/bedrijfsfeest', '/privefeest']

export default function Footer() {
  const pathname = usePathname()
  const { lang } = useLang()
  if (HIDDEN_PATHS.some((path) => pathname?.startsWith(path))) return null

  const t = COPY[lang]
  const navLinks = lang === 'nl' ? NAV_NL : NAV_EN
  const groepenLinks = lang === 'nl' ? GROEPEN_NL : GROEPEN_EN
  const dayLabels = lang === 'nl'
    ? ['Donderdag', 'Vrijdag', 'Zaterdag']
    : ['Thursday', 'Friday', 'Saturday']

  return (
    <footer className="border-t border-white/[0.06] bg-ink">
      <div className="mx-auto max-w-screen-xl px-8 pb-10 pt-20 md:px-16">
        <div className="mb-16 grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-[15px] font-black tracking-[0.45em] text-white transition-colors duration-300 hover:text-magenta">
              CLINIQ
            </Link>
            <p className="mb-6 mt-4 max-w-[220px] text-sm leading-relaxed text-white/35">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-4 text-white/20">
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-magenta" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href={SITE.tiktok} target="_blank" rel="noopener noreferrer" className="transition-colors duration-200 hover:text-magenta" aria-label="TikTok">
                <TikTokIcon />
              </a>
            </div>
          </div>

          <div>
            <h4 className="eyebrow mb-5">
              {lang === 'nl' ? 'Navigatie' : 'Navigation'}
            </h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/[0.38] transition-colors duration-200 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="eyebrow mb-5">
              {lang === 'nl' ? 'Openingstijden' : 'Opening hours'}
            </h4>
            <div className="mb-7 space-y-2">
              {HOURS.map((h, i) => (
                <div key={h.abbr.nl} className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-white/[0.38]">{dayLabels[i]}</span>
                  <span className="tabular-nums text-white/20" style={{ fontSize: 11 }}>{h.time}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1.5 text-sm text-white/30">
              <p>{SITE.address.street}</p>
              <p>{SITE.address.postal} {SITE.address.city}</p>
              <a href={`mailto:${SITE.email}`} className="mt-3 block transition-colors duration-200 hover:text-magenta">
                {SITE.email}
              </a>
              <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="block transition-colors duration-200 hover:text-magenta">
                WhatsApp
              </a>
            </div>
          </div>

          <div>
            <h4 className="eyebrow mb-5">
              {lang === 'nl' ? 'Voor groepen' : 'For groups'}
            </h4>
            <ul className="space-y-2.5">
              {groepenLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/[0.38] transition-colors duration-200 hover:text-magenta">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.05] pt-6 md:flex-row">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/[0.12]">
            © {new Date().getFullYear()} Cliniq Maastricht
          </p>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/[0.12]">
            Platielstraat 9A · 6211 GV Maastricht
          </p>
        </div>
      </div>
    </footer>
  )
}
