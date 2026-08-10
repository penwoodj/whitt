---
id: b6c7d8e9-f0a1-2345-9012-456789012345
title: Hooks System
parent: ./index.md
children:
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: done
focus_jump:
---

# Hooks System

The hooks system provides comprehensive lifecycle management for workflows and steps, enabling observation, intervention, and extension of execution behavior.

## Hook Architecture

### Hook Interface
Type-safe hook definitions:
```typescript
interface WorkflowHooks {
  on_init?: (context: WorkflowContext) => Promise<void>
  on_start?: (context: WorkflowContext) => Promise<void>
  on_complete?: (context: WorkflowContext, result: WorkflowResult) => Promise<void>
  on_failure?: (context: WorkflowContext, error: Error) => Promise<void>
  on_cleanup?: (context: WorkflowContext) => Promise<void>
}

interface StepHooks {
  before_step?: (context: StepContext) => Promise<void>
  after_step?: (context: StepContext, result: StepResult) => Promise<void>
  on_step_success?: (context: StepContext, result: StepResult) => Promise<void>
  on_step_failure?: (context: StepContext, error: Error) => Promise<void>
  on_retry?: (context: StepContext, attempt: number) => Promise<void>
}
```

### Hook Registry
Centralized hook management:
```typescript
class HookRegistry {
  private workflowHooks: Map<string, WorkflowHooks> = new Map()
  private stepHooks: Map<string, StepHooks> = new Map()
  
  registerWorkflowHooks(id: string, hooks: WorkflowHooks) {
    this.workflowHooks.set(id, hooks)
  }
  
  registerStepHooks(id: string, hooks: StepHooks) {
    this.stepHooks.set(id, hooks)
  }
  
  async executeWorkflowHooks(
    phase: keyof WorkflowHooks,
    context: WorkflowContext,
    ...args: any[]
  ) {
    const hooks = this.workflowHooks.get(context.workflow.id)
    if (!hooks) return
    
    const hook = hooks[phase]
    if (typeof hook === 'function') {
      await hook(context, ...args)
    }
  }
}
```

## Built-in Hooks

### Logging Hooks
Comprehensive execution logging:
```typescript
const loggingHooks: WorkflowHooks & StepHooks = {
  // Workflow hooks
  on_init: async (context) => {
    log.info('Workflow initialized', { 
      workflowId: context.workflow.id,
      variables: context.variables 
    })
  },
  
  on_start: async (context) => {
    log.info('Workflow started', { 
      workflowId: context.workflow.id,
      startTime: context.startTime 
    })
  },
  
  on_complete: async (context, result) => {
    log.info('Workflow completed', {
      workflowId: context.workflow.id,
      duration: result.duration,
      stepsExecuted: result.steps.length
    })
  },
  
  on_failure: async (context, error) => {
    log.error('Workflow failed', {
      workflowId: context.workflow.id,
      error: error.message,
      stack: error.stack
    })
  },
  
  // Step hooks
  before_step: async (context) => {
    log.debug('Step starting', { 
      stepId: context.step.id,
      type: context.step.type 
    })
  },
  
  after_step: async (context, result) => {
    log.debug('Step completed', {
      stepId: context.step.id,
      duration: result.duration,
      status: result.status
    })
  }
}
```

### Monitoring Hooks
Performance and resource monitoring:
```typescript
const monitoringHooks: StepHooks = {
  before_step: async (context) => {
    context.metrics = {
      startTime: Date.now(),
      memoryStart: process.memoryUsage().heapUsed,
      cpuStart: process.cpuUsage()
    }
  },
  
  after_step: async (context, result) => {
    const metrics = {
      duration: Date.now() - context.metrics.startTime,
      memoryUsed: process.memoryUsage().heapUsed - context.metrics.memoryStart,
      cpuUsed: process.cpuUsage(context.metrics.cpuStart)
    }
    
    await metricsStore.record(context.step.id, metrics)
    
    if (metrics.duration > 30000) {
      log.warn('Slow step detected', { 
        stepId: context.step.id,
        duration: metrics.duration 
      })
    }
  }
}
```

