import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

/**
 * Charge une liste depuis une source asynchrone (Supabase) une fois au montage.
 * Expose `setRows` pour les mises à jour optimistes après une mutation, et
 * `reload` pour re-synchroniser avec le serveur.
 */
export function useAsyncRows<T>(fetcher: () => Promise<T[]>): {
  rows: T[]
  setRows: Dispatch<SetStateAction<T[]>>
  loading: boolean
  error: string | null
  reload: () => void
} {
  const [rows, setRows] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    let alive = true
    setLoading(true)
    fetcher()
      .then((data) => {
        if (!alive) return
        setRows(data)
        setError(null)
      })
      .catch((e: unknown) => {
        if (!alive) return
        setError(e instanceof Error ? e.message : 'Erreur de chargement des données.')
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
    }
    // `fetcher` est une fonction module stable ; on recharge via `nonce`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce])

  return { rows, setRows, loading, error, reload: () => setNonce((n) => n + 1) }
}
