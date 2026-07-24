#!/usr/bin/env node
// Design/usability audit harness (Part 9 of the brief): screenshots + hard-fail checks at four
// widths on the four pages that matter most. This is the harness that must pass, and be actually
// looked at, before any phase is reported as done - it exists specifically because a previous
// attempt reported work as complete without ever rendering it, and shipped a clipped hero on
// mobile as a result.
import { chromium } from 'playwright-core'
import path from 'node:path'
import fs from 'node:fs'
import { runBuild, withServer, randomPort, ensureDir } from './constraint-check/lib.mjs'

const ROOT = path.join(import.meta.dirname, '..')
const AUDIT_DIR = path.join(ROOT, 'audit')
const WIDTHS = [320, 390, 430, 1440]
const PAGES = [
  { path: '/', name: 'home' },
  { path: '/uitgaan', name: 'uitgaan' },
  { path: '/cocktail-workshop', name: 'cocktail-workshop' },
  { path: '/event-space', name: 'event-space' },
]
const MIN_TAP_TARGET = 44

function relLuminance([r, g, b]) {
  const chan = (c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b)
}

function contrastRatio(rgbA, rgbB) {
  const lA = relLuminance(rgbA) + 0.05
  const lB = relLuminance(rgbB) + 0.05
  return lA > lB ? lA / lB : lB / lA
}

function parseRgb(str) {
  const m = str.match(/rgba?\(([^)]+)\)/)
  if (!m) return null
  const parts = m[1].split(',').map((s) => parseFloat(s.trim()))
  return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 }
}

async function auditPage(page, baseUrl, pageName, pagePath, width) {
  const findings = []
  await page.setViewportSize({ width, height: 900 })
  // 'load', not 'networkidle': this app has ongoing background polling (live countdown tick,
  // analytics) that can keep a connection open indefinitely and make networkidle never resolve.
  await page.goto(`${baseUrl}${pagePath}`, { waitUntil: 'load', timeout: 30000 })
  await page.waitForTimeout(1200)

  // 1. Horizontal overflow at the document level
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }))
  if (overflow.scrollWidth > overflow.innerWidth + 4) {
    findings.push({ severity: 'FAIL', check: 'horizontal-overflow', detail: `scrollWidth ${overflow.scrollWidth} > innerWidth ${overflow.innerWidth}` })
  }

  // 2. Any single element wider than the viewport (catches clipped/overflowing text even when
  //    an ancestor's own overflow:hidden hides it from the document-level scrollWidth check)
  const wideElements = await page.evaluate((vw) => {
    const out = []
    document.querySelectorAll('h1, h2, h3, p, span, a, button, div').forEach((el) => {
      if (el.children.length > 0 && el.tagName !== 'A' && el.tagName !== 'BUTTON') return
      const rect = el.getBoundingClientRect()
      if (rect.width > vw + 2 && el.textContent?.trim()) {
        out.push({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 60), text: el.textContent.slice(0, 40), width: Math.round(rect.width) })
      }
    })
    return out.slice(0, 10)
  }, width)
  wideElements.forEach((el) => findings.push({ severity: 'FAIL', check: 'element-exceeds-viewport', detail: `${el.tag}.${el.cls} "${el.text}" is ${el.width}px wide (viewport ${width}px)` }))

  // 3. Overlapping fixed/sticky elements - persistent UI panels only. Excludes: sr-only skip
  //    links (clipped to ~1px until focus, not a real visual collision), and pointer-events:none
  //    decorations like the custom cursor dot/ring, which are deliberately meant to travel over
  //    every other fixed element on the page and aren't "persistent UI" in the sense this check
  //    (and the brief's "one floating-element system" rule) actually cares about.
  const overlaps = await page.evaluate(() => {
    const fixed = Array.from(document.querySelectorAll('body *')).filter((el) => {
      const cs = getComputedStyle(el)
      if (cs.position !== 'fixed' && cs.position !== 'sticky') return false
      if (cs.pointerEvents === 'none') return false
      const r = el.getBoundingClientRect()
      if (cs.clipPath !== 'none' || cs.clip !== 'auto') return false
      return r.width > 8 && r.height > 8 && cs.visibility !== 'hidden' && cs.display !== 'none'
    })
    const rects = fixed.map((el) => ({ cls: (el.className || '').toString().slice(0, 60), tag: el.tagName, rect: el.getBoundingClientRect(), contains: fixed.filter((o) => o !== el && el.contains(o)).length > 0 }))
    const collisions = []
    for (let i = 0; i < rects.length; i++) {
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i], b = rects[j]
        if (a.contains || b.contains) continue // nested by design, not a collision
        const overlap = !(a.rect.right < b.rect.left || a.rect.left > b.rect.right || a.rect.bottom < b.rect.top || a.rect.top > b.rect.bottom)
        if (overlap) collisions.push({ a: `${a.tag}.${a.cls}`, b: `${b.tag}.${b.cls}` })
      }
    }
    return collisions
  })
  overlaps.forEach((c) => findings.push({ severity: 'FAIL', check: 'overlapping-fixed-elements', detail: `${c.a} overlaps ${c.b}` }))

  // 4. Tap target size (interactive elements, visible, not aria-hidden). Skips the skip-to-
  //    content link (sr-only until keyboard focus, not a touch target by design) and WCAG 2.5.5's
  //    own exemption for "a link... in a sentence or block of text" - an inline <a> whose
  //    computed display is the default `inline` sits in running prose and isn't expected to carry
  //    its own 44px box; a stacked link LIST (nav, footer) doesn't get that exemption.
  const smallTargets = await page.evaluate((min) => {
    const els = Array.from(document.querySelectorAll('a, button, [role="button"], input, select, textarea'))
    const out = []
    for (const el of els) {
      if (el.getAttribute('aria-hidden') === 'true' || el.closest('[aria-hidden="true"]')) continue
      if (el.className?.toString?.().includes('sr-only')) continue
      const cs = getComputedStyle(el)
      if (cs.display === 'none' || cs.visibility === 'hidden') continue
      if (el.tagName === 'A' && cs.display === 'inline') continue
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 && rect.height === 0) continue
      if (rect.width < min || rect.height < min) {
        out.push({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 50), text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30), w: Math.round(rect.width), h: Math.round(rect.height) })
      }
    }
    return out.slice(0, 20)
  }, MIN_TAP_TARGET)
  smallTargets.forEach((t) => findings.push({ severity: 'FAIL', check: 'tap-target-too-small', detail: `${t.tag}.${t.cls} "${t.text}" is ${t.w}x${t.h}px (min ${MIN_TAP_TARGET}x${MIN_TAP_TARGET})` }))

  // 5. Contrast (approximate: computed text color vs nearest ancestor non-transparent background)
  const contrastIssues = await page.evaluate(() => {
    function nearestBg(el) {
      let node = el
      while (node) {
        const cs = getComputedStyle(node)
        const m = cs.backgroundColor.match(/rgba?\(([^)]+)\)/)
        if (m) {
          const parts = m[1].split(',').map((s) => parseFloat(s.trim()))
          const alpha = parts.length > 3 ? parts[3] : 1
          if (alpha > 0.5) return cs.backgroundColor
        }
        node = node.parentElement
      }
      return 'rgb(255,255,255)'
    }
    const out = []
    document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, li, label').forEach((el) => {
      if (el.children.length > 0) return
      const text = el.textContent?.trim()
      if (!text) return
      const cs = getComputedStyle(el)
      if (cs.display === 'none' || cs.visibility === 'hidden') return
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      out.push({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 50), text: text.slice(0, 30), color: cs.color, bg: nearestBg(el), fontSize: parseFloat(cs.fontSize), fontWeight: cs.fontWeight })
    })
    return out
  })
  for (const item of contrastIssues) {
    const fg = parseRgb(item.color)
    const bg = parseRgb(item.bg)
    if (!fg || !bg) continue
    const ratio = contrastRatio([fg.r, fg.g, fg.b], [bg.r, bg.g, bg.b])
    const isLarge = item.fontSize >= 24 || (item.fontSize >= 19 && parseInt(item.fontWeight) >= 700)
    const min = isLarge ? 3 : 4.5
    if (ratio < min) {
      findings.push({ severity: 'WARN', check: 'contrast', detail: `${item.tag}.${item.cls} "${item.text}" ratio ${ratio.toFixed(2)}:1 (need ${min}:1) — fg ${item.color} on bg ${item.bg}` })
    }
  }

  // Screenshot
  ensureDir(AUDIT_DIR)
  await page.screenshot({ path: path.join(AUDIT_DIR, `${pageName}-${width}.png`), fullPage: true })

  return findings
}

