import type { Locale } from './config'

// Dictionnaire UI « chrome » (en-tête, pied de page, sélecteur, libellés
// transverses). Les contenus de pages vivent dans getContent() / des objets
// locaux de page. FR = source ; AR à faire relire par un locuteur natif.

type Dict = {
  header: { login: string; signup: string; myspace: string; skip: string; menuOpen: string; menuClose: string }
  footer: {
    eyebrow: string; headlineA: string; headlineB: string; newsletter: string; cta: string
    nav: string; repere: string
    cOrg: string; cEdition: string; cDates: string; cLieu: string
    rights: string; forPeace: string
  }
  lang: { label: string; switchTo: string }
  common: { all: string; loading: string; sending: string; backHome: string }
}

export const UI: Record<Locale, Dict> = {
  fr: {
    header: { login: 'Se connecter', signup: 'Créer un compte', myspace: 'Mon espace', skip: 'Aller au contenu', menuOpen: 'Ouvrir le menu', menuClose: 'Fermer le menu' },
    footer: {
      eyebrow: 'Diplomatie culturelle', headlineA: 'La paix se construit', headlineB: ' par la rencontre.',
      newsletter: 'Restez informé', cta: 'Rejoindre Peace Days 2027', nav: 'Navigation', repere: 'Repères',
      cOrg: 'Organisation', cEdition: 'Édition', cDates: 'Dates', cLieu: 'Lieu',
      rights: 'Tous droits réservés.', forPeace: 'Un rendez-vous international pour la paix',
    },
    lang: { label: 'Langue', switchTo: 'Passer en {lang}' },
    common: { all: 'Tous', loading: 'Chargement…', sending: 'Envoi…', backHome: 'Retour à l’accueil' },
  },
  en: {
    header: { login: 'Sign in', signup: 'Create an account', myspace: 'My space', skip: 'Skip to content', menuOpen: 'Open menu', menuClose: 'Close menu' },
    footer: {
      eyebrow: 'Cultural diplomacy', headlineA: 'Peace is built', headlineB: ' through encounter.',
      newsletter: 'Stay informed', cta: 'Join Peace Days 2027', nav: 'Navigation', repere: 'Key facts',
      cOrg: 'Organiser', cEdition: 'Edition', cDates: 'Dates', cLieu: 'Location',
      rights: 'All rights reserved.', forPeace: 'An international gathering for peace',
    },
    lang: { label: 'Language', switchTo: 'Switch to {lang}' },
    common: { all: 'All', loading: 'Loading…', sending: 'Sending…', backHome: 'Back to home' },
  },
  ar: {
    header: { login: 'تسجيل الدخول', signup: 'إنشاء حساب', myspace: 'مساحتي', skip: 'الانتقال إلى المحتوى', menuOpen: 'فتح القائمة', menuClose: 'إغلاق القائمة' },
    footer: {
      eyebrow: 'الدبلوماسية الثقافية', headlineA: 'السلام يُبنى', headlineB: ' باللقاء.',
      newsletter: 'ابقَ على اطلاع', cta: 'انضمّ إلى أيام السلام 2027', nav: 'التنقّل', repere: 'معلومات أساسية',
      cOrg: 'المنظّم', cEdition: 'النسخة', cDates: 'التواريخ', cLieu: 'المكان',
      rights: 'جميع الحقوق محفوظة.', forPeace: 'ملتقى دولي من أجل السلام',
    },
    lang: { label: 'اللغة', switchTo: 'التبديل إلى {lang}' },
    common: { all: 'الكل', loading: 'جارٍ التحميل…', sending: 'جارٍ الإرسال…', backHome: 'العودة إلى الرئيسية' },
  },
}
