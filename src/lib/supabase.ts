import { createClient } from '@supabase/supabase-js'

// Clés publiques uniquement (URL + anon/publishable). Elles sont destinées au
// navigateur : la sécurité repose sur les policies RLS côté base, PAS sur le
// secret de la clé. Ne jamais mettre la clé `service_role` ici.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  // Message explicite en dev plutôt qu'un échec réseau opaque.
  console.warn(
    '[supabase] VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY manquant — ' +
      'copiez .env.example vers .env.local et renseignez vos clés.',
  )
}

export const supabase = createClient(url ?? '', anonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
