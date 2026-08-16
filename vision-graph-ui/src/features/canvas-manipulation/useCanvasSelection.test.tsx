import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CanvasOps } from './CanvasOps'
import { ThemeProvider } from '../../shared/ThemeProvider'
import type { Node as FlowNode, Edge } from '@xyflow/react'

describe('Canvas Selection Model', () => {
  const mockNodes: FlowNode[] = [
    { id: 'node-a', position: { x: 100, y: 100 }, data: { title: 'Node A' } },
    { id: 'node-b', position: { x: 300, y: 100 }, data: { title: 'Node B' } },
    { id: 'node-c', position: { x: 500, y: 100 }, data: { title: 'Node C' } },
    { id: 'node-d', position: { x: 100, y: 300 }, data: { title: 'Node D' } },
    { id: 'node-e', position: { x: 300, y: 300 }, data: { title: 'Node E' } },
    { id: 'node-f', position: { x: 500, y: 300 }, data: { title: 'Node F' } },
  ]

  const mockEdges: Edge[] = []

  const renderCanvas = () => {
    return render(
      <ThemeProvider>
        <CanvasOps initialNodes={mockNodes} initialEdges={mockEdges} />
      </ThemeProvider>
    )
  }

  describe('GRP-01 multi-select', () => {
    it('selects 3 nodes with ctrl+click', async () => {
      const user = userEvent.setup()
      renderCanvas()

      const nodeA = screen.getByText('Node A')
      const nodeB = screen.getByText('Node B')
      const nodeC = screen.getByText('Node C')

      await user.click(nodeA)
      await user.keyboard('{Control>}')
      await user.click(nodeB)
      await user.click(nodeC)
      await user.keyboard('{/Control}')

      expect(nodeA).toHaveStyle({ background: '#e0f0ff' })
      expect(nodeB).toHaveStyle({ background: '#e0f0ff' })
      expect(nodeC).toHaveStyle({ background: '#e0f0ff' })
    })

    it('moves all selected nodes together when dragging one', async () => {
      const user = userEvent.setup()
      renderCanvas()

      const nodeA = screen.getByText('Node A')
      const nodeB = screen.getByText('Node B')
      const nodeC = screen.getByText('Node C')

      await user.click(nodeA)
      await user.keyboard('{Control>}')
      await user.click(nodeB)
      await user.click(nodeC)
      await user.keyboard('{/Control}')

      expect(nodeA).toHaveStyle({ background: '#e0f0ff' })
      expect(nodeB).toHaveStyle({ background: '#e0f0ff' })
      expect(nodeC).toHaveStyle({ background: '#e0f0ff' })
    })
  })

  describe('GRP-02 selection surround', () => {
    it('draws selection halo box around selected nodes', async () => {
      const user = userEvent.setup()
      renderCanvas()

      const nodeA = screen.getByText('Node A')
      const nodeB = screen.getByText('Node B')
      const nodeC = screen.getByText('Node C')

      await user.click(nodeA)
      await user.keyboard('{Control>}')
      await user.click(nodeB)
      await user.click(nodeC)
      await user.keyboard('{/Control}')

      const halo = screen.getByTestId('selection-halo')
      expect(halo).toBeInTheDocument()
      expect(halo).toHaveStyle({ border: '2px dashed #007bff' })
    })

    it('halo encloses bounds of all selected nodes', async () => {
      const user = userEvent.setup()
      renderCanvas()

      const nodeA = screen.getByText('Node A')
      const nodeB = screen.getByText('Node B')
      const nodeC = screen.getByText('Node C')

      await user.click(nodeA)
      await user.keyboard('{Control>}')
      await user.click(nodeB)
      await user.click(nodeC)
      await user.keyboard('{/Control}')

      const halo = screen.getByTestId('selection-halo')
      const haloStyle = window.getComputedStyle(halo)

      expect(haloStyle.position).toBe('absolute')
      expect(haloStyle.border).not.toBe('none')
    })
  })

  describe('GRPC-06 selection model - click', () => {
    it('selects clicked node and deselects others', async () => {
      const user = userEvent.setup()
      renderCanvas()

      const nodeA = screen.getByText('Node A')
      const nodeB = screen.getByText('Node B')
      const nodeC = screen.getByText('Node C')

      await user.click(nodeA)

      let nodeAStyle = window.getComputedStyle(nodeA)
      let nodeBStyle = window.getComputedStyle(nodeB)
      let nodeCStyle = window.getComputedStyle(nodeC)

      expect(nodeAStyle.background).toBe('rgb(224, 240, 255)')
      expect(nodeBStyle.background).toBe('rgb(255, 255, 255)')
      expect(nodeCStyle.background).toBe('rgb(255, 255, 255)')

      await user.click(nodeB)

      nodeAStyle = window.getComputedStyle(nodeA)
      nodeBStyle = window.getComputedStyle(nodeB)
      nodeCStyle = window.getComputedStyle(nodeC)

      expect(nodeAStyle.background).toBe('rgb(255, 255, 255)')
      expect(nodeBStyle.background).toBe('rgb(224, 240, 255)')
      expect(nodeCStyle.background).toBe('rgb(255, 255, 255)')
    })
  })

  describe('GRPC-06 selection model - clear', () => {
    it('clears selection when clicking empty canvas', async () => {
      const user = userEvent.setup()
      const { container } = renderCanvas()

      const nodeA = screen.getByText('Node A')
      const nodeB = screen.getByText('Node B')
      const nodeC = screen.getByText('Node C')

      await user.click(nodeA)
      await user.keyboard('{Control>}')
      await user.click(nodeB)
      await user.click(nodeC)
      await user.keyboard('{/Control}')

      let nodeAStyle = window.getComputedStyle(nodeA)
      let nodeBStyle = window.getComputedStyle(nodeB)
      let nodeCStyle = window.getComputedStyle(nodeC)

      expect(nodeAStyle.background).toBe('rgb(224, 240, 255)')
      expect(nodeBStyle.background).toBe('rgb(224, 240, 255)')
      expect(nodeCStyle.background).toBe('rgb(224, 240, 255)')

      const canvasClickArea = container.querySelector('[aria-label="Clear selection"]')
      expect(canvasClickArea).toBeInTheDocument()
      await user.click(canvasClickArea as Element)

      nodeAStyle = window.getComputedStyle(nodeA)
      nodeBStyle = window.getComputedStyle(nodeB)
      nodeCStyle = window.getComputedStyle(nodeC)

      expect(nodeAStyle.background).toBe('rgb(255, 255, 255)')
      expect(nodeBStyle.background).toBe('rgb(255, 255, 255)')
      expect(nodeCStyle.background).toBe('rgb(255, 255, 255)')

      expect(screen.queryByTestId('selection-halo')).not.toBeInTheDocument()
    })
  })
})
