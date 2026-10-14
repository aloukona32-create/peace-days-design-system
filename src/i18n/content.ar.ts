import { MEDIA } from '../lib/images'
import type { ContentBundle } from './content'

// Arabe standard moderne (registre diplomatique / événementiel). Même forme
// que la source française (lib/content.ts) ; seuls les textes sont traduits.
// Les champs structurels (clés, photos, routes, dates ISO, types) restent
// identiques, ainsi que les marques « Doggo Management » et « Peace Days ».

export const AR: ContentBundle = {
  EVENT: {
    organizer: 'Doggo Management',
    name: 'Peace Days',
    edition: 'دبي 2027',
    datesLabel: '18 — 25 يناير 2027',
    location: 'دبي، الإمارات العربية المتحدة',
    tagline:
      'موعد دولي حول السلام والحوار والثقافة والروابط الاقتصادية.',
    startISO: '2027-01-18T09:00:00+04:00',
  },

  NAV: [
    { label: 'الرئيسية', to: '/' },
    { label: 'Doggo Management', to: '/doggo' },
    { label: 'Peace Days 2027', to: '/peace-days', flagship: true },
    { label: 'البرنامج', to: '/peace-days/programme' },
    { label: 'المفهوم', to: '/peace-days/concept' },
    { label: 'فعالياتنا', to: '/evenements' },
  ],

  EXPERIENCES: [
    {
      no: '01',
      key: 'foire',
      title: 'المعرض',
      kind: 'منتجات محلية وحِرف يدوية',
      dates: '18 — 25 يناير',
      city: 'دبي',
      blurb:
        'حرفيون ومنتجون ورواد أعمال من عشرات الدول. التعريف والنقل والربط — التراث والإبداع في خدمة السلام الاقتصادي.',
      photo: 'crafts',
      src: MEDIA.foire,
      to: '/peace-days',
    },
    {
      no: '02',
      key: 'forum',
      title: 'المنتدى',
      kind: 'اقتصادي · B2B / B2G',
      dates: '19 — 20 يناير',
      city: 'دبي',
      blurb:
        'صُنّاع القرار والمستثمرون والدبلوماسيون ورواد الأعمال. لقاءات نوعية لتحويل مبادرات السلام إلى فرص اقتصادية.',
      photo: 'forum',
      to: '/peace-days',
    },
    {
      no: '03',
      key: 'art',
      title: 'أصوات السلام',
      kind: 'معرض فني',
      dates: '21 يناير',
      city: 'دبي / أبوظبي',
      blurb:
        'الفن بوصفه لغة عالمية. أعمال مستوحاة من المصالحة والوئام والأمل، تجمع الثقافات والأجيال.',
      photo: 'artGallery',
      to: '/peace-days',
    },
    {
      no: '04',
      key: 'sport',
      title: 'مباراة الغالا',
      kind: 'الرياضة من أجل السلام',
      dates: '22 يناير',
      city: 'دبي',
      blurb:
        'سفراء وأعضاء السلك الدبلوماسي وقادة يجتمعون في الملعب. الرياضة أداةً للأخوة والصداقة والتعاون الدولي.',
      photo: 'stadium',
      to: '/peace-days',
    },
    {
      no: '05',
      key: 'gala',
      title: 'عشاء الغالا',
      kind: 'أوسمة السلام',
      dates: '23 يناير',
      city: 'دبي',
      blurb:
        'حفل الختام وتسليم أوسمة السلام. تكريم النساء والرجال والمؤسسات الذين يدفعون الحوار والتضامن قُدُمًا.',
      photo: 'gala',
      src: MEDIA.dinnerGala,
      to: '/peace-days',
    },
  ],

  ROLES: [
    {
      no: '01',
      title: 'التصميم',
      text: 'ابتكار مواعيد دولية مصمَّمة خصيصًا: معارض تجارية ومنتديات اقتصادية ومعارض فنية ومراسم احتفالية. كل صيغة تولد من نيّة واضحة.',
      photo: 'architecture',
    },
    {
      no: '02',
      title: 'الربط',
      text: 'جمع الحكومات والسفارات والشركات والفنانين والمجتمع المدني حول رؤية مشتركة. صناعة لقاءات مثمرة.',
      photo: 'handshake',
    },
    {
      no: '03',
      title: 'الإشعاع',
      text: 'منح الأقاليم والمبادلات بُعدًا عالميًا، من أفريقيا إلى الخليج. إطالة الأثر إلى ما هو أبعد من الحدث بكثير.',
      photo: 'dubaiSunset',
    },
  ],

  VALUES: [
    { word: 'الحوار', line: 'الإنصات قبل الإقناع. فتح مساحات تلتقي فيها الاختلافات.' },
    { word: 'الاحترام', line: 'المساواة في معاملة الثقافات والأديان والقناعات.' },
    { word: 'التعاون', line: 'بناء الجسور معًا بين الشعوب والاقتصادات.' },
    { word: 'النقل', line: 'وصل الموروثات بالأجيال القادمة.' },
    { word: 'الفعل', line: 'تحويل نوايا السلام إلى لقاءات ملموسة.' },
  ],

  EXPERTISE: [
    {
      title: 'فعاليات دولية',
      text: 'معارض وقمم ومراسم وحفلات رفيعة المستوى، تُصمَّم وتُدار من البداية إلى النهاية.',
      photo: 'stageLights',
    },
    {
      title: 'لقاءات اقتصادية',
      text: 'منتديات B2B وB2G، وربط نوعي، ووفود وأجنحة دول.',
      photo: 'forum',
    },
    {
      title: 'دبلوماسية ثقافية',
      text: 'شبكة من السفارات والمؤسسات وكبار الشخصيات، من القارة الأفريقية إلى الخليج.',
      photo: 'meeting',
    },
    {
      title: 'الثقافة والتراث',
      text: 'نابعة من Yassine Arts Center، خبرة في الفن والحِرف اليدوية والتراث الحي.',
      photo: 'artWork',
    },
    {
      title: 'الابتكار والسياحة',
      text: 'تنمية سياحية، وترويج للاستثمار، وتجارب وجهات.',
      photo: 'dubaiMarina',
    },
    {
      title: 'الشراكات',
      text: 'تفعيلات للعلامات التجارية مصمَّمة لخلق قيمة مستدامة وقابلة للقياس.',
      photo: 'business',
    },
  ],

  REFERENCES: [
    { year: '2026', title: 'الطاولة المستديرة الدبلوماسية', place: 'دبي · برج خليفة — السلك الدبلوماسي', src: MEDIA.roundtable2 },
    { year: '2026', title: 'دبي، مركز السلام العالمي', place: 'كلمة وحضور كبار الشخصيات', src: MEDIA.roundtable1 },
    { year: '2026', title: 'التعاون مع السنغال', place: 'قنصلية جمهورية السنغال · دبي', src: MEDIA.senegal1 },
    { year: '2026', title: 'التعاون مع غينيا', place: 'قنصلية جمهورية غينيا · دبي', src: MEDIA.guinea2 },
    { year: '—', title: 'الدبلوماسية والاستثمار', place: 'أفريقيا — الخليج — العالم', src: MEDIA.guinea1 },
  ],

  GUESTS: [
    {
      name: 'S.E. Isabel Paula de Castro',
      role: 'القنصل العام',
      country: 'جمهورية أنغولا',
      src: MEDIA.guestAngola,
    },
    {
      name: 'S.E. Nyandeng Deng Mangordit',
      role: 'القائم بالأعمال (بالنيابة)',
      country: 'جمهورية جنوب السودان',
      src: MEDIA.guestSouthSudan,
    },
  ],

  GALLERY: [
    { src: MEDIA.roundtable2, caption: 'الطاولة المستديرة الدبلوماسية — الافتتاح، دبي' },
    { src: MEDIA.senegal1, caption: 'لقاء في قنصلية السنغال، دبي' },
    { src: MEDIA.roundtable1, caption: 'كلمة — «دبي، مركز السلام العالمي»' },
    { src: MEDIA.guinea2, caption: 'وفد في قنصلية غينيا، دبي' },
    { src: MEDIA.burjKhalifa, caption: 'Peace Days International — دبي' },
    { src: MEDIA.guinea1, caption: 'تبادلات دبلوماسية، قنصلية غينيا' },
    { src: MEDIA.senegal2, caption: 'تعاون ثقافي — السنغال' },
    { src: MEDIA.roundtable3, caption: 'الطاولة المستديرة — طاولة الشرف' },
    { src: MEDIA.guinea3, caption: 'لقاء رسمي، دبي' },
  ],

  PATRONAGES: [
    'وزارة الثقافة',
    'السلك الدبلوماسي',
    'سفارات شريكة',
    'مؤسسات دولية',
    'غرف التجارة',
    'مؤسسات من أجل السلام',
  ],

  STATS: [
    { value: 8, label: 'أيام من اللقاءات' },
    { value: 5, label: 'مواعيد كبرى' },
    { value: 40, suffix: '+', label: 'دولة ممثَّلة' },
    { value: 1800, suffix: '+', label: 'التزام من أجل السلام' },
  ],

  THEMES: [
    'الثقافة والفنون من أجل السلام',
    'الرياضة من أجل السلام',
    'التعليم والتوعية',
    'التنمية المستدامة',
    'العمل الإنساني',
    'الشباب والمرأة',
  ],

  SESSION_TYPES: [
    { key: 'tous', label: 'الكل' },
    { key: 'foire', label: 'المعرض' },
    { key: 'forum', label: 'المنتدى' },
    { key: 'art', label: 'الفن' },
    { key: 'sport', label: 'الرياضة' },
    { key: 'gala', label: 'الغالا' },
  ],

  TYPES_COMPTE: [
    { key: 'visiteur', label: 'زائر', hint: 'متابعة الحدث والحجز والمشاركة' },
    { key: 'exposant', label: 'عارض', hint: 'إدارة جناح في المعرض' },
    { key: 'partenaire', label: 'شريك', hint: 'راعٍ أو مؤسسة أو هيئة' },
    { key: 'media', label: 'إعلام', hint: 'صحافة واعتماد ومحتوى' },
  ],

  COUNTRIES: [
    'الإمارات العربية المتحدة', 'المملكة العربية السعودية', 'قطر', 'الكويت', 'البحرين', 'عُمان',
    'فرنسا', 'المغرب', 'السنغال', 'ساحل العاج', 'تونس', 'الجزائر', 'مصر',
    'جنوب أفريقيا', 'ألمانيا', 'بلجيكا', 'بنين', 'البرازيل', 'بوركينا فاسو',
    'الكاميرون', 'كندا', 'الصين', 'الكونغو', 'كوريا الجنوبية', 'إسبانيا', 'الولايات المتحدة',
    'إثيوبيا', 'الغابون', 'غانا', 'غينيا', 'الهند', 'إندونيسيا', 'إيطاليا', 'اليابان',
    'الأردن', 'كينيا', 'لبنان', 'ليبيا', 'مالي', 'موريتانيا', 'النيجر', 'نيجيريا',
    'هولندا', 'البرتغال', 'جمهورية الكونغو الديمقراطية', 'المملكة المتحدة',
    'رواندا', 'سويسرا', 'تشاد', 'توغو', 'تركيا', 'أخرى',
  ],

  PROGRAM: [
    {
      id: '18',
      day: '18',
      weekday: 'الإثنين',
      label: '18 يناير',
      sessions: [
        { time: '10:00', type: 'foire', title: 'افتتاح المعرض', place: 'القاعة الرئيسية', speaker: 'مراسم رسمية', blurb: 'تدشين معرض المنتجات المحلية والحِرف اليدوية بحضور السلطات.' },
        { time: '18:18', type: 'foire', title: 'دقيقة السلام', place: 'المنصة المركزية', blurb: 'لحظة جماعية متزامنة مع محطات Peace Caravan حول العالم.' },
      ],
    },
    {
      id: '19',
      day: '19',
      weekday: 'الثلاثاء',
      label: '19 يناير',
      sessions: [
        { time: '09:30', type: 'forum', title: 'افتتاح المنتدى الاقتصادي', place: 'المدرَّج', speaker: 'جلسة افتتاحية', blurb: 'تعزيز اقتصاد السلام: الاستثمار والشراكات والتنمية المستدامة.' },
        { time: '11:00', type: 'forum', title: 'لقاءات B2B / B2G', place: 'منطقة التوفيق بين الأعمال', blurb: 'مواعيد نوعية بين صُنّاع القرار والمستثمرين والمؤسسات.' },
        { time: '15:00', type: 'forum', title: 'أفريقيا — الخليج: بناء الجسور', place: 'القاعة A', speaker: 'طاولة مستديرة', blurb: 'ربط الأقاليم عبر التجارة والابتكار والدبلوماسية.' },
      ],
    },
    {
      id: '20',
      day: '20',
      weekday: 'الأربعاء',
      label: '20 يناير',
      sessions: [
        { time: '10:00', type: 'forum', title: 'ريادة الأعمال والشباب', place: 'القاعة B', speaker: 'جلسة حوارية', blurb: 'دعم المشاريع ذات الأثر الاجتماعي وريادة أعمال الشباب.' },
        { time: '14:00', type: 'forum', title: 'مواعيد أعمال', place: 'منطقة التوفيق بين الأعمال', blurb: 'موجة ثانية من اللقاءات، ومسار بروتوكولي للسلطات.' },
      ],
    },
    {
      id: '21',
      day: '21',
      weekday: 'الخميس',
      label: '21 يناير',
      sessions: [
        { time: '11:00', type: 'art', title: 'افتتاح معرض «أصوات السلام»', place: 'صالة العرض', speaker: 'فنانون مختارون', blurb: 'معرض دولي: الفن بوصفه لغة عالمية للسلام.' },
        { time: '17:00', type: 'art', title: 'لقاء مع الفنانين', place: 'صالة العرض', blurb: 'حوارات حول الأعمال المستوحاة من المصالحة والأمل.' },
      ],
    },
    {
      id: '22',
      day: '22',
      weekday: 'الجمعة',
      label: '22 يناير',
      sessions: [
        { time: '19:00', type: 'sport', title: 'مباراة الغالا من أجل السلام', place: 'الملعب', speaker: 'سفراء وقادة', blurb: 'الرياضة في خدمة الحوار: أمسية أخوّة وتعاون.' },
      ],
    },
    {
      id: '23',
      day: '23',
      weekday: 'السبت',
      label: '23 يناير',
      sessions: [
        { time: '20:00', type: 'gala', title: 'عشاء الغالا وأوسمة السلام', place: 'قاعة الاستقبال', speaker: 'حفل الختام', blurb: 'تسليم أوسمة السلام وتكريم السفراء.' },
      ],
    },
    {
      id: '24',
      day: '24',
      weekday: 'الأحد',
      label: '24 يناير',
      sessions: [
        { time: '10:00', type: 'foire', title: 'المعرض — يوم الجمهور العام', place: 'القاعة الرئيسية', blurb: 'أجنحة مفتوحة وعروض حرفية ولقاءات مع العارضين.' },
      ],
    },
    {
      id: '25',
      day: '25',
      weekday: 'الإثنين',
      label: '25 يناير',
      sessions: [
        { time: '17:00', type: 'foire', title: 'ختام المعرض', place: 'القاعة الرئيسية', speaker: 'كلمة ختامية', blurb: 'حصيلة الأسبوع وآفاق النسخ المقبلة.' },
      ],
    },
  ],
}
