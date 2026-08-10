---
id: f4a5b6c7-d8e9-0123-7890-234567890123
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

The Execution Engine slice powers Whitt's workflow execution, using YAML-based workflow definitions with a comprehensive hooks system for lifecycle management.

## YAML Workflow Structure

### Workflow Definition
Human-readable workflow format:
```yaml
name: "Research Summarizer"
version: "1.0"
description: "Summarizes research notes and posts to Slack"

steps:
  - id: fetch-notes
    name: "Fetch Research Notes"
    type: "tool"
    tool: "notion"
    action: "fetch"
    config:
      database_id: "abc123"
      filter:
        property: "Status"
        value: "In Progress"
    on_success: "summarize"
    on_failure: "notify-error"

  - id: summarize
    name: "Summarize Notes"
    type: "llm"
    model: "local-llama-3-8b"
    prompt: |
      Summarize these research notes:
      {{ fetch-notes.output }}
      
      Focus on key findings and actionable insights.
    on_success: "format-output"
    on_failure: "retry-summarize"

  - id: format-output
    name: "Format Output"
    type: "template"
    template: |
      # Research Summary
      {{ summarize.output }}
      
      Generated: {{ timestamp }}
    on_success: "post-slack"
```

### Schema Validation
Type-safe workflow definitions:
```typescript
interface WorkflowStep {
  id: string
  name: string
  type: 'tool' | 'llm' | 'template' | 'condition'
  model?: string
  tool?: string
  action?: string
  config?: Record<string, any>
  prompt?: string
  template?: string
  on_success: string
  on_failure: string
  hooks?: StepHooks
}

interface Workflow {
  name: string
  version: string
  description: string
  steps: WorkflowStep[]
  variables: Record<string, any>
  hooks?: WorkflowHooks
}
```

## Hooks System

### 10-Point Lifecycle Hooks
Comprehensive workflow and step lifecycle:

**Workflow Hooks**:
1. `on_init`: Before workflow starts
2. `on_start`: When workflow begins execution
3. `on_complete`: After successful completion
4. `on_failure`: When workflow fails
5. `on_cleanup`: Resource cleanup

**Step Hooks**:
6. `before_step`: Before each step executes
7. `after_step`: After each step completes
8. `on_step_success`: On step success
9. `on_step_failure`: On step failure
10. `on_retry`: Before step retry

### Hook Implementation
```typescript
interface StepHooks {
  before_step?: (context: StepContext) => Promise<void>
  after_step?: (context: StepContext, result: StepResult) => Promise<void>
  on_step_success?: (context: StepContext, result: StepResult) => Promise<void>
  on_step_failure?: (context: StepContext, error: Error) => Promise<void>
  on_retry?: (context: StepContext, attempt: number) => Promise<void>
}

class StepExecutor {
  async executeStep(step: WorkflowStep, context: StepContext) {
    try {
      await step.hooks?.before_step?.(context)
      
      const result = await this.runStepLogic(step, context)
      
      await step.hooks?.after_step?.(context, result)
      await step.hooks?.on_step_success?.(context, result)
      
      return result
    } catch (error) {
      await step.hooks?.on_step_failure?.(context, error as Error)
      throw error
    }
  }
}
```

### Hook Use Cases

**Logging and Monitoring**:
```typescript
const loggingHooks = {
  before_step: async (context) => {
    log.info('Step starting', { stepId: context.step.id })
  },
  after_step: async (context, result) => {
    log.info('Step completed', { 
      stepId: context.step.id, 
      duration: result.duration 
    })
  }
}
```

**Resource Management**:
```typescript
const resourceHooks = {
  before_step: async (context) => {
    await allocateResources(context.step.resourceRequirements)
  },
  after_step: async (context) => {
    await releaseResources(context.step.resourceRequirements)
  }
}
```

**Error Recovery**:
```typescript
const retryHooks = {
  on_step_failure: async (context, error) => {
    if (isTransientError(error)) {
      await context.retry(3, 1000) // 3 retries, 1s delay
    }
  }
}
```

## Step Execution

### Tool Steps
Execute external tools:
```typescript
async function executeToolStep(step: WorkflowStep, context: StepContext) {
  const tool = toolRegistry.get(step.tool)
  const result = await tool.execute(step.action, step.config)
  return { output: result, status: 'success' }
}
```

### LLM Steps
Run language models:
```typescript
async function executeLLMStep(step: WorkflowStep, context: StepContext) {
  const model = modelRegistry.get(step.model)
  const prompt = renderTemplate(step.prompt, context.variables)
  
  const result = await model.generate(prompt, {
    temperature: 0.7,
    max_tokens: 1000
  })
  
  return { output: result.text, status: 'success' }
}
```

### Conditional Steps
Branch workflow logic:
```typescript
async function executeConditionStep(step: WorkflowStep, context: StepContext) {
  const condition = renderTemplate(step.condition, context.variables)
  const result = evaluateCondition(condition)
  
  return {
    output: result,
    status: result ? 'success' : 'skipped',
    nextStep: result ? step.on_success : step.on_failure
  }
}
```

## Variable Management

### Template Rendering
Dynamic workflow values:
```typescript
function renderTemplate(template: string, variables: Record<string, any>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key]?.toString() || match
  })
}
```

### Variable Scoping
Isolated variable contexts:
```typescript
interface ExecutionContext {
  workflow: Workflow
  variables: Record<string, any>
  stepResults: Map<string, StepResult>
  currentStep: WorkflowStep
}

function getVariable(context: ExecutionContext, name: string): any {
  // Check step outputs first
  if (context.stepResults.has(name)) {
    return context.stepResults.get(name)?.output
  }
  
  // Check workflow variables
  if (context.workflow.variables[name] !== undefined) {
    return context.workflow.variables[name]
  }
  
  // Check environment variables
  return process.env[name]
}
```

The Execution Engine provides robust, predictable workflow execution with comprehensive lifecycle management through its hooks system and YAML-based workflow definitions.