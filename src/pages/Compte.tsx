import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Save, Store, CheckCircle2, AlertTriangle, Loader2, ArrowRight } from 'lucide-react'
import { GlassInput, GlassLabel, GlassSelect, GoldButton } from '../components/ui'
import { Checkbox } from '../components/ui/Field'
import { useSession } from '../lib/useSession'
import { getMyProfile, updateMyProfile, signOut, type Profil } from '../lib/account'
import { submitCandidature } from '../admin/data'
import { useContent } from '../i18n/content'
import { useT } from '../i18n/useT'

const CATEGORIES = ['Artisanat', 'Agroalimentaire', 'Mode & Textile', 'Art & Design', 'Cosmétique', 'Services', 'Autre'] as const

const COPY = {
  fr: {
    hello: 'Bonjour',
    logout: 'Se déconnecter',
    memberFallback: 'Membre',
    profileUnavailableBefore: 'Profil indisponible. Vérifiez que le script ',
    profileUnavailableAfter: ' a bien été exécuté.',
    myProfile: 'Mon profil',
    profileSubtitle: 'Mettez à jour vos informations personnelles.',
    firstName: 'Prénom',
    firstNamePlaceholder: 'Amina',
    lastName: 'Nom',
    lastNamePlaceholder: 'Diallo',
    phone: 'Téléphone',
    country: 'Pays',
    selectPlaceholder: 'Sélectionnez…',
    organisation: 'Organisation',
    organisationPlaceholder: 'Structure, entreprise…',
    role: 'Fonction',
    rolePlaceholder: 'Rôle, titre…',
    bio: 'Bio',
    optional: '(optionnel)',
    bioPlaceholder: 'Quelques mots sur vous ou votre structure…',
    newsletterLabel: 'Recevoir la newsletter Peace Days.',
    save: 'Enregistrer',
    saving: 'Enregistrement…',
    saved: 'Enregistré',
    becomeExhibitor: 'Devenir exposant',
    exhibitorIntro: 'Déposez votre candidature pour tenir un stand au village des créateurs. Nous utilisons les informations de votre profil.',
    applicationSent: 'Candidature envoyée. Notre équipe reviendra vers vous par e-mail.',
    category: 'Catégorie',
    structureLabel: 'Structure :',
    countryLabel: 'Pays :',
    editFieldsHint: 'Modifiez ces champs dans « Mon profil » puis enregistrez.',
    submitApplication: 'Envoyer ma candidature',
    demandeMissingFields: 'Complétez votre organisation et votre pays dans le profil ci-dessus.',
    demandeFailed: 'L’envoi a échoué (connexion ou droits). Réessayez.',
    futureTitle: 'Peace Days Dubaï 2027',
    futureText: 'Votre espace évoluera avec l’événement : réservations, billets et engagements y seront rassemblés.',
    seeProgram: 'Voir le programme',
    categories: { 'Artisanat': 'Artisanat', 'Agroalimentaire': 'Agroalimentaire', 'Mode & Textile': 'Mode & Textile', 'Art & Design': 'Art & Design', 'Cosmétique': 'Cosmétique', 'Services': 'Services', 'Autre': 'Autre' },
  },
  en: {
    hello: 'Hello',
    logout: 'Sign out',
    memberFallback: 'Member',
    profileUnavailableBefore: 'Profile unavailable. Make sure the script ',
    profileUnavailableAfter: ' has been executed.',
    myProfile: 'My profile',
    profileSubtitle: 'Update your personal information.',
    firstName: 'First name',
    firstNamePlaceholder: 'Amina',
    lastName: 'Last name',
    lastNamePlaceholder: 'Diallo',
    phone: 'Phone',
    country: 'Country',
    selectPlaceholder: 'Select…',
    organisation: 'Organisation',
    organisationPlaceholder: 'Organisation, company…',
    role: 'Role',
    rolePlaceholder: 'Role, title…',
    bio: 'Bio',
    optional: '(optional)',
    bioPlaceholder: 'A few words about you or your organisation…',
    newsletterLabel: 'Receive the Peace Days newsletter.',
    save: 'Save',
    saving: 'Saving…',
    saved: 'Saved',
    becomeExhibitor: 'Become an exhibitor',
    exhibitorIntro: 'Apply to host a stand at the makers’ village. We use the information from your profile.',
    applicationSent: 'Application sent. Our team will get back to you by email.',
    category: 'Category',
    structureLabel: 'Organisation:',
    countryLabel: 'Country:',
    editFieldsHint: 'Edit these fields in “My profile” then save.',
    submitApplication: 'Submit my application',
    demandeMissingFields: 'Complete your organisation and country in the profile above.',
    demandeFailed: 'Submission failed (connection or permissions). Please try again.',
    futureTitle: 'Peace Days Dubai 2027',
    futureText: 'Your space will evolve with the event: bookings, tickets and commitments will be gathered here.',
    seeProgram: 'See the programme',
    categories: { 'Artisanat': 'Crafts', 'Agroalimentaire': 'Food & Agriculture', 'Mode & Textile': 'Fashion & Textile', 'Art & Design': 'Art & Design', 'Cosmétique': 'Cosmetics', 'Services': 'Services', 'Autre': 'Other' },
  },
  ar: {
    hello: 'مرحباً',
    logout: 'تسجيل الخروج',
    memberFallback: 'عضو',
    profileUnavailableBefore: 'الملف الشخصي غير متاح. تأكد من تنفيذ السكربت ',
    profileUnavailableAfter: ' بنجاح.',
    myProfile: 'ملفي الشخصي',
    profileSubtitle: 'حدّث معلوماتك الشخصية.',
    firstName: 'الاسم الأول',
    firstNamePlaceholder: 'أمينة',
    lastName: 'اسم العائلة',
    lastNamePlaceholder: 'ديالو',
    phone: 'الهاتف',
    country: 'الدولة',
    selectPlaceholder: 'اختر…',
    organisation: 'المؤسسة',
    organisationPlaceholder: 'جهة، شركة…',
    role: 'المنصب',
    rolePlaceholder: 'دور، لقب…',
    bio: 'نبذة',
    optional: '(اختياري)',
    bioPlaceholder: 'بضع كلمات عنك أو عن مؤسستك…',
    newsletterLabel: 'الاشتراك في نشرة Peace Days الإخبارية.',
    save: 'حفظ',
    saving: 'جارٍ الحفظ…',
    saved: 'تم الحفظ',
    becomeExhibitor: 'كن عارضاً',
    exhibitorIntro: 'قدّم طلبك للحصول على جناح في قرية المبدعين. نستخدم المعلومات الموجودة في ملفك الشخصي.',
    applicationSent: 'تم إرسال الطلب. سيتواصل معك فريقنا عبر البريد الإلكتروني.',
    category: 'الفئة',
    structureLabel: 'الجهة:',
    countryLabel: 'الدولة:',
    editFieldsHint: 'عدّل هذه الحقول في «ملفي الشخصي» ثم احفظ.',
    submitApplication: 'إرسال طلبي',
    demandeMissingFields: 'أكمل بيانات مؤسستك ودولتك في الملف الشخصي أعلاه.',
    demandeFailed: 'فشل الإرسال (اتصال أو صلاحيات). حاول مرة أخرى.',
    futureTitle: 'Peace Days دبي 2027',
    futureText: 'ستتطوّر مساحتك مع الحدث: ستُجمع هنا الحجوزات والتذاكر والالتزامات.',
    seeProgram: 'عرض البرنامج',
    categories: { 'Artisanat': 'الحرف اليدوية', 'Agroalimentaire': 'الأغذية والزراعة', 'Mode & Textile': 'الأزياء والنسيج', 'Art & Design': 'الفن والتصميم', 'Cosmétique': 'مستحضرات التجميل', 'Services': 'الخدمات', 'Autre': 'أخرى' },
  },
} as const

