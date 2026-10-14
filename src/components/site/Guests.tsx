import { Reveal } from '../motion'
import { useContent } from '../../i18n/content'
import { useT } from '../../i18n/useT'

const COPY = {
  fr: {
    eyebrow: 'Diplomatic Roundtable · Dubaï',
    title: 'Invités de marque',
    intro:
      'Le corps diplomatique aux côtés de Peace Days International — table ronde « Dubaï, un centre mondial pour la paix », au Burj Khalifa.',
  },
  en: {
    eyebrow: 'Diplomatic Roundtable · Dubai',
    title: 'Distinguished guests',
    intro:
      'The diplomatic corps alongside Peace Days International — the round table “Dubai, a global centre for peace”, at the Burj Khalifa.',
  },
  ar: {
    eyebrow: 'الطاولة المستديرة الدبلوماسية · دبي',
    title: 'ضيوف شرف',
    intro:
      'السلك الدبلوماسي إلى جانب Peace Days International — طاولة مستديرة «دبي، مركز عالمي للسلام»، في برج خليفة.',
  },
} as const

/**
 * « Invités de marque » — cartons officiels du Diplomatic Roundtable (Dubaï,
 * Burj Khalifa). Les visuels client sont affichés entiers (texte incrusté),
 * simplement encadrés dans le style Nuit & Or.
 */
export function Guests() {
  const { GUESTS } = useContent()
  const { locale } = useT()
  const c = COPY[locale]
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-radial-gold" />
      <div className="container-pd relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">{c.eyebrow}</p>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-pd-sand sm:text-4xl">
            {c.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pd-sand-dim">{c.intro}</p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-4xl items-start gap-6 sm:grid-cols-2">
          {GUESTS.map((g, i) => (
            <Reveal key={g.name} delay={i * 0.1} className="group">
              <figure className="overflow-hidden rounded-3xl border border-pd-gold-muted/25 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] ring-1 ring-inset ring-white/[0.06]">
                <img
                  src={g.src}
                  alt={`${g.name} — ${g.role}, ${g.country}`}
                  loading="lazy"
                  className="w-full transition-transform duration-700 ease-premium group-hover:scale-[1.02]"
                />
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
