'use client'

import dynamic from 'next/dynamic'

const EventImageReveal = dynamic(() => import('./EventImageReveal'), { ssr: false })

export default EventImageReveal
