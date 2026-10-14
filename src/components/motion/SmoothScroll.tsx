import Lenis from 'lenis'
import { useReducedMotion } from 'framer-motion'
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

const LenisContext = createContext<Lenis | null>(null)

/** Accès à l’instance Lenis (scroll fluide) pour le défilement programmatique. */
export const useLenisInstance = () => useContext(LenisContext)

/**
 * Défilement fluide global (Lenis). Désactivé si l’utilisateur préfère
 * réduire les animations — le scroll natif prend alors le relais.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (reduce) return
    const l = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    })
    setLenis(l)

    let raf = 0
    const loop = (time: number) => {
      l.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      l.destroy()
      setLenis(null)
    }
  }, [reduce])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
