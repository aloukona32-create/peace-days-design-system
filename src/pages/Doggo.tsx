import { useContent } from '../i18n/content'
import { useT } from '../i18n/useT'
import { img, PHOTOS, resolveImage } from '../lib/images'
import { Reveal, TextReveal, ParallaxImage } from '../components/motion'
import { Section, SectionIntro, CTASection } from '../components/site'
import { Figure } from '../components/ui/Figure'

const COPY = {
  fr: {
    heroAlt: 'Architecture contemporaine',
    heroEyebrow: 'Organisateur · Diplomatie culturelle & économique',
    heroText:
      'Nous concevons des rendez-vous internationaux où la culture, l’économie et la diplomatie se rencontrent — pour rapprocher les peuples et faire rayonner les territoires.',
    roleEyebrow: 'Notre rôle',
    roleTitle1: 'Concevoir. Connecter.',
    roleTitle2: 'Faire rayonner.',
    roleIntro: 'Trois gestes qui structurent chacune de nos rencontres internationales.',
    expertiseEyebrow: 'Notre expertise',
    expertiseTitle1: 'Six domaines,',
    expertiseTitle2: 'une même exigence.',
    refEyebrow: 'Références',
    refTitle1: 'Ce qui fonde',
    refTitle2: 'notre légitimité.',
    ctaEyebrow: 'Notre édition phare',
    ctaTitle1: 'Découvrez',
    ctaTitle2: 'Peace Days Dubaï 2027.',
    ctaText:
      'Le rendez-vous international qui incarne aujourd’hui notre vision de la diplomatie culturelle.',
  },
  en: {
    heroAlt: 'Contemporary architecture',
    heroEyebrow: 'Organiser · Cultural & economic diplomacy',
    heroText:
      'We design international gatherings where culture, economy and diplomacy meet — to bring peoples closer together and give territories global reach.',
    roleEyebrow: 'Our role',
    roleTitle1: 'Design. Connect.',
    roleTitle2: 'Amplify.',
    roleIntro: 'Three gestures that shape each of our international gatherings.',
    expertiseEyebrow: 'Our expertise',
    expertiseTitle1: 'Six domains,',
    expertiseTitle2: 'one shared standard.',
    refEyebrow: 'References',
    refTitle1: 'What underpins',
    refTitle2: 'our legitimacy.',
    ctaEyebrow: 'Our flagship edition',
    ctaTitle1: 'Discover',
    ctaTitle2: 'Peace Days Dubai 2027.',
    ctaText:
      'The international gathering that embodies our vision of cultural diplomacy today.',
  },
  ar: {
    heroAlt: 'عمارة معاصرة',
    heroEyebrow: 'المنظّم · دبلوماسية ثقافية واقتصادية',
    heroText:
      'نصمّم مواعيد دولية تلتقي فيها الثقافة والاقتصاد والدبلوماسية — لتقريب الشعوب وإبراز حضور الأقاليم.',
    roleEyebrow: 'دورنا',
    roleTitle1: 'نصمّم. نربط.',
    roleTitle2: 'ونُبرز.',
    roleIntro: 'ثلاث خطوات تُنظّم كلّ لقاء من لقاءاتنا الدولية.',
    expertiseEyebrow: 'خبرتنا',
    expertiseTitle1: 'ستة مجالات،',
    expertiseTitle2: 'ومعيار واحد مشترك.',
    refEyebrow: 'مراجع',
    refTitle1: 'ما يرسّخ',
    refTitle2: 'شرعيتنا.',
    ctaEyebrow: 'نسختنا الأبرز',
    ctaTitle1: 'اكتشف',
    ctaTitle2: 'Peace Days دبي 2027.',
    ctaText:
      'الموعد الدولي الذي يجسّد اليوم رؤيتنا للدبلوماسية الثقافية.',
  },
} as const

export default function Doggo() {
  const { EXPERTISE, ROLES, REFERENCES } = useContent()
  const { locale } = useT()
  const c = COPY[locale]
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative isolate flex min-h-[80svh] flex-col justify-end overflow-hidden">
        <ParallaxImage
          src={img(PHOTOS.architecture, { w: 2200, h: 1400 })}
          alt={c.heroAlt}
          className="absolute inset-0 -z-10 h-full w-full"
          imgClassName="opacity-55"
          amount={10}
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-night-fade" />
        <div className="container-pd pb-20 pt-40">
          <Reveal>
            <p className="eyebrow">{c.heroEyebrow}</p>
          </Reveal>
          <TextReveal
            lines={['Doggo Management']}
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
      {/* ============ NOTRE RÔLE ============ */}
      <Section>
        <SectionIntro
          eyebrow={c.roleEyebrow}
          titleLines={[c.roleTitle1, c.roleTitle2]}
          intro={c.roleIntro}
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {ROLES.map((role, i) => (
            <Reveal key={role.no} delay={i * 0.1}>
              <article className="group h-full overflow-hidden rounded-sm border border-pd-gold-muted/25 bg-pd-night-2">
                <Figure
                  src={resolveImage(role, { w: 800, h: 520 })}
                  alt={role.title}
                  ratio="aspect-[16/10]"
                  overlay
                  imgClassName="group-hover:scale-105"
                >
                  <span className="absolute left-5 top-5 font-display text-sm font-semibold text-pd-gold-soft">
                    {role.no}
                  </span>
                </Figure>
                <div className="p-6">
                  <h3 className="font-display text-2xl font-semibold text-pd-sand">{role.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-pd-sand-dim">{role.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ============ EXPERTISE ============ */}
      <Section className="border-t border-pd-gold-muted/15 bg-pd-night-2/40">
        <SectionIntro
          eyebrow={c.expertiseEyebrow}
          titleLines={[c.expertiseTitle1, c.expertiseTitle2]}
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERTISE.map((ex, i) => (
            <Reveal
              key={ex.title}
              delay={(i % 3) * 0.08}
              className="group flex h-full flex-col rounded-sm border border-pd-gold-muted/25 bg-pd-night p-6 transition-colors hover:border-pd-gold/50"
            >
              <span className="font-display text-sm font-semibold text-pd-gold-soft">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-display text-xl font-semibold text-pd-sand">{ex.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-pd-sand-dim">{ex.text}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ============ RÉFÉRENCES ============ */}
      <Section className="border-t border-pd-gold-muted/15">
        <SectionIntro eyebrow={c.refEyebrow} titleLines={[c.refTitle1, c.refTitle2]} />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {REFERENCES.map((ref, i) => (
            <Reveal
              key={ref.title}
              delay={(i % 3) * 0.07}
              className="flex items-start gap-4 rounded-sm border border-pd-gold-muted/20 bg-pd-night-2 p-5"
            >
              <span className="font-display text-sm font-semibold text-pd-gold-soft">{ref.year}</span>
              <div>
                <h3 className="font-display text-base font-semibold text-pd-sand">{ref.title}</h3>
                <p className="mt-1 text-sm text-pd-sand-dim">{ref.place}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ============ CTA ============ */}
      <CTASection
        eyebrow={c.ctaEyebrow}
        titleLines={[c.ctaTitle1, c.ctaTitle2]}
        text={c.ctaText}
        photo="dubaiSunset"
      />
    </>
  )
}
