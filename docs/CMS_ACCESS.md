# CMS access and admin login

Use `https://www.cliniqmaastricht.nl/admin` as the private owner start page. The `/admin` and `/studio` routes are protected with a browser login prompt using `ADMIN_USERNAME` and `ADMIN_PASSWORD` from Vercel environment variables.

After that first private login, click **Open CMS** to enter the Sanity Studio at `/studio`. Sanity is still the secure content-management login: the owner should be invited to the Sanity project with their own email address.

## Required Vercel environment variables for private admin access

Add these in Vercel → Project → Settings → Environment Variables:

```env
ADMIN_USERNAME=choose-a-private-username
ADMIN_PASSWORD=choose-a-strong-private-password
```

If these are missing, the admin area stays locked instead of becoming public.

## If `/studio` shows “Before you continue…” / CORS

The private admin login protects the backend pages, but Sanity still requires each website domain to be allowed before the embedded Studio can read/write content. If `/studio` shows “Before you continue… add the following URL as a CORS origin”, the website is deployed correctly but Sanity has not approved that domain yet.

1. Open `https://www.sanity.io/manage`.
2. Select the Cliniq Maastricht project.
3. Go to **API** → **CORS Origins**.
4. Click **Add CORS origin**.
5. Paste the exact Vercel URL shown in the popup.
6. Enable credentials if Sanity offers that option.
7. Also add `https://www.cliniqmaastricht.nl` for production.
8. Save, refresh `/studio`, and log in.

This must be done for every Vercel preview URL you want to use, because Vercel preview domains are unique. The production domain only needs to be added once. If you do not want to deal with preview-domain CORS, use the production domain for daily admin work after launch.

## Photos

The website fallback images are Cliniq Maastricht images from the existing Cliniq/Squarespace image library, not generic stock photos. The images pasted into chat are not files inside this repository, so they cannot be committed unless they are uploaded as actual image files or added to Sanity.

For new photography, upload the approved files in **Media Library** inside Sanity, set the crop/focal point and assign them to a page, event poster or gallery. If you want those exact supplied photos committed into the repo instead of CMS-managed, place them in `public/images/cliniq/` and they can be wired as local `next/image` assets.
