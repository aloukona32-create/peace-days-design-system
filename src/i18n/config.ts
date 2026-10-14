// Socle i18n — Peace Days Dubaï 2027.
// FR (source), EN, AR. L'arabe passe la page en RTL.

export type Locale = 'fr' | 'en' | 'ar'

export const LOCALES: Locale[] = ['fr', 'en', 'ar']
export const DEFAULT_LOCALE: Locale = 'fr'

/** Libellé court affiché dans le sélecteur de langue. */
export const LOCALE_LABELS: Record<Locale, string> = {
  fr: 'FR',
  en: 'EN',
  ar: 'AR',
}

/** Nom natif de la langue (menus, accessibilité). */
export const LOCALE_NAMES: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  ar: 'العربية',
}

/** Seul l'arabe s'écrit de droite à gauche. */
export function isRTL(locale: Locale): boolean {
  return locale === 'ar'
}

export function dirFor(locale: Locale): 'ltr' | 'rtl' {
  return isRTL(locale) ? 'rtl' : 'ltr'
}

export const STORAGE_KEY = 'pd_locale'

/** Normalise une valeur quelconque vers une locale supportée. */
export function coerceLocale(value: string | null | undefined): Locale {
  const v = (value ?? '').slice(0, 2).toLowerCase()
  return (LOCALES as string[]).includes(v) ? (v as Locale) : DEFAULT_LOCALE
}
