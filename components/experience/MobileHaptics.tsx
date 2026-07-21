'use client'

import { useEffect } from 'react'

// The custom cursor is desktop-only; on touch devices the equivalent tactile feedback is a very
// light haptic tap on primary CTAs, where the platform actually supports it (mostly Android
// Chrome — iOS Safari has no Vibration API, this is simply a no-op there). One short 8ms pulse,
// never repeated rapidly, never on anything but a primary call-to-action.
export default function MobileHaptics() {
  useEffect(() => {
    if (!('vibrate' in navigator)) return
    if (!window.matchMedia('(hover: none) and (pointer: coarse)').matches) return

    function onClick(event: PointerEvent) {
      const target = event.target as HTMLElement | null
      if (target?.closest('.btn-primary')) navigator.vibrate?.(8)
    }

    window.addEventListener('pointerdown', onClick, { passive: true })
    return () => window.removeEventListener('pointerdown', onClick)
  }, [])

  return null
}
