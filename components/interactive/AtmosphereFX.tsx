'use client'

import { useEffect, useRef } from 'react'

// Purely decorative scroll-parallax + glow layer. Drops into an existing hero `<section>` and
// drives the `--atmo-y` CSS custom property that `.hero-media` already composes into its
// transform (see globals.css) — the same pattern the site uses for the pointer-tilt effect
// (`--hero-x`/`--hero-y`), so this never fights the existing hero animations for the transform
// property. No changes to the hero markup required. No-ops entirely under prefers-reduced-motion.
export default function AtmosphereFX() {
  const markerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const section = markerRef.current?.closest('section') as HTMLElement | null
    if (!section) return

    let raf = 0
    function update() {
      if (!section) return
      const rect = section.getBoundingClientRect()
      const progress = Math.min(Math.max(-rect.top / (rect.height || 1), -1), 1)
      section.style.setProperty('--atmo-y', `${progress * 28}px`)
    }
    function onScroll() {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      section.style.removeProperty('--atmo-y')
    }
  }, [])

  return (
    <div ref={markerRef} aria-hidden="true" className="atmosphere-fx pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="atmosphere-glow" />
    </div>
  )
}
