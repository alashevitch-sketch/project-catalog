// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { ProjectCover } from './ProjectCover'
import { projects } from '../data/projects'

afterEach(cleanup)
describe('векторные обложки', () => {
  it('показывают разные схемы четырёх проектов', () => {
    render(<>{projects.map(project => <ProjectCover key={project.id} project={project} />)}</>)
    expect(screen.getAllByRole('img')).toHaveLength(4)
    expect(screen.getByText('Архитектура пространства')).toBeTruthy()
    expect(screen.getByText('Карта проектной памяти')).toBeTruthy()
    expect(screen.getByText('Устройство каталога')).toBeTruthy()
    expect(screen.getByText('Пространство для событий')).toBeTruthy()
    expect(screen.getAllByText('Не рабочий чертёж')).toHaveLength(2)
  })
  it('не повторяют идентификаторы при одновременном показе', () => {
    const { container } = render(<><ProjectCover project={projects[0]} /><ProjectCover project={projects[0]} large /></>)
    const ids = Array.from(container.querySelectorAll('[id]')).map(element => element.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const svg of screen.getAllByRole('img')) {
      for (const id of svg.getAttribute('aria-labelledby')!.split(' ')) expect(document.getElementById(id)).not.toBeNull()
    }
  })
  it('имеют безопасную схему для нового проекта', () => {
    render(<ProjectCover project={{ ...projects[0], id: 'PRJ-999' }} />)
    expect(screen.getByText('Схема проекта')).toBeTruthy()
    expect(screen.getAllByRole('img')).toHaveLength(1)
  })
})
