import { readFile, readdir, stat } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const execFileAsync = promisify(execFile)
const targets = ['src/data', 'dist', 'README.md']
const forbidden = [
  { name: 'Windows user path', pattern: /[A-Z]:\\(?:Users|Евгений)\\/i },
  { name: 'GitHub token', pattern: /gh[opsu]_[A-Za-z0-9_]{20,}/ },
  { name: 'Private key', pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
]

async function filesAt(target) {
  const absolute = path.join(root, target)
  try {
    const info = await stat(absolute)
    if (info.isFile()) return [absolute]
    const entries = await readdir(absolute, { withFileTypes: true })
    const nested = await Promise.all(entries.map((entry) => filesAt(path.relative(root, path.join(absolute, entry.name)))))
    return nested.flat()
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

let files
try {
  const { stdout } = await execFileAsync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8' })
  files = stdout.split('\0').filter(Boolean).map((file) => path.join(root, file))
} catch {
  files = (await Promise.all(targets.map(filesAt))).flat()
}
files = [...new Set([...files, ...await filesAt('dist')])]
for (const file of files) {
  if (/\.(png|woff2?|jpg|jpeg|gif)$/i.test(file)) continue
  const content = await readFile(file, 'utf8')
  for (const rule of forbidden) {
    if (rule.pattern.test(content)) throw new Error(`${rule.name} found in ${path.relative(root, file)}`)
  }
}
console.log(`[privacy] checked ${files.length} public files; no forbidden patterns found`)
