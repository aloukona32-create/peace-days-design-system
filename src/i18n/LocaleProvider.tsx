import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { coerceLocale, dirFor, STORAGE_KEY, type Locale } from './config'

type Ctx = { locale: Locale; setLocale: (l: Locale) => void; dir: 'ltr' | 'rtl' }

const LocaleContext = createContext<Ctx | null>(null)

function initialLocale(): Locale {
  if (typeof window === 'undefined') return 'fr'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored) return coerceLocale(stored)
  return coerceLocale(window.navigator.language)
}

/**
 * Fournit la locale courante à toute l'app. Persiste le choix (localStorage)
 * et applique `lang` + `dir` sur <html> (RTL automatique pour l'arabe).
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  useEffect(() => {
    const el = document.documentElement
    el.lang = locale
    el.dir = dirFor(locale)
    try {
      window.localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      /* stockage bloqué (navigation privée) : on garde la locale en mémoire */
    }
  }, [locale])

  const setLocale = useCallback((l: Locale) => setLocaleState(l), [])

  const value = useMemo<Ctx>(() => ({ locale, setLocale, dir: dirFor(locale) }), [locale, setLocale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): Ctx {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale doit être utilisé dans <LocaleProvider>')
  return ctx
}
