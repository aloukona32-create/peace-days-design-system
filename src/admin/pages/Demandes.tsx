import { useMemo, useState } from 'react'
import { Check, Eye, Archive, Inbox, AlertTriangle } from 'lucide-react'
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
import { getDemandes, updateDemandeStatut, formatDateTime, type Demande, type DemandeStatut, type DemandeType } from '../data'
import { useAsyncRows } from '../useAsyncRows'

const STAT: Record<DemandeStatut, { label: string; tone: Tone }> = {
  nouveau: { label: 'Nouvelle', tone: 'gold' },
  en_revue: { label: 'En revue', tone: 'info' },
  traite: { label: 'Traitée', tone: 'emerald' },
  archive: { label: 'Archivée', tone: 'neutral' },
}

const TYPE_LABEL: Record<DemandeType, string> = {
  visiteur: 'Visiteur',
  exposant: 'Exposant',
  partenaire: 'Partenaire',
  media: 'Média',
}

export default function Demandes() {
  const { rows: list, setRows: setList, loading, error } = useAsyncRows(getDemandes)
  const [filter, setFilter] = useState<'tous' | DemandeStatut>('tous')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = list.find((d) => d.id === selectedId) ?? null

  const setStatut = async (id: string, statut: DemandeStatut) => {
    const prev = list
    setList((rows) => rows.map((d) => (d.id === id ? { ...d, statut } : d)))
    try {
      await updateDemandeStatut(id, statut)
    } catch {
      setList(prev)
      window.alert('La mise à jour a échoué (droits ou connexion). Statut rétabli.')
    }
  }
  const counts = {
    tous: list.length,
    nouveau: list.filter((d) => d.statut === 'nouveau').length,
    en_revue: list.filter((d) => d.statut === 'en_revue').length,
    traite: list.filter((d) => d.statut === 'traite').length,
    archive: list.filter((d) => d.statut === 'archive').length,
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return list.filter((d) => {
      if (filter !== 'tous' && d.statut !== filter) return false
      if (!q) return true
      return [d.prenom, d.nom, d.email, d.pays, d.organisation, TYPE_LABEL[d.type], d.categorie]
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [list, filter, query])

  const columns: Column<Demande>[] = [
    {
      key: 'demandeur',
      header: 'Demandeur',
      render: (d) => (
        <div className="flex items-center gap-3">
          <Avatar name={`${d.prenom} ${d.nom}`} />
          <div className="min-w-0">
            <div className="truncate font-medium text-pd-sand">{d.prenom} {d.nom}</div>
            <div className="truncate text-xs text-pd-sand-dim">{d.email} · {d.pays}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Profil',
      hideOn: 'md',
      render: (d) => (
        <span className="rounded-full border border-pd-gold/25 bg-pd-gold/10 px-2.5 py-0.5 text-xs font-medium text-pd-gold-bright">
          {TYPE_LABEL[d.type]}
        </span>
      ),
    },
    { key: 'categorie', header: 'Détail', hideOn: 'sm', render: (d) => <span className="text-pd-sand-dim">{d.categorie || '—'}</span> },
    { key: 'statut', header: 'Statut', render: (d) => <StatusPill tone={STAT[d.statut].tone}>{STAT[d.statut].label}</StatusPill> },
    { key: 'date', header: 'Reçu', hideOn: 'sm', align: 'right', render: (d) => <span className="whitespace-nowrap text-xs text-pd-sand-dim">{formatDateTime(d.soumisLe)}</span> },
  ]
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Participation"
        title="Demandes"
        description="Les demandes envoyées depuis le formulaire public de Peace Days 2027 — tous profils confondus (visiteurs, exposants, partenaires, médias)."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          value={filter}
          onChange={(k) => setFilter(k as 'tous' | DemandeStatut)}
          segments={[
            { key: 'tous', label: 'Toutes', count: counts.tous },
            { key: 'nouveau', label: 'Nouvelles', count: counts.nouveau },
            { key: 'en_revue', label: 'En revue', count: counts.en_revue },
            { key: 'traite', label: 'Traitées', count: counts.traite },
            { key: 'archive', label: 'Archivées', count: counts.archive },
          ]}
        />
        <SearchField className="sm:max-w-xs" value={query} onChange={setQuery} placeholder="Nom, e-mail, pays, profil…" />
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        onRowClick={(d) => setSelectedId(d.id)}
        empty={
          loading ? (
            <LoadingState />
          ) : error ? (
            <EmptyState icon={AlertTriangle} title="Erreur de chargement" hint={error} />
          ) : (
            <EmptyState icon={Inbox} title="Aucune demande" hint="Aucun résultat pour ce filtre." />
          )
        }
      />
      <Drawer
        open={!!selected}
        onClose={() => setSelectedId(null)}
        title={selected ? `${selected.prenom} ${selected.nom}` : ''}
        subtitle={selected ? `${TYPE_LABEL[selected.type]} · ${selected.pays}` : undefined}
        footer={
          selected && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStatut(selected.id, 'traite')}
                disabled={selected.statut === 'traite'}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gold-royal px-4 py-2.5 text-sm font-semibold text-pd-ink ring-1 ring-inset ring-pd-gold-bright/60 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Check className="h-4 w-4" /> Marquer traitée
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
                onClick={() => setStatut(selected.id, 'archive')}
                disabled={selected.statut === 'archive'}
                aria-label="Archiver"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-pd-sand-dim transition-colors hover:bg-white/[0.08] hover:text-pd-sand disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Archive className="h-4 w-4" />
              </button>
            </div>
          )
        }
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill tone={STAT[selected.statut].tone}>{STAT[selected.statut].label}</StatusPill>
              <span className="rounded-full border border-pd-gold/25 bg-pd-gold/10 px-2.5 py-0.5 text-xs font-medium text-pd-gold-bright">{TYPE_LABEL[selected.type]}</span>
              {selected.categorie && (
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-pd-sand-dim">{selected.categorie}</span>
              )}
            </div>

            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-pd-sand-dim">E-mail</dt>
                <dd className="truncate text-pd-sand"><a href={`mailto:${selected.email}`} className="hover:text-pd-gold-bright">{selected.email}</a></dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-pd-sand-dim">Téléphone</dt>
                <dd className="text-pd-sand">{selected.telephone || '—'}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-pd-sand-dim">Pays</dt>
                <dd className="text-pd-sand">{selected.pays}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-pd-sand-dim">Organisation</dt>
                <dd className="text-pd-sand">{selected.organisation || '—'}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-pd-sand-dim">Fonction</dt>
                <dd className="text-pd-sand">{selected.fonction || '—'}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-pd-sand-dim">Newsletter</dt>
                <dd className="text-pd-sand">{selected.newsletter ? 'Oui' : 'Non'}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-pd-sand-dim">Reçu le</dt>
                <dd className="text-pd-sand">{formatDateTime(selected.soumisLe)}</dd>
              </div>
            </dl>

            {selected.message && (
              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-label text-pd-sand-dim">Message</p>
                <p className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-pd-sand">{selected.message}</p>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  )
}
