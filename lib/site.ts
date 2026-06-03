export const site = {
  name: 'Cliniq Maastricht',
  url: 'https://www.cliniqmaastricht.nl',
  description: 'Premium club, cocktailbar, cocktail workshop en event space in hartje Maastricht.',
  address: { street: 'Platielstraat 9A', postalCode: '6211 GV', city: 'Maastricht', country: 'NL' },
  phone: '+31 6 12530987',
  email: 'contact@cafecliniq.com',
  whatsapp: 'https://wa.me/31612530987',
  instagram: 'https://instagram.com/cliniqmaastricht',
  tiktok: 'https://tiktok.com/@cliniqmaastricht',
  maps: 'https://www.google.com/maps?q=Platielstraat+9A+6211+GV+Maastricht&output=embed',
  hours: ['Donderdag 22:00–02:00', 'Vrijdag 22:00–03:00', 'Zaterdag 22:00–03:00'],
}

export const images = {
  hero: 'https://images.squarespace-cdn.com/content/v1/668daa9a16b2fb43c8ce6f80/aa79c0ac-5561-41b3-9a9a-d4fb009a4a5d/001_EnriqueMeesters_Maastricht_Cliniq_20221111.jpg',
  crowd: 'https://images.squarespace-cdn.com/content/v1/668daa9a16b2fb43c8ce6f80/512e92e4-396c-4a4a-aedd-eb928ab681d6/20240822_Cliniq_HR_SanderPaulussen-44.jpg',
  bar: 'https://images.squarespace-cdn.com/content/v1/668daa9a16b2fb43c8ce6f80/820c06b1-de40-417c-808f-9c1b3b25dc1f/20240822_Cliniq_HR_SanderPaulussen-50.jpg',
  club: 'https://images.squarespace-cdn.com/content/v1/668daa9a16b2fb43c8ce6f80/25d285a5-e73e-4f38-a55c-a3d9fcd73d60/003_EnriqueMeesters_Maastricht+-+Cliniq_20230204.jpg',
  party: 'https://images.squarespace-cdn.com/content/v1/668daa9a16b2fb43c8ce6f80/4fa88dae-1327-459e-95c4-6f2e95bf02b3/4_Wildschieters_JtT_Cliniq_20230318.JPG',
}

export const nav = [
  ['Uitgaan', '/uitgaan'], ['Cocktail workshop', '/cocktail-workshop'], ['Event space', '/event-space'], ['Artiesten', '/artiesten'], ['Contact', '/contact'],
] as const

export const pages = [
  { path: '/', title: 'Cliniq Maastricht | Premium nightlife, cocktailbar & event space', description: 'Cliniq Maastricht is de premium nightlife bestemming voor clubnachten, cocktail workshops en event space verhuur in hartje Maastricht.' },
  { path: '/uitgaan', title: 'Uitgaan Maastricht | Agenda & club events bij Cliniq', description: 'Bekijk de agenda van Cliniq Maastricht: clubnachten, DJ events en premium nightlife in het centrum van Maastricht.' },
  { path: '/cocktail-workshop', title: 'Cocktail workshop Maastricht | Premium groepsactiviteit', description: 'Boek een cocktail workshop in Maastricht bij Cliniq. Perfect voor vrijgezellenfeest, bedrijfsuitje, verjaardag en vriendengroepen.' },
  { path: '/event-space', title: 'Event space Maastricht | Ruimte huren & feestzaal Cliniq', description: 'Ruimte huren in Maastricht? Cliniq is een premium event space en feestzaal voor bedrijfsfeest, verjaardag, borrel, gala en private party.' },
  { path: '/contact', title: 'Contact Cliniq Maastricht | Adres, openingstijden & aanvragen', description: 'Neem contact op met Cliniq Maastricht voor agenda, cocktail workshops, event space verhuur en algemene vragen.' },
  { path: '/vacatures', title: 'Vacatures Maastricht nightlife | Werken bij Cliniq', description: 'Bekijk vacatures bij Cliniq Maastricht en solliciteer voor bar, host, security en event functies in een premium nightlife team.' },
  { path: '/house-rules', title: 'House rules Cliniq Maastricht | Huisregels & deurbeleid', description: 'Lees de huisregels, leeftijdsbeleid, ID vereisten en veiligheidsregels van Cliniq Maastricht.' },
  { path: '/artiesten', title: 'Artiesten & DJs | Cliniq Maastricht', description: 'Ontdek resident DJs, artiesten en cultuur bij Cliniq Maastricht. Voor boekingen en samenwerkingen neem contact op.' },
]
