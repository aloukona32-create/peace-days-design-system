import { useState } from 'react'
import { cn } from '../../lib/utils'

type ImageBackgroundProps = {
  /** Source image (mp4 non supporté — fond statique assumé). */
  src: string
  /** Texte alternatif ; `''` si l'image est purement décorative. */
  alt?: string
  className?: string
  /** Opacité de l'image (le voile nuit est géré par le parent). */
  opacityClassName?: string
  /** `srcset` optionnel pour servir une image plus légère sur mobile. */
  srcSet?: string
  sizes?: string
}

/**
 * Fond image plein écran, en `object-cover`. Décoratif par défaut
 * (`aria-hidden` + `alt=""`), il disparaît proprement si l'image échoue et
 * laisse le fond nuit du conteneur — donc jamais d'écran noir.
 *
 * Remplace l'ancien `VideoBackground` : le hero est désormais une image fixe,
 * sans téléchargement de boucle vidéo ni décodage GPU continu.
 */
export function ImageBackground({
  src,
  alt = '',
  className,
  opacityClassName = 'opacity-60',
  srcSet,
  sizes,
}: ImageBackgroundProps) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={cn('absolute inset-0 overflow-hidden bg-pd-night', className)}>
      {!failed && (
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          aria-hidden={alt ? undefined : true}
          // Le hero est l'élément LCP : chargement immédiat et prioritaire.
          loading="eager"
          fetchPriority="high"
          decoding="async"
          onError={() => setFailed(true)}
          className={cn('absolute inset-0 h-full w-full object-cover', opacityClassName)}
        />
      )}
    </div>
  )
}