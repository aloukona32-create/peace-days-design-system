// ============================================================
//  Accès aux données du back-office — Peace Days Dubaï 2027
//
//  Les données vivent dans Supabase (Postgres + RLS). Chaque getX()
//  lit une table ; les updateXStatut() écrivent un changement de statut.
//  L'alias PostgREST « champ:colonne » (ex. soumisLe:soumis_le) fait
//  le mapping snake_case → camelCase, donc aucune conversion manuelle.
// ============================================================

import { supabase } from '../lib/supabase'

// ---- Types (1 interface ≈ 1 table) ----------------------------------------

export type EngagementStatut = 'en_attente' | 'publie' | 'refuse'
export interface Engagement {
  id: string
  auteur: string
  pays: string
  email: string
  message: string
  theme: string
  statut: EngagementStatut
  soumisLe: string // ISO
}

export type CandidatureStatut = 'brouillon' | 'soumis' | 'en_revue' | 'accepte' | 'refuse'
export interface Candidature {
  id: string
  structure: string
  contact: string
  email: string
  pays: string
  categorie: string
  stand: string
  statut: CandidatureStatut
  soumisLe: string
}

export type ReservationStatut = 'demande' | 'confirme' | 'liste_attente' | 'annule'
export interface Reservation {
  id: string
  nom: string
  organisation: string
  formule: string
  couverts: number
  montant: number // AED
  statut: ReservationStatut
  soumisLe: string
}
export type PartenaireType = 'Sponsor' | 'Institution' | 'Média' | 'Ambassade' | 'Fondation'
export type PartenaireStatut = 'nouveau' | 'en_discussion' | 'engage' | 'decline'
export interface Partenaire {
  id: string
  organisation: string
  type: PartenaireType
  contact: string
  email: string
  pays: string
  statut: PartenaireStatut
  soumisLe: string
}

export interface Abonne {
  id: string
  email: string
  langue: 'FR' | 'EN' | 'AR'
  source: string
  inscritLe: string
}

// ---- Lecture (Supabase) ----------------------------------------------------
//   L'alias `champ:colonne` renomme la colonne SQL vers le champ TS.

async function selectAll<T>(table: string, columns: string, orderCol: string): Promise<T[]> {
  const { data, error } = await supabase
    .from(table)
    .select(columns)
    .order(orderCol, { ascending: false })
  if (error) throw error
  return (data ?? []) as T[]
}

export const getEngagements = () =>
  selectAll<Engagement>(
    'engagements',
    'id,auteur,pays,email,message,theme,statut,soumisLe:soumis_le',
    'soumis_le',
  )

export const getCandidatures = () =>
  selectAll<Candidature>(
    'candidatures',
    'id,structure,contact,email,pays,categorie,stand,statut,soumisLe:soumis_le',
    'soumis_le',
  )
export const getReservations = () =>
  selectAll<Reservation>(
    'reservations',
    'id,nom,organisation,formule,couverts,montant,statut,soumisLe:soumis_le',
    'soumis_le',
  )

export const getPartenaires = () =>
  selectAll<Partenaire>(
    'partenaires',
    'id,organisation,type,contact,email,pays,statut,soumisLe:soumis_le',
    'soumis_le',
  )

export const getAbonnes = () =>
  selectAll<Abonne>(
    'abonnes',
    'id,email,langue,source,inscritLe:inscrit_le',
    'inscrit_le',
  )

// ---- Écriture : changement de statut ---------------------------------------
//   `.select('id')` renvoie les lignes modifiées : 0 ligne = droits
//   insuffisants (RLS) ou entrée introuvable → on lève une erreur.

async function setStatut(table: string, id: string, statut: string): Promise<void> {
  const { data, error } = await supabase
    .from(table)
    .update({ statut })
    .eq('id', id)
    .select('id')
  if (error) throw error
  if (!data || data.length === 0) {
    throw new Error('Aucune ligne modifiée (droits insuffisants ou entrée introuvable).')
  }
}

