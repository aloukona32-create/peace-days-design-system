import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLenisInstance } from '../motion'

/**
 * Remet le défilement en haut à chaque changement de route. Utilise Lenis si
 * présent, sinon le scroll natif. Si l'URL contient une ancre (#id), défile
 * vers la cible — avec quelques tentatives car la section peut se monter après
 * la transition de page.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const lenis = useLenisInstance()

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      let tries = 0
      let timer = 0
      const tryScroll = () => {
        const el = document.getElementById(id)
        if (el) {
          if (lenis) lenis.scrollTo(el, { offset: -90 })
          else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }
        if (tries++ < 20) timer = window.setTimeout(tryScroll, 80)
      }
      const raf = requestAnimationFrame(tryScroll)
      return () => {
        cancelAnimationFrame(raf)
        window.clearTimeout(timer)
      }
    }
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname, hash, lenis])

  return null
}
