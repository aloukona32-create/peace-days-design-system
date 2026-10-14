import { motion, useReducedMotion } from 'framer-motion'

type GoldLineProps = {
  className?: string
  /** Origine de l’animation */
  origin?: 'left' | 'center'
  delay?: number
}

/**
 * Filet doré animé : se dessine horizontalement à l’entrée dans le viewport.
 * Signature visuelle récurrente du site (« petite ligne dorée »).
 */
export function GoldLine({ className, origin = 'left', delay = 0 }: GoldLineProps) {
  const reduce = useReducedMotion()
  return (
    <motion.span
      aria-hidden="true"
      className={`block h-px w-full bg-gold-line ${
        origin === 'center' ? 'origin-center' : 'origin-left'
      } ${className ?? ''}`}
      initial={reduce ? undefined : { scaleX: 0, opacity: 0 }}
      whileInView={reduce ? undefined : { scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}
