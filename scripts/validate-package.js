const fs = require('fs')

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const sections = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']
const invalid = []

for (const section of sections) {
  for (const name of Object.keys(pkg[section] || {})) {
    if (name.includes('/') && !name.startsWith('@')) invalid.push(`${section}: ${name}`)
    if (name === 'date-fns/locale') invalid.push(`${section}: ${name} is an import path, not an npm package`)
  }
}

if (invalid.length) {
  console.error('Invalid npm package names found:')
  console.error(invalid.join('\n'))
  process.exit(1)
}

console.log('package.json dependency names are valid')
