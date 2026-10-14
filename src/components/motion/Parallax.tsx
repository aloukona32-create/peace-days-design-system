import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

type ParallaxProps = {
  children: ReactNode
  className?: string
  /** Amplitude du déplacement en % de la hauteur (négatif = monte plus vite) */
  amount?: number
}

/**
 * Parallaxe verticale légère : l’élément se déplace un peu plus lentement
 * que le scroll pendant qu’il traverse le viewport.
 */
export function Parallax({ children, className, amount = 12 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [`${amount}%`, `${-amount}%`])

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  )
}

type ParallaxImageProps = {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  amount?: number
}

/**
 * Image en parallaxe : la photo est sur-dimensionnée et translatée dans un
 * cadre en overflow hidden, posée sur un dégradé nuit (dégradation gracieuse).
 */
export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  amount = 14,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`])

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-pd-night-2 bg-radial-gold ${className ?? ''}`}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={reduce ? undefined : { y }}
        className={`absolute inset-0 h-[128%] w-full -translate-y-[11%] object-cover ${imgClassName ?? ''}`}
      />
    </div>
  )
}
