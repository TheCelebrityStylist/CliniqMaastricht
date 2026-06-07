import Link from 'next/link'
import { ArrowRight, X } from 'lucide-react'
import { PHOTOS, SITE } from '@/lib/content'

interface LandingLayoutProps {
  meta: { title: string; description: string }
  hero: {
    photo: string
    eyebrow: string
    h1: string
    sub: string
    ctaLabel: string
    ctaHref: string
  }
  features: { title: string; body: string }[]
  steps: { n: number; title: string; body: string }[]
  practical: { label: string; value: string }[]
  ctaPrimary: { label: string; href: string }
  ctaSecondary: { label: string; href: string }
  quote?: string
}

function externalProps(href: string) {
  return href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {}
}

export default function LandingLayout({ meta, hero, features, steps, practical, ctaPrimary, ctaSecondary, quote }: LandingLayoutProps) {
  return (
    <div className="min-h-screen bg-ink text-white" aria-label={meta.title}>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-ink/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-8">
          <Link href="/" className="text-[14px] font-black tracking-[0.45em] text-white transition-colors hover:text-magenta" aria-label="Terug naar homepage">
            CLINIQ
          </Link>
          <div className="flex items-center gap-3">
            <a
              href={ctaPrimary.href}
              className="bg-magenta px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-white hover:text-ink"
              {...externalProps(ctaPrimary.href)}
            >
              {ctaPrimary.label}
            </a>
            <Link href="/" className="text-white/35 transition-colors hover:text-white" aria-label="Sluiten">
              <X className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative flex min-h-screen items-end overflow-hidden">
        <img src={hero.photo} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/62 to-ink/20" />
        <div className="relative z-10 mx-auto w-full max-w-screen-xl px-8 pb-20 pt-32 md:px-16 md:pb-28">
          <p className="eyebrow mb-5">{hero.eyebrow}</p>
          <h1 className="max-w-5xl font-black leading-[0.9] tracking-[-0.04em] text-white" style={{ fontSize: 'clamp(3rem, 8vw, 8rem)' }}>{hero.h1}</h1>
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-white/60 md:text-xl">{hero.sub}</p>
          <a
            href={hero.ctaHref}
            className="group mt-9 inline-flex items-center gap-3 bg-magenta px-8 py-4 text-[10px] font-black uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-white hover:text-ink"
            {...externalProps(hero.ctaHref)}
          >
            {hero.ctaLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </section>

      <section className="bg-smoke py-24">
        <div className="mx-auto max-w-screen-xl px-8 md:px-16">
          <p className="eyebrow mb-5">Wat zit erbij</p>
          <div className="grid gap-8 md:grid-cols-2">
            {features.map((feature) => (
              <article key={feature.title} className="border-l-2 border-magenta/40 pl-5">
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-magenta">Included</p>
                <h2 className="text-3xl font-black tracking-[-0.03em] text-white">{feature.title}</h2>
                <p className="mt-4 max-w-md text-base leading-relaxed text-white/45">{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-screen-xl px-8 md:px-16">
          <p className="eyebrow mb-8">Zo werkt het</p>
          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((step) => (
              <article key={step.n} className="relative min-h-[220px] overflow-hidden border border-white/10 bg-white/[0.035] p-7">
                <p className="absolute -right-2 -top-5 text-[8rem] font-black leading-none text-magenta/20">{step.n}</p>
                <div className="relative z-10 pt-14">
                  <h2 className="text-3xl font-black tracking-[-0.03em]">{step.title}</h2>
                  <p className="mt-4 text-white/45">{step.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-screen-xl px-8 pb-24 md:px-16">
        <blockquote className="border-y border-white/10 py-10 text-2xl font-black leading-tight tracking-[-0.02em] text-white md:text-4xl">
          “{quote || 'Goede communicatie, strakke timing en precies de avond waar de groep zin in had.'}”
        </blockquote>
      </section>

      <section className="bg-smoke py-24">
        <div className="mx-auto grid max-w-screen-xl gap-10 px-8 md:px-16 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="eyebrow mb-5">Praktisch</p>
            <h2 className="text-5xl font-black leading-none tracking-[-0.035em]">Wat je vooraf wilt weten.</h2>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {practical.map((item) => (
              <div key={item.label} className="grid gap-2 py-5 sm:grid-cols-[180px_1fr]">
                <span className="text-sm text-white/30">{item.label}</span>
                <span className="font-semibold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-28 text-center">
        <img src={PHOTOS.crowd} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" style={{ filter: 'brightness(0.2) saturate(0.75)' }} />
        <div className="absolute inset-0 bg-ink/72" />
        <div className="relative z-10 mx-auto max-w-4xl px-8">
          <h2 className="font-black leading-[0.92] tracking-[-0.04em]" style={{ fontSize: 'clamp(2.8rem, 7vw, 7rem)' }}>{hero.h1}</h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={ctaPrimary.href} className="bg-magenta px-8 py-4 text-[10px] font-black uppercase tracking-[0.22em] text-white transition hover:bg-white hover:text-ink" {...externalProps(ctaPrimary.href)}>{ctaPrimary.label}</a>
            <a href={ctaSecondary.href} className="border border-white/20 px-8 py-4 text-[10px] font-black uppercase tracking-[0.22em] text-white transition hover:border-white hover:bg-white hover:text-ink" {...externalProps(ctaSecondary.href)}>{ctaSecondary.label}</a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] px-8 py-8 text-center text-[10px] font-black uppercase tracking-widest text-white/20">
        CLINIQ Maastricht · {SITE.address.street} · {SITE.address.postal} {SITE.address.city}
        <span className="mx-2 block sm:inline">© {new Date().getFullYear()} Cliniq Maastricht</span>
      </footer>
    </div>
  )
}
