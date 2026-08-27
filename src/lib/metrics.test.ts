import { describe, expect, it } from 'vitest'
import { projects } from '../data/projects'
import { formatCompactNumber, formatProjectDate, getPortfolioHistory, getPortfolioMetrics } from './metrics'

describe('показатели', () => {
  it('считает показатели независимо от текущего публичного набора', () => {
    const base = projects[0]
    expect(getPortfolioMetrics([
      { ...base, progress: 25, status: 'active', health: 'attention' },
      { ...base, progress: 100, status: 'completed', health: 'complete' },
      { ...base, progress: 50, status: 'paused', health: 'on-track' },
    ])).toEqual({ total: 3, active: 1, completed: 1, onTrack: 2, averageProgress: 58 })
  })
  it('поддерживает пустой набор', () => {
    expect(getPortfolioMetrics([])).toEqual({ total: 0, active: 0, completed: 0, onTrack: 0, averageProgress: 0 })
    expect(getPortfolioHistory([])).toEqual([])
  })
  it('использует русское оформление чисел и дат', () => {
    expect(formatCompactNumber(1250)).toBe('1,3 тыс.')
    expect(formatProjectDate('2026-08-26T12:00:00Z')).toContain('26 авг.')
  })
  it('не выдумывает историю между датами', () => {
    const measured = projects.map(project => ({ ...project, history: [{ date: '2026-08-27', label: '2026-08-27', value: 50 }] }))
    expect(getPortfolioHistory(measured)).toHaveLength(1)
    expect(getPortfolioHistory(measured)[0].value).toBe(50)
  })
  it('все четыре проекта имеют измерения и русский текст', () => {
    expect(projects.map(project => project.id)).toEqual(['PRJ-001', 'PRJ-002', 'PRJ-003', 'PRJ-004'])
    for (const project of projects) {
      expect(project.measurement?.total).toBeGreaterThan(0)
      expect(project.history.every(point => point.date)).toBe(true)
      const copy = [project.title, project.category, project.summary, project.nextAction, ...project.stack, ...project.highlights, ...project.metrics.flatMap(metric => [metric.label, metric.value, metric.detail])]
      expect(copy.join(' ')).not.toMatch(/[a-z]/i)
    }
  })
})
