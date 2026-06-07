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
    nl: { title: 'CLINIQ Maastricht | Club, Cocktailbar & Eventlocatie', description: 'CLINIQ Maastricht aan de Platielstraat: club, cocktailbar en eventlocatie voor uitgaan, cocktail workshops, bedrijfsfeesten en private events.' },
    en: { title: 'CLINIQ Maastricht | Club, Cocktail Bar & Event Venue', description: 'CLINIQ Maastricht on Platielstraat: club, cocktail bar and event venue for nightlife, cocktail workshops, company parties and private events.' },
  },
  nightlife: {
    nl: { title: 'Uitgaan Maastricht | Clubnachten & Agenda bij CLINIQ', description: 'Bekijk de agenda van CLINIQ Maastricht. Clubnachten, DJ’s, cocktails en events aan de Platielstraat in het centrum van Maastricht.' },
    en: { title: 'Nightlife Maastricht | Club Nights & Agenda at CLINIQ', description: 'Browse the CLINIQ Maastricht agenda for club nights, DJs, cocktails and events on Platielstraat in central Maastricht.' },
  },
  workshop: {
    nl: { title: 'Cocktail Workshop Maastricht | CLINIQ Cocktailbar', description: 'Boek een cocktail workshop bij CLINIQ Maastricht. Ideaal voor vrijgezellenfeest, bedrijfsuitje, verjaardag of vriendengroep.' },
    en: { title: 'Cocktail Workshop Maastricht | CLINIQ Cocktail Bar', description: 'Book a cocktail workshop at CLINIQ Maastricht for bachelor and bachelorette parties, team nights, birthdays and groups of friends.' },
  },
  eventSpace: {
    nl: { title: 'Ruimte Huren Maastricht | Feestzaal & Event Space CLINIQ', description: 'Huur CLINIQ Maastricht voor bedrijfsfeest, verjaardag, borrel, vrijgezellenfeest of private event met bar, licht en geluid.' },
    en: { title: 'Venue Hire Maastricht | CLINIQ Event Space', description: 'Hire CLINIQ Maastricht for company parties, birthdays, drinks, bachelor and bachelorette parties or private events with bar, lighting and sound.' },
  },
  contact: {
    nl: { title: 'Contact CLINIQ Maastricht | Platielstraat 9A', description: 'Neem contact op met CLINIQ Maastricht voor agenda, cocktail workshops, ruimte huren, events of algemene vragen.' },
    en: { title: 'Contact CLINIQ Maastricht | Platielstraat 9A', description: 'Contact CLINIQ Maastricht for the agenda, cocktail workshops, venue hire, events or general questions.' },
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
    home: { eyebrow: 'Platielstraat 9A', hero: 'CLINIQ Maastricht', intro: 'Club, cocktailbar en eventlocatie aan de Platielstraat.', proof: ['Platielstraat 9A', 'Club', 'Cocktails', 'Events'], whyEyebrow: 'Foto’s', whyTitle: 'Foto’s', whyText: '', plan: 'Neem contact op', eventsTitle: 'Deze week bij CLINIQ', eventsText: 'Donderdag, vrijdag en zaterdag draait het bij CLINIQ om muziek, cocktails en een volle dansvloer. Check de agenda voor de eerstvolgende avonden.', noEventsTitle: 'Nieuwe events volgen.', noEventsText: '', albumsTitle: 'Foto’s van recente avonden', albumsText: 'Bekijk de sfeer van clubnachten, borrels en events bij CLINIQ.', readyTitle: 'CLINIQ Maastricht', readyText: 'Platielstraat 9A. Midden in Maastricht.' },
    albums: { eyebrow: 'Foto’s', title: 'Foto’s bij CLINIQ.', intro: 'Clubnachten, workshops en events aan de Platielstraat.', detailIntro: 'Foto’s van deze avond bij CLINIQ.', metaTitle: 'Foto’s uitgaan Maastricht | Cliniq albums', metaDescription: 'Bekijk fotoalbums van clubnachten, cocktail workshops en events bij Cliniq Maastricht.' },
    footer: { headline: 'CLINIQ Maastricht', text: 'Club, cocktailbar en eventlocatie aan de Platielstraat.', intro: 'Club, cocktailbar en eventlocatie aan de Platielstraat.', navigation: 'Navigatie', groups: 'Voor groepen', bachelor: 'Vrijgezellenfeest', corporate: 'Bedrijfsfeest', venue: 'Feestzaal Maastricht', route: 'Route & contact', lockers: 'Lockers' },
    form: { sending: 'Versturen…', submit: 'Verstuur aanvraag', success: 'Bedankt. We nemen zo snel mogelijk contact op.', error: 'Er ging iets mis. Mail ons direct via contact@cafecliniq.com.', select: 'Selecteer…' },
  },
  en: {
    nav: { cta: 'Inquire', agenda: 'Agenda', switchTo: 'NL', main: 'Main navigation' },
    common: { viewAgenda: 'View agenda', requestVenue: 'Hire the venue', contact: 'Contact us', bookWorkshop: 'Request workshop', allEvents: 'All events', allPhotos: 'View all photos', photos: 'photos', previous: 'Previous', next: 'Next', backAlbums: 'All photos', select: 'Select…' },
    home: { eyebrow: 'Platielstraat 9A', hero: 'CLINIQ Maastricht', intro: 'Club, cocktail bar and event venue on Platielstraat.', proof: ['Platielstraat 9A', 'Club', 'Cocktails', 'Events'], whyEyebrow: 'Photos', whyTitle: 'Photos', whyText: '', plan: 'Contact us', eventsTitle: 'This week at CLINIQ', eventsText: 'Thursday, Friday and Saturday at CLINIQ are built around music, cocktails and a full dance floor. Check the agenda for the next nights.', noEventsTitle: 'New events soon.', noEventsText: '', albumsTitle: 'Photos from recent nights', albumsText: 'Browse the atmosphere from club nights, drinks and events at CLINIQ.', readyTitle: 'CLINIQ Maastricht', readyText: 'Platielstraat 9A. In the centre of Maastricht.' },
    albums: { eyebrow: 'Photos', title: 'Photos at CLINIQ.', intro: 'Club nights, workshops and events on Platielstraat.', detailIntro: 'Photos from this night at CLINIQ.', metaTitle: 'Maastricht nightlife photos | Cliniq albums', metaDescription: 'Browse photo albums from club nights, cocktail workshops and private events at Cliniq Maastricht.' },
    footer: { headline: 'CLINIQ Maastricht', text: 'Club, cocktail bar and event venue on Platielstraat.', intro: 'Club, cocktail bar and event venue on Platielstraat.', navigation: 'Navigation', groups: 'For groups', bachelor: 'Bachelor / bachelorette', corporate: 'Company event', venue: 'Venue hire Maastricht', route: 'Directions & contact', lockers: 'Lockers' },
    form: { sending: 'Sending…', submit: 'Send request', success: 'Thank you. We will contact you as soon as possible.', error: 'Something went wrong. Email us directly at contact@cafecliniq.com.', select: 'Select…' },
  },
} as const

