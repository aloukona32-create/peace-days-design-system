import type { Locale } from './config'
import { useLocale } from './LocaleProvider'
import * as FR from '../lib/content'
import { useSiteSettings } from '../lib/siteSettings'
import type {
  NavItem, Experience, Role, Value, Expertise, Reference, Guest, GalleryItem, Stat, ProgramDay, SessionType, TypeCompte,
} from '../lib/content'

// Contenu localisé. Le français (lib/content.ts) est la source ; EN et AR
// répliquent la même forme avec le texte traduit. Les champs structurels
// (clés, photos, routes, dates ISO, types) restent identiques.

export type EventInfo = {
  organizer: string; name: string; edition: string
  datesLabel: string; location: string; tagline: string; startISO: string
}
export type SessionTypeOption = { key: SessionType | 'tous'; label: string }
export type TypeCompteOption = { key: TypeCompte; label: string; hint: string }

export type ContentBundle = {
  EVENT: EventInfo
  NAV: NavItem[]
  EXPERIENCES: Experience[]
  ROLES: Role[]
  VALUES: Value[]
  EXPERTISE: Expertise[]
  REFERENCES: Reference[]
  GUESTS: Guest[]
  GALLERY: GalleryItem[]
  PATRONAGES: string[]
  STATS: Stat[]
  THEMES: string[]
  SESSION_TYPES: SessionTypeOption[]
  TYPES_COMPTE: TypeCompteOption[]
  COUNTRIES: string[]
  PROGRAM: ProgramDay[]
}

const FR_BUNDLE: ContentBundle = {
  EVENT: FR.EVENT, NAV: FR.NAV, EXPERIENCES: FR.EXPERIENCES, ROLES: FR.ROLES, VALUES: FR.VALUES,
  EXPERTISE: FR.EXPERTISE, REFERENCES: FR.REFERENCES, GUESTS: FR.GUESTS, GALLERY: FR.GALLERY,
  PATRONAGES: FR.PATRONAGES, STATS: FR.STATS, THEMES: FR.THEMES, SESSION_TYPES: FR.SESSION_TYPES,
  TYPES_COMPTE: FR.TYPES_COMPTE, COUNTRIES: FR.COUNTRIES, PROGRAM: FR.PROGRAM,
}

// Chargement paresseux via import statique : EN/AR sont de simples objets.
import { EN } from './content.en'
import { AR } from './content.ar'

const BUNDLES: Record<Locale, ContentBundle> = { fr: FR_BUNDLE, en: EN, ar: AR }

export function getContent(locale: Locale): ContentBundle {
  return BUNDLES[locale] ?? FR_BUNDLE
}

/** Contenu localisé pour la locale courante. */
export function useContent(): ContentBundle {
  const bundle = getContent(useLocale().locale)
  const { settings } = useSiteSettings()
  return {
    ...bundle,
    EVENT: {
      ...bundle.EVENT,
      name: settings.eventName,
      edition: settings.edition,
      datesLabel: settings.datesLabel,
      location: settings.location,
      tagline: settings.tagline,
    },
  }
}
