import type { ReactNode } from 'react'
import PullQuote from './PullQuote'
import StatStrip from './StatStrip'
import ExpandableDetail from './ExpandableDetail'

// Component-kit spec #05, the site's central content pattern: decompose an existing copy block
// into {headline + pull-quote + stat strip + expandable remainder} instead of a paragraph wall.
// `paragraphs` is always the FULL original copy, verbatim, rendered inside the disclosure - the
// headline/quote/stats are a visible layer built from sentences already present in that same
// copy, not a summary or a rewrite. Nothing here may introduce new marketing copy.
export default function ChoreographedContent({
  headline,
  quote,
  stats,
  paragraphs,
  moreLabel,
}: {
  headline?: ReactNode
  quote?: ReactNode
  stats?: { value: ReactNode; label: string }[]
  paragraphs: ReactNode[]
  moreLabel: string
}) {
  return (
    <div>
      {headline ? <p className="text-lg leading-[1.65] text-white/78 md:text-xl">{headline}</p> : null}
      {quote ? <div className="mt-6"><PullQuote>{quote}</PullQuote></div> : null}
      {stats?.length ? <StatStrip stats={stats} /> : null}
      <ExpandableDetail summary={moreLabel}>
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </ExpandableDetail>
    </div>
  )
}
