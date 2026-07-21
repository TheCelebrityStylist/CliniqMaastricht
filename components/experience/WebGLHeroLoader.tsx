'use client'

import dynamic from 'next/dynamic'

const WebGLHero = dynamic(() => import('./WebGLHero'), { ssr: false })

export default WebGLHero
