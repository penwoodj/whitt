import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ModelEndpointInput } from './ModelEndpointInput'
import { ThemeProvider } from '../../shared/ThemeProvider'

const renderWithTheme = (ui: React.ReactElement) => render(<ThemeProvider>{ui}</ThemeProvider>)

describe('ModelEndpointInput', () => {
  it('renders w/ default "http://localhost:8080"', () => {
    const onChange = vi.fn()
    renderWithTheme(<ModelEndpointInput eptTxt="http://localhost:8080" onChange={onChange} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('http://localhost:8080')
  })

  it('shows red border on invalid endpoint', () => {
    const onChange = vi.fn()
    renderWithTheme(<ModelEndpointInput eptTxt="ftp://bad" onChange={onChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.blur(input)
    const styles = window.getComputedStyle(input)
    expect(styles.borderColor).toContain('239')
  })
})
