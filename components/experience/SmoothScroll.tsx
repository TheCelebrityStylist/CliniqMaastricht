'use client'

import 'lenis/dist/lenis.css'
import { ReactLenis } from 'lenis/react'
import { useEffect, useState } from 'react'

// Global smooth-scroll spine for the "scroll as a film" choreography (GSAP/ScrollTrigger reads
// scroll position through Lenis's own RAF loop). `root` mode drives the native document scroller
// directly — no wrapper divs, no DOM/layout change, so this is safe to drop around the whole page.
// Renders children unwrapped until we've confirmed on the client that reduced-motion isn't
// requested, so JS-disabled and reduced-motion users always get plain native scrolling — never a
// broken or half-initialised smooth-scroll state.
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [smooth, setSmooth] = useState(false)

  useEffect(() => {
    setSmooth(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  if (!smooth) return <>{children}</>

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.15, smoothWheel: true, anchors: true }}>
      {children}
    </ReactLenis>
  )
}
