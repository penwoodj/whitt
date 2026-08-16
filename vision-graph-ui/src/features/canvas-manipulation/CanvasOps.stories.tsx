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

export const GRP_03_RightClickBox: Story = {
  name: 'GRP-03 right-click box',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Multi-select 2+ nodes, then right-click on selection to create group box around selected nodes.',
      },
    },
  },
}

export const GRP_09_GroupPromptContext: Story = {
  name: 'GRP-09 group prompt context',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Create a group, then hover over it to see STT tooltip at group side with member count and refs.',
      },
    },
  },
}

export const GRP_10_GroupNodeLike: Story = {
  name: 'GRP-10 group node-like',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Double-click on group box to open it as unit with expansion surface showing group contents.',
      },
    },
  },
}

const mockEdgesWithConnection: Edge[] = [
  { id: 'edge-a-b', source: 'node-a', target: 'node-b' },
  { id: 'edge-b-c', source: 'node-b', target: 'node-c' },
]

export const GRPC_05_EdgeDelete: Story = {
  name: 'GRPC-05 edge delete',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdgesWithConnection,
  },
  parameters: {
    docs: {
      description: {
        story: 'Hover over edge to see delete button (X) at midpoint. Click X to remove edge. Select edge and press Delete/Backspace to remove.',
      },
    },
  },
}

const mockNodesWithEdges: FlowNode[] = [
  { id: 'node-a', position: { x: 100, y: 100 }, data: { title: 'Node A' } },
  { id: 'node-b', position: { x: 300, y: 100 }, data: { title: 'Node B' } },
]

const mockEdgesSingle: Edge[] = [
  { id: 'edge-a-b', source: 'node-a', target: 'node-b' },
]

export const GRP_04_ConnectedPull: Story = {
  name: 'GRP-04 connected pull',
  args: {
    initialNodes: mockNodesWithEdges,
    initialEdges: mockEdgesSingle,
  },
  parameters: {
    docs: {
      description: {
        story: 'Node A connected to Node B via edge. Drag Node A and observe Node B following the movement. Edge stays connected.',
      },
    },
  },
}

export const GRPC_01_ClickVsDrag: Story = {
  name: 'GRPC-01 click vs drag',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Click node without moving mouse: node becomes selected, position unchanged. Drag node >4px: node moves to new position, not selected.',
      },
    },
  },
}

export const GRPC_02_EscCancelsDrag: Story = {
  name: 'GRPC-02 esc cancels drag',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Start dragging node, then press ESC. Drag operation cancelled, node returns to original position.',
      },
    },
  },
}

const mockNodesMulti: FlowNode[] = [
  { id: 'node-a', position: { x: 100, y: 100 }, data: { title: 'Node A' } },
  { id: 'node-b', position: { x: 300, y: 100 }, data: { title: 'Node B' } },
  { id: 'node-c', position: { x: 200, y: 250 }, data: { title: 'Node C' } },
]

const mockEdgesMulti: Edge[] = [
  { id: 'edge-a-b', source: 'node-a', target: 'node-b' },
  { id: 'edge-b-c', source: 'node-b', target: 'node-c' },
]

export const GRPC_08_MultiDragCoherence: Story = {
  name: 'GRPC-08 multi-drag coherence',
  args: {
    initialNodes: mockNodesMulti,
    initialEdges: mockEdgesMulti,
  },
  parameters: {
    docs: {
      description: {
        story: 'Multi-select nodes A, B, C. Drag any selected node and observe all selected nodes moving together. Relative positions preserved.',
      },
    },
  },
}

const mockNodesPhysics: FlowNode[] = [
  { id: 'node-a', position: { x: 50, y: 50 }, data: { title: 'Node A' } },
  { id: 'node-b', position: { x: 750, y: 50 }, data: { title: 'Node B' } },
  { id: 'node-c', position: { x: 50, y: 550 }, data: { title: 'Node C' } },
  { id: 'node-d', position: { x: 750, y: 550 }, data: { title: 'Node D' } },
]

export const GRPC_09_ReheatSettle: Story = {
  name: 'GRPC-09 reheat settle',
  args: {
    initialNodes: mockNodesPhysics,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Nodes scattered at edges. Observe physics simulation: gentle center pull, collision avoidance, velocity decay. Drag any node to reheat simulation. Auto-sleep when stable.',
      },
    },
  },
}

export const GRPC_07_DeleteGuard: Story = {
  name: 'GRPC-07 delete guard',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Select one or more nodes, then press Delete or Backspace. A confirmation dialog appears asking "Delete N nodes?". Click Cancel to keep nodes, or Delete to remove them.',
      },
    },
  },
}

export const GRP_05_StandaloneNode: Story = {
  name: 'GRP-05 standalone node',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Click "+ New Node" button in top-right corner. A new unconnected node appears with title "New Node". It can be dragged freely and has no edges.',
      },
    },
  },
}

export const GRP_07_SoftVsHardGrouping: Story = {
  name: 'GRP-07 soft vs hard grouping',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Multi-select nodes, then right-click to create soft group with dashed border. Hover over group to see "+ Make Folder" button. Click it to promote to hard group with solid 3px border and darker background.',
      },
    },
  },
}

export const GRPC_10_HardGroup: Story = {
  name: 'GRPC-10 hard group',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Create soft group, then click "+ Make Folder" button. New folder created in filesystem, member files moved into it, and group box+halo persist after graph reload. Hard group has pronounced border and solid background.',
      },
    },
  },
}
