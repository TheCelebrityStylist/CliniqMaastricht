'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import GalleryLightbox, { useLightbox } from '@/components/interactive/GalleryLightbox'
import type { Lang } from '@/lib/i18n'

export type PilePhoto = { id: string; src400: string; src800: string; alt: string }

// Physics constants ported directly from the reference implementation (cliniq-direction.html) -
// this is a port, not a reinterpretation. Velocity decays 6% per frame, an edge hit reverses and
// damps to 55% of incoming speed, rotation is coupled to cumulative horizontal drag distance.
const VELOCITY_DECAY = 0.94
const EDGE_BOUNCE = -0.55
const ROTATION_PER_PX = 0.03
const REST_VELOCITY = 0.05
const TAP_THRESHOLD_PX = 6

type PhotoState = {
  el: HTMLButtonElement | null
  rot: number
  dx: number
  dy: number
  vx: number
  vy: number
  dragging: boolean
  moved: number
  lastX: number
  lastY: number
}

// The throwable duotone photo pile (Part C, "the signature moment"): real graded photos
// scattered like prints, draggable and throwable with real inertia and edge-bounce, picking one
// up brings it to the top of the stack. Tap (not drag) opens the shared GalleryLightbox.
// JS-off and prefers-reduced-motion both fall back to a plain duotone masonry grid using the
// exact same photos and lightbox - the ONLY grid allowed here; the physics pile is the default.
export default function PhotoPile({ photos, lang }: { photos: PilePhoto[]; lang: Lang }) {
  const lightboxImages = photos.map((p) => ({ src: p.src800, alt: p.alt }))

  return (
    <GalleryLightbox images={lightboxImages}>
      <PhotoPileInner photos={photos} lang={lang} />
    </GalleryLightbox>
  )
}

function PhotoPileInner({ photos, lang }: { photos: PilePhoto[]; lang: Lang }) {
  const [pileEnabled, setPileEnabled] = useState(false)
  const openLightbox = useLightbox()

  // Client-only enhancement: SSR (and the very first client render, to avoid a hydration
  // mismatch) always produces the grid - fully functional with JS off. If the browser allows
  // motion, this effect swaps to the physics pile immediately after mount.
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setPileEnabled(true)
  }, [])

  if (!pileEnabled) {
    return <PileGrid photos={photos} onOpen={openLightbox} />
  }

  return <PilePhysics photos={photos} lang={lang} onOpen={openLightbox} />
}

function PileGrid({ photos, onOpen }: { photos: PilePhoto[]; onOpen: (index: number) => void }) {
  return (
    <div className="columns-2 gap-3 sm:columns-3 md:columns-4 [&>*]:mb-3">
      {photos.map((photo, index) => (
        <button
          key={photo.id}
          type="button"
          onClick={() => onOpen(index)}
          className="focus-ring block w-full overflow-hidden rounded-2xl border border-white/10 bg-plum"
          aria-label={photo.alt}
        >
          <img
            src={photo.src400}
            srcSet={`${photo.src400} 400w, ${photo.src800} 800w`}
            sizes="(min-width:768px) 25vw, 50vw"
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            className="block aspect-[4/5] w-full object-cover"
          />
        </button>
      ))}
    </div>
  )
}

