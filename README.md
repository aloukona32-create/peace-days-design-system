# Peace Days Dubaï 2027 — Design System

Socle React + Vite + TypeScript + Tailwind du site Peace Days Dubaï 2027,
thème **« Nuit & Or »**.

## Démarrer

```bash
npm install
npm run dev
```

Ouvre `http://localhost:5173` : la page affichée (`src/App.tsx`) est le
**guide de style vivant** — palette, typographie, boutons, cartes,
formulaire, badges. C'est la base sur laquelle on construit les vraies
pages du site.

## Structure

```
src/
  components/ui/
    Button.tsx        boutons (primary, secondary, ghost, danger)
    Card.tsx           carte "plaque" + variante "certificate" (médailles)
    Field.tsx          Label, Input, Textarea, Select, Checkbox, erreurs
    Badge.tsx          statuts (Confirmé, Complet, Liste d'attente…)
    SectionHeading.tsx en-tête de section (eyebrow + titre + description)
  lib/utils.ts         cn() — fusion de classes Tailwind
  index.css            polices, base, prefers-reduced-motion
  App.tsx              guide de style vivant (à remplacer par les pages réelles)
tailwind.config.ts      tokens de couleur et de typographie du thème
```

## Tokens de couleur

| Nom | Hex | Usage |
| --- | --- | --- |
| `pd-night` | `#0A1220` | Fond principal |
| `pd-night-2` | `#101B2E` | Cartes, panneaux |
| `pd-night-3` | `#172439` | Champs de formulaire |
| `pd-gold` | `#C9A227` | Action principale, accents forts |
| `pd-gold-bright` | `#E4C567` | Survol / focus |
| `pd-gold-muted` | `#8A7434` | Bordures, séparateurs |
| `pd-sand` | `#EDE6D3` | Texte courant sur fond nuit |
| `pd-ivory` | `#FAF7F0` | Surfaces claires ponctuelles |
| `pd-emerald` | `#2F6B52` | Confirmation / succès |
| `pd-rose` | `#B5443B` | Erreur / alerte |

## Typographie

- **Fraunces** (serif) — titres, registre diplomatique et sobre.
- **Manrope** (sans-serif) — texte courant, 16px de base.
- Chargées via Google Fonts dans `index.html`.

## Principes de conception (issus du cahier des charges)

- Une seule action principale par écran.
- Sobriété : peu d'effets, un seul mouvement orchestré (le hero), le
  reste est calme et respecte `prefers-reduced-motion`.
- Aucune capitale systématique sur les libellés ; pas d'eyebrow
  décoratif si le contenu n'est pas réellement une séquence.
- Contraste AA vérifié sur fond nuit.
- Prêt pour l'arabe (RTL) en V2 : les composants n'imposent aucune
  direction de texte en dur.

## Prochaines étapes possibles

- Page d'accueil réelle (hero, 5 rendez-vous, patronages, compte à rebours).
- Formulaire de candidature exposant en plusieurs étapes.
- Connexion Supabase (Auth, Postgres, Storage) pour les candidatures et le CRM.
