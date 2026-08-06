Drop 10-16 real club photos here (`.jpg`, `.jpeg`, `.png`, or `.webp`) - any filenames.

`scripts/media.mjs` grades every photo in this folder onto the brand duotone ramp and writes
responsive WebP output to `graded/` (gitignored, regenerated automatically). It runs in
`prebuild`, so a normal `npm run build` picks up whatever's here with no extra steps - or run
`npm run media` directly to regenerate without a full build.

The homepage, `/uitgaan`, `/en/nightlife`, `/fotos` and `/en/photos` all read the graded output
via `lib/photoPile.ts` and render the throwable photo pile automatically once at least one photo
has been graded. With this folder empty, those sections simply don't render - nothing to wire by
hand once real photos land.
