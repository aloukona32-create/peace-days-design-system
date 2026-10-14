// ============================================================
//  Comptes membres — Peace Days Dubaï 2027
//
//  Inscription / connexion via Supabase Auth (mot de passe haché côté
//  Supabase, jamais stocké par nous) + lecture/écriture du profil étendu
//  (table `profiles`). Voir supabase/02_comptes.sql.
// ============================================================

import { supabase } from './supabase'
import type { TypeCompte } from './content'
import type { Locale } from '../i18n/config'

export type { TypeCompte }

export interface Profil {
  id: string
  prenom: string | null
  nom: string | null
  telephone: string | null
  pays: string | null
  organisation: string | null
  fonction: string | null
  typeCompte: TypeCompte
  interets: string[]
  bio: string | null
  newsletter: boolean
  creeLe: string
}

export interface SignUpInput {
  email: string
  password: string
  prenom: string
  nom: string
  telephone?: string
  pays?: string
  organisation?: string
  fonction?: string
  typeCompte?: TypeCompte
  newsletter?: boolean
}

const PROFILE_COLS =
  'id,prenom,nom,telephone,pays,organisation,fonction,typeCompte:type_compte,interets,bio,newsletter,creeLe:created_at'

/**
 * Inscription : crée le compte auth ; le trigger SQL crée le profil à partir
 * des métadonnées. Retourne `needsConfirmation: true` quand la confirmation
 * d'e-mail est active (aucune session tant que l'e-mail n'est pas validé).
 */
export async function signUpMember(input: SignUpInput): Promise<{ needsConfirmation: boolean }> {
  const { email, password } = input
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        prenom: input.prenom,
        nom: input.nom,
        telephone: input.telephone ?? '',
        pays: input.pays ?? '',
        organisation: input.organisation ?? '',
        fonction: input.fonction ?? '',
        type_compte: input.typeCompte ?? 'visiteur',
        newsletter: input.newsletter ?? false,
      },
    },
  })
  if (error) throw error
  return { needsConfirmation: !data.session }
}

export async function signInMember(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

export async function getMyProfile(): Promise<Profil | null> {
  const { data: auth } = await supabase.auth.getUser()
  const uid = auth.user?.id
  if (!uid) return null
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLS)
    .eq('id', uid)
    .maybeSingle()
  if (error) throw error
  return (data as Profil | null) ?? null
}

export interface ProfilPatch {
  prenom?: string
  nom?: string
  telephone?: string
  pays?: string
  organisation?: string
  fonction?: string
  bio?: string
  interets?: string[]
  newsletter?: boolean
}

export async function updateMyProfile(patch: ProfilPatch): Promise<void> {
  const { data: auth } = await supabase.auth.getUser()
  const uid = auth.user?.id
  if (!uid) throw new Error('Non connecté.')
  const { error } = await supabase.from('profiles').update(patch).eq('id', uid)
  if (error) throw error
}

/** Traduit les erreurs Supabase Auth en messages FR lisibles. */
// Messages d'erreur d'authentification, localisés. On mappe le texte brut
// renvoyé par Supabase (anglais) vers un message clair dans la langue courante.
const AUTH_ERRORS: Record<string, Record<Locale, string>> = {
  invalidLogin: {
    fr: 'E-mail ou mot de passe incorrect.',
    en: 'Incorrect email or password.',
    ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
  },
  alreadyRegistered: {
    fr: 'Un compte existe déjà avec cet e-mail.',
    en: 'An account already exists with this email address.',
    ar: 'يوجد حساب مسجَّل بهذا البريد الإلكتروني.',
  },
  weakPassword: {
    fr: 'Mot de passe trop faible (6 caractères minimum).',
    en: 'Password too weak (6 characters minimum).',
    ar: 'كلمة المرور ضعيفة جدًا (6 أحرف على الأقل).',
  },
  confirmEmail: {
    fr: 'Confirmez d’abord votre e-mail.',
    en: 'Please confirm your email address first.',
    ar: 'يرجى تأكيد بريدك الإلكتروني أولًا.',
  },
  rateLimit: {
    fr: 'Trop de tentatives. Réessayez dans un instant.',
    en: 'Too many attempts. Please try again shortly.',
    ar: 'محاولات كثيرة جدًا. يرجى إعادة المحاولة بعد قليل.',
  },
  generic: {
    fr: 'Une erreur est survenue. Réessayez.',
    en: 'Something went wrong. Please try again.',
    ar: 'حدث خطأ ما. يرجى إعادة المحاولة.',
  },
}

/** Traduit un message d'erreur Supabase en message lisible dans la locale. */
export function authErrorFr(message: string, locale: Locale = 'fr'): string {
  const m = message.toLowerCase()
  const key =
    m.includes('invalid login')
      ? 'invalidLogin'
      : m.includes('already registered') || m.includes('already been registered')
        ? 'alreadyRegistered'
        : m.includes('password')
          ? 'weakPassword'
          : m.includes('email') && m.includes('confirm')
            ? 'confirmEmail'
            : m.includes('rate limit') || m.includes('too many')
              ? 'rateLimit'
              : 'generic'
  return AUTH_ERRORS[key][locale]
}
