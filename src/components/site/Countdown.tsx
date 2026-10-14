import { useEffect, useState } from 'react'
import { cn } from '../../lib/utils'
import { useT } from '../../i18n/useT'

type Parts = { days: number; hours: number; minutes: number; seconds: number }

function diff(target: number): Parts {
  const ms = Math.max(0, target - Date.now())
  const s = Math.floor(ms / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

const UNITS: (keyof Parts)[] = ['days', 'hours', 'minutes', 'seconds']

const COPY = {
  fr: { days: 'jours', hours: 'heures', minutes: 'minutes', seconds: 'secondes' },
  en: { days: 'days', hours: 'hours', minutes: 'minutes', seconds: 'seconds' },
  ar: { days: 'أيام', hours: 'ساعات', minutes: 'دقائق', seconds: 'ثوانٍ' },
} as const

/** Compte à rebours jusqu'à l'ouverture (ISO). Élégant, tabulaire, monochrome or. */
export function Countdown({ targetISO, className }: { targetISO: string; className?: string }) {
  const target = new Date(targetISO).getTime()
  const [parts, setParts] = useState<Parts>(() => diff(target))
  const { locale } = useT()
  const c = COPY[locale]

  useEffect(() => {
    const id = setInterval(() => setParts(diff(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  return (
    <div className={cn('flex items-stretch gap-3 sm:gap-5', className)}>
      {UNITS.map((u, i) => (
        <div key={u} className="flex items-stretch gap-3 sm:gap-5">
          <div className="flex flex-col items-center">
            <span className="font-display text-3xl font-semibold tabular-nums text-pd-sand sm:text-5xl">
              {String(parts[u]).padStart(2, '0')}
            </span>
            <span className="mt-1 text-[0.6rem] font-semibold uppercase tracking-label text-pd-gold-soft/80 sm:text-[0.65rem]">
              {c[u]}
            </span>
          </div>
          {i < UNITS.length - 1 && (
            <span className="font-display text-3xl font-semibold text-pd-gold-muted/50 sm:text-5xl">:</span>
          )}
        </div>
      ))}
    </div>
  )
}
