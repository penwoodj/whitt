---
id: 713e4567-e89b-12d3-a456-426614174023
title: Execution Engine Slice
parent: ../index.md
children:
  - yaml-workflows.md
  - hooks-system.md
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: expanded
focus_jump:
---

# Execution Engine Slice

The Execution Engine Slice forms the computational core of the Whitt architecture, transforming declarative workflow definitions into autonomous agent execution. This slice interprets YAML-based workflow specifications, manages the 10-state task lifecycle, and coordinates the 50+ hook triggers that enable customization and observability. The engine is designed for reliability, flexibility, and transparent operation.

Built with a focus on local-first principles, the Execution Engine runs entirely on user hardware, communicating with local LLM instances through standardized interfaces. The engine maintains complete state persistence, enables crash recovery, and provides comprehensive logging and debugging capabilities. This design ensures users have full control over their agent workflows while benefiting from sophisticated orchestration capabilities.

## Core Responsibilities

### Workflow Execution
- **YAML parsing**: Interpret workflow definitions
- **Dependency resolution**: Determine execution order
- **State management**: Track task states and transitions
- **Error handling**: Comprehensive error recovery

### Model Integration
- **Model router**: Intelligent model selection
- **Provider abstraction**: Support multiple LLM providers
- **Resource management**: Optimize resource allocation
- **Cost tracking**: Monitor token usage and costs

### Hook System
- **50+ trigger points**: Customization throughout execution
- **Event propagation**: Coordinate across system layers
- **Plugin architecture**: Extend functionality
- **Observability**: Deep insight into execution

## 10-State Lifecycle

The engine implements a comprehensive 10-state lifecycle for each task:

1. **Pending**: Task created, awaiting execution
2. **Scheduled**: Task queued for execution
3. **Running**: Task actively executing
4. **Waiting**: Task paused, awaiting external input
5. **Completed**: Task finished successfully
6. **Failed**: Task terminated with error
7. **Retrying**: Task being retried after failure
8. **Cancelled**: Task terminated by user
9. **TimedOut**: Task exceeded time limit
10. **Archived**: Task completed and cleaned up

## Hook Triggers

The engine provides hooks at every stage of execution:

### Pre-Execution Hooks
- `before_workflow`: Before workflow starts
- `before_task`: Before each task
- `before_model_call`: Before LLM invocation
- `before_tool_use`: Before tool execution

### Execution Hooks
- `on_token_stream`: As tokens are generated
- `on_state_change`: When task state changes
- `on_error`: When errors occur
- `on_retry`: When retries happen

### Post-Execution Hooks
- `after_task`: After task completion
- `after_workflow`: After workflow finishes
- `on_completion`: On successful completion
- `on_failure`: On workflow failure

```yaml
# Example workflow with hooks
workflow:
  name: research_pipeline
  version: "1.0"

hooks:
  before_execution:
    - validate_resources
    - initialize_logging

  on_error:
    - notify_user
    - create_fallback_plan

steps:
  - name: search_literature
    model: gpt-4
    tools: [web_search, academic_databases]
    hooks:
      after_completion:
        - cache_results
        - update_progress
```

## Model Router Integration

The Execution Engine works closely with the Model Router to select optimal models:

```typescript
interface ModelSelection {
  model: string;
  provider: string;
  reason: string;
  cost_estimate: number;
  performance_estimate: number;
}

function selectModelForTask(task: Task): ModelSelection {
  const requirements = analyzeRequirements(task);
  const availableModels = getAvailableModels();

  return router.select(requirements, availableModels);
}
```

## Error Handling Strategy

### Retry Logic
- **Exponential backoff**: Increasing delays between retries
- **Smart retries**: Retry only for recoverable errors
- **Max retry limits**: Prevent infinite retry loops
- **Fallback strategies**: Alternative approaches on persistent failure

### State Recovery
- **Checkpointing**: Save state at critical points
- **Rollback capability**: Revert to previous state on error
- **Resume execution**: Continue from checkpoints after crashes
- **State validation**: Verify state integrity before execution

## Performance Optimization

### Parallel Execution
- **Independent tasks**: Execute simultaneously when possible
- **Resource pools**: Manage concurrent execution limits
- **Load balancing**: Distribute work across available resources
- **Priority scheduling**: Execute important tasks first

### Caching Strategies
- **Result caching**: Cache task results when appropriate
- **Model caching**: Cache model responses for repeated queries
- **Dependency caching**: Cache resolved dependencies
- **Invalidation**: Smart cache invalidation policies

## Observability Features

### Logging and Monitoring
- **Structured logging**: Detailed execution logs
- **Performance metrics**: Timing and resource usage
- **State transitions**: Complete lifecycle tracking
- **Token accounting**: Precise token usage tracking

### Debugging Support
- **Step-through execution**: Pause and inspect execution
- **Variable inspection**: Examine intermediate values
- **Hook tracing**: Track hook execution
- **Error context**: Rich error information and context

The Execution Engine Slice provides the robust foundation for autonomous agent execution while maintaining transparency and control.

> The Execution Engine proves that sophisticated orchestration doesn't require cloud services—local execution can be both powerful and practical.