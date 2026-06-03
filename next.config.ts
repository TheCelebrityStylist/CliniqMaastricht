import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.squarespace-cdn.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async redirects() {
    return [
      { source: '/lockers', destination: 'https://cliniq.elockers.shop/cliniq/lockers', permanent: true },
      { source: '/ruimte-huren', destination: '/event-space', permanent: true },
      { source: '/zaal-huren', destination: '/event-space', permanent: true },
      { source: '/evenementen', destination: '/event-space', permanent: true },
      { source: '/feestzaal', destination: '/event-space', permanent: true },
      { source: '/locker', destination: '/event-space', permanent: true },
      { source: '/locker-checkout', destination: '/event-space', permanent: true },
      { source: '/checkout', destination: '/event-space', permanent: true },
      { source: '/booking', destination: '/event-space', permanent: true },
      { source: '/reserveren', destination: '/event-space', permanent: true },
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
