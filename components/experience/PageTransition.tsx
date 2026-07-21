'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

// Route-crossfade "no white flash" transition. React 19's experimental View Transition API isn't
// available on this project's React 18, and Next.js App Router doesn't expose a clean hook to
// wrap document.startViewTransition() around its own client-side navigation on React 18 either —
// so this is the Framer Motion fallback the brief calls for, and on this stack it's the primary
// mechanism, not a degraded one. `initial={false}` means the very first page load is never
// animated (avoids double-animating against CinematicEntry, and matches "content is there
// immediately" for SSR/no-JS — this wrapper only ever affects client-side route changes, the
// underlying content is identical either way).
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()

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
