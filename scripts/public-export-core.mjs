import { z } from 'zod'
import { projectSchema } from '../src/data/schema.ts'

export const publicSourceSchema = z.object({
  publish: z.literal(true),
  project: projectSchema.omit({ status: true, progress: true, updatedAt: true, github: true, phases: true, signals: true, history: true, measurement: true }),
  measure: z.object({
    mode: z.enum(['tasks', 'milestones']),
    groups: z.array(z.object({ label: z.string(), keys: z.array(z.string().regex(/^(WP-\d+(?:\.\d+)?|M\d+)$/)).min(1) }).strict()).min(3),
  }).strict(),
}).strict()

export function assertSafePublic(value) {
  const text = JSON.stringify(value)
  if (/["\s][A-Za-z]:(?:\\\\|\/)|(?:\/Users\/|\/home\/)|gh[opsu]_[A-Za-z0-9_]{20,}|-----BEGIN .*PRIVATE KEY-----/.test(text)) {
    throw new Error('В публичных данных обнаружены запрещённые сведения')
  }
}

export function readPlanStates(plan, mode) {
  const states = new Map()
  const matches = mode === 'tasks'
    ? plan.matchAll(/^\s*- \[([ xX])\] \*\*(WP-\d+(?:\.\d+)?)\*\*/gm)
    : plan.matchAll(/^\|\s*(M\d+)\s*\|[^|]*\|\s*([^|]+)\|/gm)
  for (const match of matches) {
    const id = mode === 'tasks' ? match[2] : match[1]
    const raw = mode === 'tasks' ? match[1].trim().toLowerCase() : match[2].trim()
    const state = (raw === 'x' || raw === 'done') ? 'complete' : raw === 'in-progress' ? 'current' : 'next'
    if (states.has(id) && states.get(id) !== state) throw new Error(`Противоречивый статус ${id}; выгрузка остановлена`)
    states.set(id, state)
  }
  return states
}

export function buildPublicProject(source, plan, status, previousHistory, now) {
  const approved = publicSourceSchema.parse(source)
  assertSafePublic(approved)
  const states = readPlanStates(plan, approved.measure.mode)
  const allKeys = approved.measure.groups.flatMap(group => group.keys)
  if (new Set(allKeys).size !== allKeys.length) throw new Error('Задача не должна учитываться дважды')
  for (const key of allKeys) if (!states.has(key)) throw new Error(`В плане не найден ${key}; выгрузка остановлена`)
  const total = allKeys.length
  const completed = allKeys.filter(key => states.get(key) === 'complete').length
  const progress = Math.round(completed / total * 100)
  const day = now.slice(0, 10)
  const unit = approved.measure.mode === 'tasks' ? 'задач' : 'этапов'
  const groups = approved.measure.groups.map(group => {
    const done = group.keys.filter(key => states.get(key) === 'complete').length
    return { ...group, done, value: Math.round(done / group.keys.length * 100) }
  })
  const history = [...previousHistory.filter(point => point.date && point.date < day), { date: day, label: day, value: progress }]
  return projectSchema.parse({
    ...approved.project,
    status,
    health: status === 'completed' ? 'complete' : approved.project.health === 'complete' ? 'on-track' : approved.project.health,
    progress,
    updatedAt: day,
    measurement: { completed, total, unit, checkedAt: now, method: `Доля завершённых ${unit} выбранного плана. У каждого пункта одинаковый вес. Работа в процессе не считается завершённой. Это не процент физической готовности объекта.` },
    metrics: [
      { label: 'Завершено', value: String(completed), detail: `из ${total} ${unit} выбранного плана` },
      { label: 'Направления', value: String(groups.length), detail: 'группы работ в публичном представлении' },
      ...approved.project.metrics.slice(0, 2),
    ],
    phases: groups.map(group => ({ label: group.label, status: group.done === group.keys.length ? 'complete' : group.done > 0 || group.keys.some(key => states.get(key) === 'current') ? 'current' : 'next', note: `Завершено ${group.done} из ${group.keys.length}.` })),
    signals: groups.map(group => ({ label: group.label, value: group.value })),
    history,
  })
}
