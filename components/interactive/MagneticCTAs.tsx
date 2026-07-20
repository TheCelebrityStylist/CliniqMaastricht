'use client'

import { useEffect, useRef } from 'react'

// Attaches a magnetic pointer-follow effect to primary CTAs within the closest <section>,
// without touching the existing CTA markup. No-ops on touch devices and prefers-reduced-motion.
export default function MagneticCTAs({ selector = '.btn-primary' }: { selector?: string }) {
  const markerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(hover: none)').matches) return

    const scope = markerRef.current?.closest('section') || document
    const targets = Array.from(scope.querySelectorAll<HTMLElement>(selector))

    const cleanups = targets.map((el) => {
      el.style.transition = 'transform .2s ease-out'

      function onMove(event: PointerEvent) {
        const rect = el.getBoundingClientRect()
        const x = (event.clientX - rect.left - rect.width / 2) * 0.25
        const y = (event.clientY - rect.top - rect.height / 2) * 0.25
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
