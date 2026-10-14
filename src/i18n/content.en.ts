import { MEDIA } from '../lib/images'
import type { ContentBundle } from './content'

export const EN: ContentBundle = {
  EVENT: {
    organizer: 'Doggo Management',
    name: 'Peace Days',
    edition: 'Dubai 2027',
    datesLabel: 'January 18–25, 2027',
    location: 'Dubai, United Arab Emirates',
    tagline:
      'An international gathering dedicated to peace, dialogue, culture and economic connections.',
    startISO: '2027-01-18T09:00:00+04:00',
  },

  NAV: [
    { label: 'Home', to: '/' },
    { label: 'Doggo Management', to: '/doggo' },
    { label: 'Peace Days 2027', to: '/peace-days', flagship: true },
    { label: 'Programme', to: '/peace-days/programme' },
    { label: 'The concept', to: '/peace-days/concept' },
    { label: 'Our events', to: '/evenements' },
  ],

  EXPERIENCES: [
    { no: '01', key: 'foire', title: 'The Fair', kind: 'Local products & crafts', dates: 'January 18–25', city: 'Dubai',
      blurb: 'Artisans, producers and entrepreneurs from dozens of nations. To share, to pass on, to connect — heritage and creativity in the service of economic peace.', photo: 'crafts', src: MEDIA.foire, to: '/peace-days' },
    { no: '02', key: 'forum', title: 'The Forum', kind: 'Economic · B2B / B2G', dates: 'January 19–20', city: 'Dubai',
      blurb: 'Decision-makers, investors, diplomats and entrepreneurs. Qualified meetings to turn peace initiatives into economic opportunities.', photo: 'forum', to: '/peace-days' },
    { no: '03', key: 'art', title: 'Voices of Peace', kind: 'Art exhibition', dates: 'January 21', city: 'Dubai / Abu Dhabi',
      blurb: 'Art as a universal language. Works inspired by reconciliation, harmony and hope, bringing together cultures and generations.', photo: 'artGallery', to: '/peace-days' },
    { no: '04', key: 'sport', title: 'The Gala Match', kind: 'Sport for peace', dates: 'January 22', city: 'Dubai',
      blurb: 'Ambassadors, the diplomatic corps and leaders united on the field. Sport as a tool for brotherhood, friendship and international cooperation.', photo: 'stadium', to: '/peace-days' },
    { no: '05', key: 'gala', title: 'The Gala Dinner', kind: 'Peace Medals', dates: 'January 23', city: 'Dubai',
      blurb: 'Closing ceremony and presentation of the Peace Medals. Celebrating the women, men and institutions that advance dialogue and solidarity.', photo: 'gala', src: MEDIA.dinnerGala, to: '/peace-days' },
  ],

  ROLES: [
    { no: '01', title: 'Design', text: 'Imagining bespoke international gatherings: fairs, economic forums, exhibitions, ceremonies. Each format is born from a clear intention.', photo: 'architecture' },
    { no: '02', title: 'Connect', text: 'Bringing together governments, embassies, businesses, artists and civil society around a shared vision. Creating meaningful encounters.', photo: 'handshake' },
    { no: '03', title: 'Amplify', text: 'Giving global reach to territories and exchanges, from Africa to the Gulf. Extending the impact well beyond the event.', photo: 'dubaiSunset' },
  ],

  VALUES: [
    { word: 'Dialogue', line: 'Listening before persuading. Opening spaces where differences meet.' },
    { word: 'Respect', line: 'Equal treatment of cultures, religions and beliefs.' },
    { word: 'Cooperation', line: 'Building bridges together between peoples and economies.' },
    { word: 'Transmission', line: 'Connecting legacies to the generations to come.' },
    { word: 'Action', line: 'Turning intentions of peace into concrete encounters.' },
  ],

  EXPERTISE: [
    { title: 'International events', text: 'High-level fairs, summits, ceremonies and galas, designed and managed from end to end.', photo: 'stageLights' },
    { title: 'Economic encounters', text: 'B2B and B2G forums, qualified introductions, delegations and country pavilions.', photo: 'forum' },
    { title: 'Cultural diplomacy', text: 'A network of embassies, institutions and dignitaries, from the African continent to the Gulf.', photo: 'meeting' },
    { title: 'Culture & heritage', text: 'Rooted in the Yassine Arts Center, an expertise in art, craftsmanship and living heritage.', photo: 'artWork' },
    { title: 'Innovation & tourism', text: 'Tourism development, investment promotion, destination experiences.', photo: 'dubaiMarina' },
    { title: 'Partnerships', text: 'Brand activations designed to create lasting, measurable value.', photo: 'business' },
  ],

  REFERENCES: [
    { year: '2026', title: 'Diplomatic Roundtable', place: 'Dubai · Burj Khalifa — diplomatic corps', src: MEDIA.roundtable2 },
    { year: '2026', title: 'Dubai, world capital of peace', place: 'Keynote address & assembled dignitaries', src: MEDIA.roundtable1 },
    { year: '2026', title: 'Cooperation with Senegal', place: 'Consulate of the Republic of Senegal · Dubai', src: MEDIA.senegal1 },
    { year: '2026', title: 'Cooperation with Guinea', place: 'Consulate of the Republic of Guinea · Dubai', src: MEDIA.guinea2 },
    { year: '—', title: 'Diplomacy & investment', place: 'Africa — Gulf — World', src: MEDIA.guinea1 },
  ],

  GUESTS: [
    { name: 'S.E. Isabel Paula de Castro', role: 'Consul General', country: 'Republic of Angola', src: MEDIA.guestAngola },
    { name: 'S.E. Nyandeng Deng Mangordit', role: 'Chargée d’affaires (a.i.)', country: 'Republic of South Sudan', src: MEDIA.guestSouthSudan },
  ],

  GALLERY: [
    { src: MEDIA.roundtable2, caption: 'Diplomatic Roundtable — opening, Dubai' },
    { src: MEDIA.senegal1, caption: 'Meeting at the Senegal Consulate, Dubai' },
    { src: MEDIA.roundtable1, caption: 'Keynote address — "Dubai, world capital of peace"' },
    { src: MEDIA.guinea2, caption: 'Delegation at the Guinea Consulate, Dubai' },
    { src: MEDIA.burjKhalifa, caption: 'Peace Days International — Dubai' },
    { src: MEDIA.guinea1, caption: 'Diplomatic exchanges, Guinea Consulate' },
    { src: MEDIA.senegal2, caption: 'Cultural cooperation — Senegal' },
    { src: MEDIA.roundtable3, caption: 'Roundtable — table of honour' },
    { src: MEDIA.guinea3, caption: 'Official meeting, Dubai' },
  ],

  PATRONAGES: [
    'Ministry of Culture',
    'Diplomatic corps',
    'Partner embassies',
    'International institutions',
    'Chambers of commerce',
    'Peace foundations',
  ],

  STATS: [
    { value: 8, label: 'days of gatherings' },
    { value: 5, label: 'major events' },
    { value: 40, suffix: '+', label: 'nations represented' },
    { value: 1800, suffix: '+', label: 'commitments to peace' },
  ],

  THEMES: [
    'Culture & arts for peace',
    'Sport for peace',
    'Education & awareness',
    'Sustainable development',
    'Humanitarian action',
    'Youth & women',
  ],

  SESSION_TYPES: [
    { key: 'tous', label: 'All' },
    { key: 'foire', label: 'Fair' },
    { key: 'forum', label: 'Forum' },
    { key: 'art', label: 'Art' },
    { key: 'sport', label: 'Sport' },
    { key: 'gala', label: 'Gala' },
  ],

  TYPES_COMPTE: [
    { key: 'visiteur', label: 'Visitor', hint: 'Follow the event, book, get involved' },
    { key: 'exposant', label: 'Exhibitor', hint: 'Run a stand at the Fair' },
    { key: 'partenaire', label: 'Partner', hint: 'Sponsor, institution, foundation' },
    { key: 'media', label: 'Media', hint: 'Press, accreditation, content' },
  ],

  COUNTRIES: [
    'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman',
    'France', 'Morocco', 'Senegal', "Côte d'Ivoire", 'Tunisia', 'Algeria', 'Egypt',
    'South Africa', 'Germany', 'Belgium', 'Benin', 'Brazil', 'Burkina Faso',
    'Cameroon', 'Canada', 'China', 'Congo', 'South Korea', 'Spain', 'United States',
    'Ethiopia', 'Gabon', 'Ghana', 'Guinea', 'India', 'Indonesia', 'Italy', 'Japan',
    'Jordan', 'Kenya', 'Lebanon', 'Libya', 'Mali', 'Mauritania', 'Niger', 'Nigeria',
    'Netherlands', 'Portugal', 'Democratic Republic of the Congo', 'United Kingdom',
    'Rwanda', 'Switzerland', 'Chad', 'Togo', 'Turkey', 'Other',
  ],

  PROGRAM: [
    { id: '18', day: '18', weekday: 'Mon', label: 'January 18', sessions: [
      { time: '10:00', type: 'foire', title: 'Opening of the Fair', place: 'Main hall', speaker: 'Official ceremony', blurb: 'Inauguration of the Fair of local products and crafts in the presence of the authorities.' },
      { time: '18:18', type: 'foire', title: 'The Minute for Peace', place: 'Central stage', blurb: 'A collective moment synchronised with the Peace Caravan relays around the world.' },
    ] },
    { id: '19', day: '19', weekday: 'Tue', label: 'January 19', sessions: [
      { time: '09:30', type: 'forum', title: 'Opening of the Economic Forum', place: 'Auditorium', speaker: 'Opening panel', blurb: 'Promoting the economy of peace: investment, partnerships and sustainable development.' },
      { time: '11:00', type: 'forum', title: 'B2B / B2G meetings', place: 'Matchmaking area', blurb: 'Qualified slots between decision-makers, investors and institutions.' },
      { time: '15:00', type: 'forum', title: 'Africa — Gulf: building bridges', place: 'Room A', speaker: 'Round table', blurb: 'Connecting territories through trade, innovation and diplomacy.' },
    ] },
    { id: '20', day: '20', weekday: 'Wed', label: 'January 20', sessions: [
      { time: '10:00', type: 'forum', title: 'Entrepreneurship & youth', place: 'Room B', speaker: 'Panel', blurb: 'Supporting social-impact projects and youth entrepreneurship.' },
      { time: '14:00', type: 'forum', title: 'Business meetings', place: 'Matchmaking area', blurb: 'Second wave of meetings, protocol circuit for the authorities.' },
    ] },
    { id: '21', day: '21', weekday: 'Thu', label: 'January 21', sessions: [
      { time: '11:00', type: 'art', title: 'Private view — "Voices of Peace"', place: 'Gallery', speaker: 'Selected artists', blurb: 'International exhibition: art as a universal language of peace.' },
      { time: '17:00', type: 'art', title: 'Meet the artists', place: 'Gallery', blurb: 'Conversations around works inspired by reconciliation and hope.' },
    ] },
    { id: '22', day: '22', weekday: 'Fri', label: 'January 22', sessions: [
      { time: '19:00', type: 'sport', title: 'Gala Match for Peace', place: 'Stadium', speaker: 'Ambassadors & leaders', blurb: 'Sport in the service of dialogue: an evening of brotherhood and cooperation.' },
    ] },
    { id: '23', day: '23', weekday: 'Sat', label: 'January 23', sessions: [
      { time: '20:00', type: 'gala', title: 'Gala Dinner & Peace Medals', place: 'Reception hall', speaker: 'Closing ceremony', blurb: 'Presentation of the Peace Medals and recognition of the Ambassadors.' },
    ] },
    { id: '24', day: '24', weekday: 'Sun', label: 'January 24', sessions: [
      { time: '10:00', type: 'foire', title: 'Fair — public open day', place: 'Main hall', blurb: 'Open stands, craft demonstrations and meetings with exhibitors.' },
    ] },
    { id: '25', day: '25', weekday: 'Mon', label: 'January 25', sessions: [
      { time: '17:00', type: 'foire', title: 'Closing of the Fair', place: 'Main hall', speaker: 'Closing remarks', blurb: 'Review of the week and outlook for future editions.' },
    ] },
  ],
}
