'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'

// Route-crossfade "no white flash" transition. React 19's experimental View Transition API isn't
// available on this project's React 18, and Next.js App Router doesn't expose a clean hook to
// wrap document.startViewTransition() around its own client-side navigation on React 18 either —
// so this is the Framer Motion fallback the brief calls for, and on this stack it's the primary
// mechanism, not a degraded one. `initial={false}` means the very first page load is never
// animated, matching "content is there immediately" for SSR/no-JS — this wrapper only ever
// affects client-side route changes, the underlying content is identical either way.
//
// Deliberately NOT using framer-motion's own useReducedMotion() hook here: it reads
// window.matchMedia synchronously during render (not in an effect), so on a client whose OS has
// reduced motion on, the very first hydration render already returns true while the server (no
// window) always rendered the AnimatePresence-wrapped tree — a real server/client structural
// mismatch (React hydration error #418). Starting at false and flipping post-mount matches every
// other reduced-motion check in this codebase and guarantees the first render matches SSR.
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  if (reduceMotion) return <>{children}</>

  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
