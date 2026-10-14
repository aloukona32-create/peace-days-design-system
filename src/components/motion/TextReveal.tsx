import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useRevealInView } from './useRevealInView'

type TextRevealProps = {
  /** Lignes à révéler l’une après l’autre */
  lines: ReactNode[]
  className?: string
  lineClassName?: string
  delay?: number
  stagger?: number
  once?: boolean
}

/**
 * Révélation typographique ligne par ligne : chaque ligne monte depuis
 * un masque, avec un léger décalage. Usage : titres éditoriaux (hero, concept).
 */
export function TextReveal({
  lines,
  className,
  lineClassName,
  delay = 0.1,
  stagger = 0.12,
  once = true,
}: TextRevealProps) {
  const reduce = useReducedMotion()
  const { ref, show } = useRevealInView(once)

  if (reduce) {
    return (
      <div className={className}>
        {lines.map((line, i) => (
          <span key={i} className={`block ${lineClassName ?? ''}`}>
            {line}
          </span>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={show ? 'show' : 'hidden'}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={`block will-change-transform ${lineClassName ?? ''}`}
            variants={{
              hidden: { y: '110%' },
              show: { y: '0%' },
            }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.div>
  )
}
