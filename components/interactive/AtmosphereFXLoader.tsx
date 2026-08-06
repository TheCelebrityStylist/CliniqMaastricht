'use client'

import dynamic from 'next/dynamic'

const AtmosphereFX = dynamic(() => import('./AtmosphereFX'), { ssr: false })

export default AtmosphereFX
