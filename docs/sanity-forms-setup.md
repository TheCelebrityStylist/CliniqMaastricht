# Sanity form lead capture setup

Phase 1 only sends website form submissions to Sanity as `lead` documents. The public website, custom admin, page content, events, albums, uploads and styling are not changed by this setup.

## Required Vercel environment variables

Add these variables to the Vercel project and redeploy:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` — Sanity project ID.
- `NEXT_PUBLIC_SANITY_DATASET` — Sanity dataset name. Use `production` unless you created another dataset.
- `SANITY_API_WRITE_TOKEN` — Sanity API token with permission to create documents.

If any required value is missing, the form API returns:

```json
{ "success": false, "error": "Form backend not configured" }
```

## Lead document shape

Each successful form submission creates this Sanity document:

```json
{
  "_type": "lead",
  "type": "contact | workshop | eventSpace | job",
  "status": "new",
  "name": "Submitted name",
  "email": "Submitted email",
  "phone": "Optional phone",
  "message": "Optional message",
  "sourcePage": "/page-path",
  "submittedAt": "2026-06-11T00:00:00.000Z",
  "payload": {}
}
```

## Lead schema for Sanity Studio

Add a `lead` document schema to the hosted Sanity Studio:

```ts
export default {
  name: 'lead',
  title: 'Leads / Form Submissions',
  type: 'document',
  fields: [
    { name: 'type', title: 'Type', type: 'string', options: { list: ['contact', 'workshop', 'eventSpace', 'job'] } },
    { name: 'status', title: 'Status', type: 'string', initialValue: 'new', options: { list: ['new', 'contacted', 'handled'] } },
    { name: 'name', title: 'Name', type: 'string' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'phone', title: 'Phone', type: 'string' },
    { name: 'message', title: 'Message', type: 'text' },
    { name: 'sourcePage', title: 'Source page', type: 'string' },
    { name: 'submittedAt', title: 'Submitted at', type: 'datetime' },
    { name: 'payload', title: 'Payload', type: 'object', fields: [{ name: 'raw', title: 'Raw', type: 'text' }] }
  ]
}
```

## API routes

The website posts form submissions to:

- `/api/forms/contact`
- `/api/forms/workshop`
- `/api/forms/event-space`
- `/api/forms/job`

On success the API returns:

```json
{ "success": true }
```

If Sanity rejects the write, the API returns:

```json
{ "success": false, "error": "Could not save form submission" }
```
