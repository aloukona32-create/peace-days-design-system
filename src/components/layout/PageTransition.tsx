import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/**
 * Enveloppe de transition de page (écran 48). Fondu + léger déplacement à
 * l'entrée et à la sortie, doublé d'un voile doré balayant l'écran. À utiliser
 * avec <AnimatePresence mode="wait"> keyé sur le pathname.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()

  if (reduce) return <>{children}</>

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      {/* Voile doré balayant à l'entrée */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[70] origin-top bg-gradient-to-b from-pd-gold/12 via-pd-night to-pd-night"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      />
      {children}
    </motion.div>
  )
}
