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
  parameters: {
    a11y: { test: 'error' },
  },
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
  name: 'slice10 -- GRP-01 multi-select',
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
  name: 'slice10 -- GRP-02 selection surround',
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
  name: 'slice10 -- GRPC-06 selection model - click',
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
  name: 'slice10 -- GRPC-06 selection model - ctrl+click',
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
  name: 'slice10 -- GRPC-06 selection model - lasso',
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
  name: 'slice10 -- GRPC-06 selection model - clear',
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
  name: 'slice10 -- GRP-03 right-click box',
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
  name: 'slice10 -- GRP-09 group prompt context',
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
  name: 'slice10 -- GRP-10 group node-like',
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
  name: 'slice10 -- GRPC-05 edge delete',
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
  name: 'slice10 -- GRP-04 connected pull',
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
  name: 'slice10 -- GRPC-01 click vs drag',
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
  name: 'slice10 -- GRPC-02 esc cancels drag',
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
  name: 'slice10 -- GRPC-08 multi-drag coherence',
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
  name: 'slice10 -- GRPC-09 reheat settle',
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
  name: 'slice10 -- GRPC-07 delete guard',
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
  name: 'slice10 -- GRP-05 standalone node',
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
  name: 'slice10 -- GRP-07 soft vs hard grouping',
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
  name: 'slice10 -- GRPC-10 hard group',
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

export const GRPX_01_SoftGroupDualPersistence: Story = {
  name: 'slice10 -- GRPX-01 soft group dual persistence',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Create soft group by multi-selecting 3+ nodes and right-clicking. Group persists to localStorage AND .whitt/groups.json in closest parent folder. On page reload, groups restore from both sources automatically.',
      },
    },
  },
}

export const GRPX_02_LeftClickPanVsRightClickLasso: Story = {
  name: 'slice10 -- GRPX-02 left-click pan vs right-click lasso',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Left-click and drag on empty canvas to pan (move) the viewport. Right-click and drag on empty canvas to create lasso selection box that encloses nodes. Left-click on node selects it, right-click on selected nodes creates group.',
      },
    },
  },
}

export const GRPX_03_SelectionHaloIconOutsideBorder: Story = {
  name: 'slice10 -- GRPX-03 selection halo + icon outside border',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Multi-select 3+ nodes, then right-click to create group. Selection halo border surrounds all selected nodes with dashed border. + icon appears in upper-right corner OUTSIDE of halo border on hover/click. Icon has blue border and white background.',
      },
    },
  },
}

export const GRPX_04_PlusIconTooltipMenuActions: Story = {
  name: 'slice10 -- GRPX-04 + icon tooltip menu actions',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Hover or click the + icon on a group to see tooltip menu with actions. Menu includes "Make Folder" to promote group to hard, "Speak to Selected" for voice interaction, and other selection actions. Menu appears with smooth fade-in animation.',
      },
    },
  },
}

export const GRPX_05_MakeFolderVisualTransformation: Story = {
  name: 'slice10 -- GRPX-05 Make Folder visual transformation',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Create soft group, hover to show + icon, click to open menu, select "Make Folder". Group border transforms from 2px dashed (soft) to 3px solid (hard). Background changes from transparent to semi-transparent blue. Center glow becomes more solid and less opaque.',
      },
    },
  },
}

export const GRPX_06_MakeFolderFileSystemAction: Story = {
  name: 'slice10 -- GRPX-06 Make Folder file system action',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Invoke "Make Folder" on soft group. New folder created in filesystem, member files moved into folder, new blank .md node created at top level with selection. Group becomes hard (folder-based) with persistent box+halo. FS actions visible via spy divs.',
      },
    },
  },
}

export const GRPX_07_GroupDetailPanelWithFullGraphView: Story = {
  name: 'slice10 -- GRPX-07 group detail panel with full graph view',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Create soft group, hover to show + icon, click menu, select "Speak to Selected". Group detail panel opens with first section = full-size graph view of group contents. Member nodes and edges visible in full-size graph. Panel shows member list below.',
      },
    },
  },
}

export const GRPX_08_UnfocusedGroupBubbleHaloMiniWindow: Story = {
  name: 'slice10 -- GRPX-08 unfocused group bubble + halo + mini-window',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Create soft group, then unfocus it (click outside). Group appears as bubble of light with group halo border surrounding it. Inner graph displays zoomed-out view inside node in mini-window. Node is reasonably sized (bigger than average node) but shows subgraph of information.',
      },
    },
  },
}

export const GRPX_09_EditableDeterministicGroupTitles: Story = {
  name: 'slice10 -- GRPX-09 editable deterministic group titles',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Create soft group by selecting 2+ nodes (ctrl+click) and right-clicking. Click on group title (above group box) to edit. Type title like "My Custom Group" and press Enter. Title converts to dash-case lowercase ("my-custom-group") and persists to localStorage and .whitt folder. For hard groups, title update also renames the folder. Title persists across page reloads.',
      },
    },
  },
}

export const GRPX_10_DebouncedFileSystemReflection: Story = {
  name: 'slice10 -- GRPX-10 debounced file system reflection',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Create and modify groups. Notice that localStorage updates immediately for fast UI response, while file system operations are debounced by 2 seconds (ADR-0011). Multiple rapid changes within the debounce window batch into a single file system sync. Live active memory in localStorage provides speed while FS reflection happens on debounce. Changes persist across page reloads from live memory.',
      },
    },
  },
}

export const GRPX_11_DoubleRightClickExpandGroup: Story = {
  name: 'slice10 -- GRPX-11 double-right-click expand group',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Create soft group by selecting 2+ nodes (ctrl+click) and right-clicking. Double-right-click on the group box to expand it and show the group detail panel. Speech-to-text recording is NOT started (reserved gesture). Works whether node is expanded or collapsed.',
      },
    },
  },
}

export const GRPX_12_DoubleLeftClickExpandAndRecord: Story = {
  name: 'slice10 -- GRPX-12 double-left-click expand + record',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Create soft group by selecting 2+ nodes (ctrl+click) and right-clicking. Double-left-click on the group box to expand it and start speech-to-text recording. Red "🎤 Recording..." tooltip appears in upper right-hand corner around the node. Works whether node is expanded or collapsed. Recording continues until manually stopped or group is deselected.',
      },
    },
  },
}

export const GRPX_13_FlattenFolderAction: Story = {
  name: 'slice10 -- GRPX-13 Flatten Folder action',
  args: {
    initialNodes: mockNodes,
    initialEdges: mockEdges,
  },
  parameters: {
    docs: {
      description: {
        story: 'Create hard group by clicking "Make Folder" in the + icon menu. Hover over group to see + icon, click to open menu. Click "Flatten Folder" action. Folder structure removed, all member files moved to parent level, group converted back to soft group (halo + border persist). If group has only one member, group dissolves completely.',
      },
    },
  },
}
