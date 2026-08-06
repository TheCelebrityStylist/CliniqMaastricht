'use client'

import dynamic from 'next/dynamic'

const EventCountdown = dynamic(() => import('./EventCountdown'), { ssr: false })

export default EventCountdown
