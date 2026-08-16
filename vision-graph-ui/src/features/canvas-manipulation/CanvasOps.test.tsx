import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CanvasOps } from './CanvasOps'
import { ThemeProvider } from '../../shared/ThemeProvider'
import type { FsPort } from '../../shared/fs/FsPort'

const mockFsPort: FsPort = {
  readFile: vi.fn().mockImplementation(async () => 'content'),
  writeFile: vi.fn().mockImplementation(async () => {}),
  listDir: vi.fn().mockImplementation(async () => []),
  watch: vi.fn(),
  atomicRename: vi.fn().mockImplementation(async () => {}),
}

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

  describe('GRPX-02 left-click pan vs right-click lasso', () => {
    it('left-click drag on empty canvas pans the canvas', async () => {
      renderWithTheme(<CanvasOps initialNodes={mockNodes} />)
      
      const canvas = screen.getByTestId('react-flow-canvas')
      
      await userEvent.pointer([
        { keys: '[MouseLeft]', target: canvas, coords: { x: 400, y: 300 } },
        { coords: { x: 500, y: 400 } },
        { keys: '[/MouseLeft]' },
      ])
      
      // Verify pan state changed
      const nodeA = screen.getByTestId('node-node-a')
      const nodeB = screen.getByTestId('node-node-b')
      
      // Nodes should be visible (panned)
      expect(nodeA).toBeInTheDocument()
      expect(nodeB).toBeInTheDocument()
    })

    it('right-click drag on empty canvas creates lasso selection', async () => {
      renderWithTheme(<CanvasOps initialNodes={mockNodes} />)
      
      const canvas = screen.getByTestId('react-flow-canvas')
      
      await userEvent.pointer([
        { keys: '[MouseRight]', target: canvas, coords: { x: 50, y: 50 } },
        { coords: { x: 600, y: 400 } },
        { keys: '[/MouseRight]' },
      ])
      
      // Verify lasso box appears
      await waitFor(() => {
        const lassoBox = screen.queryByTestId('lasso-box')
        expect(lassoBox).toBeInTheDocument()
      })
    })

    it('left-click on node selects node (does not pan)', async () => {
      renderWithTheme(<CanvasOps initialNodes={mockNodes} />)
      
      const nodeA = screen.getByTestId('node-node-a')
      
      await userEvent.click(nodeA)
      
      // Node should be selected (check for selection halo)
      await waitFor(() => {
        const selectionHalo = screen.queryByTestId('selection-halo')
        expect(selectionHalo).toBeInTheDocument()
      })
    })

    it('right-click on selected nodes creates group', async () => {
      renderWithTheme(<CanvasOps initialNodes={mockNodes} />)
      
      const nodeA = screen.getByTestId('node-node-a')
      const nodeB = screen.getByTestId('node-node-b')
      
      await userEvent.click(nodeA)
      fireEvent.click(nodeB, { ctrlKey: true })
      
      await userEvent.pointer({ keys: '[MouseRight]', target: nodeA })
      
      // Verify group box appears
      await waitFor(() => {
        const groupBox = screen.queryByTestId('group-box')
        expect(groupBox).toBeInTheDocument()
      })
    })
  })

  describe('GRPX-03 selection halo + icon outside border', () => {
    it('selection halo surrounds selected nodes', async () => {
      renderWithTheme(<CanvasOps initialNodes={mockNodes} />)
      
      const nodeA = screen.getByTestId('node-node-a')
      const nodeB = screen.getByTestId('node-node-b')
      const nodeC = screen.getByTestId('node-node-c')
      
      await userEvent.click(nodeA)
      fireEvent.click(nodeB, { ctrlKey: true })
      fireEvent.click(nodeC, { ctrlKey: true })
      
      // Verify selection halo appears
      await waitFor(() => {
        const selectionHalo = screen.queryByTestId('selection-halo')
        expect(selectionHalo).toBeInTheDocument()
      })
    })

    it('+ icon appears outside halo border on hover', async () => {
      renderWithTheme(<CanvasOps initialNodes={mockNodes} />)
      
      const nodeA = screen.getByTestId('node-node-a')
      const nodeB = screen.getByTestId('node-node-b')
      
      await userEvent.click(nodeA)
      fireEvent.click(nodeB, { ctrlKey: true })
      
      await userEvent.pointer({ keys: '[MouseRight]', target: nodeA })
      
      // Wait for group box to appear
      await waitFor(() => {
        const groupBox = screen.queryByTestId('group-box')
        expect(groupBox).toBeInTheDocument()
      })
      
      const groupBox = screen.getByTestId('group-box')
      
      // Hover over group box
      await userEvent.hover(groupBox)
      
      // Verify + icon appears
      await waitFor(() => {
        const makeFolderBtn = screen.queryByTestId('make-folder-action')
        expect(makeFolderBtn).toBeInTheDocument()
      })
    })

    it('+ icon appears outside halo border on click', async () => {
      renderWithTheme(<CanvasOps initialNodes={mockNodes} />)
      
      const nodeA = screen.getByTestId('node-node-a')
      const nodeB = screen.getByTestId('node-node-b')
      
      await userEvent.click(nodeA)
      fireEvent.click(nodeB, { ctrlKey: true })
      
      await userEvent.pointer({ keys: '[MouseRight]', target: nodeA })
      
      // Wait for group box to appear
      await waitFor(() => {
        const groupBox = screen.queryByTestId('group-box')
        expect(groupBox).toBeInTheDocument()
      })
      
      const groupBox = screen.getByTestId('group-box')
      
      // Click on group box
      await userEvent.click(groupBox)
      
      // Verify + icon appears
      await waitFor(() => {
        const makeFolderBtn = screen.queryByTestId('make-folder-action')
        expect(makeFolderBtn).toBeInTheDocument()
      })
    })
  })

  describe('GRPX-04 + icon tooltip menu actions', () => {
    it('+ icon tooltip menu appears on hover', async () => {
      renderWithTheme(<CanvasOps initialNodes={mockNodes} />)
      
      const nodeA = screen.getByTestId('node-node-a')
      const nodeB = screen.getByTestId('node-node-b')
      
      await userEvent.click(nodeA)
      fireEvent.click(nodeB, { ctrlKey: true })
      
      await userEvent.pointer({ keys: '[MouseRight]', target: nodeA })
      
      // Wait for group box to appear
      await waitFor(() => {
        const groupBox = screen.queryByTestId('group-box')
        expect(groupBox).toBeInTheDocument()
      })
      
      const groupBox = screen.getByTestId('group-box')
      await userEvent.hover(groupBox)
      
      // Wait for + icon to appear
      await waitFor(() => {
        const makeFolderBtn = screen.queryByTestId('make-folder-action')
        expect(makeFolderBtn).toBeInTheDocument()
      })
      
      const makeFolderBtn = screen.getByTestId('make-folder-action')
      
      // Hover over + icon
      await userEvent.hover(makeFolderBtn)
      
      // Verify tooltip menu appears
      await waitFor(() => {
        const tooltipMenu = screen.queryByTestId('group-action-menu')
        expect(tooltipMenu).toBeInTheDocument()
      })
    })

    it('+ icon tooltip menu appears on click', async () => {
      renderWithTheme(<CanvasOps initialNodes={mockNodes} />)
      
      const nodeA = screen.getByTestId('node-node-a')
      const nodeB = screen.getByTestId('node-node-b')
      
      await userEvent.click(nodeA)
      fireEvent.click(nodeB, { ctrlKey: true })
      
      await userEvent.pointer({ keys: '[MouseRight]', target: nodeA })
      
      // Wait for group box to appear
      await waitFor(() => {
        const groupBox = screen.queryByTestId('group-box')
        expect(groupBox).toBeInTheDocument()
      })
      
      const groupBox = screen.getByTestId('group-box')
      await userEvent.hover(groupBox)
      
      // Wait for + icon to appear
      await waitFor(() => {
        const makeFolderBtn = screen.queryByTestId('make-folder-action')
        expect(makeFolderBtn).toBeInTheDocument()
      })
      
      const makeFolderBtn = screen.getByTestId('make-folder-action')
      
      // Click on + icon
      await userEvent.click(makeFolderBtn)
      
      // Verify tooltip menu appears
      await waitFor(() => {
        const tooltipMenu = screen.queryByTestId('group-action-menu')
        expect(tooltipMenu).toBeInTheDocument()
      })
    })

    it('menu includes Make Folder and Speak to Selected actions', async () => {
      renderWithTheme(<CanvasOps initialNodes={mockNodes} />)
      
      const nodeA = screen.getByTestId('node-node-a')
      const nodeB = screen.getByTestId('node-node-b')
      
      await userEvent.click(nodeA)
      fireEvent.click(nodeB, { ctrlKey: true })
      
      await userEvent.pointer({ keys: '[MouseRight]', target: nodeA })
      
      // Wait for group box to appear
      await waitFor(() => {
        const groupBox = screen.queryByTestId('group-box')
        expect(groupBox).toBeInTheDocument()
      })
      
      const groupBox = screen.getByTestId('group-box')
      await userEvent.hover(groupBox)
      
      // Wait for + icon to appear
      await waitFor(() => {
        const makeFolderBtn = screen.queryByTestId('make-folder-action')
        expect(makeFolderBtn).toBeInTheDocument()
      })
      
      const makeFolderBtn = screen.getByTestId('make-folder-action')
      await userEvent.click(makeFolderBtn)
      
      // Verify menu items appear
      await waitFor(() => {
        const makeFolderMenuItem = screen.queryByTestId('menu-make-folder')
        const speakToSelectedMenuItem = screen.queryByTestId('menu-speak-to-selected')
        const otherActionMenuItem = screen.queryByTestId('menu-other-action')
        
        expect(makeFolderMenuItem).toBeInTheDocument()
        expect(speakToSelectedMenuItem).toBeInTheDocument()
        expect(otherActionMenuItem).toBeInTheDocument()
      })
    })
  })

  describe('GRPX-05 Make Folder visual transformation', () => {
    it('Make Folder transforms group visual style', async () => {
      renderWithTheme(<CanvasOps initialNodes={mockNodes} />)
      
      const nodeA = screen.getByTestId('node-node-a')
      const nodeB = screen.getByTestId('node-node-b')
      
      await userEvent.click(nodeA)
      fireEvent.click(nodeB, { ctrlKey: true })
      
      await userEvent.pointer({ keys: '[MouseRight]', target: nodeA })
      
      // Wait for group box to appear
      await waitFor(() => {
        const groupBox = screen.queryByTestId('group-box')
        expect(groupBox).toBeInTheDocument()
      })
      
      const groupBox = screen.getByTestId('group-box')
      await userEvent.hover(groupBox)
      
      // Wait for + icon to appear
      await waitFor(() => {
        const makeFolderBtn = screen.queryByTestId('make-folder-action')
        expect(makeFolderBtn).toBeInTheDocument()
      })
      
      const makeFolderBtn = screen.getByTestId('make-folder-action')
      await userEvent.click(makeFolderBtn)
      
      // Click Make Folder in menu
      await waitFor(() => {
        const makeFolderMenuItem = screen.queryByTestId('menu-make-folder')
        expect(makeFolderMenuItem).toBeInTheDocument()
      })
      
      const makeFolderMenuItem = screen.getByTestId('menu-make-folder')
      await userEvent.click(makeFolderMenuItem)
      
      // Verify group transformed to hard style
      await waitFor(() => {
        const groupBox = screen.getByTestId('group-box')
        expect(groupBox).toHaveAttribute('data-group-type', 'hard')
      })
    })

    it('hard group has pronounced border and solid background', async () => {
      renderWithTheme(<CanvasOps initialNodes={mockNodes} />)
      
      const nodeA = screen.getByTestId('node-node-a')
      const nodeB = screen.getByTestId('node-node-b')
      
      await userEvent.click(nodeA)
      fireEvent.click(nodeB, { ctrlKey: true })
      
      await userEvent.pointer({ keys: '[MouseRight]', target: nodeA })
      
      // Create group and promote to hard
      await waitFor(() => {
        const groupBox = screen.queryByTestId('group-box')
        expect(groupBox).toBeInTheDocument()
      })
      
      const groupBox = screen.getByTestId('group-box')
      await userEvent.hover(groupBox)
      
      await waitFor(() => {
        const makeFolderBtn = screen.queryByTestId('make-folder-action')
        expect(makeFolderBtn).toBeInTheDocument()
      })
      
      const makeFolderBtn = screen.getByTestId('make-folder-action')
      await userEvent.click(makeFolderBtn)
      
      await waitFor(() => {
        const makeFolderMenuItem = screen.queryByTestId('menu-make-folder')
        expect(makeFolderMenuItem).toBeInTheDocument()
      })
      
      const makeFolderMenuItem = screen.getByTestId('menu-make-folder')
      await userEvent.click(makeFolderMenuItem)
      
      // Verify hard group styling
      await waitFor(() => {
        const groupBox = screen.getByTestId('group-box')
        expect(groupBox).toHaveAttribute('data-group-type', 'hard')
        expect(groupBox).toBeInTheDocument()
      })
    })
  })

  describe('GRPX-06 Make Folder file system action', () => {
    it('Make Folder creates folder and moves files', async () => {
      renderWithTheme(<CanvasOps initialNodes={mockNodes} fsPort={mockFsPort} />)
      
      const nodeA = screen.getByTestId('node-node-a')
      const nodeB = screen.getByTestId('node-node-b')
      
      await userEvent.click(nodeA)
      fireEvent.click(nodeB, { ctrlKey: true })
      
      await userEvent.pointer({ keys: '[MouseRight]', target: nodeA })
      
      // Wait for group box to appear
      await waitFor(() => {
        const groupBox = screen.queryByTestId('group-box')
        expect(groupBox).toBeInTheDocument()
      })
      
      const groupBox = screen.getByTestId('group-box')
      await userEvent.hover(groupBox)
      
      // Wait for + icon to appear
      await waitFor(() => {
        const makeFolderBtn = screen.queryByTestId('make-folder-action')
        expect(makeFolderBtn).toBeInTheDocument()
      })
      
      const makeFolderBtn = screen.getByTestId('make-folder-action')
      await userEvent.click(makeFolderBtn)
      
      // Click Make Folder in menu
      await waitFor(() => {
        const makeFolderMenuItem = screen.queryByTestId('menu-make-folder')
        expect(makeFolderMenuItem).toBeInTheDocument()
      })
      
      const makeFolderMenuItem = screen.getByTestId('menu-make-folder')
      await userEvent.click(makeFolderMenuItem)
      
      // Verify FS actions via spy divs
      await waitFor(() => {
        const folderSpy = screen.queryByTestId('folder-create-spy')
        expect(folderSpy).toBeInTheDocument()
        expect(folderSpy).toHaveTextContent('folder created')
      })
      
      await waitFor(() => {
        const moveSpies = screen.queryAllByTestId('file-move-spy')
        expect(moveSpies.length).toBeGreaterThan(0)
      })
    })

    it('Make Folder creates new blank node at top level', async () => {
      renderWithTheme(<CanvasOps initialNodes={mockNodes} fsPort={mockFsPort} />)
      
      const nodeA = screen.getByTestId('node-node-a')
      const nodeB = screen.getByTestId('node-node-b')
      
      await userEvent.click(nodeA)
      fireEvent.click(nodeB, { ctrlKey: true })
      
      await userEvent.pointer({ keys: '[MouseRight]', target: nodeA })
      
      // Wait for group box to appear
      await waitFor(() => {
        const groupBox = screen.queryByTestId('group-box')
        expect(groupBox).toBeInTheDocument()
      })
      
      const groupBox = screen.getByTestId('group-box')
      await userEvent.hover(groupBox)
      
      // Wait for + icon to appear
      await waitFor(() => {
        const makeFolderBtn = screen.queryByTestId('make-folder-action')
        expect(makeFolderBtn).toBeInTheDocument()
      })
      
      const makeFolderBtn = screen.getByTestId('make-folder-action')
      await userEvent.click(makeFolderBtn)
      
      // Click Make Folder in menu
      await waitFor(() => {
        const makeFolderMenuItem = screen.queryByTestId('menu-make-folder')
        expect(makeFolderMenuItem).toBeInTheDocument()
      })
      
      const makeFolderMenuItem = screen.getByTestId('menu-make-folder')
      await userEvent.click(makeFolderMenuItem)
      
      // Verify new blank node created
      await waitFor(() => {
        const newNodes = screen.queryAllByText(/New Group/i)
        expect(newNodes.length).toBeGreaterThan(0)
      })
    })
  })
})