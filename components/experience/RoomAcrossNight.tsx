'use client'

import { useLang } from '@/lib/lang'
import { INTERACTIVE_COPY } from '@/lib/content'
import { images } from '@/lib/site'
import SafeImage from '@/components/ui/SafeImage'

// The event-space room photo module. Previously had a day/night cross-dissolve toggle
// ("OVERDAG / 'S AVONDS") - removed per explicit direction, and replaced by EventTypeCards
// (components/ui/EventTypeCards.tsx, wired into the event-type section above this on the page) -
// a booker picks their event, not a time of day. This module is now just the single "see the
// room" photo. The brief's scroll-driven canvas frame sequence (room filling as the user scrolls)
// replaces this properly in a follow-up pass - see the report for why that needs new photography
// this repo doesn't have yet, rather than being faked here.
export default function RoomAcrossNight({ ctaHref }: { ctaHref: string }) {
  const { lang } = useLang()
  const t = INTERACTIVE_COPY[lang].configurator

  return (
    <section className="container-premium pb-24">
      <p className="eyebrow">{lang === 'nl' ? 'De ruimte' : 'The space'}</p>

      <div className="group relative mt-6 aspect-[16/9] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
        <SafeImage
          src={images.redRoom}
          fallbackSrc={images.fallbackWide}
          alt={lang === 'nl' ? 'CLINIQ eventruimte' : 'CLINIQ event space'}
          fill
          sizes="(min-width:1024px) 1100px, 100vw"
          className="object-cover brightness-[1.05] transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm font-black uppercase tracking-[0.1em] text-white/50">{t.upTo}</p>
        <a href={ctaHref} className="btn-primary min-h-11">
          {lang === 'nl' ? 'Vrijblijvende aanvraag' : 'Request proposal'}
        </a>
      </div>
    </section>
  )
}
