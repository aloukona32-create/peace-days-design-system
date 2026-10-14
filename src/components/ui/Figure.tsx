import { useState } from 'react'
import { cn } from '../../lib/utils'

type FigureProps = {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  /** Voile nuit par-dessus l’image (pour poser du texte) */
  overlay?: boolean | 'strong'
  /** Ratio via classe Tailwind, ex. aspect-[4/3] */
  ratio?: string
  children?: React.ReactNode
}

/**
 * Cadre image posé sur un dégradé nuit/or : si la photo ne charge pas, le
 * bloc reste élégant. Overlay optionnel pour superposer du texte.
 */
export function Figure({
  src,
  alt,
  className,
  imgClassName,
  overlay = false,
  ratio,
  children,
}: FigureProps) {
  const [ok, setOk] = useState(true)
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-pd-night-2 bg-radial-gold',
        ratio,
        className,
      )}
    >
      {ok && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setOk(false)}
          className={cn(
            'h-full w-full object-cover transition-transform duration-700 ease-premium',
            imgClassName,
          )}
        />
      )}
      {overlay && (
        <div
          aria-hidden="true"
          className={cn(
            'absolute inset-0',
            overlay === 'strong'
              ? 'bg-gradient-to-t from-pd-night via-pd-night/70 to-pd-night/20'
              : 'bg-gradient-to-t from-pd-night/90 via-pd-night/30 to-transparent',
          )}
        />
      )}
      {children}
    </div>
  )
}
