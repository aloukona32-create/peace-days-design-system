import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, User, Phone, Building2, Briefcase } from 'lucide-react'
import { AuthShell } from '../components/site/AuthShell'
import { GlassInput, GlassLabel, GlassSelect, GoldButton } from '../components/ui'
import { Checkbox } from '../components/ui/Field'
import { useSession } from '../lib/useSession'
import { signUpMember, authErrorFr, type TypeCompte } from '../lib/account'
import { useContent } from '../i18n/content'
import { useT } from '../i18n/useT'

const INIT = {
  prenom: '', nom: '', email: '', telephone: '', pays: '', organisation: '',
  fonction: '', typeCompte: 'visiteur' as TypeCompte, password: '', confirm: '',
  newsletter: true, cgu: false,
}

const COPY = {
  fr: {
    title: 'Créer un compte',
    subtitle: 'Rejoignez la communauté Peace Days Dubaï 2027 pour déposer vos demandes et suivre l’événement.',
    haveAccount: 'Vous avez déjà un compte ?',
    signIn: 'Se connecter',
    firstName: 'Prénom',
    firstNamePlaceholder: 'Amina',
    lastName: 'Nom',
    lastNamePlaceholder: 'Diallo',
    email: 'Adresse e-mail',
    emailPlaceholder: 'vous@exemple.com',
    phone: 'Téléphone',
    country: 'Pays',
    selectPlaceholder: 'Sélectionnez…',
    organization: 'Organisation',
    optional: '(optionnel)',
    organizationPlaceholder: 'Structure, entreprise…',
    role: 'Fonction',
    rolePlaceholder: 'Rôle, titre…',
    accountType: 'Type de compte',
    password: 'Mot de passe',
    passwordPlaceholder: '6 caractères min.',
    show: 'Afficher',
    hide: 'Masquer',
    confirm: 'Confirmer',
    confirmPlaceholder: 'Répétez le mot de passe',
    newsletterLabel: 'Je souhaite recevoir la newsletter Peace Days.',
    termsLabel: 'J’accepte les conditions d’utilisation et la politique de confidentialité.',
    creating: 'Création…',
    createAccount: 'Créer mon compte',
    adminQuestion: 'Vous êtes administrateur ?',
    backOffice: 'Accès back-office',
    errPasswordShort: 'Mot de passe : 6 caractères minimum.',
    errPasswordMismatch: 'Les deux mots de passe ne correspondent pas.',
    errAcceptTerms: 'Veuillez accepter les conditions pour continuer.',
    doneTitle: 'Vérifiez votre e-mail',
    doneSubtitle: 'Un lien de confirmation a été envoyé à {email}. Cliquez dessus pour activer votre compte.',
    doneSpam: 'Pensez à regarder vos spams. Une fois l’e-mail confirmé, vous pourrez vous connecter.',
    doneGoLogin: 'Aller à la connexion',
  },
  en: {
    title: 'Create an account',
    subtitle: 'Join the Peace Days Dubai 2027 community to submit your requests and follow the event.',
    haveAccount: 'Already have an account?',
    signIn: 'Sign in',
    firstName: 'First name',
    firstNamePlaceholder: 'Amina',
    lastName: 'Last name',
    lastNamePlaceholder: 'Diallo',
    email: 'Email address',
    emailPlaceholder: 'you@example.com',
    phone: 'Phone',
    country: 'Country',
    selectPlaceholder: 'Select…',
    organization: 'Organisation',
    optional: '(optional)',
    organizationPlaceholder: 'Organisation, company…',
    role: 'Role',
    rolePlaceholder: 'Role, title…',
    accountType: 'Account type',
    password: 'Password',
    passwordPlaceholder: '6 characters min.',
    show: 'Show',
    hide: 'Hide',
    confirm: 'Confirm',
    confirmPlaceholder: 'Repeat the password',
    newsletterLabel: 'I would like to receive the Peace Days newsletter.',
    termsLabel: 'I accept the terms of use and the privacy policy.',
    creating: 'Creating…',
    createAccount: 'Create my account',
    adminQuestion: 'Are you an administrator?',
    backOffice: 'Back-office access',
    errPasswordShort: 'Password: 6 characters minimum.',
    errPasswordMismatch: 'The two passwords do not match.',
    errAcceptTerms: 'Please accept the terms to continue.',
    doneTitle: 'Check your email',
    doneSubtitle: 'A confirmation link has been sent to {email}. Click it to activate your account.',
    doneSpam: 'Remember to check your spam folder. Once your email is confirmed, you can sign in.',
    doneGoLogin: 'Go to sign in',
  },
  ar: {
    title: 'إنشاء حساب',
    subtitle: 'انضمّ إلى مجتمع Peace Days Dubai 2027 لتقديم طلباتك ومتابعة الفعالية.',
    haveAccount: 'هل لديك حساب بالفعل؟',
    signIn: 'تسجيل الدخول',
    firstName: 'الاسم الأول',
    firstNamePlaceholder: 'أمينة',
    lastName: 'اسم العائلة',
    lastNamePlaceholder: 'ديالو',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'you@example.com',
    phone: 'الهاتف',
    country: 'البلد',
    selectPlaceholder: 'اختر…',
    organization: 'المؤسسة',
    optional: '(اختياري)',
    organizationPlaceholder: 'هيئة، شركة…',
    role: 'الوظيفة',
    rolePlaceholder: 'الدور، المسمّى الوظيفي…',
    accountType: 'نوع الحساب',
    password: 'كلمة المرور',
    passwordPlaceholder: '6 أحرف كحدّ أدنى',
    show: 'إظهار',
    hide: 'إخفاء',
    confirm: 'تأكيد',
    confirmPlaceholder: 'أعد إدخال كلمة المرور',
    newsletterLabel: 'أرغب في تلقّي نشرة Peace Days الإخبارية.',
    termsLabel: 'أوافق على شروط الاستخدام وسياسة الخصوصية.',
    creating: 'جارٍ الإنشاء…',
    createAccount: 'إنشاء حسابي',
    adminQuestion: 'هل أنت مسؤول؟',
    backOffice: 'الدخول إلى لوحة الإدارة',
    errPasswordShort: 'كلمة المرور: 6 أحرف كحدّ أدنى.',
    errPasswordMismatch: 'كلمتا المرور غير متطابقتين.',
    errAcceptTerms: 'يرجى قبول الشروط للمتابعة.',
    doneTitle: 'تحقّق من بريدك الإلكتروني',
    doneSubtitle: 'تم إرسال رابط تأكيد إلى {email}. انقر عليه لتفعيل حسابك.',
    doneSpam: 'لا تنسَ مراجعة مجلد الرسائل غير المرغوب فيها. بعد تأكيد بريدك الإلكتروني يمكنك تسجيل الدخول.',
    doneGoLogin: 'الذهاب إلى تسجيل الدخول',
  },
} as const

