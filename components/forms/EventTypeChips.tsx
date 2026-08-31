'use client'

// Chip labels match the `eventType` <select> option values verbatim (see the event-space pages),
// so picking a chip is a straight `select.value = label` - no separate mapping table to keep in
// sync. Chips are real <a href="#anchor"> elements: the page still scrolls to the form without
// JS; the onClick only adds the prefill on top when JS is available.
export default function EventTypeChips({
  types,
  formAnchor,
  selectId = 'eventType',
}: {
  types: string[]
  formAnchor: string
  selectId?: string
}) {
  function handleClick(type: string) {
    const select = document.getElementById(selectId) as HTMLSelectElement | null
    if (!select) return
    select.value = type
    select.dispatchEvent(new Event('change', { bubbles: true }))
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      {types.map((type) => (
        <a
          key={type}
          href={`#${formAnchor}`}
          onClick={() => handleClick(type)}
          className="focus-ring inline-flex min-h-11 items-center rounded-full border border-white/15 bg-white/[0.04] px-5 text-sm font-black uppercase tracking-[0.04em] text-white/80 transition-colors hover:border-coral hover:text-white"
        >
          {type}
        </a>
      ))}
    </div>
  )
}
