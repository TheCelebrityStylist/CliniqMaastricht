'use client'

// `ssr: false` dynamic imports must originate from a Client Component in the App Router —
// this thin wrapper is what lets server-component pages (layout.tsx) lazy-load the client-only
// StatusBadge without server-rendering it.
import dynamic from 'next/dynamic'

const StatusBadge = dynamic(() => import('./StatusBadge'), { ssr: false })

export default StatusBadge
