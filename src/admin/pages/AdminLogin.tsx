import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuthSession } from '../useAuthSession'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { session, isAdmin, ready, error: accessError } = useAuthSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // Déjà connecté → on file directement au tableau de bord.
  useEffect(() => {
    if (ready && session && isAdmin) navigate('/admin', { replace: true })
  }, [ready, session, isAdmin, navigate])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setBusy(false)
    if (authError) {
      setError('Identifiants invalides. Vérifiez votre e-mail et votre mot de passe.')
      return
    }
  }

  const signOut = async () => {
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) setError('La déconnexion a échoué. Réessayez.')
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-pd-night px-4 text-pd-sand">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-radial-gold" />
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-pd-gold/10 blur-[120px]" />
        <div className="absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-pd-emerald/10 blur-[130px]" />
      </div>
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.045] p-8 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.95)] ring-1 ring-inset ring-white/[0.05] backdrop-blur-2xl sm:p-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-royal font-display text-2xl font-semibold text-pd-ink ring-1 ring-inset ring-pd-gold-bright/60 shadow-[0_10px_30px_-10px_rgba(201,162,39,0.7)]">
            P
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold text-pd-sand">Peace Days · Back-office</h1>
          <p className="mt-1.5 text-sm text-pd-sand-dim">Connectez-vous pour accéder à l’administration.</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-pd-sand-dim">Adresse e-mail</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pd-sand-dim" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                placeholder="vous@exemple.com"
                required
                className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-pd-sand transition-colors placeholder:text-pd-sand-dim/70 focus:border-pd-gold-bright/50 focus:outline-none focus:ring-1 focus:ring-pd-gold-bright/40"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-pd-sand-dim">Mot de passe</span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pd-sand-dim" />
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-10 text-sm text-pd-sand transition-colors placeholder:text-pd-sand-dim/70 focus:border-pd-gold-bright/50 focus:outline-none focus:ring-1 focus:ring-pd-gold-bright/40"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-pd-sand-dim transition-colors hover:text-pd-sand"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {accessError && (
            <div role="alert" className="space-y-3 rounded-xl border border-pd-rose/40 bg-pd-rose/15 px-3 py-2.5 text-xs text-[#e08a83]">
              <p>{accessError}</p>
              {session && (
                <button type="button" onClick={() => void signOut()} className="font-semibold underline underline-offset-2">
                  Se déconnecter
                </button>
              )}
            </div>
          )}

          {session && ready && !accessError && !isAdmin && (
            <div role="alert" className="space-y-3 rounded-xl border border-pd-rose/40 bg-pd-rose/15 px-3 py-2.5 text-xs text-[#e08a83]">
              <p>Ce compte est connecté, mais n’a pas accès à l’administration. Faites activer `is_admin` sur son profil.</p>
              <button type="button" onClick={() => void signOut()} className="font-semibold underline underline-offset-2">
                Se déconnecter
              </button>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-pd-rose/40 bg-pd-rose/15 px-3 py-2.5 text-xs text-[#e08a83]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold-royal px-4 py-3 text-sm font-semibold text-pd-ink ring-1 ring-inset ring-pd-gold-bright/60 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-pd-ink/30 border-t-pd-ink" />
                Connexion…
              </>
            ) : (
              <>
                Se connecter <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-white/10 pt-5 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-pd-sand-dim transition-colors hover:text-pd-sand">
            <ArrowLeft className="h-3.5 w-3.5" /> Retour au site
          </Link>
        </div>
      </div>
    </div>
  )
}
