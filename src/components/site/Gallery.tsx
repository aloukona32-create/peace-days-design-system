import { Reveal } from '../motion'
import { useContent } from '../../i18n/content'
import { useT } from '../../i18n/useT'

const COPY = {
  fr: {
    eyebrow: 'Retour en images',
    title: 'La diplomatie de la paix, en actes',
    intro:
      'Rencontres officielles, prises de parole et coopérations menées à Dubaï — du corps diplomatique africain au Golfe.',
  },
  en: {
    eyebrow: 'In pictures',
    title: 'Peace diplomacy in action',
    intro:
      'Official meetings, keynote addresses and cooperation led in Dubai — from the African diplomatic corps to the Gulf.',
  },
  ar: {
    eyebrow: 'عودة بالصور',
    title: 'دبلوماسية السلام في أفعال',
    intro:
      'لقاءات رسمية وكلمات وأوجه تعاون قادتها في دبي — من السلك الدبلوماسي الأفريقي إلى الخليج.',
  },
} as const

/**
 * « Retour en images » — mur maçonné (CSS columns) des temps forts et
 * rencontres diplomatiques menées à Dubaï. Légende révélée au survol.
 */
export function Gallery() {
  const { GALLERY } = useContent()
  const { locale } = useT()
  const c = COPY[locale]
  return (
    <section className="relative overflow-hidden border-t border-pd-gold-muted/15 py-24 sm:py-28">
      <div className="container-pd">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">{c.eyebrow}</p>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-pd-sand sm:text-4xl">
            {c.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pd-sand-dim">{c.intro}</p>
        </Reveal>

        <div className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {GALLERY.map((it, i) => (
            <Reveal key={it.src} delay={(i % 3) * 0.06} className="mb-4 block break-inside-avoid">
              <figure className="group relative overflow-hidden rounded-2xl border border-white/10 ring-1 ring-inset ring-white/[0.05]">
                <img
                  src={it.src}
                  alt={it.caption}
                  loading="lazy"
                  className="w-full transition-transform duration-700 ease-premium group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-pd-night/90 via-pd-night/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100"
                />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-1.5 p-4 text-sm font-medium text-pd-sand opacity-0 transition-all duration-500 ease-premium group-hover:translate-y-0 group-hover:opacity-100">
                  {it.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
