import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useContent } from '../../i18n/content'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/**
 * Rideau d'introduction (écran 47). Compteur doré 0 → 100, révélation du
 * wordmark, puis le rideau se lève. Ignoré si l'utilisateur réduit les
 * animations — le site s'affiche immédiatement.
 */
export function Loader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion()
  const { EVENT } = useContent()
  const [pct, setPct] = useState(0)

  useEffect(() => {
    if (reduce) {
      onDone()
      return
    }
    let raf = 0
    const start = performance.now()
    const DURATION = 1400
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION)
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      setPct(Math.round(eased * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
      else setTimeout(onDone, 420)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce, onDone])

  if (reduce) return null

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-pd-night"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-radial-gold opacity-50"
      />

      <div className="relative flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-[0.7rem] font-semibold uppercase tracking-label text-pd-gold-soft"
        >
          {EVENT.organizer}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
          className="mt-3 text-center font-display text-4xl font-semibold text-pd-sand sm:text-5xl"
        >
          Peace Days
          <span className="block text-gold-sheen">{EVENT.edition}</span>
        </motion.h1>

        <div className="mt-10 flex w-56 items-center gap-4">
          <div className="h-px flex-1 overflow-hidden bg-pd-night-4">
            <motion.div
              className="h-full bg-gold-line"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="w-9 text-right font-display text-sm tabular-nums text-pd-gold-soft">
            {pct}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
