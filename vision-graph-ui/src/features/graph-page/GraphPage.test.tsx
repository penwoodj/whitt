import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import GraphPage from './GraphPage'

describe('GraphPage', () => {
  it('renders single Node in canvas', () => {
    render(<GraphPage />)
    const matches = screen.getAllByText('Start Node')
    expect(matches.length).toBeGreaterThan(0)
  })

  it('accepts custom title', () => {
    render(<GraphPage title="Custom Title" />)
    const matches = screen.getAllByText('Custom Title')
    expect(matches.length).toBeGreaterThan(0)
  })
})
