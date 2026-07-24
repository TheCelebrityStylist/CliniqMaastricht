import Link from 'next/link'
import SafeImage from './SafeImage'

// Component-kit spec #06 `.types`/`.type`: replaces the deleted OVERDAG/'S AVONDS day/night
// toggle. A venue booker wants their event, not a time of day - each card is an existing,
// already-live landing page (title used verbatim as the caption), not new copy.
export default function EventTypeCards({ cards }: { cards: { title: string; image: string; href: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="focus-ring group relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10"
        >
          <SafeImage
            src={card.image}
            fallbackSrc="/images/cliniq/fallback-wide.svg"
            alt={card.title}
            fill
            sizes="(min-width:1024px) 24vw, 50vw"
            className="object-cover brightness-[1.05] transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
          <span className="absolute inset-x-0 bottom-0 p-4 font-display text-[clamp(14px,1.6vw,17px)] font-extrabold uppercase leading-tight text-white">
            {card.title}
          </span>
        </Link>
      ))}
    </div>
  )
}
