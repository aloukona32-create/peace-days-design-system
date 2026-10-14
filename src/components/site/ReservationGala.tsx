import { useState, type FormEvent } from 'react'
import { UtensilsCrossed, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { GlassInput, GlassLabel, GlassSelect } from '../ui/GlassField'
import { GoldButton } from '../ui/GoldButton'
import { submitReservation } from '../../admin/data'
import { Reveal } from '../motion'
import { useT } from '../../i18n/useT'

const FORMULES = ['Couvert individuel', 'Table (10 couverts)', 'Table Diplomatique (12)', 'Table Prestige (12)']
const INIT = { nom: '', organisation: '', formule: FORMULES[0], couverts: 2 }

const COPY = {
  fr: {
    eyebrow: 'Dîner de Gala · Cérémonie de clôture',
    title: 'Réservez votre table au Dîner de Gala',
    intro: 'Soirée de gala et remise des Médailles de la Paix. Faites votre demande de réservation — notre équipe vous recontacte pour confirmer les modalités.',
    needName: 'Merci d’indiquer le nom du contact.',
    sendFail: 'L’envoi a échoué (connexion ou droits). Réessayez.',
    doneTitle: 'Demande de réservation reçue',
    doneText: 'Merci ! Notre équipe reviendra vers vous pour confirmer votre table et les modalités.',
    contactLabel: 'Nom du contact *',
    contactPh: 'Nom et prénom',
    orgLabel: 'Organisation',
    orgPh: 'Entreprise, délégation…',
    formuleLabel: 'Formule',
    couvertsLabel: 'Nombre de couverts',
    disclaimer: 'Réservation soumise à confirmation. Aucun paiement en ligne.',
    submit: 'Demander une réservation',
    sending: 'Envoi…',
    formules: {
      'Couvert individuel': 'Couvert individuel',
      'Table (10 couverts)': 'Table (10 couverts)',
      'Table Diplomatique (12)': 'Table Diplomatique (12)',
      'Table Prestige (12)': 'Table Prestige (12)',
    },
  },
  en: {
    eyebrow: 'Gala Dinner · Closing ceremony',
    title: 'Reserve your table at the Gala Dinner',
    intro: 'A gala evening and the presentation of the Peace Medals. Submit your reservation request — our team will contact you to confirm the details.',
    needName: 'Please provide the contact name.',
    sendFail: 'Submission failed (connection or permissions). Please try again.',
    doneTitle: 'Reservation request received',
    doneText: 'Thank you! Our team will get back to you to confirm your table and the details.',
    contactLabel: 'Contact name *',
    contactPh: 'First and last name',
    orgLabel: 'Organisation',
    orgPh: 'Company, delegation…',
    formuleLabel: 'Package',
    couvertsLabel: 'Number of seats',
    disclaimer: 'Reservation subject to confirmation. No online payment.',
    submit: 'Request a reservation',
    sending: 'Sending…',
    formules: {
      'Couvert individuel': 'Individual seat',
      'Table (10 couverts)': 'Table (10 seats)',
      'Table Diplomatique (12)': 'Diplomatic table (12)',
      'Table Prestige (12)': 'Prestige table (12)',
    },
  },
  ar: {
    eyebrow: 'عشاء الحفل · حفل الختام',
    title: 'احجز طاولتك في عشاء الحفل',
    intro: 'أمسية حفل وتقديم أوسمة السلام. قدّم طلب الحجز — سيتواصل معك فريقنا لتأكيد التفاصيل.',
    needName: 'يرجى إدخال اسم جهة الاتصال.',
    sendFail: 'تعذّر الإرسال (اتصال أو صلاحيات). حاول مرّة أخرى.',
    doneTitle: 'تم استلام طلب الحجز',
    doneText: 'شكرًا! سيعاود فريقنا التواصل معك لتأكيد طاولتك والتفاصيل.',
    contactLabel: 'اسم جهة الاتصال *',
    contactPh: 'الاسم واللقب',
    orgLabel: 'المؤسسة',
    orgPh: 'شركة، وفد…',
    formuleLabel: 'الصيغة',
    couvertsLabel: 'عدد المقاعد',
    disclaimer: 'الحجز خاضع للتأكيد. لا يوجد دفع عبر الإنترنت.',
    submit: 'طلب حجز',
    sending: 'جارٍ الإرسال…',
    formules: {
      'Couvert individuel': 'مقعد فردي',
      'Table (10 couverts)': 'طاولة (10 مقاعد)',
      'Table Diplomatique (12)': 'طاولة دبلوماسية (12)',
      'Table Prestige (12)': 'طاولة بريستيج (12)',
    },
  },
} as const

/**
 * Section « Dîner de Gala » : demande publique de réservation (insertion anon
 * dans public.reservations en statut 'demande', confirmée ensuite par l'admin).
 */
export function ReservationGala() {
  const [f, setF] = useState(INIT)
  const up = (patch: Partial<typeof INIT>) => setF((prev) => ({ ...prev, ...patch }))
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { locale } = useT()
  const c = COPY[locale]

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!f.nom.trim()) {
      setError(c.needName)
      return
    }
    const couverts = Math.max(1, Number(f.couverts) || 1)
    setBusy(true)
    try {
      await submitReservation({
        nom: f.nom.trim(),
        organisation: f.organisation.trim(),
        formule: f.formule,
        couverts,
      })
      setDone(true)
    } catch {
      setError(c.sendFail)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section id="reservation" className="relative scroll-mt-28 overflow-hidden py-24 sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-radial-gold" />
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-pd-emerald/8 blur-[130px]" />
      </div>

      <div className="container-pd relative">
        <div className="mx-auto max-w-2xl">
          <Reveal className="text-center">
            <p className="eyebrow justify-center">{c.eyebrow}</p>
            <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-pd-sand sm:text-4xl">
              {c.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pd-sand-dim">
              {c.intro}
            </p>
          </Reveal>

          <div className="mt-10">
            {done ? (
              <div className="rounded-3xl border border-pd-emerald/25 bg-pd-emerald/[0.06] p-8 text-center ring-1 ring-inset ring-white/[0.05] backdrop-blur-2xl">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pd-emerald/15 ring-1 ring-inset ring-pd-emerald/30">
                  <CheckCircle2 className="h-7 w-7 text-pd-emerald" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-pd-sand">{c.doneTitle}</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-pd-sand-dim">
                  {c.doneText}
                </p>
              </div>
            ) : (
              <form
                onSubmit={submit}
                className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.045] p-6 ring-1 ring-inset ring-white/[0.05] backdrop-blur-2xl sm:p-8"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <GlassLabel>{c.contactLabel}</GlassLabel>
                    <GlassInput icon={<UtensilsCrossed className="h-4 w-4" />} value={f.nom} onChange={(e) => up({ nom: e.target.value })} placeholder={c.contactPh} />
                  </label>
                  <label className="block">
                    <GlassLabel>{c.orgLabel}</GlassLabel>
                    <GlassInput value={f.organisation} onChange={(e) => up({ organisation: e.target.value })} placeholder={c.orgPh} />
                  </label>
                  <label className="block">
                    <GlassLabel>{c.formuleLabel}</GlassLabel>
                    <GlassSelect value={f.formule} onChange={(e) => up({ formule: e.target.value })}>
                      {FORMULES.map((x) => <option key={x} value={x}>{(c.formules as Record<string, string>)[x] ?? x}</option>)}
                    </GlassSelect>
                  </label>
                  <label className="block">
                    <GlassLabel>{c.couvertsLabel}</GlassLabel>
                    <GlassInput type="number" min={1} value={f.couverts} onChange={(e) => up({ couverts: Number(e.target.value) })} />
                  </label>
                </div>
                {error && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-pd-rose/30 bg-pd-rose/10 px-3.5 py-3 text-sm text-pd-rose">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-pd-sand-dim">{c.disclaimer}</p>
                  <GoldButton type="submit" size="lg" disabled={busy} className="w-full shrink-0 sm:w-auto">
                    {busy ? c.sending : c.submit}
                    {!busy && <Send className="h-4 w-4" />}
                  </GoldButton>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