export default function Compte() {
  const navigate = useNavigate()
  const { session } = useSession()
  const email = session?.user?.email ?? ''
  const { t, locale } = useT()
  const c = COPY[locale]
  const { TYPES_COMPTE, COUNTRIES } = useContent()

  const [profil, setProfil] = useState<Profil | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Champs éditables du profil.
  const [p, setP] = useState({ prenom: '', nom: '', telephone: '', pays: '', organisation: '', fonction: '', bio: '', newsletter: false })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const upP = (patch: Partial<typeof p>) => setP((prev) => ({ ...prev, ...patch }))

  useEffect(() => {
    let alive = true
    getMyProfile()
      .then((row) => {
        if (!alive) return
        setProfil(row)
        if (row) setP({
          prenom: row.prenom ?? '', nom: row.nom ?? '', telephone: row.telephone ?? '',
          pays: row.pays ?? '', organisation: row.organisation ?? '', fonction: row.fonction ?? '',
          bio: row.bio ?? '', newsletter: row.newsletter,
        })
      })
      .catch((e) => alive && setLoadError(e instanceof Error ? e.message : 'Profil indisponible.'))
      .finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [])

  const logout = async () => { await signOut(); navigate('/', { replace: true }) }

  const saveProfil = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true); setSaved(false)
    try { await updateMyProfile(p); setSaved(true); setTimeout(() => setSaved(false), 2500) }
    catch { /* silencieux : message inline possible */ }
    finally { setSaving(false) }
  }

  // Demande « Devenir exposant » (candidature) pré-remplie depuis le profil.
  const [d, setD] = useState({ categorie: 'Artisanat' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [demandeErr, setDemandeErr] = useState<string | null>(null)

  const submitDemande = async (e: FormEvent) => {
    e.preventDefault()
    setDemandeErr(null)
    const structure = p.organisation.trim() || `${p.prenom} ${p.nom}`.trim()
    const contact = `${p.prenom} ${p.nom}`.trim() || email
    const pays = p.pays.trim()
    if (!structure || !pays) {
      setDemandeErr(c.demandeMissingFields)
      return
    }
    setSending(true)
    try {
      await submitCandidature({ structure, contact, email, pays, categorie: d.categorie })
      setSent(true)
    } catch {
      setDemandeErr(c.demandeFailed)
    } finally {
      setSending(false)
    }
  }

  const typeLabel = TYPES_COMPTE.find((t) => t.key === profil?.typeCompte)?.label ?? c.memberFallback
  const initials = `${p.prenom.charAt(0)}${p.nom.charAt(0)}`.toUpperCase() || (email.charAt(0).toUpperCase() || 'M')

  return (
    <section className="relative min-h-screen overflow-hidden pb-24 pt-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-radial-gold" />
        <div className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-pd-gold/8 blur-[130px]" />
      </div>

      <div className="container-pd relative">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-royal font-display text-xl font-semibold text-pd-ink ring-1 ring-inset ring-pd-gold-bright/60 shadow-[0_10px_30px_-12px_rgba(201,162,39,0.7)]">
              {initials}
            </span>
            <div>
              <p className="eyebrow">{t('header.myspace')}</p>
              <h1 className="font-display text-2xl font-semibold text-pd-sand sm:text-3xl">
                {c.hello}{p.prenom ? `, ${p.prenom}` : ''}
              </h1>
              <p className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-pd-sand-dim">
                {email}
                <span className="rounded-full border border-pd-gold/25 bg-pd-gold/10 px-2 py-0.5 text-xs font-medium text-pd-gold-bright">{typeLabel}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-pd-sand-dim backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:text-pd-sand hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.8)] active:scale-[0.97]"
          >
            <LogOut className="h-4 w-4" /> {c.logout}
          </button>
        </div>

        {loadError && !profil && (
          <div className="mt-8 flex items-start gap-2 rounded-2xl border border-pd-rose/40 bg-pd-rose/10 px-4 py-3 text-sm text-[#e08a83]">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{c.profileUnavailableBefore}<code>02_comptes.sql</code>{c.profileUnavailableAfter}</span>
          </div>
        )}

        {loading ? (
          <div className="mt-16 flex justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-pd-gold-bright" />
          </div>
        ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {/* Carte 1 — Profil éditable */}
            <form
              onSubmit={saveProfil}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-[0_40px_120px_-48px_rgba(0,0,0,0.9)] ring-1 ring-inset ring-white/[0.05] backdrop-blur-2xl sm:p-7"
            >
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4 text-pd-gold-bright" />
                <h2 className="font-display text-lg font-semibold text-pd-sand">{c.myProfile}</h2>
              </div>
              <p className="mt-1 text-sm text-pd-sand-dim">{c.profileSubtitle}</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <GlassLabel>{c.firstName}</GlassLabel>
                  <GlassInput value={p.prenom} onChange={(e) => upP({ prenom: e.target.value })} placeholder={c.firstNamePlaceholder} />
                </label>
                <label className="block">
                  <GlassLabel>{c.lastName}</GlassLabel>
                  <GlassInput value={p.nom} onChange={(e) => upP({ nom: e.target.value })} placeholder={c.lastNamePlaceholder} />
                </label>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <GlassLabel>{c.phone}</GlassLabel>
                  <GlassInput type="tel" value={p.telephone} onChange={(e) => upP({ telephone: e.target.value })} placeholder="+971 5X XXX XXXX" />
                </label>
                <label className="block">
                  <GlassLabel>{c.country}</GlassLabel>
                  <GlassSelect value={p.pays} onChange={(e) => upP({ pays: e.target.value })}>
                    <option value="" disabled>{c.selectPlaceholder}</option>
                    {COUNTRIES.map((country) => <option key={country} value={country}>{country}</option>)}
                  </GlassSelect>
                </label>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <GlassLabel>{c.organisation}</GlassLabel>
                  <GlassInput value={p.organisation} onChange={(e) => upP({ organisation: e.target.value })} placeholder={c.organisationPlaceholder} />
                </label>
                <label className="block">
                  <GlassLabel>{c.role}</GlassLabel>
                  <GlassInput value={p.fonction} onChange={(e) => upP({ fonction: e.target.value })} placeholder={c.rolePlaceholder} />
                </label>
              </div>

              <label className="mt-4 block">
                <GlassLabel>{c.bio} <span className="text-pd-sand-dim/60">{c.optional}</span></GlassLabel>
                <textarea
                  value={p.bio}
                  onChange={(e) => upP({ bio: e.target.value })}
                  rows={3}
                  placeholder={c.bioPlaceholder}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-pd-sand placeholder:text-pd-sand-dim/50 outline-none transition-colors focus:border-pd-gold-bright/50 focus:ring-1 focus:ring-pd-gold-bright/40"
                />
              </label>

              <div className="mt-4">
                <Checkbox id="p-newsletter" checked={p.newsletter} onChange={(e) => upP({ newsletter: e.target.checked })} label={c.newsletterLabel} />
              </div>

              <div className="mt-6 flex items-center gap-3">
                <GoldButton type="submit" size="md" disabled={saving}>
                  {saving ? c.saving : <>{c.save} <Save className="h-4 w-4" /></>}
                </GoldButton>
                {saved && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-[#7fd0aa]">
                    <CheckCircle2 className="h-4 w-4" /> {c.saved}
                  </span>
                )}
              </div>
            </form>

            {/* Carte 2 — Faire une demande (Devenir exposant) */}
            <div className="flex flex-col gap-6">
              <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-[0_40px_120px_-48px_rgba(0,0,0,0.9)] ring-1 ring-inset ring-white/[0.05] backdrop-blur-2xl sm:p-7">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-pd-gold-bright" />
                  <h2 className="font-display text-lg font-semibold text-pd-sand">{c.becomeExhibitor}</h2>
                </div>
                <p className="mt-1 text-sm text-pd-sand-dim">
                  {c.exhibitorIntro}
                </p>

                {sent ? (
                  <div className="mt-5 flex items-start gap-2 rounded-2xl border border-pd-emerald/30 bg-pd-emerald/12 px-4 py-3 text-sm text-[#7fd0aa]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{c.applicationSent}</span>
                  </div>
                ) : (
                  <form onSubmit={submitDemande} className="mt-5 space-y-4">
                    <label className="block">
                      <GlassLabel>{c.category}</GlassLabel>
                      <GlassSelect value={d.categorie} onChange={(e) => setD({ categorie: e.target.value })}>
                        {CATEGORIES.map((cat) => <option key={cat} value={cat}>{c.categories[cat]}</option>)}
                      </GlassSelect>
                    </label>

                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-xs text-pd-sand-dim">
                      <p><span className="text-pd-sand">{c.structureLabel}</span> {p.organisation.trim() || `${p.prenom} ${p.nom}`.trim() || '—'}</p>
                      <p className="mt-1"><span className="text-pd-sand">{c.countryLabel}</span> {p.pays.trim() || '—'}</p>
                      <p className="mt-1 text-pd-sand-dim/70">{c.editFieldsHint}</p>
                    </div>

                    {demandeErr && (
                      <div className="flex items-start gap-2 rounded-xl border border-pd-rose/40 bg-pd-rose/15 px-3 py-2.5 text-xs text-[#e08a83]">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{demandeErr}</span>
                      </div>
                    )}

                    <GoldButton type="submit" size="md" disabled={sending} className="w-full">
                      {sending ? t('common.sending') : <>{c.submitApplication} <ArrowRight className="h-4 w-4" /></>}
                    </GoldButton>
                  </form>
                )}
              </div>

              <div className="rounded-3xl border border-pd-gold/20 bg-gradient-to-br from-pd-gold/[0.08] to-transparent p-6 ring-1 ring-inset ring-pd-gold/10 sm:p-7">
                <h2 className="font-display text-lg font-semibold text-pd-sand">{c.futureTitle}</h2>
                <p className="mt-1.5 text-sm text-pd-sand-dim">
                  {c.futureText}
                </p>
                <GoldButton to="/peace-days/programme" variant="outline" size="sm" className="mt-4">
                  {c.seeProgram} <ArrowRight className="h-4 w-4" />
                </GoldButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}