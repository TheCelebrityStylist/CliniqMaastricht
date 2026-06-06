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
    nl: { title: 'Cliniq Maastricht | Club, cocktails & events in hartje stad', description: 'Cliniq Maastricht brengt clubnachten, cocktails, fotoalbums en private events samen aan de Platielstraat in Maastricht.' },
    en: { title: 'Cliniq Maastricht | Club nights, cocktails & private events', description: 'Cliniq Maastricht brings together club nights, cocktails, photo albums and private events on Platielstraat in the city centre.' },
  },
  nightlife: {
    nl: { title: 'Uitgaan Maastricht | Agenda, clubnachten & foto’s bij Cliniq', description: 'Bekijk de agenda van Cliniq Maastricht: clubnachten, DJ-avonden, lockers, fotoalbums en uitgaan in het centrum van Maastricht.' },
    en: { title: 'Nightlife Maastricht | Club agenda, events & photos at Cliniq', description: 'Browse Cliniq Maastricht club nights, DJ events, lockers, photo albums and nightlife in the city centre.' },
  },
  workshop: {
    nl: { title: 'Cocktail workshop Maastricht | Cocktails maken bij CLINIQ', description: 'Boek een cocktail workshop in Maastricht bij Cliniq voor vrijgezellenfeest, bedrijfsuitje, verjaardag of vriendengroep.' },
    en: { title: 'Cocktail workshop Maastricht | Make cocktails at CLINIQ', description: 'Book a cocktail workshop in Maastricht at Cliniq for bachelorette parties, company groups, birthdays and friends.' },
  },
  eventSpace: {
    nl: { title: 'Ruimte huren Maastricht | Feestzaal & event space Cliniq', description: 'Cliniq is een ruimte in Maastricht voor bedrijfsfeest, verjaardag, borrel, gala, vrijgezellenfeest en private party.' },
    en: { title: 'Event space Maastricht | Venue hire & private parties', description: 'Hire Cliniq Maastricht for company events, birthdays, drinks, galas, bachelor parties and private nights.' },
  },
  contact: {
    nl: { title: 'Contact Cliniq Maastricht | Plan je avond of event', description: 'Neem contact op met Cliniq Maastricht voor agenda, cocktail workshop, ruimte huren, lockers, openingstijden en route.' },
    en: { title: 'Contact Cliniq Maastricht | Plan the night or the event', description: 'Contact Cliniq Maastricht for nightlife, cocktail workshops, venue hire, lockers, opening hours and directions.' },
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
    home: { eyebrow: 'Platielstraat 9A', hero: 'CLINIQ Maastricht', intro: 'Cocktails. Muziek. Mensen.', proof: ['Platielstraat 9A', 'Club', 'Cocktails', 'Events'], whyEyebrow: 'Foto’s', whyTitle: 'Foto’s', whyText: '', plan: 'Neem contact op', eventsTitle: 'Deze week', eventsText: 'De eerstvolgende avonden bij CLINIQ.', noEventsTitle: 'Nieuwe events volgen.', noEventsText: '', albumsTitle: 'Foto’s', albumsText: 'Een kleine selectie uit de laatste avonden.', readyTitle: 'CLINIQ Maastricht', readyText: 'Platielstraat 9A. Midden in Maastricht.' },
    albums: { eyebrow: 'Foto’s', title: 'Foto’s bij CLINIQ.', intro: 'Clubnachten, workshops en events aan de Platielstraat.', detailIntro: 'Foto’s van deze avond bij CLINIQ.', metaTitle: 'Foto’s uitgaan Maastricht | Cliniq albums', metaDescription: 'Bekijk fotoalbums van clubnachten, cocktail workshops en events bij Cliniq Maastricht.' },
    footer: { headline: 'CLINIQ Maastricht', text: 'Club, cocktailbar en eventlocatie aan de Platielstraat.', intro: 'Club, cocktailbar en eventlocatie aan de Platielstraat.', navigation: 'Navigatie', groups: 'Voor groepen', bachelor: 'Vrijgezellenfeest', corporate: 'Bedrijfsfeest', venue: 'Feestzaal Maastricht', route: 'Route & contact', lockers: 'Lockers' },
    form: { sending: 'Versturen…', submit: 'Verstuur aanvraag', success: 'Bedankt. We nemen zo snel mogelijk contact op.', error: 'Er ging iets mis. Mail ons direct via contact@cafecliniq.com.', select: 'Selecteer…' },
  },
  en: {
    nav: { cta: 'Inquire', agenda: 'Agenda', switchTo: 'NL', main: 'Main navigation' },
    common: { viewAgenda: 'View agenda', requestVenue: 'Hire the venue', contact: 'Contact us', bookWorkshop: 'Request workshop', allEvents: 'All events', allPhotos: 'View all photos', photos: 'photos', previous: 'Previous', next: 'Next', backAlbums: 'All photos', select: 'Select…' },
    home: { eyebrow: 'Platielstraat 9A', hero: 'CLINIQ Maastricht', intro: 'Cocktails. Music. People.', proof: ['Platielstraat 9A', 'Club', 'Cocktails', 'Events'], whyEyebrow: 'Photos', whyTitle: 'Photos', whyText: '', plan: 'Contact us', eventsTitle: 'This week', eventsText: 'The next nights at CLINIQ.', noEventsTitle: 'New events soon.', noEventsText: '', albumsTitle: 'Photos', albumsText: 'A small selection from recent nights.', readyTitle: 'CLINIQ Maastricht', readyText: 'Platielstraat 9A. In the centre of Maastricht.' },
    albums: { eyebrow: 'Photos', title: 'Photos at CLINIQ.', intro: 'Club nights, workshops and events on Platielstraat.', detailIntro: 'Photos from this night at CLINIQ.', metaTitle: 'Maastricht nightlife photos | Cliniq albums', metaDescription: 'Browse photo albums from club nights, cocktail workshops and private events at Cliniq Maastricht.' },
    footer: { headline: 'CLINIQ Maastricht', text: 'Club, cocktail bar and event venue on Platielstraat.', intro: 'Club, cocktail bar and event venue on Platielstraat.', navigation: 'Navigation', groups: 'For groups', bachelor: 'Bachelor / bachelorette', corporate: 'Company event', venue: 'Venue hire Maastricht', route: 'Directions & contact', lockers: 'Lockers' },
    form: { sending: 'Sending…', submit: 'Send request', success: 'Thank you. We will contact you as soon as possible.', error: 'Something went wrong. Email us directly at contact@cafecliniq.com.', select: 'Select…' },
  },
} as const

