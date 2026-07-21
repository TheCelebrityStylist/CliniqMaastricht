import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..', '..')
export const BASELINE_DIR = path.join(import.meta.dirname, 'baseline')
export const ROUTES_BASELINE = path.join(BASELINE_DIR, 'routes.json')
export const COPY_BASELINE_DIR = path.join(BASELINE_DIR, 'copy')

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'", nbsp: ' ' }

// Strips a rendered HTML document down to the text a reader (or crawler) would actually see:
// drops <script>/<style>/<template>/SVG icon markup, strips remaining tags, decodes entities,
// collapses whitespace. Good enough to diff for accidental copy edits — not a full DOM parser.
export function extractVisibleText(html) {
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<template[\s\S]*?<\/template>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<\/(p|div|section|article|li|h[1-6]|br)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#39|apos|amp|lt|gt|quot|nbsp);/g, (_, code) => ENTITIES[code] ?? ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))

  return text
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n')
}

export function extractJsonLdTypes(html) {
  const types = []
  const blocks = html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)
  for (const [, raw] of blocks) {
    try {
      const data = JSON.parse(raw)
      const collect = (node) => {
        if (Array.isArray(node)) return node.forEach(collect)
        if (node && typeof node === 'object') {
          // @type can be a single string or an array (e.g. ['NightClub', 'EventVenue', 'LocalBusiness']) — flatten both.
          if (Array.isArray(node['@type'])) types.push(...node['@type'])
          else if (node['@type']) types.push(node['@type'])
          if (node['@graph']) collect(node['@graph'])
        }
      }
      collect(data)
    } catch {
      types.push('INVALID_JSON_LD')
    }
  }
  return types.sort()
}

export function readRouteManifest() {
  const manifestPath = path.join(ROOT, '.next', 'app-path-routes-manifest.json')
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  return Object.keys(manifest).sort()
}

// Some sandboxed dev environments proxy-throttle repeated requests to a blocked external host
// (here, the Sanity API, which this environment has no egress to) instead of failing them fast —
// harmless for a single page load, but it can make dozens of pages each doing several Sanity
// calls very slow to build/serve. lib/admin/public.ts already falls back gracefully to local
// defaults on any fetch failure, so pointing at a harness-only dummy project ID exercises that
// exact same fallback path without waiting on a throttled proxy. This only affects the child
// processes this script spawns — never the app's real runtime config.
const HARNESS_ENV = {
  ...process.env,
  NEXT_PUBLIC_SANITY_PROJECT_ID: 'constraint-check-disabled',
}

export async function runBuild() {
  await run('npx', ['next', 'build'], { cwd: ROOT, env: HARNESS_ENV })
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', ...opts })
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited ${code}`))))
  })
}

// A fixed port can appear "busy" from a previous run in some sandboxed environments even when no
// process still owns it (observed: OS-level bind() refuses the port while `ss`/`ps` show nothing
// holding it). Randomizing the port every run sidesteps this entirely instead of chasing it.
export function randomPort() {
  return 20000 + Math.floor(Math.random() * 20000)
}

export async function withServer(port, fn) {
  const server = spawn('npx', ['next', 'start', '-p', String(port)], { cwd: ROOT, stdio: 'pipe', env: HARNESS_ENV })
  const ready = new Promise((resolve, reject) => {
    let out = ''
    const onData = (chunk) => {
      out += chunk.toString()
      if (out.includes('Ready in') || /- Local:/.test(out)) resolve()
    }
    server.stdout.on('data', onData)
    server.stderr.on('data', onData)
    server.on('exit', (code) => reject(new Error(`next start exited early (${code}). Output:\n${out}`)))
  })

  try {
    await Promise.race([ready, delay(20000).then(() => Promise.reject(new Error('next start did not report ready within 20s')))])
    // 127.0.0.1, not "localhost" — Node's fetch can hang for a long time per-request resolving
    // localhost to ::1 first when the server only accepts IPv4, silently multiplying across every
    // page in WATCHED_PAGES.
    return await fn(`http://127.0.0.1:${port}`)
  } finally {
    server.kill('SIGTERM')
    await delay(300)
  }
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

// Defense-in-depth against any future hang (e.g. DNS/IPv6 weirdness): every page fetch in this
// harness fails loudly after 10s instead of hanging the whole run indefinitely.
export function fetchWithTimeout(url, timeoutMs = 10000) {
  return fetch(url, { signal: AbortSignal.timeout(timeoutMs) })
}
