export type Lang = 'nl' | 'en'

export const languageNames: Record<Lang, string> = { nl: 'Nederlands', en: 'English' }

export const localizedPaths: Record<string, { nl: string; en: string }> = {
  home: { nl: '/', en: '/en' },
  nightlife: { nl: '/uitgaan', en: '/en/nightlife' },
  workshop: { nl: '/cocktail-workshop', en: '/en/cocktail-workshop' },
  eventSpace: { nl: '/event-space', en: '/en/event-space' },
  contact: { nl: '/contact', en: '/en/contact' },
  jobs: { nl: '/vacatures', en: '/en/jobs' },
  houseRules: { nl: '/house-rules', en: '/en/house-rules' },
  albums: { nl: '/fotos', en: '/en/photos' },
}

export const switchPathMap = new Map<string, string>([
  ...Object.values(localizedPaths).flatMap((paths) => [[paths.nl, paths.en], [paths.en, paths.nl]] as const),
  ['/albums', '/en/photos'],
  ['/en/albums', '/fotos'],
])

export function getLanguageFromPath(pathname = ''): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'nl'
}

export function getSwitchPath(pathname: string): string {
  const direct = switchPathMap.get(pathname)
  if (direct) return direct
  const albumNl = pathname.match(/^\/fotos\/(.+)$/) || pathname.match(/^\/albums\/(.+)$/)
  if (albumNl) return `/en/photos/${albumNl[1]}`
  const albumEn = pathname.match(/^\/en\/photos\/(.+)$/) || pathname.match(/^\/en\/albums\/(.+)$/)
  if (albumEn) return `/fotos/${albumEn[1]}`
  return getLanguageFromPath(pathname) === 'nl' ? '/en' : '/'
}

export const navItems = [
  { key: 'nightlife', labels: { nl: 'Uitgaan', en: 'Nightlife' } },
  { key: 'workshop', labels: { nl: 'Cocktail workshop', en: 'Cocktail workshop' } },
  { key: 'eventSpace', labels: { nl: 'Ruimte huren', en: 'Venue hire' } },
  { key: 'albums', labels: { nl: 'Foto’s', en: 'Photos' } },
  { key: 'contact', labels: { nl: 'Contact', en: 'Contact' } },
] as const

export const pageMeta = {
  home: {
    nl: { title: 'CLINIQ Maastricht — Club, Events & Workshops | Platielstraat', description: 'Op stap in Maastricht? Cliniq is open elke donderdag, vrijdag en zaterdag aan de Platielstraat 9A. Club, feestlocatie en cocktail workshops in hartje Maastricht.' },
    en: { title: 'CLINIQ Maastricht — Club, Events & Workshops | Platielstraat', description: 'Going out in Maastricht? Cliniq is open every Thursday, Friday and Saturday on Platielstraat 9A. Club nights, private hire and cocktail workshops in central Maastricht.' },
  },
  nightlife: {
    nl: { title: 'Uitgaan Maastricht | Club Cliniq — Do, Vr & Za open', description: 'Cliniq Maastricht is hét adres voor een avondje stappen. Donderdag 18+, vrijdag en zaterdag 21+ open vanaf 22:00 aan de Platielstraat 9A. Bekijk de agenda.' },
    en: { title: 'Nightlife Maastricht | Club Cliniq — Open Thu, Fri & Sat', description: "Cliniq is Maastricht's go-to club, open Thursday (18+), Friday and Saturday (21+) from 22:00 on Platielstraat 9A. Check the agenda." },
  },
  workshop: {
    nl: { title: 'Cocktail Workshop Maastricht | Cliniq — Vrijgezellenfeest & Bedrijfsuitje', description: 'Organiseer een cocktail workshop in Maastricht bij Cliniq. Voor groepen van 15+, €15 per cocktail. Ideaal voor vrijgezellenfeesten en bedrijfsuitjes.' },
    en: { title: 'Cocktail Workshop Maastricht | Cliniq — Hen Party & Team Outing', description: 'Book a cocktail workshop in Maastricht at Cliniq. Groups of 15+, €15 per cocktail. Perfect for hen parties and corporate outings.' },
  },
  eventSpace: {
    nl: { title: 'Ruimte Huren Maastricht | Feestzaal Cliniq — Tot 400 personen', description: 'Feestlocatie of eventruimte huren in Maastricht? Cliniq biedt exclusieve zaalverhuur tot 400 personen. Voor privéfeesten, bedrijfsevents en vrijgezellenavonden.' },
    en: { title: 'Hire Venue Maastricht | Event Space Cliniq — Up to 400 guests', description: 'Looking to hire a venue in Maastricht? Cliniq offers exclusive event space for up to 400 guests. Private parties, corporate events and hen nights.' },
  },
  contact: {
    nl: { title: 'Contact | CLINIQ Maastricht — Platielstraat 9A', description: 'Neem contact op met Cliniq Maastricht. Platielstraat 9A, 6211 GV Maastricht. Open do, vr en za. Vragen over lockers, dresscode of ruimte huren? Wij helpen snel.' },
    en: { title: 'Contact | CLINIQ Maastricht — Platielstraat 9A', description: 'Get in touch with Cliniq Maastricht. Platielstraat 9A, 6211 GV Maastricht. Open Thu, Fri and Sat.' },
  },
  jobs: {
    nl: { title: 'Vacatures Maastricht nightlife | Werken bij Cliniq', description: 'Bekijk vacatures bij Cliniq Maastricht en solliciteer voor bar, host, security en event functies in een sterk nachtteam.' },
    en: { title: 'Jobs in Maastricht nightlife | Work at Cliniq', description: 'Explore jobs at Cliniq Maastricht and apply for bar, host, floor, security and event roles in a sharp nightlife team.' },
  },
  houseRules: {
    nl: { title: 'House rules Cliniq Maastricht | Huisregels & deurbeleid', description: 'Lees de huisregels, leeftijdsbeleid, ID vereisten en veiligheidsregels van Cliniq Maastricht.' },
    en: { title: 'House rules Cliniq Maastricht | Door policy & safety', description: 'Read Cliniq Maastricht house rules, age policy, ID requirements, door policy and safety standards.' },
  },
} as const

