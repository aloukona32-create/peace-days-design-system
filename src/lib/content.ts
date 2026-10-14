// Modèle de contenu — dérivé du programme Peace Days International et du
// cahier des charges Doggo Management (v1.1). Source unique de vérité pour
// les pages du site. Les montants et capacités restent [À CONFIRMER].

import { PHOTOS, MEDIA, type PhotoKey } from './images'

export const EVENT = {
  organizer: 'Doggo Management',
  name: 'Peace Days',
  edition: 'Dubaï 2027',
  datesLabel: '18 — 25 janvier 2027',
  location: 'Dubaï, Émirats arabes unis',
  tagline:
    'Un rendez-vous international autour de la paix, du dialogue, de la culture et des connexions économiques.',
  // Ouverture : lundi 18 janvier 2027, heure de Dubaï (UTC+4)
  startISO: '2027-01-18T09:00:00+04:00',
} as const

export type NavItem = { label: string; to: string; flagship?: boolean }

export const NAV: NavItem[] = [
  { label: 'Accueil', to: '/' },
  { label: 'Doggo Management', to: '/doggo' },
  { label: 'Peace Days 2027', to: '/peace-days', flagship: true },
  { label: 'Programme', to: '/peace-days/programme' },
  { label: 'Le concept', to: '/peace-days/concept' },
  { label: 'Nos événements', to: '/evenements' },
]

export const LANGS = ['FR', 'EN', 'AR'] as const

export type Experience = {
  no: string
  key: string
  title: string
  kind: string
  dates: string
  city: string
  blurb: string
  photo: PhotoKey
  /** Visuel local fourni par le client (dossier public/media). S'il est défini,
   *  il prime sur `photo` (Unsplash) partout où le rendez-vous est affiché. */
  src?: string
  to: string
}

// Les cinq rendez-vous de la semaine (programme officiel).
export const EXPERIENCES: Experience[] = [
  {
    no: '01',
    key: 'foire',
    title: 'La Foire',
    kind: 'Produits locaux & artisanat',
    dates: '18 — 25 janvier',
    city: 'Dubaï',
    blurb:
      'Artisans, producteurs et entrepreneurs de dizaines de nations. Faire découvrir, transmettre, connecter — le patrimoine et la créativité au service de la paix économique.',
    photo: 'crafts',
    src: MEDIA.foire,
    to: '/peace-days',
  },
  {
    no: '02',
    key: 'forum',
    title: 'Le Forum',
    kind: 'Économique · B2B / B2G',
    dates: '19 — 20 janvier',
    city: 'Dubaï',
    blurb:
      'Décideurs, investisseurs, diplomates et entrepreneurs. Des rencontres qualifiées pour transformer les initiatives de paix en opportunités économiques.',
    photo: 'forum',
    to: '/peace-days',
  },
  {
    no: '03',
    key: 'art',
    title: 'Voix de la Paix',
    kind: 'Exposition d’art',
    dates: '21 janvier',
    city: 'Dubaï / Abu Dhabi',
    blurb:
      'L’art comme langage universel. Des œuvres inspirées par la réconciliation, l’harmonie et l’espoir, réunissant cultures et générations.',
    photo: 'artGallery',
    to: '/peace-days',
  },
  {
    no: '04',
    key: 'sport',
    title: 'Le Match de Gala',
    kind: 'Sport pour la paix',
    dates: '22 janvier',
    city: 'Dubaï',
    blurb:
      'Ambassadeurs, corps diplomatique et dirigeants réunis sur le terrain. Le sport comme outil de fraternité, d’amitié et de coopération internationale.',
    photo: 'stadium',
    to: '/peace-days',
  },
  {
    no: '05',
    key: 'gala',
    title: 'Le Dîner de Gala',
    kind: 'Médailles de la Paix',
    dates: '23 janvier',
    city: 'Dubaï',
    blurb:
      'Cérémonie de clôture et remise des Médailles de la Paix. Célébrer les femmes, les hommes et les institutions qui font avancer le dialogue et la solidarité.',
    photo: 'gala',
    src: MEDIA.dinnerGala,
    to: '/peace-days',
  },
]

export type Role = { no: string; title: string; text: string; photo: PhotoKey }

