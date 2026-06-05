# Vercel deployment fix

If Vercel shows `Invalid package name "date-fns/locale"`, it is deploying an old commit that still contains an invalid dependency. The current codebase no longer uses `date-fns` or `date-fns/locale`.

## Correct production deployment

1. Make sure production deploys the latest commit from the branch that contains the built-in admin dashboard.
2. Do not redeploy the old commit named `Add files via upload`; that commit contains the invalid package entry.
3. In Vercel, either:
   - promote the latest green preview deployment to production, or
   - merge the latest branch into `main` and trigger a fresh production deployment.

## Local safety checks

Run these before deploying:

```bash
npm run preflight
git diff --check
```

The preflight check fails if someone reintroduces invalid package names like `date-fns/locale`, Sanity dependencies, or stock/Unsplash image URLs.
