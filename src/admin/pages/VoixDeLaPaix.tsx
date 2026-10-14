import { useMemo, useState } from 'react'
import { Check, X, RotateCcw, Inbox, AlertTriangle } from 'lucide-react'
import {
  PageHeader,
  SegmentedControl,
  SearchField,
  DataTable,
  Drawer,
  StatusPill,
  Avatar,
  EmptyState,
  LoadingState,
  type Column,
  type Tone,
} from '../components'
import { getEngagements, updateEngagementStatut, formatDateTime, type Engagement, type EngagementStatut } from '../data'
import { useAsyncRows } from '../useAsyncRows'

const STAT: Record<EngagementStatut, { label: string; tone: Tone }> = {
  en_attente: { label: 'En attente', tone: 'gold' },
  publie: { label: 'Publié', tone: 'emerald' },
  refuse: { label: 'Refusé', tone: 'rose' },
}

export default function VoixDeLaPaix() {
  const { rows: list, setRows: setList, loading, error } = useAsyncRows(getEngagements)
  const [filter, setFilter] = useState<'tous' | EngagementStatut>('tous')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = list.find((e) => e.id === selectedId) ?? null

  const setStatut = async (id: string, statut: EngagementStatut) => {
    const prev = list
    setList((rows) => rows.map((e) => (e.id === id ? { ...e, statut } : e)))
    try {
      await updateEngagementStatut(id, statut)
    } catch {
      setList(prev)
      window.alert('La mise à jour a échoué (droits ou connexion). Statut rétabli.')
    }
  }

  const counts = {
    tous: list.length,
    en_attente: list.filter((e) => e.statut === 'en_attente').length,
    publie: list.filter((e) => e.statut === 'publie').length,
    refuse: list.filter((e) => e.statut === 'refuse').length,
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return list.filter((e) => {
      if (filter !== 'tous' && e.statut !== filter) return false
      if (!q) return true
      return [e.auteur, e.message, e.pays, e.theme, e.id].join(' ').toLowerCase().includes(q)
    })
  }, [list, filter, query])

  const columns: Column<Engagement>[] = [
    {
      key: 'auteur',
      header: 'Auteur',
      render: (e) => (
        <div className="flex items-center gap-3">
          <Avatar name={e.auteur} />
          <div className="min-w-0">
            <div className="truncate font-medium text-pd-sand">{e.auteur}</div>
            <div className="text-xs text-pd-sand-dim">{e.pays}</div>
          </div>
        </div>
      ),
    },
    { key: 'message', header: 'Message', render: (e) => <span className="line-clamp-2 max-w-md text-pd-sand-dim">{e.message}</span> },
    { key: 'theme', header: 'Thème', hideOn: 'md', render: (e) => <span className="text-pd-sand-dim">{e.theme}</span> },
    { key: 'statut', header: 'Statut', render: (e) => <StatusPill tone={STAT[e.statut].tone}>{STAT[e.statut].label}</StatusPill> },
    { key: 'date', header: 'Reçu', hideOn: 'sm', align: 'right', render: (e) => <span className="whitespace-nowrap text-xs text-pd-sand-dim">{formatDateTime(e.soumisLe)}</span> },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Modération"
        title="Voix de la Paix"
        description="Les engagements soumis par le public. Publiez, mettez en attente ou refusez avant affichage sur le site."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          value={filter}
          onChange={(k) => setFilter(k as 'tous' | EngagementStatut)}
          segments={[
            { key: 'tous', label: 'Tous', count: counts.tous },
            { key: 'en_attente', label: 'En attente', count: counts.en_attente },
            { key: 'publie', label: 'Publiés', count: counts.publie },
            { key: 'refuse', label: 'Refusés', count: counts.refuse },
          ]}
        />
        <SearchField className="sm:max-w-xs" value={query} onChange={setQuery} placeholder="Auteur, pays, message…" />
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        onRowClick={(e) => setSelectedId(e.id)}
        empty={
          loading ? (
            <LoadingState />
          ) : error ? (
            <EmptyState icon={AlertTriangle} title="Erreur de chargement" hint={error} />
          ) : (
            <EmptyState icon={Inbox} title="Aucun engagement" hint="Aucun résultat pour ce filtre." />
          )
        }
      />

      <Drawer
        open={!!selected}
        onClose={() => setSelectedId(null)}
        title={selected?.auteur ?? ''}
        subtitle={selected ? `${selected.pays} · ${selected.id}` : undefined}
        footer={
          selected && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStatut(selected.id, 'publie')}
                disabled={selected.statut === 'publie'}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold-royal px-4 py-2.5 text-sm font-semibold text-pd-ink ring-1 ring-inset ring-pd-gold-bright/60 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Check className="h-4 w-4" /> Publier
              </button>
              <button
                type="button"
                onClick={() => setStatut(selected.id, 'refuse')}
                disabled={selected.statut === 'refuse'}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-[#e08a83] transition-colors hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <X className="h-4 w-4" /> Refuser
              </button>
              <button
                type="button"
                onClick={() => setStatut(selected.id, 'en_attente')}
                disabled={selected.statut === 'en_attente'}
                aria-label="Remettre en attente"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-pd-sand-dim transition-colors hover:text-pd-sand disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          )
        }
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill tone={STAT[selected.statut].tone}>{STAT[selected.statut].label}</StatusPill>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-pd-sand-dim">{selected.theme}</span>
            </div>

            <figure className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <blockquote className="font-display text-lg leading-relaxed text-pd-sand">« {selected.message} »</blockquote>
            </figure>

            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-pd-sand-dim">Auteur</dt>
                <dd className="font-medium text-pd-sand">{selected.auteur}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-pd-sand-dim">Pays</dt>
                <dd className="text-pd-sand">{selected.pays}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-pd-sand-dim">E-mail</dt>
                <dd className="truncate text-pd-sand">{selected.email}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-pd-sand-dim">Reçu le</dt>
                <dd className="text-pd-sand">{formatDateTime(selected.soumisLe)}</dd>
              </div>
            </dl>
          </div>
        )}
      </Drawer>
    </div>
  )
}
