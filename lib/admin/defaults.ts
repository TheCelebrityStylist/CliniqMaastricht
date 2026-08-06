import { images, site } from '@/lib/site'
import { contactFaqsEn, contactFaqsNl, eventSpaceFaqsEn, eventSpaceFaqsNl, nightlifeFaqsEn, nightlifeFaqsNl, workshopFaqsEn, workshopFaqsNl } from '@/lib/faqs'
import type { AdminStore, AgendaEvent, DjImage } from './types'

const now = '2026-06-04T00:00:00.000Z'



const defaultDjImages: DjImage[] = [
  { id: 'dj-jink', slug: 'jink', name: 'JINK', aliases: [], imageUrl: null, imageAltNl: 'DJ JINK bij CLINIQ Maastricht', imageAltEn: 'DJ JINK at CLINIQ Maastricht', active: true, updatedAt: now },
  { id: 'dj-paul-gouda', slug: 'paul-gouda', name: 'Paul Gouda', aliases: [], imageUrl: null, imageAltNl: 'DJ Paul Gouda bij CLINIQ Maastricht', imageAltEn: 'DJ Paul Gouda at CLINIQ Maastricht', active: true, updatedAt: now },
  { id: 'dj-djanbe', slug: 'djanbe', name: 'DJANBE', aliases: [], imageUrl: null, imageAltNl: 'DJ DJANBE bij CLINIQ Maastricht', imageAltEn: 'DJ DJANBE at CLINIQ Maastricht', active: true, updatedAt: now },
  { id: 'dj-hadless', slug: 'dj-hadless', name: 'DJ Hadless', aliases: ['Len'], imageUrl: null, imageAltNl: 'DJ Hadless bij CLINIQ Maastricht', imageAltEn: 'DJ Hadless at CLINIQ Maastricht', active: true, updatedAt: now },
  { id: 'dj-big-rob', slug: 'dj-big-rob', name: 'DJ BIG ROB', aliases: ['Big Rob', 'BIG ROB', 'big rob'], imageUrl: null, imageAltNl: 'DJ BIG ROB bij CLINIQ Maastricht', imageAltEn: 'DJ BIG ROB at CLINIQ Maastricht', active: true, updatedAt: now },
  { id: 'dj-sdnx', slug: 'dj-sdnx', name: 'DJ SDNX', aliases: ['Sidney'], imageUrl: null, imageAltNl: 'DJ SDNX bij CLINIQ Maastricht', imageAltEn: 'DJ SDNX at CLINIQ Maastricht', active: true, updatedAt: now },
  { id: 'dj-ak', slug: 'dj-ak', name: 'DJ AK', aliases: [], imageUrl: null, imageAltNl: 'DJ AK bij CLINIQ Maastricht', imageAltEn: 'DJ AK at CLINIQ Maastricht', active: true, updatedAt: now },
]

const agendaPlan: Array<{ date: string; dj: string }> = [
  { date: '2026-06-11', dj: 'JINK' },
  { date: '2026-06-12', dj: 'Paul Gouda' },
  { date: '2026-06-13', dj: 'DJANBE' },
  { date: '2026-06-18', dj: 'DJANBE' },
  { date: '2026-06-19', dj: 'DJ Hadless' },
  { date: '2026-06-20', dj: 'DJ BIG ROB' },
  { date: '2026-06-25', dj: 'DJ SDNX' },
  { date: '2026-06-26', dj: 'DJ BIG ROB' },
  { date: '2026-06-27', dj: 'DJ AK' },
  { date: '2026-07-02', dj: 'DJ SDNX' },
  { date: '2026-07-03', dj: 'Paul Gouda' },
  { date: '2026-07-04', dj: 'DJ BIG ROB' },
  { date: '2026-07-09', dj: 'DJ SDNX' },
  { date: '2026-07-10', dj: 'DJANBE' },
  { date: '2026-07-11', dj: 'DJ AK' },
  { date: '2026-07-16', dj: 'DJ SDNX' },
  { date: '2026-07-17', dj: 'DJ AK' },
  { date: '2026-07-18', dj: 'DJANBE' },
  { date: '2026-07-23', dj: 'JINK' },
  { date: '2026-07-24', dj: 'DJ Hadless' },
  { date: '2026-07-25', dj: 'Paul Gouda' },
  { date: '2026-07-30', dj: 'DJ Hadless' },
  { date: '2026-07-31', dj: 'DJANBE' },
  { date: '2026-08-01', dj: 'DJ BIG ROB' },
]

