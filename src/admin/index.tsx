import { lazy, Suspense, type ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import { useAuthSession } from './useAuthSession'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const VoixDeLaPaix = lazy(() => import('./pages/VoixDeLaPaix'))
const Candidatures = lazy(() => import('./pages/Candidatures'))
const Demandes = lazy(() => import('./pages/Demandes'))
const Reservations = lazy(() => import('./pages/Reservations'))
const Partenaires = lazy(() => import('./pages/Partenaires'))
const Newsletter = lazy(() => import('./pages/Newsletter'))
const ProgrammeAdmin = lazy(() => import('./pages/ProgrammeAdmin'))
const Parametres = lazy(() => import('./pages/Parametres'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))

function Loader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-pd-night text-pd-sand-dim">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-pd-gold-bright" />
    </div>
  )
}

/** Garde d'accès : redirige vers /admin/login tant qu'aucune session Supabase. */
function RequireAuth({ children }: { children: ReactNode }) {
  const { session, isAdmin, ready, error } = useAuthSession()
  if (!ready) return <Loader />
  if (!session) return <Navigate to="/admin/login" replace />
  if (error) return <Navigate to="/admin/login" replace />
  if (!isAdmin) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}

export default function AdminApp() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="demandes" element={<Demandes />} />
          <Route path="voix-de-la-paix" element={<VoixDeLaPaix />} />
          <Route path="candidatures" element={<Candidatures />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="partenaires" element={<Partenaires />} />
          <Route path="newsletter" element={<Newsletter />} />
          <Route path="programme" element={<ProgrammeAdmin />} />
          <Route path="parametres" element={<Parametres />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Suspense>
  )
}
