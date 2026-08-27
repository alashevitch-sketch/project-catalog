import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { projectSnapshotSchema } from '../src/data/schema.ts'
import { assertSafePublic } from './public-export-core.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifestPath = path.join(root, 'src', 'data', 'project-manifest.json')
const outputPath = path.join(root, 'src', 'data', 'generated-projects.json')
const manifest = projectSnapshotSchema.parse(JSON.parse(await readFile(manifestPath, 'utf8')))
const token = process.env.GITHUB_TOKEN
const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'evgeniy-project-system-build',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
}

async function github(pathname) {
  const response = await fetch(`https://api.github.com${pathname}`, { headers, signal: AbortSignal.timeout(15000) })
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
  return response.json()
}

function workflowStatus(run) {
  if (!run) return 'unknown'
  if (run.status !== 'completed') return 'pending'
  if (run.conclusion === 'success') return 'success'
  if (['failure', 'cancelled', 'timed_out'].includes(run.conclusion)) return 'failure'
  return 'unknown'
}

const enriched = await Promise.all(manifest.projects.map(async (project) => {
  if (!project.repository) return project
  const { owner, name } = project.repository
  try {
    const [repo, runs] = await Promise.all([
      github(`/repos/${owner}/${name}`),
      github(`/repos/${owner}/${name}/actions/runs?status=completed&per_page=1`),
    ])
    return {
      ...project,
      github: {
        stars: repo.stargazers_count ?? 0,
        forks: repo.forks_count ?? 0,
        openIssues: repo.open_issues_count ?? 0,
        pushedAt: repo.pushed_at ?? project.updatedAt,
        ciStatus: workflowStatus(runs.workflow_runs?.[0]),
      },
    }
  } catch (error) {
    console.warn(`[sync] ${owner}/${name}: ${error.message}; curated fallback retained`)
    return project
  }
}))

const snapshot = {
  syncedAt: new Date().toISOString(),
  source: token ? 'github-api+curated-manifest' : 'public-github-api+curated-manifest',
  projects: enriched,
}

projectSnapshotSchema.parse(snapshot)
assertSafePublic(snapshot)
const serialized = `${JSON.stringify(snapshot, null, 2)}\n`
if (/C:\\\\(?:Users|Евгений)\\\\/i.test(serialized) || /gh[opsu]_[A-Za-z0-9_]{20,}/.test(serialized)) {
  throw new Error('Public snapshot contains a forbidden local path or token pattern')
}
await writeFile(outputPath, serialized, 'utf8')
console.log(`[sync] wrote ${enriched.length} public projects to ${path.relative(root, outputPath)}`)
