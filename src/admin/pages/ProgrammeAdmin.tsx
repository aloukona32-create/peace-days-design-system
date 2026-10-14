import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { CalendarDays, MapPin, Mic, Pencil, Plus, Trash2 } from 'lucide-react'
import {
  PageHeader,
  SegmentedControl,
  StatusPill,
  GlassPanel,
  EmptyState,
  LoadingState,
  type Tone,
} from '../components'
import {
  deleteProgramDay,
  deleteProgramSession,
  getProgram,
  saveProgramDay,
  saveProgramSession,
} from '../../lib/program'
import type { AdminProgramDay, ProgramSession } from '../../lib/program'
import { useAsyncRows } from '../useAsyncRows'
import { SESSION_TYPES, type SessionType } from '../../lib/content'

const TYPE_TONE: Record<SessionType, Tone> = {
  foire: 'neutral',
  forum: 'info',
  art: 'emerald',
  sport: 'rose',
  gala: 'gold',
}

const INPUT_CLASS =
  'h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-pd-sand focus:border-pd-gold-bright/50 focus:outline-none focus:ring-1 focus:ring-pd-gold-bright/40'

type DayDraft = { id?: string; day: string; weekday: string; label: string; sortOrder: string }
type SessionDraft = {
  id?: string
  dayId: string
  time: string
  type: SessionType
  title: string
  place: string
  speaker: string
  blurb: string
  sortOrder: string
}

const EMPTY_DAY: DayDraft = { day: '', weekday: '', label: '', sortOrder: '0' }
const emptySession = (dayId = ''): SessionDraft => ({
  dayId,
  time: '',
  type: 'foire',
  title: '',
  place: '',
  speaker: '',
  blurb: '',
  sortOrder: '0',
})