async function main() {
  console.log('[audit] Building...')
  await runBuild()
  const port = randomPort()
  let allFindings = []

  await withServer(port, async (baseUrl) => {
    // PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH is an escape hatch for sandboxed/CI environments that
    // pre-install a specific Chromium binary outside Playwright's own managed-browser layout
    // (this repo's dev sandbox is one). Leave unset anywhere `npx playwright install` has been run
    // normally - Playwright resolves its own browser in that case.
    const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {})
    const context = await browser.newContext()
    const page = await context.newPage()

    for (const p of PAGES) {
      for (const width of WIDTHS) {
        console.log(`[audit] ${p.name} @ ${width}px`)
        const findings = await auditPage(page, baseUrl, p.name, p.path, width)
        for (const f of findings) allFindings.push({ page: p.name, width, ...f })
      }
    }

    await context.close()
    await browser.close()
  })

  const fails = allFindings.filter((f) => f.severity === 'FAIL')
  const warns = allFindings.filter((f) => f.severity === 'WARN')

  console.log(`\n[audit] ${fails.length} FAIL, ${warns.length} WARN\n`)
  for (const f of [...fails, ...warns]) {
    console.log(`  ${f.severity}  ${f.page} @ ${f.width}px  [${f.check}]  ${f.detail}`)
  }

  fs.writeFileSync(path.join(AUDIT_DIR, 'results.json'), JSON.stringify(allFindings, null, 2))
  console.log(`\n[audit] Screenshots + results.json written to ${AUDIT_DIR}/`)

  if (fails.length > 0) {
    console.error(`\n[audit] FAILED — ${fails.length} hard failure(s). Fix before reporting a phase done.`)
    process.exit(1)
  }
  console.log('\n[audit] PASSED (hard checks). Review WARN items and screenshots by eye.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
