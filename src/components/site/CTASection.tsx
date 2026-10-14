import { ArrowRight } from 'lucide-react'
import { img, PHOTOS, type PhotoKey } from '../../lib/images'
import { Reveal, TextReveal, Magnetic, ParallaxImage } from '../motion'
import { GoldButton } from '../ui/GoldButton'
import { cn } from '../../lib/utils'
import { useT } from '../../i18n/useT'

type CTAProps = {
  eyebrow?: string
  titleLines: string[]
  text?: string
  to?: string
  cta?: string
  photo?: PhotoKey
  className?: string
}

const COPY = {
  fr: { eyebrow: 'Rejoignez le mouvement', cta: 'S’inscrire à Peace Days 2027' },
  en: { eyebrow: 'Join the movement', cta: 'Register for Peace Days 2027' },
  ar: { eyebrow: 'انضمّ إلى الحركة', cta: 'سجّل في أيام السلام 2027' },
} as const

/** Section d'appel à l'action pleine largeur, photo en parallaxe + voile nuit. */
export function CTASection({
  eyebrow,
  titleLines,
  text,
  to = '/peace-days#participer',
  cta,
  photo = 'dubaiNight',
  className,
}: CTAProps) {
  const { locale } = useT()
  const c = COPY[locale]
  const eyebrowLabel = eyebrow ?? c.eyebrow
  const ctaLabel = cta ?? c.cta
  return (
    <section className={cn('relative isolate overflow-hidden', className)}>
      <ParallaxImage
        src={img(PHOTOS[photo], { w: 2000, h: 1100 })}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full"
        imgClassName="opacity-40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-pd-night via-pd-night/80 to-pd-night"
      />

      <div className="container-pd flex flex-col items-center py-28 text-center sm:py-36">
        <Reveal>
          <p className="eyebrow justify-center">{eyebrowLabel}</p>
        </Reveal>
        <TextReveal
          lines={titleLines}
          className="mt-6"
          lineClassName="font-display text-4xl font-semibold leading-[1.05] text-pd-sand sm:text-display-md"
        />
        {text && (
          <Reveal delay={0.15} className="mt-6 max-w-xl">
            <p className="text-lg leading-relaxed text-pd-sand-dim">{text}</p>
          </Reveal>
        )}
        <Reveal delay={0.25} className="mt-10">
          <Magnetic className="inline-flex">
            <GoldButton to={to} size="lg">
              {ctaLabel}
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </GoldButton>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  )
}
