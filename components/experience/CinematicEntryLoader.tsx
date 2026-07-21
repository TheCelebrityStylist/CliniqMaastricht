'use client'

import dynamic from 'next/dynamic'

const CinematicEntry = dynamic(() => import('./CinematicEntry'), { ssr: false })

export default CinematicEntry
