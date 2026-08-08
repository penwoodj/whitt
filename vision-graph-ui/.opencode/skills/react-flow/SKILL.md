---
name: react-flow
description: >
  React Flow v12 (now "@xyflow/react") for workflow DAG visualization. Ideal for MVP graph UI with
  ~1k nodes, pan/zoom, custom node types, edge types, handles. Use when building interactive workflow
  editors, node-based interfaces, or graph visualizations requiring React component composition.
---

## When to Use React Flow

Use React Flow for the Whitt graph UI MVP when:
- Building the primary workflow DAG visualization (workflow nodes, task nodes, hook edges)
- Node count: 10-1,000 nodes (performance ceiling)
- Need React component composition for custom nodes
- Require pan/zoom/fitBounds out-of-the-box
- Want controlled state via `useNodesState`/`useEdgesState` hooks
- Need MiniMap, Controls, Background built-in

**VS other libraries:**
- **D3.js**: Use for custom layouts or non-React DOM rendering
- **Pixi.js**: Use for WebGL performance at 100k+ nodes (fish-eye zoom)
- **Cytoscape.js**: Use for graph-theory algorithms or force-directed layouts at scale

## Installation

```bash
npm install @xyflow/react
```

For TypeScript (already in this project):
```bash
npm install -D @types/react
```

## Minimal Example (20 lines)

```tsx
import { ReactFlow, Background, Controls, useNodesState, useEdgesState } from '@xyflow/react';

const initialNodes = [{ id: '1', position: { x: 0, y: 0 }, data: { label: 'Task' } }];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function WorkflowGraph() {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView />
      <Background />
      <Controls />
    </div>
  );
}
```

## Core Concepts (React Flow v12)

- **Controlled vs Uncontrolled**: Use `useNodesState`/`useEdgesState` for controlled state (recommended). Uncontrolled via `onNodesChange`/`onEdgesChange` for performance.
- **Node Types**: Custom components registered via `nodeTypes` prop. Must be memoized (`useMemo`) to avoid re-renders.
- **Edge Types**: Custom edges for different relationship types (`enqueued-by`, `depends-on`, `produced`).
- **Handles**: Connection points on nodes (`Handle` component). Position: `Position.Left`, `Position.Right`, `Position.Top`, `Position.Bottom`.
- **PanZoom**: Built-in. Use `panOnScroll`, `zoomOnScroll`, `panOnDrag`. Access via `useReactFlow` hook for programmatic control.
- **fitBounds**: Auto-zoom to fit all nodes or specific subset. Critical for "show me today's failures" voice commands.
- **MiniMap**: Overview of entire graph. Shows node colors, edge types. Configure `nodeStrokeColor`, `maskColor`.
- **React 19 Compat**: `@xyflow/react` supports React 19. No migration needed from React 18.

## Whitt-Specific Patterns

### Mapping Whitt Concepts to React Flow

| Whitt Concept | React Flow Implementation |
|---------------|---------------------------|
| Workflow | `Group` node or subgraph |
| Task | Custom `TaskNode` with status color, icon, token count |
| Hook | Animated edge with pulse effect |
| Swarm Peer | Constellation node (cluster view) |
| Artifact | File node with type icon |
| Schedule | Clock node with time indicator |
| Queue Region | Background zone or `Group` node |
| Fish-Eye Zoom | `zoomOnScroll` + custom `getTransform` + node sizing based on `viewport.zoom` |

### Task Node Template

```tsx
import { Handle, Position, NodeProps } from '@xyflow/react';

interface TaskData {
  id: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  tokens: number;
  model: string;
  hooks: string[];
}

export default function TaskNode({ data }: NodeProps<TaskData>) {
  const statusColor = {
    PENDING: '#gray',
    RUNNING: '#blue',
    SUCCESS: '#green',
    FAILED: '#red',
  }[data.status];

  return (
    <div style={{ border: `2px solid ${statusColor}`, padding: 8, borderRadius: 4 }}>
      <Handle type="target" position={Position.Top} />
      <div>{data.id}</div>
      <div>{data.status}</div>
      <div>{data.tokens} tokens</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
```

