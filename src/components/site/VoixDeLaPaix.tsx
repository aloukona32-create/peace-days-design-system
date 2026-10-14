import { useEffect, useState, type FormEvent } from 'react'
import { MessageSquareQuote, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { GlassInput, GlassLabel, GlassSelect } from '../ui/GlassField'
import { GoldButton } from '../ui/GoldButton'
import { useContent } from '../../i18n/content'
import { useT } from '../../i18n/useT'
import { useSession } from '../../lib/useSession'
import { submitEngagement, getVoixPubliees, type VoixPubliee } from '../../admin/data'
import { Reveal } from '../motion'

const INIT = { auteur: '', pays: '', email: '', theme: '', message: '' }

const COPY = {
  fr: {
    errFields: 'Merci de renseigner votre nom, e-mail, pays et message.',
    errSend: 'L’envoi a échoué (connexion ou droits). Réessayez.',
    eyebrow: 'Voix de la Paix',
    title: 'Ajoutez votre voix au mouvement',
    intro:
      'Un mot, une intention, un engagement pour la paix. Les messages validés rejoignent le mur des voix de Peace Days 2027.',
    thanksTitle: 'Merci pour votre voix',
    thanksBody: 'Votre message sera publié sur le mur après validation par notre équipe.',
    nameLabel: 'Nom / structure *',
    namePlaceholder: 'Votre nom',
    countryLabel: 'Pays *',
    countryPlaceholder: 'Sélectionnez votre pays',
    emailLabel: 'E-mail *',
    emailPlaceholder: 'vous@exemple.com',
    themeLabel: 'Thème',
    messageLabel: 'Votre message de paix *',
    messagePlaceholder: 'Partagez votre engagement, votre espoir, votre appel…',
    privacy: 'Publié après validation. Votre e-mail reste privé.',
    sending: 'Envoi…',
    submit: 'Partager ma voix',
  },
  en: {
    errFields: 'Please provide your name, email, country and message.',
    errSend: 'Submission failed (connection or permissions). Please try again.',
    eyebrow: 'Voices of Peace',
    title: 'Add your voice to the movement',
    intro:
      'A word, an intention, a commitment to peace. Approved messages join the Peace Days 2027 wall of voices.',
    thanksTitle: 'Thank you for your voice',
    thanksBody: 'Your message will be published on the wall once approved by our team.',
    nameLabel: 'Name / organisation *',
    namePlaceholder: 'Your name',
    countryLabel: 'Country *',
    countryPlaceholder: 'Select your country',
    emailLabel: 'Email *',
    emailPlaceholder: 'you@example.com',
    themeLabel: 'Theme',
    messageLabel: 'Your message of peace *',
    messagePlaceholder: 'Share your commitment, your hope, your call…',
    privacy: 'Published after approval. Your email stays private.',
    sending: 'Sending…',
    submit: 'Share my voice',
  },
  ar: {
    errFields: 'يرجى إدخال اسمك وبريدك الإلكتروني وبلدك ورسالتك.',
    errSend: 'فشل الإرسال (اتصال أو صلاحيات). يرجى المحاولة مرة أخرى.',
    eyebrow: 'أصوات السلام',
    title: 'أضف صوتك إلى الحركة',
    intro:
      'كلمة أو نيّة أو التزام من أجل السلام. الرسائل المعتمدة تنضم إلى جدار أصوات Peace Days 2027.',
    thanksTitle: 'شكرًا لصوتك',
    thanksBody: 'ستُنشر رسالتك على الجدار بعد اعتمادها من فريقنا.',
    nameLabel: 'الاسم / الجهة *',
    namePlaceholder: 'اسمك',
    countryLabel: 'البلد *',
    countryPlaceholder: 'اختر بلدك',
    emailLabel: 'البريد الإلكتروني *',
    emailPlaceholder: 'you@example.com',
    themeLabel: 'الموضوع',
    messageLabel: 'رسالتك من أجل السلام *',
    messagePlaceholder: 'شارك التزامك وأملك ونداءك…',
    privacy: 'يُنشر بعد الاعتماد. يبقى بريدك الإلكتروني خاصًا.',
    sending: 'جارٍ الإرسال…',
    submit: 'شارك صوتي',
  },
} as const

/**
 * Section « Voix de la Paix » : mur des engagements publiés (lecture publique
 * via RLS) + formulaire de soumission (insertion anon en statut 'en_attente').
 */
export function VoixDeLaPaix() {
  const { locale } = useT()
  const c = COPY[locale]
  const { COUNTRIES, THEMES } = useContent()
  const { session } = useSession()
  const [voices, setVoices] = useState<VoixPubliee[]>([])
  const [f, setF] = useState({ ...INIT, theme: THEMES[0] })
  const up = (patch: Partial<typeof INIT>) => setF((prev) => ({ ...prev, ...patch }))
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mur : les engagements déjà publiés (silencieux en cas d'échec réseau).
  useEffect(() => {
    getVoixPubliees().then(setVoices).catch(() => {})
  }, [])
  // Pré-remplit l'e-mail si un membre est connecté.
  useEffect(() => {
    if (session?.user?.email) up({ email: session.user.email })
  }, [session])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!f.auteur.trim() || !f.email.trim() || !f.pays || !f.message.trim()) {
      setError(c.errFields)
      return
    }
    setBusy(true)
    try {
      await submitEngagement({
        auteur: f.auteur.trim(), pays: f.pays, email: f.email.trim(),
        theme: f.theme, message: f.message.trim(),
      })
      setDone(true)
    } catch {
      setError(c.errSend)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section id="voix" className="relative scroll-mt-28 overflow-hidden py-24 sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-radial-gold" />
        <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-pd-gold/8 blur-[130px]" />
      </div>

      <div className="container-pd relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">{c.eyebrow}</p>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-pd-sand sm:text-4xl">
            {c.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pd-sand-dim">{c.intro}</p>
        </Reveal>

        {voices.length > 0 && (
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {voices.map((v) => (
              <li
                key={v.id}
                className="rounded-3xl border border-white/10 bg-white/[0.045] p-5 ring-1 ring-inset ring-white/[0.05] backdrop-blur-2xl"
              >
                <MessageSquareQuote className="h-5 w-5 text-pd-gold-bright/70" />
                <blockquote className="mt-3 text-sm leading-relaxed text-pd-sand">“{v.message}”</blockquote>
                <figcaption className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                  <span className="font-medium text-pd-gold-bright">{v.auteur}</span>
                  <span className="text-pd-sand-dim">· {v.pays}</span>
                  <span className="ml-auto rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[0.68rem] text-pd-sand-dim">
                    {v.theme}
                  </span>
                </figcaption>
              </li>
            ))}
          </ul>
        )}

        <div className="mx-auto mt-14 max-w-2xl">
          {done ? (
            <div className="rounded-3xl border border-pd-emerald/25 bg-pd-emerald/[0.06] p-8 text-center ring-1 ring-inset ring-white/[0.05] backdrop-blur-2xl">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pd-emerald/15 ring-1 ring-inset ring-pd-emerald/30">
                <CheckCircle2 className="h-7 w-7 text-pd-emerald" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-pd-sand">{c.thanksTitle}</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-pd-sand-dim">
                {c.thanksBody}
              </p>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.045] p-6 ring-1 ring-inset ring-white/[0.05] backdrop-blur-2xl sm:p-8"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <GlassLabel>{c.nameLabel}</GlassLabel>
                  <GlassInput value={f.auteur} onChange={(e) => up({ auteur: e.target.value })} placeholder={c.namePlaceholder} />
                </label>
                <label className="block">
                  <GlassLabel>{c.countryLabel}</GlassLabel>
                  <GlassSelect value={f.pays} onChange={(e) => up({ pays: e.target.value })}>
                    <option value="" disabled>{c.countryPlaceholder}</option>
                    {COUNTRIES.map((country) => <option key={country} value={country}>{country}</option>)}
                  </GlassSelect>
                </label>
                <label className="block">
                  <GlassLabel>{c.emailLabel}</GlassLabel>
                  <GlassInput type="email" value={f.email} onChange={(e) => up({ email: e.target.value })} placeholder={c.emailPlaceholder} />
                </label>
                <label className="block">
                  <GlassLabel>{c.themeLabel}</GlassLabel>
                  <GlassSelect value={f.theme} onChange={(e) => up({ theme: e.target.value })}>
                    {THEMES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </GlassSelect>
                </label>
              </div>
              <label className="block">
                <GlassLabel>{c.messageLabel}</GlassLabel>
                <textarea
                  value={f.message}
                  onChange={(e) => up({ message: e.target.value })}
                  rows={4}
                  placeholder={c.messagePlaceholder}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-pd-sand placeholder:text-pd-sand-dim/70 focus:border-pd-gold-bright/50 focus:outline-none focus:ring-1 focus:ring-pd-gold-bright/40"
                />
              </label>
              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-pd-rose/30 bg-pd-rose/10 px-3.5 py-3 text-sm text-pd-rose">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-pd-sand-dim">{c.privacy}</p>
                <GoldButton type="submit" size="lg" disabled={busy} className="w-full shrink-0 sm:w-auto">
                  {busy ? c.sending : c.submit}
                  {!busy && <Send className="h-4 w-4" />}
                </GoldButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
