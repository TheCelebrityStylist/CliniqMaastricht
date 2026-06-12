# CLINIQ CMS — hosted Sanity workflow

Sanity is the target source of truth for day-to-day website content, but the Studio is hosted separately in Sanity. The Next.js frontend does not embed `/studio`.

## Owner workflows

### Change a DJ image
1. Open the hosted Sanity Studio URL from Sanity Manage.
2. Go to **Agenda → DJs**.
3. Select the DJ.
4. Upload or replace the image.
5. Publish.

### Change a page hero or gallery
1. Open the hosted Sanity Studio URL.
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
