import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, UserPlus, LogIn } from 'lucide-react'
import { useSession } from '../../lib/useSession'
import { useContent } from '../../i18n/content'
import { useT } from '../../i18n/useT'
import { LOCALES, LOCALE_LABELS, LOCALE_NAMES } from '../../i18n/config'
import { Magnetic, useLenisInstance } from '../motion'
import { GoldButton } from '../ui/GoldButton'
import { MEDIA } from '../../lib/images'
import { cn } from '../../lib/utils'

/**
 * Clic sur un lien de nav pointant déjà vers la page courante : au lieu de ne
 * rien faire (React Router ignore une navigation identique, ce qui donne un
 * bouton « mort »), on remonte doucement en haut de page.
 */
function useSameRouteScrollTop() {
  const { pathname } = useLocation()
  const lenis = useLenisInstance()
  return (to: string) => (e: React.MouseEvent) => {
    if (to !== pathname) return
    e.preventDefault()
    if (lenis) lenis.scrollTo(0, { duration: 1 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

/** Pastille avatar (initiale de l'e-mail) menant à l'espace membre. */
function AvatarLink({ email, onClick }: { email: string; onClick?: () => void }) {
  const { t } = useT()
  const initial = (email.charAt(0) || 'M').toUpperCase()
  return (
    <Link
      to="/compte"
      onClick={onClick}
      aria-label={t('header.myspace')}
      title={t('header.myspace')}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-royal font-display text-sm font-semibold text-pd-ink ring-1 ring-inset ring-pd-gold-bright/60 shadow-[0_8px_24px_-10px_rgba(201,162,39,0.7)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
    >
      {initial}
    </Link>
  )
}

export function Wordmark({ onClick }: { onClick?: () => void }) {
  const { t } = useT()
  const sameRouteScrollTop = useSameRouteScrollTop()
  return (
    <Link
      to="/"
      onClick={(e) => {
        sameRouteScrollTop('/')(e)
        onClick?.()
      }}
      className="group flex items-center gap-3"
      aria-label="Doggo Management"
    >
      <img
        src={MEDIA.logo}
        alt=""
        aria-hidden="true"
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 rounded-full drop-shadow-[0_4px_14px_rgba(201,162,39,0.25)] transition-transform duration-300 ease-premium group-hover:scale-105"
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-semibold tracking-tight text-pd-sand transition-colors group-hover:text-pd-gold-bright">
          Doggo Management
        </span>
        <span className="mt-0.5 text-[0.6rem] font-semibold uppercase tracking-label text-pd-gold-soft/80">
          Peace Days · {t('footer.eyebrow')}
        </span>
      </span>
    </Link>
  )
}

function LangSelector({ className }: { className?: string }) {
  const { locale, setLocale, t } = useT()
  return (
    <div className={cn('flex items-center gap-1 text-xs font-semibold', className)} role="group" aria-label={t('lang.label')}>
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          title={t('lang.switchTo', { lang: LOCALE_NAMES[l] })}
          aria-pressed={locale === l}
          className={cn(
            'rounded-full px-2 py-1 tracking-wide transition-colors',
            locale === l ? 'bg-pd-gold/15 text-pd-gold-bright' : 'text-pd-sand-dim hover:text-pd-sand',
          )}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  )
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { session } = useSession()
  const { NAV } = useContent()
  const { t } = useT()
  const email = session?.user?.email ?? ''
  const sameRouteScrollTop = useSameRouteScrollTop()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-premium',
          scrolled
            ? 'border-b border-pd-gold-muted/20 bg-pd-night/80 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="container-pd flex h-[var(--pd-header-h)] items-center justify-between gap-6">
          <Wordmark />

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigation principale">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={sameRouteScrollTop(item.to)}
                className={({ isActive }) =>
                  cn(
                    'group relative text-sm font-medium transition-colors',
                    isActive ? 'text-pd-sand' : 'text-pd-sand-dim hover:text-pd-sand',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.flagship && (
                      <span className="mr-1.5 inline-block h-1.5 w-1.5 -translate-y-px rounded-full bg-pd-gold align-middle" />
                    )}
                    {item.label}
                    <span
                      className={cn(
                        'absolute -bottom-1.5 left-0 h-px bg-gold-line transition-all duration-500 ease-premium',
                        isActive ? 'w-full' : 'w-0 group-hover:w-full',
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LangSelector className="hidden sm:flex" />
            {session ? (
              <AvatarLink email={email} />
            ) : (
              <>
                <Link
                  to="/connexion"
                  className="hidden items-center gap-1.5 text-sm font-medium text-pd-sand-dim transition-colors hover:text-pd-sand sm:inline-flex"
                >
                  <LogIn className="h-4 w-4" /> {t('header.login')}
                </Link>
                <Magnetic className="hidden shrink-0 sm:inline-flex">
                  <GoldButton to="/inscription" size="sm" className="shrink-0 whitespace-nowrap">
                    <UserPlus className="h-4 w-4" /> {t('header.signup')}
                  </GoldButton>
                </Magnetic>
              </>
            )}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-pd-sand lg:hidden"
              aria-label={open ? t('header.menuClose') : t('header.menuOpen')}
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-pd-night/98 backdrop-blur-2xl lg:hidden"
          >
            <div className="bg-grain pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden="true" />
            <div className="relative flex flex-1 flex-col justify-center px-8">
              <nav className="flex flex-col gap-1" aria-label="Navigation mobile">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={(e) => {
                        sameRouteScrollTop(item.to)(e)
                        setOpen(false)
                      }}
                      className={({ isActive }) =>
                        cn(
                          'flex items-baseline gap-3 py-2 font-display text-3xl font-semibold transition-colors',
                          isActive ? 'text-pd-gold-bright' : 'text-pd-sand hover:text-pd-gold-soft',
                        )
                      }
                    >
                      <span className="text-xs font-semibold tracking-label text-pd-gold-muted">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {item.label}
                      {item.flagship && (
                        <span className="h-1.5 w-1.5 self-center rounded-full bg-pd-gold" />
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + NAV.length * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mt-10 flex flex-col gap-5"
              >
                <div className="hairline" />
                <div className="flex items-center justify-between gap-3">
                  <LangSelector />
                  {session ? (
                    <div className="flex items-center gap-3">
                      <AvatarLink email={email} onClick={() => setOpen(false)} />
                      <GoldButton to="/compte" size="md" onClick={() => setOpen(false)}>
                        {t('header.myspace')}
                      </GoldButton>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Link
                        to="/connexion"
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-pd-sand-dim transition-colors hover:text-pd-sand"
                      >
                        <LogIn className="h-4 w-4" /> {t('header.login')}
                      </Link>
                      <GoldButton to="/inscription" size="md" onClick={() => setOpen(false)}>
                        <UserPlus className="h-4 w-4" /> {t('header.signup')}
                      </GoldButton>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
