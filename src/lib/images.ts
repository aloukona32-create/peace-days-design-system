// Bibliothèque photographique — identifiants Unsplash vérifiés (HTTP 200).
// Chaque bloc image du site est posé sur un dégradé nuit/or : si une image
// ne charge pas, le bloc reste élégant (dégradation gracieuse).

export type ImgOpts = { w?: number; h?: number; q?: number }

const BASE = 'https://images.unsplash.com/photo-'

/** Construit une URL Unsplash optimisée (format auto, recadrage). */
export function img(id: string, { w = 1600, h, q = 80 }: ImgOpts = {}): string {
  const params = new URLSearchParams({
    auto: 'format',
    fit: 'crop',
    q: String(q),
    w: String(w),
  })
  if (h) params.set('h', String(h))
  return `${BASE}${id}?${params.toString()}`
}

/** Photothèque nommée par usage éditorial. */
export const PHOTOS = {
  dubaiSunset: '1512453979798-5ea266f8880c',
  dubaiNight: '1518684079-3c830dcef090',
  dubaiTower: '1546412414-e1885259563a',
  dubaiSkyline: '1526495124232-a04e1849168c',
  dubaiDesert: '1540747913346-19e32dc3e97e',
  dubaiMarina: '1522778119026-d647f0596c20',
  architecture: '1487958449943-2429e8be8625',
  crafts: '1610030469983-98e550d6193c',
  market: '1528283648649-33347faa5d9e',
  artGallery: '1531913764164-f85c52e6e654',
  artWork: '1577720580479-7d839d829c73',
  gala: '1519671482749-fd09be7ccebf',
  dining: '1414235077428-338989a2e8c0',
  stadium: '1459865264687-595d652de67e',
  crowd: '1470229722913-7c0e2dbbafd3',
  stageLights: '1517649763962-0c623066013b',
  forum: '1521737604893-d14cc237f11d',
  conference: '1511578314322-379afb476865',
  business: '1600880292203-757bb62b4baf',
  meeting: '1556761175-5973dc0f32e7',
  team: '1552664730-d307ca884978',
  handshake: '1531058020387-3be344556be6',
  party: '1492684223066-81342ee5ff30',
  mist: '1470071459604-3b5ec3a7fe05',
  youth: '1502920917128-1aa500764cbd',
  texture1: '1449824913935-59a10b8d2000',
  texture2: '1541532713592-79a0317b6b77',
  texture3: '1505373877841-8d25f7d46678',
  texture4: '1475721027785-f74eccf877e2',
  texture5: '1533174072545-7a4b6ad7a6c3',
  texture6: '1583394838336-acd977736f90',
} as const

export type PhotoKey = keyof typeof PHOTOS

/**
 * Médias officiels fournis par le client (dossier `public/media`, servis à la
 * racine par Vite). Chemins absolus utilisables directement dans `<img src>`
 * ou le composant `Figure` — NE PAS passer par `img()` (réservé à Unsplash).
 */
export const MEDIA = {
  emblem: '/media/peace-days-emblem.png',
  // Logo officiel « Peace Days International » (sceau complet : anneau, lauriers,
  // globe, colombe à l rameau d'olivier) — vectoriel, net de 16px à 1024px.
  logo: '/media/peace-days-logo.svg',
  ogImage: '/media/og-image.jpg',
  // Diplomatic Roundtable — Dubaï, Burj Khalifa (31 août 2026) : cartons invités.
  guestAngola: '/media/guest-angola.jpg',
  guestSouthSudan: '/media/guest-south-sudan.jpg',
  // Prises de parole & temps forts du roundtable.
  roundtable1: '/media/roundtable-address-1.jpg',
  roundtable2: '/media/roundtable-address-2.jpg',
  roundtable3: '/media/roundtable-address-3.jpg',
  // Rencontres diplomatiques (consulats à Dubaï).
  guinea1: '/media/diplomacy-guinea-1.jpg',
  guinea2: '/media/diplomacy-guinea-2.jpg',
  guinea3: '/media/diplomacy-guinea-3.jpg',
  senegal1: '/media/diplomacy-senegal-1.jpg',
  senegal2: '/media/diplomacy-senegal-2.jpg',
  burjKhalifa: '/media/dubai-burj-khalifa.jpg',
  // Fond du hero de la page d'accueil (image fournie par le client).
  heroHome: '/media/hero-home.png',
  // Visuels officiels fournis par le client pour les temps forts de l'édition.
  dinnerGala: '/media/dinner-gala.jpg',
  foire: '/media/foire.jpg',
} as const

export type MediaKey = keyof typeof MEDIA

/** Référence à une image de contenu : visuel local prioritaire, repli Unsplash. */
export type VisualRef = { src?: string; photo?: PhotoKey }

/**
 * Résout l'URL d'une image de contenu. Le visuel local fourni par le client
 * (`src`, dossier `public/media`) prime sur la photothèque Unsplash (`photo`).
 * Les dimensions ne servent qu'au repli Unsplash : un visuel local n'est pas
 * redimensionné. Retourne une chaîne vide si aucune source n'est exploitable —
 * `Figure` masque alors l'image et conserve son fond dégradé nuit/or.
 */
export function resolveImage({ src, photo }: VisualRef, opts: ImgOpts = {}): string {
  const local = typeof src === 'string' ? src.trim() : ''
  if (local) return local
  return photo ? img(PHOTOS[photo], opts) : ''
}
