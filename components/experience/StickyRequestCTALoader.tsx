'use client'

import dynamic from 'next/dynamic'

const StickyRequestCTA = dynamic(() => import('./StickyRequestCTA'), { ssr: false })

export default StickyRequestCTA
