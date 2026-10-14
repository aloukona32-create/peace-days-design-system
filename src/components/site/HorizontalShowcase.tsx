import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import type { Experience } from '../../lib/content'
import { resolveImage } from '../../lib/images'
import { Figure } from '../ui/Figure'
import { useT } from '../../i18n/useT'

const COPY = {
  fr: { eyebrow: 'Le parcours · 5 rendez-vous', outro1: '…et une semaine', outro2: 'de rencontres.' },
  en: { eyebrow: 'The journey · 5 gatherings', outro1: '…and a week', outro2: 'of encounters.' },
  ar: { eyebrow: 'المسار · 5 مواعيد', outro1: '…وأسبوع', outro2: 'من اللقاءات.' },
} as const

/** Un panneau cinématique plein cadre pour un rendez-vous. */
function Panel({ exp, total }: { exp: Experience; total: number }) {
  return (
    <article className="relative h-full w-[86vw] max-w-[900px] shrink-0 overflow-hidden rounded-sm border border-pd-gold-muted/25">
      <Figure
        src={resolveImage(exp, { w: 1300, h: 1000 })}
        alt={exp.title}
        className="absolute inset-0 h-full w-full"
        overlay="strong"
      />
      <div className="relative flex h-full flex-col justify-between p-8 sm:p-12">
        <div className="flex items-center justify-between">
          <span className="font-display text-2xl font-semibold text-pd-gold-soft">
            {exp.no} <span className="text-pd-sand-dim/50">/ {String(total).padStart(2, '0')}</span>
          </span>
          <span className="rounded-full border border-pd-gold-muted/40 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-label text-pd-gold-soft">
            {exp.kind}
          </span>
        </div>
        <div className="max-w-lg">
          <h3 className="font-display text-4xl font-semibold leading-tight text-pd-sand sm:text-5xl">
            {exp.title}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-pd-sand-dim sm:text-lg">{exp.blurb}</p>
          <p className="mt-6 text-sm font-semibold text-pd-gold-soft">
            {exp.dates} · {exp.city}
          </p>
        </div>
      </div>
    </article>
  )
}

/**
 * Défilement horizontal épinglé (« pinned horizontal scroll ») : en défilant
 * verticalement, les panneaux glissent de droite à gauche dans une fenêtre
 * collante. Repli en pile verticale si l'utilisateur réduit les animations.
 */
export function HorizontalShowcase({ experiences }: { experiences: Experience[] }) {
  const { locale } = useT()
  const c = COPY[locale]
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  const { scrollYProgress } = useScroll({ target: sectionRef })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])

  useEffect(() => {
    if (reduce) return
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [reduce, experiences.length])

  if (reduce) {
    return (
      <div className="container-pd flex flex-col gap-8 py-16">
        {experiences.map((exp) => (
          <div key={exp.key} className="h-[70vh]">
            <Panel exp={exp} total={experiences.length} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <section
      ref={sectionRef}
      style={{ height: distance + (typeof window !== 'undefined' ? window.innerHeight : 800) }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="pointer-events-none absolute left-6 top-24 z-10 sm:left-12">
          <p className="eyebrow">{c.eyebrow}</p>
        </div>
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex h-[70vh] items-stretch gap-6 px-6 sm:gap-8 sm:px-12"
        >
          {experiences.map((exp) => (
            <Panel key={exp.key} exp={exp} total={experiences.length} />
          ))}
          <div className="flex h-full w-[40vw] shrink-0 items-center">
            <p className="font-display text-3xl font-semibold leading-tight text-pd-sand-dim/60">
              {c.outro1}
              <br />
              {c.outro2}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
