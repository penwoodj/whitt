import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  describe('GRP-06 drag link', () => {
    it('creates link between nodes when dragging from edge to target', async () => {
      const user = userEvent.setup()
      renderCanvas()

      const nodeA = screen.getByText('Node A')
      const nodeB = screen.getByText('Node B')

      await user.pointer([
        { keys: '[MouseLeft][Control>]', target: nodeA },
        { target: nodeA, coords: { x: 140, y: 25 } },
        { target: nodeB, coords: { x: 50, y: 0 } },
        { keys: '[/Control][/MouseLeft]' },
      ])

      await waitFor(() => {
        const edges = screen.queryAllByTestId(/^edge-/)
        expect(edges.length).toBeGreaterThan(0)
      })
    })

    it('link visible in graph after creation', async () => {
      const user = userEvent.setup()
      renderCanvas()

      const nodeA = screen.getByText('Node A')
      const nodeB = screen.getByText('Node B')

      await user.pointer([
        { keys: '[MouseLeft][Control>]', target: nodeA },
        { target: nodeA, coords: { x: 140, y: 25 } },
        { target: nodeB, coords: { x: 50, y: 0 } },
        { keys: '[/Control][/MouseLeft]' },
      ])

      await waitFor(() => {
        const edge = screen.getByTestId('edge-node-a-node-b')
        expect(edge).toBeInTheDocument()
        expect(edge).toBeVisible()
      })
    })
  })

  describe('GRPC-03 connection preview - valid', () => {
    it('shows preview line following pointer on valid target', async () => {
      const user = userEvent.setup()
      renderCanvas()

      const nodeA = screen.getByText('Node A')
      const nodeC = screen.getByText('Node C')

      await user.pointer([
        { keys: '[MouseLeft][Control>]', target: nodeA },
        { target: nodeA, coords: { x: 140, y: 25 } },
        { target: nodeC, coords: { x: 25, y: 0 } },
      ])

      const previewLine = screen.queryByTestId('connection-preview')
      expect(previewLine).toBeInTheDocument()
    })

    it('preview line styled as valid when targeting different node', async () => {
      const user = userEvent.setup()
      renderCanvas()

      const nodeA = screen.getByText('Node A')
      const nodeB = screen.getByText('Node B')

      await user.pointer([
        { keys: '[MouseLeft][Control>]', target: nodeA },
        { target: nodeA, coords: { x: 140, y: 25 } },
        { target: nodeB, coords: { x: 25, y: 0 } },
      ])

      const previewLine = screen.getByTestId('connection-preview')
      const previewStyle = window.getComputedStyle(previewLine)

      expect(previewStyle.borderTop).toContain('solid')
      expect(previewStyle.borderTop).toContain('blue')
    })

    it('target node highlighted with glow state on valid hover', async () => {
      const user = userEvent.setup()
      renderCanvas()

      const nodeA = screen.getByText('Node A')
      const nodeB = screen.getByText('Node B')

      await user.pointer([
        { keys: '[MouseLeft][Control>]', target: nodeA },
        { target: nodeA, coords: { x: 140, y: 25 } },
        { target: nodeB, coords: { x: 25, y: 0 } },
      ])

      const nodeBStyle = window.getComputedStyle(nodeB)
      expect(nodeBStyle.boxShadow).toContain('0 0 8px rgba(0, 123, 255, 0.5)')
    })
  })

  describe('GRPC-03 connection preview - invalid', () => {
    it('preview line styled as invalid when targeting same node (self-loop)', async () => {
      const user = userEvent.setup()
      renderCanvas()

      const nodeA = screen.getByText('Node A')

      await user.pointer([
        { keys: '[MouseLeft][Control>]', target: nodeA },
        { target: nodeA, coords: { x: -25, y: 0 } },
      ])

      const previewLine = screen.getByTestId('connection-preview')
      const previewStyle = window.getComputedStyle(previewLine)

      expect(previewStyle.borderTop).toContain('dashed')
      expect(previewStyle.borderTop).toContain('red')
    })

    it('no glow state when targeting invalid (self-loop)', async () => {
      const user = userEvent.setup()
      renderCanvas()

      const nodeA = screen.getByText('Node A')

      await user.pointer([
        { keys: '[MouseLeft][Control>]', target: nodeA },
        { target: nodeA, coords: { x: -25, y: 0 } },
      ])

      const nodeAStyle = window.getComputedStyle(nodeA)
      expect(nodeAStyle.boxShadow).toBe('none')
    })
  })

  describe('GRPC-04 connection cancel - ESC', () => {
    it('cancels connection when ESC pressed', async () => {
      const user = userEvent.setup()
      renderCanvas()

      const nodeA = screen.getByText('Node A')

      await user.pointer([
        { keys: '[MouseLeft][Control>]', target: nodeA },
        { target: nodeA, coords: { x: 140, y: 25 } },
      ])

      expect(screen.queryByTestId('connection-preview')).toBeInTheDocument()

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByTestId('connection-preview')).not.toBeInTheDocument()
      })

      const edges = screen.queryAllByTestId(/^edge-/)
      expect(edges.length).toBe(0)
    })
  })

  describe('GRPC-04 connection cancel - drop empty', () => {
    it('cancels connection when dropped on empty canvas', async () => {
      const user = userEvent.setup()
      const { container } = renderCanvas()

      const nodeA = screen.getByText('Node A')
      const canvas = container.querySelector('[data-testid="react-flow-canvas"]')

      await user.pointer([
        { keys: '[MouseLeft][Control>]', target: nodeA },
        { target: nodeA, coords: { x: 140, y: 25 } },
        { target: canvas as Element, coords: { x: 400, y: 400 } },
        { keys: '[/Control][/MouseLeft]' },
      ])

      await waitFor(() => {
        expect(screen.queryByTestId('connection-preview')).not.toBeInTheDocument()
      })

      const edges = screen.queryAllByTestId(/^edge-/)
      expect(edges.length).toBe(0)
    })
  })

  describe('GRPC-04 connection cancel - drop invalid', () => {
    it('cancels connection when dropped on invalid target (self-loop)', async () => {
      const user = userEvent.setup()
      renderCanvas()

      const nodeA = screen.getByText('Node A')

      await user.pointer([
        { keys: '[MouseLeft][Control>]', target: nodeA },
        { target: nodeA, coords: { x: -25, y: 0 } },
        { keys: '[/Control][/MouseLeft]' },
      ])

      await waitFor(() => {
        expect(screen.queryByTestId('connection-preview')).not.toBeInTheDocument()
      })

      const edges = screen.queryAllByTestId(/^edge-/)
      expect(edges.length).toBe(0)
    })
  })
})
