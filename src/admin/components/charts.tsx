import * as React from 'react'
import { cn } from '../../lib/utils'

/** Mini-courbe (KPI). SVG normalisé, dégradé sous la ligne. */
export function Sparkline({
  data,
  stroke = '#E7C86B',
  className,
}: {
  data: number[]
  stroke?: string
  className?: string
}) {
  const w = 100
  const h = 28
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const id = React.useId()
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return `${x.toFixed(2)},${y.toFixed(2)}`
  })
  const line = pts.join(' ')
  const area = `0,${h} ${line} ${w},${h}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={cn('h-8 w-full', className)}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.25" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${id})`} />
      <polyline
        points={line}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
/** Histogramme (CSS) — barres or, valeur au survol. */
export function BarChart({
  data,
  className,
}: {
  data: { label: string; value: number }[]
  className?: string
}) {
  const max = Math.max(...data.map((d) => d.value)) || 1
  return (
    <div className={cn('flex h-44 items-end gap-1.5', className)}>
      {data.map((d, i) => (
        <div key={i} className="group flex flex-1 flex-col items-center gap-2">
          <div className="relative w-full flex-1">
            <div
              className="absolute inset-x-0 bottom-0 rounded-t-md bg-gradient-to-t from-pd-gold/25 to-pd-gold-bright/80 transition-all duration-300 group-hover:from-pd-gold/45 group-hover:to-pd-gold-bright"
              style={{ height: `${(d.value / max) * 100}%` }}
            >
              <span className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 text-[0.6rem] font-semibold tabular-nums text-pd-gold-bright opacity-0 transition-opacity group-hover:opacity-100">
                {d.value}
              </span>
            </div>
          </div>
          <span className="text-[0.6rem] tabular-nums text-pd-sand-dim">{d.label}</span>
        </div>
      ))}
    </div>
  )
}

export interface DonutSegment {
  label: string
  value: number
  color: string
}

/** Anneau de répartition + légende. */
export function DonutChart({
  segments,
  caption,
  className,
}: {
  segments: DonutSegment[]
  caption?: string
  className?: string
}) {
  const sum = segments.reduce((a, s) => a + s.value, 0) || 1
  const r = 42
  const C = 2 * Math.PI * r
  let offset = 0
  return (
    <div className={cn('flex items-center gap-6', className)}>
      <div className="relative shrink-0">
        <svg viewBox="0 0 100 100" className="h-32 w-32 -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
          {segments.map((s, i) => {
            const len = (s.value / sum) * C
            const el = (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth="9"
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={-offset}
              />
            )
            offset += len
            return el
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-semibold text-pd-sand">{sum}</span>
          {caption && <span className="text-[0.6rem] uppercase tracking-label text-pd-sand-dim">{caption}</span>}
        </div>
      </div>
      <ul className="flex-1 space-y-2">
        {segments.map((s, i) => (
          <li key={i} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} />
              <span className="truncate text-pd-sand-dim">{s.label}</span>
            </span>
            <span className="shrink-0 font-medium tabular-nums text-pd-sand">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
