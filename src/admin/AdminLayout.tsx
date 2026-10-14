import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  MessagesSquare,
  Store,
  Utensils,
  Handshake,
  Mail,
  CalendarDays,
  Settings,
  Bell,
  Menu,
  LogOut,
  ArrowUpRight,
  Search,
  Inbox,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { Avatar } from './components'
import { supabase } from '../lib/supabase'
import { useAuthSession } from './useAuthSession'

type NavEntry = { to: string; label: string; icon: typeof LayoutDashboard; end?: boolean }

const NAV: NavEntry[] = [
  { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/admin/demandes', label: 'Demandes', icon: Inbox },
  { to: '/admin/voix-de-la-paix', label: 'Voix de la Paix', icon: MessagesSquare },
  { to: '/admin/candidatures', label: 'Candidatures', icon: Store },
  { to: '/admin/reservations', label: 'Réservations', icon: Utensils },
  { to: '/admin/partenaires', label: 'Partenaires', icon: Handshake },
  { to: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { to: '/admin/programme', label: 'Programme', icon: CalendarDays },
  { to: '/admin/parametres', label: 'Paramètres', icon: Settings },
]

function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link to="/admin" onClick={onNavigate} className="flex items-center gap-3 px-2">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-royal font-display text-lg font-semibold text-pd-ink ring-1 ring-inset ring-pd-gold-bright/60 shadow-[0_10px_30px_-10px_rgba(201,162,39,0.7)]">
        P
      </span>
      <span className="leading-tight">
        <span className="block font-display text-sm font-semibold text-pd-sand">Peace Days</span>
        <span className="block text-[0.62rem] uppercase tracking-label text-pd-gold-soft">Back-office</span>
      </span>
    </Link>
  )
}

function SidebarContent({ onNavigate, onLogout }: { onNavigate?: () => void; onLogout: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 p-5">
      <Brand onNavigate={onNavigate} />
      <nav className="flex-1 space-y-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-white/[0.06] text-pd-gold-bright ring-1 ring-inset ring-white/10'
                  : 'text-pd-sand-dim hover:bg-white/[0.04] hover:text-pd-sand',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'absolute left-0 top-1/2 h-5 -translate-y-1/2 rounded-full bg-pd-gold-bright transition-all',
                    isActive ? 'w-1 opacity-100' : 'w-0 opacity-0',
                  )}
                />
                <item.icon className="h-[18px] w-[18px]" />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-1 border-t border-white/10 pt-4">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-pd-sand-dim transition-colors hover:text-pd-sand"
        >
          <ArrowUpRight className="h-[18px] w-[18px]" /> Voir le site
        </Link>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-pd-sand-dim transition-colors hover:text-[#e08a83]"
        >
          <LogOut className="h-[18px] w-[18px]" /> Déconnexion
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { session } = useAuthSession()
  useEffect(() => setMenuOpen(false), [location.pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  const email = session?.user?.email ?? ''
  const displayName = email ? email.split('@')[0] : 'Administrateur'

  return (
    <div className="relative min-h-screen bg-pd-night text-pd-sand">
      {/* Décor : halo doré + auras floues */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gold" />
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-pd-gold/10 blur-[120px]" />
        <div className="absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-pd-emerald/10 blur-[130px]" />
      </div>

      {/* Barre latérale — bureau */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 bg-pd-night-2/60 backdrop-blur-2xl lg:block">
        <SidebarContent onLogout={handleLogout} />
      </aside>

      {/* Barre latérale — mobile */}
      <div className={cn('fixed inset-0 z-50 lg:hidden', !menuOpen && 'pointer-events-none')}>
        <div
          className={cn('absolute inset-0 bg-pd-night/70 backdrop-blur-sm transition-opacity duration-300', menuOpen ? 'opacity-100' : 'opacity-0')}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={cn(
            'absolute inset-y-0 left-0 w-72 border-r border-white/10 bg-pd-night-2/95 backdrop-blur-2xl transition-transform duration-300 ease-premium',
            menuOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <SidebarContent onNavigate={() => setMenuOpen(false)} onLogout={handleLogout} />
        </div>
      </div>

      <div className="relative lg:pl-64">
        {/* Barre du haut */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-pd-night/60 backdrop-blur-2xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-pd-sand-dim transition-colors hover:text-pd-sand lg:hidden"
            >
              <Menu className="h-[18px] w-[18px]" />
            </button>

            <div className="relative hidden max-w-sm flex-1 sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pd-sand-dim" />
              <input
                placeholder="Rechercher dans le back-office…"
                className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-pd-sand placeholder:text-pd-sand-dim/70 focus:border-pd-gold-bright/50 focus:outline-none focus:ring-1 focus:ring-pd-gold-bright/40"
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                aria-label="Notifications"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-pd-sand-dim transition-colors hover:text-pd-sand"
              >
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-pd-gold-bright ring-2 ring-pd-night" />
              </button>
              <div className="ml-1 hidden items-center gap-3 border-l border-white/10 pl-3 sm:flex">
                <Avatar name={displayName} />
                <span className="leading-tight">
                  <span className="block max-w-[12rem] truncate text-sm font-medium text-pd-sand">{email || 'Administrateur'}</span>
                  <span className="block text-[0.7rem] text-pd-sand-dim">Administrateur</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