const eventImages = [images.redCrowd, images.club, images.party, images.hero]

// Real owner-supplied Inkom-week (student welcome week) events, wired directly rather than
// through the generic agendaPlan/defaultAgendaEvents pipeline: that pipeline assumes a uniform
// Thu/Fri/Sat weekly night (age-by-weekday, one generic subtitle/description). These are
// individually authored, one-off nights on Mon/Tue/Wed/Sun - outside the venue's normal open
// days - each with its own promo copy. Doors/close default to 22:00-03:00 (matching every other
// night) and age defaults to 18+ (student-audience events) since Sanity has no exact per-event
// times/age to pull from in this environment; both are flagged for owner confirmation in the
// report, same as the spelling of "Amphitryon" and the Aug 26 weekday (the brief says "Di 26
// aug"/Tuesday, but 26 Aug 2026 is actually a Wednesday - used the explicit date, corrected the
// weekday text). 17 Aug (soonest) is marked featured per "set the nearest upcoming as featured."
const inkomWeekEvents: AgendaEvent[] = [
  {
    _id: 'agenda-2026-08-17-amphitryon-inkom-party',
    title: 'Amphitryon Inkom Party',
    titleNl: 'Amphitryon Inkom Party',
    titleEn: 'Amphitryon Inkom Party',
    subtitleNl: 'Opening van de Inkomweek',
    subtitleEn: 'Opening night of Inkom week',
    slug: { current: '2026-08-17-amphitryon-inkom-party' },
    date: '2026-08-17',
    startTime: '22:00',
    endTime: '03:00',
    ageLimit: '18+',
    fullDescriptionNl:
      "Maandag 17 augustus barst de Inkom los bij CLINIQ. De Amphitryon-party aan de Platielstraat — dé opening van jouw studentenjaar in Maastricht. Wees erbij. Deuren 22:00 · open tot 03:00 · 18+.",
    fullDescriptionEn:
      'Monday 17 August, Inkom kicks off at CLINIQ. The Amphitryon party on Platielstraat — the opening night of your student year in Maastricht. Be there. Doors 22:00 · open until 03:00 · 18+.',
    featured: true,
    eventType: 'featured',
    showDetailCTA: true,
    published: true,
    imageUrl: images.party,
    imageAlt: 'Amphitryon Inkom Party bij CLINIQ Maastricht',
    imagePosition: 'center',
  },
  {
    _id: 'agenda-2026-08-18-inkom-pubcrawl-koko',
    title: 'Inkom Pubcrawl × Koko',
    titleNl: 'Inkom Pubcrawl × Koko',
    titleEn: 'Inkom Pubcrawl × Koko',
    subtitleNl: 'Van kroeg naar dansvloer',
    subtitleEn: 'From bars to dancefloor',
    slug: { current: '2026-08-18-inkom-pubcrawl-koko' },
    date: '2026-08-18',
    startTime: '22:00',
    endTime: '03:00',
    ageLimit: '18+',
    fullDescriptionNl:
      'Dinsdag 18 augustus strandt de Inkom pubcrawl bij CLINIQ, samen met Koko. Van de kroeg recht de dansvloer op — hier eindigt de avond. Uitgaan in Maastricht begint hier. Deuren 22:00 · open tot 03:00 · 18+.',
    fullDescriptionEn:
      'Tuesday 18 August, the Inkom pub crawl lands at CLINIQ, together with Koko. Straight from the bars onto the dancefloor — this is where the night ends. Nightlife in Maastricht starts here. Doors 22:00 · open until 03:00 · 18+.',
    featured: false,
    eventType: 'regular',
    showDetailCTA: true,
    published: true,
    imageUrl: images.club,
    imageAlt: 'Inkom Pubcrawl x Koko bij CLINIQ Maastricht',
    imagePosition: 'center',
  },
  {
    _id: 'agenda-2026-08-19-stennis-inkom-party',
    title: 'Stennis Inkom Party',
    titleNl: 'Stennis Inkom Party',
    titleEn: 'Stennis Inkom Party',
    subtitleNl: 'Midweek Inkomfeest',
    subtitleEn: 'Midweek Inkom night',
    slug: { current: '2026-08-19-stennis-inkom-party' },
    date: '2026-08-19',
    startTime: '22:00',
    endTime: '03:00',
    ageLimit: '18+',
    fullDescriptionNl:
      'Woensdag 19 augustus knalt de Stennis Inkom-party door de Platielstraat. De week van je leven, de club die niet stilstaat. Deuren 22:00 · open tot 03:00 · 18+.',
    fullDescriptionEn:
      'Wednesday 19 August, the Stennis Inkom party takes over Platielstraat. The week of your life, the club that never stops. Doors 22:00 · open until 03:00 · 18+.',
    featured: false,
    eventType: 'regular',
    showDetailCTA: true,
    published: true,
    imageUrl: images.redCrowd,
    imageAlt: 'Stennis Inkom Party bij CLINIQ Maastricht',
    imagePosition: 'center',
  },
  {
    _id: 'agenda-2026-08-26-esn-party',
    title: 'ESN Party',
    titleNl: 'ESN Party',
    titleEn: 'ESN Party',
    subtitleNl: 'Internationale studentenavond',
    subtitleEn: 'International student night',
    slug: { current: '2026-08-26-esn-party' },
    date: '2026-08-26',
    startTime: '22:00',
    endTime: '03:00',
    ageLimit: '18+',
    fullDescriptionNl:
      'Woensdag 26 augustus neemt ESN CLINIQ over. Internationale studenten, één dansvloer, Maastricht bij nacht. Wees erbij. Deuren 22:00 · open tot 03:00 · 18+.',
    fullDescriptionEn:
      'Wednesday 26 August, ESN takes over CLINIQ. International students, one dancefloor, Maastricht by night. Be there. Doors 22:00 · open until 03:00 · 18+.',
    featured: false,
    eventType: 'regular',
    showDetailCTA: true,
    published: true,
    imageUrl: images.hero,
    imageAlt: 'ESN Party bij CLINIQ Maastricht',
    imagePosition: 'center',
  },
  {
    _id: 'agenda-2026-08-30-after-preuve-john-tana',
    title: 'After Preuve × John Tana',
    titleNl: 'After Preuve × John Tana',
    titleEn: 'After Preuve × John Tana',
    subtitleNl: 'De afsluiter van Preuve',
    subtitleEn: 'The Preuve closer',
    slug: { current: '2026-08-30-after-preuve-john-tana' },
    date: '2026-08-30',
    startTime: '22:00',
    endTime: '03:00',
    ageLimit: '18+',
    fullDescriptionNl:
      'Zondag 30 augustus trek je na Preuve door naar CLINIQ. After Preuve met John Tana — de afsluiter aan de Platielstraat. Deuren 22:00 · open tot 03:00 · 18+.',
    fullDescriptionEn:
      'Sunday 30 August, head to CLINIQ after Preuve. After Preuve with John Tana — the closer on Platielstraat. Doors 22:00 · open until 03:00 · 18+.',
    featured: false,
    eventType: 'regular',
    showDetailCTA: true,
    published: true,
    imageUrl: images.crowd,
    imageAlt: 'After Preuve x John Tana bij CLINIQ Maastricht',
    imagePosition: 'center',
  },
]

