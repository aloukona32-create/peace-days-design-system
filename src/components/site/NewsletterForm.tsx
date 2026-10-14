import { useState, type FormEvent } from 'react'
import { Mail, Check, Loader2 } from 'lucide-react'
import { submitAbonne } from '../../admin/data'
import { useT } from '../../i18n/useT'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const COPY = {
  fr: {
    success: 'Merci ! Votre inscription est bien enregistrée.',
    placeholder: 'Votre adresse e-mail',
    emailAria: 'Adresse e-mail',
    submit: 'S’inscrire',
    error: 'Adresse invalide ou envoi impossible. Réessayez.',
  },
  en: {
    success: 'Thank you! Your subscription has been recorded.',
    placeholder: 'Your email address',
    emailAria: 'Email address',
    submit: 'Subscribe',
    error: 'Invalid address or submission failed. Please try again.',
  },
  ar: {
    success: 'شكرًا! تم تسجيل اشتراكك بنجاح.',
    placeholder: 'عنوان بريدك الإلكتروني',
    emailAria: 'البريد الإلكتروني',
    submit: 'اشترك',
    error: 'عنوان غير صالح أو تعذّر الإرسال. حاول مرّة أخرى.',
  },
} as const

/**
 * Inscription newsletter compacte (pied de page). Insertion publique dans
 * `public.abonnes` — un e-mail déjà inscrit est traité comme un succès.
 */
export function NewsletterForm({ source = 'footer' }: { source?: string }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle')
  const { locale } = useT()
  const c = COPY[locale]

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const v = email.trim()
    if (!EMAIL_RE.test(v)) {
      setState('error')
      return
    }
    setState('busy')
    try {
      await submitAbonne({ email: v, source })
      setState('done')
      setEmail('')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <p className="mt-3 inline-flex items-center gap-2 text-sm text-pd-emerald">
        <Check className="h-4 w-4" /> {c.success}
      </p>
    )
  }

  return (
    <form onSubmit={submit} className="mt-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pd-sand-dim" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (state === 'error') setState('idle')
            }}
            placeholder={c.placeholder}
            aria-label={c.emailAria}
            className="h-11 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-pd-sand placeholder:text-pd-sand-dim/70 focus:border-pd-gold-bright/50 focus:outline-none focus:ring-1 focus:ring-pd-gold-bright/40"
          />
        </div>
        <button
          type="submit"
          disabled={state === 'busy'}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gold-royal px-5 text-sm font-semibold text-pd-ink ring-1 ring-inset ring-pd-gold-bright/60 transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {state === 'busy' ? <Loader2 className="h-4 w-4 animate-spin" /> : c.submit}
        </button>
      </div>
      {state === 'error' && (
        <p className="mt-2 text-xs text-pd-rose">{c.error}</p>
      )}
    </form>
  )
}
