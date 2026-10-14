import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useContent } from '../i18n/content'
import { useT } from '../i18n/useT'
import { resolveImage, MEDIA } from '../lib/images'
import { Reveal, TextReveal, Magnetic } from '../components/motion'
import { GoldButton } from '../components/ui/GoldButton'
import {
  Countdown,
  Section,
  SectionIntro,
  ExperienceCard,
  Marquee,
  StatsBand,
  CTASection,
  ImageBackground,
  VoixDeLaPaix,
} from '../components/site'
import { Figure } from '../components/ui/Figure'

const COPY = {
  fr: {
    presents: 'présente',
    editionTitle: 'UAE 2027',
    register: 'S’inscrire',
    discoverProgram: 'Découvrir le programme',
    opening: 'Ouverture',
    scroll: 'Défiler',
    patronageLabel: 'Sous le signe du dialogue & de la coopération',
    doggoTitle1: 'Concevoir des',
    doggoTitle2: 'rendez-vous qui',
    doggoTitle3: 'rapprochent les peuples.',
    doggoIntro: 'Organisateur permanent de rencontres internationales, Doggo Management place la diplomatie culturelle et économique au cœur de chaque événement. Peace Days Dubaï 2027 en est aujourd’hui le phare.',
    discoverDoggo: 'Découvrir Doggo Management',
    fiveEyebrow: 'Une semaine, cinq rendez-vous',
    fiveTitle1: 'Les temps forts',
    fiveTitle2: 'de Peace Days 2027.',
    exploreFull: 'Explorer l’expérience complète',
    statsEyebrow: 'Une portée internationale',
    statsTitle1: 'La paix, en actes.',
    statsIntro: 'Des cibles pensées pour transformer les intentions en rencontres concrètes, du continent africain au Golfe.',
    refEyebrow: 'Preuves avant promesses',
    refTitle1: 'Une crédibilité',
    refTitle2: 'qui se démontre.',
    refIntro: 'Des rencontres au plus haut niveau, un ancrage culturel fort et un réseau diplomatique actif.',
    ctaEyebrow: 'Dubaï · 18 — 25 janvier 2027',
    ctaTitle1: 'Prenez part à',
    ctaTitle2: 'la semaine de la paix.',
    ctaText: 'Exposants, décideurs, artistes, institutions et publics : rejoignez un rendez-vous international unique.',
  },
  en: {
    presents: 'presents',
    editionTitle: 'UAE 2027',
    register: 'Register',
    discoverProgram: 'Explore the program',
    opening: 'Opening',
    scroll: 'Scroll',
    patronageLabel: 'Under the banner of dialogue & cooperation',
    doggoTitle1: 'Designing',
    doggoTitle2: 'gatherings that',
    doggoTitle3: 'bring peoples together.',
    doggoIntro: 'A permanent organizer of international gatherings, Doggo Management places cultural and economic diplomacy at the heart of every event. Peace Days Dubai 2027 is today its flagship.',
    discoverDoggo: 'Discover Doggo Management',
    fiveEyebrow: 'One week, five gatherings',
    fiveTitle1: 'The highlights',
    fiveTitle2: 'of Peace Days 2027.',
    exploreFull: 'Explore the full experience',
    statsEyebrow: 'An international reach',
    statsTitle1: 'Peace, in action.',
    statsIntro: 'Targets designed to turn intentions into concrete encounters, from the African continent to the Gulf.',
    refEyebrow: 'Proof before promises',
    refTitle1: 'Credibility',
    refTitle2: 'that proves itself.',
    refIntro: 'High-level encounters, a strong cultural anchoring and an active diplomatic network.',
    ctaEyebrow: 'Dubai · January 18 — 25, 2027',
    ctaTitle1: 'Take part in',
    ctaTitle2: 'the week of peace.',
    ctaText: 'Exhibitors, decision-makers, artists, institutions and audiences: join a unique international gathering.',
  },
  ar: {
    presents: 'يقدّم',
    editionTitle: '2027 الإمارات',
    register: 'سجّل الآن',
    discoverProgram: 'اكتشف البرنامج',
    opening: 'الافتتاح',
    scroll: 'مرّر',
    patronageLabel: 'تحت شعار الحوار والتعاون',
    doggoTitle1: 'تصميم',
    doggoTitle2: 'لقاءات',
    doggoTitle3: 'تقرّب بين الشعوب.',
    doggoIntro: 'بوصفها منظِّمًا دائمًا للقاءات الدولية، تضع Doggo Management الدبلوماسية الثقافية والاقتصادية في صميم كل حدث. وتُعدّ Peace Days دبي 2027 اليوم منارتها.',
    discoverDoggo: 'اكتشف Doggo Management',
    fiveEyebrow: 'أسبوع واحد، خمسة لقاءات',
    fiveTitle1: 'أبرز لحظات',
    fiveTitle2: 'Peace Days 2027.',
    exploreFull: 'استكشف التجربة الكاملة',
    statsEyebrow: 'امتداد دولي',
    statsTitle1: 'السلام، فِعلًا.',
    statsIntro: 'أهداف مصمّمة لتحويل النوايا إلى لقاءات ملموسة، من القارة الأفريقية إلى الخليج.',
    refEyebrow: 'البرهان قبل الوعود',
    refTitle1: 'مصداقية',
    refTitle2: 'تُثبت نفسها.',
    refIntro: 'لقاءات على أعلى المستويات، وتجذّر ثقافي قوي، وشبكة دبلوماسية نشطة.',
    ctaEyebrow: 'دبي · 18 — 25 يناير 2027',
    ctaTitle1: 'شارك في',
    ctaTitle2: 'أسبوع السلام.',
    ctaText: 'العارضون وصنّاع القرار والفنانون والمؤسسات والجمهور: انضموا إلى لقاء دولي فريد.',
  },
} as const

