import Link from 'next/link'
import SafeImage from './SafeImage'

// Component-kit spec #06 `.types`/`.type`: replaces the deleted OVERDAG/'S AVONDS day/night
// toggle. A venue booker wants their event, not a time of day - each card is an existing,
// already-live landing page (title used verbatim as the caption), not new copy.
//
// `description` is optional so callers that only ever passed title/image/href keep working
// unchanged; when present it folds a card's supporting copy into the same tile instead of a
// second, separately-rendered card grid repeating the same eight items.
//
// The description + micro-CTA reveal on hover/focus via a pure-CSS max-height + opacity + translate
// transition (grid-template-rows would be cleaner but has patchy support for this exact combo) -
// no WebGL, no JS: with 8 cards on one page, a per-card WebGL context would be a real Lighthouse/
// GPU-context risk, and the content is already in the DOM either way (readable with JS off,
// visible via screen reader regardless of hover state).
export default function EventTypeCards({
  cards,
}: {
  cards: { title: string; image: string; href: string; description?: string }[]
}) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Link
          key={`${card.title}-${index}`}
          href={card.href}
          className="focus-ring group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-2xl border border-white/10 transition-colors duration-500 hover:border-coral/50"
        >
          <SafeImage
            src={card.image}
            fallbackSrc="/images/cliniq/fallback-wide.svg"
            alt={card.title}
            fill
            sizes="(min-width:1024px) 24vw, 50vw"
            className="object-cover brightness-[1.05] transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent transition-[background] duration-500 group-hover:via-ink/75" />
          <div className="relative p-4">
            <span className="block font-display text-[clamp(16px,1.9vw,20px)] font-black uppercase leading-tight tracking-tight text-white transition-transform duration-500 ease-out group-hover:-translate-y-1">
              {card.title}
            </span>
            {card.description ? (
              <div className="max-h-0 overflow-hidden opacity-0 transition-[max-height,opacity] duration-500 ease-out group-hover:max-h-24 group-hover:opacity-100 group-focus-visible:max-h-24 group-focus-visible:opacity-100">
                <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-white/75">{card.description}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.1em] text-coral-text">
                  Aanvragen <span aria-hidden="true">→</span>
                </span>
              </div>
            ) : null}
          </div>
        </Link>
      ))}
    </div>
  )
}
