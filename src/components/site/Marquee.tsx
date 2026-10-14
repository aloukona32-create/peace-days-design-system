import { cn } from '../../lib/utils'

/**
 * Bandeau défilant en continu (patronages, partenaires). Pause au survol.
 * Purement décoratif : la piste est dupliquée pour une boucle sans couture et
 * masquée aux lecteurs d'écran.
 */
export function Marquee({
  items,
  className,
}: {
  items: string[]
  className?: string
}) {
  const track = [...items, ...items]
  return (
    <div
      className={cn('group relative flex overflow-hidden', className)}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-pd-night to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-pd-night to-transparent" />
      <div className="flex w-max animate-[marquee_40s_linear_infinite] items-center group-hover:[animation-play-state:paused]">
        {track.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-10 pr-10 font-display text-lg whitespace-nowrap text-pd-sand-dim/70"
          >
            {item}
            <span className="h-1 w-1 rounded-full bg-pd-gold-muted" />
          </span>
        ))}
      </div>
    </div>
  )
}
