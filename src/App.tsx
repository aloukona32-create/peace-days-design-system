import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Layout, PageTransition } from './components/layout'
import { useSession } from './lib/useSession'

// Importateurs de chunk conservés pour le préchargement (usePreloadRoutes) :
// `lazy()` et le préchargement partagent la MÊME fonction, donc le même chunk.
const load = {
  home: () => import('./pages/Home'),
  peaceDays: () => import('./pages/PeaceDays'),
  doggo: () => import('./pages/Doggo'),
  evenements: () => import('./pages/Evenements'),
  concept: () => import('./pages/Concept'),
  programme: () => import('./pages/Programme'),
  designSystem: () => import('./pages/DesignSystem'),
  connexion: () => import('./pages/Connexion'),
  inscription: () => import('./pages/Inscription'),
  compte: () => import('./pages/Compte'),
  notFound: () => import('./pages/NotFound'),
}

const Home = lazy(load.home)
const PeaceDays = lazy(load.peaceDays)
const Doggo = lazy(load.doggo)
const Evenements = lazy(load.evenements)
const Concept = lazy(load.concept)
const Programme = lazy(load.programme)
const DesignSystem = lazy(load.designSystem)
const Connexion = lazy(load.connexion)
const Inscription = lazy(load.inscription)
const Compte = lazy(load.compte)
const NotFound = lazy(load.notFound)
const AdminApp = lazy(() => import('./admin'))

/**
 * Précharge les chunks des pages dès que le navigateur est au repos : au clic,
 * le module est déjà en cache, donc la transition ne retombe jamais sur un
 * écran de secours (Suspense) à mi-animation — plus de flash blanc.
 */
function usePreloadRoutes() {
  useEffect(() => {
    const run = () => {
      for (const fn of Object.values(load)) void fn()
    }
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(run)
      return () => window.cancelIdleCallback?.(id)
    }
    const t = window.setTimeout(run, 1200)
    return () => window.clearTimeout(t)
  }, [])
}

/** Garde d'accès membre : renvoie vers /connexion tant que la session n'est pas prête/absente. */
function RequireMember({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { session, ready } = useSession()
  if (!ready)
    return (
      <div className="flex min-h-screen items-center justify-center bg-pd-night text-pd-sand-dim">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-pd-gold-bright" />
      </div>
    )
  if (!session) return <Navigate to="/connexion" replace state={{ from: location.pathname }} />
  return <>{children}</>
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      {/* La clé sur le pathname déclenche l'animation sortie → entrée. Le
          Suspense est À L'INTÉRIEUR de l'enveloppe animée : un chunk pas encore
          chargé n'écrase donc plus toute la transition (fini l'écran blanc). */}
      <PageTransition key={location.pathname}>
        <Suspense fallback={null}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/doggo" element={<Doggo />} />
            <Route path="/peace-days" element={<PeaceDays />} />
            <Route path="/peace-days/programme" element={<Programme />} />
            <Route path="/peace-days/concept" element={<Concept />} />
            <Route path="/evenements" element={<Evenements />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/compte" element={<RequireMember><Compte /></RequireMember>} />
            <Route path="/design-system" element={<DesignSystem />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageTransition>
    </AnimatePresence>
  )
}

export default function App() {
  const location = useLocation()
  usePreloadRoutes()

  // Le back-office vit sur /admin : pas de Layout public (ni header, footer, Lenis ou ThemeLab).
  if (location.pathname.startsWith('/admin')) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-pd-night" />}>
        <AdminApp />
      </Suspense>
    )
  }

  return (
    <Layout>
      <AnimatedRoutes />
    </Layout>
  )
}
