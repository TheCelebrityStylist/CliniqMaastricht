import Link from 'next/link'
import SafeImage from './SafeImage'

// Component-kit spec #06 `.types`/`.type`: replaces the deleted OVERDAG/'S AVONDS day/night
// toggle. A venue booker wants their event, not a time of day - each card is an existing,
// already-live landing page (title used verbatim as the caption), not new copy.
//
// `description` is optional so callers that only ever passed title/image/href keep working
// unchanged; when present it folds a card's supporting copy into the same tile instead of a
// second, separately-rendered card grid repeating the same eight items.
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
          className="focus-ring group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-2xl border border-white/10"
        >
          <SafeImage
            src={card.image}
            fallbackSrc="/images/cliniq/fallback-wide.svg"
            alt={card.title}
            fill
            sizes="(min-width:1024px) 24vw, 50vw"
            className="object-cover brightness-[1.05] transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
          <div className="relative p-4">
            <span className="block font-display text-[clamp(14px,1.6vw,17px)] font-black uppercase leading-tight text-white">
              {card.title}
            </span>
            {card.description ? (
              <span className="mt-1.5 line-clamp-2 block text-sm leading-snug text-white/70">{card.description}</span>
            ) : null}
          </div>
        </Link>
      ))}
    </div>
  )
}
