# Cliniq Maastricht Admin Manual

The website now uses a built-in admin dashboard, not Sanity. Open `https://www.cliniqmaastricht.nl/admin` and log in with `ADMIN_USERNAME` and `ADMIN_PASSWORD` from Vercel. You can use an email address as `ADMIN_USERNAME`; the login system is email-safe and ignores accidental spaces around environment variable values.

## What the admin manages
- **Dashboard:** upcoming events, new leads, image count and quick actions.
- **Events Manager:** add/edit internal title, NL/EN public titles, subtitles, descriptions, date, opening time, closing time, age limit, Media Library poster, focal point, ticket link, featured and published toggles; duplicate events and publish/unpublish from the list.
- **Media Library:** drag/drop or multi-upload approved Cliniq photos when `BLOB_READ_WRITE_TOKEN` is configured, preview them instantly, tag them by use, set alt text/focal point, see where they are used and delete unused images. Uploaded/admin-selected images are used first; branded Cliniq fallbacks are used only when an image is missing.
- **Albums:** create public photo albums for specific nights with NL/EN titles, date, related event, cover image, mass-uploaded photos and published/draft control.
- **Page Editor:** edit homepage, nightlife, cocktail workshop, event space, contact, jobs and house-rules hero text, body copy, CTAs, hero image and galleries in Dutch and English.
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
2. Drag one or more approved Cliniq image files into the upload box, or paste already-hosted Cliniq image URLs.
3. Add a clear title, Dutch/English alt text, usage tag and focal point.
4. Go to `/admin/pages` or `/admin/events`.
5. Assign that image as hero, gallery image or event poster and save.

## Important image note
Images pasted into chat are not repository files. To use those exact photos, upload the original image files through `/admin/media` after Vercel Blob is connected, paste real hosted Cliniq image URLs, or place the source files in `public/images/cliniq/` so they can be referenced by the site.


## Create a photo album
1. Go to `/admin/albums`.
2. Fill album title NL/EN and album date.
3. Optionally connect the album to an existing event.
4. Select a cover image or upload new photos directly in the album form.
5. Select existing Media Library photos if needed.
6. Toggle **Published** and save. The album appears at `/albums` and `/en/albums` with a shareable detail URL.

## Public galleries
- Homepage and Uitgaan show recent albums with **Bekijk alle foto’s** / **View all photos** links.
- `/albums` and `/en/albums` list all published albums.
- Each album has a shareable URL and photo navigation with previous/next controls.

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

## Premium design and image QA
- Public pages now use safer image fallbacks, brighter image treatment, varied galleries and stronger section rhythm.
- If an uploaded image is too dark or cropped badly, edit the Media Library focal point or replace the image globally.
- Check the homepage, agenda, workshop and event-space pages on mobile after replacing imagery.
