'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Instagram } from 'lucide-react'
import { useLang } from '@/lib/lang'
import { COPY, NAV, SITE } from '@/lib/content'
import { cn } from '@/lib/utils'

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-label="TikTok">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z"/>
  </svg>
)

const ALL_LINKS_NL = [
  { href: '/',                  label: 'Home' },
  { href: '/uitgaan',           label: 'Uitgaan' },
  { href: '/cocktail-workshop', label: 'Workshop' },
  { href: '/event-space',       label: 'Event Space' },
  { href: '/artiesten',         label: 'Artiesten' },
  { href: '/contact',           label: 'Contact' },
  { href: '/vacatures',         label: 'Vacatures' },
  { href: '/house-rules',       label: 'Huisregels' },
]
const ALL_LINKS_EN = [
  { href: '/',                  label: 'Home' },
  { href: '/uitgaan',           label: 'Nightlife' },
  { href: '/cocktail-workshop', label: 'Workshop' },
  { href: '/event-space',       label: 'Event Space' },
  { href: '/artiesten',         label: 'Artists' },
  { href: '/contact',           label: 'Contact' },
  { href: '/vacatures',         label: 'Jobs' },
  { href: '/house-rules',       label: 'House Rules' },
]

export default function Header() {
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { lang, toggle } = useLang()
  const t = COPY[lang]
  const navLinks = NAV[lang]
  const allLinks = lang === 'nl' ? ALL_LINKS_NL : ALL_LINKS_EN

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [pathname])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-ink/95 backdrop-blur-md border-b border-white/6'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16 h-16 flex items-center justify-between gap-8">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0 group" aria-label="Cliniq Maastricht — home">
          <span className="font-display font-black text-[15px] tracking-[0.45em] text-white group-hover:text-magenta transition-colors duration-300">
            CLINIQ
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center" aria-label="Main navigation">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'font-display font-semibold text-[11px] tracking-[0.18em] uppercase transition-colors duration-200 hover:text-white',
                pathname === link.href ? 'text-white' : 'text-white/40'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-5 flex-shrink-0">
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer"
             className="text-white/30 hover:text-white transition-colors duration-200" aria-label="Instagram">
            <Instagram className="w-4 h-4" />
          </a>
          <a href={SITE.tiktok} target="_blank" rel="noopener noreferrer"
             className="text-white/30 hover:text-white transition-colors duration-200" aria-label="TikTok">
            <TikTokIcon />
          </a>

          <button
            onClick={toggle}
            className="font-display font-black text-[10px] tracking-widest text-white/30 hover:text-white transition-colors duration-200"
            aria-label={`Switch to ${lang === 'nl' ? 'English' : 'Dutch'}`}
          >
            {lang === 'nl' ? 'EN' : 'NL'}
          </button>

          <Link
            href="/event-space"
            className="bg-magenta text-white font-display font-black px-5 py-2.5 text-[10px] tracking-[0.22em] uppercase hover:bg-white hover:text-ink transition-all duration-300"
          >
            {t.nav.cta.toUpperCase()}
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen(v => !v)}
          className="lg:hidden text-white/70 hover:text-white transition-colors ml-auto"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          'lg:hidden overflow-hidden transition-all duration-500',
          open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}
        aria-hidden={!open}
      >
        <div className="bg-ink border-t border-white/6 px-8 py-8">
          <nav className="flex flex-col gap-5" aria-label="Mobile navigation">
            {allLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'font-display font-black text-sm tracking-[0.18em] uppercase transition-colors duration-200',
                  pathname === link.href ? 'text-magenta' : 'text-white/60 hover:text-white'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/8">
            <div className="flex gap-5 text-white/30">
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer"
                 className="hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={SITE.tiktok} target="_blank" rel="noopener noreferrer"
                 className="hover:text-white transition-colors" aria-label="TikTok">
                <TikTokIcon />
              </a>
            </div>
            <button
              onClick={toggle}
              className="font-display font-black text-[10px] tracking-widest text-white/30 hover:text-white transition-colors"
            >
              {lang === 'nl' ? 'EN' : 'NL'}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