### Edge Types for Whitt

- `enqueued-by`: Dashed line, gray
- `depends-on`: Solid line, blue
- `produced`: Solid line, green
- `routed-to`: Animated line, purple
- `running-on`: Dotted line, orange

### Neo4j Integration

Map Cypher query results to React Flow nodes/edges:

```tsx
function mapCypherToReactFlow(cypherResult: any[]) {
  const nodes = cypherResult.map((row, i) => ({
    id: row.n.id,
    type: 'task',
    position: { x: i * 200, y: 0 },
    data: { label: row.n.name, status: row.n.status },
  }));

  const edges = cypherResult
    .filter(row => row.r)
    .map(row => ({
      id: `${row.r.startElementId}-${row.r.endElementId}`,
      source: row.r.startElementId,
      target: row.r.endElementId,
      type: 'animated',
      animated: row.r.type === 'depends-on',
    }));

  return { nodes, edges };
}
```

## Performance Ceiling

- **10-100 nodes**: Instant, 60fps
- **100-1,000 nodes**: Good performance, may lag on complex custom nodes
- **1,000-10,000 nodes**: Not recommended. Switch to Pixi.js for WebGL
- **Memory**: ~10KB per node (including React component overhead)

## Fish-Eye / Zoom Patterns

### Basic Fish-Eye Effect

```tsx
import { useReactFlow } from '@xyflow/react';

function FishEyeNode({ data, selected }: NodeProps) {
  const { getViewport } = useReactFlow();
  const { zoom } = getViewport();

  const isExpanded = zoom > 1.2;

  return (
    <div style={{
      transform: `scale(${isExpanded ? 1.2 : 1})`,
      transition: 'transform 0.2s',
    }}>
      {isExpanded ? (
        <>
          <div>{data.label}</div>
          <div>{data.tokens} tokens</div>
          <div>{data.hooks.join(', ')}</div>
        </>
      ) : (
        <div>{data.status}</div>
      )}
    </div>
  );
}
```

### Voice Command Integration

```tsx
function useVoiceCommands() {
  const { fitBounds, setNodes, setEdges } = useReactFlow();

  const handleVoiceCommand = (command: string) => {
    if (command.includes('show failures')) {
      const failedNodes = nodes.filter(n => n.data.status === 'FAILED');
      fitBounds({ nodes: failedNodes, padding: 0.2 });
    }
    if (command.includes('zoom to workflow')) {
      const workflowNodes = nodes.filter(n => n.data.type === 'workflow');
      fitBounds({ nodes: workflowNodes, padding: 0.1 });
    }
  };

  return { handleVoiceCommand };
}
```

## Anti-Patterns

1. **NOT mutating nodes/edges directly**: Always use `setNodes`/`setEdges` or `onNodesChange`/`onEdgesChange`. Direct mutation breaks React Flow's internal state.

2. **NOT skipping `nodeTypes` memoization**: Forgetting `useMemo` for custom node types causes all nodes to re-render on every state change.

3. **NOT using `key` prop on dynamic nodes**: When adding/removing nodes dynamically, ensure stable `id` values as keys.

4. **NOT ignoring `onNodesChange`/`onEdgesChange`**: Even in controlled mode, handle these callbacks for drag/resize/select events.

5. **NOT creating new node type functions on every render**: Define node type components outside the parent component or memoize them.

## Common Gotchas

- **React 19**: No breaking changes from React Flow v12. `@xyflow/react` is the new package name (was `reactflow`).
- **TypeScript**: Ensure `@types/react` is installed. Node data interfaces must extend `NodeData`.
- **CSS**: React Flow uses inline styles by default. Override with CSS classes via `className` prop on nodes/edges.
- **Performance**: For 500+ nodes, use `nodeDragThreshold` to prevent accidental drags, and `nodesDraggable`/`nodesConnectable` to limit interactions.

Last updated: 2026-08-08