export const updateEngagementStatut = (id: string, statut: EngagementStatut) =>
  setStatut('engagements', id, statut)
export const updateCandidatureStatut = (id: string, statut: CandidatureStatut) =>
  setStatut('candidatures', id, statut)
export const updateReservationStatut = (id: string, statut: ReservationStatut) =>
  setStatut('reservations', id, statut)
export const updatePartenaireStatut = (id: string, statut: PartenaireStatut) =>
  setStatut('partenaires', id, statut)

// ---- Soumission publique (membre connecté ou visiteur) ---------------------
//   La RLS autorise l'insertion anon/authenticated avec le statut d'entrée.
//   Sert au parcours « créer un compte → faire sa demande ».

export interface CandidatureInput {
  structure: string
  contact: string
  email: string
  pays: string
  categorie: string
}

export async function submitCandidature(input: CandidatureInput): Promise<void> {
  const { error } = await supabase.from('candidatures').insert({ ...input, statut: 'soumis' })
  if (error) throw error
}

export interface ReservationInput {
  nom: string
  organisation: string
  formule: string
  couverts: number
}

export async function submitReservation(input: ReservationInput): Promise<void> {
  const { error } = await supabase.from('reservations').insert({ ...input, statut: 'demande' })
  if (error) throw error
}

// ---- Demandes de participation (formulaire public /peace-days) -------------
//   Une boîte de réception unique pour tous les profils. Insertion publique
//   (anon) avec statut 'nouveau' ; lecture/traitement réservés aux admins.
//   Voir la table public.demandes dans supabase/02_comptes.sql.

export type DemandeType = 'visiteur' | 'exposant' | 'partenaire' | 'media'
export type DemandeStatut = 'nouveau' | 'en_revue' | 'traite' | 'archive'

export interface Demande {
  id: string
  prenom: string
  nom: string
  email: string
  telephone: string
  pays: string
  organisation: string
  fonction: string
  type: DemandeType
  categorie: string
  message: string
  newsletter: boolean
  statut: DemandeStatut
  soumisLe: string
}

export const getDemandes = () =>
  selectAll<Demande>(
    'demandes',
    'id,prenom,nom,email,telephone,pays,organisation,fonction,type:type_participation,categorie,message,newsletter,statut,soumisLe:created_at',
    'created_at',
  )

export const updateDemandeStatut = (id: string, statut: DemandeStatut) =>
  setStatut('demandes', id, statut)

export interface DemandeInput {
  prenom: string
  nom: string
  email: string
  telephone?: string
  pays: string
  organisation?: string
  fonction?: string
  typeParticipation: DemandeType
  categorie?: string
  message?: string
  newsletter?: boolean
  userId?: string | null
}

export async function submitDemande(input: DemandeInput): Promise<void> {
  const { error } = await supabase.from('demandes').insert({
    prenom: input.prenom,
    nom: input.nom,
    email: input.email,
    telephone: input.telephone ?? '',
    pays: input.pays,
    organisation: input.organisation ?? '',
    fonction: input.fonction ?? '',
    type_participation: input.typeParticipation,
    categorie: input.categorie ?? '',
    message: input.message ?? '',
    newsletter: input.newsletter ?? false,
    user_id: input.userId ?? null,
    statut: 'nouveau',
  })
  if (error) throw error
}

// ---- Newsletter (inscription publique → table abonnes) ---------------------

export interface AbonneInput { email: string; langue?: 'FR' | 'EN' | 'AR'; source?: string }

export async function submitAbonne(input: AbonneInput): Promise<void> {
  const { error } = await supabase.from('abonnes').insert({
    email: input.email,
    langue: input.langue ?? 'FR',
    source: input.source ?? 'site',
  })
  // 23505 = e-mail déjà inscrit : on considère l'inscription comme réussie.
  if (error && (error as { code?: string }).code !== '23505') throw error
}

