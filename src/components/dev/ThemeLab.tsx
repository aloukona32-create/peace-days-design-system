import { useEffect, useState } from 'react'
import { Palette, X, Check } from 'lucide-react'
import { cn } from '../../lib/utils'

type ThemeKey =
  | 'nuit'
  | 'indigo'
  | 'aubergine'
  | 'sarcelle'
  | 'emeraude'
  | 'bordeaux'
  | 'espresso'
  | 'ivoire'

const THEMES: { key: ThemeKey; label: string; deep: string }[] = [
  { key: 'nuit', label: 'Nuit (réf.)', deep: '#080E1A' },
  { key: 'indigo', label: 'Indigo', deep: '#0A0A1E' },
  { key: 'aubergine', label: 'Aubergine', deep: '#120A1B' },
  { key: 'sarcelle', label: 'Sarcelle', deep: '#05131A' },
  { key: 'emeraude', label: 'Émeraude', deep: '#07140F' },
  { key: 'bordeaux', label: 'Bordeaux', deep: '#16090C' },
  { key: 'espresso', label: 'Espresso', deep: '#150E08' },
  { key: 'ivoire', label: 'Ivoire (clair)', deep: '#FAF8F2' },
]

const STORAGE_KEY = 'pd-theme'

function applyTheme(key: ThemeKey) {
  document.documentElement.dataset.theme = key
}

/**
 * Banc d'essai (temporaire) : sélecteur flottant pour tester les fonds
 * couleur mixés à l'or. Le choix est mémorisé (localStorage) et survit au
 * rechargement. « Nuit » reste la référence du cahier des charges.
 */
export function ThemeLab() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<ThemeKey>('nuit')

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as ThemeKey) || 'nuit'
    setActive(stored)
    applyTheme(stored)
  }, [])

  function choose(key: ThemeKey) {
    setActive(key)
    applyTheme(key)
    localStorage.setItem(STORAGE_KEY, key)
  }

  // PLACEHOLDER_RENDER
  return (
    <div className="fixed bottom-4 left-4 z-[120] print:hidden">
      {open ? (
        <div className="w-60 rounded-lg border border-pd-gold-muted/40 bg-pd-night-2/95 p-3 shadow-lift backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[0.7rem] font-semibold uppercase tracking-label text-pd-gold-soft">
              Banc d'essai · fond
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le banc d'essai"
              className="inline-flex h-6 w-6 items-center justify-center rounded-sm text-pd-sand-dim transition-colors hover:text-pd-sand"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <ul className="flex flex-col gap-1">
            {THEMES.map((t) => (
              <li key={t.key}>
                <button
                  type="button"
                  onClick={() => choose(t.key)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-sm px-2 py-1.5 text-left text-sm transition-colors',
                    active === t.key
                      ? 'bg-pd-gold/15 text-pd-gold-bright'
                      : 'text-pd-sand-dim hover:bg-pd-night-3 hover:text-pd-sand',
                  )}
                >
                  <span
                    className="h-5 w-5 shrink-0 rounded-full ring-1 ring-inset ring-pd-gold-bright/60"
                    style={{
                      background: `linear-gradient(135deg, ${t.deep} 0%, ${t.deep} 55%, #E7C86B 55%, #E7C86B 100%)`,
                    }}
                  />
                  <span className="flex-1">{t.label}</span>
                  {active === t.key && <Check className="h-4 w-4" />}
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.65rem] leading-snug text-pd-sand-dim/70">
            Outil de test — teste chaque fond avec l'or, puis dis-moi lequel garder.
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le banc d'essai des couleurs"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-pd-gold-muted/40 bg-pd-night-2/90 text-pd-gold-soft shadow-lift backdrop-blur-xl transition-colors hover:border-pd-gold-bright hover:text-pd-gold-bright"
        >
          <Palette className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
