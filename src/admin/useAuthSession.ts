import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

/**
 * Suit la session et le droit d'accès admin stocké dans le profil.
 */
export function useAuthSession(): {
  session: Session | null
  isAdmin: boolean
  ready: boolean
  error: string | null
} {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    let authEventVersion = 0
    let requestVersion = 0

    const syncSession = async (next: Session | null) => {
      const request = ++requestVersion
      setSession(next)
      setIsAdmin(false)
      setError(null)

      if (!next) {
        setReady(true)
        return
      }

      setReady(false)
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', next.user.id)
        .maybeSingle()

      if (!alive || request !== requestVersion) return
      if (profileError) {
        setError('Impossible de vérifier les droits administrateur. Réessayez plus tard.')
      } else if (!data) {
        setError('Profil introuvable. Contactez un administrateur de la plateforme.')
      } else {
        setIsAdmin(data.is_admin === true)
      }
      setReady(true)
    }

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      authEventVersion += 1
      if (!alive) return
      setSession(next)
      setReady(false)
      window.setTimeout(() => {
        if (alive) void syncSession(next)
      }, 0)
    })

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!alive || authEventVersion > 0) return
      if (sessionError) {
        setError('Impossible de récupérer la session. Rechargez la page et réessayez.')
        setReady(true)
        return
      }
      void syncSession(data.session)
    })

    return () => {
      alive = false
      requestVersion += 1
      sub.subscription.unsubscribe()
    }
  }, [])

  return { session, isAdmin, ready, error }
}