export default function Inscription() {
  const navigate = useNavigate()
  const { session, ready } = useSession()
  const { COUNTRIES, TYPES_COMPTE } = useContent()
  const { locale } = useT()
  const c = COPY[locale]
  const [f, setF] = useState(INIT)
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const up = (patch: Partial<typeof INIT>) => setF((prev) => ({ ...prev, ...patch }))

  useEffect(() => {
    if (ready && session && !done) navigate('/compte', { replace: true })
  }, [ready, session, navigate, done])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (f.password.length < 6) return setError(c.errPasswordShort)
    if (f.password !== f.confirm) return setError(c.errPasswordMismatch)
    if (!f.cgu) return setError(c.errAcceptTerms)
    setBusy(true)
    try {
      const { needsConfirmation } = await signUpMember({
        email: f.email, password: f.password, prenom: f.prenom, nom: f.nom,
        telephone: f.telephone, pays: f.pays, organisation: f.organisation,
        fonction: f.fonction, typeCompte: f.typeCompte, newsletter: f.newsletter,
      })
      if (needsConfirmation) setDone(true)
      else navigate('/compte', { replace: true })
    } catch (err) {
      setError(authErrorFr(err instanceof Error ? err.message : '', locale))
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <AuthShell title={c.doneTitle} subtitle={c.doneSubtitle.replace('{email}', f.email)}>
        <div className="flex flex-col items-center gap-5 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-pd-emerald/30 bg-pd-emerald/15 text-[#7fd0aa]">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <p className="text-sm text-pd-sand-dim">
            {c.doneSpam}
          </p>
          <GoldButton to="/connexion" size="md" className="w-full">
            {c.doneGoLogin} <ArrowRight className="h-4 w-4" />
          </GoldButton>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      wide
      title={c.title}
      subtitle={c.subtitle}
      footer={
        <span className="text-pd-sand-dim">
          {c.haveAccount}{' '}
          <Link to="/connexion" className="font-medium text-pd-gold-soft transition-colors hover:text-pd-gold-bright">
            {c.signIn}
          </Link>
        </span>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <GlassLabel>{c.firstName}</GlassLabel>
            <GlassInput value={f.prenom} onChange={(e) => up({ prenom: e.target.value })} required placeholder={c.firstNamePlaceholder} icon={<User className="h-4 w-4" />} />
          </label>
          <label className="block">
            <GlassLabel>{c.lastName}</GlassLabel>
            <GlassInput value={f.nom} onChange={(e) => up({ nom: e.target.value })} required placeholder={c.lastNamePlaceholder} icon={<User className="h-4 w-4" />} />
          </label>
        </div>

        <label className="block">
          <GlassLabel>{c.email}</GlassLabel>
          <GlassInput type="email" value={f.email} onChange={(e) => up({ email: e.target.value })} required autoComplete="email" placeholder={c.emailPlaceholder} icon={<Mail className="h-4 w-4" />} />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <GlassLabel>{c.phone}</GlassLabel>
            <GlassInput type="tel" value={f.telephone} onChange={(e) => up({ telephone: e.target.value })} placeholder="+971 5X XXX XXXX" icon={<Phone className="h-4 w-4" />} />
          </label>
          <label className="block">
            <GlassLabel>{c.country}</GlassLabel>
            <GlassSelect value={f.pays} onChange={(e) => up({ pays: e.target.value })} required>
              <option value="" disabled>{c.selectPlaceholder}</option>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </GlassSelect>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <GlassLabel>{c.organization} <span className="text-pd-sand-dim/60">{c.optional}</span></GlassLabel>
            <GlassInput value={f.organisation} onChange={(e) => up({ organisation: e.target.value })} placeholder={c.organizationPlaceholder} icon={<Building2 className="h-4 w-4" />} />
          </label>
          <label className="block">
            <GlassLabel>{c.role} <span className="text-pd-sand-dim/60">{c.optional}</span></GlassLabel>
            <GlassInput value={f.fonction} onChange={(e) => up({ fonction: e.target.value })} placeholder={c.rolePlaceholder} icon={<Briefcase className="h-4 w-4" />} />
          </label>
        </div>

        <div>
          <GlassLabel>{c.accountType}</GlassLabel>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TYPES_COMPTE.map((t) => {
              const active = f.typeCompte === t.key
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => up({ typeCompte: t.key })}
                  className={
                    'rounded-xl border px-3 py-2.5 text-left transition-all duration-200 ' +
                    (active
                      ? 'border-pd-gold-bright/60 bg-pd-gold/12 ring-1 ring-inset ring-pd-gold-bright/40'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]')
                  }
                >
                  <span className={'block text-sm font-medium ' + (active ? 'text-pd-gold-bright' : 'text-pd-sand')}>{t.label}</span>
                  <span className="mt-0.5 block text-[0.7rem] leading-tight text-pd-sand-dim">{t.hint}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <GlassLabel>{c.password}</GlassLabel>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pd-sand-dim" />
              <GlassInput type={show ? 'text' : 'password'} value={f.password} onChange={(e) => up({ password: e.target.value })} required autoComplete="new-password" placeholder={c.passwordPlaceholder} className="pl-9 pr-10" />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? c.hide : c.show} className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-pd-sand-dim transition-colors hover:text-pd-sand">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>
          <label className="block">
            <GlassLabel>{c.confirm}</GlassLabel>
            <GlassInput type={show ? 'text' : 'password'} value={f.confirm} onChange={(e) => up({ confirm: e.target.value })} required autoComplete="new-password" placeholder={c.confirmPlaceholder} icon={<Lock className="h-4 w-4" />} />
          </label>
        </div>

        <div className="space-y-2.5 pt-1">
          <Checkbox id="newsletter" checked={f.newsletter} onChange={(e) => up({ newsletter: e.target.checked })} label={c.newsletterLabel} />
          <Checkbox id="cgu" checked={f.cgu} onChange={(e) => up({ cgu: e.target.checked })} label={c.termsLabel} />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-pd-rose/40 bg-pd-rose/15 px-3 py-2.5 text-xs text-[#e08a83]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <GoldButton type="submit" size="md" disabled={busy} className="w-full">
          {busy ? c.creating : <>{c.createAccount} <ArrowRight className="h-4 w-4" /></>}
        </GoldButton>

        <p className="text-center text-xs text-pd-sand-dim/70">
          {c.adminQuestion}{' '}
          <Link to="/admin/login" className="text-pd-gold-soft transition-colors hover:text-pd-gold-bright">{c.backOffice}</Link>
        </p>
      </form>
    </AuthShell>
  )
}
