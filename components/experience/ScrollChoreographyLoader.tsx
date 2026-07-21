'use client'

import dynamic from 'next/dynamic'

const ScrollChoreography = dynamic(() => import('./ScrollChoreography'), { ssr: false })

export default ScrollChoreography
