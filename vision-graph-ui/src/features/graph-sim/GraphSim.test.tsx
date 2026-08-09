import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import GraphSim from './GraphSim'

const renderWithTheme = (ui: React.ReactElement) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('GraphSim', () => {
  it('renders Voice Node + idle status', () => {
    renderWithTheme(<GraphSim />)
    expect(screen.getByText('Voice Node')).toBeInTheDocument()
    expect(screen.getByText('Idle')).toBeInTheDocument()
  })

  it('renders mic btn + Details btn on mount', () => {
    renderWithTheme(<GraphSim />)
    expect(screen.getByTitle('Start recording')).toBeInTheDocument()
    expect(screen.getByText('Details')).toBeInTheDocument()
  })

  it('mic click toggles to Stop recording title', () => {
    renderWithTheme(<GraphSim />)
    const micBtn = screen.getByTitle('Start recording')
    fireEvent.click(micBtn)
    expect(screen.getByTitle('Stop recording')).toBeInTheDocument()
  })

  it('mic btn reverts to Start after second click', () => {
    renderWithTheme(<GraphSim />)
    const micBtn = screen.getByTitle('Start recording')
    fireEvent.click(micBtn)
    fireEvent.click(screen.getByTitle('Stop recording'))
    expect(screen.getByTitle('Start recording')).toBeInTheDocument()
  })

  it('Details btn exists throughout (markdown expands separately)', () => {
    renderWithTheme(<GraphSim />)
    expect(screen.getByText('Details')).toBeInTheDocument()
    fireEvent.click(screen.getByTitle('Start recording'))
    expect(screen.getByText('Details')).toBeInTheDocument()
    fireEvent.click(screen.getByTitle('Stop recording'))
    expect(screen.getByText('Details')).toBeInTheDocument()
  })
})
