import * as React from 'react'
import { cn } from '../../lib/utils'

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('mb-1.5 block text-sm font-medium text-pd-sand', className)} {...props} />
}

export function HelperText({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('mt-1.5 text-xs text-pd-sand/60', className)} {...props} />
}

export function FieldError({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p role="alert" className={cn('mt-1.5 text-xs font-medium text-pd-rose', className)} {...props} />
}

const fieldBase =
  'w-full rounded-sm border bg-pd-night-3 px-4 py-2.5 text-sm text-pd-sand placeholder:text-pd-sand/40 transition-colors duration-150 focus:outline-none focus:ring-1'

const fieldTone = (invalid?: boolean) =>
  invalid
    ? 'border-pd-rose focus:border-pd-rose focus:ring-pd-rose'
    : 'border-pd-gold-muted/50 focus:border-pd-gold-bright focus:ring-pd-gold-bright'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input ref={ref} className={cn(fieldBase, fieldTone(invalid), className)} {...props} />
  ),
)
Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(fieldBase, 'min-h-[110px] resize-y', fieldTone(invalid), className)}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        fieldBase,
        "appearance-none bg-[right_1rem_center] bg-no-repeat bg-[length:12px_8px] bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22><path d=%22M1 1l5 5 5-5%22 stroke=%22%23C9A227%22 stroke-width=%221.5%22 fill=%22none%22/></svg>')]",
        fieldTone(invalid),
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
)
Select.displayName = 'Select'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode
}

export function Checkbox({ className, label, id, ...props }: CheckboxProps) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5 text-sm text-pd-sand/90">
      <input
        id={id}
        type="checkbox"
        className={cn(
          'mt-0.5 h-4 w-4 shrink-0 rounded-[3px] border border-pd-gold-muted/60 bg-pd-night-3 accent-pd-gold',
          className,
        )}
        {...props}
      />
      <span>{label}</span>
    </label>
  )
}
