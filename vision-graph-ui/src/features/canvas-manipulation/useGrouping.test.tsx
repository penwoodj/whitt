import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CanvasOps } from './CanvasOps'
import { ThemeProvider } from '../../shared/ThemeProvider'
import type { Node as FlowNode, Edge } from '@xyflow/react'
import type { FsPort } from '../../shared/fs/FsPort'

const mockReadFile = vi.fn().mockImplementation(async () => 'content')
const mockWriteFile = vi.fn().mockImplementation(async () => {})
const mockListDir = vi.fn().mockImplementation(async () => [])
const mockWatch = vi.fn()
const mockAtomicRename = vi.fn().mockImplementation(async () => {})

const mockFsPort: FsPort = {
  readFile: mockReadFile,
  writeFile: mockWriteFile,
  listDir: mockListDir,
  watch: mockWatch,
  atomicRename: mockAtomicRename,
}

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
        <CanvasOps initialNodes={mockNodes} initialEdges={mockEdges} fsPort={mockFsPort} />
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

  describe('GRP-07 soft vs hard grouping', () => {
    it('soft group has soft border style initially', async () => {
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
        expect(groupBox).toHaveAttribute('data-group-type', 'soft')
      })
    })

    it('invoking Make Folder transforms group to hard style', async () => {
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
        expect(groupBox).toHaveAttribute('data-group-type', 'soft')
      })

      const groupBox = screen.getByTestId('group-box')
      await user.hover(groupBox)

      await waitFor(() => {
        const makeFolderBtn = screen.queryByTestId('make-folder-action')
        expect(makeFolderBtn).toBeInTheDocument()
      })

      const makeFolderBtn = screen.getByTestId('make-folder-action')
      await user.click(makeFolderBtn)
      await user.click(screen.getByTestId('menu-make-folder'))

      await waitFor(() => {
        const groupBoxes = screen.getAllByTestId('group-box')
        const hardGroupBox = groupBoxes.find(gb => gb.getAttribute('data-group-type') === 'hard')
        expect(hardGroupBox).toBeDefined()
      }, { timeout: 10000 })
    }, 15000)

    it('hard group has pronounced/harsher border', async () => {
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

      const groupBox = screen.getByTestId('group-box')
      await user.hover(groupBox)

      const makeFolderBtn = await screen.findByTestId('make-folder-action')
      await user.click(makeFolderBtn)
      await user.click(screen.getByTestId('menu-make-folder'))

      await waitFor(() => {
        const groupBox = screen.getByTestId('group-box')
        const groupBoxStyle = window.getComputedStyle(groupBox)
        expect(groupBoxStyle.borderWidth).toBe('3px')
        expect(groupBoxStyle.borderColor).toBe('rgb(0, 0, 139)')
      })
    })

    it('hard group center glow becomes more solid and less opaque', async () => {
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

      const groupBox = screen.getByTestId('group-box')
      await user.hover(groupBox)

      const makeFolderBtn = await screen.findByTestId('make-folder-action')
      await user.click(makeFolderBtn)
      await user.click(screen.getByTestId('menu-make-folder'))

      await waitFor(() => {
        const groupBox = screen.getByTestId('group-box')
        const groupBoxStyle = window.getComputedStyle(groupBox)
        expect(groupBoxStyle.backgroundColor).toBe('rgba(0, 123, 255, 0.8)')
      })
    })
  })

  describe('GRPC-10 hard group', () => {
    it('Make Folder creates new folder in filesystem', async () => {
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

      const groupBox = screen.getByTestId('group-box')
      await user.hover(groupBox)

      await waitFor(() => {
        const makeFolderBtn = screen.queryByTestId('make-folder-action')
        expect(makeFolderBtn).toBeInTheDocument()
      })

      const makeFolderBtn = screen.getByTestId('make-folder-action')
      await user.click(makeFolderBtn)
      await user.click(screen.getByTestId('menu-make-folder'))

      await waitFor(() => {
        const folderSpy = screen.queryByTestId('folder-create-spy')
        expect(folderSpy).toBeInTheDocument()
        expect(folderSpy).toHaveTextContent('folder created')
      }, { timeout: 10000 })
    })

    it('hard group moves member files into new folder', async () => {
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

      const groupBox = screen.getByTestId('group-box')
      await user.hover(groupBox)

      const makeFolderBtn = await screen.findByTestId('make-folder-action')
      await user.click(makeFolderBtn)
      await user.click(screen.getByTestId('menu-make-folder'))

      await waitFor(() => {
        const moveSpy = screen.queryAllByTestId('file-move-spy')
        expect(moveSpy.length).toBe(2)
        expect(moveSpy[0]).toHaveTextContent('Node A moved')
        expect(moveSpy[1]).toHaveTextContent('Node B moved')
      })
    })

    it('hard group creates new blank .md node at top level', async () => {
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

      const groupBox = screen.getByTestId('group-box')
      await user.hover(groupBox)

      const makeFolderBtn = await screen.findByTestId('make-folder-action')
      await user.click(makeFolderBtn)
      await user.click(screen.getByTestId('menu-make-folder'))

      await waitFor(() => {
        const newNodes = screen.getAllByText(/New Group/i)
        expect(newNodes.length).toBeGreaterThan(0)
      })
    })

    it('hard group box+halo persist after graph reload', async () => {
      const user = userEvent.setup()
      const { rerender } = renderCanvas()

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

      const groupBox = screen.getByTestId('group-box')
      await user.hover(groupBox)

      const makeFolderBtn = await screen.findByTestId('make-folder-action')
      await user.click(makeFolderBtn)
      await user.click(screen.getByTestId('menu-make-folder'))

      await waitFor(() => {
        const groupBox = screen.getByTestId('group-box')
        expect(groupBox).toHaveAttribute('data-group-type', 'hard')
      })

      // Sim reload
      rerender(
        <ThemeProvider>
          <CanvasOps initialNodes={mockNodes} initialEdges={mockEdges} />
        </ThemeProvider>
      )

      await waitFor(() => {
        const groupBox = screen.queryByTestId('group-box')
        expect(groupBox).toBeInTheDocument()
        expect(groupBox).toHaveAttribute('data-group-type', 'hard')
      })
    })
  })

  describe('GRPX-01 soft group dual persistence', () => {
    beforeEach(() => {
      localStorage.clear()
      vi.clearAllMocks()
    })

    it('soft group persists to localStorage', async () => {
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

      const localStorageData = localStorage.getItem('softGroups')
      expect(localStorageData).not.toBeNull()
      const groups = JSON.parse(localStorageData!)
      expect(groups).toHaveLength(1)
      expect(groups[0].groupType).toBe('soft')
      expect(groups[0].memberIds).toContain('node-a')
      expect(groups[0].memberIds).toContain('node-b')
      expect(groups[0].memberIds).toContain('node-c')
      expect(groups[0].bounds).toBeDefined()
    })

    it('soft group persists to .whitt folder', async () => {
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

      expect(mockWriteFile).toHaveBeenCalledWith(
        '.whitt/groups.json',
        expect.stringContaining('"groupType"')
      )
      expect(mockWriteFile).toHaveBeenCalledWith(
        '.whitt/groups.json',
        expect.stringContaining('soft')
      )
    })

    it('soft group loads from localStorage on init', async () => {
      const savedGroups = [{
        id: 'group-saved-123',
        memberIds: ['node-a', 'node-b'],
        bounds: { left: 90, top: 90, width: 220, height: 70 },
        isExpanded: false,
        groupType: 'soft' as const
      }]
      localStorage.setItem('softGroups', JSON.stringify(savedGroups))

      renderCanvas()

      await waitFor(() => {
        const groupBox = screen.getByTestId('group-box')
        expect(groupBox).toBeInTheDocument()
        expect(groupBox).toHaveAttribute('data-group-type', 'soft')
      })
    })

    it('soft group loads from .whitt folder on init', async () => {
      const savedGroups = [{
        id: 'group-saved-456',
        memberIds: ['node-c', 'node-d'],
        bounds: { left: 490, top: 290, width: 220, height: 70 },
        isExpanded: false,
        groupType: 'soft' as const
      }]
      mockReadFile.mockResolvedValue(JSON.stringify(savedGroups))

      renderCanvas()

      await waitFor(() => {
        const groupBox = screen.getByTestId('group-box')
        expect(groupBox).toBeInTheDocument()
        expect(groupBox).toHaveAttribute('data-group-type', 'soft')
      })
    })
  })
})
