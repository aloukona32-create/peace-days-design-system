import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

/**
 * Suit la session Supabase Auth. `ready` passe à true une fois la session
 * initiale récupérée (évite de rediriger vers /login pendant le chargement).
 */
export function useAuthSession(): { session: Session | null; ready: boolean } {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let alive = true
    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return
      setSession(data.session)
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      if (alive) setSession(next)
    })
    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [])

  return { session, ready }
}
