import Link from 'next/link'
import Logo from '@/components/brand/Logo'
import { site } from '@/lib/site'

// Deliberately NOT the site Header/Footer - this is a stripped ad-landing page (Header.tsx and
// Footer.tsx both early-return null for these routes, matching the existing precedent set by
// /vrijgezellenavond, /bedrijfsfeest, /privefeest). Full nav would give paid-traffic visitors a
// way to wander off before they ever see the form; the whole point of this page is to keep them
// on it. Just the logo, one CTA back to the form, and - in the footer - enough to be a real
// business (address, phone) without turning into the sitewide link farm.
export function AdLandingHeader({ lang, formAnchor, ctaLabel }: { lang: 'nl' | 'en'; formAnchor: string; ctaLabel: string }) {
  const homeHref = lang === 'en' ? '/en' : '/'
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-ink/90 backdrop-blur-xl">
      <div className="container-premium flex h-16 items-center justify-between">
        <Link href={homeHref} className="focus-ring flex min-h-11 items-center" aria-label="CLINIQ Maastricht">
          <Logo />
        </Link>
        <a href={`#${formAnchor}`} className="btn-primary min-h-11 px-4 py-2 text-[11px]">{ctaLabel}</a>
      </div>
    </header>
  )
}

export function AdLandingFooter({ lang }: { lang: 'nl' | 'en' }) {
  return (
    <footer className="border-t border-white/[0.06] px-6 py-8 text-center text-xs text-white/40">
      <p className="font-black uppercase tracking-[0.1em] text-white/60">CLINIQ Maastricht</p>
      <p className="mt-2">
        {site.address.street} · {site.address.postalCode} {site.address.city}
      </p>
      <p className="mt-1">
        <a href={`tel:${site.phone.replace(/\s+/g, '')}`} className="hover:text-white">{site.phone}</a>
        {' · '}
        <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
      </p>
    </footer>
  )
}
