'use client'

import { useEffect, useRef, useState } from 'react'

// Sticky "Aanvragen / Request proposal" button for the long, conversion-focused event-space page.
// Desktop only (`sm:flex`, hidden below that) - on mobile this would be a second floater stacked
// on top of MobileActionBar's existing bottom bar (which already carries its own request-form
// link there), and the brief is explicit: one floating system, no colliding second one. Appears
// once the user has scrolled past the hero, and hides again once the actual request form scrolls
// into view - no point pointing at a form that's already on screen.
//
// Docked at bottom-24 (not the more obvious bottom-6): AmbientSound's desktop position is exactly
// bottom-6/right-6, and it stays mounted sitewide once an ambient audio file ever ships (it's
// invisible today only because no audio asset exists in this repo yet). Stacking this above it
// keeps the two from ever overlapping once that toggle appears, without needing to touch
// AmbientSound itself.
export default function StickyRequestCTA({ formId, label }: { formId: string; label: string }) {
  const [pastHero, setPastHero] = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  const observedRef = useRef(false)

  useEffect(() => {
    function onScroll() {
      setPastHero(window.scrollY > 600)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const form = document.getElementById(formId)
    if (!form || observedRef.current) return
    observedRef.current = true
    const observer = new IntersectionObserver(([entry]) => setFormVisible(entry.isIntersecting), { rootMargin: '0px 0px -10% 0px' })
    observer.observe(form)
    return () => observer.disconnect()
  }, [formId])

  const visible = pastHero && !formVisible

  return (
    <a
      href={`#${formId}`}
      className={`focus-ring btn-primary fixed bottom-24 right-6 z-40 hidden shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-all duration-300 sm:flex ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
    >
      {label}
    </a>
  )
}
