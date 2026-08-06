'use client'

import dynamic from 'next/dynamic'

const MobileHaptics = dynamic(() => import('./MobileHaptics'), { ssr: false })

export default MobileHaptics
