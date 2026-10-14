import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { AlertTriangle, Building2, Globe, KeyRound, Save, User, type LucideIcon } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useSiteSettings, type SiteSettings } from '../../lib/siteSettings'
import { useLocale } from '../../i18n/LocaleProvider'
import { useSession } from '../../lib/useSession'
import { updateMyProfile } from '../../lib/account'
import { GlassPanel, PageHeader, SegmentedControl } from '../components'

const INPUT_CLASS =
  'h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-pd-sand focus:border-pd-gold-bright/50 focus:outline-none focus:ring-1 focus:ring-pd-gold-bright/40'

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = true,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-pd-sand-dim">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className={INPUT_CLASS}
      />
    </label>
  )
}

function Section({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <GlassPanel className="p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-pd-gold/20 bg-pd-gold/10 text-pd-gold-bright">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="font-display text-base font-semibold text-pd-sand">{title}</h2>
      </div>
      {children}
    </GlassPanel>
  )
}

export default function Parametres() {
  const { settings, loaded, error: settingsError, saveSettings } = useSiteSettings()
  const { locale, setLocale } = useLocale()
  const { session } = useSession()
  const [draft, setDraft] = useState<SiteSettings>(settings)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [profileReady, setProfileReady] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [savingSettings, setSavingSettings] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    if (loaded && !settingsError) setDraft(settings)
  }, [loaded, settingsError, settings])

  useEffect(() => {
    let active = true
    const loadProfile = async () => {
      if (!session?.user.id) {
        setProfileError('Session administrateur introuvable. Reconnectez-vous.')
        setProfileReady(true)
        return
      }
      const { data, error: queryError } = await supabase
        .from('profiles')
        .select('prenom,nom,is_admin')
        .eq('id', session.user.id)
        .maybeSingle()

      if (!active) return
      if (queryError) {
        setProfileError(queryError.message)
      } else if (!data) {
        setProfileError('Profil administrateur introuvable.')
      } else {
        setFirstName(data.prenom ?? '')
        setLastName(data.nom ?? '')
        setIsAdmin(data.is_admin === true)
        setProfileError(null)
      }
      setProfileReady(true)
    }
    void loadProfile()
    return () => {
      active = false
    }
  }, [session?.user.id])

  const saveEventSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSavingSettings(true)
    setMessage(null)
    setActionError(null)
    try {
      await saveSettings(draft)
      setMessage('Les paramètres de l’événement ont été enregistrés et sont visibles sur le site public.')
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'Impossible d’enregistrer les paramètres.')
    } finally {
      setSavingSettings(false)
    }
  }

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSavingProfile(true)
    setMessage(null)
    setActionError(null)
    try {
      await updateMyProfile({ prenom: firstName, nom: lastName })
      setMessage('Votre nom de profil a été enregistré.')
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : 'Impossible d’enregistrer votre profil.')
    } finally {
      setSavingProfile(false)
    }
  }

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPasswordError(null)
    setMessage(null)
    if (password.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    if (password !== confirmPassword) {
      setPasswordError('Les deux mots de passe ne correspondent pas.')
      return
    }
    setSavingPassword(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setSavingPassword(false)
    if (updateError) {
      setPasswordError(updateError.message)
      return
    }
    setPassword('')
    setConfirmPassword('')
    setMessage('Votre mot de passe a été modifié.')
  }

  const fullName = [firstName, lastName].filter(Boolean).join(' ')
  const initials = (fullName || session?.user.email || 'A')
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Configuration"
        title="Paramètres"
        description="Les informations de l’événement sont enregistrées dans Supabase et répercutées sur le site public. Le programme se gère depuis la page Programme."
      />

      {message && <p role="status" className="rounded-xl border border-pd-emerald/40 bg-pd-emerald/10 px-4 py-3 text-sm text-[#7fd0aa]">{message}</p>}
      {actionError && <p role="alert" className="rounded-xl border border-pd-rose/40 bg-pd-rose/10 px-4 py-3 text-sm text-[#e08a83]">{actionError}</p>}

      <div className="grid gap-6 lg:grid-cols-2">
        <Section icon={Building2} title="Événement">
          {settingsError ? (
            <p role="alert" className="text-sm text-[#e08a83]">
              Impossible de charger les paramètres Supabase : {settingsError}. Exécutez le script `04_admin_content.sql`.
            </p>
          ) : !loaded ? (
            <p role="status" className="text-sm text-pd-sand-dim">Chargement des paramètres enregistrés…</p>
          ) : (
            <form onSubmit={saveEventSettings} className="space-y-4">
              <Field label="Nom de l’événement" value={draft.eventName} onChange={(eventName) => setDraft({ ...draft, eventName })} />
              <Field label="Édition" value={draft.edition} onChange={(edition) => setDraft({ ...draft, edition })} />
              <Field label="Dates" value={draft.datesLabel} onChange={(datesLabel) => setDraft({ ...draft, datesLabel })} />
              <Field label="Lieu" value={draft.location} onChange={(location) => setDraft({ ...draft, location })} />
              <Field label="E-mail de contact" type="email" required={false} value={draft.contactEmail} onChange={(contactEmail) => setDraft({ ...draft, contactEmail })} />
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-pd-sand-dim">Présentation courte</span>
                <textarea
                  className={`${INPUT_CLASS} h-24 py-2`}
                  value={draft.tagline}
                  onChange={(event) => setDraft({ ...draft, tagline: event.target.value })}
                  required
                />
              </label>
              <button disabled={savingSettings} className="inline-flex items-center gap-2 rounded-xl bg-gold-royal px-4 py-2.5 text-sm font-semibold text-pd-ink disabled:opacity-50">
                <Save className="h-4 w-4" /> {savingSettings ? 'Enregistrement…' : 'Enregistrer l’événement'}
              </button>
            </form>
          )}
        </Section>

        <div className="space-y-6">
          <Section icon={Globe} title="Préférences">
            <p className="mb-3 text-xs font-medium text-pd-sand-dim">Langue de l’interface</p>
            <SegmentedControl
              value={locale}
              onChange={(value) => setLocale(value as typeof locale)}
              segments={[
                { key: 'fr', label: 'Français' },
                { key: 'en', label: 'English' },
                { key: 'ar', label: 'العربية' },
              ]}
            />
            <p className="mt-3 text-xs leading-relaxed text-pd-sand-dim">
              Le choix est appliqué immédiatement et conservé dans ce navigateur.
            </p>
          </Section>

          <Section icon={User} title="Compte administrateur">
            {!profileReady ? (
              <p role="status" className="text-sm text-pd-sand-dim">Chargement du profil…</p>
            ) : profileError ? (
              <p role="alert" className="text-sm text-[#e08a83]">{profileError}</p>
            ) : (
              <>
                <div className="mb-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-pd-gold/25 bg-gradient-to-br from-pd-gold/25 to-pd-gold/[0.04] text-sm font-semibold text-pd-gold-bright">
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-pd-sand">{fullName || 'Nom non renseigné'}</p>
                    <p className="truncate text-xs text-pd-sand-dim">{session?.user.email}</p>
                    <p className="text-xs text-pd-gold-soft">{isAdmin ? 'Administrateur' : 'Compte membre'}</p>
                  </div>
                </div>
                <form onSubmit={saveProfile} className="space-y-4">
                  <Field label="Prénom" value={firstName} onChange={setFirstName} />
                  <Field label="Nom" value={lastName} onChange={setLastName} />
                  <button disabled={savingProfile} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-pd-sand disabled:opacity-50">
                    {savingProfile ? 'Enregistrement…' : 'Enregistrer mon profil'}
                  </button>
                </form>
              </>
            )}
          </Section>

          <Section icon={KeyRound} title="Mot de passe">
            <form onSubmit={changePassword} className="space-y-4">
              <Field label="Nouveau mot de passe" type="password" value={password} onChange={setPassword} />
              <Field label="Confirmer le mot de passe" type="password" value={confirmPassword} onChange={setConfirmPassword} />
              {passwordError && (
                <p role="alert" className="flex items-start gap-2 text-xs text-[#e08a83]">
                  <AlertTriangle className="h-4 w-4 shrink-0" /> {passwordError}
                </p>
              )}
              <button disabled={savingPassword} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-pd-sand disabled:opacity-50">
                {savingPassword ? 'Modification…' : 'Modifier le mot de passe'}
              </button>
            </form>
          </Section>
        </div>
      </div>

      <GlassPanel className="p-5">
        <p className="text-sm font-medium text-pd-sand">Notifications par e-mail</p>
        <p className="mt-1 text-xs leading-relaxed text-pd-sand-dim">
          Aucun service d’envoi d’e-mails n’est configuré pour ce projet. Les anciens interrupteurs de notification ont été retirés : ils n’envoyaient aucune alerte.
        </p>
      </GlassPanel>
    </div>
  )
}
