import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'
import { useRevealInView } from './useRevealInView'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Décalage vertical initial (px) */
  y?: number
  /** Retard avant le début (s) */
  delay?: number
  /** Durée (s) */
  duration?: number
  /** Rejouer à chaque entrée dans le viewport */
  once?: boolean
  /** Léger flou d’apparition */
  blur?: boolean
  as?: 'div' | 'section' | 'li' | 'span' | 'article'
} & Omit<HTMLMotionProps<'div'>, 'children'>

/**
 * Apparition au scroll — translation + fondu + flou léger.
 * Respecte prefers-reduced-motion (apparition immédiate sans mouvement).
 */
export function Reveal({
  children,
  className,
  y = 26,
  delay = 0,
  duration = 0.8,
  once = true,
  blur = true,
  as = 'div',
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion()
  const { ref, show } = useRevealInView(once)
  // Type unifié sur motion.div : le tag rendu reste `as`, seul le typage des
  // props est harmonisé (nous n'utilisons que des attributs HTML communs).
  const MotionTag = motion[as] as typeof motion.div

  if (reduce) {
    return (
      <MotionTag className={className} {...rest}>
        {children}
      </MotionTag>
    )
  }

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, filter: blur ? 'blur(8px)' : 'blur(0px)' }}
      animate={show ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
