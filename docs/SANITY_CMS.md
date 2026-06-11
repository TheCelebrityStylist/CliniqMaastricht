# CLINIQ CMS — Sanity workflow

Sanity Studio is now the source of truth for day-to-day website content. Open `/studio` to manage the site.

## Owner workflows

### Change a DJ image
1. Open `/studio`.
2. Go to **Agenda → DJs**.
3. Select the DJ.
4. Upload or replace the image.
5. Publish.

Regular events automatically use the DJ image unless the event has its own custom image.

### Change a page hero or gallery
1. Open `/studio`.
2. Go to **Website Pages**.
3. Select the page.
4. Replace the hero image or add gallery images.
5. Publish.

### Create an event
1. Open **Agenda → Events**.
2. Create an event.
3. Choose the DJ, date, times, age and event type.
4. Publish.

### Create a photo album
1. Open **Photos → Albums**.
2. Create an album.
3. Upload photos into the `photos` array.
4. Choose a cover image.
5. Publish.

### View form submissions
Open **Inbox → Leads / Form Submissions**. Contact, workshop, event-space and job forms create Sanity `lead` documents.

## Required environment variables

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN`
- `SANITY_API_WRITE_TOKEN`

Optional:

- `RESEND_API_KEY`
- `FORM_NOTIFICATION_EMAIL`
- `LEADS_EXPORT_TOKEN`

Vercel Blob, Google Sheets and Google Drive are not part of the daily CMS workflow.
