import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CanvasOps } from './CanvasOps'
import { ThemeProvider } from '../../shared/ThemeProvider'
import type { Node as FlowNode, Edge } from '@xyflow/react'

describe('Canvas Grouping Basics', () => {
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

  describe('GRP-03 right-click box', () => {
    it('draws group box around selected nodes on right-click', async () => {
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

      await user.pointer({ keys: '[MouseRight]', target: nodeA })

      await waitFor(() => {
        const groupBox = screen.queryByTestId('group-box')
        expect(groupBox).toBeInTheDocument()
      })
    })

    it('group box has visible border', async () => {
      const user = userEvent.setup()
      renderCanvas()

      const nodeA = screen.getByText('Node A')
      const nodeB = screen.getByText('Node B')

      await user.click(nodeA)
      await user.keyboard('{Control>}')
      await user.click(nodeB)
      await user.keyboard('{/Control}')

      await user.pointer({ keys: '[MouseRight]', target: nodeA })

      await waitFor(() => {
        const groupBox = screen.getByTestId('group-box')
        const groupBoxStyle = window.getComputedStyle(groupBox)
        expect(groupBoxStyle.border).not.toBe('none')
      })
    })

    it('group box encloses all selected nodes', async () => {
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

      await user.pointer({ keys: '[MouseRight]', target: nodeA })

      await waitFor(() => {
        const groupBox = screen.getByTestId('group-box')
        expect(groupBox).toBeInTheDocument()

        const groupBoxStyle = window.getComputedStyle(groupBox)
        expect(groupBoxStyle.position).toBe('absolute')
      })
    })
  })

  describe('GRP-09 group prompt context', () => {
    it('shows STT tooltip when focusing on group', async () => {
      const user = userEvent.setup()
      renderCanvas()

      const nodeA = screen.getByText('Node A')
      const nodeB = screen.getByText('Node B')

      await user.click(nodeA)
      await user.keyboard('{Control>}')
      await user.click(nodeB)
      await user.keyboard('{/Control}')

      await user.pointer({ keys: '[MouseRight]', target: nodeA })

      await waitFor(() => {
        const groupBox = screen.getByTestId('group-box')
        expect(groupBox).toBeInTheDocument()
      })

      await user.hover(screen.getByTestId('group-box'))

      await waitFor(() => {
        const tooltip = screen.queryByTestId('group-tooltip')
        expect(tooltip).toBeInTheDocument()
      })
    })

    it('tooltip shows group member count', async () => {
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

      await user.pointer({ keys: '[MouseRight]', target: nodeA })

      await waitFor(() => {
        const groupBox = screen.getByTestId('group-box')
        expect(groupBox).toBeInTheDocument()
      })

      await user.hover(screen.getByTestId('group-box'))

      await waitFor(() => {
        const tooltip = screen.getByTestId('group-tooltip')
        expect(tooltip).toHaveTextContent('3 nodes')
      })
    })

    it('tooltip payload contains member refs', async () => {
      const user = userEvent.setup()
      renderCanvas()

      const nodeA = screen.getByText('Node A')
      const nodeB = screen.getByText('Node B')

      await user.click(nodeA)
      await user.keyboard('{Control>}')
      await user.click(nodeB)
      await user.keyboard('{/Control}')

      await user.pointer({ keys: '[MouseRight]', target: nodeA })

      await waitFor(() => {
        const groupBox = screen.getByTestId('group-box')
        expect(groupBox).toBeInTheDocument()
      })

      await user.hover(screen.getByTestId('group-box'))

      await waitFor(() => {
        const tooltip = screen.getByTestId('group-tooltip')
        expect(tooltip).toHaveTextContent('Node A')
        expect(tooltip).toHaveTextContent('Node B')
      })
    })
  })

  describe('GRP-10 group node-like', () => {
    it('opens as unit with expansion surface on double-click', async () => {
      const user = userEvent.setup()
      renderCanvas()

      const nodeA = screen.getByText('Node A')
      const nodeB = screen.getByText('Node B')

      await user.click(nodeA)
      await user.keyboard('{Control>}')
      await user.click(nodeB)
      await user.keyboard('{/Control}')

      await user.pointer({ keys: '[MouseRight]', target: nodeA })

      await waitFor(() => {
        const groupBox = screen.getByTestId('group-box')
        expect(groupBox).toBeInTheDocument()
      })

      await user.dblClick(screen.getByTestId('group-box'))

      await waitFor(() => {
        const expansionSurface = screen.queryByTestId('group-expansion-surface')
        expect(expansionSurface).toBeInTheDocument()
      })
    })

    it('expansion surface shows group contents', async () => {
      const user = userEvent.setup()
      renderCanvas()

      const nodeA = screen.getByText('Node A')
      const nodeB = screen.getByText('Node B')

      await user.click(nodeA)
      await user.keyboard('{Control>}')
      await user.click(nodeB)
      await user.keyboard('{/Control}')

      await user.pointer({ keys: '[MouseRight]', target: nodeA })

      await waitFor(() => {
        const groupBox = screen.getByTestId('group-box')
        expect(groupBox).toBeInTheDocument()
      })

      await user.dblClick(screen.getByTestId('group-box'))

      await waitFor(() => {
        const expansionSurface = screen.getByTestId('group-expansion-surface')
        expect(expansionSurface).toHaveTextContent('Node A')
        expect(expansionSurface).toHaveTextContent('Node B')
      })
    })

    it('group behaves like single node in graph interactions', async () => {
      const user = userEvent.setup()
      renderCanvas()

      const nodeA = screen.getByText('Node A')
      const nodeB = screen.getByText('Node B')

      await user.click(nodeA)
      await user.keyboard('{Control>}')
      await user.click(nodeB)
      await user.keyboard('{/Control}')

      await user.pointer({ keys: '[MouseRight]', target: nodeA })

      await waitFor(() => {
        const groupBox = screen.getByTestId('group-box')
        expect(groupBox).toBeInTheDocument()
      })

      await user.click(screen.getByTestId('group-box'))

      const groupBoxStyle = window.getComputedStyle(screen.getByTestId('group-box'))
      expect(groupBoxStyle.border).toContain('rgb(0, 123, 255)')
    })
  })
})
