import * as React from 'react'
import { cn } from '../../lib/utils'

const toneStyles = {
  gold: 'border-pd-gold-muted text-pd-gold bg-pd-gold/10',
  emerald: 'border-pd-emerald/50 text-pd-emerald bg-pd-emerald/10',
  rose: 'border-pd-rose/50 text-pd-rose bg-pd-rose/10',
  neutral: 'border-pd-sand/30 text-pd-sand/80 bg-pd-sand/5',
} as const

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: keyof typeof toneStyles
}

export function Badge({ className, tone = 'gold', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  )
}
