#!/usr/bin/env node
// Duotone photo pipeline for the throwable photo pile (Part C2). Every source photo in
// public/photos/nights/ gets graded onto the brand ramp - shadows into --ink, mids into --coral,
// highlights into --magenta - and re-exported at two responsive widths as WebP under
// public/photos/nights/graded/. This is what turns inconsistent real phone photos into something
// that reads as art-directed and on-brand; skipping it is explicitly called out as not allowed.
// Runs in `prebuild` so every real deploy always has fresh graded output for whatever photos are
// currently committed - nothing to run by hand.
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.join(import.meta.dirname, '..')
const SOURCE_DIR = path.join(ROOT, 'public', 'photos', 'nights')
const OUTPUT_DIR = path.join(SOURCE_DIR, 'graded')
const WIDTHS = [400, 800]
const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp'])

const INK = [0x12, 0x03, 0x0a]
const CORAL = [0xdb, 0x33, 0x4c]
const MAGENTA = [0xdc, 0x48, 0xfe]

function lerp(a, b, t) {
  return [Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), Math.round(a[2] + (b[2] - a[2]) * t)]
}

// 256-entry lookup table: luminance 0 -> ink, 127 -> coral, 255 -> magenta, linearly
// interpolated between each pair. Built once and reused across every image/width.
function buildDuotoneLut() {
  const lut = new Uint8Array(256 * 3)
  for (let i = 0; i < 256; i++) {
    const [r, g, b] = i < 128 ? lerp(INK, CORAL, i / 127) : lerp(CORAL, MAGENTA, (i - 128) / 127)
    lut[i * 3] = r
    lut[i * 3 + 1] = g
    lut[i * 3 + 2] = b
  }
  return lut
}

const LUT = buildDuotoneLut()

async function gradeToWidth(sourcePath, width) {
  const { data, info } = await sharp(sourcePath)
    .rotate() // respect EXIF orientation before any pixel math
    .resize({ width, withoutEnlargement: true })
    .normalize() // stretch each photo's own contrast range first - phone shots come in at wildly
    // different exposures, and normalizing before the duotone map is what makes them read as one
    // consistent, authored set instead of a random dump of snapshots
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const pixels = info.width * info.height
  const out = Buffer.alloc(pixels * 3)
  for (let p = 0; p < pixels; p++) {
    const lum = data[p]
    const lutIndex = lum * 3
    out[p * 3] = LUT[lutIndex]
    out[p * 3 + 1] = LUT[lutIndex + 1]
    out[p * 3 + 2] = LUT[lutIndex + 2]
  }

  return sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } })
    .webp({ quality: 72 })
    .toBuffer()
}

async function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.log(`[media] ${path.relative(ROOT, SOURCE_DIR)}/ does not exist yet - nothing to grade. Skipping.`)
    return
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  const sourceFiles = fs
    .readdirSync(SOURCE_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort()

  if (!sourceFiles.length) {
    console.log(`[media] No source photos found in ${path.relative(ROOT, SOURCE_DIR)}/. Drop real photos there and re-run - nothing graded this pass.`)
    return
  }

  const manifest = []
  for (const file of sourceFiles) {
    const base = path.parse(file).name
    const sourcePath = path.join(SOURCE_DIR, file)
    const entry = { id: base, widths: {} }

    for (const width of WIDTHS) {
      const outBuffer = await gradeToWidth(sourcePath, width)
      const outName = `${base}-${width}.webp`
      fs.writeFileSync(path.join(OUTPUT_DIR, outName), outBuffer)
      entry.widths[width] = `/photos/nights/graded/${outName}`
      console.log(`[media] ${file} -> ${outName} (${(outBuffer.length / 1024).toFixed(1)}KB)`)
    }
    manifest.push(entry)
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2))
  console.log(`[media] Graded ${manifest.length} photo(s). Manifest written to ${path.relative(ROOT, path.join(OUTPUT_DIR, 'manifest.json'))}.`)
}

main().catch((err) => {
  console.error('[media] Failed:', err)
  process.exit(1)
})
