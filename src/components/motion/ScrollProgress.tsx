import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Fine barre de progression dorée en haut de l’écran (« progress indicator »
 * du système de scroll global). Fixe, non intrusive.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gold-line"
    />
  )
}
