import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

type MagneticProps = {
  children: ReactNode
  className?: string
  /** Force de l’aimantation (px max) */
  strength?: number
}

/**
 * Aimantation subtile : l’élément suit légèrement le curseur au survol,
 * puis revient en douceur. Réservé aux CTA (« magnetic CTA subtils »).
 */
export function Magnetic({ children, className, strength = 14 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 })
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 })

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    x.set((relX / rect.width) * strength * 2)
    y.set((relY / rect.height) * strength * 2)
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={`inline-flex ${className ?? ''}`}
    >
      {children}
    </motion.div>
  )
}
