import { describe, expect, it } from 'vitest'
import { projects } from '../data/projects'
import { getPortfolioMetrics } from './metrics'

describe('getPortfolioMetrics', () => {
  it('aggregates the published project snapshot', () => {
    expect(getPortfolioMetrics(projects)).toEqual({
      total: 3,
      active: 1,
      completed: 2,
      onTrack: 2,
      averageProgress: 82,
    })
  })

  it('returns zeroes for an empty portfolio', () => {
    expect(getPortfolioMetrics([])).toEqual({
      total: 0,
      active: 0,
      completed: 0,
      onTrack: 0,
      averageProgress: 0,
    })
  })
})
