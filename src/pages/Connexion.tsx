import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'
import { AuthShell } from '../components/site/AuthShell'
import { GlassInput, GlassLabel, GoldButton } from '../components/ui'
import { useSession } from '../lib/useSession'
import { signInMember, authErrorFr } from '../lib/account'
import { useT } from '../i18n/useT'

const COPY = {
  fr: {
    title: 'Connexion',
    subtitle: 'Accédez à votre espace Peace Days : demandes, réservations et engagements.',
    noAccount: 'Pas encore de compte ?',
    createAccount: 'Créer un compte',
    emailLabel: 'Adresse e-mail',
    emailPlaceholder: 'vous@exemple.com',
    passwordLabel: 'Mot de passe',
    showPassword: 'Afficher le mot de passe',
    hidePassword: 'Masquer le mot de passe',
    signingIn: 'Connexion…',
  },
  en: {
    title: 'Sign in',
    subtitle: 'Access your Peace Days space: applications, bookings and commitments.',
    noAccount: 'No account yet?',
    createAccount: 'Create an account',
    emailLabel: 'Email address',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'Password',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    signingIn: 'Signing in…',
  },
  ar: {
    title: 'تسجيل الدخول',
    subtitle: 'ادخل إلى مساحتك في Peace Days: الطلبات والحجوزات والالتزامات.',
    noAccount: 'ليس لديك حساب بعد؟',
    createAccount: 'إنشاء حساب',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'you@example.com',
    passwordLabel: 'كلمة المرور',
    showPassword: 'إظهار كلمة المرور',
    hidePassword: 'إخفاء كلمة المرور',
    signingIn: 'جارٍ تسجيل الدخول…',
  },
} as const

export default function Connexion() {
  const navigate = useNavigate()
  const location = useLocation()
  const { session, ready } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const { t, locale } = useT()
  const c = COPY[locale]

  // Destination après connexion (ex. renvoyé par le garde /compte).
  const from = (location.state as { from?: string } | null)?.from ?? '/compte'

  useEffect(() => {
    if (ready && session) navigate(from, { replace: true })
  }, [ready, session, navigate, from])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await signInMember(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(authErrorFr(err instanceof Error ? err.message : '', locale))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell
      title={c.title}
      subtitle={c.subtitle}
      footer={
        <span className="text-pd-sand-dim">
          {c.noAccount}{' '}
          <Link to="/inscription" className="font-medium text-pd-gold-soft transition-colors hover:text-pd-gold-bright">
            {c.createAccount}
          </Link>
        </span>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <GlassLabel>{c.emailLabel}</GlassLabel>
          <GlassInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            placeholder={c.emailPlaceholder}
            required
            icon={<Mail className="h-4 w-4" />}
          />
        </label>

        <label className="block">
          <GlassLabel>{c.passwordLabel}</GlassLabel>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pd-sand-dim" />
            <GlassInput
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              required
              className="pl-9 pr-10"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? c.hidePassword : c.showPassword}
              className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-pd-sand-dim transition-colors hover:text-pd-sand"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-pd-rose/40 bg-pd-rose/15 px-3 py-2.5 text-xs text-[#e08a83]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <GoldButton type="submit" size="md" disabled={busy} className="mt-1 w-full">
          {busy ? c.signingIn : <>{t('header.login')} <ArrowRight className="h-4 w-4" /></>}
        </GoldButton>
      </form>
    </AuthShell>
  )
}
