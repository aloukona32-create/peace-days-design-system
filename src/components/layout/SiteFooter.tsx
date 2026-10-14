import { Link } from 'react-router-dom'
import { useContent } from '../../i18n/content'
import { useT } from '../../i18n/useT'
import { useSiteSettings } from '../../lib/siteSettings'
import { Reveal, GoldLine, Magnetic } from '../motion'
import { GoldButton } from '../ui/GoldButton'
import { NewsletterForm } from '../site/NewsletterForm'

export function SiteFooter() {
  const { EVENT, NAV } = useContent()
  const { t } = useT()
  const { settings } = useSiteSettings()
  const CONTACT = [
    { label: t('footer.cOrg'), value: EVENT.organizer },
    { label: t('footer.cEdition'), value: `${EVENT.name} · ${EVENT.edition}` },
    { label: t('footer.cDates'), value: EVENT.datesLabel },
    { label: t('footer.cLieu'), value: EVENT.location },
  ]
  return (
    <footer className="relative overflow-hidden border-t border-pd-gold-muted/20 bg-pd-night-2">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gold-line opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-radial-gold opacity-40 blur-2xl"
      />

      <div className="container-pd relative py-20">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Signature + CTA */}
          <Reveal className="max-w-md">
            <img
              src="/media/peace-days-emblem.png"
              alt="Peace Days International"
              width={64}
              height={64}
              className="mb-5 h-16 w-16 drop-shadow-[0_6px_20px_rgba(201,162,39,0.28)]"
            />
            <p className="eyebrow">{t('footer.eyebrow')}</p>
            <p className="mt-5 font-display text-3xl font-semibold leading-tight text-pd-sand">
              {t('footer.headlineA')}
              <span className="text-gold-sheen">{t('footer.headlineB')}</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-pd-sand-dim">{EVENT.tagline}</p>
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-label text-pd-gold-muted">
                {t('footer.newsletter')}
              </p>
              <NewsletterForm source="footer" />
            </div>
            <Magnetic className="mt-7 inline-flex">
              <GoldButton to="/peace-days" size="md">
                {t('footer.cta')}
              </GoldButton>
            </Magnetic>
          </Reveal>

          {/* Navigation */}
          <Reveal delay={0.08}>
            <p className="text-xs font-semibold uppercase tracking-label text-pd-gold-muted">
              {t('footer.nav')}
            </p>
            <ul className="mt-5 space-y-3">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="group inline-flex items-center gap-2 text-sm text-pd-sand-dim transition-colors hover:text-pd-sand"
                  >
                    <span className="h-px w-0 bg-pd-gold transition-all duration-300 group-hover:w-4" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Coordonnées */}
          <Reveal delay={0.16}>
            <p className="text-xs font-semibold uppercase tracking-label text-pd-gold-muted">
              {t('footer.repere')}
            </p>
            <dl className="mt-5 space-y-4">
              {CONTACT.map((c) => (
                <div key={c.label}>
                  <dt className="text-[0.7rem] uppercase tracking-wide text-pd-sand-dim/70">
                    {c.label}
                  </dt>
                  <dd className="mt-0.5 text-sm text-pd-sand">{c.value}</dd>
                </div>
              ))}
              {settings.contactEmail && (
                <div>
                  <dt className="text-[0.7rem] uppercase tracking-wide text-pd-sand-dim/70">E-mail</dt>
                  <dd className="mt-0.5 text-sm text-pd-sand">
                    <a className="hover:text-pd-gold-bright" href={`mailto:${settings.contactEmail}`}>
                      {settings.contactEmail}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </Reveal>
        </div>

        <GoldLine className="mt-16" />

        <div className="mt-8 flex flex-col items-start justify-between gap-4 text-xs text-pd-sand-dim/70 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {EVENT.organizer}. {t('footer.rights')}
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-pd-emerald" />
            {t('footer.forPeace')}
          </p>
        </div>
      </div>
    </footer>
  )
}
