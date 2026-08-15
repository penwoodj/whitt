import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ThemeProvider } from '../../shared/ThemeProvider'
import { darkTheme } from '../../shared/theme'
import NodeStatus from '../node/NodeStatus'
import type { NodeStatus as NodeStatusType } from '../node/nodeTypes'

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={darkTheme}>{ui}</ThemeProvider>)

describe('Light language state→glow mapping (LGT-01)', () => {
  it('theme has stateGlow mapping table', () => {
    expect(darkTheme.glow.stateGlow).toBeDefined()

    expect(darkTheme.glow.stateGlow.idle).toBe('0 0 8px rgba(106, 153, 85, 0.2)')
    expect(darkTheme.glow.stateGlow.recording).toBe('0 0 24px rgba(244, 71, 71, 0.8)')
    expect(darkTheme.glow.stateGlow.running).toBe('0 0 12px rgba(0, 122, 204, 0.4)')
    expect(darkTheme.glow.stateGlow.done).toBe('0 0 12px rgba(78, 201, 176, 0.4)')
  })

  it('NodeStatus uses stateGlow table values (no ad-hoc glow)', () => {
    const states: Array<NodeStatusType> = ['idle', 'recording', 'running', 'done']

    states.forEach((status) => {
      const { container } = renderWithTheme(<NodeStatus status={status} />)
      const statusEl = container.querySelector('div')

      const glow = window.getComputedStyle(statusEl!).boxShadow
      const expectedGlow = darkTheme.glow.stateGlow[status]

      expect(glow).toBe(expectedGlow)
    })
  })

  it('NodeStatus uses stateGlow table for idle state', () => {
    const { container } = renderWithTheme(<NodeStatus status="idle" />)
    const statusEl = container.querySelector('div')

    const glow = window.getComputedStyle(statusEl!).boxShadow

    expect(glow).toBe(darkTheme.glow.stateGlow.idle)
  })

  it('NodeStatus uses stateGlow table for recording state', () => {
    const { container } = renderWithTheme(<NodeStatus status="recording" />)
    const statusEl = container.querySelector('div')

    const glow = window.getComputedStyle(statusEl!).boxShadow

    expect(glow).toBe(darkTheme.glow.stateGlow.recording)
  })

  it('NodeStatus uses stateGlow table for running state', () => {
    const { container } = renderWithTheme(<NodeStatus status="running" />)
    const statusEl = container.querySelector('div')

    const glow = window.getComputedStyle(statusEl!).boxShadow

    expect(glow).toBe(darkTheme.glow.stateGlow.running)
  })

  it('NodeStatus uses stateGlow table for done state', () => {
    const { container } = renderWithTheme(<NodeStatus status="done" />)
    const statusEl = container.querySelector('div')

    const glow = window.getComputedStyle(statusEl!).boxShadow

    expect(glow).toBe(darkTheme.glow.stateGlow.done)
  })

  it('NodeStatus has NO ad-hoc color hex values', () => {
    const { container } = renderWithTheme(<NodeStatus status="idle" />)
    const statusEl = container.querySelector('div')

    const style = window.getComputedStyle(statusEl!)
    const backgroundColor = style.backgroundColor
    const boxShadow = style.boxShadow

    const hasHex = /#[0-9A-Fa-f]{6}/.test(backgroundColor + boxShadow)

    expect(hasHex).toBe(false)
  })
})
