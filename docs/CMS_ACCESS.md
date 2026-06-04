# CMS access and admin login

Use `https://www.cliniqmaastricht.nl/admin` as the simple owner start page. From there, click **Open CMS** to enter the Sanity Studio at `/studio`.

Sanity is the secure admin login. The owner should be invited to the Sanity project with their own email address; the website does not store a shared admin password in code. This is safer and avoids a custom login system that would need separate security, password resets and user management.

## If `/studio` shows “Before you continue…” / CORS

If `/studio` shows “Before you continue… add the following URL as a CORS origin”, the website is deployed correctly but Sanity has not approved that domain yet.

1. Open `https://www.sanity.io/manage`.
2. Select the Cliniq Maastricht project.
3. Go to **API** → **CORS Origins**.
4. Click **Add CORS origin**.
5. Paste the exact Vercel URL shown in the popup.
6. Enable credentials if Sanity offers that option.
7. Also add `https://www.cliniqmaastricht.nl` for production.
8. Save, refresh `/studio`, and log in.

This must be done for every Vercel preview URL you want to use, because Vercel preview domains are unique. The production domain only needs to be added once.

## Photos

The website fallback images are Cliniq Maastricht images from the existing Cliniq/Squarespace image library, not generic stock photos. For new photography, upload the approved files in **Media Library** inside Sanity, set the crop/focal point and assign them to a page, event poster or gallery.
