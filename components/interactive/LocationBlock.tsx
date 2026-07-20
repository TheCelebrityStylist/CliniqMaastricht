'use client'

import { useState } from 'react'
import { useLang } from '@/lib/lang'
import { INTERACTIVE_COPY } from '@/lib/content'
import { site } from '@/lib/site'

// Approximate walking times from two well-known central landmarks — not exact GPS-measured
// figures, flagged in the delivery report for a human to verify against Google Maps.
const CHIPS = [
  { key: 'vrijthof' as const, minutes: 3, origin: 'Vrijthof, Maastricht' },
  { key: 'markt' as const, minutes: 2, origin: 'Markt, Maastricht' },
]

export default function LocationBlock() {
  const { lang } = useLang()
  const t = INTERACTIVE_COPY[lang].location
  const [active, setActive] = useState(false)
  const destination = `${site.address.street}, ${site.address.postalCode} ${site.address.city}`

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045]">
      <div className="flex flex-wrap gap-2 p-4">
        {CHIPS.map((chip) => (
          <a
            key={chip.key}
            href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(chip.origin)}&destination=${encodeURIComponent(destination)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring rounded-full border border-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.06em] text-white/75 transition hover:border-white hover:text-white"
          >
            ± {chip.minutes} {lang === 'nl' ? 'min' : 'min'} {t.walk} {chip.key === 'vrijthof' ? t.fromVrijthof : t.fromMarkt}
          </a>
        ))}
      </div>

      <div className="relative aspect-[16/10] w-full bg-white/[0.03]">
        {active ? (
          <iframe title="Route naar Cliniq Maastricht" src={site.maps} className="h-full w-full border-0" loading="lazy" />
        ) : (
          <button
            type="button"
            onClick={() => setActive(true)}
            className="focus-ring group flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_40%,rgba(240,38,136,0.14),transparent_60%)] text-white"
          >
            <MapPinIcon />
            <span className="rounded-full border border-white/25 bg-black/50 px-5 py-2.5 text-xs font-black uppercase tracking-[0.1em] backdrop-blur transition group-hover:border-white group-hover:bg-white group-hover:text-ink">
              {t.activateMap}
            </span>
          </button>
        )}
      </div>
    </div>
  )
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white/55" aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
