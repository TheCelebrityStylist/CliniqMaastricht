# Cliniq Maastricht Admin Manual

The website now uses a built-in admin dashboard, not Sanity. Open `https://www.cliniqmaastricht.nl/admin` and log in with `ADMIN_USERNAME` and `ADMIN_PASSWORD` from Vercel.

## What the admin manages
- **Dashboard:** upcoming events, new leads, image count and quick actions.
- **Events Manager:** add/edit event title, subtitles, date, opening time, closing time, age limit, image URL, ticket link, featured and published toggles.
- **Media Library:** add approved Cliniq photos, alt text and usage tags. Uploaded/admin-selected images are used first; Cliniq fallback assets are used only when an image is missing.
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
2. Add the approved Cliniq image URL and alt text.
3. Go to `/admin/pages` or `/admin/events`.
4. Assign that image to the page/event.
5. Save.

## Important image note
Images pasted into chat are not repository files. To use those exact photos, upload them through the admin/media workflow as real hosted URLs, or place the source files in `public/images/cliniq/` so they can be referenced by the site.

## Deployment variables
Required:
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `LEADS_EXPORT_TOKEN`

Optional:
- `RESEND_API_KEY`
- `FORM_FROM_EMAIL`
- `FORM_TO_EMAIL`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`

## Redirects
Redirects are server-side in `next.config.ts`. `/lockers` permanently redirects to `https://cliniq.elockers.shop/cliniq/lockers`; all previous SEO redirects are preserved.
