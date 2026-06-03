import { TICKER_ITEMS } from '@/lib/content'

export default function TickerBanner() {
  const repeated = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div className="bg-magenta overflow-hidden py-3 select-none ticker-wrap" aria-hidden="true">
      <div className="ticker-track">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="text-white/85 font-display font-black tracking-[0.25em] uppercase mx-6"
            style={{ fontSize: 9 }}
          >
            {item}
            <span className="ml-6 opacity-35">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
