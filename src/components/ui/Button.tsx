import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-sm font-semibold tracking-wide transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pd-gold-bright focus-visible:ring-offset-2 focus-visible:ring-offset-pd-night',
  {
    variants: {
      variant: {
        primary: 'bg-pd-gold text-pd-ink shadow-plaque hover:bg-pd-gold-bright active:brightness-95',
        secondary:
          'border border-pd-gold text-pd-gold bg-transparent hover:bg-pd-gold/10 hover:border-pd-gold-bright',
        ghost: 'text-pd-gold hover:bg-pd-gold/10',
        danger: 'bg-pd-rose text-pd-ivory hover:brightness-110',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-12 px-8 text-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
