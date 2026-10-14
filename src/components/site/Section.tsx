import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { Reveal, TextReveal } from '../motion'

/** Section éditoriale à rythme vertical constant sur tout le site. */
export function Section({
  id,
  children,
  className,
  bleed = false,
}: {
  id?: string
  children: ReactNode
  className?: string
  bleed?: boolean
}) {
  return (
    <section id={id} className={cn('relative py-24 sm:py-32', className)}>
      {bleed ? children : <div className="container-pd">{children}</div>}
    </section>
  )
}

/** En-tête de section : eyebrow + titre révélé ligne par ligne + intro. */
export function SectionIntro({
  eyebrow,
  titleLines,
  intro,
  align = 'left',
  className,
}: {
  eyebrow?: string
  titleLines: string[]
  intro?: string
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'max-w-3xl',
        align === 'center' && 'mx-auto text-center',
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <p className={cn('eyebrow', align === 'center' && 'justify-center')}>{eyebrow}</p>
        </Reveal>
      )}
      <TextReveal
        lines={titleLines}
        className="mt-5"
        lineClassName="font-display text-4xl font-semibold leading-[1.08] text-pd-sand sm:text-display-sm"
      />
      {intro && (
        <Reveal delay={0.15} className="mt-6">
          <p className="text-lg leading-relaxed text-pd-sand-dim">{intro}</p>
        </Reveal>
      )}
    </div>
  )
}
