import { useContent } from '../../i18n/content'
import { Counter, Reveal } from '../motion'
import { cn } from '../../lib/utils'

/** Bandeau de chiffres d'impact animés (compteurs au scroll). */
export function StatsBand({ className }: { className?: string }) {
  const { STATS } = useContent()
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-pd-gold-muted/20 bg-pd-gold-muted/20 lg:grid-cols-4',
        className,
      )}
    >
      {STATS.map((s, i) => (
        <Reveal
          key={s.label}
          delay={i * 0.08}
          className="flex flex-col items-center justify-center bg-pd-night-2 px-6 py-10 text-center"
        >
          <span className="font-display text-4xl font-semibold text-gold-sheen sm:text-5xl">
            <Counter to={s.value} suffix={s.suffix} />
          </span>
          <span className="mt-3 max-w-[14ch] text-xs font-semibold uppercase tracking-wide text-pd-sand-dim">
            {s.label}
          </span>
        </Reveal>
      ))}
    </div>
  )
}
