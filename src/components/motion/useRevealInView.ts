import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

// framer-motion type le `margin` comme un littéral `MarginType` (ex. '0px 0px -12% 0px')
// et non comme un simple `string`. On réutilise donc son type exact pour le paramètre.
type UseInViewMargin = NonNullable<Parameters<typeof useInView>[1]>['margin']

/**
 * Déclenche une révélation « au scroll » de façon fiable, même après une
 * transition de page.
 *
 * Problème corrigé : avec <AnimatePresence mode="wait">, la nouvelle page se
 * monte APRÈS l'animation de sortie, pendant que le scroll vient d'être remis en
 * haut. L'IntersectionObserver de `whileInView` peut alors s'attacher dans une
 * fenêtre instable et ne jamais recevoir son callback pour les éléments déjà
 * au-dessus de la ligne de flottaison → ils restent bloqués à opacity:0 (page
 * scrollable mais vide).
 *
 * Solution : on contrôle nous-mêmes l'état `show`. Il passe à true dès que
 * l'observer déclenche OU, en filet de sécurité, peu après le montage si
 * l'élément est RÉELLEMENT dans le viewport. Les éléments vraiment plus bas
 * continuent d'attendre le scroll.
 */
export function useRevealInView(
  once = true,
  margin: UseInViewMargin = '0px 0px -12% 0px',
) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin })
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (inView) setShow(true)
  }, [inView])

  useEffect(() => {
    if (show) return
    let raf = 0
    const check = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      // Visible (même partiellement) à l'écran → on révèle sans attendre le scroll.
      if (r.top < vh && r.bottom > 0) setShow(true)
    }
    // On laisse la transition de page et le repositionnement du scroll se poser.
    const t = window.setTimeout(() => {
      raf = requestAnimationFrame(check)
    }, 400)
    return () => {
      window.clearTimeout(t)
      cancelAnimationFrame(raf)
    }
  }, [show])

  return { ref, show }
}
