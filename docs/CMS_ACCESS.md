# Admin access

Sanity has been removed. The site now uses a built-in admin dashboard.

Open:

```txt
https://www.cliniqmaastricht.nl/admin
```

Log in with the `ADMIN_USERNAME` and `ADMIN_PASSWORD` configured in Vercel.

## Sections
- Dashboard
- Events Manager
- Media Library
- Page Editor
- FAQ Manager
- Forms / Leads
- SEO Settings
- Site Settings

## Photos
Only approved Cliniq photos should be added. The admin uses uploaded/admin-provided images first and falls back to branded Cliniq assets only if a field is empty. No Unsplash or stock photo workflow is used.


## Admin login troubleshooting

If `/admin/login` does not accept your login, check these points first:

1. `ADMIN_USERNAME` and `ADMIN_PASSWORD` must be set in Vercel for the environment you are opening (Production or Preview).
2. Redeploy after changing environment variables. Existing Vercel deployments do not automatically receive new values.
3. You may use an email address as `ADMIN_USERNAME`; the session cookie now supports dots in email addresses.
4. Paste values without wrapping quotes. Accidental spaces/quotes are now tolerated, but plain values are best.

## Albums and mass photo upload

Use `/admin/albums` for public night galleries. Create an album, upload many photos at once, choose a cover image, set NL/EN titles and publish it. Published albums appear on `/fotos`, `/en/photos`, and gallery sections across the public site.
