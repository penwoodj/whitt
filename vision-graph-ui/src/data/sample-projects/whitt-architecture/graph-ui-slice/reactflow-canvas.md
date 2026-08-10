---
id: e3f4a5b6-c7d8-9012-6789-123456789012
title: ReactFlow Canvas
parent: ./index.md
children:
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: done
focus_jump:
---

# ReactFlow Canvas

ReactFlow provides the foundation for Whitt's infinite graph canvas, handling node rendering, edge connections, and user interactions.

## Canvas Setup

### Basic Configuration
Initialize ReactFlow with custom settings:
```typescript
import { ReactFlow, Background, Controls, MiniMap } from 'reactflow'
import 'reactflow/dist/style.css'

const GraphCanvas = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={handleNodesChange}
      onEdgesChange={handleEdgesChange}
      nodeTypes={customNodeTypes}
      edgeTypes={customEdgeTypes}
      defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
      minZoom={0.1}
      maxZoom={4}
      fitView
    >
      <Background color="#A6A6A6" gap={20} />
      <Controls />
      <MiniMap />
    </ReactFlow>
  )
}
```

### Custom Node Types
Register custom node components:
```typescript
const nodeTypes = {
  'voice': VoiceNode,
  'task': TaskNode,
  'workflow': WorkflowNode,
  'artifact': ArtifactNode,
  'peer': PeerNode
}

const customNodeTypes = Object.keys(nodeTypes).reduce((acc, type) => {
  acc[type] = (props) => {
    const Component = nodeTypes[type]
    return <Component {...props} />
  }
  return acc
}, {})
```

## Fish-Eye Implementation

### Distance-Based Rendering
Render nodes based on cursor proximity:
```typescript
const FishEyeNode = ({ data, selected }: NodeProps) => {
  const [distance, setDistance] = useState<number>(Infinity)
  const canvasRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return
      
      const rect = canvasRef.current.getBoundingClientRect()
      const nodeCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      }
      
      const dist = Math.sqrt(
        Math.pow(e.clientX - nodeCenter.x, 2) +
        Math.pow(e.clientY - nodeCenter.y, 2)
      )
      
      setDistance(dist)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  const renderLevel = getRenderLevel(distance)
  return <NodeContent data={data} level={renderLevel} selected={selected} />
}

function getRenderLevel(distance: number): 'distant' | 'mid' | 'near' | 'focused' {
  if (distance < 100) return 'focused'
  if (distance < 300) return 'near'
  if (distance < 600) return 'mid'
  return 'distant'
}
```

### Level-Based Components
Different rendering per distance:
```typescript
const NodeContent = ({ data, level, selected }: NodeContentProps) => {
  switch (level) {
    case 'distant':
      return <DistantChip data={data} />
    case 'mid':
      return <MidRangeCard data={data} />
    case 'near':
      return <NearInspector data={data} />
    case 'focused':
      return <FocusedEditor data={data} selected={selected} />
  }
}
```

## Spatial Navigation

### Pan and Zoom
Implement infinite canvas navigation:
```typescript
const usePanZoom = () => {
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 })
  
  const pan = (dx: number, dy: number) => {
    setViewport(prev => ({
      ...prev,
      x: prev.x + dx,
      y: prev.y + dy
    }))
  }
  
  const zoom = (factor: number, centerX: number, centerY: number) => {
    setViewport(prev => {
      const newZoom = Math.min(Math.max(prev.zoom * factor, 0.1), 4)
      const newX = centerX - (centerX - prev.x) * (newZoom / prev.zoom)
      const newY = centerY - (centerY - prev.y) * (newZoom / prev.zoom)
      return { x: newX, y: newY, zoom: newZoom }
    })
  }
  
  return { viewport, pan, zoom }
}
```

### Focus Navigation
Jump to specific nodes:
```typescript
const focusOnNode = (nodeId: string) => {
  const node = nodes.find(n => n.id === nodeId)
  if (!node) return
  
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  
  setViewport({
    x: centerX - node.position.x * viewport.zoom,
    y: centerY - node.position.y * viewport.zoom,
    zoom: 1
  })
}
```

## Performance Optimization

### Virtual Rendering
Render only visible nodes:
```typescript
const useVisibleNodes = (nodes: Node[], viewport: Viewport) => {
  return useMemo(() => {
    const visibleBounds = {
      left: -viewport.x / viewport.zoom,
      top: -viewport.y / viewport.zoom,
      right: (-viewport.x + window.innerWidth) / viewport.zoom,
      bottom: (-viewport.y + window.innerHeight) / viewport.zoom
    }
    
    return nodes.filter(node => {
      const nodeRight = node.position.x + 300 // Approximate node width
      const nodeBottom = node.position.y + 200 // Approximate node height
      
      return (
        node.position.x < visibleBounds.right &&
        nodeRight > visibleBounds.left &&
        node.position.y < visibleBounds.bottom &&
        nodeBottom > visibleBounds.top
      )
    })
  }, [nodes, viewport])
}
```

### Memoization
Prevent unnecessary re-renders:
```typescript
const DistantChip = React.memo(({ data }: { data: NodeData }) => {
  return (
    <div className="distant-chip">
      <StatusBadge status={data.status} />
      <span>{data.title}</span>
    </div>
  )
}, (prev, next) => {
  return prev.data.status === next.data.status &&
         prev.data.title === next.data.title
})
```

ReactFlow Canvas provides the foundation for Whitt's infinite, fish-eye graph interface, enabling intuitive navigation and interaction with complex agentic workflows.