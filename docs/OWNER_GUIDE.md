# Cliniq Maastricht Operating System

Use `/admin` as the private owner start page. `/admin` and `/studio` are protected by the `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables. The actual CMS lives at `/studio` and is designed as a business operating system: Events Manager, Media Library, Page Manager, SEO Manager, Lead Dashboard, Analytics Dashboard, Jobs and Site Settings.

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
2. Add the environment variables from `.env.example` in Vercel, including `ADMIN_USERNAME` and `ADMIN_PASSWORD` so `/admin` and `/studio` are not public.
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
- Upload any new approved Cliniq photography to Sanity Media Library and assign it to pages/events. The coded fallbacks already use Cliniq imagery, not stock photos. Chat-pasted images must be uploaded as actual files or CMS assets before they can be used by the website.

# Owner manual — normal updates without code

## 1. CMS login URL
After deployment, open `https://www.cliniqmaastricht.nl/admin` for the private owner screen. Your browser will ask for the `ADMIN_USERNAME` and `ADMIN_PASSWORD` configured in Vercel. After that, click **Open CMS**. You can also go directly to `https://www.cliniqmaastricht.nl/studio`. On a Vercel preview deployment, open `https://YOUR-VERCEL-PREVIEW-URL.vercel.app/studio`. Log in with the Sanity account that has access to the Cliniq Maastricht Sanity project. Required environment variables in Vercel: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN` and `SANITY_API_WRITE_TOKEN`.


### Can we use a simple admin login?
Yes: use `/admin` as the private owner login/start page. The website first asks for the Vercel `ADMIN_USERNAME` / `ADMIN_PASSWORD`, then Sanity asks for the invited Sanity account. There is no shared password hardcoded in the website. Invite the owner in `https://www.sanity.io/manage` under the Cliniq project **Members** section. This gives each person their own login and keeps events, images, leads and SEO protected.

### If Sanity says “Before you continue…” / CORS origin required
That message is separate from the private `/admin` password. Sanity blocks every new domain until it is added as an allowed origin. Do this once for production and once for each Vercel preview domain you want to use:
1. Go to `https://www.sanity.io/manage` and open the Cliniq Maastricht project.
2. Go to **API** → **CORS Origins**.
3. Click **Add CORS origin**.
4. Paste the exact URL shown in the Sanity popup, for example `https://cliniq-maastricht-727t35cot-elkes-projects-97024c91.vercel.app`.
5. Enable credentials if Sanity offers that option, then save.
6. Also add `https://www.cliniqmaastricht.nl` before going live.
7. Refresh `/studio` and log in again.

For day-to-day use, use `https://www.cliniqmaastricht.nl/admin` or the production CMS URL `https://www.cliniqmaastricht.nl/studio` after launch. Preview URLs change often, so they may ask for CORS again.

## 2. Edit page texts
Go to **Page Manager**. Create or open the page record for the relevant page/language, for example `home`, `cocktail-workshop`, `event-space`, `contact`, `jobs` or `house-rules`. Edit hero title, hero subtitle, main copy, CTA labels, FAQs, price, group size, capacity and facilities. If a field is empty, the website uses the polished fallback copy from the code so the page never breaks.

## 3. Change images
Go to **Media Library**. Upload a new image. The photos pasted into chat are not repository files; to use those exact photos, upload them into Sanity Media Library or place the original files in `public/images/cliniq/`. Then set a clear title and alt text, choose the usage such as homepage hero, event poster, workshop, venue hire, gallery or social image, and use Sanity hotspot/crop to choose the focal point. For dark nightlife photos, use the brightness field as a note for frontend tuning. Assign images to pages through **Page Manager** or to events through **Events Manager**.

## 4. Add agenda events
Go to **Events Manager** → **Create new**. Fill in event title, Dutch/English title if needed, date, opening time, closing time, age limit, poster image, short description, full description and ticket/reservation link. The first tab is designed for the fast “Add Event → Upload Poster → Set Date → Publish” workflow.

## 5. Publish or unpublish events
In **Events Manager**, use the **Published** toggle. Published events appear on the agenda when their date is today or in the future. Unpublished events are hidden. Featured events can appear on the homepage. Events are automatically sorted by date; old events drop out of the upcoming agenda.

## 6. View form submissions
Go to **Lead Dashboard**. Every cocktail workshop inquiry, event space inquiry, contact form and job application is stored there with date, status, contact details, message and source page. Change status from `new` to `in-progress` or `handled` when followed up. Export CSV via `/api/leads/export?token=YOUR_LEADS_EXPORT_TOKEN`.

## 7. Update SEO fields
Go to **SEO Manager**. Choose the page and language, then edit SEO title, meta description, Open Graph title, Open Graph description, social image, canonical URL and focus keywords. Dutch and English have separate SEO records and hreflang is generated automatically.

## 8. What is still hardcoded?
The design system, page layout, route structure, redirects, form field structure and fallback copy are code-controlled for stability. Normal business content — page text overrides, FAQs, images, events, prices, capacity, opening hours/contact settings, leads and SEO metadata — is manageable in Sanity. If a Sanity field is left empty, the site falls back to safe default copy instead of showing a broken page.

## 9. Redirects
Redirects are handled in `next.config.ts` before any page loads. That means no redirect flash and no client-side redirect chain. `/lockers` goes permanently to the external locker shop. `/artiesten` goes permanently to `/uitgaan`. All previous SEO redirects are preserved.

## 10. Post-deployment checklist
After deployment, check `/`, `/uitgaan`, `/cocktail-workshop`, `/event-space`, `/contact`, `/en`, `/en/nightlife`, `/studio`, `/sitemap.xml`, `/robots.txt` and `/lockers`. Add one test event, publish it, confirm it appears on the agenda, submit one test form, confirm it appears in **Lead Dashboard**, then mark it as handled.
