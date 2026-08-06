'use client'

import { useEffect, useRef } from 'react'

// Attaches a magnetic pointer-follow effect to elements within the closest <section> (or
// <header>/<footer> for nav-style usage), without touching the existing markup. No-ops on touch
// devices and prefers-reduced-motion.
export default function MagneticCTAs({ selector = '.btn-primary', strength = 0.25 }: { selector?: string; strength?: number }) {
  const markerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(hover: none)').matches) return

    const scope = markerRef.current?.closest('section, header, footer') || document
    const targets = Array.from(scope.querySelectorAll<HTMLElement>(selector))

    const cleanups = targets.map((el) => {
      el.style.transition = 'transform .2s ease-out'

      function onMove(event: PointerEvent) {
        const rect = el.getBoundingClientRect()
        const x = (event.clientX - rect.left - rect.width / 2) * strength
        const y = (event.clientY - rect.top - rect.height / 2) * strength
        el.style.transform = `translate(${x}px, ${y}px)`
      }
      function onLeave() {
        el.style.transform = ''
      }

      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)

      return () => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerleave', onLeave)
        el.style.transform = ''
        el.style.transition = ''
      }
    })

    return () => cleanups.forEach((cleanup) => cleanup())
  }, [selector])

  return <div ref={markerRef} aria-hidden="true" className="hidden" />
}
