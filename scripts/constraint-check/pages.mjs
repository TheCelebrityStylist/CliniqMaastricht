// Key pages the constraint-proofing harness watches for URL, copy, and SSR-content regressions.
// Every page here carries "approved copy" per the project's hard constraints — none of it may
// change without an explicit, reviewed reason. Add a page here whenever new approved copy ships.
export const WATCHED_PAGES = [
  { path: '/', name: 'home-nl' },
  { path: '/en', name: 'home-en' },
  { path: '/uitgaan', name: 'uitgaan' },
  { path: '/en/nightlife', name: 'nightlife-en' },
  { path: '/cocktail-workshop', name: 'cocktail-workshop' },
  { path: '/en/cocktail-workshop', name: 'cocktail-workshop-en' },
  { path: '/event-space', name: 'event-space' },
  { path: '/en/event-space', name: 'event-space-en' },
  { path: '/feest', name: 'feest' },
  { path: '/en/party', name: 'party-en' },
  { path: '/contact', name: 'contact' },
  { path: '/en/contact', name: 'contact-en' },
  { path: '/fotos', name: 'fotos' },
  { path: '/en/photos', name: 'photos-en' },
  { path: '/vacatures', name: 'vacatures' },
  { path: '/house-rules', name: 'house-rules' },
  { path: '/en/house-rules', name: 'house-rules-en' },
  { path: '/en/jobs', name: 'jobs-en' },
  { path: '/nachtclub-maastricht', name: 'nachtclub-maastricht' },
  { path: '/discotheek-maastricht', name: 'discotheek-maastricht' },
  { path: '/vrijgezellenavond', name: 'vrijgezellenavond' },
  { path: '/bedrijfsfeest', name: 'bedrijfsfeest' },
  { path: '/privefeest', name: 'privefeest' },
  { path: '/studentenavond', name: 'studentenavond' },
]
