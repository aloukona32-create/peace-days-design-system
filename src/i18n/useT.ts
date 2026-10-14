import { useCallback } from 'react'
import { useLocale } from './LocaleProvider'
import { DEFAULT_LOCALE, type Locale } from './config'
import { UI } from './strings'

type Vars = Record<string, string | number>

function interpolate(s: string, vars?: Vars): string {
  if (!vars) return s
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`))
}

/** Résout une clé « a.b.c » dans un dictionnaire imbriqué. */
function lookup(dict: unknown, key: string): string | undefined {
  const val = key.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), dict)
  return typeof val === 'string' ? val : undefined
}

/**
 * Hook de traduction. `t('header.login')` renvoie la chaîne dans la locale
 * courante, avec repli sur le français si une clé manque dans EN/AR.
 */
export function useT() {
  const { locale, setLocale, dir } = useLocale()
  const t = useCallback(
    (key: string, vars?: Vars): string => {
      const hit = lookup(UI[locale], key) ?? lookup(UI[DEFAULT_LOCALE], key) ?? key
      return interpolate(hit, vars)
    },
    [locale],
  )
  return { t, locale, setLocale, dir }
}

export type { Locale }
