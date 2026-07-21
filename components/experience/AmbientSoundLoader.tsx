'use client'

import dynamic from 'next/dynamic'

const AmbientSound = dynamic(() => import('./AmbientSound'), { ssr: false })

export default AmbientSound
