'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Lang } from '@/lib/i18n'

interface LanguageContextType {
  lang: Lang
  setLang: (lang: Lang) => void
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    // Check localStorage first
    const saved = localStorage.getItem('lang') as Lang | null
    if (saved === 'en' || saved === 'es') {
      setLangState(saved)
      return
    }
    // Auto-detect from browser
    const browserLang = navigator.language || ''
    if (browserLang.startsWith('es')) {
      setLangState('es')
    } else {
      setLangState('en')
    }
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('lang', l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
