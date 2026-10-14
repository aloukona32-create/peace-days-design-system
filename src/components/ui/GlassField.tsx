import * as React from 'react'
import { cn } from '../../lib/utils'

/**
 * Champs de formulaire « verre » (style Apple morphique) réutilisés par les
 * pages de compte : bordure translucide, fond givré, focus doré.
 */

const base =
  'h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 text-sm text-pd-sand transition-colors placeholder:text-pd-sand-dim/70 focus:border-pd-gold-bright/50 focus:outline-none focus:ring-1 focus:ring-pd-gold-bright/40 disabled:opacity-50'

const selectArrow =
  "appearance-none bg-no-repeat bg-[right_0.9rem_center] bg-[length:11px_7px] pr-9 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22><path d=%22M1 1l5 5 5-5%22 stroke=%22%23C9A227%22 stroke-width=%221.5%22 fill=%22none%22/></svg>')]"

export function GlassLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('mb-1.5 block text-xs font-medium text-pd-sand-dim', className)}>{children}</span>
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode }

export const GlassInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) =>
    icon ? (
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-pd-sand-dim">{icon}</span>
        <input ref={ref} className={cn(base, 'pl-9', className)} {...props} />
      </div>
    ) : (
      <input ref={ref} className={cn(base, className)} {...props} />
    ),
)
GlassInput.displayName = 'GlassInput'

export const GlassSelect = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(base, selectArrow, className)} {...props}>
      {children}
    </select>
  ),
)
GlassSelect.displayName = 'GlassSelect'
