export const site = {
  name: 'CLINIQ Maastricht',
  url: 'https://www.cliniqmaastricht.nl',
  description: 'Club, cocktailbar en eventlocatie aan de Platielstraat in Maastricht.',
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
  redCrowd: 'https://images.squarespace-cdn.com/content/v1/668daa9a16b2fb43c8ce6f80/da0a2e37-0788-4871-9599-33cf1791c42b/28_Wildschieters_JtT_Cliniq_20230318.JPG',
  redRoom: 'https://images.squarespace-cdn.com/content/v1/668daa9a16b2fb43c8ce6f80/820c06b1-de40-417c-808f-9c1b3b25dc1f/20240822_Cliniq_HR_SanderPaulussen-50.jpg',
  workshopBar: 'https://images.squarespace-cdn.com/content/v1/668daa9a16b2fb43c8ce6f80/a7c3297c-cc9d-425c-a39d-c5e5670abdce/DSCF4723.jpg',
  mojito: 'https://images.squarespace-cdn.com/content/v1/668daa9a16b2fb43c8ce6f80/5b018394-bade-4a94-b3e4-6e940b11901d/DSCF4699.jpg',
  espresso: 'https://images.squarespace-cdn.com/content/v1/668daa9a16b2fb43c8ce6f80/c0304cbc-2486-46a5-849c-8f88388de65b/DSCF4774.jpg',
  passion: 'https://images.squarespace-cdn.com/content/v1/668daa9a16b2fb43c8ce6f80/3caa9e75-6e8e-4bc2-9b2d-452caa088e23/DSCF4712.jpg',
  contactInterior: 'https://images.squarespace-cdn.com/content/v1/668daa9a16b2fb43c8ce6f80/3bca36ed-2b9f-4ea8-b0dd-a74da6130864/8_Wildschieters_JtT_Cliniq_20230318.JPG',
  footerLogo: 'https://images.squarespace-cdn.com/content/v1/668daa9a16b2fb43c8ce6f80/fbc2d9e3-6f3e-4d25-9ca1-0f4bbf6eba0c/cliniq-subline-white%2B%283%29.png',
  fallbackHero: '/images/cliniq/fallback-hero.svg',
  fallbackEvent: '/images/cliniq/fallback-event.svg',
  fallbackWide: '/images/cliniq/fallback-wide.svg',
}

export const imageSets = {
  home: [images.hero, images.redCrowd, images.bar, images.workshopBar, images.party],
  nightlife: [images.hero, images.redCrowd, images.club, images.party, images.redRoom],
  workshop: [images.workshopBar, images.mojito, images.espresso, images.passion, images.mojito],
  eventSpace: [images.redRoom, images.redCrowd, images.bar, images.club, images.party],
  contact: [images.contactInterior, images.bar, images.footerLogo],
}
