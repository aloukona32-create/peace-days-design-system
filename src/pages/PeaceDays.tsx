import { ArrowRight, ChevronDown } from 'lucide-react'
import { useContent } from '../i18n/content'
import { useT } from '../i18n/useT'
import { img, PHOTOS } from '../lib/images'
import { Reveal, TextReveal, Magnetic, ParallaxImage } from '../components/motion'
import { GoldButton } from '../components/ui/GoldButton'
import { Section, SectionIntro, CTASection, HorizontalShowcase, ParticipationForm, ReservationGala, Guests, Gallery } from '../components/site'

const COPY = {
  fr: {
    heroAlt: 'Dubaï de nuit',
    heroTitle2: 'Dubaï 2027',
    heroIntro: 'Huit jours pour faire dialoguer les cultures et les économies. Une foire, un forum, une exposition, un match et un dîner de gala —',
    scrollExplore: 'Explorer',
    whyEyebrow: 'Pourquoi Peace Days',
    whyTitle1: 'La paix n’est pas',
    whyTitle2: 'un discours.',
    whyTitle3: 'C’est une rencontre.',
    whyIntro: 'Peace Days réunit gouvernements, entreprises, artistes et société civile autour d’un même objectif : transformer les intentions de paix en coopérations concrètes, durables et mesurables.',
    themesEyebrow: 'Six thématiques',
    themesTitle1: 'Des ponts entre',
    themesTitle2: 'les cultures et les causes.',
    seeFullProgram: 'Voir le programme complet',
    ctaEyebrow: 'Rejoindre l’édition 2027',
    ctaTitle1: 'Votre place',
    ctaTitle2: 'dans l’histoire.',
    ctaText: 'Participez, exposez, soutenez ou couvrez l’événement. Chaque présence compte.',
  },
  en: {
    heroAlt: 'Dubai by night',
    heroTitle2: 'Dubai 2027',
    heroIntro: 'Eight days to bring cultures and economies into dialogue. A fair, a forum, an exhibition, a match and a gala dinner —',
    scrollExplore: 'Explore',
    whyEyebrow: 'Why Peace Days',
    whyTitle1: 'Peace is not',
    whyTitle2: 'a speech.',
    whyTitle3: 'It is an encounter.',
    whyIntro: 'Peace Days brings together governments, businesses, artists and civil society around a single goal: turning intentions of peace into concrete, lasting and measurable cooperation.',
    themesEyebrow: 'Six themes',
    themesTitle1: 'Bridges between',
    themesTitle2: 'cultures and causes.',
    seeFullProgram: 'See the full program',
    ctaEyebrow: 'Join the 2027 edition',
    ctaTitle1: 'Your place',
    ctaTitle2: 'in history.',
    ctaText: 'Take part, exhibit, support or cover the event. Every presence counts.',
  },
  ar: {
    heroAlt: 'دبي ليلًا',
    heroTitle2: 'دبي 2027',
    heroIntro: 'ثمانية أيام لإقامة حوار بين الثقافات والاقتصادات. معرض، ومنتدى، ومعرض فني، ومباراة، وحفل عشاء —',
    scrollExplore: 'استكشف',
    whyEyebrow: 'لماذا Peace Days',
    whyTitle1: 'السلام ليس',
    whyTitle2: 'خطابًا.',
    whyTitle3: 'إنه لقاء.',
    whyIntro: 'تجمع Peace Days الحكومات والشركات والفنانين والمجتمع المدني حول هدف واحد: تحويل نوايا السلام إلى تعاون ملموس ومستدام وقابل للقياس.',
    themesEyebrow: 'ستة محاور',
    themesTitle1: 'جسور بين',
    themesTitle2: 'الثقافات والقضايا.',
    seeFullProgram: 'اطّلع على البرنامج الكامل',
    ctaEyebrow: 'انضم إلى نسخة 2027',
    ctaTitle1: 'مكانك',
    ctaTitle2: 'في التاريخ.',
    ctaText: 'شارك، أو اعرض، أو ادعم، أو غطِّ الحدث. كل حضور مهم.',
  },
} as const

