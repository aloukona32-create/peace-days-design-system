import { useState, type ReactNode } from 'react'
import { Save, Building2, Bell, Globe, User, type LucideIcon } from 'lucide-react'
import { GlassPanel, PageHeader, SegmentedControl } from '../components'
import { cn } from '../../lib/utils'
import { EVENT } from '../../lib/content'

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-pd-sand-dim">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-pd-sand transition-colors focus:border-pd-gold-bright/50 focus:outline-none focus:ring-1 focus:ring-pd-gold-bright/40"
      />
    </label>
  )
}

function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="min-w-0">
        <p className="text-sm text-pd-sand">{label}</p>
        {hint && <p className="text-xs text-pd-sand-dim">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full border transition-colors',
          checked ? 'border-pd-gold-bright/60 bg-pd-gold/40' : 'border-white/15 bg-white/5',
        )}
      >
        <span
          className={cn(
            'absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-pd-sand transition-all',
            checked ? 'left-6' : 'left-1',
          )}
        />
      </button>
    </div>
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
  const [nom, setNom] = useState(`${EVENT.name} — ${EVENT.edition}`)
  const [dates, setDates] = useState<string>(EVENT.datesLabel)
  const [lieu, setLieu] = useState<string>(EVENT.location)
  const [contact, setContact] = useState('contact@peacedays.example')
  const [langue, setLangue] = useState('FR')
  const [notifEngagements, setNotifEngagements] = useState(true)
  const [notifCandidatures, setNotifCandidatures] = useState(true)
  const [notifReservations, setNotifReservations] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Configuration"
        title="Paramètres"
        description="Réglages du back-office et de l’événement. Ces préférences seront synchronisées avec Supabase prochainement."
        actions={
          <button
            type="button"
            onClick={save}
            className="inline-flex items-center gap-2 rounded-xl bg-gold-royal px-4 py-2.5 text-sm font-semibold text-pd-ink ring-1 ring-inset ring-pd-gold-bright/60 transition-opacity hover:opacity-90"
          >
            <Save className="h-4 w-4" /> {saved ? 'Enregistré ✓' : 'Enregistrer'}
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Section icon={Building2} title="Événement">
          <div className="space-y-4">
            <Field label="Nom de l’événement" value={nom} onChange={setNom} />
            <Field label="Dates" value={dates} onChange={setDates} />
            <Field label="Lieu" value={lieu} onChange={setLieu} />
            <Field label="E-mail de contact" value={contact} onChange={setContact} />
          </div>
        </Section>

        <Section icon={Bell} title="Notifications">
          <div className="divide-y divide-white/[0.06]">
            <Toggle label="Nouveaux engagements" hint="À chaque message soumis au public" checked={notifEngagements} onChange={setNotifEngagements} />
            <Toggle label="Nouvelles candidatures" hint="Demandes de stand pour la Foire" checked={notifCandidatures} onChange={setNotifCandidatures} />
            <Toggle label="Réservations Gala" hint="Demandes de tables et de couverts" checked={notifReservations} onChange={setNotifReservations} />
          </div>
        </Section>
        <Section icon={Globe} title="Préférences">
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium text-pd-sand-dim">Langue de l’interface</p>
              <SegmentedControl
                value={langue}
                onChange={setLangue}
                segments={[
                  { key: 'FR', label: 'Français' },
                  { key: 'EN', label: 'English' },
                  { key: 'AR', label: 'العربية' },
                ]}
              />
            </div>
            <p className="text-xs leading-relaxed text-pd-sand-dim">
              Le thème visuel « Nuit &amp; Or » est appliqué à l’ensemble du back-office. Les variantes de thème
              restent gérées depuis le site public.
            </p>
          </div>
        </Section>

        <Section icon={User} title="Compte">
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-pd-gold/25 bg-gradient-to-br from-pd-gold/25 to-pd-gold/[0.04] text-sm font-semibold text-pd-gold-bright">
                YA
              </span>
              <div className="min-w-0">
                <p className="font-medium text-pd-sand">Yassine</p>
                <p className="text-xs text-pd-sand-dim">Administrateur</p>
              </div>
            </div>
            <button
              type="button"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-pd-sand-dim transition-colors hover:bg-white/[0.08] hover:text-pd-sand"
            >
              Modifier le mot de passe
            </button>
          </div>
        </Section>
      </div>
    </div>
  )
}
