// @vitest-environment jsdom
import { StrictMode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { SiteHeader } from './SiteHeader'

vi.mock('./animation-context', () => ({ useAnimation: () => ({ animated: false, systemReduced: false, toggle: vi.fn() }) }))
function TestPage() {
  const location = useLocation()
  return <><SiteHeader /><output data-testid="location">{location.pathname}{location.search}</output><main>{['top', 'analytics', 'projects', 'about', 'overview', 'cover', 'indicators', 'stages'].map(id => <section key={id} id={id} tabIndex={-1}>{id}</section>)}</main></>
}
beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => setTimeout(() => callback(0), 0))
  vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id))
  HTMLElement.prototype.scrollIntoView = vi.fn()
  window.scrollTo = vi.fn()
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })
describe('меню разделов', () => {
  it('открывается и закрывается по Escape с возвратом фокуса', () => {
    render(<MemoryRouter><TestPage /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: 'Открыть меню' }))
    expect(screen.getByRole('navigation', { name: 'Мобильная навигация' })).toBeTruthy()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('navigation', { name: 'Мобильная навигация' })).toBeNull()
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Открыть меню' }))
  })
  it('закрывается после перехода и не сбрасывает фильтр', async () => {
    render(<MemoryRouter initialEntries={['/?status=active']}><TestPage /></MemoryRouter>)
    fireEvent.click(screen.getByRole('button', { name: 'Открыть меню' }))
    fireEvent.click(within(screen.getByRole('navigation', { name: 'Мобильная навигация' })).getByRole('link', { name: 'Проекты' }))
    await waitFor(() => expect(screen.getByTestId('location').textContent).toBe('/?status=active&section=projects'))
    expect(screen.queryByRole('navigation', { name: 'Мобильная навигация' })).toBeNull()
    await waitFor(() => expect(document.activeElement?.id).toBe('projects'))
  })
  it('показывает разделы проекта и ссылку возврата', () => {
    render(<MemoryRouter initialEntries={['/project/cafe-masterskie']}><TestPage /></MemoryRouter>)
    const nav = screen.getByRole('navigation', { name: 'Разделы проекта' })
    expect(within(nav).getByRole('link', { name: 'Все проекты' }).getAttribute('href')).toBe('/?section=projects')
    expect(within(nav).getByRole('link', { name: 'Обложка' }).getAttribute('href')).toBe('/project/cafe-masterskie?section=cover')
  })
  it('не перехватывает фокус при первом открытии в строгом режиме', async () => {
    render(<StrictMode><MemoryRouter><TestPage /></MemoryRouter></StrictMode>)
    await new Promise(resolve => setTimeout(resolve, 20))
    expect(document.activeElement).toBe(document.body)
  })
  it('дожидается графиков перед переходом по прямой ссылке', async () => {
    render(<MemoryRouter initialEntries={['/?section=projects']}><SiteHeader /><main id="main-content"><div data-section-loading data-testid="loading">Загрузка…</div><section id="projects" tabIndex={-1}>Проекты</section></main></MemoryRouter>)
    await new Promise(resolve => setTimeout(resolve, 20))
    expect(HTMLElement.prototype.scrollIntoView).not.toHaveBeenCalled()
    screen.getByTestId('loading').remove()
    await waitFor(() => expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled())
  })
})
