// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { Hint } from './Hint'

afterEach(cleanup)
describe('пояснения', () => {
  it('открываются с клавиатуры и закрываются клавишей Escape', () => {
    render(<Hint label="Показатель">Понятное пояснение.</Hint>)
    fireEvent.focus(screen.getByRole('button'))
    expect(screen.getByRole('tooltip').textContent).toBe('Понятное пояснение.')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('tooltip')).toBeNull()
  })
  it('открываются касанием и закрываются повторным нажатием', () => {
    render(<Hint label="Показатель">Понятное пояснение.</Hint>)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(button.getAttribute('aria-expanded')).toBe('true')
    fireEvent.click(button)
    expect(screen.queryByRole('tooltip')).toBeNull()
  })
  it('закрываются нажатием за пределами подсказки', () => {
    render(<Hint label="Показатель">Понятное пояснение.</Hint>)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.pointerDown(document.body)
    expect(screen.queryByRole('tooltip')).toBeNull()
  })
})