// ---- Voix de la Paix (engagements : soumission + mur public) ---------------
//   Soumission publique en 'en_attente'. Lecture publique limitée aux
//   engagements 'publie' (la RLS l'impose déjà ; on la double par sûreté).

export interface EngagementInput {
  auteur: string
  pays: string
  email: string
  theme: string
  message: string
}

export async function submitEngagement(input: EngagementInput): Promise<void> {
  const { error } = await supabase.from('engagements').insert({ ...input, statut: 'en_attente' })
  if (error) throw error
}

export interface VoixPubliee { id: string; auteur: string; pays: string; theme: string; message: string; soumisLe: string }

export async function getVoixPubliees(limit = 12): Promise<VoixPubliee[]> {
  const { data, error } = await supabase
    .from('engagements')
    .select('id,auteur,pays,theme,message,soumisLe:soumis_le')
    .eq('statut', 'publie')
    .order('soumis_le', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data ?? []) as VoixPubliee[]
}

// ---- Audience (page_views) : lecture réelle, admin uniquement --------------
//   La table est créée par supabase/03_analytics.sql. Tant qu'elle n'existe
//   pas, on renvoie [] (0 vue) plutôt que de casser le tableau de bord.

export interface PageView { createdAt: string; visitorId: string; path: string }

export async function getPageViews(sinceDays = 30): Promise<PageView[]> {
  const since = new Date(Date.now() - sinceDays * 86_400_000).toISOString()
  const { data, error } = await supabase
    .from('page_views')
    .select('createdAt:created_at,visitorId:visitor_id,path')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
  if (error) {
    if ((error as { code?: string }).code === 'PGRST205') return [] // table pas encore migrée
    throw error
  }
  return (data ?? []) as PageView[]
}

// ---- Indicateurs & séries (tableau de bord) — 100 % calculés depuis la base --
//   Aucune donnée illustrative : chaque chiffre dérive des lignes Supabase
//   réellement présentes. Les helpers ci-dessous agrègent par jour.

export interface Kpi { key: string; label: string; display: string; delta: number; spark: number[] }
export interface DailyPoint { label: string; value: number }
export type ActiviteType = 'engagement' | 'candidature' | 'reservation' | 'partenaire' | 'newsletter'
export interface Activite { id: string; type: ActiviteType; texte: string; quand: string }

type Dated = { date: string; weight?: number }
const DAY_MS = 86_400_000

/** Répartit des éléments datés en `days` compartiments journaliers (ancien → récent). */
function dailyBuckets(items: Dated[], days: number): DailyPoint[] {
  const start = new Date(); start.setHours(0, 0, 0, 0)
  const buckets: DailyPoint[] = []
  const index = new Map<string, number>()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(start.getTime() - i * DAY_MS)
    index.set(d.toISOString().slice(0, 10), buckets.length)
    buckets.push({ label: String(d.getDate()), value: 0 })
  }
  for (const it of items) {
    const idx = index.get(new Date(it.date).toISOString().slice(0, 10))
    if (idx !== undefined) buckets[idx].value += it.weight ?? 1
  }
  return buckets
}

/** Variation % des `windowDays` récents vs la fenêtre précédente de même durée. */
function deltaPct(items: Dated[], windowDays: number): number {
  const now = Date.now()
  const recentFrom = now - windowDays * DAY_MS
  const prevFrom = now - 2 * windowDays * DAY_MS
  let recent = 0, prev = 0
  for (const it of items) {
    const t = new Date(it.date).getTime(), w = it.weight ?? 1
    if (t >= recentFrom) recent += w
    else if (t >= prevFrom) prev += w
  }
  if (prev === 0) return recent > 0 ? 100 : 0
  return Math.round(((recent - prev) / prev) * 1000) / 10
}

export interface DashboardInput {
  engagements: Engagement[]
  candidatures: Candidature[]
  reservations: Reservation[]
  partenaires: Partenaire[]
  abonnes: Abonne[]
  pageViews: PageView[]
}

