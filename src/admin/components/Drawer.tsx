import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

/** Panneau latéral « verre » (fiche détail). Échap et clic fond ferment. */
export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: {
  open: boolean
  onClose: () => void
  title: React.ReactNode
  subtitle?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90]">
          <motion.div
            className="absolute inset-0 bg-pd-night/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-pd-night-2/80 shadow-[0_0_120px_-20px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
              <div className="min-w-0">
                <div className="font-display text-lg font-semibold text-pd-sand">{title}</div>
                {subtitle && <div className="mt-0.5 text-xs text-pd-sand-dim">{subtitle}</div>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-pd-sand-dim transition-colors hover:text-pd-sand"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
            {footer && <div className="border-t border-white/10 px-6 py-4">{footer}</div>}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
