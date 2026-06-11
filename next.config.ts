import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.squarespace-cdn.com' },
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
  async redirects() {
    return [
      { source: '/lockers', destination: 'https://cliniq.elockers.shop/cliniq/lockers', permanent: true },
      { source: '/albums', destination: '/fotos', permanent: true },
      { source: '/albums/:slug', destination: '/fotos/:slug', permanent: true },
      { source: '/en/albums', destination: '/en/photos', permanent: true },
      { source: '/en/albums/:slug', destination: '/en/photos/:slug', permanent: true },
      { source: '/admin/:path*', destination: '/studio', permanent: false },
      { source: '/cms', destination: '/studio', permanent: false },
      { source: '/backend', destination: '/studio', permanent: false },
      { source: '/login', destination: '/studio', permanent: false },
      { source: '/admin-login', destination: '/studio', permanent: false },
      // Critical: live event-space URL has Google ranking
      { source: '/business-event-space-maastricht', destination: '/event-space', permanent: true },
      { source: '/business-event-space-maastricht/:path*', destination: '/event-space', permanent: true },
      { source: '/event-space-maastricht', destination: '/event-space', permanent: true },
      { source: '/venue-hire', destination: '/event-space', permanent: true },
      { source: '/venue-hire-maastricht', destination: '/event-space', permanent: true },
      { source: '/feestzaal-maastricht', destination: '/event-space', permanent: true },
      { source: '/zaal-verhuur', destination: '/event-space', permanent: true },
      { source: '/cocktail-workshop-maastricht', destination: '/cocktail-workshop', permanent: true },
      { source: '/workshop', destination: '/cocktail-workshop', permanent: true },
      { source: '/club', destination: '/uitgaan', permanent: true },
      { source: '/club-maastricht', destination: '/uitgaan', permanent: true },
      { source: '/stappen', destination: '/uitgaan', permanent: true },
      { source: '/nightlife', destination: '/uitgaan', permanent: true },
      { source: '/nightlife-maastricht', destination: '/uitgaan', permanent: true },
      { source: '/ruimte-huren', destination: '/event-space', permanent: true },
      { source: '/zaal-huren', destination: '/event-space', permanent: true },
      { source: '/evenementen', destination: '/event-space', permanent: true },
      { source: '/feestzaal', destination: '/event-space', permanent: true },
      { source: '/locker', destination: '/event-space', permanent: true },
      { source: '/locker-checkout', destination: '/event-space', permanent: true },
      { source: '/checkout', destination: '/event-space', permanent: true },
      { source: '/booking', destination: '/event-space', permanent: true },
      { source: '/reserveren', destination: '/event-space', permanent: true },
      { source: '/artiesten', destination: '/uitgaan', permanent: true },
      { source: '/en/artists', destination: '/en/nightlife', permanent: true },
      { source: '/agenda', destination: '/uitgaan', permanent: true },
      { source: '/nachtleven', destination: '/uitgaan', permanent: true },
      { source: '/workshops', destination: '/cocktail-workshop', permanent: true },
      { source: '/cocktails', destination: '/cocktail-workshop', permanent: true },
      { source: '/jobs', destination: '/vacatures', permanent: true },
      { source: '/werk', destination: '/vacatures', permanent: true },
      { source: '/huis-regels', destination: '/house-rules', permanent: true },
      { source: '/huisregels', destination: '/house-rules', permanent: true },
    ]
  },
  async headers() {
    return [{ source: '/(.*)', headers: [
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ] }]
  },
}

export default nextConfig
