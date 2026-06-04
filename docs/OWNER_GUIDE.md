# Cliniq Maastricht owner guide

## Editing the agenda in under 2 minutes
1. Open `/studio` after deployment and log in to Sanity.
2. Choose **Agenda / Events** → **Create new**.
3. Fill in title, date, start time, end time, age limit, poster, short description and optional ticket/RSVP URL.
4. Keep **Visibility status** on `published` and enable **Featured event** if it should appear on the homepage.
5. Publish. The website refreshes automatically within a few minutes.

Past events are hidden from the upcoming agenda by the frontend query. Duplicate an event for recurring nights so each date has its own SEO-friendly Event schema.

## Editable content
Sanity includes schemas for agenda events, editable page content, site settings, gallery images, artists, jobs and stored form submissions.

## Vercel deployment
1. Create a Sanity project and dataset.
2. Add the environment variables from `.env.example` in Vercel.
3. Deploy the repository to Vercel. The included `vercel.json` pins the framework to Next.js and the output directory to `.next`, so Vercel must not look for a static `dist` folder.
4. Add `https://www.cliniqmaastricht.nl` and the Vercel preview URL to Sanity CORS origins.
5. Verify Google Search Console and replace `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.

## Redirects
All redirects are configured server-side in `next.config.ts`. `/lockers` is a permanent one-hop 301 to `https://cliniq.elockers.shop/cliniq/lockers`.

## Security note
Next.js is pinned to `15.5.11` in `package.json` to avoid Vercel blocking deployment for vulnerable `15.1.0` builds. Keep `next` and `eslint-config-next` on matching patched versions when upgrading.

## Manual setup still required
- Add real Sanity project ID/dataset and create initial content.
- Configure Resend verified sending domain for email notifications.
- Add GA4 measurement ID and Search Console verification code.
- Replace or expand imagery when the owner supplies final approved photography.
