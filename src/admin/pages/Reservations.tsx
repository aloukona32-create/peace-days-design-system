import { useMemo, useState } from 'react'
import { Check, X, Clock, Users, Wallet, Utensils, AlertTriangle } from 'lucide-react'
import {
  GlassPanel,
  PageHeader,
  SegmentedControl,
  SearchField,
  DataTable,
  Drawer,
  StatusPill,
  EmptyState,
  LoadingState,
  type Column,
  type Tone,
} from '../components'
import { getReservations, updateReservationStatut, formatDateTime, aed, type Reservation, type ReservationStatut } from '../data'
import { useAsyncRows } from '../useAsyncRows'

const STAT: Record<ReservationStatut, { label: string; tone: Tone }> = {
  demande: { label: 'Demande', tone: 'gold' },
  confirme: { label: 'Confirmé', tone: 'emerald' },
  liste_attente: { label: "Liste d'attente", tone: 'info' },
  annule: { label: 'Annulé', tone: 'rose' },
}

export default function Reservations() {
  const { rows: list, setRows: setList, loading, error } = useAsyncRows(getReservations)
  const [filter, setFilter] = useState<'tous' | ReservationStatut>('tous')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = list.find((r) => r.id === selectedId) ?? null

  const setStatut = async (id: string, statut: ReservationStatut) => {
    const prev = list
    setList((rows) => rows.map((r) => (r.id === id ? { ...r, statut } : r)))
    try {
      await updateReservationStatut(id, statut)
    } catch {
      setList(prev)
      window.alert('La mise à jour a échoué (droits ou connexion). Statut rétabli.')
    }
  }

  const counts = {
    tous: list.length,
    demande: list.filter((r) => r.statut === 'demande').length,
    confirme: list.filter((r) => r.statut === 'confirme').length,
    liste_attente: list.filter((r) => r.statut === 'liste_attente').length,
    annule: list.filter((r) => r.statut === 'annule').length,
  }
  const confirmes = list.filter((r) => r.statut === 'confirme')
  const couvertsConfirmes = confirmes.reduce((s, r) => s + r.couverts, 0)
  const recetteConfirmee = confirmes.reduce((s, r) => s + r.montant, 0)

  const stats = [
    { icon: Users, label: 'Couverts confirmés', value: String(couvertsConfirmes) },
    { icon: Wallet, label: 'Recette confirmée', value: aed(recetteConfirmee) },
    { icon: Clock, label: 'En attente', value: String(counts.demande + counts.liste_attente) },
  ]

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return list.filter((r) => {
      if (filter !== 'tous' && r.statut !== filter) return false
      if (!q) return true
      return [r.nom, r.organisation, r.formule, r.id].join(' ').toLowerCase().includes(q)
    })
  }, [list, filter, query])

  const columns: Column<Reservation>[] = [
    {
      key: 'nom',
      header: 'Invité',
      render: (r) => (
        <div className="min-w-0">
          <div className="truncate font-medium text-pd-sand">{r.nom}</div>
          <div className="text-xs text-pd-sand-dim">{r.organisation}</div>
        </div>
      ),
    },
    { key: 'formule', header: 'Formule', hideOn: 'md', render: (r) => <span className="text-pd-sand-dim">{r.formule}</span> },
    { key: 'couverts', header: 'Couverts', align: 'right', render: (r) => <span className="tabular-nums text-pd-sand">{r.couverts}</span> },
    { key: 'montant', header: 'Montant', hideOn: 'sm', align: 'right', render: (r) => <span className="whitespace-nowrap tabular-nums text-pd-sand">{aed(r.montant)}</span> },
    { key: 'statut', header: 'Statut', render: (r) => <StatusPill tone={STAT[r.statut].tone}>{STAT[r.statut].label}</StatusPill> },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dîner de Gala"
        title="Réservations"
        description="Les demandes de tables et de couverts pour le Dîner de Gala. Confirmez, placez en liste d’attente ou annulez."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <GlassPanel key={s.label} className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-pd-gold/20 bg-pd-gold/10 text-pd-gold-bright">
              <s.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-2xl font-semibold text-pd-sand">{s.value}</p>
              <p className="text-xs text-pd-sand-dim">{s.label}</p>
            </div>
          </GlassPanel>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          value={filter}
          onChange={(k) => setFilter(k as 'tous' | ReservationStatut)}
          segments={[
            { key: 'tous', label: 'Toutes', count: counts.tous },
            { key: 'demande', label: 'Demandes', count: counts.demande },
            { key: 'confirme', label: 'Confirmées', count: counts.confirme },
            { key: 'liste_attente', label: 'Liste d’attente', count: counts.liste_attente },
            { key: 'annule', label: 'Annulées', count: counts.annule },
          ]}
        />
        <SearchField className="sm:max-w-xs" value={query} onChange={setQuery} placeholder="Invité, organisation, formule…" />
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        onRowClick={(r) => setSelectedId(r.id)}
        empty={
          loading ? (
            <LoadingState />
          ) : error ? (
            <EmptyState icon={AlertTriangle} title="Erreur de chargement" hint={error} />
          ) : (
            <EmptyState icon={Utensils} title="Aucune réservation" hint="Aucun résultat pour ce filtre." />
          )
        }
      />

      <Drawer
        open={!!selected}
        onClose={() => setSelectedId(null)}
        title={selected?.nom ?? ''}
        subtitle={selected ? `${selected.organisation} · ${selected.id}` : undefined}
        footer={
          selected && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStatut(selected.id, 'confirme')}
                disabled={selected.statut === 'confirme'}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold-royal px-4 py-2.5 text-sm font-semibold text-pd-ink ring-1 ring-inset ring-pd-gold-bright/60 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Check className="h-4 w-4" /> Confirmer
              </button>
              <button
                type="button"
                onClick={() => setStatut(selected.id, 'liste_attente')}
                disabled={selected.statut === 'liste_attente'}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-pd-sand-dim transition-colors hover:bg-white/[0.08] hover:text-pd-sand disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Clock className="h-4 w-4" /> Attente
              </button>
              <button
                type="button"
                onClick={() => setStatut(selected.id, 'annule')}
                disabled={selected.statut === 'annule'}
                aria-label="Annuler"
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
              <span className="rounded-full border border-pd-gold/25 bg-pd-gold/10 px-2.5 py-0.5 text-xs font-medium text-pd-gold-bright">{selected.formule}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="font-display text-2xl font-semibold text-pd-sand">{selected.couverts}</p>
                <p className="text-xs text-pd-sand-dim">Couverts</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="font-display text-2xl font-semibold text-pd-sand">{aed(selected.montant)}</p>
                <p className="text-xs text-pd-sand-dim">Montant</p>
              </div>
            </div>

            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-pd-sand-dim">Organisation</dt>
                <dd className="font-medium text-pd-sand">{selected.organisation}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-pd-sand-dim">Formule</dt>
                <dd className="text-pd-sand">{selected.formule}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-pd-sand-dim">Demandé le</dt>
                <dd className="text-pd-sand">{formatDateTime(selected.soumisLe)}</dd>
              </div>
            </dl>
          </div>
        )}
      </Drawer>
    </div>
  )
}
