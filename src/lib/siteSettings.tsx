import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { EVENT } from './content'
import { supabase } from './supabase'

export interface SiteSettings {
  eventName: string
  edition: string
  datesLabel: string
  location: string
  tagline: string
  contactEmail: string
}

const DEFAULT_SETTINGS: SiteSettings = {
  eventName: EVENT.name,
  edition: EVENT.edition,
  datesLabel: EVENT.datesLabel,
  location: EVENT.location,
  tagline: EVENT.tagline,
  contactEmail: '',
}

interface SiteSettingsContextValue {
  settings: SiteSettings
  loaded: boolean
  error: string | null
  saveSettings: (settings: SiteSettings) => Promise<void>
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null)

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    const loadSettings = async () => {
      try {
        const { data, error: queryError } = await supabase
          .from('site_settings')
          .select('event_name,edition,dates_label,location,tagline,contact_email')
          .eq('id', 'default')
          .maybeSingle()
        if (!alive) return
        if (queryError) {
          setError(queryError.message)
        } else if (data) {
          setSettings({
            eventName: data.event_name,
            edition: data.edition,
            datesLabel: data.dates_label,
            location: data.location,
            tagline: data.tagline,
            contactEmail: data.contact_email,
          })
          setError(null)
        }
        setLoaded(true)
      } catch (cause) {
        if (!alive) return
        setError(cause instanceof Error ? cause.message : 'Impossible de charger les paramètres du site.')
        setLoaded(true)
      }
    }
    void loadSettings()

    return () => {
      alive = false
    }
  }, [])

  const saveSettings = async (next: SiteSettings) => {
    const { data, error: updateError } = await supabase
      .from('site_settings')
      .update({
        event_name: next.eventName,
        edition: next.edition,
        dates_label: next.datesLabel,
        location: next.location,
        tagline: next.tagline,
        contact_email: next.contactEmail,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 'default')
      .select('event_name,edition,dates_label,location,tagline,contact_email')
      .maybeSingle()

    if (updateError) throw updateError
    if (!data) throw new Error('Aucun paramètre mis à jour. Vérifiez les droits admin et la configuration Supabase.')

    setSettings({
      eventName: data.event_name,
      edition: data.edition,
      datesLabel: data.dates_label,
      location: data.location,
      tagline: data.tagline,
      contactEmail: data.contact_email,
    })
    setError(null)
  }

  const value = useMemo(
    () => ({ settings, loaded, error, saveSettings }),
    [settings, loaded, error],
  )

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
}

export function useSiteSettings(): SiteSettingsContextValue {
  const value = useContext(SiteSettingsContext)
  if (!value) throw new Error('useSiteSettings doit être utilisé dans <SiteSettingsProvider>')
  return value
}
