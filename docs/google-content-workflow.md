# Google content workflow for CLINIQ Maastricht

Day-to-day agenda and photo updates are managed with Google Sheets and Google Drive. The website backend is only for sync status, manual refresh, leads, SEO/page settings, and fallback/manual media overrides.

## Update agenda

1. Open the Google Sheet.
2. Add or edit a row in the Events tab.
3. Wait 10 minutes or click **Refresh events** in `/admin/sync` or `/admin/events`.

## Add website photos

1. Open Google Drive.
2. Add images to the correct folder:
   - Homepage
   - Uitgaan
   - Cocktail Workshop
   - Ruimte Huren
   - Contact
3. Wait 10 minutes or click **Refresh photos** in `/admin/sync` or `/admin/media`.

## Add a photo album

1. Create a folder inside the Albums folder.
2. Name it `YYYY-MM-DD Album Name`.
3. Upload photos.
4. Refresh photos.

Folders starting with `DRAFT` or `_` are not published.

## Required Vercel environment variables

### Google service account

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`

### Google Sheet agenda

- `GOOGLE_SHEET_ID`
- `GOOGLE_EVENTS_SHEET_NAME` (optional; defaults to `Events`)
- `GOOGLE_EVENTS_SHEET_URL` (optional admin convenience link)

### Google Drive photos

- `GOOGLE_DRIVE_HOMEPAGE_FOLDER_ID`
- `GOOGLE_DRIVE_UITGAAN_FOLDER_ID`
- `GOOGLE_DRIVE_WORKSHOP_FOLDER_ID`
- `GOOGLE_DRIVE_EVENT_SPACE_FOLDER_ID`
- `GOOGLE_DRIVE_CONTACT_FOLDER_ID`
- `GOOGLE_DRIVE_ALBUMS_ROOT_FOLDER_ID`
- `GOOGLE_DRIVE_ROOT_URL` (optional admin convenience link)

### Optional Vercel Blob image caching

- `BLOB_READ_WRITE_TOKEN`

If `BLOB_READ_WRITE_TOKEN` exists, Drive images are copied server-side to Vercel Blob and public Blob URLs are used. If it is missing, the site uses a server-side Drive image proxy as a temporary fallback with caching. This avoids exposing service account credentials in the browser.

## Google Cloud setup

1. Create or choose a Google Cloud project.
2. Enable the Google Sheets API.
3. Enable the Google Drive API.
4. Create a service account.
5. Create a service account key and copy the service account email/private key into Vercel environment variables.
6. Share the Google Sheet and Drive folders with the service account email as Viewer.

## Sharing permissions

The service account must have viewer access to:

- the agenda Google Sheet
- each website photo folder
- the Albums root folder and its album folders

## Test sync

- Events JSON: `/api/events/sync`
- Refresh events: `/api/events/revalidate`
- Section photos: `/api/photos/section/homepage`
- Album list: `/api/photos/albums`
- Admin dashboard: `/admin/sync`

If credentials are missing, the public website still builds and uses fallback events/images. The admin sync page shows “Google sync is not configured.”
