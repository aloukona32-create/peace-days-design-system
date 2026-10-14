import { useEffect, useState, type FormEvent } from 'react'
import { Send, CheckCircle2, AlertCircle, User, Mail, Phone, Building2, Briefcase, ArrowRight } from 'lucide-react'
import { GlassInput, GlassLabel, GlassSelect } from '../ui/GlassField'
import { GoldButton } from '../ui/GoldButton'
import { Checkbox } from '../ui/Field'
import { useSession } from '../../lib/useSession'
import { getMyProfile } from '../../lib/account'
import { submitDemande, type DemandeType } from '../../admin/data'
import { useContent } from '../../i18n/content'
import { useT } from '../../i18n/useT'
import { Reveal } from '../motion'

const CATEGORIES = ['Artisanat', 'Agroalimentaire', 'Mode & Textile', 'Art & Design', 'Cosmétique', 'Services', 'Autre']
const PARTENARIATS = ['Sponsor', 'Institution', 'Fondation', 'Ambassade']

const INIT = {
  prenom: '', nom: '', email: '', telephone: '', pays: '', organisation: '', fonction: '',
  typeParticipation: 'visiteur' as DemandeType, categorie: '', message: '', newsletter: true,
}

const COPY = {
  fr: {
    nameError: 'Merci de renseigner vos prénom, nom, e-mail et pays.',
    sendError: 'L’envoi a échoué (connexion ou droits). Vérifiez votre saisie et réessayez.',
    catStand: 'Catégorie de stand',
    catPartner: 'Type de partenariat',
    eyebrow: 'Rejoindre l’édition 2027',
    title: 'Faites votre demande de participation',
    intro: 'Visiteur, exposant, partenaire ou média : dites-nous qui vous êtes et nous reviendrons vers vous. Aucun compte n’est nécessaire pour envoyer une demande.',
    doneTitle: 'Demande envoyée',
    donePart1: 'Merci ',
    donePart2: ' ! Votre demande a bien été enregistrée. Notre équipe reviendra vers vous par e-mail à l’adresse ',
    seeProgram: 'Découvrir le programme',
    sendAnother: 'Envoyer une autre demande',
    participateAs: 'Je participe en tant que',
    firstName: 'Prénom *',
    firstNamePh: 'Votre prénom',
    lastName: 'Nom *',
    lastNamePh: 'Votre nom',
    email: 'E-mail *',
    emailPh: 'vous@exemple.com',
    phone: 'Téléphone',
    country: 'Pays *',
    countryPlaceholder: 'Sélectionnez votre pays',
    organisation: 'Organisation',
    organisationPh: 'Entreprise, institution…',
    role: 'Fonction',
    rolePh: 'Votre rôle / poste',
    message: 'Message',
    messagePh: 'Présentez votre projet, vos attentes ou vos questions…',
    newsletter: 'Je souhaite recevoir les actualités de Peace Days Dubaï 2027.',
    privacy: 'Vos informations restent confidentielles et servent uniquement au traitement de votre demande.',
    submit: 'Envoyer ma demande',
    sending: 'Envoi…',
    cats: {
      'Artisanat': 'Artisanat',
      'Agroalimentaire': 'Agroalimentaire',
      'Mode & Textile': 'Mode & Textile',
      'Art & Design': 'Art & Design',
      'Cosmétique': 'Cosmétique',
      'Services': 'Services',
      'Autre': 'Autre',
      'Sponsor': 'Sponsor',
      'Institution': 'Institution',
      'Fondation': 'Fondation',
      'Ambassade': 'Ambassade',
    },
  },
  en: {
    nameError: 'Please provide your first name, last name, email and country.',
    sendError: 'Submission failed (connection or permissions). Check your entries and try again.',
    catStand: 'Stand category',
    catPartner: 'Type of partnership',
    eyebrow: 'Join the 2027 edition',
    title: 'Submit your participation request',
    intro: 'Visitor, exhibitor, partner or media: tell us who you are and we will get back to you. No account is required to send a request.',
    doneTitle: 'Request sent',
    donePart1: 'Thank you ',
    donePart2: '! Your request has been recorded. Our team will get back to you by email at ',
    seeProgram: 'Discover the programme',
    sendAnother: 'Send another request',
    participateAs: 'I am taking part as',
    firstName: 'First name *',
    firstNamePh: 'Your first name',
    lastName: 'Last name *',
    lastNamePh: 'Your last name',
    email: 'Email *',
    emailPh: 'you@example.com',
    phone: 'Phone',
    country: 'Country *',
    countryPlaceholder: 'Select your country',
    organisation: 'Organisation',
    organisationPh: 'Company, institution…',
    role: 'Role',
    rolePh: 'Your role / position',
    message: 'Message',
    messagePh: 'Introduce your project, your expectations or your questions…',
    newsletter: 'I would like to receive news from Peace Days Dubai 2027.',
    privacy: 'Your information remains confidential and is used solely to process your request.',
    submit: 'Send my request',
    sending: 'Sending…',
    cats: {
      'Artisanat': 'Handicraft',
      'Agroalimentaire': 'Agri-food',
      'Mode & Textile': 'Fashion & Textiles',
      'Art & Design': 'Art & Design',
      'Cosmétique': 'Cosmetics',
      'Services': 'Services',
      'Autre': 'Other',
      'Sponsor': 'Sponsor',
      'Institution': 'Institution',
      'Fondation': 'Foundation',
      'Ambassade': 'Embassy',
    },
  },
  ar: {
    nameError: 'يرجى إدخال الاسم واللقب والبريد الإلكتروني والبلد.',
    sendError: 'تعذّر الإرسال (اتصال أو صلاحيات). تحقّق من بياناتك وحاول مرّة أخرى.',
    catStand: 'فئة الجناح',
    catPartner: 'نوع الشراكة',
    eyebrow: 'انضمّ إلى نسخة 2027',
    title: 'قدّم طلب مشاركتك',
    intro: 'زائر أو عارض أو شريك أو إعلامي: أخبرنا من أنت وسنعاود التواصل معك. لا حاجة إلى حساب لإرسال الطلب.',
    doneTitle: 'تم إرسال الطلب',
    donePart1: 'شكرًا ',
    donePart2: '! تم تسجيل طلبك بنجاح. سيعاود فريقنا التواصل معك عبر البريد الإلكتروني على العنوان ',
    seeProgram: 'اكتشف البرنامج',
    sendAnother: 'إرسال طلب آخر',
    participateAs: 'أشارك بصفتي',
    firstName: 'الاسم *',
    firstNamePh: 'اسمك',
    lastName: 'اللقب *',
    lastNamePh: 'لقبك',
    email: 'البريد الإلكتروني *',
    emailPh: 'you@example.com',
    phone: 'الهاتف',
    country: 'البلد *',
    countryPlaceholder: 'اختر بلدك',
    organisation: 'المؤسسة',
    organisationPh: 'شركة، مؤسسة…',
    role: 'الوظيفة',
    rolePh: 'دورك / منصبك',
    message: 'رسالة',
    messagePh: 'عرّفنا بمشروعك أو تطلعاتك أو أسئلتك…',
    newsletter: 'أرغب في تلقّي أخبار أيام السلام دبي 2027.',
    privacy: 'تبقى معلوماتك سرّية وتُستخدم فقط لمعالجة طلبك.',
    submit: 'إرسال طلبي',
    sending: 'جارٍ الإرسال…',
    cats: {
      'Artisanat': 'حرف يدوية',
      'Agroalimentaire': 'صناعة غذائية',
      'Mode & Textile': 'أزياء ومنسوجات',
      'Art & Design': 'فن وتصميم',
      'Cosmétique': 'مستحضرات تجميل',
      'Services': 'خدمات',
      'Autre': 'أخرى',
      'Sponsor': 'راعٍ',
      'Institution': 'مؤسسة',
      'Fondation': 'مؤسسة خيرية',
      'Ambassade': 'سفارة',
    },
  },
} as const