function PilePhysics({ photos, lang, onOpen }: { photos: PilePhoto[]; lang: Lang; onOpen: (index: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const zRef = useRef(photos.length)
  const rafRef = useRef(0)

  // Stable scattered layout, one seeded position/rotation per photo - same formula as the
  // reference implementation so the initial "spilled on a table" arrangement matches.
  const layout = useRef(
    photos.map((_, i) => ({
      left: 8 + ((i * 11) % 64),
      top: 6 + ((i * 17) % 52),
      rot: (i % 2 ? 1 : -1) * (4 + i * 1.7),
    })),
  ).current

  // Built synchronously on first render (useRef's initial value), not inside the effect below -
  // the button refs are assigned during the commit that produces this same render, which runs
  // BEFORE the effect. Rebuilding this array inside the effect meant every ref callback fired
  // against an empty array first and never found an entry to attach `.el` to, so no pointer
  // listener was ever attached to anything - the pile looked right but silently couldn't be
  // dragged. Keeping one persistent array across the component's lifetime (not renders) is what
  // makes the ref callback and the effect agree on which object they're both touching.
  const statesRef = useRef<PhotoState[]>(
    photos.map((_, i) => ({
      el: null,
      rot: layout[i].rot,
      dx: 0,
      dy: 0,
      vx: 0,
      vy: 0,
      dragging: false,
      moved: 0,
      lastX: 0,
      lastY: 0,
    })),
  )

  useEffect(() => {
    function applyTransform(state: PhotoState) {
      if (!state.el) return
      state.el.style.transform = `translate(${state.dx}px, ${state.dy}px) rotate(${state.rot + state.dx * ROTATION_PER_PX}deg)`
    }

    function onPointerDown(index: number, event: PointerEvent) {
      const state = statesRef.current[index]
      if (!state?.el) return
      state.dragging = true
      state.moved = 0
      state.lastX = event.clientX
      state.lastY = event.clientY
      state.el.style.zIndex = String(++zRef.current)
      state.el.style.cursor = 'grabbing'
      state.el.setPointerCapture(event.pointerId)
    }

    function onPointerMove(index: number, event: PointerEvent) {
      const state = statesRef.current[index]
      if (!state || !state.dragging) return
      const moveX = event.clientX - state.lastX
      const moveY = event.clientY - state.lastY
      state.dx += moveX
      state.dy += moveY
      state.vx = moveX
      state.vy = moveY
      state.moved += Math.abs(moveX) + Math.abs(moveY)
      state.lastX = event.clientX
      state.lastY = event.clientY
      applyTransform(state)
    }

    function onPointerUp(index: number, event: PointerEvent) {
      const state = statesRef.current[index]
      if (!state) return
      state.dragging = false
      if (state.el) {
        state.el.style.cursor = 'grab'
        state.el.releasePointerCapture(event.pointerId)
      }
      if (state.moved < TAP_THRESHOLD_PX) {
        onOpen(index)
      }
    }

    // Attach as plain DOM listeners (via refs assigned below) rather than React synthetic props,
    // so this effect owns its own cleanup precisely and pointer capture works reliably across
    // both mouse and touch without fighting the browser's default touch scroll/zoom gestures.
    const cleanups: (() => void)[] = []
    statesRef.current.forEach((state, index) => {
      const el = state.el
      if (!el) return
      const down = (e: PointerEvent) => onPointerDown(index, e)
      const move = (e: PointerEvent) => onPointerMove(index, e)
      const up = (e: PointerEvent) => onPointerUp(index, e)
      el.addEventListener('pointerdown', down)
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerup', up)
      el.addEventListener('pointercancel', up)
      cleanups.push(() => {
        el.removeEventListener('pointerdown', down)
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerup', up)
        el.removeEventListener('pointercancel', up)
      })
    })

    function fly() {
      const container = containerRef.current
      if (container) {
        const bounds = container.getBoundingClientRect()
        for (const state of statesRef.current) {
          if (state.dragging || (Math.abs(state.vx) < REST_VELOCITY && Math.abs(state.vy) < REST_VELOCITY)) continue
          state.dx += state.vx
          state.dy += state.vy
          state.vx *= VELOCITY_DECAY
          state.vy *= VELOCITY_DECAY
          if (state.el) {
            const rect = state.el.getBoundingClientRect()
            if (rect.left < bounds.left || rect.right > bounds.right) state.vx *= EDGE_BOUNCE
            if (rect.top < bounds.top || rect.bottom > bounds.bottom) state.vy *= EDGE_BOUNCE
          }
          applyTransform(state)
        }
      }
      rafRef.current = requestAnimationFrame(fly)
    }
    rafRef.current = requestAnimationFrame(fly)

    return () => {
      cancelAnimationFrame(rafRef.current)
      cleanups.forEach((fn) => fn())
    }
  }, [photos, layout, onOpen])

  return (
    <div
      ref={containerRef}
      className="relative h-[clamp(380px,54vh,560px)] touch-none overflow-hidden rounded-[20px] border border-white/10"
      style={{ background: 'radial-gradient(120% 90% at 30% 20%, rgba(219,51,76,.14), transparent 60%), #190410' }}
    >
      {photos.map((photo, index) => (
        <button
          key={photo.id}
          ref={(el) => {
            if (statesRef.current[index]) statesRef.current[index].el = el
          }}
          type="button"
          aria-label={lang === 'nl' ? `Bekijk foto: ${photo.alt}` : `View photo: ${photo.alt}`}
          className="focus-ring absolute w-[clamp(140px,19vw,240px)] cursor-grab touch-none select-none overflow-hidden rounded-xl border border-white/10 shadow-[0_22px_50px_rgba(0,0,0,.6)]"
          style={{
            left: `${layout[index].left}%`,
            top: `${layout[index].top}%`,
            zIndex: index,
            transform: `rotate(${layout[index].rot}deg)`,
          }}
          onClick={(event) => {
            // A synthetic click follows every pointerup (mouse and touch alike); the pointerup
            // handler above already opens the lightbox for a genuine tap and this would double
            // it, so this only exists to make the button reachable and openable via keyboard
            // (Enter/Space), which never goes through the pointer handlers at all.
            if (event.detail !== 0) return
            onOpen(index)
          }}
        >
          <img
            src={photo.src400}
            srcSet={`${photo.src400} 400w, ${photo.src800} 800w`}
            sizes="240px"
            alt=""
            draggable={false}
            loading="lazy"
            decoding="async"
            className="pointer-events-none block aspect-[4/5] w-full object-cover"
          />
        </button>
      ))}
      <p className="pointer-events-none absolute bottom-3.5 left-1/2 -translate-x-1/2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/55">
        {lang === 'nl' ? "Sleep de foto's" : 'Drag the photos'}
      </p>
    </div>
  )
}