// Doggo Management — notre rôle (page institutionnelle).
export const ROLES: Role[] = [
  {
    no: '01',
    title: 'Concevoir',
    text: 'Imaginer des rendez-vous internationaux sur mesure : foires, forums économiques, expositions, cérémonies. Chaque format naît d’une intention claire.',
    photo: 'architecture',
  },
  {
    no: '02',
    title: 'Connecter',
    text: 'Réunir gouvernements, ambassades, entreprises, artistes et société civile autour d’une vision partagée. Provoquer des rencontres utiles.',
    photo: 'handshake',
  },
  {
    no: '03',
    title: 'Faire rayonner',
    text: 'Donner une portée mondiale aux territoires et aux échanges, de l’Afrique au Golfe. Prolonger l’impact bien au-delà de l’événement.',
    photo: 'dubaiSunset',
  },
]

export type Value = { word: string; line: string }

// Nos valeurs (page Concept) — apparition progressive au scroll.
export const VALUES: Value[] = [
  { word: 'Dialogue', line: 'Écouter avant de convaincre. Ouvrir des espaces où les différences se rencontrent.' },
  { word: 'Respect', line: 'Égalité de traitement des cultures, des religions et des convictions.' },
  { word: 'Coopération', line: 'Bâtir ensemble des ponts entre les peuples et les économies.' },
  { word: 'Transmission', line: 'Relier les héritages aux générations qui viennent.' },
  { word: 'Action', line: 'Transformer les intentions de paix en rencontres concrètes.' },
]

export type Expertise = { title: string; text: string; photo: PhotoKey }

// Notre expertise (page Doggo Management).
export const EXPERTISE: Expertise[] = [
  {
    title: 'Événements internationaux',
    text: 'Foires, sommets, cérémonies et galas de haut niveau, conçus et pilotés de bout en bout.',
    photo: 'stageLights',
  },
  {
    title: 'Rencontres économiques',
    text: 'Forums B2B et B2G, mise en relation qualifiée, délégations et pavillons pays.',
    photo: 'forum',
  },
  {
    title: 'Diplomatie culturelle',
    text: 'Un réseau d’ambassades, d’institutions et de dignitaires, du continent africain au Golfe.',
    photo: 'meeting',
  },
  {
    title: 'Culture & patrimoine',
    text: 'Issue du Yassine Arts Center, une expertise de l’art, de l’artisanat et du patrimoine vivant.',
    photo: 'artWork',
  },
  {
    title: 'Innovation & tourisme',
    text: 'Développement touristique, promotion de l’investissement, expériences de destination.',
    photo: 'dubaiMarina',
  },
  {
    title: 'Partenariats',
    text: 'Des activations de marque pensées pour créer de la valeur durable et mesurable.',
    photo: 'business',
  },
]

export type Reference = { year: string; title: string; place: string; photo?: PhotoKey; src?: string }

// Références clés — appuyées sur les visuels officiels du Diplomatic Roundtable
// (Dubaï, Burj Khalifa) et des rencontres diplomatiques menées à Dubaï.
export const REFERENCES: Reference[] = [
  { year: '2026', title: 'Diplomatic Roundtable', place: 'Dubaï · Burj Khalifa — corps diplomatique', src: MEDIA.roundtable2 },
  { year: '2026', title: 'Dubaï, centre mondial de la paix', place: 'Prise de parole & dignitaires réunis', src: MEDIA.roundtable1 },
  { year: '2026', title: 'Coopération avec le Sénégal', place: 'Consulat de la République du Sénégal · Dubaï', src: MEDIA.senegal1 },
  { year: '2026', title: 'Coopération avec la Guinée', place: 'Consulat de la République de Guinée · Dubaï', src: MEDIA.guinea2 },
  { year: '—', title: 'Diplomatie & investissement', place: 'Afrique — Golfe — Monde', src: MEDIA.guinea1 },
]

export type Guest = { name: string; role: string; country: string; src: string }

// Invités de marque — Diplomatic Roundtable (cartons officiels du client).
export const GUESTS: Guest[] = [
  {
    name: 'S.E. Isabel Paula de Castro',
    role: 'Consule générale',
    country: 'République d’Angola',
    src: MEDIA.guestAngola,
  },
  {
    name: 'S.E. Nyandeng Deng Mangordit',
    role: 'Chargée d’affaires (a.i.)',
    country: 'République du Soudan du Sud',
    src: MEDIA.guestSouthSudan,
  },
]

export type GalleryItem = { src: string; caption: string }

