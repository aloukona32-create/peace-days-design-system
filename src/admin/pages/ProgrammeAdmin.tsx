import { useMemo, useState } from 'react'
import { CalendarDays, MapPin, Mic } from 'lucide-react'
import { PageHeader, SegmentedControl, StatusPill, GlassPanel, EmptyState, type Tone } from '../components'
import { PROGRAM, SESSION_TYPES, type SessionType } from '../../lib/content'

const TYPE_TONE: Record<SessionType, Tone> = {
  foire: 'neutral',
  forum: 'info',
  art: 'emerald',
  sport: 'rose',
  gala: 'gold',
}

const TYPE_LABEL: Record<SessionType, string> = {
  foire: 'Foire',
  forum: 'Forum',
  art: 'Art',
  sport: 'Sport',
  gala: 'Gala',
}

export default function ProgrammeAdmin() {
  const [filter, setFilter] = useState<'tous' | SessionType>('tous')

  const days = useMemo(
    () =>
      PROGRAM.map((d) => ({
        ...d,
        sessions: filter === 'tous' ? d.sessions : d.sessions.filter((s) => s.type === filter),
      })).filter((d) => d.sessions.length > 0),
    [filter],
  )

  const total = days.reduce((n, d) => n + d.sessions.length, 0)
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Semaine du 18 — 25 janvier 2027"
        title="Programme"
        description="Le déroulé officiel des cinq rendez-vous. Filtrez par type d’événement pour préparer chaque journée."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          value={filter}
          onChange={(k) => setFilter(k as 'tous' | SessionType)}
          segments={SESSION_TYPES.map((t) => ({ key: t.key, label: t.label }))}
        />
        <span className="text-sm text-pd-sand-dim">
          {total} session{total > 1 ? 's' : ''} · {days.length} jour{days.length > 1 ? 's' : ''}
        </span>
      </div>

      {days.length === 0 ? (
        <GlassPanel>
          <EmptyState icon={CalendarDays} title="Aucune session" hint="Aucun événement de ce type au programme." />
        </GlassPanel>
      ) : (
        <div className="space-y-4">
          {days.map((d) => (
            <GlassPanel key={d.id} className="p-6">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border border-pd-gold/25 bg-pd-gold/10 text-pd-gold-bright">
                  <span className="font-display text-xl font-semibold leading-none">{d.day}</span>
                  <span className="text-[0.6rem] uppercase tracking-label">{d.weekday}</span>
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-pd-sand">{d.label}</h2>
                  <p className="text-xs text-pd-sand-dim">{d.sessions.length} session{d.sessions.length > 1 ? 's' : ''}</p>
                </div>
              </div>

              <ol className="space-y-3">
                {d.sessions.map((s, i) => (
                  <li
                    key={`${d.id}-${i}`}
                    className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20 sm:flex-row sm:items-start sm:gap-4"
                  >
                    <span className="shrink-0 font-display text-sm font-semibold tabular-nums text-pd-gold-soft sm:w-14">{s.time}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium text-pd-sand">{s.title}</h3>
                        <StatusPill tone={TYPE_TONE[s.type]}>{TYPE_LABEL[s.type]}</StatusPill>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-pd-sand-dim">{s.blurb}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-pd-sand-dim">
                        <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {s.place}</span>
                        {s.speaker && <span className="inline-flex items-center gap-1.5"><Mic className="h-3.5 w-3.5" /> {s.speaker}</span>}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  )
}
