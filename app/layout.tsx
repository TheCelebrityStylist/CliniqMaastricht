import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'
import { site } from '@/lib/site'
import { localBusinessSchema, organizationSchema } from '@/lib/seo'
import { getAgendaEvents } from '@/lib/admin/public'
import StatusBadge from '@/components/interactive/StatusBadgeLoader'
import MobileActionBar from '@/components/interactive/MobileActionBarLoader'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'CLINIQ Maastricht | Uitgaan, Clubavonden & Events', template: '%s | CLINIQ Maastricht' },
  description: site.description,
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'add-google-search-console-code' },
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#080607' }

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const events = await getAgendaEvents()
  const statusEvents = events.slice(0, 5).map((event) => ({
    title: event.title,
    titleNl: event.titleNl,
    titleEn: event.titleEn,
    date: event.date,
    startTime: event.startTime,
    slug: event.slug?.current,
  }))

  return <html lang="nl">
    <head>
      <link rel="preconnect" href="https://images.squarespace-cdn.com" />
      <link rel="preconnect" href="https://cdn.sanity.io" />
      <link rel="dns-prefetch" href="https://images.squarespace-cdn.com" />
      <link rel="dns-prefetch" href="https://cdn.sanity.io" />
    </head>
    <body>
      <a href="#main" className="sr-only focus:not-sr-only focus-ring fixed left-4 top-4 z-[100] rounded-full bg-white px-4 py-2 text-ink">Naar inhoud / Skip to content</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <StatusBadge events={statusEvents} />
      <MobileActionBar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`} strategy="afterInteractive" /> : null}
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');`}</Script> : null}
      <AnalyticsTracker />
      <Analytics />
      <SpeedInsights />
    </body>
  </html>
}
