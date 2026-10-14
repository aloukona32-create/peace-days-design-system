import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../../lib/analytics'

/**
 * Enregistre une vue de page à chaque changement de route. Monté dans la
 * coquille publique uniquement (le back-office /admin n'est pas tracké).
 * Ne rend rien.
 */
export function PageViewTracker() {
  const { pathname } = useLocation()
  useEffect(() => {
    void trackPageView(pathname)
  }, [pathname])
  return null
}
