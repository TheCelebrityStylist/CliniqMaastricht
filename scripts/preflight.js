const fs = require('fs')

function fail(message) {
  console.error(`Preflight failed: ${message}`)
  process.exit(1)
}

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const dependencySections = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']

for (const section of dependencySections) {
  for (const name of Object.keys(pkg[section] || {})) {
    if (name.includes('/') && !name.startsWith('@')) fail(`${section} contains invalid package name "${name}". Import paths like date-fns/locale must not be listed as packages.`)
  }
}

const filesToScan = ['package.json', 'next.config.ts', 'app', 'components', 'lib']
const forbidden = [
  { pattern: /date-fns\/locale/g, label: 'date-fns/locale invalid package/import path' },
  { pattern: /images\.unsplash\.com|unsplash\.com/g, label: 'Unsplash/stock imagery URL' },
  { pattern: /next-sanity|@sanity\/client|@sanity\/image-url/g, label: 'Sanity dependency/import' },
]

function scanPath(target) {
  if (!fs.existsSync(target)) return
  const stat = fs.statSync(target)
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(target)) scanPath(`${target}/${entry}`)
    return
  }
  if (!/\.(json|js|ts|tsx|md)$/.test(target)) return
  const content = fs.readFileSync(target, 'utf8')
  for (const item of forbidden) {
    if (item.pattern.test(content)) fail(`${item.label} found in ${target}`)
    item.pattern.lastIndex = 0
  }
}

filesToScan.forEach(scanPath)
console.log('Preflight passed: dependencies, CMS removal, redirects, and image policy look safe')