export default function Home() {
  const { EVENT, EXPERIENCES, ROLES, REFERENCES, PATRONAGES } = useContent()
  const { locale } = useT()
  const c = COPY[locale]
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <ImageBackground
          src={MEDIA.heroHome}
          sizes="100vw"
          className="-z-10"
          opacityClassName="opacity-55"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-night-fade" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-radial-gold" />

        <div className="container-pd pb-20 pt-40 sm:pb-28">
          <Reveal>
            <p className="eyebrow">{EVENT.organizer} · {c.presents}</p>
          </Reveal>
          <TextReveal
            lines={['Peace Days', c.editionTitle]}
            className="mt-6"
            lineClassName="font-display font-semibold leading-[0.95] text-pd-sand text-display-lg"
            delay={0.15}
          />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
            <Reveal delay={0.3} className="max-w-xl">
              <p className="text-lg leading-relaxed text-pd-sand-dim sm:text-xl">{EVENT.tagline}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Magnetic className="inline-flex">
                  <GoldButton to="/peace-days#participer" size="lg">
                    {c.register}
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </GoldButton>
                </Magnetic>
                <GoldButton to="/peace-days/programme" variant="outline" size="lg">
                  {c.discoverProgram}
                </GoldButton>
              </div>
            </Reveal>
            <Reveal delay={0.4} className="lg:justify-self-end">
              <p className="text-[0.7rem] font-semibold uppercase tracking-label text-pd-gold-soft/80">
                {c.opening} · {EVENT.datesLabel}
              </p>
              <Countdown targetISO={EVENT.startISO} className="mt-4" />
            </Reveal>
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"
        >
          <div className="flex flex-col items-center gap-2 text-pd-sand-dim/70">
            <span className="text-[0.6rem] font-semibold uppercase tracking-label">{c.scroll}</span>
            <ChevronDown className="h-4 w-4 animate-float-slow" />
          </div>
        </div>
      </section>
      {/* ============ PATRONAGES ============ */}
      <div className="border-y border-pd-gold-muted/15 bg-pd-night py-8">
        <p className="container-pd mb-6 text-center text-[0.7rem] font-semibold uppercase tracking-label text-pd-gold-muted">
          {c.patronageLabel}
        </p>
        <Marquee items={PATRONAGES} />
      </div>

      {/* ============ DOGGO — LE PHARE ============ */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <SectionIntro
              eyebrow="Doggo Management"
              titleLines={[c.doggoTitle1, c.doggoTitle2, c.doggoTitle3]}
              intro={c.doggoIntro}
            />
            <Reveal delay={0.2} className="mt-8">
              <Link
                to="/doggo"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-pd-gold-soft transition-colors hover:text-pd-gold-bright"
              >
                {c.discoverDoggo}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {ROLES.map((role, i) => (
              <Reveal key={role.no} delay={i * 0.1}>
                <div className="flex h-full flex-col rounded-sm border border-pd-gold-muted/25 bg-pd-night-2 p-5">
                  <span className="font-display text-sm font-semibold text-pd-gold-soft">{role.no}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-pd-sand">{role.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-pd-sand-dim">{role.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ============ LES 5 RENDEZ-VOUS ============ */}
      <Section className="border-t border-pd-gold-muted/15 bg-pd-night-2/40">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntro
            eyebrow={c.fiveEyebrow}
            titleLines={[c.fiveTitle1, c.fiveTitle2]}
          />
          <Reveal delay={0.15}>
            <Link
              to="/peace-days"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-pd-gold-soft transition-colors hover:text-pd-gold-bright"
            >
              {c.exploreFull}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERIENCES.map((exp, i) => (
            <Reveal key={exp.key} delay={(i % 3) * 0.08} className="h-full">
              <ExperienceCard exp={exp} className="h-full" />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ============ CHIFFRES D'IMPACT ============ */}
      <Section className="border-t border-pd-gold-muted/15">
        <SectionIntro
          align="center"
          eyebrow={c.statsEyebrow}
          titleLines={[c.statsTitle1]}
          intro={c.statsIntro}
        />
        <StatsBand className="mt-14" />
      </Section>

      {/* ============ RÉFÉRENCES ============ */}
      <Section className="border-t border-pd-gold-muted/15 bg-pd-night-2/40">
        <SectionIntro
          eyebrow={c.refEyebrow}
          titleLines={[c.refTitle1, c.refTitle2]}
          intro={c.refIntro}
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REFERENCES.map((ref, i) => (
            <Reveal key={ref.title} delay={(i % 3) * 0.08}>
              <article className="group relative overflow-hidden rounded-sm border border-pd-gold-muted/25">
                <Figure
                  src={resolveImage(ref, { w: 800, h: 1000 })}
                  alt={ref.title}
                  ratio="aspect-[4/5]"
                  overlay="strong"
                  imgClassName="group-hover:scale-105"
                >
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="text-[0.7rem] font-semibold uppercase tracking-label text-pd-gold-soft">
                      {ref.year}
                    </span>
                    <h3 className="mt-1 font-display text-lg font-semibold text-pd-sand">{ref.title}</h3>
                    <p className="mt-1 text-sm text-pd-sand-dim">{ref.place}</p>
                  </div>
                </Figure>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ============ VOIX DE LA PAIX ============ */}
      <VoixDeLaPaix />

      {/* ============ CTA FINAL ============ */}
      <CTASection
        eyebrow={c.ctaEyebrow}
        titleLines={[c.ctaTitle1, c.ctaTitle2]}
        text={c.ctaText}
        photo="dubaiNight"
      />
    </>
  )
}
