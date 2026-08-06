'use client'

import dynamic from 'next/dynamic'

const MobileActionBar = dynamic(() => import('./MobileActionBar'), { ssr: false })

export default MobileActionBar
