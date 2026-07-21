#!/usr/bin/env node
// Constraint-proofing harness. Proves, on every run:
//   1. Zero URL/route changes (route manifest === baseline, exactly).
//   2. Zero visible-copy changes on every watched page (byte-identical text extraction).
//   3. No structured-data regressions (every JSON-LD @type in the baseline is still present —
//      new additions are fine, e.g. shipping FAQPage schema for a new GEO answer block).
//   4. SSR content check: with JS never executed (this script only ever does a plain fetch,
//      exactly what a crawler sees), each page's raw HTML still contains its expected body copy
//      and at least one JSON-LD block.
// Exits non-zero and prints a readable diff on any violation.
import fs from 'node:fs'
import path from 'node:path'
import {
  runBuild,
  withServer,
  readRouteManifest,
  extractVisibleText,
  extractJsonLdTypes,
  fetchWithTimeout,
  ROUTES_BASELINE,
  COPY_BASELINE_DIR,
  BASELINE_DIR,
} from './lib.mjs'
import { WATCHED_PAGES } from './pages.mjs'

function diffLines(baseline, current) {
  const a = baseline.split('\n')
  const b = current.split('\n')
  const max = Math.max(a.length, b.length)
  const diffs = []
  for (let i = 0; i < max; i++) {
    if (a[i] !== b[i]) diffs.push({ line: i + 1, before: a[i] ?? '(missing)', after: b[i] ?? '(missing)' })
  }
  return diffs
}

if (!fs.existsSync(ROUTES_BASELINE)) {
  console.error('No baseline found. Run `node scripts/constraint-check/capture-baseline.mjs --confirm` first (only after reviewing that the current state is the approved one).')
  process.exit(1)
}

let failed = false

console.log('[constraint-check] Building…')
await runBuild()

console.log('[constraint-check] Checking route manifest…')
const baselineRoutes = JSON.parse(fs.readFileSync(ROUTES_BASELINE, 'utf8'))
const currentRoutes = readRouteManifest()
const added = currentRoutes.filter((r) => !baselineRoutes.includes(r))
const removed = baselineRoutes.filter((r) => !currentRoutes.includes(r))
if (added.length || removed.length) {
  failed = true
  console.error('  FAIL — route manifest changed:')
  added.forEach((r) => console.error(`    + ${r}`))
  removed.forEach((r) => console.error(`    - ${r}`))
} else {
  console.log(`  OK — ${currentRoutes.length} routes, unchanged.`)
}

const baselineJsonLd = JSON.parse(fs.readFileSync(path.join(BASELINE_DIR, 'jsonld.json'), 'utf8'))

console.log('[constraint-check] Checking visible copy + JSON-LD on watched pages…')
await withServer(4611, async (base) => {
  for (const page of WATCHED_PAGES) {
    const snapshotPath = path.join(COPY_BASELINE_DIR, `${page.name}.txt`)
    if (!fs.existsSync(snapshotPath)) {
      console.warn(`  SKIP ${page.path} — no baseline snapshot (new watched page? run capture-baseline).`)
      continue
    }

    const res = await fetchWithTimeout(base + page.path)
    if (!res.ok) {
      failed = true
      console.error(`  FAIL ${page.path} — HTTP ${res.status}`)
      continue
    }
    const html = await res.text()

    // No-JS SSR content check: this fetch never executed JS, so if the copy/schema is here,
    // it's here for crawlers and AI engines too.
    if (!html.includes('application/ld+json')) {
      failed = true
      console.error(`  FAIL ${page.path} — no JSON-LD found in raw HTML.`)
    }

    const currentText = extractVisibleText(html)
    const baselineText = fs.readFileSync(snapshotPath, 'utf8').replace(/\n$/, '')
    const diffs = diffLines(baselineText, currentText)
    if (diffs.length) {
      failed = true
      console.error(`  FAIL ${page.path} — visible copy changed (${diffs.length} line(s)):`)
      diffs.slice(0, 8).forEach((d) => {
        console.error(`    line ${d.line}:`)
        console.error(`      before: ${d.before}`)
        console.error(`      after:  ${d.after}`)
      })
      if (diffs.length > 8) console.error(`    … and ${diffs.length - 8} more`)
    } else {
      console.log(`  OK   ${page.path} — copy unchanged.`)
    }

    const currentTypes = extractJsonLdTypes(html)
    const baselineTypes = baselineJsonLd[page.name] || []
    const missingTypes = baselineTypes.filter((t) => !currentTypes.includes(t))
    if (missingTypes.length) {
      failed = true
      console.error(`  FAIL ${page.path} — lost JSON-LD type(s): ${missingTypes.join(', ')}`)
    }
  }
})

if (failed) {
  console.error('\n[constraint-check] FAILED — see above. If a copy change is an approved GEO answer block, review it, then re-run capture-baseline.mjs --confirm and list the new strings in your report.')
  process.exit(1)
}

console.log('\n[constraint-check] PASSED — zero URL changes, zero copy changes, no structured-data regressions, all watched pages SSR their content.')
