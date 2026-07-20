'use client'

import dynamic from 'next/dynamic'

const MagneticCTAs = dynamic(() => import('./MagneticCTAs'), { ssr: false })

export default MagneticCTAs
