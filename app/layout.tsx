import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Script from 'next/script'
import { Inter_Tight, Unbounded } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'
import { site } from '@/lib/site'
import { localBusinessSchema, organizationSchema } from '@/lib/seo'
import { getAgendaEvents } from '@/lib/admin/public'
import StatusBadge from '@/components/interactive/StatusBadgeLoader'
import MobileActionBar from '@/components/interactive/MobileActionBarLoader'
import SmoothScroll from '@/components/experience/SmoothScroll'
import CinematicEntry from '@/components/experience/CinematicEntryLoader'
import CustomCursor from '@/components/experience/CustomCursorLoader'
import MobileHaptics from '@/components/experience/MobileHapticsLoader'

// Real, self-hosted webfonts (previously --font-inter-tight was just an alias for the system
// stack — see globals.css). Inter Tight replaces that alias 1:1 so every existing font-family
// reference upgrades for free; Unbounded is new, opted into headings only (see globals.css
// .h1/.h2/.hero-clean-title) for the "type as design element" look. next/font self-hosts both
// at build time (no runtime request to Google), sets font-display: swap, and preloads
// automatically — no extra config needed for Part B's "font display:swap + preload".
const interTight = Inter_Tight({ subsets: ['latin'], variable: '--font-inter-tight', display: 'swap', weight: ['400', '500', '600', '700', '800', '900'] })
const unbounded = Unbounded({ subsets: ['latin'], variable: '--font-display', display: 'swap', weight: ['500', '700', '800', '900'] })

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

  return <html lang="nl" className={`${interTight.variable} ${unbounded.variable}`}>
    <head>
      <link rel="preconnect" href="https://images.squarespace-cdn.com" />
      <link rel="preconnect" href="https://cdn.sanity.io" />
      <link rel="dns-prefetch" href="https://images.squarespace-cdn.com" />
      <link rel="dns-prefetch" href="https://cdn.sanity.io" />
    </head>
    <body>
      <a href="#main" className="sr-only focus:not-sr-only focus-ring fixed left-4 top-4 z-[100] rounded-full bg-white px-4 py-2 text-ink">Naar inhoud / Skip to content</a>
      <CinematicEntry />
      <SmoothScroll>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </SmoothScroll>
      <StatusBadge events={statusEvents} />
      <MobileActionBar />
      <CustomCursor />
      <MobileHaptics />
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
