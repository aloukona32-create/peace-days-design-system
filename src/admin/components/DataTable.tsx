import * as React from 'react'
import { cn } from '../../lib/utils'
import { GlassPanel } from './primitives'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => React.ReactNode
  align?: 'left' | 'right' | 'center'
  className?: string
  hideOn?: 'sm' | 'md'
}

const alignCls = (a?: 'left' | 'right' | 'center') =>
  a === 'right' ? 'text-right' : a === 'center' ? 'text-center' : 'text-left'

const hideCls = (h?: 'sm' | 'md') =>
  h === 'sm' ? 'hidden sm:table-cell' : h === 'md' ? 'hidden md:table-cell' : ''

/** Tableau générique « verre » — colonnes typées, lignes cliquables. */
export function DataTable<T extends { id: string }>({
  columns,
  rows,
  onRowClick,
  empty,
}: {
  columns: Column<T>[]
  rows: T[]
  onRowClick?: (row: T) => void
  empty?: React.ReactNode
}) {
  return (
    <GlassPanel className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    'px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-pd-sand-dim',
                    alignCls(c.align),
                    hideCls(c.hideOn),
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'border-b border-white/[0.06] transition-colors last:border-0',
                  onRowClick && 'cursor-pointer hover:bg-white/[0.04]',
                )}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn('px-4 py-3.5 align-middle text-pd-sand', alignCls(c.align), hideCls(c.hideOn), c.className)}
                  >
                    {c.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && empty}
    </GlassPanel>
  )
}
