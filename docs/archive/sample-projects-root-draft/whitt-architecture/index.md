---
id: 313e4567-e89b-12d3-a456-426614174019
title: Whitt System Architecture
parent:
children:
  - graph-ui-slice/index.md
  - execution-engine-slice/index.md
  - queue-orchestration-slice/index.md
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: expanded
focus_jump:
---

# Whitt System Architecture

The Whitt system architecture embodies the philosophy of local-first, autonomous agent orchestration through a three-layer design that separates concerns while maintaining tight integration. At its core, Whitt provides a complete ecosystem for running AI agents locally, from voice-driven interfaces to graph-based workflow management to sophisticated queue orchestration. This architecture prioritizes user control, system transparency, and the ability to function without cloud dependencies.

The three-layer architecture—Graph UI, Execution Engine, and Queue Orchestration—forms a unified system where each layer has clear responsibilities while exposing well-defined interfaces. This separation enables independent development, testing, and evolution of each component while maintaining system coherence. The architecture is designed for extensibility, allowing new capabilities to be added without disrupting existing functionality.

## Architectural Principles

### Local-First Foundation
- **No cloud dependencies**: Core functionality runs entirely locally
- **User data control**: All data stored locally with user control
- **Offline capability**: System functions without internet connectivity
- **Privacy by design**: No data sent to external services without explicit consent

### Autonomous Agent Execution
- **Self-directed workflows**: Agents determine their own execution paths
- **Hook-driven architecture**: 50+ hook triggers for customization
- **State management**: 10-state lifecycle for comprehensive tracking
- **Error recovery**: Sophisticated retry and fallback mechanisms

### Voice and Graph Interface
- **Voice-driven intent**: Natural language commands drive system behavior
- **Graph visualization**: ReactFlow canvas shows agent relationships
- **Fish-eye interaction**: Zoom and pan for complex workflow navigation
- **Real-time feedback**: Live token streaming and state updates

## Three-Layer Architecture

### Layer 1: Graph UI Slice
User-facing interface combining voice input with graph visualization:
- Voice composer for natural language interaction
- ReactFlow canvas for visual workflow management
- Real-time state visualization and updates
- Node inspection and debugging panels

### Layer 2: Execution Engine Slice
Core workflow execution and agent orchestration:
- YAML-based workflow definitions
- 10-state task lifecycle management
- 50+ hook triggers for customization
- Model router for intelligent model selection

### Layer 3: Queue Orchestration Slice
Enterprise-grade task scheduling and resource management:
- Priority-based queue with 25 categories
- 10-state lifecycle management
- Resource allocation and optimization
- Swarm orchestration for multi-machine execution

```yaml
# Example Whitt workflow definition
name: research_workflow
version: "1.0"
triggers:
  - voice: "Research topic and summarize findings"

hooks:
  before_execution:
    - validate_resources
    - notify_dependencies

steps:
  - name: web_search
    model: gpt-4
    tools: [web_browser, search_engine]

  - name: analyze_results
    model: claude-3-opus
    depends_on: [web_search]

  - name: create_summary
    model: gpt-3.5-turbo
    depends_on: [analyze_results]
```

## Integration Patterns

### Inter-Layer Communication
- **Event-driven architecture**: Layers communicate via events
- **Shared state management**: Coordinated state across layers
- **Well-defined APIs**: Clear interfaces between components
- **Error propagation**: Consistent error handling across layers

### Extension Points
- **Custom hooks**: Extend behavior at 50+ trigger points
- **Plugin system**: Add new tools and capabilities
- **Model integration**: Support for multiple LLM providers
- **Workflow templates**: Reusable workflow patterns

## System Properties

### Scalability
- **Horizontal scaling**: Add machines for swarm execution
- **Vertical scaling**: Optimize resource allocation per task
- **Queue management**: Efficient task scheduling and prioritization
- **Resource optimization**: Dynamic resource allocation

### Reliability
- **State persistence**: All state persisted locally
- **Error recovery**: Automatic retry and fallback mechanisms
- **Monitoring**: Comprehensive logging and metrics
- **Fault tolerance**: Graceful degradation under failure

### Observability
- **Token streaming**: Real-time LLM output visibility
- **State tracking**: Complete lifecycle tracking for all tasks
- **Performance metrics**: Detailed performance monitoring
- **Debugging tools**: Comprehensive debugging and inspection

## Architecture Evolution

The three-layer architecture is designed for evolution:
- **Independent layer development**: Each layer can evolve independently
- **Interface stability**: Stable interfaces between layers
- **Backward compatibility**: New versions maintain compatibility
- **Incremental enhancement**: Add capabilities without disrupting existing functionality

This architecture provides a solid foundation for local-first AI agent orchestration while maintaining flexibility for future growth and adaptation.

> The three-layer architecture balances separation of concerns with system integration, enabling both focused development and cohesive user experience.