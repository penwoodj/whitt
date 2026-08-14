---
id: 413e4567-e89b-12d3-a456-426614174020
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

The Graph UI Slice represents the user-facing layer of the Whitt architecture, combining voice-driven natural language interaction with graph-based workflow visualization. This slice transforms the complexity of agent orchestration into an intuitive interface where users can speak their intent and watch as agents execute workflows on an interactive canvas. The design emphasizes transparency, control, and real-time feedback.

The slice is built on React for the UI framework, ReactFlow for graph visualization, and Web Speech API for voice input. This technology stack was chosen for its maturity, ecosystem support, and alignment with local-first principles. The Graph UI communicates with the Execution Engine and Queue Orchestration slices through well-defined event interfaces, maintaining separation of concerns while enabling tight integration.

## Core Components

### Voice Composer
Natural language interface for intent declaration and interaction:
- **Speech recognition**: Local Web Speech API integration
- **Intent parsing**: Convert voice commands to workflow triggers
- **Feedback loop**: Real-time confirmation and clarification
- **Command history**: Track and replay voice interactions

### ReactFlow Canvas
Interactive graph visualization for workflow management:
- **Node representation**: Visual display of agents and workflows
- **Edge connections**: Show relationships and dependencies
- **Real-time updates**: Live state changes and token streaming
- **Interactive manipulation**: Drag, drop, and connect components

### Node Inspection
Detailed views into agent behavior and state:
- **Token streaming**: Live LLM output display
- **State visualization**: 10-state lifecycle representation
- **Hook triggers**: Show active and available hooks
- **Debugging tools**: Step-through and inspection capabilities

## User Experience Design

### Voice-First Interaction
Users primarily interact with Whitt through voice commands:
- **Intent declaration**: "Research the latest AI developments"
- **Workflow control**: "Pause the current analysis"
- **State queries**: "What's the status of my research task?"
- **System commands**: "Show me all running workflows"

### Graph Navigation
The canvas provides spatial understanding of complex workflows:
- **Zoom and pan**: Navigate large workflow graphs
- **Fish-eye view**: Focus on relevant areas while maintaining context
- **Collapsible nodes**: Expand/collapse for detail management
- **Real-time animation**: Watch workflows execute live

### Visual Feedback
Every action produces immediate visual feedback:
- **State colors**: Color-coded nodes indicate current state
- **Progress indicators**: Show completion percentage
- **Token streaming**: Real-time text generation display
- **Error highlighting**: Visual indication of failures

## Technical Architecture

```typescript
// Graph UI component structure
interface GraphUISlice {
  voiceComposer: VoiceComposer;
  reactFlowCanvas: ReactFlowCanvas;
  nodeInspector: NodeInspector;
  stateManager: StateManager;

  // Event handling
  onVoiceCommand: (command: VoiceCommand) => void;
  onNodeSelect: (nodeId: string) => void;
  onStateChange: (state: NodeState) => void;
  onTokenStream: (tokens: string) => void;
}

// Voice command processing
function processVoiceCommand(command: string): WorkflowTrigger {
  const intent = parseIntent(command);
  const parameters = extractParameters(command);
  const workflow = matchWorkflow(intent);

  return {
    workflow,
    parameters,
    source: 'voice',
    timestamp: Date.now()
  };
}
```

## Integration Patterns

### Event-Driven Communication
The Graph UI communicates with other layers through events:
- **Command events**: Voice commands to Execution Engine
- **State events**: Status updates from Queue Orchestration
- **Token events**: Streaming content from agents
- **Error events**: Failure notifications and recovery

### State Management
Coordinated state across UI components:
- **Global state**: Application-wide state and settings
- **Node state**: Individual agent and workflow states
- **Canvas state**: Viewport, selection, and interaction state
- **User preferences**: Customization and personalization

## Performance Considerations

### Rendering Optimization
- **Virtual scrolling**: Handle large workflow graphs efficiently
- **Lazy loading**: Load node details on demand
- **Memoization**: Cache expensive computations
- **Request animation frame**: Smooth visual updates

### Resource Management
- **Memory limits**: Prevent memory bloat with large graphs
- **Cleanup strategies**: Remove unused nodes and data
- **Connection pooling**: Efficient communication with backend
- **Debouncing**: Optimize frequent state updates

The Graph UI Slice transforms complex agent orchestration into an intuitive, voice-driven experience while maintaining the power and flexibility needed for sophisticated workflows.

> The Graph UI proves that powerful systems don't need complex interfaces—voice and graph visualization provide natural interaction paradigms for agent orchestration.