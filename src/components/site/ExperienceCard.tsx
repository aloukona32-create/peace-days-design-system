import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { Experience } from '../../lib/content'
import { resolveImage } from '../../lib/images'
import { Figure } from '../ui/Figure'
import { cn } from '../../lib/utils'

/**
 * Carte « rendez-vous » : photo en cadre doré, numéro d'ordre, titre serif,
 * type, dates. Zoom léger de l'image au survol. Réutilisée sur l'accueil,
 * Peace Days et Nos événements.
 */
export function ExperienceCard({
  exp,
  className,
}: {
  exp: Experience
  className?: string
}) {
  return (
    <Link
      to={exp.to}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-sm border border-pd-gold-muted/25 bg-pd-night-2 transition-colors duration-500 hover:border-pd-gold/60',
        className,
      )}
    >
      <Figure
        src={resolveImage(exp, { w: 900, h: 620 })}
        alt={exp.title}
        ratio="aspect-[4/3]"
        overlay
        imgClassName="group-hover:scale-[1.06]"
      >
        <span className="absolute left-5 top-5 font-display text-sm font-semibold text-pd-gold-soft">
          {exp.no} <span className="text-pd-sand-dim/60">/ 05</span>
        </span>
      </Figure>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-[0.7rem] font-semibold uppercase tracking-label text-pd-gold-soft/80">
          {exp.kind}
        </p>
        <h3 className="mt-2 font-display text-2xl font-semibold text-pd-sand transition-colors group-hover:text-pd-gold-bright">
          {exp.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-pd-sand-dim">{exp.blurb}</p>

        <div className="mt-6 flex items-center justify-between border-t border-pd-gold-muted/20 pt-4">
          <span className="text-xs text-pd-sand-dim">
            {exp.dates} · {exp.city}
          </span>
          <ArrowUpRight className="h-4 w-4 text-pd-gold-soft transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  )
}
