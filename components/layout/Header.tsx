'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getLanguageFromPath, getSwitchPath, localizedPaths, navItems, copy } from '@/lib/i18n'

export default function Header() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
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

  return <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/78 backdrop-blur-2xl transition-colors duration-300">
    <div className="container-premium flex h-20 items-center justify-between gap-6">
      <Link href={localizedPaths.home[lang]} className="focus-ring text-lg font-black tracking-[0.42em] text-white">CLINIQ</Link>
      <nav className="hidden items-center gap-7 lg:flex" aria-label={lang === 'nl' ? 'Hoofdnavigatie' : 'Main navigation'}>
        {navItems.map((item) => {
          const href = localizedPaths[item.key][lang]
          return <Link key={item.key} href={href} className={`nav-link ${isActive(href) ? 'nav-link-active' : ''}`}>{item.labels[lang]}</Link>
        })}
      </nav>
      <div className="flex items-center gap-3">
        <Link href={localizedPaths.nightlife[lang]} className={`hidden text-xs font-black uppercase tracking-[0.18em] transition sm:inline ${isActive(localizedPaths.nightlife[lang]) ? 'text-white' : 'text-white/70 hover:text-white'}`}>{t.agenda}</Link>
        <Link href={switchHref} onClick={() => rememberLanguage(lang === 'nl' ? 'en' : 'nl')} className="focus-ring rounded-full border border-white/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/80 transition hover:border-white hover:text-white active:scale-95">{t.switchTo}</Link>
        <Link href={localizedPaths.eventSpace[lang]} data-track="cta_click" className="btn-primary px-4 py-2 text-[10px]">{t.cta}</Link>
      </div>
    </div>
  </header>
}
