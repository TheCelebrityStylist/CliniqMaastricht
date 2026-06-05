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
  fallbackHero: '/images/cliniq/fallback-hero.svg',
  fallbackEvent: '/images/cliniq/fallback-event.svg',
  fallbackWide: '/images/cliniq/fallback-wide.svg',
}

export const imageSets = {
  home: [images.hero, images.crowd, images.bar, images.club, images.party],
  nightlife: [images.club, images.party, images.hero],
  workshop: [images.bar, images.hero, images.party],
  eventSpace: [images.crowd, images.club, images.bar, images.party],
}
