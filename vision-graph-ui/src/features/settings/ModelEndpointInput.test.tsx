import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ModelEndpointInput } from './ModelEndpointInput'

describe('ModelEndpointInput', () => {
  it('renders w/ default "http://localhost:8080"', () => {
    const onChange = vi.fn()
    render(<ModelEndpointInput eptTxt="http://localhost:8080" onChange={onChange} />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('http://localhost:8080')
  })

  it('shows red border on invalid endpoint', () => {
    const onChange = vi.fn()
    render(<ModelEndpointInput eptTxt="ftp://bad" onChange={onChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.blur(input)
    expect(input.style.border).toContain('red')
  })
})
