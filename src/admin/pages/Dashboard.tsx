import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import {
  MessagesSquare,
  Store,
  Utensils,
  Mail,
  Handshake,
  Eye,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from 'lucide-react'
import {
  GlassPanel,
  Sparkline,
  BarChart,
  DonutChart,
  PageHeader,
  StatusPill,
  LoadingState,
} from '../components'
import {
  getEngagements,
  getCandidatures,
  getReservations,
  getPartenaires,
  getAbonnes,
  getPageViews,
  buildKpis,
  buildEngagementsSerie,
  buildActivites,
  timeAgo,
  type Kpi,
  type ActiviteType,
} from '../data'
import { getProgram } from '../../lib/program'
import { useContent } from '../../i18n/content'
import { cn } from '../../lib/utils'
import { useAsyncRows } from '../useAsyncRows'

const KPI_ICONS: Record<string, LucideIcon> = {
  visiteurs: Eye,
  engagements: MessagesSquare,
  candidatures: Store,
  reservations: Utensils,
  newsletter: Mail,
}

const ACT_ICONS: Record<ActiviteType, LucideIcon> = {
  engagement: MessagesSquare,
  candidature: Store,
  reservation: Utensils,
  partenaire: Handshake,
  newsletter: Mail,
}

function StatCard({ kpi }: { kpi: Kpi }) {
  const Icon = KPI_ICONS[kpi.key] ?? MessagesSquare
  const up = kpi.delta >= 0
  return (
    <GlassPanel className="p-5">
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-pd-gold/20 bg-pd-gold/10 text-pd-gold-bright">
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <span className={cn('inline-flex items-center gap-1 text-xs font-semibold', up ? 'text-[#7fd0aa]' : 'text-[#e08a83]')}>
          {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          {up ? '+' : ''}{kpi.delta}%
        </span>
      </div>
      <p className="mt-4 font-display text-3xl font-semibold text-pd-sand">{kpi.display}</p>
      <p className="mt-1 text-sm text-pd-sand-dim">{kpi.label}</p>
      <div className="mt-3">
        <Sparkline data={kpi.spark} />
      </div>
    </GlassPanel>
  )
}
export default function Dashboard() {
  const { EVENT } = useContent()
  const engagementsState = useAsyncRows(getEngagements)
  const candidaturesState = useAsyncRows(getCandidatures)
  const reservationsState = useAsyncRows(getReservations)
  const partenairesState = useAsyncRows(getPartenaires)
  const abonnesState = useAsyncRows(getAbonnes)
  const pageViewsState = useAsyncRows(() => getPageViews(30))
  const programState = useAsyncRows(getProgram)
  const { rows: engagements } = engagementsState
  const { rows: candidatures } = candidaturesState
  const { rows: reservations } = reservationsState
  const { rows: partenaires } = partenairesState
  const { rows: abonnes } = abonnesState
  const { rows: pageViews } = pageViewsState
  const { rows: program } = programState

  const sources = [
    { label: 'Engagements', state: engagementsState },
    { label: 'Candidatures', state: candidaturesState },
    { label: 'Réservations', state: reservationsState },
    { label: 'Partenaires', state: partenairesState },
    { label: 'Newsletter', state: abonnesState },
    { label: 'Audience', state: pageViewsState },
    { label: 'Programme', state: programState },
  ]
  const loading = sources.some(({ state }) => state.loading)
  const errors = sources.filter(({ state }) => state.error)
  const reloadAll = () => sources.forEach(({ state }) => state.reload())

  const input = { engagements, candidatures, reservations, partenaires, abonnes, pageViews }
  const kpis = buildKpis(input)
  const serie = buildEngagementsSerie(engagements, 14)
  const activites = buildActivites(input)

  const donut = [
    { label: 'Publiés', value: engagements.filter((e) => e.statut === 'publie').length, color: '#3A7A5E' },
    { label: 'En attente', value: engagements.filter((e) => e.statut === 'en_attente').length, color: '#E7C86B' },
    { label: 'Refusés', value: engagements.filter((e) => e.statut === 'refuse').length, color: '#B5443B' },
  ]

  const aTraiter = [
    { label: 'Engagements à modérer', count: engagements.filter((e) => e.statut === 'en_attente').length, to: '/admin/voix-de-la-paix' },
    { label: 'Candidatures à étudier', count: candidatures.filter((c) => c.statut === 'soumis' || c.statut === 'en_revue').length, to: '/admin/candidatures' },
    { label: 'Réservations à confirmer', count: reservations.filter((r) => r.statut === 'demande' || r.statut === 'liste_attente').length, to: '/admin/reservations' },
  ]
  const momentsForts = program.flatMap((day) =>
    day.sessions.map((session) => ({ id: session.id, title: session.title, date: day.label, time: session.time })),
  ).slice(0, 5)

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Vue d’ensemble"
        title="Tableau de bord"
        description={`L’activité de ${EVENT.name} ${EVENT.edition} — engagements, candidatures, réservations et partenariats.`}
      />

      {loading ? (
        <GlassPanel><LoadingState label="Chargement des données Supabase…" /></GlassPanel>
      ) : errors.length > 0 ? (
        <GlassPanel className="space-y-4 p-6">
          <div>
            <h2 className="font-display text-lg font-semibold text-pd-sand">Certaines données n’ont pas pu être chargées</h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-[#e08a83]">
              {errors.map(({ label, state }) => <li key={label}>{label} : {state.error}</li>)}
            </ul>
          </div>
          <button type="button" onClick={reloadAll} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-pd-sand">
            Réessayer
          </button>
        </GlassPanel>
      ) : (
      <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {kpis.map((k) => (
          <StatCard key={k.key} kpi={k} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassPanel className="p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-pd-sand">Engagements pour la paix</h2>
              <p className="text-xs text-pd-sand-dim">14 derniers jours</p>
            </div>
            <StatusPill tone="gold">Données Supabase</StatusPill>
          </div>
          <BarChart data={serie} />
        </GlassPanel>
        <GlassPanel className="p-6">
          <h2 className="mb-6 font-display text-lg font-semibold text-pd-sand">Statut des engagements</h2>
          <DonutChart segments={donut} caption="engagements" />
        </GlassPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassPanel className="p-6 lg:col-span-2">
          <h2 className="mb-4 font-display text-lg font-semibold text-pd-sand">Activité récente</h2>
          {activites.length === 0 ? (
            <p className="px-2 py-6 text-sm text-pd-sand-dim">Aucune activité pour le moment.</p>
          ) : (
            <ul className="space-y-1">
              {activites.map((a) => {
                const Icon = ACT_ICONS[a.type]
                return (
                  <li key={a.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-white/[0.03]">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-pd-gold-soft">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-pd-sand">{a.texte}</span>
                    <span className="shrink-0 text-xs text-pd-sand-dim">{timeAgo(a.quand)}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </GlassPanel>

        <GlassPanel className="p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-pd-sand">À traiter</h2>
          <ul className="space-y-2">
            {aTraiter.map((t) => (
              <li key={t.to}>
                <Link
                  to={t.to}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-pd-gold/30 hover:bg-white/[0.06]"
                >
                  <span className="text-sm text-pd-sand">{t.label}</span>
                  <span className="flex items-center gap-2">
                    <span className="rounded-full bg-pd-gold/15 px-2 py-0.5 text-xs font-semibold tabular-nums text-pd-gold-bright">{t.count}</span>
                    <ArrowRight className="h-4 w-4 text-pd-sand-dim transition-transform group-hover:translate-x-0.5 group-hover:text-pd-gold-bright" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </GlassPanel>
      </div>

      <GlassPanel className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-pd-sand">Prochains temps forts</h2>
          <Link to="/admin/programme" className="inline-flex items-center gap-1 text-sm text-pd-gold-soft transition-colors hover:text-pd-gold-bright">
            Programme <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {momentsForts.map((session) => (
            <div key={session.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <span className="text-xs font-semibold text-pd-gold-soft">{session.date} · {session.time}</span>
              <p className="mt-1 font-display text-sm font-semibold text-pd-sand">{session.title}</p>
            </div>
          ))}
          {momentsForts.length === 0 && <p className="text-sm text-pd-sand-dim">Aucun temps fort au programme.</p>}
        </div>
      </GlassPanel>
      </>
      )}
    </div>
  )
}
