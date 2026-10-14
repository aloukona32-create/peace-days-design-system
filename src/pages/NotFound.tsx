import { ArrowLeft } from 'lucide-react'
import { Reveal, TextReveal } from '../components/motion'
import { GoldButton } from '../components/ui/GoldButton'
import { useT } from '../i18n/useT'

const COPY = {
  fr: {
    eyebrow: 'Erreur 404',
    title1: 'Cette page',
    title2: 's’est égarée.',
    text: 'Le chemin demandé n’existe pas ou a été déplacé. Revenons vers la paix.',
  },
  en: {
    eyebrow: 'Error 404',
    title1: 'This page',
    title2: 'has wandered off.',
    text: 'The requested path doesn’t exist or has been moved. Let’s return to peace.',
  },
  ar: {
    eyebrow: 'خطأ 404',
    title1: 'هذه الصفحة',
    title2: 'قد ضلّت الطريق.',
    text: 'المسار المطلوب غير موجود أو تم نقله. لنعُد إلى السلام.',
  },
} as const

export default function NotFound() {
  const { t, locale } = useT()
  const c = COPY[locale]
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden text-center">
      <div aria-hidden className="absolute inset-0 -z-10 bg-radial-gold" />
      <div className="container-pd">
        <Reveal>
          <p className="eyebrow justify-center">{c.eyebrow}</p>
        </Reveal>
        <TextReveal
          lines={[c.title1, c.title2]}
          className="mt-6"
          lineClassName="font-display font-semibold leading-[0.95] text-pd-sand text-display-md"
          delay={0.1}
        />
        <Reveal delay={0.3} className="mx-auto mt-6 max-w-md">
          <p className="text-lg leading-relaxed text-pd-sand-dim">
            {c.text}
          </p>
        </Reveal>
        <Reveal delay={0.4} className="mt-10">
          <GoldButton to="/" size="lg">
            <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
            {t('common.backHome')}
          </GoldButton>
        </Reveal>
      </div>
    </section>
  )
}