// Retour en images — temps forts et rencontres diplomatiques (Dubaï).
export const GALLERY: GalleryItem[] = [
  { src: MEDIA.roundtable2, caption: 'Diplomatic Roundtable — ouverture, Dubaï' },
  { src: MEDIA.senegal1, caption: 'Rencontre au Consulat du Sénégal, Dubaï' },
  { src: MEDIA.roundtable1, caption: 'Prise de parole — « Dubaï, centre mondial de la paix »' },
  { src: MEDIA.guinea2, caption: 'Délégation au Consulat de Guinée, Dubaï' },
  { src: MEDIA.burjKhalifa, caption: 'Peace Days International — Dubaï' },
  { src: MEDIA.guinea1, caption: 'Échanges diplomatiques, Consulat de Guinée' },
  { src: MEDIA.senegal2, caption: 'Coopération culturelle — Sénégal' },
  { src: MEDIA.roundtable3, caption: 'Roundtable — table d’honneur' },
  { src: MEDIA.guinea3, caption: 'Rencontre officielle, Dubaï' },
]

// Patronages & soutiens — placeholders (uniquement des accords écrits en production).
export const PATRONAGES: string[] = [
  'Ministère de la Culture',
  'Corps diplomatique',
  'Ambassades partenaires',
  'Institutions internationales',
  'Chambres de commerce',
  'Fondations pour la paix',
]

export type Stat = { value: number; suffix?: string; label: string }

// Chiffres d’impact — cibles proposées (à confirmer / issues du système en production).
export const STATS: Stat[] = [
  { value: 8, label: 'jours de rencontres' },
  { value: 5, label: 'rendez-vous majeurs' },
  { value: 40, suffix: '+', label: 'nations représentées' },
  { value: 1800, suffix: '+', label: 'engagements pour la paix' },
]

export const THEMES: string[] = [
  'Culture & arts pour la paix',
  'Sport pour la paix',
  'Éducation & sensibilisation',
  'Développement durable',
  'Action humanitaire',
  'Jeunesse & femmes',
]

export type SessionType = 'foire' | 'forum' | 'art' | 'sport' | 'gala'

export const SESSION_TYPES: { key: SessionType | 'tous'; label: string }[] = [
  { key: 'tous', label: 'Tous' },
  { key: 'foire', label: 'Foire' },
  { key: 'forum', label: 'Forum' },
  { key: 'art', label: 'Art' },
  { key: 'sport', label: 'Sport' },
  { key: 'gala', label: 'Gala' },
]

export type Session = {
  time: string
  type: SessionType
  title: string
  place: string
  speaker?: string
  blurb: string
}

export type ProgramDay = {
  id: string
  day: string // « 18 »
  weekday: string // « Lun »
  label: string // « 18 janvier »
  sessions: Session[]
}

// ---- Comptes membres (inscription / profil) ------------------------------

export type TypeCompte = 'visiteur' | 'exposant' | 'partenaire' | 'media'

export const TYPES_COMPTE: { key: TypeCompte; label: string; hint: string }[] = [
  { key: 'visiteur', label: 'Visiteur', hint: 'Suivre l’événement, réserver, s’engager' },
  { key: 'exposant', label: 'Exposant', hint: 'Tenir un stand à la Foire' },
  { key: 'partenaire', label: 'Partenaire', hint: 'Sponsor, institution, fondation' },
  { key: 'media', label: 'Média', hint: 'Presse, accréditation, contenus' },
]

// Liste de pays (FR) — pour le sélecteur d'inscription. Golfe + Afrique +
// grands partenaires en tête, puis ordre alphabétique.
export const COUNTRIES: string[] = [
  'Émirats arabes unis', 'Arabie saoudite', 'Qatar', 'Koweït', 'Bahreïn', 'Oman',
  'France', 'Maroc', 'Sénégal', 'Côte d’Ivoire', 'Tunisie', 'Algérie', 'Égypte',
  'Afrique du Sud', 'Allemagne', 'Belgique', 'Bénin', 'Brésil', 'Burkina Faso',
  'Cameroun', 'Canada', 'Chine', 'Congo', 'Corée du Sud', 'Espagne', 'États-Unis',
  'Éthiopie', 'Gabon', 'Ghana', 'Guinée', 'Inde', 'Indonésie', 'Italie', 'Japon',
  'Jordanie', 'Kenya', 'Liban', 'Libye', 'Mali', 'Mauritanie', 'Niger', 'Nigéria',
  'Pays-Bas', 'Portugal', 'République démocratique du Congo', 'Royaume-Uni',
  'Rwanda', 'Suisse', 'Tchad', 'Togo', 'Turquie', 'Autre',
]