### Error Recovery Hooks
Automatic error handling and retry:
```typescript
const recoveryHooks: StepHooks = {
  on_step_failure: async (context, error) => {
    if (isTransientError(error)) {
      const maxRetries = context.step.config?.retries || 3
      const delay = calculateBackoff(context.retryCount || 0)
      
      log.info('Retrying step', {
        stepId: context.step.id,
        attempt: (context.retryCount || 0) + 1,
        delay
      })
      
      await sleep(delay)
      context.retryCount = (context.retryCount || 0) + 1
      
      if (context.retryCount <= maxRetries) {
        await context.retryStep()
      }
    }
  },
  
  on_retry: async (context, attempt) => {
    log.info('Retry attempt', {
      stepId: context.step.id,
      attempt,
      maxRetries: context.step.config?.retries
    })
  }
}
```

## Custom Hooks

### Notification Hooks
Send notifications on workflow events:
```typescript
const notificationHooks: WorkflowHooks = {
  on_complete: async (context, result) => {
    await slackClient.sendMessage({
      channel: context.variables.notification_channel,
      text: `✅ Workflow ${context.workflow.name} completed successfully`,
      attachments: [{
        color: 'good',
        fields: [
          { title: 'Duration', value: `${result.duration}ms`, short: true },
          { title: 'Steps', value: result.steps.length, short: true }
        ]
      }]
    })
  },
  
  on_failure: async (context, error) => {
    await slackClient.sendMessage({
      channel: context.variables.notification_channel,
      text: `❌ Workflow ${context.workflow.name} failed`,
      attachments: [{
        color: 'danger',
        fields: [
          { title: 'Error', value: error.message, short: false },
          { title: 'Step', value: context.currentStep?.id, short: true }
        ]
      }]
    })
  }
}
```

### Validation Hooks
Ensure workflow integrity:
```typescript
const validationHooks: WorkflowHooks = {
  on_init: async (context) => {
    const errors = validateWorkflow(context.workflow)
    if (errors.length > 0) {
      throw new ValidationError('Workflow validation failed', { errors })
    }
    
    const warnings = validateBestPractices(context.workflow)
    if (warnings.length > 0) {
      log.warn('Workflow best practice warnings', { warnings })
    }
  }
}
```

## Hook Composition

### Chaining Hooks
Combine multiple hooks:
```typescript
const compositeHooks = {
  before_step: async (context) => {
    await loggingHooks.before_step?.(context)
    await monitoringHooks.before_step?.(context)
    await validationHooks.before_step?.(context)
  },
  
  after_step: async (context, result) => {
    await monitoringHooks.after_step?.(context, result)
    await loggingHooks.after_step?.(context, result)
    await notificationHooks.after_step?.(context, result)
  }
}
```

### Conditional Hooks
Execute hooks based on conditions:
```typescript
const conditionalHooks: StepHooks = {
  after_step: async (context, result) => {
    // Only log slow steps
    if (result.duration > 10000) {
      await logSlowStep(context, result)
    }
    
    // Only notify on failures
    if (result.status === 'failed') {
      await notifyFailure(context, result)
    }
  }
}
```

## Hook Best Practices

### Performance Considerations
- Keep hooks lightweight and fast
- Avoid blocking operations in hooks
- Use async/await for I/O operations
- Implement proper error handling

### Hook Ordering
Execute hooks in logical order:
1. Validation hooks first
2. Monitoring hooks for metrics
3. Logging hooks for audit trails
4. Notification hooks for user feedback
5. Cleanup hooks last

### Error Handling
Never let hook errors break execution:
```typescript
const safeHook = async (hook: Function, ...args: any[]) => {
  try {
    await hook(...args)
  } catch (error) {
    log.error('Hook execution failed', { error, hook: hook.name })
    // Continue execution despite hook failure
  }
}
```

The hooks system provides powerful extensibility for workflow execution, enabling observation, intervention, and automation without modifying core workflow logic.