/** Les 5 cartes KPI : compteurs réels + tendance 30 j + sparkline 7 j. */
export function buildKpis(d: DashboardInput): Kpi[] {
  const spark = (items: Dated[]) => dailyBuckets(items, 7).map((p) => p.value)
  const eng = d.engagements.map((e) => ({ date: e.soumisLe }))
  const cand = d.candidatures.map((c) => ({ date: c.soumisLe }))
  // « Couverts réservés » : on exclut les réservations annulées.
  const resv = d.reservations
    .filter((r) => r.statut !== 'annule')
    .map((r) => ({ date: r.soumisLe, weight: r.couverts }))
  const abo = d.abonnes.map((a) => ({ date: a.inscritLe }))
  const views = d.pageViews.map((v) => ({ date: v.createdAt }))
  const couverts = resv.reduce((s, r) => s + (r.weight ?? 0), 0)
  const uniques = new Set(d.pageViews.map((v) => v.visitorId)).size
  const nf = new Intl.NumberFormat('fr-FR')
  return [
    { key: 'visiteurs', label: 'Visiteurs uniques · 30 j', display: nf.format(uniques), delta: deltaPct(views, 30), spark: spark(views) },
    { key: 'engagements', label: 'Engagements pour la paix', display: nf.format(d.engagements.length), delta: deltaPct(eng, 30), spark: spark(eng) },
    { key: 'candidatures', label: 'Candidatures exposants', display: nf.format(d.candidatures.length), delta: deltaPct(cand, 30), spark: spark(cand) },
    { key: 'reservations', label: 'Couverts réservés · Gala', display: nf.format(couverts), delta: deltaPct(resv, 30), spark: spark(resv) },
    { key: 'newsletter', label: 'Abonnés newsletter', display: nf.format(d.abonnes.length), delta: deltaPct(abo, 30), spark: spark(abo) },
  ]
}

/** Série journalière réelle des engagements reçus sur `days` jours. */
export function buildEngagementsSerie(engagements: Engagement[], days = 14): DailyPoint[] {
  return dailyBuckets(engagements.map((e) => ({ date: e.soumisLe })), days)
}

/** Flux d'activité réel : fusion des dernières lignes de chaque table, triées. */
export function buildActivites(d: DashboardInput, limit = 7): Activite[] {
  const items: Activite[] = [
    ...d.engagements.map((e) => ({ id: 'e' + e.id, type: 'engagement' as const, texte: `${e.auteur} a partagé un engagement pour la paix`, quand: e.soumisLe })),
    ...d.candidatures.map((c) => ({ id: 'c' + c.id, type: 'candidature' as const, texte: `${c.structure} a soumis une candidature exposant`, quand: c.soumisLe })),
    ...d.reservations.map((r) => ({ id: 'r' + r.id, type: 'reservation' as const, texte: `${r.nom} — réservation « ${r.formule} »`, quand: r.soumisLe })),
    ...d.partenaires.map((p) => ({ id: 'p' + p.id, type: 'partenaire' as const, texte: `${p.organisation} — partenaire ${p.type}`, quand: p.soumisLe })),
    ...d.abonnes.map((a) => ({ id: 'n' + a.id, type: 'newsletter' as const, texte: `${a.email} s’est abonné·e à la newsletter`, quand: a.inscritLe })),
  ]
  return items.sort((x, y) => new Date(y.quand).getTime() - new Date(x.quand).getTime()).slice(0, limit)
}
// ---- Utilitaires de formatage ---------------------------------------------

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

export function timeAgo(iso: string): string {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime())
  const min = Math.round(diff / 60000)
  if (min < 60) return `il y a ${min} min`
  const h = Math.round(min / 60)
  if (h < 24) return `il y a ${h} h`
  const j = Math.round(h / 24)
  return `il y a ${j} j`
}

export function aed(n: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(n)} AED`
}
