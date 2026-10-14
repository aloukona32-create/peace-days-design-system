import { animate, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

type CounterProps = {
  to: number
  suffix?: string
  duration?: number
  className?: string
}

/**
 * Compteur animé : décompte fluide de 0 à `to` lorsqu’il entre dans le
 * viewport. Formatage français (séparateur de milliers).
 */
export function Counter({ to, suffix = '', duration = 1.8, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' })
  const reduce = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setValue(to)
      return
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to, duration, reduce])

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString('fr-FR')}
      {suffix}
    </span>
  )
}
