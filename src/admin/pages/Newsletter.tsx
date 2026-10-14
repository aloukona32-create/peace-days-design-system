import { useMemo, useState } from 'react'
import { Mail, Download, AlertTriangle } from 'lucide-react'
import {
  GlassPanel,
  PageHeader,
  SegmentedControl,
  SearchField,
  DataTable,
  StatusPill,
  EmptyState,
  LoadingState,
  type Column,
  type Tone,
} from '../components'
import { getAbonnes, formatDateTime, type Abonne } from '../data'
import { useAsyncRows } from '../useAsyncRows'

const LANG_TONE: Record<Abonne['langue'], Tone> = { FR: 'gold', EN: 'info', AR: 'emerald' }

export default function Newsletter() {
  const { rows: list, loading, error } = useAsyncRows(getAbonnes)
  const [filter, setFilter] = useState<'tous' | Abonne['langue']>('tous')
  const [query, setQuery] = useState('')

  const counts = {
    tous: list.length,
    FR: list.filter((a) => a.langue === 'FR').length,
    EN: list.filter((a) => a.langue === 'EN').length,
    AR: list.filter((a) => a.langue === 'AR').length,
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return list.filter((a) => {
      if (filter !== 'tous' && a.langue !== filter) return false
      if (!q) return true
      return [a.email, a.source, a.id].join(' ').toLowerCase().includes(q)
    })
  }, [list, filter, query])
  const exportCsv = () => {
    const header = 'id,email,langue,source,inscritLe\n'
    const body = filtered.map((a) => [a.id, a.email, a.langue, a.source, a.inscritLe].join(',')).join('\n')
    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'abonnes-newsletter.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const stats = [
    { label: 'Total abonnés', value: counts.tous },
    { label: 'Français', value: counts.FR },
    { label: 'English', value: counts.EN },
    { label: 'العربية', value: counts.AR },
  ]

  const columns: Column<Abonne>[] = [
    { key: 'email', header: 'Adresse e-mail', render: (a) => <span className="font-medium text-pd-sand">{a.email}</span> },
    { key: 'langue', header: 'Langue', render: (a) => <StatusPill tone={LANG_TONE[a.langue]}>{a.langue}</StatusPill> },
    { key: 'source', header: 'Source', hideOn: 'sm', render: (a) => <span className="text-pd-sand-dim">{a.source}</span> },
    { key: 'date', header: 'Inscrit', hideOn: 'md', align: 'right', render: (a) => <span className="whitespace-nowrap text-xs text-pd-sand-dim">{formatDateTime(a.inscritLe)}</span> },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Communauté"
        title="Newsletter"
        description="Les abonnés qui suivent les actualités de Peace Days Dubaï 2027. Filtrez par langue puis exportez la liste."
        actions={
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-xl bg-gold-royal px-4 py-2.5 text-sm font-semibold text-pd-ink ring-1 ring-inset ring-pd-gold-bright/60 transition-opacity hover:opacity-90"
          >
            <Download className="h-4 w-4" /> Exporter (CSV)
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <GlassPanel key={s.label} className="p-5">
            <p className="font-display text-3xl font-semibold text-pd-sand">{s.value}</p>
            <p className="mt-1 text-xs text-pd-sand-dim">{s.label}</p>
          </GlassPanel>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          value={filter}
          onChange={(k) => setFilter(k as 'tous' | Abonne['langue'])}
          segments={[
            { key: 'tous', label: 'Toutes', count: counts.tous },
            { key: 'FR', label: 'FR', count: counts.FR },
            { key: 'EN', label: 'EN', count: counts.EN },
            { key: 'AR', label: 'AR', count: counts.AR },
          ]}
        />
        <SearchField className="sm:max-w-xs" value={query} onChange={setQuery} placeholder="E-mail, source…" />
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        empty={
          loading ? (
            <LoadingState />
          ) : error ? (
            <EmptyState icon={AlertTriangle} title="Erreur de chargement" hint={error} />
          ) : (
            <EmptyState icon={Mail} title="Aucun abonné" hint="Aucun résultat pour ce filtre." />
          )
        }
      />
    </div>
  )
}
