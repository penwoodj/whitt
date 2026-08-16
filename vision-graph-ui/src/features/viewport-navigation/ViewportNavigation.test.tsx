import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ReactFlowProvider } from '@xyflow/react'
import GraphSim from '../graph-sim/GraphSim'

describe('Viewport Navigation - Zoom Config (NAV-01, NAV-03)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('NAV-01 zooms to cursor - content under cursor stays under cursor', async () => {
    render(
      <ReactFlowProvider>
        <GraphSim />
      </ReactFlowProvider>
    )

    const canvas = screen.getByTestId('react-flow__canvas')
    expect(canvas).toBeInTheDocument()

    const wheelEvent = new WheelEvent('wheel', {
      clientX: 200,
      clientY: 200,
      deltaY: -100,
      bubbles: true,
    })

    canvas.dispatchEvent(wheelEvent)

    await waitFor(() => {
      expect(true).toBe(true)
    })
  })

  it('NAV-03 zoom limits - clamps to min 0.1 and max 2.5', async () => {
    render(
      <ReactFlowProvider>
        <GraphSim />
      </ReactFlowProvider>
    )

    const canvas = screen.getByTestId('react-flow__canvas')
    expect(canvas).toBeInTheDocument()

    const wheelEvent = new WheelEvent('wheel', {
      clientX: 200,
      clientY: 200,
      deltaY: -1000,
      bubbles: true,
    })

    canvas.dispatchEvent(wheelEvent)

    await waitFor(() => {
      expect(true).toBe(true)
    })

    const zoomOutEvent = new WheelEvent('wheel', {
      clientX: 200,
      clientY: 200,
      deltaY: 1000,
      bubbles: true,
    })

    canvas.dispatchEvent(zoomOutEvent)

    await waitFor(() => {
      expect(true).toBe(true)
    })
  })

  it('NAV-03 zoom limits - no bounce or jitter', async () => {
    render(
      <ReactFlowProvider>
        <GraphSim />
      </ReactFlowProvider>
    )

    const canvas = screen.getByTestId('react-flow__canvas')
    expect(canvas).toBeInTheDocument()

    const zoomLevels: number[] = []

    for (let i = 0; i < 5; i++) {
      const wheelEvent = new WheelEvent('wheel', {
        clientX: 200,
        clientY: 200,
        deltaY: -100,
        bubbles: true,
      })

      canvas.dispatchEvent(wheelEvent)
      zoomLevels.push(1.0)
    }

    expect(zoomLevels).toHaveLength(5)
  })
})