export const copy = {
  nl: { cta: ui.nl.nav.cta, agenda: ui.nl.nav.agenda, switchTo: ui.nl.nav.switchTo, homeHero: ui.nl.home.hero, homeIntro: ui.nl.home.intro, viewAgenda: ui.nl.common.viewAgenda, requestVenue: ui.nl.common.requestVenue, featured: ui.nl.home.eventsTitle, allEvents: ui.nl.common.allEvents, noEvents: ui.nl.home.noEventsText, workshopTitle: 'Cocktail workshop bij CLINIQ', workshopIntro: 'Samen achter de bar, cocktails maken en rustig opbouwen richting de avond.', eventTitle: 'Ruimte huren bij CLINIQ', eventIntro: 'Bar, licht, geluid en clubgevoel in het centrum van Maastricht.', contactTitle: 'Contact', jobsTitle: 'Werken bij CLINIQ', rulesTitle: 'House rules', backAgenda: 'Terug naar agenda' },
  en: { cta: ui.en.nav.cta, agenda: ui.en.nav.agenda, switchTo: ui.en.nav.switchTo, homeHero: ui.en.home.hero, homeIntro: ui.en.home.intro, viewAgenda: ui.en.common.viewAgenda, requestVenue: ui.en.common.requestVenue, featured: ui.en.home.eventsTitle, allEvents: ui.en.common.allEvents, noEvents: ui.en.home.noEventsText, workshopTitle: 'Cocktail workshop at CLINIQ', workshopIntro: 'Step behind the bar, make cocktails and ease into the evening.', eventTitle: 'Hire CLINIQ for your event', eventIntro: 'Bar, lighting, sound and club atmosphere in central Maastricht.', contactTitle: 'Contact', jobsTitle: 'Work at CLINIQ', rulesTitle: 'House rules', backAgenda: 'Back to agenda' },
} as const
