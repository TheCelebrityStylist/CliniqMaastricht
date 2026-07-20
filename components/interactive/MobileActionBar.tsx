'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getLanguageFromPath, localizedPaths, copy } from '@/lib/i18n'
import { INTERACTIVE_COPY } from '@/lib/content'
import { site } from '@/lib/site'

const HIDDEN_PATHS = ['/admin', '/vrijgezellenavond', '/bedrijfsfeest', '/privefeest']

export default function MobileActionBar() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 480)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (HIDDEN_PATHS.some((path) => pathname?.startsWith(path))) return null

  const lang = getLanguageFromPath(pathname || '')
  const t = INTERACTIVE_COPY[lang].actionBar
  const nav = copy[lang]
  const mapsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${site.address.street}, ${site.address.postalCode} ${site.address.city}`)}`

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-white/10 bg-ink/95 backdrop-blur-xl transition-transform duration-300 sm:hidden ${visible ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="focus-ring flex flex-col items-center justify-center gap-1 py-3 text-[10px] font-black uppercase tracking-[0.08em] text-white/75">
        <RouteIcon />
        {t.route}
      </a>
      <Link href={localizedPaths.nightlife[lang]} className="focus-ring flex flex-col items-center justify-center gap-1 border-x border-white/10 py-3 text-[10px] font-black uppercase tracking-[0.08em] text-white/75">
        <CalendarIcon />
        {t.events}
      </Link>
      <Link href={localizedPaths.eventSpace[lang]} className="focus-ring flex flex-col items-center justify-center gap-1 bg-magenta py-3 text-[10px] font-black uppercase tracking-[0.08em] text-white">
        <ArrowIcon />
        {nav.cta}
      </Link>
    </div>
  )
}

function RouteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  )
}
function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}
function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <path d="M5 12h14m-7-7 7 7-7 7" />
    </svg>
  )
}
