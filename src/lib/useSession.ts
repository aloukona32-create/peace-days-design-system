import { useSyncExternalStore } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

/**
 * Suit la session Supabase Auth pour le site public (membres).
 *
 * État PARTAGÉ au niveau module : la session n'est résolue qu'une fois, puis
 * mémorisée pour toute la durée de vie de l'app. Sans ça, chaque `useSession()`
 * repartait de `ready=false` à son montage — ce qui, pour la garde /compte,
 * réaffichait un spinner plein écran à chaque navigation puis « sautait » sur
 * la page sans transition. Avec l'état partagé, la garde connaît déjà la
 * session au montage et la page /compte s'anime comme les autres.
 */
let session: Session | null = null
let ready = false
let snapshot: { session: Session | null; ready: boolean } = { session, ready }
let started = false
const listeners = new Set<() => void>()

function emit() {
  // Nouvelle référence uniquement quand l'état change (requis par useSyncExternalStore).
  snapshot = { session, ready }
  listeners.forEach((l) => l())
}

function ensureStarted() {
  if (started) return
  started = true
  supabase.auth.getSession().then(({ data }) => {
    session = data.session
    ready = true
    emit()
  })
  // Abonnement unique pour toute la vie de l'app (login/logout, refresh token).
  supabase.auth.onAuthStateChange((_event, next) => {
    session = next
    ready = true
    emit()
  })
}

function subscribe(cb: () => void): () => void {
  ensureStarted()
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

function getSnapshot() {
  return snapshot
}

export function useSession(): { session: Session | null; ready: boolean } {
  return useSyncExternalStore(subscribe, getSnapshot)
}