/**
 * Formulaire public « Faire une demande de participation » (section #participer
 * de /peace-days). Envoie une ligne dans public.demandes (insertion anon
 * autorisée par la RLS). Pré-rempli depuis le profil si un membre est connecté.
 */
export function ParticipationForm() {
  const { session } = useSession()
  const { locale } = useT()
  const c = COPY[locale]
  const { COUNTRIES, TYPES_COMPTE } = useContent()
  const [f, setF] = useState(INIT)
  const up = (patch: Partial<typeof INIT>) => setF((prev) => ({ ...prev, ...patch }))
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pré-remplissage depuis le profil du membre connecté (silencieux si absent).
  useEffect(() => {
    if (!session) return
    up({ email: session.user.email ?? '' })
    getMyProfile()
      .then((p) => {
        if (!p) return
        up({
          prenom: p.prenom ?? '', nom: p.nom ?? '', telephone: p.telephone ?? '',
          pays: p.pays ?? '', organisation: p.organisation ?? '', fonction: p.fonction ?? '',
          typeParticipation: p.typeCompte,
        })
      })
      .catch(() => {})
  }, [session])
  // Change de profil et fixe une catégorie par défaut cohérente.
  const pickType = (t: DemandeType) => {
    if (t === 'exposant') up({ typeParticipation: t, categorie: f.categorie || CATEGORIES[0] })
    else if (t === 'partenaire') up({ typeParticipation: t, categorie: f.categorie || PARTENARIATS[0] })
    else up({ typeParticipation: t, categorie: '' })
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!f.prenom.trim() || !f.nom.trim() || !f.email.trim() || !f.pays) {
      setError(c.nameError)
      return
    }
    const categorie = f.typeParticipation === 'exposant' || f.typeParticipation === 'partenaire' ? f.categorie : ''
    setBusy(true)
    try {
      await submitDemande({
        prenom: f.prenom.trim(), nom: f.nom.trim(), email: f.email.trim(),
        telephone: f.telephone.trim(), pays: f.pays, organisation: f.organisation.trim(),
        fonction: f.fonction.trim(), typeParticipation: f.typeParticipation,
        categorie, message: f.message.trim(), newsletter: f.newsletter,
        userId: session?.user?.id ?? null,
      })
      setDone(true)
    } catch (err) {
      console.error('[ParticipationForm] submitDemande a échoué :', err)
      setError(c.sendError)
    } finally {
      setBusy(false)
    }
  }

  const showCategorie = f.typeParticipation === 'exposant' || f.typeParticipation === 'partenaire'
  const categorieOptions = f.typeParticipation === 'exposant' ? CATEGORIES : PARTENARIATS
  const categorieLabel = f.typeParticipation === 'exposant' ? c.catStand : c.catPartner

  return (
    <section id="participer" className="relative scroll-mt-28 overflow-hidden py-24 sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-radial-gold" />
        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-pd-gold/8 blur-[130px]" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-pd-emerald/8 blur-[130px]" />
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

          {done ? (
            <Reveal className="mt-10">
              <div className="rounded-3xl border border-pd-emerald/25 bg-pd-emerald/[0.06] p-8 text-center shadow-[0_40px_120px_-48px_rgba(0,0,0,0.9)] ring-1 ring-inset ring-white/[0.05] backdrop-blur-2xl sm:p-10">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-pd-emerald/15 ring-1 ring-inset ring-pd-emerald/30">
                  <CheckCircle2 className="h-8 w-8 text-pd-emerald" />
                </span>
                <h3 className="mt-6 font-display text-2xl font-semibold text-pd-sand">{c.doneTitle}</h3>
                <p className="mx-auto mt-3 max-w-md text-pd-sand-dim">
                  {c.donePart1}{f.prenom || ''}{c.donePart2}<span className="text-pd-sand">{f.email}</span>.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <GoldButton to="/peace-days/programme" size="lg">
                    {c.seeProgram} <ArrowRight className="h-4 w-4" />
                  </GoldButton>
                  <button
                    type="button"
                    onClick={() => { setF(INIT); setDone(false); setError(null) }}
                    className="text-sm text-pd-sand-dim transition-colors hover:text-pd-sand"
                  >
                    {c.sendAnother}
                  </button>
                </div>
              </div>
            </Reveal>
          ) : (
            <form
              onSubmit={submit}
              className="mt-10 space-y-5 rounded-3xl border border-white/10 bg-white/[0.045] p-6 shadow-[0_40px_120px_-48px_rgba(0,0,0,0.9)] ring-1 ring-inset ring-white/[0.05] backdrop-blur-2xl sm:p-8"
            >
              <div>
                <GlassLabel>{c.participateAs}</GlassLabel>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {TYPES_COMPTE.map((t) => {
                    const active = f.typeParticipation === t.key
                    return (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => pickType(t.key)}
                        aria-pressed={active}
                        className={
                          'rounded-2xl border px-3 py-3 text-center text-sm font-medium transition-all ' +
                          (active
                            ? 'border-pd-gold-bright/60 bg-pd-gold/10 text-pd-gold-bright ring-1 ring-inset ring-pd-gold-bright/40'
                            : 'border-white/10 bg-white/5 text-pd-sand-dim hover:border-white/20 hover:text-pd-sand')
                        }
                      >
                        {t.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <GlassLabel>{c.firstName}</GlassLabel>
                  <GlassInput icon={<User className="h-4 w-4" />} value={f.prenom} onChange={(e) => up({ prenom: e.target.value })} placeholder={c.firstNamePh} autoComplete="given-name" />
                </label>
                <label className="block">
                  <GlassLabel>{c.lastName}</GlassLabel>
                  <GlassInput icon={<User className="h-4 w-4" />} value={f.nom} onChange={(e) => up({ nom: e.target.value })} placeholder={c.lastNamePh} autoComplete="family-name" />
                </label>
                <label className="block">
                  <GlassLabel>{c.email}</GlassLabel>
                  <GlassInput type="email" icon={<Mail className="h-4 w-4" />} value={f.email} onChange={(e) => up({ email: e.target.value })} placeholder={c.emailPh} autoComplete="email" />
                </label>
                <label className="block">
                  <GlassLabel>{c.phone}</GlassLabel>
                  <GlassInput type="tel" icon={<Phone className="h-4 w-4" />} value={f.telephone} onChange={(e) => up({ telephone: e.target.value })} placeholder="+971 …" autoComplete="tel" />
                </label>
                <label className="block">
                  <GlassLabel>{c.country}</GlassLabel>
                  <GlassSelect value={f.pays} onChange={(e) => up({ pays: e.target.value })}>
                    <option value="" disabled>{c.countryPlaceholder}</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </GlassSelect>
                </label>
                <label className="block">
                  <GlassLabel>{c.organisation}</GlassLabel>
                  <GlassInput icon={<Building2 className="h-4 w-4" />} value={f.organisation} onChange={(e) => up({ organisation: e.target.value })} placeholder={c.organisationPh} autoComplete="organization" />
                </label>
                <label className="block sm:col-span-2">
                  <GlassLabel>{c.role}</GlassLabel>
                  <GlassInput icon={<Briefcase className="h-4 w-4" />} value={f.fonction} onChange={(e) => up({ fonction: e.target.value })} placeholder={c.rolePh} autoComplete="organization-title" />
                </label>
              </div>
              {showCategorie && (
                <label className="block">
                  <GlassLabel>{categorieLabel}</GlassLabel>
                  <GlassSelect value={f.categorie} onChange={(e) => up({ categorie: e.target.value })}>
                    {categorieOptions.map((opt) => (
                      <option key={opt} value={opt}>{(c.cats as Record<string, string>)[opt] ?? opt}</option>
                    ))}
                  </GlassSelect>
                </label>
              )}

              <label className="block">
                <GlassLabel>{c.message}</GlassLabel>
                <textarea
                  value={f.message}
                  onChange={(e) => up({ message: e.target.value })}
                  rows={4}
                  placeholder={c.messagePh}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-pd-sand transition-colors placeholder:text-pd-sand-dim/70 focus:border-pd-gold-bright/50 focus:outline-none focus:ring-1 focus:ring-pd-gold-bright/40"
                />
              </label>

              <Checkbox
                id="pf-newsletter"
                label={c.newsletter}
                checked={f.newsletter}
                onChange={(e) => up({ newsletter: e.target.checked })}
              />

              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-pd-rose/30 bg-pd-rose/10 px-3.5 py-3 text-sm text-pd-rose">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-pd-sand-dim">
                  {c.privacy}
                </p>
                <GoldButton type="submit" size="lg" disabled={busy} className="w-full shrink-0 sm:w-auto">
                  {busy ? c.sending : c.submit}
                  {!busy && <Send className="h-4 w-4" />}
                </GoldButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
