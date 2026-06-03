import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.squarespace-cdn.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
  async redirects() {
    return [
      { source: '/lockers',        destination: 'https://cliniq.elockers.shop/cliniq/lockers', permanent: true },
      { source: '/agenda',         destination: '/uitgaan',          permanent: true },
      { source: '/ruimte-huren',   destination: '/event-space',      permanent: true },
      { source: '/zaal-huren',     destination: '/event-space',      permanent: true },
      { source: '/evenementen',    destination: '/event-space',      permanent: true },
      { source: '/reserveren',     destination: '/event-space',      permanent: true },
      { source: '/workshops',      destination: '/cocktail-workshop', permanent: true },
      { source: '/cocktails',      destination: '/cocktail-workshop', permanent: true },
      { source: '/jobs',           destination: '/vacatures',        permanent: true },
      { source: '/werk',           destination: '/vacatures',        permanent: true },
      { source: '/huisregels',     destination: '/house-rules',      permanent: true },
      { source: '/huis-regels',    destination: '/house-rules',      permanent: true },
      { source: '/artists',        destination: '/artiesten',        permanent: true },
      { source: '/nachtleven',     destination: '/uitgaan',          permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