export const copy = {
  nl: { cta: ui.nl.nav.cta, agenda: ui.nl.nav.agenda, switchTo: ui.nl.nav.switchTo, homeHero: ui.nl.home.hero, homeIntro: ui.nl.home.intro, viewAgenda: ui.nl.common.viewAgenda, requestVenue: ui.nl.common.requestVenue, featured: ui.nl.home.eventsTitle, allEvents: ui.nl.common.allEvents, noEvents: ui.nl.home.noEventsText, workshopTitle: 'Cocktail workshop bij CLINIQ', workshopIntro: 'Een cocktail workshop in Maastricht met barenergie, goede uitleg en genoeg ruimte om te lachen.', eventTitle: 'Jouw event verdient meer dan een standaard zaal.', eventIntro: 'Ruimte huren in Maastricht met bar, licht, sound en team al op niveau.', contactTitle: 'Contact', jobsTitle: 'Werken waar de avond beweegt.', rulesTitle: 'Duidelijk aan de deur. Relaxed binnen.', backAgenda: 'Terug naar agenda' },
  en: { cta: ui.en.nav.cta, agenda: ui.en.nav.agenda, switchTo: ui.en.nav.switchTo, homeHero: ui.en.home.hero, homeIntro: ui.en.home.intro, viewAgenda: ui.en.common.viewAgenda, requestVenue: ui.en.common.requestVenue, featured: ui.en.home.eventsTitle, allEvents: ui.en.common.allEvents, noEvents: ui.en.home.noEventsText, workshopTitle: 'Cocktail workshop at CLINIQ', workshopIntro: 'A cocktail workshop in Maastricht with bar energy, clear guidance and plenty of room to laugh.', eventTitle: 'Your event deserves more than a standard venue.', eventIntro: 'Venue hire in Maastricht with the bar, light, sound and team already in place.', contactTitle: 'Contact', jobsTitle: 'Work where the night moves.', rulesTitle: 'Clear at the door. Easy inside.', backAgenda: 'Back to agenda' },
} as const
