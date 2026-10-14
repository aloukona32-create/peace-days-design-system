import { cn } from '../../lib/utils'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  className?: string
}

export function SectionHeading({ eyebrow, title, description, className }: SectionHeadingProps) {
  return (
    <div className={cn('max-w-2xl', className)}>
      {eyebrow && <p className="text-sm font-semibold text-pd-gold-muted">{eyebrow}</p>}
      <h2 className="mt-2 font-display text-3xl font-semibold text-pd-sand">{title}</h2>
      {description && <p className="mt-3 text-base leading-relaxed text-pd-sand/70">{description}</p>}
    </div>
  )
}
