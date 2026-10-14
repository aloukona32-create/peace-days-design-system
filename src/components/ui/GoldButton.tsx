import * as React from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

type Variant = 'solid' | 'outline'
type Size = 'sm' | 'md' | 'lg'

const SIZES: Record<Size, string> = {
  sm: 'h-10 px-5 text-sm',
  md: 'h-12 px-7 text-[0.95rem]',
  lg: 'h-14 px-9 text-base',
}

type BaseProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: React.ReactNode
}

/**
 * Bouton « royal » : surface or métallique vivante (dégradé feuille d'or animé),
 * reflet spéculaire au survol, halo doré, biseau lumineux et texte embossé.
 * Rendu en <Link> si `to` est fourni, sinon en <button>.
 */
function GoldInner({ variant = 'solid', children }: BaseProps) {
  return (
    <>
      {variant === 'solid' && (
        <>
          {/* Verre liquide : halo lumineux diffus en haut à gauche */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(130%_85%_at_28%_-10%,rgba(255,255,255,0.55),transparent_55%)]"
          />
          {/* Gloss haut (biseau lumineux adouci) */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[52%] rounded-t-[inherit] bg-gradient-to-b from-white/55 via-white/10 to-transparent"
          />
          {/* Ombre basse interne (assise du lingot) */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 rounded-b-[inherit] bg-gradient-to-t from-[#5A4718]/45 to-transparent mix-blend-multiply"
          />
          {/* Reflet spéculaire balayant au survol (plus doux, plus lent) */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-[160%] skew-x-[-24deg] bg-gradient-to-r from-transparent via-white/70 to-transparent transition-transform duration-[1100ms] ease-premium group-hover:translate-x-[160%]"
          />
        </>
      )}
      <span
        className={cn(
          'relative z-10 inline-flex items-center gap-2.5',
          variant === 'solid' && '[text-shadow:0_1px_0_rgba(255,251,235,0.55)]',
        )}
      >
        {children}
      </span>
    </>
  )
}

function classesFor(variant: Variant, size: Size, className?: string) {
  return cn(
    'group relative inline-flex items-center justify-center overflow-hidden rounded-2xl font-semibold tracking-wide transition-all duration-[420ms] ease-premium will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pd-gold-bright/70 focus-visible:ring-offset-2 focus-visible:ring-offset-pd-night active:duration-150',
    SIZES[size],
    variant === 'solid'
      ? 'bg-gold-royal bg-[length:220%_100%] animate-gold-sweep text-pd-ink ring-1 ring-inset ring-pd-gold-bright/70 shadow-[0_10px_30px_-12px_rgba(201,162,39,0.55),inset_0_1px_0_rgba(255,255,255,0.7),inset_0_-4px_10px_rgba(70,52,12,0.45)] hover:-translate-y-[3px] hover:brightness-[1.05] hover:shadow-[0_30px_74px_-20px_rgba(231,200,107,0.82),0_0_42px_-8px_rgba(231,200,107,0.6),inset_0_1px_0_rgba(255,255,255,0.88),inset_0_-4px_11px_rgba(70,52,12,0.5)] active:translate-y-0 active:scale-[0.96] active:brightness-100'
      : 'border border-white/15 bg-white/[0.06] text-pd-gold-soft backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] hover:-translate-y-[2px] hover:border-pd-gold-bright/60 hover:bg-white/[0.1] hover:text-pd-gold-bright hover:shadow-[0_20px_54px_-26px_rgba(231,200,107,0.55)] active:translate-y-0 active:scale-[0.97]',
    className,
  )
}

export interface GoldButtonProps {
  to?: string
  variant?: Variant
  size?: Size
  className?: string
  children: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLElement>
  type?: 'button' | 'submit'
  disabled?: boolean
  'aria-label'?: string
}

export function GoldButton({
  to,
  variant = 'solid',
  size = 'md',
  className,
  children,
  onClick,
  type = 'button',
  disabled,
  'aria-label': ariaLabel,
}: GoldButtonProps) {
  const cls = classesFor(variant, size, className)
  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick} aria-label={ariaLabel}>
        <GoldInner variant={variant}>{children}</GoldInner>
      </Link>
    )
  }
  return (
    <button className={cls} onClick={onClick} type={type} disabled={disabled} aria-label={ariaLabel}>
      <GoldInner variant={variant}>{children}</GoldInner>
    </button>
  )
}
