import { useState, type ReactNode } from 'react'
import { AnimatePresence } from 'framer-motion'
import { SmoothScroll, ScrollProgress } from '../motion'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'
import { ScrollToTop } from './ScrollToTop'
import { Loader } from './Loader'
import { ThemeLab } from '../dev/ThemeLab'
import { PageViewTracker } from '../analytics/PageViewTracker'

/**
 * Coquille globale : scroll fluide (Lenis), barre de progression dorée, rideau
 * d'introduction, en-tête fixe et pied de page institutionnel. Les routes
 * animées sont rendues dans <main>.
 */
export function Layout({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)

  return (
    <SmoothScroll>
      <AnimatePresence>
        {!ready && <Loader key="loader" onDone={() => setReady(true)} />}
      </AnimatePresence>

      <ScrollProgress />
      <ScrollToTop />
      <PageViewTracker />

      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-sm focus:bg-pd-gold focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-pd-ink"
      >
        Aller au contenu
      </a>

      <SiteHeader />

      <main id="content" className="min-h-screen">
        {children}
      </main>

      <SiteFooter />
      <ThemeLab />
    </SmoothScroll>
  )
}
