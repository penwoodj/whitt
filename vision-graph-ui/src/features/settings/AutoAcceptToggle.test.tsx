import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AutoAcceptToggle } from './AutoAcceptToggle'

describe('AutoAcceptToggle', () => {
  it('shows on by default', () => {
    const onChange = vi.fn()
    render(<AutoAcceptToggle isAuto={true} onChange={onChange} />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('shows off after click', () => {
    const onChange = vi.fn()
    render(<AutoAcceptToggle isAuto={true} onChange={onChange} />)
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('calls onChange w/ false when toggled off', () => {
    const onChange = vi.fn()
    render(<AutoAcceptToggle isAuto={true} onChange={onChange} />)
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(false)
  })
})
