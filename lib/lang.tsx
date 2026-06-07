'use client'

import { usePathname } from 'next/navigation'
import { getLanguageFromPath, type Lang } from './i18n'

export function useLang(): { lang: Lang } {
  const pathname = usePathname()
  return { lang: getLanguageFromPath(pathname || '') }
}
