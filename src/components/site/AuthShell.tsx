import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

/**
 * Coquille des pages d'authentification membre : halo doré, carte « verre »
 * centrée, emblème Peace Days. Utilisée par Connexion et Inscription.
 */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  wide = false,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  wide?: boolean
}) {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 py-28 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-radial-gold" />
        <div className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-pd-gold/10 blur-[120px]" />
        <div className="absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-pd-emerald/10 blur-[130px]" />
      </div>
      <div
        className={cn(
          'relative w-full rounded-3xl border border-white/10 bg-white/[0.045] p-7 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.95)] ring-1 ring-inset ring-white/[0.05] backdrop-blur-2xl sm:p-9',
          wide ? 'max-w-2xl' : 'max-w-md',
        )}
      >
        <div className="mb-7 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-royal font-display text-2xl font-semibold text-pd-ink ring-1 ring-inset ring-pd-gold-bright/60 shadow-[0_10px_30px_-10px_rgba(201,162,39,0.7)]">
            P
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold text-pd-sand">{title}</h1>
          {subtitle && <p className="mt-1.5 max-w-sm text-sm text-pd-sand-dim">{subtitle}</p>}
        </div>
        {children}
        {footer && <div className="mt-7 border-t border-white/10 pt-5 text-center text-sm">{footer}</div>}
      </div>
    </section>
  )
}
