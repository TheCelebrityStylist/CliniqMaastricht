'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/lib/lang'
import { dispatchAmbientToggle } from '@/lib/ambientSound'
import type { Howl } from 'howler'

// Ambient sound toggle — the brief's "optional ambient sound, off by default, one toggle".
// No audio asset ships with this repo: drop a loopable track at public/audio/ambient-loop.mp3
// (or .ogg/.m4a — Howler auto-picks a supported format from the src array) and this control
// appears automatically. Until that file exists, this checks for it once on mount and renders
// nothing — shipping a toggle that visibly does nothing would be worse than shipping no toggle.
// Always starts muted regardless of any prior visit (browsers block audio autoplay without a
// user gesture anyway, so "off by default" is enforced by the platform, not just this component).
const AUDIO_SRC = ['/audio/ambient-loop.mp3', '/audio/ambient-loop.ogg']

export default function AmbientSound() {
  const { lang } = useLang()
  const [available, setAvailable] = useState(false)
  const [playing, setPlaying] = useState(false)
  const howlRef = useRef<Howl | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(AUDIO_SRC[0], { method: 'HEAD' })
      .then((res) => {
        if (!cancelled && res.ok) setAvailable(true)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    return () => {
      howlRef.current?.unload()
    }
  }, [])

  async function toggle() {
    if (!howlRef.current) {
      const { Howl } = await import('howler')
      howlRef.current = new Howl({ src: AUDIO_SRC, loop: true, volume: 0, html5: true })
    }
    const howl = howlRef.current
    if (playing) {
      howl.fade(howl.volume(), 0, 500)
      window.setTimeout(() => howl.pause(), 500)
      setPlaying(false)
      dispatchAmbientToggle(false)
    } else {
      howl.play()
      howl.fade(0, 0.35, 600)
      setPlaying(true)
      dispatchAmbientToggle(true)
    }
  }

  if (!available) return null

  const label = playing ? (lang === 'nl' ? 'Geluid uitschakelen' : 'Turn sound off') : lang === 'nl' ? 'Geluid inschakelen' : 'Turn sound on'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={playing}
      // Docked in the same bottom-anchored floating stack as MobileActionBar (the 3-column bar
      // that appears on mobile after scrolling): offset by the bar's own height plus a safe-area
      // and clearance margin, so this round toggle can never sit on top of it. Desktop never
      // shows MobileActionBar at all, so it reverts to a simple corner inset there.
      className="focus-ring fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom)+1rem)] right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-ink/85 text-white/85 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:text-white sm:bottom-6 sm:right-6"
    >
      {playing ? <SoundOnIcon /> : <SoundOffIcon />}
    </button>
  )
}

function SoundOnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

function SoundOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}
