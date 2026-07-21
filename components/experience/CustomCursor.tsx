'use client'

import { useEffect, useRef, useState } from 'react'

// Desktop-only magnetic cursor: a small dot tracks the pointer exactly, a lerped ring trails
// behind and grows over interactive elements. Touch devices and prefers-reduced-motion never
// render this at all (mobile gets tactile press states instead — see .btn-primary:active in
// globals.css and the light haptic tap below). Purely cosmetic and pointer-events:none throughout,
// so it can never block a click or interfere with keyboard navigation.
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supported = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setEnabled(supported)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.documentElement.classList.add('custom-cursor-active')

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let raf = 0

    function onMove(event: PointerEvent) {
      mouseX = event.clientX
      mouseY = event.clientY
      dot!.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
    }

    function onOver(event: PointerEvent) {
      const target = event.target as HTMLElement | null
      const interactive = target?.closest('a, button, [role="button"], input, textarea, select, summary')
      ring!.classList.toggle('cursor-ring-active', Boolean(interactive))
    }

    function loop() {
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18
      ring!.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    raf = requestAnimationFrame(loop)

    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div ref={dotRef} aria-hidden="true" className="cursor-dot" />
      <div ref={ringRef} aria-hidden="true" className="cursor-ring" />
    </>
  )
}
