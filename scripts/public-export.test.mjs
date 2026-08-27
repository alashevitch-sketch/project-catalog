import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { assertSafePublic, buildPublicProject, readPlanStates } from './public-export-core.mjs'

const base = JSON.parse(readFileSync(new URL('../src/data/project-manifest.json', import.meta.url))).projects[0]
const omitted = ['status', 'progress', 'updatedAt', 'github', 'phases', 'signals', 'history', 'measurement']
const source = () => ({ publish: true, project: Object.fromEntries(Object.entries(base).filter(([key]) => !omitted.includes(key))), measure: { mode: 'tasks', groups: [1, 2, 3].map(number => ({ label: `Этап ${number}`, keys: [`WP-0${number}`] })) } })
const plan = '- [x] **WP-01** Готово\n- [ ] **WP-02** Ожидает\n- [ ] **WP-03** Ожидает\n- [x] **WP-01** Повтор в фокусе'

describe('безопасная выгрузка', () => {
  it('считает уникальные пункты и начинает реальную историю', () => {
    const project = buildPublicProject(source(), plan, 'active', [], '2026-08-27T12:00:00.000Z')
    expect(project.progress).toBe(33)
    expect(project.measurement.total).toBe(3)
    expect(project.history).toEqual([{ date: '2026-08-27', label: '2026-08-27', value: 33 }])
  })
  it('сохраняет прошлое и заменяет измерение текущего дня', () => {
    const project = buildPublicProject(source(), plan, 'active', [{ date: '2026-08-26', label: '26', value: 0 }, { date: '2026-08-27', label: '27', value: 10 }], '2026-08-27T13:00:00.000Z')
    expect(project.history.map(point => point.value)).toEqual([0, 33])
  })
  it('не переносит выдуманные значения без даты', () => {
    expect(buildPublicProject(source(), plan, 'active', [{ label: 'Старт', value: 8 }], '2026-08-27T12:00:00.000Z').history).toHaveLength(1)
  })
  it('останавливается на пропавших и противоречивых задачах', () => {
    expect(() => buildPublicProject(source(), '', 'active', [], '2026-08-27T12:00:00.000Z')).toThrow('не найден')
    expect(() => readPlanStates(plan + '\n- [ ] **WP-01** Противоречие', 'tasks')).toThrow('Противоречивый')
  })
  it('не допускает повторного учёта и неизвестных полей', () => {
    const duplicate = source(); duplicate.measure.groups[1].keys = ['WP-01']
    expect(() => buildPublicProject(duplicate, plan, 'active', [], '2026-08-27T12:00:00.000Z')).toThrow('дважды')
    const extra = source(); extra.project.privateNotes = 'Не публиковать'
    expect(() => buildPublicProject(extra, plan, 'active', [], '2026-08-27T12:00:00.000Z')).toThrow()
  })
  it('разрешает публичные ссылки, запрещает расположение личных файлов', () => {
    expect(() => assertSafePublic({ url: 'https://github.com/example/project' })).not.toThrow()
    expect(() => assertSafePublic({ path: ['C:', 'Users', 'example'].join(String.fromCharCode(92)) })).toThrow()
    expect(() => assertSafePublic({ path: '/home/example/private' })).toThrow()
  })
  it('читает контрольные точки без текста внутренних примечаний', () => {
    expect([...readPlanStates('| M0 | Описание | in-progress | Личное |\n| M1 | Описание | done | Личное |', 'milestones')]).toEqual([['M0', 'current'], ['M1', 'complete']])
  })
})
