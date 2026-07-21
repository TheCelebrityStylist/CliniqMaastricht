#!/usr/bin/env node
// Captures the constraint-proofing baseline: the route manifest and the visible-copy snapshot
// of every watched page. Run this ONLY when you've made an intentional, reviewed change to
// copy or routes (e.g. shipping an approved GEO answer block) — never to silently paper over
// a regression. Requires --confirm, and refuses to run if a baseline already exists unless you
// also pass --force (so accidental re-runs can't quietly erase the diff you were about to review).
import fs from 'node:fs'
import path from 'node:path'
import { runBuild, withServer, readRouteManifest, extractVisibleText, extractJsonLdTypes, fetchWithTimeout, ROUTES_BASELINE, COPY_BASELINE_DIR, BASELINE_DIR, ensureDir } from './lib.mjs'
import { WATCHED_PAGES } from './pages.mjs'

const args = process.argv.slice(2)
if (!args.includes('--confirm')) {
  console.error('Refusing to write baseline without --confirm. This overwrites the copy-diff source of truth — only run it after an intentional, reviewed copy/route change.')
  process.exit(1)
}
if (fs.existsSync(ROUTES_BASELINE) && !args.includes('--force')) {
  console.error('Baseline already exists. Pass --force to overwrite (and make sure you have reviewed what changed first, e.g. via `node scripts/constraint-check/verify.mjs`).')
  process.exit(1)
}

console.log('[constraint-check] Building…')
await runBuild()

const routes = readRouteManifest()
ensureDir(BASELINE_DIR)
fs.writeFileSync(ROUTES_BASELINE, JSON.stringify(routes, null, 2) + '\n')
console.log(`[constraint-check] Captured ${routes.length} routes.`)

ensureDir(COPY_BASELINE_DIR)
const jsonLdManifest = {}

await withServer(4610, async (base) => {
  for (const page of WATCHED_PAGES) {
    const res = await fetchWithTimeout(base + page.path)
    if (!res.ok) {
      console.warn(`[constraint-check] WARNING: ${page.path} returned ${res.status}, skipping snapshot.`)
      continue
    }
    const html = await res.text()
    const text = extractVisibleText(html)
    fs.writeFileSync(path.join(COPY_BASELINE_DIR, `${page.name}.txt`), text + '\n')
    jsonLdManifest[page.name] = extractJsonLdTypes(html)
    console.log(`[constraint-check] Captured copy + JSON-LD for ${page.path}`)
  }
})

fs.writeFileSync(path.join(BASELINE_DIR, 'jsonld.json'), JSON.stringify(jsonLdManifest, null, 2) + '\n')
fs.writeFileSync(path.join(BASELINE_DIR, 'meta.json'), JSON.stringify({ capturedAt: new Date().toISOString() }, null, 2) + '\n')

console.log('[constraint-check] Baseline written to scripts/constraint-check/baseline/. Commit it.')