export const PROGRAM: ProgramDay[] = [
  {
    id: '18',
    day: '18',
    weekday: 'Lun',
    label: '18 janvier',
    sessions: [
      { time: '10:00', type: 'foire', title: 'Ouverture de la Foire', place: 'Hall principal', speaker: 'Cérémonie officielle', blurb: 'Inauguration de la Foire des produits locaux et de l’artisanat en présence des autorités.' },
      { time: '18:18', type: 'foire', title: 'La Minute de la Paix', place: 'Scène centrale', blurb: 'Un moment collectif synchronisé avec les relais Peace Caravan à travers le monde.' },
    ],
  },
  {
    id: '19',
    day: '19',
    weekday: 'Mar',
    label: '19 janvier',
    sessions: [
      { time: '09:30', type: 'forum', title: 'Ouverture du Forum économique', place: 'Auditorium', speaker: 'Panel d’ouverture', blurb: 'Promouvoir l’économie de la paix : investissement, partenariats et développement durable.' },
      { time: '11:00', type: 'forum', title: 'Rencontres B2B / B2G', place: 'Espace matchmaking', blurb: 'Créneaux qualifiés entre décideurs, investisseurs et institutions.' },
      { time: '15:00', type: 'forum', title: 'Afrique — Golfe : bâtir des ponts', place: 'Salle A', speaker: 'Table ronde', blurb: 'Connecter les territoires par le commerce, l’innovation et la diplomatie.' },
    ],
  },
  {
    id: '20',
    day: '20',
    weekday: 'Mer',
    label: '20 janvier',
    sessions: [
      { time: '10:00', type: 'forum', title: 'Entrepreneuriat & jeunesse', place: 'Salle B', speaker: 'Panel', blurb: 'Soutenir les projets à impact social et l’entrepreneuriat des jeunes.' },
      { time: '14:00', type: 'forum', title: 'Rendez-vous d’affaires', place: 'Espace matchmaking', blurb: 'Deuxième vague de rencontres, circuit protocolaire pour les autorités.' },
    ],
  },
  {
    id: '21',
    day: '21',
    weekday: 'Jeu',
    label: '21 janvier',
    sessions: [
      { time: '11:00', type: 'art', title: 'Vernissage « Voix de la Paix »', place: 'Galerie', speaker: 'Artistes sélectionnés', blurb: 'Exposition internationale : l’art comme langage universel de paix.' },
      { time: '17:00', type: 'art', title: 'Rencontre avec les artistes', place: 'Galerie', blurb: 'Échanges autour des œuvres inspirées par la réconciliation et l’espoir.' },
    ],
  },
  {
    id: '22',
    day: '22',
    weekday: 'Ven',
    label: '22 janvier',
    sessions: [
      { time: '19:00', type: 'sport', title: 'Match de Gala pour la Paix', place: 'Stade', speaker: 'Ambassadeurs & dirigeants', blurb: 'Le sport au service du dialogue : une soirée de fraternité et de coopération.' },
    ],
  },
  {
    id: '23',
    day: '23',
    weekday: 'Sam',
    label: '23 janvier',
    sessions: [
      { time: '20:00', type: 'gala', title: 'Dîner de Gala & Médailles de la Paix', place: 'Salle de réception', speaker: 'Cérémonie de clôture', blurb: 'Remise des Médailles de la Paix et reconnaissance des Ambassadeurs.' },
    ],
  },
  {
    id: '24',
    day: '24',
    weekday: 'Dim',
    label: '24 janvier',
    sessions: [
      { time: '10:00', type: 'foire', title: 'Foire — journée grand public', place: 'Hall principal', blurb: 'Stands ouverts, démonstrations d’artisanat et rencontres avec les exposants.' },
    ],
  },
  {
    id: '25',
    day: '25',
    weekday: 'Lun',
    label: '25 janvier',
    sessions: [
      { time: '17:00', type: 'foire', title: 'Clôture de la Foire', place: 'Hall principal', speaker: 'Mot de clôture', blurb: 'Bilan de la semaine et perspectives pour les prochaines éditions.' },
    ],
  },
]
