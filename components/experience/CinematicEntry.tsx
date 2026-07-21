'use client'

import { useEffect, useState } from 'react'

const SESSION_KEY = 'cliniq-entry-seen'

// "Doors opening" first-load reveal. The hero underneath is already fully server-rendered and in
// the DOM the entire time — this only ever animates a curtain away from in front of it, never
// gates or delays the actual content. Once per session (sessionStorage), skippable at any time
// (tap/click/key), auto-resolves by ~1.1s, and never runs at all under prefers-reduced-motion or
// on repeat visits within the session.
export default function CinematicEntry() {
  const [phase, setPhase] = useState<'hidden' | 'closed' | 'opening' | 'done'>('hidden')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done')
      return
    }
    if (sessionStorage.getItem(SESSION_KEY)) {
      setPhase('done')
      return
    }
    sessionStorage.setItem(SESSION_KEY, '1')
    setPhase('closed')

    const openTimer = setTimeout(() => setPhase('opening'), 350)
    const doneTimer = setTimeout(() => setPhase('done'), 1150)
    return () => {
      clearTimeout(openTimer)
      clearTimeout(doneTimer)
    }
  }, [])

  function skip() {
    setPhase('done')
  }

  if (phase === 'hidden' || phase === 'done') return null

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Skip intro"
      onClick={skip}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') skip()
      }}
      className="fixed inset-0 z-[200] cursor-pointer bg-ink"
      style={{ pointerEvents: phase === 'opening' ? 'none' : 'auto' }}
    >
      <div
        className="absolute inset-y-0 left-0 w-1/2 border-r border-white/5 bg-ink transition-transform duration-700 ease-[cubic-bezier(.76,0,.24,1)]"
        style={{ transform: phase === 'opening' ? 'translateX(-100%)' : 'translateX(0)' }}
      />
      <div
        className="absolute inset-y-0 right-0 w-1/2 border-l border-white/5 bg-ink transition-transform duration-700 ease-[cubic-bezier(.76,0,.24,1)]"
        style={{ transform: phase === 'opening' ? 'translateX(100%)' : 'translateX(0)' }}
      />
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
        style={{ opacity: phase === 'opening' ? 0 : 1 }}
      >
        <span className="text-sm font-black uppercase tracking-[0.5em] text-white/70">CLINIQ</span>
      </div>
      <span className="sr-only">Loading Cliniq Maastricht — press any key or tap to skip</span>
    </div>
  )
}
