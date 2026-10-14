import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useContent } from '../i18n/content'
import { useT } from '../i18n/useT'
import { img, PHOTOS } from '../lib/images'
import { Reveal, TextReveal, Magnetic, ParallaxImage } from '../components/motion'
import { GoldButton } from '../components/ui/GoldButton'
import { Section, SectionIntro, ExperienceCard, CTASection } from '../components/site'
import { Figure } from '../components/ui/Figure'

const COPY = {
  fr: {
    heroEyebrow: 'Doggo Management · Portfolio',
    heroAlt: 'Scène et lumières',
    heroTitle: 'Nos événements',
    heroText:
      'Des rendez-vous internationaux au service du dialogue et de la coopération. Aujourd’hui, notre édition phare porte un nom : Peace Days Dubaï 2027.',
    currentEyebrow: 'L’édition en cours',
    exploreEvent: 'Explorer l’événement',
    rdvEyebrow: 'Au sein de Peace Days 2027',
    rdvTitle1: 'Cinq rendez-vous',
    rdvTitle2: 'à ne pas manquer.',
    seeProgram: 'Voir le programme détaillé',
    ctaTitle1: 'Construisons',
    ctaTitle2: 'le prochain rendez-vous.',
    ctaText:
      'Institutions, marques et territoires : imaginons ensemble un événement à la hauteur de vos ambitions.',
  },
  en: {
    heroEyebrow: 'Doggo Management · Portfolio',
    heroAlt: 'Stage and lights',
    heroTitle: 'Our events',
    heroText:
      'International gatherings in the service of dialogue and cooperation. Today, our flagship edition has a name: Peace Days Dubai 2027.',
    currentEyebrow: 'The current edition',
    exploreEvent: 'Explore the event',
    rdvEyebrow: 'Within Peace Days 2027',
    rdvTitle1: 'Five highlights',
    rdvTitle2: 'not to be missed.',
    seeProgram: 'See the full programme',
    ctaTitle1: 'Let’s build',
    ctaTitle2: 'the next gathering.',
    ctaText:
      'Institutions, brands and regions: let’s imagine together an event worthy of your ambitions.',
  },
  ar: {
    heroEyebrow: 'Doggo Management · أعمالنا',
    heroAlt: 'المسرح والأضواء',
    heroTitle: 'فعالياتنا',
    heroText:
      'ملتقيات دولية في خدمة الحوار والتعاون. اليوم، تحمل نسختنا الرئيسية اسمًا: Peace Days Dubai 2027.',
    currentEyebrow: 'النسخة الحالية',
    exploreEvent: 'استكشف الفعالية',
    rdvEyebrow: 'ضمن Peace Days 2027',
    rdvTitle1: 'خمسة مواعيد',
    rdvTitle2: 'لا ينبغي تفويتها.',
    seeProgram: 'اطّلع على البرنامج الكامل',
    ctaTitle1: 'لنبنِ معًا',
    ctaTitle2: 'الموعد القادم.',
    ctaText:
      'المؤسسات والعلامات التجارية والمناطق: لنتخيّل معًا فعالية ترقى إلى مستوى طموحاتكم.',
  },
} as const

export default function Evenements() {
  const { EVENT, EXPERIENCES } = useContent()
  const { locale } = useT()
  const c = COPY[locale]
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative isolate flex min-h-[65svh] flex-col justify-end overflow-hidden">
        <ParallaxImage
          src={img(PHOTOS.stageLights, { w: 2200, h: 1200 })}
          alt={c.heroAlt}
          className="absolute inset-0 -z-10 h-full w-full"
          imgClassName="opacity-50"
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
          <Reveal delay={0.35} className="mt-6 max-w-2xl">
            <p className="text-lg leading-relaxed text-pd-sand-dim sm:text-xl">
              {c.heroText}
            </p>
          </Reveal>
        </div>
      </section>
      {/* ============ ÉDITION PHARE ============ */}
      <Section>
        <Reveal>
          <p className="eyebrow">{c.currentEyebrow}</p>
        </Reveal>
        <Link
          to="/peace-days"
          className="group mt-6 block overflow-hidden rounded-sm border border-pd-gold-muted/30 transition-colors hover:border-pd-gold/60"
        >
          <div className="grid lg:grid-cols-2">
            <Figure
              src={img(PHOTOS.dubaiSunset, { w: 1200, h: 900 })}
              alt="Peace Days Dubaï 2027"
              ratio="aspect-[4/3] lg:aspect-auto lg:h-full"
              overlay
              imgClassName="group-hover:scale-105"
            />
            <div className="flex flex-col justify-center gap-4 bg-pd-night-2 p-8 sm:p-12">
              <span className="text-[0.7rem] font-semibold uppercase tracking-label text-pd-gold-soft">
                {EVENT.datesLabel} · {EVENT.location}
              </span>
              <h2 className="font-display text-3xl font-semibold text-pd-sand sm:text-4xl">
                Peace Days {EVENT.edition}
              </h2>
              <p className="text-base leading-relaxed text-pd-sand-dim">{EVENT.tagline}</p>
              <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-pd-gold-soft transition-colors group-hover:text-pd-gold-bright">
                {c.exploreEvent}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>
      </Section>

      {/* ============ LES RENDEZ-VOUS ============ */}
      <Section className="border-t border-pd-gold-muted/15 bg-pd-night-2/40">
        <SectionIntro
          eyebrow={c.rdvEyebrow}
          titleLines={[c.rdvTitle1, c.rdvTitle2]}
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERIENCES.map((exp, i) => (
            <Reveal key={exp.key} delay={(i % 3) * 0.08} className="h-full">
              <ExperienceCard exp={exp} className="h-full" />
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2} className="mt-12">
          <Magnetic className="inline-flex">
            <GoldButton to="/peace-days/programme" variant="outline" size="lg">
              {c.seeProgram}
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </GoldButton>
          </Magnetic>
        </Reveal>
      </Section>

      {/* ============ CTA ============ */}
      <CTASection
        titleLines={[c.ctaTitle1, c.ctaTitle2]}
        text={c.ctaText}
        photo="handshake"
      />
    </>
  )
}
