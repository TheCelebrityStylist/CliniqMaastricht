# Cliniq Maastricht Operating System

The admin lives at `/studio` and is designed as a business operating system: Events Manager, Media Library, Page Manager, SEO Manager, Lead Dashboard, Analytics Dashboard, Jobs and Site Settings.

## Events Manager: add an event in under 2 minutes
1. Open `/studio` and choose **Events Manager**.
2. Click **Create new**.
3. Fill the quick setup fields: title, date, opening time, closing time, age limit and poster.
4. Add optional subtitle, description, ticket link, gallery and recurring-event note.
5. Keep **Published** enabled and publish.

Past events are hidden from the upcoming agenda by the frontend query. Duplicate recurring events for each date for the strongest Event schema and SEO footprint.

## Media Library
Use **Media Library** to upload, replace, crop and assign images. Sanity hotspot/focal-point controls power responsive crops; the brightness field is a frontend hint for dark nightlife photography. Media can be assigned as hero images, event posters, workshop imagery, venue-hire imagery, gallery imagery or social images.

## Lead Dashboard
All forms create **Lead Dashboard** entries with date, lead type, status, contact details, message and source page. Change the status to `handled` when complete, add notes, search/filter in Sanity, or export CSV from `/api/leads/export?token=YOUR_LEADS_EXPORT_TOKEN`.

## SEO Manager
Use **SEO Manager** to manage SEO title, meta description, OG title, OG description, social image, canonical URL and focus keywords per page and language. Dutch and English pages have separate SEO records and hreflang alternates.

## Languages
Dutch is the default language. English routes live under `/en`, for example `/en/nightlife`, `/en/cocktail-workshop` and `/en/event-space`. The header language switcher stores the selected language in cookie/localStorage.

## Vercel deployment
1. Create a Sanity project and dataset.
2. Add the environment variables from `.env.example` in Vercel.
3. Deploy the repository to Vercel. The included `vercel.json` pins the framework to Next.js and the output directory to `.next`, so Vercel must not look for a static `dist` folder.
4. Add `https://www.cliniqmaastricht.nl` and the Vercel preview URL to Sanity CORS origins.
5. Verify Google Search Console and replace `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.

## Redirects
All redirects are configured server-side in `next.config.ts`. `/lockers` is a permanent one-hop 301 to `https://cliniq.elockers.shop/cliniq/lockers`. `/artiesten` permanently redirects to `/uitgaan`.

## Security note
Next.js is pinned to `15.5.16` in `package.json` to avoid Vercel blocking deployment for vulnerable 15.x builds. Keep `next` and `eslint-config-next` on matching patched versions when upgrading.

## Dependency note
Date formatting uses the built-in `Intl.DateTimeFormat` API. Do not add `date-fns/locale` to `package.json`; it is an import path, not an npm package, and Vercel/npm will reject it as an invalid package name.

## Manual setup still required
- Add real Sanity project ID/dataset and create initial content.
- Configure Resend verified sending domain for email notifications.
- Add GA4 measurement ID and Search Console verification code.
- Add `LEADS_EXPORT_TOKEN` for CSV exports.
- Replace or expand imagery when the owner supplies final approved photography.
