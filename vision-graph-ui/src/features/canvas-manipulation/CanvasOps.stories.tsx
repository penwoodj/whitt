import type { Meta, StoryObj } from '@storybook/react'
import { CanvasOps } from './CanvasOps'
import { ThemeProvider } from '../../shared/ThemeProvider'
import type { Node as FlowNode, Edge } from '@xyflow/react'

const meta: Meta<typeof CanvasOps> = {
  title: 'Slice10/Canvas Ops',
  component: CanvasOps,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ width: '800px', height: '600px' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof CanvasOps>

const mockNodes: FlowNode[] = [
  { id: 'node-a', position: { x: 100, y: 100 }, data: { title: 'Node A' } },
  { id: 'node-b', position: { x: 300, y: 100 }, data: { title: 'Node B' } },
  { id: 'node-c', position: { x: 500, y: 100 }, data: { title: 'Node C' } },
  { id: 'node-d', position: { x: 100, y: 300 }, data: { title: 'Node D' } },
  { id: 'node-e', position: { x: 300, y: 300 }, data: { title: 'Node E' } },
  { id: 'node-f', position: { x: 500, y: 300 }, data: { title: 'Node F' } },
]

const mockEdges: Edge[] = []

export const GRP_01_MultiSelect: Story = {
  name: 'GRP-01 multi-select',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Ctrl+click 3 nodes to select them. Drag any selected node to move all selected nodes together.',
      },
    },
  },
}

export const GRP_02_SelectionSurround: Story = {
  name: 'GRP-02 selection surround',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Multi-select nodes to see selection halo box drawn around bounds of all selected nodes.',
      },
    },
  },
}

export const GRPC_06_SelectionModel_Click: Story = {
  name: 'GRPC-06 selection model - click',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Click node to select (replaces previous selection). Click different node to replace selection.',
      },
    },
  },
}

export const GRPC_06_SelectionModel_CtrlClick: Story = {
  name: 'GRPC-06 selection model - ctrl+click',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Ctrl+click nodes to toggle selection (additive). Ctrl+click selected node again to deselect.',
      },
    },
  },
}

export const GRPC_06_SelectionModel_Lasso: Story = {
  name: 'GRPC-06 selection model - lasso',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Right-click and drag on empty canvas to create lasso selection box. Nodes enclosed in box become selected.',
      },
    },
  },
}

export const GRPC_06_SelectionModel_Clear: Story = {
  name: 'GRPC-06 selection model - clear',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Click on empty canvas to clear all selections and hide selection halo.',
      },
    },
  },
}
