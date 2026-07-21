'use client'

import { useEffect, useRef } from 'react'

// Canvas 2D "pour" liquid fill — rises up the card on hover/focus/click, recedes on leave.
// Plain canvas rather than WebGL: no texture/library needed for a flat animated wave shape, so
// this stays a few hundred bytes of code with zero bundle impact. Purely decorative (aria-hidden)
// layered over the existing cocktail photo/link, which remains the real, always-present content.
export default function CocktailPourCanvas({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const levelRef = useRef(0)
  const rafRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const card = canvas?.parentElement
    if (!canvas || !card) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      if (!card || !canvas) return
      const rect = card.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
    }
    resize()
    window.addEventListener('resize', resize)

    if (reduceMotion) {
      return () => window.removeEventListener('resize', resize)
    }

    const start = performance.now()
    function draw(now: number) {
      if (!canvas) return
      const target = active ? 0.4 : 0
      const prev = levelRef.current
      levelRef.current += (target - levelRef.current) * 0.12
      const w = canvas.width
      const h = canvas.height
      ctx!.clearRect(0, 0, w, h)

      const settled = Math.abs(target - levelRef.current) < 0.004
      if (settled) levelRef.current = target

      if (levelRef.current > 0.005) {
        const t = (now - start) / 1000
        const fillY = h * (1 - levelRef.current)
        const waveAmp = h * 0.02

        ctx!.beginPath()
        ctx!.moveTo(0, h)
        ctx!.lineTo(0, fillY)
        const step = w / 24
        for (let x = 0; x <= w; x += step) {
          const y = fillY + Math.sin(x * 0.02 + t * 3) * waveAmp
          ctx!.lineTo(x, y)
        }
        ctx!.lineTo(w, h)
        ctx!.closePath()

        const gradient = ctx!.createLinearGradient(0, fillY, 0, h)
        gradient.addColorStop(0, 'rgba(240, 38, 135, 0.35)')
        gradient.addColorStop(1, 'rgba(213, 181, 110, 0.18)')
        ctx!.fillStyle = gradient
        ctx!.fill()
      }

      // Stop the loop once the level has settled at rest (0) — no point clearing/redrawing an
      // empty canvas every frame forever. A fresh `active` change re-runs this effect and restarts.
      if (settled && target === 0 && prev === levelRef.current) return
      rafRef.current = requestAnimationFrame(draw)
    }
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [active])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] h-full w-full mix-blend-screen" />
}
