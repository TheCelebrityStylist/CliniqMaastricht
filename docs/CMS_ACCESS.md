# CMS access fix: Sanity CORS

If `/studio` shows “Before you continue… add the following URL as a CORS origin”, the website is deployed correctly but Sanity has not approved that domain yet.

## Fix it
1. Open `https://www.sanity.io/manage`.
2. Select the Cliniq Maastricht project.
3. Go to **API** → **CORS Origins**.
4. Add the exact Vercel URL shown in the popup.
5. Add `https://www.cliniqmaastricht.nl` for production.
6. Save, refresh `/studio`, and log in.

This must be done for every Vercel preview URL you want to use, because Vercel preview domains are unique. The production domain only needs to be added once.
