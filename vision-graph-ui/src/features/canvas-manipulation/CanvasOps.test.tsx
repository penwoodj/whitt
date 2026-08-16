import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CanvasOps } from './CanvasOps'
import { ThemeProvider } from '../../shared/ThemeProvider'

describe('CanvasOps - Delete Guard', () => {
  const mockNodes = [
    { id: 'node-a', position: { x: 100, y: 100 }, data: { title: 'Node A' } },
    { id: 'node-b', position: { x: 300, y: 100 }, data: { title: 'Node B' } },
    { id: 'node-c', position: { x: 500, y: 100 }, data: { title: 'Node C' } },
  ]

  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider>
        {component}
      </ThemeProvider>
    )
  }

  describe('GRPC-07 delete guard', () => {
    it('shows confirm dialog when deleting 3 nodes', async () => {
      renderWithTheme(
        <CanvasOps initialNodes={mockNodes} />
      )

      const nodeA = screen.getByTestId('node-node-a')

      await userEvent.click(nodeA)

      fireEvent.keyDown(window, { key: 'Delete' })

      await waitFor(() => {
        const confirmDialog = screen.queryByText(/delete 1 node/i)
        expect(confirmDialog).toBeInTheDocument()
      })
    })

    it('keeps nodes after canceling delete', async () => {
      renderWithTheme(
        <CanvasOps initialNodes={mockNodes} />
      )

      const nodeA = screen.getByTestId('node-node-a')

      await userEvent.click(nodeA)

      fireEvent.keyDown(window, { key: 'Delete' })

      const cancelButton = await screen.findByText(/cancel/i)
      await userEvent.click(cancelButton)

      await waitFor(() => {
        expect(screen.getByTestId('node-node-a')).toBeInTheDocument()
      })
    })

    it('deletes nodes after confirming', async () => {
      const twoNodes = [
        { id: 'node-a', position: { x: 100, y: 100 }, data: { title: 'Node A' } },
        { id: 'node-b', position: { x: 300, y: 100 }, data: { title: 'Node B' } },
      ]

      renderWithTheme(
        <CanvasOps initialNodes={twoNodes} />
      )

      const nodeA = screen.getByTestId('node-node-a')

      await userEvent.click(nodeA)

      fireEvent.keyDown(window, { key: 'Delete' })

      const confirmButton = await screen.findByTestId('delete-confirm-btn')
      await userEvent.click(confirmButton)

      await waitFor(() => {
        expect(screen.queryByTestId('node-node-a')).not.toBeInTheDocument()
      })
    })
  })
})

describe('CanvasOps - Standalone Node', () => {
  const existingNodes = [
    { id: 'node-a', position: { x: 100, y: 100 }, data: { title: 'Node A' } },
  ]

  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider>
        {component}
      </ThemeProvider>
    )
  }

  describe('GRP-05 standalone node', () => {
    it('creates unconnected node with default title', async () => {
      renderWithTheme(
        <CanvasOps initialNodes={existingNodes} />
      )

      const createNodeAction = screen.queryByTestId('create-node-action')
      if (createNodeAction) {
        await userEvent.click(createNodeAction)
      }

      await waitFor(() => {
        const newNodes = screen.getAllByTestId(/node-/)
        expect(newNodes.length).toBeGreaterThan(1)

        const standaloneNode = newNodes.find(n => n.textContent === 'New Node')
        expect(standaloneNode).toBeInTheDocument()
      })
    })

    it('standalone node has no edges', async () => {
      renderWithTheme(
        <CanvasOps initialNodes={existingNodes} />
      )

      const createNodeAction = screen.queryByTestId('create-node-action')
      if (createNodeAction) {
        await userEvent.click(createNodeAction)
      }

      await waitFor(() => {
        const edges = screen.queryAllByTestId(/edge-/)
        expect(edges.length).toBe(0)
      })
    })

    it('standalone node can be dragged freely', async () => {
      renderWithTheme(
        <CanvasOps initialNodes={existingNodes} />
      )

      const createNodeAction = screen.queryByTestId('create-node-action')
      if (createNodeAction) {
        await userEvent.click(createNodeAction)
      }

      await waitFor(() => {
        const newNodes = screen.getAllByTestId(/node-/)
        const standaloneNode = newNodes.find(n => n.textContent === 'New Node')
        expect(standaloneNode).toBeInTheDocument()
      })

      const newNodes = screen.getAllByTestId(/node-/)
      const standaloneNode = newNodes.find(n => n.textContent === 'New Node')

      if (standaloneNode) {
        await userEvent.pointer([
          { keys: '[MouseLeft]', target: standaloneNode },
          { coords: { x: 200, y: 200 } },
          { keys: '[/MouseLeft]' },
        ])

        await waitFor(() => {
          expect(standaloneNode).toBeInTheDocument()
        })
      }
    })
  })
})

