import { describe, it, expect } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { CanvasOps } from './CanvasOps'
import { ThemeProvider } from '../../shared/ThemeProvider'
import type { Node as FlowNode, Edge } from '@xyflow/react'

describe('Link Drawing', () => {
  const mockNodes: FlowNode[] = [
    { id: 'node-a', position: { x: 100, y: 100 }, data: { title: 'Node A' } },
    { id: 'node-b', position: { x: 300, y: 100 }, data: { title: 'Node B' } },
    { id: 'node-c', position: { x: 500, y: 100 }, data: { title: 'Node C' } },
  ]

  const mockEdges: Edge[] = []

  const renderCanvas = () => {
    return render(
      <ThemeProvider>
        <CanvasOps initialNodes={mockNodes} initialEdges={mockEdges} />
      </ThemeProvider>
    )
  }

  const drawPointerTo = (target: Element) => {
    fireEvent.mouseMove(target, { clientX: 320, clientY: 125 })
  }

  describe('GRP-06 drag link', () => {
    it('creates link between nodes when dragging from edge to target', () => {
      renderCanvas()

      const nodeA = screen.getByText('Node A')
      const nodeB = screen.getByText('Node B')

      fireEvent.mouseDown(nodeA, { ctrlKey: true, clientX: 120, clientY: 125 })
      drawPointerTo(nodeA)
      drawPointerTo(nodeB)
      fireEvent.mouseUp(nodeB, { ctrlKey: true })

      const edges = screen.queryAllByTestId(/^edge-/)
      expect(edges.length).toBeGreaterThan(0)
    })

    it('link visible in graph after creation', async () => {
      renderCanvas()

      const nodeA = screen.getByText('Node A')
      const nodeB = screen.getByText('Node B')

      fireEvent.mouseDown(nodeA, { ctrlKey: true, clientX: 120, clientY: 125 })
      drawPointerTo(nodeA)
      drawPointerTo(nodeB)
      fireEvent.mouseUp(nodeB, { ctrlKey: true })

      await waitFor(() => {
        const edge = screen.getByTestId('edge-node-a-node-b')
        expect(edge).toBeInTheDocument()
        expect(edge).toBeVisible()
      })
    })
  })

  describe('GRPC-03 connection preview - valid', () => {
    it('shows preview line following pointer on valid target', () => {
      renderCanvas()

      const nodeA = screen.getByText('Node A')
      const nodeC = screen.getByText('Node C')

      fireEvent.mouseDown(nodeA, { ctrlKey: true, clientX: 120, clientY: 125 })
      drawPointerTo(nodeA)
      drawPointerTo(nodeC)

      const previewLine = screen.queryByTestId('connection-preview')
      expect(previewLine).toBeInTheDocument()
    })

    it('preview line styled as valid when targeting different node', () => {
      renderCanvas()

      const nodeA = screen.getByText('Node A')
      const nodeB = screen.getByText('Node B')

      fireEvent.mouseDown(nodeA, { ctrlKey: true, clientX: 120, clientY: 125 })
      drawPointerTo(nodeA)
      drawPointerTo(nodeB)

      const previewLine = screen.getByTestId('connection-preview')
      const previewStyle = window.getComputedStyle(previewLine)

      expect(previewStyle.borderTop).toContain('solid')
      expect(previewStyle.borderTop).toContain('rgb(0, 123, 255)')
    })

    it('target node highlighted with glow state on valid hover', () => {
      renderCanvas()

      const nodeA = screen.getByText('Node A')
      const nodeB = screen.getByText('Node B')

      fireEvent.mouseDown(nodeA, { ctrlKey: true, clientX: 120, clientY: 125 })
      drawPointerTo(nodeA)
      drawPointerTo(nodeB)

      const nodeBStyle = window.getComputedStyle(nodeB)
      expect(nodeBStyle.boxShadow).toContain('0 0 8px rgba(0, 123, 255, 0.5)')
    })
  })

  describe('GRPC-03 connection preview - invalid', () => {
    it('preview line styled as invalid when targeting same node (self-loop)', () => {
      renderCanvas()

      const nodeA = screen.getByText('Node A')

      fireEvent.mouseDown(nodeA, { ctrlKey: true, clientX: 80, clientY: 125 })
      fireEvent.mouseMove(nodeA, { clientX: 90, clientY: 125 })

      const previewLine = screen.getByTestId('connection-preview')
      const previewStyle = window.getComputedStyle(previewLine)

      expect(previewStyle.borderTop).toContain('dashed')
      expect(previewStyle.borderTop).toContain('rgb(220, 53, 69)')
    })

    it('no glow state when targeting invalid (self-loop)', () => {
      renderCanvas()

      const nodeA = screen.getByText('Node A')

      fireEvent.mouseDown(nodeA, { ctrlKey: true, clientX: 80, clientY: 125 })
      fireEvent.mouseMove(nodeA, { clientX: 90, clientY: 125 })

      const nodeAStyle = window.getComputedStyle(nodeA)
      expect(nodeAStyle.boxShadow).toBe('none')
    })
  })

  describe('GRPC-04 connection cancel - ESC', () => {
    it('cancels connection when ESC pressed', () => {
      renderCanvas()

      const nodeA = screen.getByText('Node A')

      fireEvent.mouseDown(nodeA, { ctrlKey: true, clientX: 120, clientY: 125 })
      drawPointerTo(nodeA)

      expect(screen.queryByTestId('connection-preview')).toBeInTheDocument()

      fireEvent.keyDown(window, { key: 'Escape' })

      waitFor(() => {
        expect(screen.queryByTestId('connection-preview')).not.toBeInTheDocument()
      })

      const edges = screen.queryAllByTestId(/^edge-/)
      expect(edges.length).toBe(0)
    })
  })

  describe('GRPC-04 connection cancel - drop empty', () => {
    it('cancels connection when dropped on empty canvas', () => {
      const { container } = renderCanvas()

      const nodeA = screen.getByText('Node A')
      const canvas = container.querySelector('[data-testid="react-flow-canvas"]') as Element

      fireEvent.mouseDown(nodeA, { ctrlKey: true, clientX: 120, clientY: 125 })
      drawPointerTo(nodeA)
      fireEvent.mouseMove(canvas, { clientX: 400, clientY: 400 })
      fireEvent.mouseUp(canvas, { ctrlKey: true })

      waitFor(() => {
        expect(screen.queryByTestId('connection-preview')).not.toBeInTheDocument()
      })

      const edges = screen.queryAllByTestId(/^edge-/)
      expect(edges.length).toBe(0)
    })
  })

  describe('GRPC-04 connection cancel - drop invalid', () => {
    it('cancels connection when dropped on invalid target (self-loop)', () => {
      renderCanvas()

      const nodeA = screen.getByText('Node A')

      fireEvent.mouseDown(nodeA, { ctrlKey: true, clientX: 120, clientY: 125 })
      drawPointerTo(nodeA)
      fireEvent.mouseUp(nodeA, { ctrlKey: true })

      waitFor(() => {
        expect(screen.queryByTestId('connection-preview')).not.toBeInTheDocument()
      })

      const edges = screen.queryAllByTestId(/^edge-/)
      expect(edges.length).toBe(0)
    })
  })
})
