import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { Search } from 'lucide-react'
import { cn } from '../../lib/utils'

/** Surface « verre » Apple : translucide, flou, liseré lumineux. */
export function GlassPanel({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-white/[0.045] shadow-[0_24px_70px_-38px_rgba(0,0,0,0.95)] backdrop-blur-2xl ring-1 ring-inset ring-white/[0.05]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export type Tone = 'gold' | 'emerald' | 'rose' | 'info' | 'neutral'

const pillTone: Record<Tone, string> = {
  gold: 'border-pd-gold/30 bg-pd-gold/10 text-pd-gold-bright',
  emerald: 'border-pd-emerald/40 bg-pd-emerald/15 text-[#7fd0aa]',
  rose: 'border-pd-rose/40 bg-pd-rose/15 text-[#e08a83]',
  info: 'border-pd-info/40 bg-pd-info/15 text-[#9cc4dd]',
  neutral: 'border-white/15 bg-white/5 text-pd-sand-dim',
}

export function StatusPill({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: Tone
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        pillTone[tone],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {children}
    </span>
  )
}
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon
  label: string
  active?: boolean
}

/** Bouton icône « verre » (barre du haut, actions). */
export function IconButton({ icon: Icon, label, active, className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-pd-sand-dim backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10 hover:text-pd-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pd-gold-bright/60',
        active && 'border-pd-gold/40 bg-pd-gold/10 text-pd-gold-bright',
        className,
      )}
      {...props}
    >
      <Icon className="h-[18px] w-[18px]" />
    </button>
  )
}

export function SearchField({
  value,
  onChange,
  placeholder = 'Rechercher…',
  className,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pd-sand-dim" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-pd-sand backdrop-blur-xl transition-colors placeholder:text-pd-sand-dim/70 focus:border-pd-gold-bright/50 focus:outline-none focus:ring-1 focus:ring-pd-gold-bright/40"
      />
    </div>
  )
}
export interface Segment {
  key: string
  label: string
  count?: number
}

export function SegmentedControl({
  segments,
  value,
  onChange,
  className,
}: {
  segments: Segment[]
  value: string
  onChange: (key: string) => void
  className?: string
}) {
  return (
    <div
      className={cn(
        'inline-flex flex-wrap items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl',
        className,
      )}
    >
      {segments.map((s) => (
        <button
          key={s.key}
          type="button"
          onClick={() => onChange(s.key)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
            value === s.key
              ? 'bg-pd-gold/15 text-pd-gold-bright shadow-[inset_0_0_0_1px_rgba(231,200,107,0.25)]'
              : 'text-pd-sand-dim hover:text-pd-sand',
          )}
        >
          {s.label}
          {typeof s.count === 'number' && (
            <span
              className={cn(
                'rounded-full px-1.5 text-[0.65rem] font-semibold tabular-nums',
                value === s.key ? 'bg-pd-gold/20 text-pd-gold-bright' : 'bg-white/10 text-pd-sand-dim',
              )}
            >
              {s.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="font-display text-3xl font-semibold text-pd-sand sm:text-4xl">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-pd-sand-dim">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  hint,
}: {
  icon: LucideIcon
  title: string
  hint?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-pd-sand-dim">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium text-pd-sand">{title}</p>
      {hint && <p className="max-w-xs text-xs text-pd-sand-dim">{hint}</p>}
    </div>
  )
}

/** État de chargement « verre » (même spinner que le back-office). */
export function LoadingState({ label = 'Chargement…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-pd-gold-bright" />
      <p className="text-sm text-pd-sand-dim">{label}</p>
    </div>
  )
}

export function Avatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  return (
    <span
      className={cn(
        'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-pd-gold/25 bg-gradient-to-br from-pd-gold/25 to-pd-gold/[0.04] text-xs font-semibold text-pd-gold-bright',
        className,
      )}
    >
      {initials}
    </span>
  )
}
