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
}

export const switchPathMap = new Map<string, string>(
  Object.values(localizedPaths).flatMap((paths) => [[paths.nl, paths.en], [paths.en, paths.nl]])
)

export function getLanguageFromPath(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'nl'
}

export function getSwitchPath(pathname: string): string {
  return switchPathMap.get(pathname) || (getLanguageFromPath(pathname) === 'nl' ? '/en' : '/')
}

export const navItems = [
  { key: 'nightlife', labels: { nl: 'Uitgaan', en: 'Nightlife' } },
  { key: 'workshop', labels: { nl: 'Cocktail workshop', en: 'Cocktail workshop' } },
  { key: 'eventSpace', labels: { nl: 'Event space', en: 'Venue hire' } },
  { key: 'contact', labels: { nl: 'Contact', en: 'Contact' } },
] as const

export const pageMeta = {
  home: {
    nl: { title: 'Cliniq Maastricht | Premium nightlife, cocktailbar & event space', description: 'Cliniq Maastricht is de premium nightlife bestemming voor clubnachten, cocktail workshops en event space verhuur in hartje Maastricht.' },
    en: { title: 'Cliniq Maastricht | Premium nightlife, cocktails & event space', description: 'Cliniq Maastricht is the premium nightlife destination for club nights, cocktail workshops and private venue hire in the heart of Maastricht.' },
  },
  nightlife: {
    nl: { title: 'Uitgaan Maastricht | Agenda & club events bij Cliniq', description: 'Bekijk de agenda van Cliniq Maastricht: clubnachten, DJ events en premium nightlife in het centrum van Maastricht.' },
    en: { title: 'Nightlife Maastricht | Club agenda & events at Cliniq', description: 'Explore upcoming club nights, DJ events and premium nightlife at Cliniq Maastricht in the city centre.' },
  },
  workshop: {
    nl: { title: 'Cocktail workshop Maastricht | Premium groepsactiviteit', description: 'Boek een cocktail workshop in Maastricht bij Cliniq. Perfect voor vrijgezellenfeest, bedrijfsuitje, verjaardag en vriendengroepen.' },
    en: { title: 'Cocktail workshop Maastricht | Premium group activity', description: 'Book a cocktail workshop in Maastricht at Cliniq. Ideal for bachelor and bachelorette parties, team events, birthdays and groups.' },
  },
  eventSpace: {
    nl: { title: 'Event space Maastricht | Ruimte huren & feestzaal Cliniq', description: 'Ruimte huren in Maastricht? Cliniq is een premium event space en feestzaal voor bedrijfsfeest, verjaardag, borrel, gala en private party.' },
    en: { title: 'Event space Maastricht | Venue hire & private parties', description: 'Looking for venue hire in Maastricht? Cliniq is a premium event space for corporate events, birthdays, drinks, galas and private parties.' },
  },
  contact: {
    nl: { title: 'Contact Cliniq Maastricht | Adres, openingstijden & aanvragen', description: 'Neem contact op met Cliniq Maastricht voor agenda, cocktail workshops, event space verhuur en algemene vragen.' },
    en: { title: 'Contact Cliniq Maastricht | Address, hours & inquiries', description: 'Contact Cliniq Maastricht for nightlife, cocktail workshops, event space hire and general inquiries.' },
  },
  jobs: {
    nl: { title: 'Vacatures Maastricht nightlife | Werken bij Cliniq', description: 'Bekijk vacatures bij Cliniq Maastricht en solliciteer voor bar, host, security en event functies in een premium nightlife team.' },
    en: { title: 'Jobs in Maastricht nightlife | Work at Cliniq', description: 'Explore jobs at Cliniq Maastricht and apply for bar, host, floor, security and event roles in a premium nightlife team.' },
  },
  houseRules: {
    nl: { title: 'House rules Cliniq Maastricht | Huisregels & deurbeleid', description: 'Lees de huisregels, leeftijdsbeleid, ID vereisten en veiligheidsregels van Cliniq Maastricht.' },
    en: { title: 'House rules Cliniq Maastricht | Door policy & safety', description: 'Read Cliniq Maastricht house rules, age policy, ID requirements, door policy and safety standards.' },
  },
} as const

export const copy = {
  nl: {
    cta: 'Aanvragen', agenda: 'Agenda', switchTo: 'EN', homeHero: 'Premium nightlife in Maastricht.', homeIntro: 'Cliniq is geen standaard club. Het is een stijlvolle Maastrichtse bestemming voor late nights, cocktails en private events met hospitality op hoog niveau.', viewAgenda: 'Bekijk agenda', requestVenue: 'Vraag ruimte aan', featured: 'Featured events.', allEvents: 'Alle events', noEvents: 'Nieuwe events verschijnen binnenkort. Volg Cliniq voor de laatste agenda.', workshopTitle: 'Cocktail workshop Maastricht.', workshopIntro: 'Leer shaken met onze bartenders en start jouw avond in premium Cliniq stijl.', eventTitle: 'Event space voor feesten met impact.', eventIntro: 'Zoek je een feestzaal, zaal huren of private event locatie in Maastricht? Cliniq combineert clubenergie met premium hospitality.', contactTitle: 'Neem contact op.', jobsTitle: 'Vacatures.', rulesTitle: 'Professioneel, veilig en respectvol.', backAgenda: 'Terug naar agenda'
  },
  en: {
    cta: 'Inquire', agenda: 'Agenda', switchTo: 'NL', homeHero: 'Premium nightlife in Maastricht.', homeIntro: 'Cliniq is not just another club. It is a polished Maastricht destination for late nights, cocktails and private events with hospitality at the centre.', viewAgenda: 'View agenda', requestVenue: 'Request venue', featured: 'Featured events.', allEvents: 'All events', noEvents: 'New events will be announced soon. Follow Cliniq for the latest agenda.', workshopTitle: 'Cocktail workshop Maastricht.', workshopIntro: 'Learn to shake with our bartenders and start your evening with the signature Cliniq atmosphere.', eventTitle: 'Venue hire with real nightlife energy.', eventIntro: 'Looking for an event space, private party venue or stylish hall in Maastricht? Cliniq combines club energy with premium hospitality.', contactTitle: 'Contact Cliniq.', jobsTitle: 'Jobs.', rulesTitle: 'Professional, safe and respectful.', backAgenda: 'Back to agenda'
  },
} satisfies Record<Lang, Record<string, string>>
