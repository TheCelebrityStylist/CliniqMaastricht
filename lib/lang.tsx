'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Lang } from '@/lib/content'

interface LangCtx {
  lang: Lang
  toggle: () => void
}

const Ctx = createContext<LangCtx>({ lang: 'nl', toggle: () => {} })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('nl')

  useEffect(() => {
    const stored = localStorage.getItem('cliniq_lang') as Lang | null
    if (stored === 'en' || stored === 'nl') setLang(stored)
  }, [])

  const toggle = () => {
    const next: Lang = lang === 'nl' ? 'en' : 'nl'
    setLang(next)
    localStorage.setItem('cliniq_lang', next)
  }

  return <Ctx.Provider value={{ lang, toggle }}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx)