export default function PeaceDays() {
  const { EVENT, THEMES, VALUES, EXPERIENCES } = useContent()
  const { locale } = useT()
  const c = COPY[locale]
  return (
    <>
      {/* ============ HERO IMMERSIF ============ */}
      <section className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden text-center">
        <ParallaxImage
          src={img(PHOTOS.dubaiNight, { w: 2200, h: 1500 })}
          alt={c.heroAlt}
          className="absolute inset-0 -z-10 h-full w-full"
          imgClassName="opacity-60"
          amount={12}
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-pd-night/70 via-pd-night/40 to-pd-night" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-radial-gold" />

        <div className="container-pd">
          <Reveal>
            <p className="eyebrow justify-center">{EVENT.location}</p>
          </Reveal>
          <TextReveal
            lines={['Peace Days', c.heroTitle2]}
            className="mt-6"
            lineClassName="font-display font-semibold leading-[0.92] text-pd-sand text-display-lg"
            delay={0.15}
          />
          <Reveal delay={0.4} className="mx-auto mt-8 max-w-2xl">
            <p className="text-lg leading-relaxed text-pd-sand-dim sm:text-xl">
              {c.heroIntro} {EVENT.datesLabel}.
            </p>
          </Reveal>
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
          <div className="flex flex-col items-center gap-2 text-pd-sand-dim/70">
            <span className="text-[0.6rem] font-semibold uppercase tracking-label">{c.scrollExplore}</span>
            <ChevronDown className="h-4 w-4 animate-float-slow" />
          </div>
        </div>
      </section>

      {/* ============ DEMANDE DE PARTICIPATION ============ */}
      <ParticipationForm />

      {/* ============ POURQUOI ============ */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          <SectionIntro
            eyebrow={c.whyEyebrow}
            titleLines={[c.whyTitle1, c.whyTitle2, c.whyTitle3]}
            intro={c.whyIntro}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <Reveal
                key={v.word}
                delay={i * 0.08}
                className="rounded-sm border border-pd-gold-muted/25 bg-pd-night-2 p-5"
              >
                <h3 className="font-display text-xl font-semibold text-pd-gold-soft">{v.word}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pd-sand-dim">{v.line}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ============ PARCOURS HORIZONTAL ============ */}
      <div className="border-y border-pd-gold-muted/15 bg-pd-night-2/30">
        <HorizontalShowcase experiences={EXPERIENCES} />
      </div>

      {/* ============ THÉMATIQUES ============ */}
      <Section>
        <SectionIntro
          align="center"
          eyebrow={c.themesEyebrow}
          titleLines={[c.themesTitle1, c.themesTitle2]}
        />
        <div className="mx-auto mt-14 grid max-w-4xl gap-px overflow-hidden rounded-sm border border-pd-gold-muted/20 bg-pd-gold-muted/20 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((theme, i) => (
            <Reveal
              key={theme}
              delay={(i % 3) * 0.06}
              className="flex items-center gap-3 bg-pd-night-2 px-6 py-6"
            >
              <span className="font-display text-sm font-semibold text-pd-gold-soft">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-sm font-medium text-pd-sand">{theme}</span>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2} className="mt-12 flex justify-center">
          <Magnetic className="inline-flex">
            <GoldButton to="/peace-days/programme" variant="outline" size="lg">
              {c.seeFullProgram}
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </GoldButton>
          </Magnetic>
        </Reveal>
      </Section>

      {/* ============ INVITÉS DE MARQUE ============ */}
      <div className="border-t border-pd-gold-muted/15 bg-pd-night-2/40">
        <Guests />
      </div>

      {/* ============ RETOUR EN IMAGES ============ */}
      <Gallery />

      {/* ============ RÉSERVATION GALA ============ */}
      <div className="border-t border-pd-gold-muted/15">
        <ReservationGala />
      </div>

      {/* ============ CTA ============ */}
      <CTASection
        eyebrow={c.ctaEyebrow}
        titleLines={[c.ctaTitle1, c.ctaTitle2]}
        text={c.ctaText}
        photo="gala"
        to="/peace-days#participer"
      />
    </>
  )
}