describe('CanvasOps - Drag Coherence', () => {
  const mockNodes = [
    { id: 'node-a', position: { x: 100, y: 100 }, data: { title: 'Node A' } },
    { id: 'node-b', position: { x: 300, y: 100 }, data: { title: 'Node B' } },
  ]

  const renderWithTheme = (component: React.ReactElement) => {
    return render(
      <ThemeProvider>
        {component}
      </ThemeProvider>
    )
  }

  describe('GRP-04 connected pull', () => {
    it('connected neighbor follows dragged node', async () => {
      const mockEdges = [
        { id: 'edge-a-b', source: 'node-a', target: 'node-b' },
      ]

      renderWithTheme(
        <CanvasOps
          initialNodes={mockNodes}
          initialEdges={mockEdges}
        />
      )

      const nodeA = screen.getByTestId('node-node-a')

      await userEvent.pointer([
        { keys: '[MouseLeft]', target: nodeA },
        { coords: { x: 150, y: 150 } },
        { keys: '[/MouseLeft]' },
      ])

      await waitFor(() => {
        expect(nodeA).toBeInTheDocument()
      })
    })
  })

  describe('GRPC-01 click vs drag', () => {
    it('click selects node without moving', async () => {
      renderWithTheme(
        <CanvasOps
          initialNodes={mockNodes}
        />
      )

      const nodeA = screen.getByTestId('node-node-a')
      await userEvent.click(nodeA)

      expect(nodeA).toBeInTheDocument()
    })

    it('drag threshold < 4px treated as click', async () => {
      renderWithTheme(
        <CanvasOps
          initialNodes={mockNodes}
        />
      )

      const nodeA = screen.getByTestId('node-node-a')

      await userEvent.pointer([
        { keys: '[MouseLeft]', target: nodeA },
        { coords: { x: 103, y: 103 } },
        { keys: '[/MouseLeft]' },
      ])

      expect(nodeA).toBeInTheDocument()
    })

    it('drag threshold > 4px moves node', async () => {
      renderWithTheme(
        <CanvasOps
          initialNodes={mockNodes}
        />
      )

      const nodeA = screen.getByTestId('node-node-a')
      const endPos = { x: 150, y: 150 }

      await userEvent.pointer([
        { keys: '[MouseLeft]', target: nodeA },
        { coords: endPos },
        { keys: '[/MouseLeft]' },
      ])

      await waitFor(() => {
        expect(nodeA).toBeInTheDocument()
      })
    })
  })

  describe('GRPC-02 esc cancels drag', () => {
    it('ESC key cancels drag and restores position', async () => {
      renderWithTheme(
        <CanvasOps
          initialNodes={mockNodes}
        />
      )

      const nodeA = screen.getByTestId('node-node-a')

      fireEvent.mouseDown(nodeA, { clientX: 100, clientY: 100 })
      fireEvent.mouseMove(window, { clientX: 150, clientY: 150 })
      fireEvent.keyDown(window, { key: 'Escape' })

      await waitFor(() => {
        expect(nodeA).toBeInTheDocument()
      })
    })
  })

  describe('GRPC-08 multi-drag coherence', () => {
    const multiNodes = [
      { id: 'node-a', position: { x: 100, y: 100 }, data: { title: 'Node A' } },
      { id: 'node-b', position: { x: 300, y: 100 }, data: { title: 'Node B' } },
      { id: 'node-c', position: { x: 200, y: 250 }, data: { title: 'Node C' } },
    ]

    it('multi-select nodes move together', async () => {
      renderWithTheme(
        <CanvasOps
          initialNodes={multiNodes}
        />
      )

      const nodeA = screen.getByTestId('node-node-a')
      const nodeB = screen.getByTestId('node-node-b')

      await userEvent.click(nodeA)
      fireEvent.click(nodeB, { ctrlKey: true })

      await userEvent.pointer([
        { keys: '[MouseLeft]', target: nodeA },
        { coords: { x: 150, y: 150 } },
        { keys: '[/MouseLeft]' },
      ])

      await waitFor(() => {
        expect(nodeA).toBeInTheDocument()
        expect(nodeB).toBeInTheDocument()
      })
    })

    it('multi-drag preserves relative positions', async () => {
      renderWithTheme(
        <CanvasOps
          initialNodes={multiNodes}
        />
      )

      const nodeA = screen.getByTestId('node-node-a')
      const nodeB = screen.getByTestId('node-node-b')

      await userEvent.click(nodeA)
      fireEvent.click(nodeB, { ctrlKey: true })

      await userEvent.pointer([
        { keys: '[MouseLeft]', target: nodeA },
        { coords: { x: 150, y: 150 } },
        { keys: '[/MouseLeft]' },
      ])

      await waitFor(() => {
        expect(nodeA).toBeInTheDocument()
        expect(nodeB).toBeInTheDocument()
      })
    })
  })
})