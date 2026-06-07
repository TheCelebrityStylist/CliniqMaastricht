'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import SafeImage from '@/components/ui/SafeImage'
import { images } from '@/lib/site'
import type { MediaAsset } from '@/lib/admin/types'

type Props = {
  photos: MediaAsset[]
  activeIndex: number
  basePath: string
  title: string
  backLabel: string
  previousLabel: string
  nextLabel: string
}

export default function PhotoLightbox({ photos, activeIndex, basePath, title, backLabel, previousLabel, nextLabel }: Props) {
  const touchStart = useRef<number | null>(null)
  const safeIndex = Math.min(Math.max(activeIndex, 0), Math.max(photos.length - 1, 0))
  const active = photos[safeIndex]
  const previous = Math.max(safeIndex - 1, 0)
  const next = Math.min(safeIndex + 1, photos.length - 1)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'ArrowLeft') window.location.href = `${basePath}?photo=${previous}`
      if (event.key === 'ArrowRight') window.location.href = `${basePath}?photo=${next}`
      if (event.key === 'Escape') window.location.href = basePath
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [basePath, previous, next])

  return <div className="lightbox-panel grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
    <div className="lg:sticky lg:top-28"><Link href={basePath} className="text-white/70 hover:text-white">← {backLabel}</Link><p className="eyebrow mt-8">{safeIndex + 1} / {photos.length}</p><h1 className="h1 mt-5">{title}</h1><div className="mt-8 flex flex-wrap gap-3"><Link className="btn-secondary" href={`${basePath}?photo=${previous}`}>{previousLabel}</Link><Link className="btn-primary" href={`${basePath}?photo=${next}`}>{nextLabel}</Link></div></div>
    <div className="space-y-4"><div onTouchStart={(event)=>{ touchStart.current = event.changedTouches[0]?.clientX ?? null }} onTouchEnd={(event)=>{ const start = touchStart.current; if (start === null) return; const delta = event.changedTouches[0].clientX - start; if (delta > 60) window.location.href = `${basePath}?photo=${previous}`; if (delta < -60) window.location.href = `${basePath}?photo=${next}` }} className="image-frame aspect-[4/5] rounded-[2rem]"><SafeImage src={active?.url} fallbackSrc={images.fallbackWide} alt={(active?.altNl || active?.altEn || title)} fill priority sizes="(min-width:1024px) 64vw, 100vw" className="object-cover brightness-[1.08]" objectPosition={active?.focalPoint || 'center'} /></div><p className="text-center text-xs uppercase tracking-[0.24em] text-white/45">← / → keyboard · swipe on mobile</p></div>
  </div>
}