function ErrorMessage({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-xl border border-pd-rose/40 bg-pd-rose/10 px-4 py-3 text-sm text-[#e08a83]">
      {children}
    </p>
  )
}

function TextField({
  label,
  value,
  onChange,
  required = true,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  type?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-pd-sand-dim">{label}</span>
      <input
        className={INPUT_CLASS}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
    </label>
  )
}

export default function ProgrammeAdmin() {
  const { rows: days, loading, error, reload } = useAsyncRows(getProgram)
  const [filter, setFilter] = useState<'tous' | SessionType>('tous')
  const [dayDraft, setDayDraft] = useState<DayDraft | null>(null)
  const [sessionDraft, setSessionDraft] = useState<SessionDraft | null>(null)
  const [busy, setBusy] = useState(false)
  const [mutationError, setMutationError] = useState<string | null>(null)

  const filteredDays = useMemo(
    () =>
      days
        .map((day) => ({
          ...day,
          sessions: filter === 'tous' ? day.sessions : day.sessions.filter((session) => session.type === filter),
        }))
        .filter((day) => day.sessions.length > 0 || filter === 'tous'),
    [days, filter],
  )
  const total = days.reduce((count, day) => count + day.sessions.length, 0)

  const editDay = (day: AdminProgramDay) => {
    setMutationError(null)
    setDayDraft({ id: day.id, day: day.day, weekday: day.weekday, label: day.label, sortOrder: String(day.sortOrder) })
  }

  const editSession = (dayId: string, session?: ProgramSession) => {
    setMutationError(null)
    setSessionDraft(
      session
        ? {
            ...session,
            dayId,
            speaker: session.speaker ?? '',
            sortOrder: String(session.sortOrder),
          }
        : emptySession(dayId),
    )
  }

  const submitDay = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!dayDraft) return
    setBusy(true)
    setMutationError(null)
    try {
      await saveProgramDay({
        ...dayDraft,
        sortOrder: Number(dayDraft.sortOrder),
      })
      setDayDraft(null)
      reload()
    } catch (cause) {
      setMutationError(cause instanceof Error ? cause.message : 'Impossible d’enregistrer cette journée.')
    } finally {
      setBusy(false)
    }
  }

  const submitSession = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!sessionDraft) return
    setBusy(true)
    setMutationError(null)
    try {
      await saveProgramSession({
        ...sessionDraft,
        sortOrder: Number(sessionDraft.sortOrder),
      })
      setSessionDraft(null)
      reload()
    } catch (cause) {
      setMutationError(cause instanceof Error ? cause.message : 'Impossible d’enregistrer cette session.')
    } finally {
      setBusy(false)
    }
  }

  const removeDay = async (day: AdminProgramDay) => {
    if (!window.confirm(`Supprimer la journée « ${day.label} » et toutes ses sessions ?`)) return
    setMutationError(null)
    try {
      await deleteProgramDay(day.id)
      reload()
    } catch (cause) {
      setMutationError(cause instanceof Error ? cause.message : 'Impossible de supprimer cette journée.')
    }
  }

  const removeSession = async (session: ProgramSession) => {
    if (!window.confirm(`Supprimer la session « ${session.title} » ?`)) return
    setMutationError(null)
    try {
      await deleteProgramSession(session.id)
      reload()
    } catch (cause) {
      setMutationError(cause instanceof Error ? cause.message : 'Impossible de supprimer cette session.')
    }
  }

  const counts = {
    tous: total,
    ...Object.fromEntries(
      SESSION_TYPES.filter((item) => item.key !== 'tous').map((item) => [
        item.key,
        days.reduce((count, day) => count + day.sessions.filter((session) => session.type === item.key).length, 0),
      ]),
    ),
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Contenu public synchronisé"
        title="Programme"
        description="Les journées et sessions affichées ici sont enregistrées dans Supabase et partagées avec la page publique du programme."
        actions={
          <button
            type="button"
            onClick={() => {
              setMutationError(null)
              setDayDraft({ ...EMPTY_DAY, sortOrder: String((days.length + 1) * 10) })
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-gold-royal px-4 py-2.5 text-sm font-semibold text-pd-ink ring-1 ring-inset ring-pd-gold-bright/60"
          >
            <Plus className="h-4 w-4" /> Ajouter une journée
          </button>
        }
      />

      {mutationError && <ErrorMessage>{mutationError}</ErrorMessage>}
      {error && <ErrorMessage>Chargement Supabase impossible : {error}</ErrorMessage>}

      {dayDraft && (
        <GlassPanel className="p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-pd-sand">
            {dayDraft.id ? 'Modifier la journée' : 'Nouvelle journée'}
          </h2>
          <form onSubmit={submitDay} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <TextField label="Jour du mois" value={dayDraft.day} onChange={(day) => setDayDraft({ ...dayDraft, day })} />
            <TextField label="Jour de la semaine" value={dayDraft.weekday} onChange={(weekday) => setDayDraft({ ...dayDraft, weekday })} />
            <TextField label="Libellé de date" value={dayDraft.label} onChange={(label) => setDayDraft({ ...dayDraft, label })} />
            <TextField label="Ordre d’affichage" type="number" value={dayDraft.sortOrder} onChange={(sortOrder) => setDayDraft({ ...dayDraft, sortOrder })} />
            <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
              <button disabled={busy} className="rounded-xl bg-pd-gold px-4 py-2 text-sm font-semibold text-pd-ink disabled:opacity-50">
                {busy ? 'Enregistrement…' : 'Enregistrer la journée'}
              </button>
              <button type="button" onClick={() => setDayDraft(null)} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-pd-sand-dim">
                Annuler
              </button>
            </div>
          </form>
        </GlassPanel>
      )}

      {sessionDraft && (
        <GlassPanel className="p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-pd-sand">
            {sessionDraft.id ? 'Modifier la session' : 'Nouvelle session'}
          </h2>
          <form onSubmit={submitSession} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-pd-sand-dim">Journée</span>
              <select className={INPUT_CLASS} value={sessionDraft.dayId} onChange={(event) => setSessionDraft({ ...sessionDraft, dayId: event.target.value })} required>
                <option value="">Choisir une journée</option>
                {days.map((day) => <option key={day.id} value={day.id}>{day.label}</option>)}
              </select>
            </label>
            <TextField label="Heure" type="time" value={sessionDraft.time} onChange={(time) => setSessionDraft({ ...sessionDraft, time })} />
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-pd-sand-dim">Type</span>
              <select className={INPUT_CLASS} value={sessionDraft.type} onChange={(event) => setSessionDraft({ ...sessionDraft, type: event.target.value as SessionType })}>
                {SESSION_TYPES.filter((item) => item.key !== 'tous').map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
              </select>
            </label>
            <TextField label="Titre" value={sessionDraft.title} onChange={(title) => setSessionDraft({ ...sessionDraft, title })} />
            <TextField label="Lieu" value={sessionDraft.place} onChange={(place) => setSessionDraft({ ...sessionDraft, place })} />
            <TextField label="Intervenant" required={false} value={sessionDraft.speaker} onChange={(speaker) => setSessionDraft({ ...sessionDraft, speaker })} />
            <TextField label="Ordre d’affichage" type="number" value={sessionDraft.sortOrder} onChange={(sortOrder) => setSessionDraft({ ...sessionDraft, sortOrder })} />
            <label className="block sm:col-span-2 lg:col-span-3">
              <span className="mb-1.5 block text-xs font-medium text-pd-sand-dim">Description</span>
              <textarea className={`${INPUT_CLASS} h-24 py-2`} value={sessionDraft.blurb} onChange={(event) => setSessionDraft({ ...sessionDraft, blurb: event.target.value })} required />
            </label>
            <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
              <button disabled={busy} className="rounded-xl bg-pd-gold px-4 py-2 text-sm font-semibold text-pd-ink disabled:opacity-50">
                {busy ? 'Enregistrement…' : 'Enregistrer la session'}
              </button>
              <button type="button" onClick={() => setSessionDraft(null)} className="rounded-xl border border-white/10 px-4 py-2 text-sm text-pd-sand-dim">
                Annuler
              </button>
            </div>
          </form>
        </GlassPanel>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          value={filter}
          onChange={(value) => setFilter(value as 'tous' | SessionType)}
          segments={SESSION_TYPES.map((item) => ({ key: item.key, label: item.label, count: counts[item.key as keyof typeof counts] }))}
        />
        <span className="text-sm text-pd-sand-dim">
          {total} session{total !== 1 ? 's' : ''} · {days.length} jour{days.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <GlassPanel><LoadingState label="Chargement du programme depuis Supabase…" /></GlassPanel>
      ) : filteredDays.length === 0 ? (
        <GlassPanel><EmptyState icon={CalendarDays} title="Aucune journée au programme" hint="Ajoutez une journée pour commencer à construire le programme." /></GlassPanel>
      ) : (
        <div className="space-y-4">
          {filteredDays.map((day) => (
            <GlassPanel key={day.id} className="p-6">
              <div className="mb-5 flex flex-wrap items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border border-pd-gold/25 bg-pd-gold/10 text-pd-gold-bright">
                  <span className="font-display text-xl font-semibold leading-none">{day.day}</span>
                  <span className="text-[0.6rem] uppercase tracking-label">{day.weekday}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-lg font-semibold text-pd-sand">{day.label}</h2>
                  <p className="text-xs text-pd-sand-dim">{day.sessions.length} session{day.sessions.length !== 1 ? 's' : ''}</p>
                </div>
                <button type="button" onClick={() => editDay(day)} aria-label={`Modifier ${day.label}`} className="rounded-lg border border-white/10 p-2 text-pd-sand-dim hover:text-pd-sand">
                  <Pencil className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => void removeDay(day)} aria-label={`Supprimer ${day.label}`} className="rounded-lg border border-white/10 p-2 text-pd-sand-dim hover:text-[#e08a83]">
                  <Trash2 className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => editSession(day.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-pd-gold/30 px-3 py-2 text-xs font-semibold text-pd-gold-bright">
                  <Plus className="h-3.5 w-3.5" /> Ajouter une session
                </button>
              </div>

              {day.sessions.length === 0 ? (
                <p className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-pd-sand-dim">
                  Aucune session dans cette journée.
                </p>
              ) : (
                <ol className="space-y-3">
                  {day.sessions.map((session) => (
                    <li key={session.id} className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-start">
                      <span className="shrink-0 font-display text-sm font-semibold tabular-nums text-pd-gold-soft sm:w-14">{session.time}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium text-pd-sand">{session.title}</h3>
                          <StatusPill tone={TYPE_TONE[session.type]}>{session.type}</StatusPill>
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-pd-sand-dim">{session.blurb}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-pd-sand-dim">
                          <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {session.place}</span>
                          {session.speaker && <span className="inline-flex items-center gap-1.5"><Mic className="h-3.5 w-3.5" /> {session.speaker}</span>}
                        </div>
                      </div>
                      <button type="button" onClick={() => editSession(day.id, session)} aria-label={`Modifier ${session.title}`} className="rounded-lg border border-white/10 p-2 text-pd-sand-dim hover:text-pd-sand">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => void removeSession(session)} aria-label={`Supprimer ${session.title}`} className="rounded-lg border border-white/10 p-2 text-pd-sand-dim hover:text-[#e08a83]">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ol>
              )}
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  )
}
