import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Script from 'next/script'
import { cookies } from 'next/headers'
import { Inter_Tight, MuseoModerno, Bodoni_Moda } from 'next/font/google'
import { getVenueState, VENUE_STATE_COOKIE, type VenueState } from '@/lib/venueState'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker'
import { site } from '@/lib/site'
import { localBusinessSchema, organizationSchema } from '@/lib/seo'
import MobileActionBar from '@/components/interactive/MobileActionBarLoader'
import SmoothScroll from '@/components/experience/SmoothScroll'
import ScrollChoreography from '@/components/experience/ScrollChoreographyLoader'
import CinematicEntry from '@/components/experience/CinematicEntryLoader'
import CustomCursor from '@/components/experience/CustomCursorLoader'
import MobileHaptics from '@/components/experience/MobileHapticsLoader'
import PageTransition from '@/components/experience/PageTransition'
import AmbientSound from '@/components/experience/AmbientSoundLoader'

// Brand type system (V1): MuseoModerno is the display face (Bold headlines/nav/buttons/event
// titles/marquee, ExtraLight for airy precision moments) - see globals.css .h1/.h2/.hero-clean-title.
// Bodoni Moda italic stands in for the brand's Bettoni Oblique, which is commercial/unlicensed
// (Zetafonts) - flagged in the report as a paid upgrade, wired through one variable
// (--font-serif) so swapping later is a one-line change. Body copy stays on Inter Tight: MuseoModerno
// was tested as a body face and, as expected for a rounded geometric display font, its low
// letterform contrast at paragraph sizes hurt scanning/legibility versus a text-optimized grotesk -
// the brief itself pre-authorizes this exact fallback ("if body copy in MuseoModerno fails
// legibility ... switch body only to a neutral grotesk and keep MuseoModerno for display. Report
// if you do."). Reported here. All three self-host at build time, font-display: swap, auto-preload.
const interTight = Inter_Tight({ subsets: ['latin'], variable: '--font-inter-tight', display: 'swap', weight: ['400', '500', '600', '700', '800', '900'] })
const museoModerno = MuseoModerno({ subsets: ['latin'], variable: '--font-display', display: 'swap', weight: ['200', '500', '700', '800', '900'] })
const bodoniModa = Bodoni_Moda({ subsets: ['latin'], variable: '--font-serif', display: 'swap', style: ['italic'], weight: ['500', '600', '700'] })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'CLINIQ Maastricht | Uitgaan, Clubavonden & Events', template: '%s | CLINIQ Maastricht' },
  description: site.description,
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'add-google-search-console-code' },
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#31071B' }

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Dual-state system: the truth of the venue right now (time + opening hours), computed
  // server-side so there's never a flash of the wrong state - a user's manual nudge (see
  // VenueStateToggle in Header) is a short-lived cookie override, not a permanent preference,
  // matching "default is the truth of the venue now."
  const cookieStore = await cookies()
  const override = cookieStore.get(VENUE_STATE_COOKIE)?.value
  const venueState: VenueState = override === 'day' || override === 'night' ? override : getVenueState()

  return <html lang="nl" data-venue-state={venueState} className={`${interTight.variable} ${museoModerno.variable} ${bodoniModa.variable}`}>
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
        <Header venueState={venueState} />
        <main id="main"><PageTransition>{children}</PageTransition></main>
        <Footer />
        <ScrollChoreography />
      </SmoothScroll>
      <MobileActionBar />
      <CustomCursor />
      <MobileHaptics />
      <AmbientSound />
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