export const defaultAgendaEvents: AgendaEvent[] = [...agendaPlan.map(({ date, dj }, index): AgendaEvent => {
  const day = new Date(`${date}T00:00:00`).getUTCDay()
  const isThursday = day === 4
  const startTime = '22:00'
  const endTime = isThursday ? '02:00' : '03:00'
  const ageLimit = isThursday ? '18+' : '21+'
  return {
    _id: `agenda-${date}-${dj.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
    title: dj,
    titleNl: dj,
    titleEn: dj,
    subtitleNl: 'Clubavond bij CLINIQ',
    subtitleEn: 'Club night at CLINIQ',
    slug: { current: `${date}-${dj.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}` },
    date,
    startTime,
    endTime,
    ageLimit,
    fullDescriptionNl: 'Op stap bij CLINIQ aan de Platielstraat. Muziek vanaf 22:00.',
    fullDescriptionEn: 'A night out at CLINIQ on Platielstraat. Music from 22:00.',
    featured: false,
    eventType: 'regular',
    showDetailCTA: false,
    published: true,
    imageUrl: eventImages[index % eventImages.length],
    imageAlt: `${dj} bij CLINIQ Maastricht`,
    imagePosition: 'center',
  }
}), ...inkomWeekEvents]

export const defaultStore: AdminStore = {
  media: [
    { id: 'hero', url: images.hero, title: 'Hero nightlife crowd', altNl: 'Publiek op de dansvloer van CLINIQ Maastricht met warm licht', altEn: 'Crowd on the CLINIQ Maastricht dance floor with warm lighting', usage: ['hero', 'nightlife', 'crowd', 'gallery'], recommendedPageUsage: ['home', 'nightlife'], fallbackPriority: 1, focalPoint: 'center', createdAt: now },
    { id: 'red-crowd', url: images.redCrowd, title: 'Blue red fog crowd', altNl: 'Drukke clubavond bij CLINIQ met rood en blauw licht', altEn: 'Busy CLINIQ club night with red and blue lighting', usage: ['nightlife', 'crowd', 'gallery', 'event poster'], recommendedPageUsage: ['nightlife', 'albums'], fallbackPriority: 2, focalPoint: 'center', createdAt: now },
    { id: 'red-room', url: images.redRoom, title: 'Red bar room', altNl: 'CLINIQ bar en dansvloer met rode verlichting', altEn: 'CLINIQ bar and dance floor with red lighting', usage: ['event-space', 'bar', 'gallery'], recommendedPageUsage: ['event-space', 'home'], fallbackPriority: 3, focalPoint: 'center', createdAt: now },
    { id: 'workshop-bar', url: images.workshopBar, title: 'Cocktail workshop behind the bar', altNl: 'Gasten maken cocktails achter de bar bij CLINIQ Maastricht', altEn: 'Guests making cocktails behind the bar at CLINIQ Maastricht', usage: ['cocktail', 'workshop', 'bar', 'hero'], recommendedPageUsage: ['cocktail-workshop'], fallbackPriority: 4, focalPoint: 'center', createdAt: now },
    { id: 'mojito', url: images.mojito, title: 'Mojito cocktail', altNl: 'Mojito cocktail met limoen en munt bij CLINIQ', altEn: 'Mojito cocktail with lime and mint at CLINIQ', usage: ['cocktail', 'workshop', 'bar', 'gallery'], recommendedPageUsage: ['cocktail-workshop'], fallbackPriority: 5, focalPoint: 'center', createdAt: now },
    { id: 'espresso', url: images.espresso, title: 'Espresso martini cocktail', altNl: 'Cocktail in coupeglas op de bar van CLINIQ', altEn: 'Cocktail in a coupe glass on the CLINIQ bar', usage: ['cocktail', 'bar', 'gallery'], recommendedPageUsage: ['cocktail-workshop'], fallbackPriority: 6, focalPoint: 'center', createdAt: now },
    { id: 'passion', url: images.passion, title: 'Passion fruit cocktail', altNl: 'Passievrucht cocktail bij CLINIQ Maastricht', altEn: 'Passion fruit cocktail at CLINIQ Maastricht', usage: ['cocktail', 'workshop', 'gallery'], recommendedPageUsage: ['cocktail-workshop'], fallbackPriority: 7, focalPoint: 'center', createdAt: now },
    { id: 'contact-interior', url: images.contactInterior, title: 'CLINIQ interior bar detail', altNl: 'Interieur van CLINIQ Maastricht met bar en warm licht', altEn: 'CLINIQ Maastricht interior with bar and warm light', usage: ['contact', 'event-space', 'bar', 'gallery'], recommendedPageUsage: ['contact', 'event-space'], fallbackPriority: 8, focalPoint: 'center', createdAt: now },
    { id: 'footer-logo', url: images.footerLogo, title: 'CLINIQ Maastricht logo', altNl: 'CLINIQ Maastricht logo', altEn: 'CLINIQ Maastricht logo', usage: ['contact', 'gallery'], recommendedPageUsage: ['contact'], fallbackPriority: 11, focalPoint: 'center', createdAt: now },
    { id: 'club', url: images.club, title: 'CLINIQ club night', altNl: 'Dansvloer bij CLINIQ Maastricht', altEn: 'Dance floor at CLINIQ Maastricht', usage: ['event poster', 'nightlife', 'gallery'], recommendedPageUsage: ['nightlife'], fallbackPriority: 9, focalPoint: 'center', createdAt: now },
    { id: 'party', url: images.party, title: 'Warm party atmosphere', altNl: 'Feestavond bij CLINIQ Maastricht', altEn: 'Party night at CLINIQ Maastricht', usage: ['nightlife', 'gallery', 'event poster'], recommendedPageUsage: ['home', 'albums'], fallbackPriority: 10, focalPoint: 'center', createdAt: now },
    { id: 'whiskey', url: images.whiskey, title: 'Whiskey cocktail', altNl: 'Cocktail met sinaasappelgarnering op de bar van CLINIQ', altEn: 'Cocktail with orange garnish on the CLINIQ bar', usage: ['cocktail', 'bar', 'gallery'], recommendedPageUsage: ['cocktail-workshop'], fallbackPriority: 12, focalPoint: 'center', createdAt: now },
    { id: 'mixing', url: images.mixing, title: 'Cocktail mixing detail', altNl: 'Cocktail wordt gemixt aan de bar van CLINIQ', altEn: 'Cocktail being mixed at the CLINIQ bar', usage: ['cocktail', 'workshop', 'bar', 'gallery'], recommendedPageUsage: ['cocktail-workshop'], fallbackPriority: 13, focalPoint: 'center', createdAt: now },
  ],
  events: defaultAgendaEvents,
  pages: [
    { key: 'home', titleNl: 'Homepage', titleEn: 'Homepage', heroTitleNl: 'CLINIQ Maastricht', heroTitleEn: 'CLINIQ Maastricht', heroSubtitleNl: 'Uitgaan, events en workshops aan de Platielstraat.', heroSubtitleEn: 'Nights out, events and workshops on Platielstraat.', bodyNl: '', bodyEn: '', primaryCtaNl: 'Bekijk agenda', primaryCtaEn: 'View agenda', secondaryCtaNl: 'Ruimte huren', secondaryCtaEn: 'Hire the venue', heroImageId: 'hero', galleryImageIds: ['red-crowd', 'bar', 'workshop-bar', 'party', 'club', 'contact-interior'] },
    { key: 'nightlife', titleNl: 'Uitgaan', titleEn: 'Nightlife', heroTitleNl: 'Uitgaan in Maastricht', heroTitleEn: 'Nightlife in Maastricht', heroSubtitleNl: 'Donderdag (18+), vrijdag en zaterdag (21+) open vanaf 22:00. Platielstraat 9A, midden in het centrum.', heroSubtitleEn: 'Thursday (18+), Friday and Saturday (21+) from 22:00. Platielstraat 9A, central Maastricht.', bodyNl: 'Voor uitgaan Maastricht zonder anonieme massa: goede ontvangst, sterke bar en muziek die de avond opbouwt.', bodyEn: 'For Maastricht nightlife without the anonymous crowd: warm hosting, a strong bar and music that builds the night.', heroImageId: 'red-crowd', galleryImageIds: ['hero', 'club', 'party'] },
    { key: 'cocktail-workshop', titleNl: 'Cocktail Workshop', titleEn: 'Cocktail Workshop', heroTitleNl: 'Cocktail workshop Maastricht', heroTitleEn: 'Cocktail workshop at CLINIQ', heroSubtitleNl: 'Voor groepen van 15+. Cocktails maken, daarna de avond in.', heroSubtitleEn: 'For groups of 15 or more. Make cocktails, then stay for the night.', bodyNl: 'Voor vrijgezellenfeesten, bedrijfsuitjes, verjaardagen en vriendengroepen in Maastricht.', bodyEn: 'For bachelorette parties, team events, birthdays and groups of friends in Maastricht.', primaryCtaNl: 'Cocktail workshop aanvragen', primaryCtaEn: 'Request workshop', heroImageId: 'workshop-bar', galleryImageIds: ['mojito', 'whiskey', 'espresso', 'passion', 'mixing'], price: '€15 per cocktail', minimumGroupSize: 15 },
    { key: 'event-space', titleNl: 'Event Space', titleEn: 'Event Space', heroTitleNl: 'Ruimte huren in Maastricht', heroTitleEn: 'Hire CLINIQ for your event', heroSubtitleNl: 'Exclusief te huren voor feesten, bedrijfsevents en private parties. Tot 400 personen.', heroSubtitleEn: 'Available for private hire. Parties, corporate events and launches. Up to 400 guests.', bodyNl: 'Een feestzaal Maastricht met techniek, bar en hospitality in huis.', bodyEn: 'A Maastricht event space with sound, bar and hospitality in place.', primaryCtaNl: 'Aanvraag doen', primaryCtaEn: 'Request quote', heroImageId: 'red-room', galleryImageIds: ['contact-interior', 'red-crowd', 'bar'], capacity: 'Tot 400 personen' },
    { key: 'contact', titleNl: 'Contact', titleEn: 'Contact', heroTitleNl: 'Contact', heroTitleEn: 'Contact', heroSubtitleNl: 'Vragen over de agenda, een cocktail workshop of het huren van CLINIQ? Neem contact met ons op of kom langs aan de Platielstraat 9A.', heroSubtitleEn: 'Questions about the agenda, a cocktail workshop or hiring CLINIQ? Contact us or visit us at Platielstraat 9A.', heroImageId: 'contact-interior', galleryImageIds: ['bar', 'footer-logo'] },
    { key: 'jobs', titleNl: 'Vacatures', titleEn: 'Jobs', heroTitleNl: 'Werken bij CLINIQ', heroTitleEn: 'Work at CLINIQ', heroSubtitleNl: 'Bij Cliniq werk je op de avonden dat anderen op stap gaan. Goed team, goede energie. Zin om erbij te horen?', heroSubtitleEn: 'At Cliniq you work the nights others go out. Good team, good atmosphere. Want in?' },
    { key: 'house-rules', titleNl: 'House Rules', titleEn: 'House Rules', heroTitleNl: 'House rules', heroTitleEn: 'House rules', heroSubtitleNl: 'Neem je ID mee. Respecteer elkaar. Volg het deurbeleid.', heroSubtitleEn: 'Bring ID. Respect each other. Follow the door policy.' },
  ],
  faqs: [
    ...workshopFaqsNl.map((item, index) => ({ id: `workshop-nl-${index + 1}`, pageKey: 'cocktail-workshop', language: 'nl' as const, question: item.question, answer: item.answer, published: true, order: index + 1 })),
    ...workshopFaqsEn.map((item, index) => ({ id: `workshop-en-${index + 1}`, pageKey: 'cocktail-workshop', language: 'en' as const, question: item.question, answer: item.answer, published: true, order: index + 1 })),
    ...eventSpaceFaqsNl.map((item, index) => ({ id: `event-space-nl-${index + 1}`, pageKey: 'event-space', language: 'nl' as const, question: item.question, answer: item.answer, published: true, order: index + 1 })),
    ...eventSpaceFaqsEn.map((item, index) => ({ id: `event-space-en-${index + 1}`, pageKey: 'event-space', language: 'en' as const, question: item.question, answer: item.answer, published: true, order: index + 1 })),
    ...nightlifeFaqsNl.map((item, index) => ({ id: `nightlife-nl-${index + 1}`, pageKey: 'nightlife', language: 'nl' as const, question: item.question, answer: item.answer, published: true, order: index + 1 })),
    ...nightlifeFaqsEn.map((item, index) => ({ id: `nightlife-en-${index + 1}`, pageKey: 'nightlife', language: 'en' as const, question: item.question, answer: item.answer, published: true, order: index + 1 })),
    ...contactFaqsNl.map((item, index) => ({ id: `contact-nl-${index + 1}`, pageKey: 'contact', language: 'nl' as const, question: item.question, answer: item.answer, published: true, order: index + 1 })),
    ...contactFaqsEn.map((item, index) => ({ id: `contact-en-${index + 1}`, pageKey: 'contact', language: 'en' as const, question: item.question, answer: item.answer, published: true, order: index + 1 })),
  ],
  albums: [
    { id: 'cliniq-friday-album', slug: 'cliniq-friday-12-june', titleNl: 'CLINIQ Friday — 12 juni', titleEn: 'CLINIQ Friday — 12 June', date: '2026-06-12', relatedEventId: 'agenda-2026-06-12-paul-gouda', coverImageId: 'red-crowd', imageIds: ['red-crowd', 'hero', 'party', 'red-room'], published: true, descriptionNl: 'Foto’s van CLINIQ Friday aan de Platielstraat.', descriptionEn: 'Photos from CLINIQ Friday on Platielstraat.', createdAt: now },
    { id: 'cocktail-workshop-album', slug: 'cocktail-workshop-maastricht', titleNl: 'Cocktail workshops bij CLINIQ', titleEn: 'Cocktail workshops at CLINIQ', date: '2026-06-04', coverImageId: 'workshop-bar', imageIds: ['workshop-bar', 'mojito', 'whiskey', 'espresso', 'passion', 'mixing'], published: true, descriptionNl: 'Shakers, glaswerk en cocktails achter de bar bij CLINIQ.', descriptionEn: 'Shakers, glassware and cocktails behind the CLINIQ bar.', createdAt: now },
  ],
  seo: [],
  djImages: defaultDjImages,
  leads: [],
  jobs: [{ _id: 'open', title: 'Open sollicitatie', type: 'Parttime', description: 'Je staat drie avonden per week achter de bar van een van de drukste clubs van Maastricht. Goed in multitasken, kalm onder druk, altijd vriendelijk. Ervaring is een pré maar geen must.', requirements: ['Gastvrij', 'Beschikbaar in avonden/weekenden', 'Teamspeler'], published: true }],
  settings: { phone: site.phone, email: site.email, whatsapp: site.whatsapp, address: `${site.address.street}, ${site.address.postalCode} ${site.address.city}`, openingHours: site.hours, instagram: site.instagram, tiktok: site.tiktok },
  analytics: [],
}
