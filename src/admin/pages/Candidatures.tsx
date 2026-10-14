import { useMemo, useState } from 'react'
import { Check, X, Eye, Store, AlertTriangle } from 'lucide-react'
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
import { getCandidatures, updateCandidatureStatut, formatDateTime, type Candidature, type CandidatureStatut } from '../data'
import { useAsyncRows } from '../useAsyncRows'

const STAT: Record<CandidatureStatut, { label: string; tone: Tone }> = {
  brouillon: { label: 'Brouillon', tone: 'neutral' },
  soumis: { label: 'Soumis', tone: 'gold' },
  en_revue: { label: 'En revue', tone: 'info' },
  accepte: { label: 'Accepté', tone: 'emerald' },
  refuse: { label: 'Refusé', tone: 'rose' },
}

export default function Candidatures() {
  const { rows: list, setRows: setList, loading, error } = useAsyncRows(getCandidatures)
  const [filter, setFilter] = useState<'tous' | CandidatureStatut>('tous')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = list.find((c) => c.id === selectedId) ?? null

  const setStatut = async (id: string, statut: CandidatureStatut) => {
    const prev = list
    setList((rows) => rows.map((c) => (c.id === id ? { ...c, statut } : c)))
    try {
      await updateCandidatureStatut(id, statut)
    } catch {
      setList(prev)
      window.alert('La mise à jour a échoué (droits ou connexion). Statut rétabli.')
    }
  }

  const counts = {
    tous: list.length,
    soumis: list.filter((c) => c.statut === 'soumis').length,
    en_revue: list.filter((c) => c.statut === 'en_revue').length,
    accepte: list.filter((c) => c.statut === 'accepte').length,
    refuse: list.filter((c) => c.statut === 'refuse').length,
  }
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return list.filter((c) => {
      if (filter !== 'tous' && c.statut !== filter) return false
      if (!q) return true
      return [c.structure, c.contact, c.pays, c.categorie, c.id].join(' ').toLowerCase().includes(q)
    })
  }, [list, filter, query])

  const columns: Column<Candidature>[] = [
    {
      key: 'structure',
      header: 'Structure',
      render: (c) => (
        <div className="flex items-center gap-3">
          <Avatar name={c.structure} />
          <div className="min-w-0">
            <div className="truncate font-medium text-pd-sand">{c.structure}</div>
            <div className="text-xs text-pd-sand-dim">{c.contact} · {c.pays}</div>
          </div>
        </div>
      ),
    },
    { key: 'categorie', header: 'Catégorie', hideOn: 'md', render: (c) => <span className="text-pd-sand-dim">{c.categorie}</span> },
    { key: 'stand', header: 'Stand', hideOn: 'sm', render: (c) => <span className="text-pd-sand-dim">{c.stand}</span> },
    { key: 'statut', header: 'Statut', render: (c) => <StatusPill tone={STAT[c.statut].tone}>{STAT[c.statut].label}</StatusPill> },
    { key: 'date', header: 'Soumis', hideOn: 'sm', align: 'right', render: (c) => <span className="whitespace-nowrap text-xs text-pd-sand-dim">{formatDateTime(c.soumisLe)}</span> },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Exposants"
        title="Candidatures"
        description="Les demandes de stand pour la Foire. Étudiez chaque dossier, mettez-le en revue puis acceptez ou refusez."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          value={filter}
          onChange={(k) => setFilter(k as 'tous' | CandidatureStatut)}
          segments={[
            { key: 'tous', label: 'Toutes', count: counts.tous },
            { key: 'soumis', label: 'Soumises', count: counts.soumis },
            { key: 'en_revue', label: 'En revue', count: counts.en_revue },
            { key: 'accepte', label: 'Acceptées', count: counts.accepte },
            { key: 'refuse', label: 'Refusées', count: counts.refuse },
          ]}
        />
        <SearchField className="sm:max-w-xs" value={query} onChange={setQuery} placeholder="Structure, pays, catégorie…" />
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        onRowClick={(c) => setSelectedId(c.id)}
        empty={
          loading ? (
            <LoadingState />
          ) : error ? (
            <EmptyState icon={AlertTriangle} title="Erreur de chargement" hint={error} />
          ) : (
            <EmptyState icon={Store} title="Aucune candidature" hint="Aucun résultat pour ce filtre." />
          )
        }
      />

      <Drawer
        open={!!selected}
        onClose={() => setSelectedId(null)}
        title={selected?.structure ?? ''}
        subtitle={selected ? `${selected.pays} · ${selected.id}` : undefined}
        footer={
          selected && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStatut(selected.id, 'accepte')}
                disabled={selected.statut === 'accepte'}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold-royal px-4 py-2.5 text-sm font-semibold text-pd-ink ring-1 ring-inset ring-pd-gold-bright/60 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Check className="h-4 w-4" /> Accepter
              </button>
              <button
                type="button"
                onClick={() => setStatut(selected.id, 'en_revue')}
                disabled={selected.statut === 'en_revue'}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-pd-sand-dim transition-colors hover:bg-white/[0.08] hover:text-pd-sand disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Eye className="h-4 w-4" /> En revue
              </button>
              <button
                type="button"
                onClick={() => setStatut(selected.id, 'refuse')}
                disabled={selected.statut === 'refuse'}
                aria-label="Refuser"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#e08a83] transition-colors hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        }
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill tone={STAT[selected.statut].tone}>{STAT[selected.statut].label}</StatusPill>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-pd-sand-dim">{selected.categorie}</span>
              <span className="rounded-full border border-pd-gold/25 bg-pd-gold/10 px-2.5 py-0.5 text-xs font-medium text-pd-gold-bright">{selected.stand}</span>
            </div>

            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-pd-sand-dim">Contact</dt>
                <dd className="font-medium text-pd-sand">{selected.contact}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-pd-sand-dim">E-mail</dt>
                <dd className="truncate text-pd-sand">{selected.email}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-pd-sand-dim">Pays</dt>
                <dd className="text-pd-sand">{selected.pays}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-pd-sand-dim">Catégorie</dt>
                <dd className="text-pd-sand">{selected.categorie}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-pd-sand-dim">Emplacement</dt>
                <dd className="text-pd-sand">{selected.stand}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-pd-sand-dim">Soumis le</dt>
                <dd className="text-pd-sand">{formatDateTime(selected.soumisLe)}</dd>
              </div>
            </dl>
          </div>
        )}
      </Drawer>
    </div>
  )
}
