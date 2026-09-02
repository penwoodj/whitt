import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { DagFormatControl } from './DagFormatControl'

const renderControl = (selectedNodeIds: readonly string[] = [], onFormat = vi.fn()) =>
  render(
    <ThemeProvider>
      <DagFormatControl selectedNodeIds={selectedNodeIds} onFormat={onFormat} />
    </ThemeProvider>,
  )

describe('DagFormatControl', () => {
  it('DAGX-01 shows right state after selected format', () => {
    const onFormat = vi.fn()
    renderControl(['A'], onFormat)

    fireEvent.click(screen.getByRole('button', { name: /format selected nodes right/i }))

    expect(onFormat).toHaveBeenCalledWith('RIGHT')
    expect(screen.getByText('Right')).toBeInTheDocument()
  })

  it('DAGX-02 and DAGX-03 cycle down then left with distinct labels', () => {
    const onFormat = vi.fn()
    renderControl(['A'], onFormat)
    const control = screen.getByRole('button', { name: /format selected nodes right/i })

    fireEvent.click(control)
    expect(screen.getByRole('button', { name: /format selected nodes down/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /format selected nodes down/i }))
    expect(screen.getByRole('button', { name: /format selected nodes left/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /format selected nodes left/i }))
    expect(screen.getByRole('button', { name: /format selected nodes right/i })).toBeInTheDocument()
    expect(onFormat.mock.calls.map(([direction]) => direction)).toEqual(['RIGHT', 'DOWN', 'LEFT'])
  })

  it('DAGX-04 disables command and callback with no selection', () => {
    const onFormat = vi.fn()
    renderControl([], onFormat)
    const control = screen.getByRole('button', { name: /format selected nodes right/i })

    expect(control).toBeDisabled()
    fireEvent.click(control)
    expect(onFormat).not.toHaveBeenCalled()
    expect(screen.getByText('No selection')).toBeInTheDocument()
  })

  it('keeps right segment readout noninteractive', () => {
    renderControl(['A'])

    expect(screen.getByText('Layout')).toBeInTheDocument()
    expect(screen.getByText('None')).toBeInTheDocument()
    expect(screen.getByText('Layout').closest('button')).toBeNull()
  })
})
