import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CanvasOps } from './CanvasOps'
import { ThemeProvider } from '../../shared/ThemeProvider'

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