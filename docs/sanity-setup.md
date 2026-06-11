# Sanity setup for CLINIQ Maastricht

Phase 1 uses a separately hosted Sanity Studio. The Vercel frontend does not embed `/studio`; Sanity is the backend/editor for forms first, and public pages keep their existing fallback content if Sanity is not configured.

## 1. Create the Sanity project

1. Go to <https://www.sanity.io/manage>.
2. Create a project for **CLINIQ Maastricht**.
3. Create or use the dataset named `production`.
4. Keep the project ID and dataset name for Vercel.

## 2. Add schemas to hosted Sanity Studio

Use the schema files in this repository under `studio/sanity/schemas/`:

- `siteSettings`
- `page`
- `dj`
- `event`
- `album`
- `faq`
- `lead`

The required lead schema stores form submissions with:

- `type`: `contact`, `workshop`, `eventSpace`, or `job`
- `status`: `new`, `contacted`, or `handled`
- `name`, `email`, `phone`, `message`, `sourcePage`
- `submittedAt`
- `payload`
- `internalNotes`

## 3. Create API tokens

In Sanity Manage:

1. Open the project.
2. Go to **API**.
3. Create a read token and save it as `SANITY_API_READ_TOKEN`.
4. Create a write token and save it as `SANITY_API_WRITE_TOKEN`.

## 4. Add Vercel environment variables

Add these variables in Vercel → Project Settings → Environment Variables:

```txt
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_read_token
SANITY_API_WRITE_TOKEN=your_write_token
```

Then redeploy the frontend.

## 5. Configure CORS origins

In Sanity Manage → API → CORS origins, add these origins with credentials enabled:

```txt
https://www.cliniqmaastricht.nl
https://cliniqmaastricht.nl
https://*.vercel.app
http://localhost:3000
```

## 6. Owner workflow

The owner edits content in the hosted Sanity Studio, not inside the Vercel frontend.

- Forms appear under the `lead` document type.
- Images for future CMS-managed pages/events/albums should be uploaded in Sanity Studio.
- Existing public pages keep working with fallback content while Sanity is missing or unavailable.

## 7. Form behavior

The frontend form routes are:

- `/api/forms/contact`
- `/api/forms/workshop`
- `/api/forms/event-space`
- `/api/forms/job`

Each route validates the submission and creates a Sanity `lead` document. If Sanity is not configured, the route returns: `Form backend not configured`.
