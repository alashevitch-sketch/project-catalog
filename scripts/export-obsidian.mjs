import { readFile, writeFile, rename, realpath } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { projectSnapshotSchema } from '../src/data/schema.ts'
import { assertSafePublic, buildPublicProject } from './public-export-core.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const vaultArgument = process.argv[process.argv.indexOf('--vault') + 1]
const vault = process.argv.includes('--vault') ? vaultArgument : process.env.CODEX_VAULT_PATH
if (!vault) throw new Error('Укажите --vault с расположением хранилища Obsidian. Путь не сохраняется в публичных файлах.')
const vaultRoot = await realpath(vault)
const allowed = ['PRJ-001', 'PRJ-002', 'PRJ-003', 'PRJ-004']
const registry = await readFile(path.join(vaultRoot, '00_System', 'Project-Registry.md'), 'utf8')
const manifestFile = path.join(root, 'src/data/project-manifest.json')
const previous = projectSnapshotSchema.parse(JSON.parse(await readFile(manifestFile, 'utf8')))
const now = new Date().toISOString()
const projects = []
for (const id of allowed) {
  const rows = registry.split(/\r?\n/).filter(line => line.startsWith(`| ${id} |`))
  if (rows.length !== 1) throw new Error(`Неоднозначная запись ${id} в реестре`)
  const relative = rows[0].match(/\[\[(10_Projects\/[^|\]]+)\|Hub\]\]/)?.[1]
  if (!relative) throw new Error(`Нет ссылки на проект ${id}`)
  const folder = await realpath(path.join(vaultRoot, path.dirname(relative)))
  if (path.relative(vaultRoot, folder).startsWith('..') || path.isAbsolute(path.relative(vaultRoot, folder))) throw new Error('Источник вне хранилища')
  const safeRead = async (file) => {
    const resolved = await realpath(path.join(folder, file))
    const relativeFile = path.relative(folder, resolved)
    if (relativeFile.startsWith('..') || path.isAbsolute(relativeFile)) throw new Error('Недопустимая ссылка источника')
    return readFile(resolved, 'utf8')
  }
  const [sourceText, plan, hub] = await Promise.all([safeRead('09_Public/catalog.json'), safeRead('02_Project-Plan.md'), safeRead('00_Project-Hub.md')])
  const source = JSON.parse(sourceText)
  if (source.project?.id !== id) throw new Error(`Несовпадение проекта ${id}`)
  const status = hub.match(/^status:\s*["']?(active|completed|planned|paused)["']?\s*$/m)?.[1]
  if (!status) throw new Error(`Неизвестное состояние проекта ${id}`)
  projects.push(buildPublicProject(source, plan, status, previous.projects.find(project => project.id === id)?.history ?? [], now))
}
const snapshot = projectSnapshotSchema.parse({ syncedAt: now, source: 'approved-obsidian-export', projects })
assertSafePublic(snapshot)
const temp = `${manifestFile}.tmp`
await writeFile(temp, `${JSON.stringify(snapshot, null, 2)}\n`)
await rename(temp, manifestFile)
console.log(`[export] Проверено и выгружено проектов: ${projects.length}. Внутренние заметки не публиковались.`)
