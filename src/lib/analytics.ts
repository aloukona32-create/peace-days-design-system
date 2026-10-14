import { supabase } from './supabase'

// Suivi d'audience « maison » : chaque changement de route enregistre une vue
// dans public.page_views (voir supabase/03_analytics.sql). Best-effort — ne
// doit jamais interrompre la navigation si la base est absente / hors-ligne.

const VID_KEY = 'pd_vid'
const NIL_UUID = '00000000-0000-0000-0000-000000000000'

/** UUID de visiteur stable (localStorage) — anonyme, pas une identité. */
function visitorId(): string {
  try {
    let id = localStorage.getItem(VID_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(VID_KEY, id)
    }
    return id
  } catch {
    return NIL_UUID // navigation privée / stockage bloqué
  }
}

let lastPath = ''

/** Enregistre une vue de page (silencieux en cas d'erreur). */
export async function trackPageView(path: string): Promise<void> {
  if (path === lastPath) return // évite les doublons sur re-render de la même route
  lastPath = path
  try {
    await supabase.from('page_views').insert({
      path,
      visitor_id: visitorId(),
      referrer: typeof document !== 'undefined' ? document.referrer || null : null,
    })
  } catch {
    /* l'analytics ne doit jamais casser l'app */
  }
}