export const ui = {
  nl: {
    nav: { cta: 'Aanvragen', agenda: 'Agenda', switchTo: 'EN', main: 'Hoofdnavigatie' },
    common: { viewAgenda: 'Bekijk agenda', requestVenue: 'Ruimte huren', contact: 'Neem contact op', bookWorkshop: 'Workshop aanvragen', allEvents: 'Alle events', allPhotos: 'Bekijk alle foto’s', photos: 'foto’s', previous: 'Vorige', next: 'Volgende', backAlbums: 'Alle foto’s', select: 'Selecteer…' },
    home: { eyebrow: 'Platielstraat 9A', hero: 'CLINIQ Maastricht', intro: 'Uitgaan, events en workshops aan de Platielstraat.', proof: ['Platielstraat 9A', 'Club', 'Workshops', 'Events'], whyEyebrow: 'Foto’s', whyTitle: 'Foto’s', whyText: '', plan: 'Neem contact op', eventsTitle: 'Dit speelt er', eventsText: 'De eerstvolgende avonden bij CLINIQ.', noEventsTitle: 'Nieuwe events volgen.', noEventsText: '', albumsTitle: 'Foto’s', albumsText: 'Recente avonden bij CLINIQ.', readyTitle: 'CLINIQ Maastricht', readyText: 'Platielstraat 9A, Maastricht.', heroCta2: "Foto's bekijken", nightBody: 'Donderdag, vrijdag en zaterdag open. Op stap in Maastricht? Cliniq is de plek.', cultureLabel: 'Clubavonden', cultureTitle: 'Drie avonden.\nElke week.', cultureBody: 'Donderdag (18+), vrijdag en zaterdag (21+) open vanaf 22:00. Gewoon op stap, met een goed programma.', spaceBody: 'Cliniq is beschikbaar voor privéfeesten, vrijgezellenavonden, bedrijfsfeesten en productlanceringen. Tot 400 personen, exclusief gebruik, altijd met eigen bar.', workshopBody: 'Cocktails leren maken met je groep. Begeleiding door onze bartenders, daarna gewoon blijven voor de avond.' },
    albums: { eyebrow: 'Foto’s', title: 'Zo ziet\nCliniq eruit.', intro: 'Sfeerimpressies van clubavonden, events en workshops op de Platielstraat.', detailIntro: 'Foto’s van deze avond bij CLINIQ.', metaTitle: "Foto's | CLINIQ Maastricht — Clubavonden & Events", metaDescription: "Bekijk sfeerimpressies van Cliniq Maastricht. Foto's van clubavonden, events en cocktail workshops aan de Platielstraat 9A.", albumLabel: 'Albums', emptyTitle: "Nog geen foto's", emptyBody: 'Binnenkort worden hier nieuwe albums geplaatst. Volg ons op Instagram voor updates.', seoText: "Bekijk clubfoto's van Cliniq Maastricht. Sfeerimpressies van uitgaansavonden, feesten en cocktail workshops op de Platielstraat 9A in het centrum van Maastricht." },
    footer: { headline: 'CLINIQ Maastricht', text: 'Op stap in Maastricht. Donderdag, vrijdag en zaterdag open aan de Platielstraat.', intro: 'Op stap in Maastricht. Donderdag, vrijdag en zaterdag open aan de Platielstraat.', navigation: 'Navigatie', groups: 'Voor groepen', bachelor: 'Vrijgezellenfeest', corporate: 'Bedrijfsfeest', venue: 'Feestzaal Maastricht', route: 'Route & contact', lockers: 'Lockers' },
    form: { sending: 'Versturen…', submit: 'Verstuur aanvraag', success: 'Bedankt. We nemen zo snel mogelijk contact op.', error: 'Er ging iets mis. Mail ons direct via contact@cafecliniq.com.', select: 'Selecteer…' },
  },
  en: {
    nav: { cta: 'Inquire', agenda: 'Agenda', switchTo: 'NL', main: 'Main navigation' },
    common: { viewAgenda: 'View agenda', requestVenue: 'Hire the venue', contact: 'Contact us', bookWorkshop: 'Request workshop', allEvents: 'All events', allPhotos: 'View all photos', photos: 'photos', previous: 'Previous', next: 'Next', backAlbums: 'All photos', select: 'Select…' },
    home: { eyebrow: 'Platielstraat 9A', hero: 'CLINIQ Maastricht', intro: 'Nights out, events and workshops on Platielstraat.', proof: ['Platielstraat 9A', 'Club', 'Workshops', 'Events'], whyEyebrow: 'Photos', whyTitle: 'Photos', whyText: '', plan: 'Contact us', eventsTitle: "What's on", eventsText: 'The next nights at CLINIQ.', noEventsTitle: 'New events soon.', noEventsText: '', albumsTitle: 'Photos', albumsText: 'Recent nights at CLINIQ.', readyTitle: 'CLINIQ Maastricht', readyText: 'Platielstraat 9A, Maastricht.', heroCta2: 'See photos', nightBody: 'Thursday, Friday and Saturday. The place to go out in Maastricht.', cultureLabel: 'Club nights', cultureTitle: 'Three nights.\nEvery week.', cultureBody: 'Thursday (18+), Friday and Saturday (21+) from 22:00. Good music, good crowd, no fuss.', spaceBody: 'Available for private parties, hen nights, corporate events and launches. Up to 400 people, exclusive hire, full bar included.', workshopBody: 'Make cocktails with your group. Guided by our bartenders — stay on for the night after.' },
    albums: { eyebrow: 'Photos', title: 'What Cliniq\nlooks like.', intro: 'Shots from club nights, events and workshops on Platielstraat.', detailIntro: 'Photos from this night at CLINIQ.', metaTitle: 'Photos | CLINIQ Maastricht — Club Nights & Events', metaDescription: 'See photos from Cliniq Maastricht. Club nights, events and cocktail workshops on Platielstraat 9A.', albumLabel: 'Albums', emptyTitle: 'No photos yet', emptyBody: 'New albums coming soon. Follow us on Instagram for the latest.', seoText: 'Photos from Cliniq Maastricht — club nights, events and cocktail workshops on Platielstraat 9A in central Maastricht.' },
    footer: { headline: 'CLINIQ Maastricht', text: 'Going out in Maastricht. Open Thursday, Friday and Saturday on Platielstraat.', intro: 'Going out in Maastricht. Open Thursday, Friday and Saturday on Platielstraat.', navigation: 'Navigation', groups: 'For groups', bachelor: 'Bachelor / bachelorette', corporate: 'Company event', venue: 'Venue hire Maastricht', route: 'Directions & contact', lockers: 'Lockers' },
    form: { sending: 'Sending…', submit: 'Send request', success: 'Thank you. We will contact you as soon as possible.', error: 'Something went wrong. Email us directly at contact@cafecliniq.com.', select: 'Select…' },
  },
} as const

