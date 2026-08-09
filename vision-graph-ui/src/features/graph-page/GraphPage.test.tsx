import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import GraphPage from './GraphPage'
import { ThemeProvider } from '../../shared/ThemeProvider'

const renderWithTheme = (ui: ReactNode) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('GraphPage', () => {
  it('renders single Node in canvas', () => {
    renderWithTheme(<GraphPage />)
    const matches = screen.getAllByText('Start Node')
    expect(matches.length).toBeGreaterThan(0)
  })

  it('accepts custom title', () => {
    renderWithTheme(<GraphPage title="Custom Title" />)
    const matches = screen.getAllByText('Custom Title')
    expect(matches.length).toBeGreaterThan(0)
  })
})
