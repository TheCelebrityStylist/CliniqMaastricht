'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { getLanguageFromPath, getSwitchPath, localizedPaths, navItems, copy } from '@/lib/i18n'
import MagneticCTAs from '@/components/interactive/MagneticCTAsLoader'
import Logo from '@/components/brand/Logo'
import { VENUE_STATE_COOKIE, type VenueState } from '@/lib/venueState'

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
)
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

export default function Header({ venueState: initialVenueState }: { venueState: VenueState }) {
  const pathname = usePathname()
  // Single source of truth for both the toggle icon and the Logo variant, seeded from the
  // server-computed prop (no flash) - see lib/venueState.ts for "the truth of the venue now".
  // Everything else that reacts to day/night (hero, header background, etc.) reads the
  // html[data-venue-state] attribute directly via CSS, which this also keeps in sync.
  const [venueState, setVenueState] = useState(initialVenueState)

  function toggleVenueState() {
    const next: VenueState = venueState === 'day' ? 'night' : 'day'
    document.documentElement.setAttribute('data-venue-state', next)
    document.cookie = `${VENUE_STATE_COOKIE}=${next}; path=/; max-age=21600; SameSite=Lax`
    setVenueState(next)
  }

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/vrijgezellenavond') || pathname?.startsWith('/bedrijfsfeest') || pathname?.startsWith('/privefeest')) return null
  const lang = getLanguageFromPath(pathname)
  const t = copy[lang]
  const switchHref = getSwitchPath(pathname)

  function rememberLanguage(nextLang: 'nl' | 'en') {
    document.cookie = `cliniq_lang=${nextLang}; path=/; max-age=31536000; SameSite=Lax`
    window.localStorage.setItem('cliniq_lang', nextLang)
  }

  function isActive(href: string) {
    return pathname === href || (href !== '/' && pathname?.startsWith(`${href}/`))
  }

  return <header className="site-header fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/78 backdrop-blur-2xl transition-colors duration-300">
    <MagneticCTAs selector=".nav-link" strength={0.4} />
    <div className="container-premium flex h-20 items-center justify-between gap-6">
      <Link href={localizedPaths.home[lang]} className="focus-ring" aria-label="Cliniq Maastricht"><Logo variant={venueState === 'day' ? 'solid' : 'white'} /></Link>
      <nav className="hidden items-center gap-7 lg:flex" aria-label={lang === 'nl' ? 'Hoofdnavigatie' : 'Main navigation'}>
        {navItems.map((item) => {
          const href = localizedPaths[item.key][lang]
          return <Link key={item.key} href={href} className={`nav-link ${isActive(href) ? 'nav-link-active' : ''}`}>{item.labels[lang]}</Link>
        })}
      </nav>
      <div className="flex items-center gap-3">
        <Link href={localizedPaths.nightlife[lang]} className={`hidden text-xs font-black uppercase tracking-[0.1em] transition sm:inline ${isActive(localizedPaths.nightlife[lang]) ? 'text-white' : 'text-white/70 hover:text-white'}`}>{t.agenda}</Link>
        <button
          type="button"
          onClick={toggleVenueState}
          aria-label={venueState === 'day' ? 'Switch to night' : 'Switch to day'}
          className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-white hover:text-white active:scale-95"
        >
          {venueState === 'day' ? <SunIcon /> : <MoonIcon />}
        </button>
        <Link href={switchHref} onClick={() => rememberLanguage(lang === 'nl' ? 'en' : 'nl')} className="focus-ring rounded-full border border-white/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-white/80 transition hover:border-white hover:text-white active:scale-95">{t.switchTo}</Link>
        <Link href={localizedPaths.eventSpace[lang]} data-track="cta_click" className="btn-primary px-4 py-2 text-[10px]">{t.cta}</Link>
      </div>
    </div>
  </header>
}