export const copy = {
  nl: { cta: ui.nl.nav.cta, agenda: ui.nl.nav.agenda, switchTo: ui.nl.nav.switchTo, homeHero: ui.nl.home.hero, homeIntro: ui.nl.home.intro, viewAgenda: ui.nl.common.viewAgenda, requestVenue: ui.nl.common.requestVenue, featured: ui.nl.home.eventsTitle, allEvents: ui.nl.common.allEvents, noEvents: ui.nl.home.noEventsText, workshopTitle: 'Cocktail workshop bij CLINIQ', workshopIntro: 'Voor groepen van 15+. Leer cocktails maken, blijf daarna voor de avond.', eventTitle: 'Ruimte huren bij CLINIQ', eventIntro: 'Bar, licht, geluid en clubgevoel in het centrum van Maastricht.', contactTitle: 'Contact', jobsTitle: 'Werken bij CLINIQ', rulesTitle: 'House rules', backAgenda: 'Terug naar agenda' },
  en: { cta: ui.en.nav.cta, agenda: ui.en.nav.agenda, switchTo: ui.en.nav.switchTo, homeHero: ui.en.home.hero, homeIntro: ui.en.home.intro, viewAgenda: ui.en.common.viewAgenda, requestVenue: ui.en.common.requestVenue, featured: ui.en.home.eventsTitle, allEvents: ui.en.common.allEvents, noEvents: ui.en.home.noEventsText, workshopTitle: 'Cocktail workshop at CLINIQ', workshopIntro: 'For groups of 15 or more. Make cocktails, then stay for the night.', eventTitle: 'Hire CLINIQ for your event', eventIntro: 'Bar, lighting, sound and club atmosphere in central Maastricht.', contactTitle: 'Contact', jobsTitle: 'Work at CLINIQ', rulesTitle: 'House rules', backAgenda: 'Back to agenda' },
} as const
