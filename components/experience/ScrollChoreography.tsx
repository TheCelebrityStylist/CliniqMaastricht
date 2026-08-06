'use client'

import { useEffect } from 'react'
import { useLenis } from 'lenis/react'

// Site-wide scroll choreography: kinetic reveals on section headings and a light parallax drift
// on photo tiles, driven by GSAP ScrollTrigger synced to the Lenis smooth-scroll instance already
// mounted in SmoothScroll. Scans the DOM for existing classes (.h2, .h3, .photo-tile) instead of
// requiring any page to add new markup — genuinely additive. Never touches text content, only
// adds a transform/opacity animation on top of what's already rendered. Skips entirely under
// prefers-reduced-motion (elements simply appear in their normal, final state — no animation, no
// broken "stuck invisible" state).
export default function ScrollChoreography() {
  const lenis = useLenis()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!lenis) return

    let ctx: { revert: () => void } | undefined
    let onScroll: (() => void) | undefined

    // Sync ScrollTrigger to Lenis's virtual scroll position on every tick. Lenis keeps driving
    // its own rAF loop (SmoothScroll's default autoRaf) rather than handing that over to
    // gsap.ticker — simpler and safer: if this module fails to load for any reason, smooth
    // scrolling itself is completely unaffected, only the extra scroll-linked animations are
    // missing.
    let cancelled = false
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)

      onScroll = () => ScrollTrigger.update()
      lenis.on('scroll', onScroll)

      ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('.h2, .h3').forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, yPercent: 22, clipPath: 'inset(0 0 100% 0)' },
            {
              opacity: 1,
              yPercent: 0,
              clipPath: 'inset(0 0 0% 0)',
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            },
          )
        })

        gsap.utils.toArray<HTMLElement>('.photo-tile').forEach((el, i) => {
          gsap.to(el, {
            yPercent: i % 2 === 0 ? -6 : 6,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          })
        })
      })

      ScrollTrigger.refresh()
    })

    return () => {
      cancelled = true
      ctx?.revert()
      if (onScroll) lenis.off('scroll', onScroll)
    }
  }, [lenis])

  return null
}
