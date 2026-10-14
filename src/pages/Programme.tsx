import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { SessionType } from '../lib/content'
import { useContent } from '../i18n/content'
import { useT } from '../i18n/useT'
import { img, PHOTOS } from '../lib/images'
import { Reveal, TextReveal, ParallaxImage } from '../components/motion'
import { Section, CTASection } from '../components/site'
import { cn } from '../lib/utils'
import { getProgram, type AdminProgramDay } from '../lib/program'

const COPY = {
  fr: {
    heroAlt: 'Salle de conférence internationale',
    heroTitle: 'Le programme',
    month: 'janvier',
    ctaTitle1: 'Réservez votre',
    ctaTitle2: 'semaine de la paix.',
    ctaText: 'Inscrivez-vous pour accéder à l’ensemble des rendez-vous, du forum au dîner de gala.',
  },
  en: {
    heroAlt: 'International conference hall',
    heroTitle: 'The programme',
    month: 'January',
    ctaTitle1: 'Reserve your',
    ctaTitle2: 'week of peace.',
    ctaText: 'Register to access the full programme of events, from the forum to the gala dinner.',
  },
  ar: {
    heroAlt: 'قاعة مؤتمرات دولية',
    heroTitle: 'البرنامج',
    month: 'يناير',
    ctaTitle1: 'احجز',
    ctaTitle2: 'أسبوعك للسلام.',
    ctaText: 'سجّل للوصول إلى جميع الفعاليات، من المنتدى إلى حفل العشاء.',
  },
} as const

const TYPE_TONE: Record<SessionType, string> = {
  foire: 'border-pd-gold/40 text-pd-gold-soft',
  forum: 'border-pd-info/50 text-pd-info',
  art: 'border-pd-rose/50 text-pd-rose',
  sport: 'border-pd-emerald/50 text-pd-emerald',
  gala: 'border-pd-gold-bright/50 text-pd-gold-bright',
}

export default function Programme() {
  const { EVENT, PROGRAM, SESSION_TYPES } = useContent()
  const { locale } = useT()
  const c = COPY[locale]
  const [filter, setFilter] = useState<SessionType | 'tous'>('tous')
  const [program, setProgram] = useState<AdminProgramDay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getProgram()
      .then((data) => {
        if (active) setProgram(data)
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Impossible de charger le programme.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const TYPE_LABEL = Object.fromEntries(
    SESSION_TYPES.map((t) => [t.key, t.label]),
  ) as Record<SessionType, string>

  const days = useMemo(
    () =>
      program.map((d) => ({
        ...d,
        sessions: filter === 'tous' ? d.sessions : d.sessions.filter((s) => s.type === filter),
      })).filter((d) => d.sessions.length > 0),
    [filter, program],
  )

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative isolate flex min-h-[60svh] flex-col justify-end overflow-hidden">
        <ParallaxImage
          src={img(PHOTOS.conference, { w: 2200, h: 1200 })}
          alt={c.heroAlt}
          className="absolute inset-0 -z-10 h-full w-full"
          imgClassName="opacity-45"
          amount={10}
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-night-fade" />
        <div className="container-pd pb-16 pt-40">
          <Reveal>
            <p className="eyebrow">{EVENT.datesLabel} · {EVENT.location}</p>
          </Reveal>
          <TextReveal
            lines={[c.heroTitle]}
            className="mt-6"
            lineClassName="font-display font-semibold leading-[0.95] text-pd-sand text-display-md"
            delay={0.15}
          />
        </div>
      </section>
      {/* ============ FILTRES + TIMELINE ============ */}
      <Section>
        {/* Filtres */}
        <div className="sticky top-[var(--pd-header-h)] z-30 -mx-6 mb-14 flex flex-wrap gap-2 bg-pd-night/80 px-6 py-4 backdrop-blur-xl sm:mx-0 sm:rounded-sm sm:px-4">
          {SESSION_TYPES.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setFilter(t.key)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors',
                filter === t.key
                  ? 'border-pd-gold bg-pd-gold/15 text-pd-gold-bright'
                  : 'border-pd-gold-muted/30 text-pd-sand-dim hover:border-pd-gold/50 hover:text-pd-sand',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Timeline par jour */}
        {loading ? (
          <p role="status" className="py-12 text-center text-sm text-pd-sand-dim">Chargement du programme…</p>
        ) : error ? (
          <p role="alert" className="rounded-xl border border-pd-rose/40 bg-pd-rose/10 p-5 text-sm text-[#e08a83]">
            Impossible de charger le programme : {error}
          </p>
        ) : days.length === 0 ? (
          <p className="py-12 text-center text-sm text-pd-sand-dim">Le programme sera publié prochainement.</p>
        ) : (
        <div className="space-y-16">
          {days.map((day) => (
            <motion.div
              key={day.id}
              layout
              className="grid gap-8 lg:grid-cols-[160px_1fr]"
            >
              <div className="lg:sticky lg:top-40 lg:self-start">
                <span className="font-display text-6xl font-semibold text-gold-sheen">{day.day}</span>
                <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-pd-sand-dim">
                  {day.weekday} · {day.label || c.month}
                </p>
              </div>
              <div className="space-y-4">
                {day.sessions.map((s, i) => (
                  <Reveal key={i} delay={i * 0.05}>
                    <article className="group rounded-sm border border-pd-gold-muted/25 bg-pd-night-2 p-6 transition-colors hover:border-pd-gold/50">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-display text-lg font-semibold text-pd-gold-soft">{s.time}</span>
                        <span className={cn('rounded-full border px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide', TYPE_TONE[s.type])}>
                          {TYPE_LABEL[s.type]}
                        </span>
                      </div>
                      <h3 className="mt-3 font-display text-xl font-semibold text-pd-sand">{s.title}</h3>
                      {s.speaker && <p className="mt-1 text-sm font-medium text-pd-gold-soft/90">{s.speaker}</p>}
                      <p className="mt-2 text-sm leading-relaxed text-pd-sand-dim">{s.blurb}</p>
                      <p className="mt-3 text-xs uppercase tracking-wide text-pd-sand-dim/70">{s.place}</p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </Section>

      {/* ============ CTA ============ */}
      <CTASection
        titleLines={[c.ctaTitle1, c.ctaTitle2]}
        text={c.ctaText}
        photo="party"
      />
    </>
  )
}
