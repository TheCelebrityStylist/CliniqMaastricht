'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'

const defaultFallback = '/images/cliniq/fallback-wide.svg'

type SafeImageProps = Omit<ImageProps, 'src' | 'alt'> & {
  src?: string | null
  alt: string
  fallbackSrc?: string
  objectPosition?: string
}

export default function SafeImage({ src, alt, fallbackSrc = defaultFallback, className = '', objectPosition = 'center', ...props }: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc)

  const imageSrc = currentSrc || fallbackSrc
  const isSvg = imageSrc.endsWith('.svg')

  return <Image
    {...props}
    src={imageSrc}
    alt={alt}
    className={`${className} bg-[#180812]`}
    unoptimized={props.unoptimized || isSvg}
    style={{ ...(props.style || {}), objectPosition }}
    onError={() => {
      if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc)
    }}
  />
}
