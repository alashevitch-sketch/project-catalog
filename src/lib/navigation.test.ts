import { describe, expect, it } from 'vitest'
import { overviewSections, projectSections, sectionSearch, selectedSection } from './navigation'

describe('навигация разделов', () => {
  it('сохраняет фильтр и остальные параметры', () => {
    const params = new URLSearchParams(sectionSearch('?status=active&capture=1', 'projects'))
    expect(params.get('status')).toBe('active')
    expect(params.get('capture')).toBe('1')
    expect(params.get('section')).toBe('projects')
  })
  it('при неизвестном разделе возвращается к началу страницы', () => {
    expect(selectedSection('?section=missing', overviewSections)).toBe('top')
    expect(selectedSection('?section=projects', projectSections)).toBe('overview')
  })
  it('открывает раздел страницы проекта по прямой ссылке', () => {
    expect(selectedSection('?section=cover', projectSections)).toBe('cover')
  })
})
