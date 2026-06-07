import { images, site } from '@/lib/site'
import { contactFaqsEn, contactFaqsNl, eventSpaceFaqsEn, eventSpaceFaqsNl, nightlifeFaqsEn, nightlifeFaqsNl, workshopFaqsEn, workshopFaqsNl } from '@/lib/faqs'
import type { AdminStore, AgendaEvent } from './types'

const now = '2026-06-04T00:00:00.000Z'


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

export const defaultAgendaEvents: AgendaEvent[] = agendaPlan.map(({ date, dj }, index) => {
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
})

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
    { key: 'nightlife', titleNl: 'Uitgaan', titleEn: 'Nightlife', heroTitleNl: 'Uitgaan bij CLINIQ', heroTitleEn: 'Nightlife at CLINIQ', heroSubtitleNl: 'Op donderdag, vrijdag en zaterdag is CLINIQ open voor clubavonden en groepen. Midden in Maastricht, met muziek, drankjes en een duidelijke agenda per avond.', heroSubtitleEn: 'On Thursday, Friday and Saturday, CLINIQ is open for club nights and groups. In central Maastricht, with music, drinks and a clear agenda per night.', bodyNl: 'Voor uitgaan Maastricht zonder anonieme massa: goede ontvangst, sterke bar en muziek die de avond opbouwt.', bodyEn: 'For Maastricht nightlife without the anonymous crowd: warm hosting, a strong bar and music that builds the night.', heroImageId: 'red-crowd', galleryImageIds: ['hero', 'club', 'party'] },
    { key: 'cocktail-workshop', titleNl: 'Cocktail Workshop', titleEn: 'Cocktail Workshop', heroTitleNl: 'Cocktail workshop Maastricht', heroTitleEn: 'Cocktail workshop at CLINIQ', heroSubtitleNl: 'Een cocktail workshop bij CLINIQ is gemaakt voor groepen die iets actiefs willen doen voordat de avond echt begint. Je maakt meerdere cocktails, krijgt begeleiding van bartenders en hebt genoeg tijd om samen te proeven, lachen en borrelen.', heroSubtitleEn: 'Step behind the bar, make cocktails and ease into the evening. The workshop works well for bachelor and bachelorette parties, team nights, birthdays and groups of friends.', bodyNl: 'Voor vrijgezellenfeesten, bedrijfsuitjes, verjaardagen en vriendengroepen in Maastricht.', bodyEn: 'For bachelorette parties, team events, birthdays and groups of friends in Maastricht.', primaryCtaNl: 'Cocktail workshop aanvragen', primaryCtaEn: 'Request workshop', heroImageId: 'workshop-bar', galleryImageIds: ['mojito', 'whiskey', 'espresso', 'passion', 'mixing'], price: 'Vanaf €45 p.p.', minimumGroupSize: 8 },
    { key: 'event-space', titleNl: 'Event Space', titleEn: 'Event Space', heroTitleNl: 'Ruimte huren in Maastricht', heroTitleEn: 'Hire CLINIQ for your event', heroSubtitleNl: 'CLINIQ is beschikbaar voor borrels, bedrijfsfeesten, verjaardagen, vrijgezellenavonden en private parties. Een locatie met bar, licht, geluid en clubgevoel.', heroSubtitleEn: 'A venue in Maastricht with bar, lighting, sound and club atmosphere. Suitable for company parties, birthdays, drinks, bachelor and bachelorette parties and private events.', bodyNl: 'Een feestzaal Maastricht met techniek, bar en hospitality in huis.', bodyEn: 'A Maastricht event space with sound, bar and hospitality in place.', primaryCtaNl: 'Aanvraag doen', primaryCtaEn: 'Request quote', heroImageId: 'red-room', galleryImageIds: ['contact-interior', 'red-crowd', 'bar'], capacity: 'Tot circa 250 gasten' },
    { key: 'contact', titleNl: 'Contact', titleEn: 'Contact', heroTitleNl: 'Contact', heroTitleEn: 'Contact', heroSubtitleNl: 'Vragen over de agenda, een cocktail workshop of het huren van CLINIQ? Neem contact met ons op of kom langs aan de Platielstraat 9A.', heroSubtitleEn: 'Questions about the agenda, a cocktail workshop or hiring CLINIQ? Contact us or visit us at Platielstraat 9A.', heroImageId: 'contact-interior', galleryImageIds: ['bar', 'footer-logo'] },
    { key: 'jobs', titleNl: 'Vacatures', titleEn: 'Jobs', heroTitleNl: 'Werken bij CLINIQ', heroTitleEn: 'Work at CLINIQ', heroSubtitleNl: 'Bar, floor en events in het centrum van Maastricht.', heroSubtitleEn: 'Bar, floor and events in the centre of Maastricht.' },
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
  leads: [],
  jobs: [{ _id: 'open', title: 'Open sollicitatie', type: 'Parttime', description: 'Wij zoeken hospitality talent voor bar, floor en events.', requirements: ['Gastvrij', 'Beschikbaar in avonden/weekenden', 'Teamspeler'], published: true }],
  settings: { phone: site.phone, email: site.email, whatsapp: site.whatsapp, address: `${site.address.street}, ${site.address.postalCode} ${site.address.city}`, openingHours: site.hours, instagram: site.instagram, tiktok: site.tiktok },
  analytics: [],
}
