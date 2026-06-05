# Cliniq Maastricht Admin Manual

The website now uses a built-in admin dashboard, not Sanity. Open `https://www.cliniqmaastricht.nl/admin` and log in with `ADMIN_USERNAME` and `ADMIN_PASSWORD` from Vercel. You can use an email address as `ADMIN_USERNAME`; the login system is email-safe and ignores accidental spaces around environment variable values.

## What the admin manages
- **Dashboard:** upcoming events, new leads, image count and quick actions.
- **Events Manager:** add/edit event title, subtitles, date, opening time, closing time, age limit, image URL, ticket link, featured and published toggles.
- **Media Library:** upload approved Cliniq photos when `BLOB_READ_WRITE_TOKEN` is configured, or add an already-hosted Cliniq image URL. Uploaded/admin-selected images are used first; Cliniq fallback assets are used only when an image is missing.
- **Page Editor:** edit homepage, nightlife, cocktail workshop, event space, contact, jobs and house-rules text in Dutch and English.
- **FAQ Manager:** add detailed FAQ answers per page and language.
- **Forms / Leads:** view contact, workshop, event-space and job inquiries, change status and export CSV.
- **SEO Settings:** edit SEO title, meta description, OG title, OG description, canonical URL and social image per page/language.
- **Site Settings:** update phone, email, WhatsApp, address, socials and opening hours.

## Add a new event
1. Go to `/admin/events`.
2. Fill title, date, opening/closing time and age limit.
3. Add the image URL from Media Library or a local `/images/cliniq/...` file.
4. Add Dutch and English descriptions.
5. Toggle **Published** and optionally **Featured**.
6. Save. The public agenda automatically sorts upcoming published events.

## Change a photo
1. Go to `/admin/media`.
2. Upload the approved Cliniq image file, or paste an already-hosted Cliniq image URL.
3. Add a clear title and Dutch/English alt text.
4. Go to `/admin/pages` or `/admin/events`.
5. Assign that image to the page/event and save.

## Important image note
Images pasted into chat are not repository files. To use those exact photos, upload the original image files through `/admin/media` after Vercel Blob is connected, paste real hosted Cliniq image URLs, or place the source files in `public/images/cliniq/` so they can be referenced by the site.

## Login troubleshooting
- If login keeps returning to the login screen, make sure you deployed the latest commit after changing Vercel environment variables. Vercel does not apply new env vars to an already-built deployment.
- `ADMIN_USERNAME` can be a normal username or email address.
- Do not include extra quotes in Vercel values. The app now strips accidental wrapping quotes/spaces, but the safest setup is to paste plain values.
- `ADMIN_SESSION_SECRET` should be a long random value and should stay the same between deployments, otherwise old sessions will be logged out.

## Deployment variables
Required:
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `LEADS_EXPORT_TOKEN`

Strongly recommended for production:
- `POSTGRES_URL` — stores admin edits, events, pages, FAQs, SEO, settings and leads permanently. Without it, Vercel can only use a temporary fallback.
- `BLOB_READ_WRITE_TOKEN` — enables direct photo uploads in Media Library. Without it, you can still paste already-hosted image URLs.

Optional:
- `RESEND_API_KEY`
- `FORM_FROM_EMAIL`
- `FORM_TO_EMAIL`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`

## Redirects
Redirects are server-side in `next.config.ts`. `/lockers` permanently redirects to `https://cliniq.elockers.shop/cliniq/lockers`; all previous SEO redirects are preserved.
