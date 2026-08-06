'use client'

import { useLang } from '@/lib/lang'
import { INTERACTIVE_COPY } from '@/lib/content'

// A slim CTA banner, not a photo module. This used to carry its own full-width solo "De
// ruimte"/"The space" photo directly below the page's real 5-image gallery (also captioned "De
// ruimte"/"The space") - a large dark block repeating a heading the gallery above it already
// owns, carrying little of its own. The gallery IS the space visual now; this is just the
// capacity fact + a request-proposal CTA, reusing existing copy (`upTo`, the request-proposal
// button label) rather than inventing new text.
export default function RoomAcrossNight({ ctaHref }: { ctaHref: string }) {
  const { lang } = useLang()
  const t = INTERACTIVE_COPY[lang].configurator

  return (
    <section className="container-premium pb-24">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 md:p-8">
        <p className="text-lg font-black uppercase tracking-[0.06em] text-white/80 md:text-xl">{t.upTo}</p>
        <a href={ctaHref} className="btn-primary min-h-11">
          {lang === 'nl' ? 'Vrijblijvende aanvraag' : 'Request proposal'}
        </a>
      </div>
    </section>
  )
}
