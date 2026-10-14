import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // « Nuit & Or » — palette Doggo Management × Peace Days Dubaï 2027
        pd: {
          // Fond « nuit » — pilotable par thème via variables CSS (voir index.css).
          // Le défaut est le bleu nuit du cahier des charges (#080E1A).
          night: 'rgb(var(--pd-night) / <alpha-value>)', // fond principal
          'night-2': 'rgb(var(--pd-night-2) / <alpha-value>)', // panneaux, cartes
          'night-3': 'rgb(var(--pd-night-3) / <alpha-value>)', // champs, surfaces en relief
          'night-4': 'rgb(var(--pd-night-4) / <alpha-value>)', // survols, bordures claires
          gold: '#C9A227', // champagne gold — action principale
          'gold-bright': '#E7C86B', // survol / focus / éclat
          'gold-soft': 'rgb(var(--pd-gold-soft) / <alpha-value>)', // texte or lisible (thémé)
          'gold-muted': '#7C6A38', // bordures, séparateurs discrets
          ink: '#17110A', // encre sombre TOUJOURS foncée (texte sur l'or, tous thèmes)
          sand: 'rgb(var(--pd-sand) / <alpha-value>)', // texte courant (thémé)
          'sand-dim': 'rgb(var(--pd-sand-dim) / <alpha-value>)', // texte secondaire (thémé)
          ivory: '#FAF7F0', // surfaces claires ponctuelles
          emerald: '#3A7A5E', // confirmation / succès
          rose: '#B5443B', // erreur / alerte
          info: '#3E6B8A', // information
        },
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // échelle éditoriale
        'display-sm': ['clamp(2.4rem, 6vw, 3.6rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(3rem, 9vw, 6rem)', { lineHeight: '0.98', letterSpacing: '-0.025em' }],
        'display-lg': ['clamp(3.6rem, 13vw, 11rem)', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
      },
      letterSpacing: {
        label: '0.24em',
        wide: '0.14em',
      },
      maxWidth: {
        prose: '68ch',
      },
      boxShadow: {
        plaque: '0 1px 0 0 rgba(201, 162, 39, 0.28)',
        gold: '0 18px 60px -22px rgba(201, 162, 39, 0.55)',
        lift: '0 40px 90px -50px rgba(0, 0, 0, 0.85)',
      },
      backgroundImage: {
        'gold-line': 'linear-gradient(90deg, transparent, #C9A227 22%, #E7C86B 50%, #C9A227 78%, transparent)',
        'gold-sheen': 'linear-gradient(120deg, #7C6A38 0%, #E7C86B 42%, #FAF7F0 50%, #E7C86B 58%, #7C6A38 100%)',
        // Or métallique « royal » — plus de nuances pour un rendu feuille d'or / lingot
        'gold-royal':
          'linear-gradient(115deg, #6E5B2C 0%, #A9861F 14%, #C9A227 26%, #E7C86B 40%, #FBF3D6 50%, #E7C86B 60%, #C9A227 74%, #A9861F 86%, #6E5B2C 100%)',
        'night-fade':
          'linear-gradient(180deg, rgb(var(--pd-night) / 0) 0%, rgb(var(--pd-night) / 0.6) 55%, rgb(var(--pd-night)) 100%)',
        'radial-gold': 'radial-gradient(1200px 600px at 50% -10%, rgba(201,162,39,0.16), transparent 60%)',
      },
      keyframes: {
        'gold-sweep': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.45', transform: 'scale(0.7)' },
        },
        'scroll-hint': {
          '0%': { transform: 'translateY(-40%)', opacity: '0' },
          '35%, 65%': { opacity: '1' },
          '100%': { transform: 'translateY(140%)', opacity: '0' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'gold-sweep': 'gold-sweep 6s linear infinite',
        'pulse-dot': 'pulse-dot 1.6s ease-in-out infinite',
        'scroll-hint': 'scroll-hint 2.4s ease-in-out infinite',
        'float-slow': 'float-slow 7s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config
