'use client'

import { type PointerEvent, type ReactNode, useRef } from 'react'

export default function HeroFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null)

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const element = ref.current
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = element.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12
    element.style.setProperty('--hero-x', `${x}px`)
    element.style.setProperty('--hero-y', `${y}px`)
  }

  function resetPointer() {
    const element = ref.current
    if (!element) return
    element.style.setProperty('--hero-x', '0px')
    element.style.setProperty('--hero-y', '0px')
  }

  return <section ref={ref} onPointerMove={handlePointerMove} onPointerLeave={resetPointer} className={`hero-section hero-frame relative min-h-screen overflow-hidden pt-28 ${className}`}>{children}</section>
}
