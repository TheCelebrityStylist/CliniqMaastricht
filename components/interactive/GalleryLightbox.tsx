'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
} from 'react'
import SafeImage from '@/components/ui/SafeImage'
import { images } from '@/lib/site'

export type LightboxImage = { src: string; alt: string }

type Ctx = { open: (index: number) => void }
const LightboxContext = createContext<Ctx | null>(null)

export function useLightbox() {
  const ctx = useContext(LightboxContext)
  return ctx?.open || (() => {})
}

export default function GalleryLightbox({ images: gallery, children }: { images: LightboxImage[]; children: ReactNode }) {
  const [index, setIndex] = useState<number | null>(null)
  const [scale, setScale] = useState(1)
  const triggerRef = useRef<HTMLElement | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const touchState = useRef<{ x: number; y: number; pinchDist: number | null }>({ x: 0, y: 0, pinchDist: null })

  const open = useCallback((i: number) => {
    if (typeof document !== 'undefined') triggerRef.current = document.activeElement as HTMLElement
    setScale(1)
    setIndex(i)
  }, [])

  const close = useCallback(() => {
    setIndex(null)
    setScale(1)
    triggerRef.current?.focus?.()
  }, [])

  const go = useCallback(
    (delta: number) => {
      setScale(1)
      setIndex((current) => (current === null ? current : (current + delta + gallery.length) % gallery.length))
    },
    [gallery.length],
  )

  useEffect(() => {
    if (index === null) return
    closeBtnRef.current?.focus()
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') close()
      if (event.key === 'ArrowLeft') go(-1)
      if (event.key === 'ArrowRight') go(1)
    }
    document.addEventListener('keydown', onKey)
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = original
    }
  }, [index, close, go])

  function onTouchStart(event: ReactTouchEvent<HTMLDivElement>) {
    if (event.touches.length === 2) {
      const [a, b] = [event.touches[0], event.touches[1]]
      touchState.current.pinchDist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
    } else {
      touchState.current.x = event.touches[0].clientX
      touchState.current.y = event.touches[0].clientY
      touchState.current.pinchDist = null
    }
  }

  function onTouchMove(event: ReactTouchEvent<HTMLDivElement>) {
    if (event.touches.length === 2 && touchState.current.pinchDist) {
      const [a, b] = [event.touches[0], event.touches[1]]
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
      setScale(Math.min(3, Math.max(1, dist / touchState.current.pinchDist)))
    }
  }

  function onTouchEnd(event: ReactTouchEvent<HTMLDivElement>) {
    touchState.current.pinchDist = null
    if (scale > 1.05) return
    const endX = event.changedTouches[0]?.clientX ?? touchState.current.x
    const endY = event.changedTouches[0]?.clientY ?? touchState.current.y
    const dx = endX - touchState.current.x
    const dy = endY - touchState.current.y
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) go(dx > 0 ? -1 : 1)
  }

  const active = index !== null ? gallery[index] : null

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) close()
          }}
        >
          <button
            ref={closeBtnRef}
            type="button"
            onClick={close}
            className="focus-ring absolute right-4 top-4 z-10 rounded-full border border-white/20 bg-black/50 p-3 text-white transition hover:bg-white hover:text-ink"
            aria-label="Close"
          >
            <CloseIcon />
          </button>

          {gallery.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="focus-ring absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-3 text-white transition hover:bg-white hover:text-ink sm:left-6"
                aria-label="Previous photo"
              >
                <ChevronIcon direction="left" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="focus-ring absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/50 p-3 text-white transition hover:bg-white hover:text-ink sm:right-6"
                aria-label="Next photo"
              >
                <ChevronIcon direction="right" />
              </button>
            </>
          ) : null}

          <div
            className="relative h-full max-h-[85vh] w-full max-w-5xl touch-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <SafeImage
              src={active.src}
              fallbackSrc={images.fallbackWide}
              alt={active.alt}
              fill
              sizes="90vw"
              className="object-contain transition-transform duration-150 motion-reduce:transition-none"
              style={{ transform: `scale(${scale})` }}
            />
          </div>

          {gallery.length > 1 ? (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs font-black uppercase tracking-[0.14em] text-white/50">
              {index! + 1} / {gallery.length}
            </p>
          ) : null}
        </div>
      ) : null}
    </LightboxContext.Provider>
  )
}

export function LightboxImageLink({
  href,
  index,
  className,
  children,
}: {
  href: string
  index: number
  className?: string
  children: ReactNode
}) {
  const open = useLightbox()
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        event.preventDefault()
        open(index)
      }}
    >
      {children}
    </a>
  )
}

export function LightboxImageButton({ index, className, label, children }: { index: number; className?: string; label: string; children: ReactNode }) {
  const open = useLightbox()
  return (
    <button type="button" onClick={() => open(index)} className={className} aria-label={label}>
      {children}
    </button>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
      <path d={direction === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  )
}
