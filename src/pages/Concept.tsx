import { useContent } from '../i18n/content'
import { useT } from '../i18n/useT'
import { img, PHOTOS } from '../lib/images'
import { Reveal, TextReveal, GoldLine, ParallaxImage } from '../components/motion'
import { Section, SectionIntro, CTASection } from '../components/site'

const COPY = {
  fr: {
    heroAlt: 'Brume au lever du jour',
    heroEyebrow: 'Peace Days · Concept & valeurs',
    heroTitle: 'Le concept',
    manifesto1: 'La paix ne se décrète pas.',
    manifesto2: 'Elle se cultive, se partage,',
    manifesto3: 'se célèbre — ensemble.',
    manifestoBody:
      'rassemble cultures, générations et nations autour d’une conviction simple : c’est par la rencontre que naissent la confiance, la coopération et la paix durable.',
    valuesEyebrow: 'Nos valeurs',
    valuesTitle1: 'Cinq principes,',
    valuesTitle2: 'un cap commun.',
    ctaEyebrow: 'Passer à l’action',
    ctaTitle1: 'Vivez le concept',
    ctaTitle2: 'sur place, à Dubaï.',
    ctaText: 'Le programme complet traduit ces valeurs en huit jours de rencontres.',
    ctaLabel: 'Voir le programme',
  },
  en: {
    heroAlt: 'Mist at daybreak',
    heroEyebrow: 'Peace Days · Concept & values',
    heroTitle: 'The concept',
    manifesto1: 'Peace cannot be decreed.',
    manifesto2: 'It is cultivated, shared,',
    manifesto3: 'celebrated — together.',
    manifestoBody:
      'brings together cultures, generations and nations around a simple conviction: it is through encounter that trust, cooperation and lasting peace are born.',
    valuesEyebrow: 'Our values',
    valuesTitle1: 'Five principles,',
    valuesTitle2: 'one shared course.',
    ctaEyebrow: 'Take action',
    ctaTitle1: 'Experience the concept',
    ctaTitle2: 'on site, in Dubai.',
    ctaText: 'The full programme turns these values into eight days of encounters.',
    ctaLabel: 'View the programme',
  },
  ar: {
    heroAlt: 'ضباب عند بزوغ الفجر',
    heroEyebrow: 'Peace Days · المفهوم والقيم',
    heroTitle: 'المفهوم',
    manifesto1: 'السلام لا يُفرَض بمرسوم.',
    manifesto2: 'بل يُزرَع ويُشارَك،',
    manifesto3: 'ويُحتفى به — معًا.',
    manifestoBody:
      'يجمع بين الثقافات والأجيال والأمم حول قناعة بسيطة: من اللقاء تنشأ الثقة والتعاون والسلام الدائم.',
    valuesEyebrow: 'قيمنا',
    valuesTitle1: 'خمسة مبادئ،',
    valuesTitle2: 'ووجهة واحدة.',
    ctaEyebrow: 'إلى العمل',
    ctaTitle1: 'عِش المفهوم',
    ctaTitle2: 'على أرض الواقع، في دبي.',
    ctaText: 'يترجم البرنامج الكامل هذه القيم إلى ثمانية أيام من اللقاءات.',
    ctaLabel: 'عرض البرنامج',
  },
} as const

export default function Concept() {
  const { EVENT, VALUES } = useContent()
  const { locale } = useT()
  const c = COPY[locale]
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative isolate flex min-h-[75svh] flex-col justify-end overflow-hidden">
        <ParallaxImage
          src={img(PHOTOS.mist, { w: 2200, h: 1300 })}
          alt={c.heroAlt}
          className="absolute inset-0 -z-10 h-full w-full"
          imgClassName="opacity-45"
          amount={10}
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-night-fade" />
        <div className="container-pd pb-20 pt-40">
          <Reveal>
            <p className="eyebrow">{c.heroEyebrow}</p>
          </Reveal>
          <TextReveal
            lines={[c.heroTitle]}
            className="mt-6"
            lineClassName="font-display font-semibold leading-[0.95] text-pd-sand text-display-md"
            delay={0.15}
          />
        </div>
      </section>

      {/* ============ MANIFESTE ============ */}
      <Section>
        <div className="mx-auto max-w-4xl">
          <TextReveal
            lines={[c.manifesto1, c.manifesto2, c.manifesto3]}
            lineClassName="font-display text-3xl font-semibold leading-[1.15] text-pd-sand sm:text-display-sm"
          />
          <Reveal delay={0.2} className="mt-8 max-w-2xl">
            <p className="text-lg leading-relaxed text-pd-sand-dim">
              {EVENT.name} {EVENT.edition} {c.manifestoBody}
            </p>
          </Reveal>
        </div>
      </Section>
      {/* ============ NOS VALEURS ============ */}
      <Section className="border-t border-pd-gold-muted/15 bg-pd-night-2/40">
        <SectionIntro eyebrow={c.valuesEyebrow} titleLines={[c.valuesTitle1, c.valuesTitle2]} />
        <div className="mt-16">
          {VALUES.map((v, i) => (
            <div key={v.word}>
              {i > 0 && <GoldLine className="my-2" />}
              <Reveal delay={0.05}>
                <div className="grid items-baseline gap-4 py-8 md:grid-cols-[auto_1fr] md:gap-12">
                  <div className="flex items-baseline gap-5">
                    <span className="font-display text-sm font-semibold text-pd-gold-muted">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-display text-4xl font-semibold text-pd-sand sm:text-5xl">
                      {v.word}
                    </h3>
                  </div>
                  <p className="max-w-xl text-lg leading-relaxed text-pd-sand-dim md:justify-self-end">
                    {v.line}
                  </p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </Section>

      {/* ============ CTA ============ */}
      <CTASection
        eyebrow={c.ctaEyebrow}
        titleLines={[c.ctaTitle1, c.ctaTitle2]}
        text={c.ctaText}
        to="/peace-days/programme"
        cta={c.ctaLabel}
        photo="crowd"
      />
    </>
  )
}
