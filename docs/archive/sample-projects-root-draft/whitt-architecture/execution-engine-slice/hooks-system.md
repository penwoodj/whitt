---
id: 913e4567-e89b-12d3-a456-426614174025
title: Hooks System
parent: index.md
children:
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: done
focus_jump:
---

# Hooks System

The Hooks System provides the extensibility layer of the Whitt Execution Engine, offering 50+ trigger points where custom code can be injected into workflow execution. This system transforms the engine from a fixed orchestrator into a programmable platform where users can implement custom logic, integrate external systems, and add observability without modifying core engine code.

Hook functions follow a consistent interface and receive rich context about execution state. They can modify execution behavior, perform side effects, validate conditions, or provide telemetry. The system supports both synchronous and asynchronous hooks, enabling everything from simple logging to complex external API integration.

## Hook Categories

### Lifecycle Hooks
Triggered at major lifecycle transitions:
- `before_workflow`: Before workflow execution starts
- `after_workflow`: After workflow completes
- `before_task`: Before each task execution
- `after_task`: After each task completion
- `on_state_change`: When any state transition occurs

### Model Interaction Hooks
Triggered during LLM interactions:
- `before_model_call`: Before invoking language models
- `after_model_call`: After model response received
- `on_token_stream`: As tokens are generated
- `on_model_error`: When model errors occur

### Tool Execution Hooks
Triggered during tool usage:
- `before_tool_use`: Before tool execution
- `after_tool_use`: After tool completion
- `on_tool_error`: When tool errors occur
- `validate_tool_result`: Validate tool outputs

### Error Handling Hooks
Triggered during error conditions:
- `on_error`: When any error occurs
- `on_retry`: Before retry attempts
- `on_failure`: When tasks fail permanently
- `on_timeout`: When operations timeout

## Hook Implementation

### Basic Hook Function
```typescript
interface HookContext {
  workflow: Workflow;
  task?: Task;
  state: ExecutionState;
  metadata: Record<string, any>;
}

interface HookResult {
  continue: boolean;  // Allow execution to continue
  modifications?: Record<string, any>;  // Modify execution state
  error?: Error;  // Optional error to trigger
}

type HookFunction = (context: HookContext) => HookResult | Promise<HookResult>;

// Example: Logging hook
const loggingHook: HookFunction = async (context) => {
  console.log(`Task ${context.task?.id} started at ${new Date().toISOString()}`);
  return { continue: true };
};
```

### Async Hook Pattern
```typescript
// Example: External API integration hook
const notificationHook: HookFunction = async (context) => {
  if (context.state === 'completed') {
    await fetch('https://api.example.com/notifications', {
      method: 'POST',
      body: JSON.stringify({
        workflow: context.workflow.name,
        task: context.task?.name,
        status: 'completed'
      })
    });
  }
  return { continue: true };
};
```

## Hook Registration

### Workflow-Level Hooks
```yaml
workflow:
  name: monitored_pipeline
  hooks:
    before_execution:
      - initialize_logging
      - validate_resources

    on_error:
      - notify_administrators
      - create_error_report

    after_completion:
      - generate_report
      - cleanup_resources
```

### Global Hooks
```typescript
// Register hooks globally for all workflows
hookRegistry.register('before_task', async (context) => {
  // Global task initialization
  context.task.startTime = Date.now();
  return { continue: true };
});

hookRegistry.register('after_task', async (context) => {
  // Global task cleanup
  const duration = Date.now() - context.task.startTime;
  metrics.record('task.duration', duration);
  return { continue: true };
});
```

## Advanced Hook Patterns

### Conditional Hook Execution
```typescript
const conditionalHook: HookFunction = async (context) => {
  // Only execute for specific workflows
  if (context.workflow.name.startsWith('critical_')) {
    await performExtraValidation(context);
  }
  return { continue: true };
};
```

### State Modification
```typescript
const stateModifierHook: HookFunction = async (context) => {
  // Modify execution state
  return {
    continue: true,
    modifications: {
      priority: context.metadata.priority + 1,
      timeout: context.metadata.timeout * 1.5
    }
  };
};
```

### Error Recovery
```typescript
const errorRecoveryHook: HookFunction = async (context) => {
  if (context.error) {
    // Attempt automatic recovery
    const recovery = await attemptRecovery(context.error);

    if (recovery.successful) {
      return {
        continue: true,
        modifications: { retryWith: recovery.strategy }
      };
    }
  }

  return { continue: false, error: context.error };
};
```

## Hook Composition

### Sequential Execution
Hooks execute in registration order, with each hook receiving the modifications from previous hooks:

```typescript
const hook1: HookFunction = async (context) => {
  return { continue: true, modifications: { value1: 1 } };
};

const hook2: HookFunction = async (context) => {
  // context.modifications.value1 is available here
  return { continue: true, modifications: { value2: 2 } };
};
```

### Error Propagation
If a hook returns `continue: false` or provides an error, execution stops and the error propagates:

```typescript
const validationHook: HookFunction = async (context) => {
  if (!isValid(context)) {
    return {
      continue: false,
      error: new Error('Validation failed')
    };
  }
  return { continue: true };
};
```

## Best Practices

### Hook Design
- **Single responsibility**: Each hook should do one thing well
- **Idempotency**: Hooks should handle multiple executions safely
- **Error handling**: Hooks should handle their own errors gracefully
- **Performance**: Keep hooks fast to avoid impacting execution

### Hook Testing
- **Unit testing**: Test hooks in isolation
- **Integration testing**: Test hooks within workflow execution
- **Edge cases**: Test error conditions and unusual states
- **Performance testing**: Measure hook performance impact

The Hooks System transforms Whitt from a fixed orchestrator into an extensible platform, enabling users to customize behavior without modifying core engine code.

> Hooks are the difference between a tool you use and a platform you build upon.