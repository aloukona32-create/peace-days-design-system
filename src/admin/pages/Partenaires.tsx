import { useMemo, useState } from 'react'
import { Check, X, MessagesSquare, Handshake, AlertTriangle } from 'lucide-react'
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
import { getPartenaires, updatePartenaireStatut, formatDateTime, type Partenaire, type PartenaireStatut } from '../data'
import { useAsyncRows } from '../useAsyncRows'

const STAT: Record<PartenaireStatut, { label: string; tone: Tone }> = {
  nouveau: { label: 'Nouveau', tone: 'gold' },
  en_discussion: { label: 'En discussion', tone: 'info' },
  engage: { label: 'Engagé', tone: 'emerald' },
  decline: { label: 'Décliné', tone: 'rose' },
}

export default function Partenaires() {
  const { rows: list, setRows: setList, loading, error } = useAsyncRows(getPartenaires)
  const [filter, setFilter] = useState<'tous' | PartenaireStatut>('tous')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = list.find((p) => p.id === selectedId) ?? null

  const setStatut = async (id: string, statut: PartenaireStatut) => {
    const prev = list
    setList((rows) => rows.map((p) => (p.id === id ? { ...p, statut } : p)))
    try {
      await updatePartenaireStatut(id, statut)
    } catch {
      setList(prev)
      window.alert('La mise à jour a échoué (droits ou connexion). Statut rétabli.')
    }
  }

  const counts = {
    tous: list.length,
    nouveau: list.filter((p) => p.statut === 'nouveau').length,
    en_discussion: list.filter((p) => p.statut === 'en_discussion').length,
    engage: list.filter((p) => p.statut === 'engage').length,
    decline: list.filter((p) => p.statut === 'decline').length,
  }
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return list.filter((p) => {
      if (filter !== 'tous' && p.statut !== filter) return false
      if (!q) return true
      return [p.organisation, p.contact, p.pays, p.type, p.id].join(' ').toLowerCase().includes(q)
    })
  }, [list, filter, query])

  const columns: Column<Partenaire>[] = [
    {
      key: 'organisation',
      header: 'Organisation',
      render: (p) => (
        <div className="flex items-center gap-3">
          <Avatar name={p.organisation} />
          <div className="min-w-0">
            <div className="truncate font-medium text-pd-sand">{p.organisation}</div>
            <div className="text-xs text-pd-sand-dim">{p.pays}</div>
          </div>
        </div>
      ),
    },
    { key: 'type', header: 'Type', hideOn: 'sm', render: (p) => <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-pd-sand-dim">{p.type}</span> },
    { key: 'contact', header: 'Contact', hideOn: 'md', render: (p) => <span className="text-pd-sand-dim">{p.contact}</span> },
    { key: 'statut', header: 'Statut', render: (p) => <StatusPill tone={STAT[p.statut].tone}>{STAT[p.statut].label}</StatusPill> },
    { key: 'date', header: 'Ajouté', hideOn: 'sm', align: 'right', render: (p) => <span className="whitespace-nowrap text-xs text-pd-sand-dim">{formatDateTime(p.soumisLe)}</span> },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Réseau"
        title="Partenaires"
        description="Sponsors, institutions, ambassades et médias. Suivez chaque relation, de la prise de contact à l’engagement."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          value={filter}
          onChange={(k) => setFilter(k as 'tous' | PartenaireStatut)}
          segments={[
            { key: 'tous', label: 'Tous', count: counts.tous },
            { key: 'nouveau', label: 'Nouveaux', count: counts.nouveau },
            { key: 'en_discussion', label: 'En discussion', count: counts.en_discussion },
            { key: 'engage', label: 'Engagés', count: counts.engage },
            { key: 'decline', label: 'Déclinés', count: counts.decline },
          ]}
        />
        <SearchField className="sm:max-w-xs" value={query} onChange={setQuery} placeholder="Organisation, type, pays…" />
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        onRowClick={(p) => setSelectedId(p.id)}
        empty={
          loading ? (
            <LoadingState />
          ) : error ? (
            <EmptyState icon={AlertTriangle} title="Erreur de chargement" hint={error} />
          ) : (
            <EmptyState icon={Handshake} title="Aucun partenaire" hint="Aucun résultat pour ce filtre." />
          )
        }
      />

      <Drawer
        open={!!selected}
        onClose={() => setSelectedId(null)}
        title={selected?.organisation ?? ''}
        subtitle={selected ? `${selected.type} · ${selected.id}` : undefined}
        footer={
          selected && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStatut(selected.id, 'engage')}
                disabled={selected.statut === 'engage'}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold-royal px-4 py-2.5 text-sm font-semibold text-pd-ink ring-1 ring-inset ring-pd-gold-bright/60 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Check className="h-4 w-4" /> Engager
              </button>
              <button
                type="button"
                onClick={() => setStatut(selected.id, 'en_discussion')}
                disabled={selected.statut === 'en_discussion'}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-pd-sand-dim transition-colors hover:bg-white/[0.08] hover:text-pd-sand disabled:cursor-not-allowed disabled:opacity-40"
              >
                <MessagesSquare className="h-4 w-4" /> Discussion
              </button>
              <button
                type="button"
                onClick={() => setStatut(selected.id, 'decline')}
                disabled={selected.statut === 'decline'}
                aria-label="Décliner"
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
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-pd-sand-dim">{selected.type}</span>
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
                <dt className="text-pd-sand-dim">Type</dt>
                <dd className="text-pd-sand">{selected.type}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-pd-sand-dim">Ajouté le</dt>
                <dd className="text-pd-sand">{formatDateTime(selected.soumisLe)}</dd>
              </div>
            </dl>
          </div>
        )}
      </Drawer>
    </div>
  )
}
