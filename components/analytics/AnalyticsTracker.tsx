'use client'
import { useEffect } from 'react'

export default function AnalyticsTracker() {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const tracked = target?.closest('[data-track]') as HTMLElement | null
      if (!tracked) return
      const eventName = tracked.dataset.track || 'click'
      const label = tracked.textContent?.trim() || tracked.getAttribute('aria-label') || ''
      navigator.sendBeacon?.('/api/analytics', new Blob([JSON.stringify({ eventName, label, path: window.location.pathname })], { type: 'application/json' }))
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])
  return null
}
