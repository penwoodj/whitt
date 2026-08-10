---
id: c1d2e3f4-a5b6-7890-4567-901234567890
title: Graph UI Slice
parent: ../index.md
children:
  - voice-composer.md
  - reactflow-canvas.md
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: expanded
focus_jump:
---

# Graph UI Slice

The Graph UI slice provides the primary interface for Whitt, featuring voice-driven interaction with an infinite, fish-eye graph canvas.

## Voice-Driven Interaction

### Voice Composer
Natural language input for workflow creation:
- **Speech Recognition**: Local Whisper STT integration
- **Intent Understanding**: Parse natural language into structured commands
- **Voice Commands**: "Create new workflow", "Show failures", "Deploy to Pi"
- **Real-time Feedback**: Visual confirmation of voice commands

### Voice-to-Graph Mapping
Transforming voice into graph elements:
```typescript
interface VoiceCommand {
  intent: 'create' | 'navigate' | 'modify' | 'deploy'
  entities: {
    workflow?: string
    task?: string
    target?: string
  }
  context: {
    currentNode?: string
    selection?: string[]
  }
}

function voiceToGraph(command: VoiceCommand): GraphAction {
  // Transform voice command into graph manipulation
  switch (command.intent) {
    case 'create':
      return createWorkflowNode(command.entities.workflow)
    case 'navigate':
      return navigateToNode(command.entities.target)
    // ... other cases
  }
}
```

## Infinite Canvas

### ReactFlow Integration
Graph visualization and interaction:
```typescript
import { ReactFlow, Background, Controls } from 'reactflow'

const GraphCanvas = () => {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={handleNodesChange}
      onEdgesChange={handleEdgesChange}
      defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
      minZoom={0.1}
      maxZoom={4}
    >
      <Background />
      <Controls />
    </ReactFlow>
  )
}
```

### Fish-Eye Representation
Distance-based node rendering:
- **Distant Nodes**: Summary chips (status + icon)
- **Mid-Range Nodes**: Cards (title + status + last event)
- **Near Nodes**: Full inspectors (live token streams, hook events)
- **Focused Nodes**: Inline editors (YAML with schema linting)

### Spatial Navigation
Infinite pan and zoom:
- **Pan**: Drag canvas to navigate
- **Zoom**: Mouse wheel to zoom in/out
- **Focus**: Double-click to center on node
- **Mini-map**: Overview of entire graph

## Node Lifecycle

### State Transitions
Sphere-to-square morph with 3 states:
1. **Collapsed**: Minimized box (title + state badge)
2. **Hovered**: Expanded box (composer visible, border subtle)
3. **Expanded**: Focused box (border active, box-shadow md)

### Morph Animations
240ms ease transitions:
```typescript
const NodeBox = styled.div<{ $state: NodeViewState }>`
  transition: all 240ms ease;
  min-width: ${props => props.$state === 'collapsed' ? '120px' : '320px'};
  border-color: ${props => props.$state === 'expanded' 
    ? props.theme.colors.borderActive 
    : props.theme.colors.border};
`
```

### Details Panel
Post-completion content display:
- **Lifecycle Gate**: Only shows when lifecycle='done'
- **No Dropdown**: Always visible on hover/focus
- **Markdown Rendering**: React-markdown for rich content
- **Full Width**: Takes full width of expanded node

## Component Architecture

### Feature Slices
Vertical slice organization:
```
src/features/
├── graph-sim/           # Graph simulation and state
├── node/                # Node components and lifecycle
├── voice-composer/      # Voice input and processing
├── project-picker/      # Project selection
└── agentic-todo-cycle/  # Todo cycling animation
```

### Shared Components
Common UI elements:
```
src/shared/
├── theme.ts             # Dark theme tokens
├── logger.ts            # Centralized logging
├── Provider.tsx         # Theme provider
└── types.ts             # Shared TypeScript types
```

The Graph UI slice provides the primary interface for Whitt, combining voice interaction with visual graph manipulation for an intuitive, powerful user experience.