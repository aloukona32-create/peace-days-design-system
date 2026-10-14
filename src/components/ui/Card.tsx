import * as React from 'react'
import { cn } from '../../lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'certificate'
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-sm border border-pd-gold-muted/50 bg-pd-night-2 p-6',
        variant === 'certificate' &&
          "relative border-t-2 border-t-pd-gold before:absolute before:left-0 before:top-0 before:h-2 before:w-2 before:border-l before:border-t before:border-pd-gold-muted after:absolute after:right-0 after:top-0 after:h-2 after:w-2 after:border-r after:border-t after:border-pd-gold-muted",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardEyebrow({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('text-xs font-semibold tracking-wide text-pd-gold-muted', className)} {...props} />
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('mt-1 font-display text-xl font-semibold text-pd-sand', className)} {...props} />
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('mt-2 text-sm leading-relaxed text-pd-sand/70', className)} {...props} />
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-5 flex items-center gap-3', className)} {...props} />
}
