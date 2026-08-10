---
id: d8e9f0a1-b2c3-4567-1234-678901234567
title: 10-State Lifecycle
parent: ./index.md
children:
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: done
focus_jump:
---

# 10-State Lifecycle

The 10-state lifecycle provides comprehensive task state management, enabling precise tracking and control of task execution in the Whitt orchestration system.

## State Overview

### State Hierarchy
Organized state categories:

**Initial States**:
- PENDING: Task creation point
- QUEUED: Ready for execution

**Active States**:
- ASSIGNED: Resource allocation complete
- RUNNING: Active execution
- PAUSED: Temporary suspension
- WAITING: Dependency resolution

**Terminal States**:
- COMPLETED: Successful finish
- FAILED: Error termination
- CANCELLED: User/system cancellation
- TIMEOUT: Time limit exceeded

### State Characteristics
```typescript
interface StateDefinition {
  category: 'initial' | 'active' | 'terminal'
  isTerminal: boolean
  canRetry: boolean
  timeoutMs?: number
  autoTransition?: TaskState
}

const stateDefinitions: Record<TaskState, StateDefinition> = {
  PENDING: {
    category: 'initial',
    isTerminal: false,
    canRetry: false,
    timeoutMs: 300000 // 5 minutes to queue
  },
  QUEUED: {
    category: 'initial',
    isTerminal: false,
    canRetry: false,
    timeoutMs: 600000 // 10 minutes to assign
  },
  ASSIGNED: {
    category: 'active',
    isTerminal: false,
    canRetry: true,
    timeoutMs: 60000 // 1 minute to start
  },
  RUNNING: {
    category: 'active',
    isTerminal: false,
    canRetry: true,
    timeoutMs: undefined // Task-specific timeout
  },
  PAUSED: {
    category: 'active',
    isTerminal: false,
    canRetry: true,
    timeoutMs: 3600000 // 1 hour max pause
  },
  WAITING: {
    category: 'active',
    isTerminal: false,
    canRetry: true,
    timeoutMs: 1800000 // 30 minutes max wait
  },
  COMPLETED: {
    category: 'terminal',
    isTerminal: true,
    canRetry: false
  },
  FAILED: {
    category: 'terminal',
    isTerminal: true,
    canRetry: true,
    autoTransition: 'QUEUED' // Auto-retry option
  },
  CANCELLED: {
    category: 'terminal',
    isTerminal: true,
    canRetry: false
  },
  TIMEOUT: {
    category: 'terminal',
    isTerminal: true,
    canRetry: true,
    autoTransition: 'QUEUED' // Auto-retry option
  }
}
```

## State Transitions

### Transition Rules
Valid state change patterns:
```typescript
const transitionRules: Record<TaskState, TransitionRule[]> = {
  PENDING: [
    { to: 'QUEUED', condition: 'resources-available' },
    { to: 'CANCELLED', condition: 'user-cancel' }
  ],
  QUEUED: [
    { to: 'ASSIGNED', condition: 'worker-allocated' },
    { to: 'CANCELLED', condition: 'user-cancel' },
    { to: 'TIMEOUT', condition: 'queue-timeout' }
  ],
  ASSIGNED: [
    { to: 'RUNNING', condition: 'execution-started' },
    { to: 'FAILED', condition: 'worker-failure' },
    { to: 'CANCELLED', condition: 'user-cancel' }
  ],
  RUNNING: [
    { to: 'COMPLETED', condition: 'success' },
    { to: 'FAILED', condition: 'error' },
    { to: 'PAUSED', condition: 'user-pause' },
    { to: 'WAITING', condition: 'dependency-wait' },
    { to: 'TIMEOUT', condition: 'execution-timeout' }
  ],
  PAUSED: [
    { to: 'RUNNING', condition: 'user-resume' },
    { to: 'CANCELLED', condition: 'user-cancel' },
    { to: 'TIMEOUT', condition: 'pause-timeout' }
  ],
  WAITING: [
    { to: 'RUNNING', condition: 'dependency-resolved' },
    { to: 'FAILED', condition: 'dependency-failed' },
    { to: 'CANCELLED', condition: 'user-cancel' },
    { to: 'TIMEOUT', condition: 'wait-timeout' }
  ],
  COMPLETED: [], // Terminal - no outgoing transitions
  FAILED: [
    { to: 'QUEUED', condition: 'retry-approved' },
    { to: 'CANCELLED', condition: 'user-cancel' }
  ],
  CANCELLED: [], // Terminal - no outgoing transitions
  TIMEOUT: [
    { to: 'QUEUED', condition: 'retry-approved' },
    { to: 'CANCELLED', condition: 'user-cancel' }
  ]
}
```

### Transition Engine
State change orchestration:
```typescript
class StateTransitionEngine {
  private stateMachine: Map<string, TaskStateMachine>
  private transitionLog: TransitionLog[]
  
  async transition(
    taskId: string,
    newState: TaskState,
    context: TransitionContext
  ): Promise<TransitionResult> {
    const machine = this.stateMachine.get(taskId)
    if (!machine) {
      throw new Error(`Task ${taskId} not found`)
    }
    
    const currentState = machine.getCurrentState()
    const validTransitions = transitionRules[currentState] || []
    const transition = validTransitions.find(t => t.to === newState)
    
    if (!transition) {
      return {
        success: false,
        error: `Invalid transition: ${currentState} -> ${newState}`,
        currentState
      }
    }
    
    // Check transition conditions
    if (transition.condition && !this.checkCondition(transition.condition, context)) {
      return {
        success: false,
        error: `Transition condition not met: ${transition.condition}`,
        currentState
      }
    }
    
    // Execute transition
    try {
      machine.transition(newState)
      
      this.logTransition({
        taskId,
        from: currentState,
        to: newState,
        timestamp: Date.now(),
        context
      })
      
      // Execute post-transition hooks
      await this.executePostTransitionHooks(taskId, newState, context)
      
      return {
        success: true,
        newState,
        previousState: currentState
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        currentState
      }
    }
  }
}
```

## State Persistence

### Database Schema
Persistent state tracking:
```sql
CREATE TABLE task_states (
  id VARCHAR(36) PRIMARY KEY,
  current_state VARCHAR(20) NOT NULL,
  previous_state VARCHAR(20),
  state_history JSON NOT NULL,
  entered_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  timeout_at TIMESTAMP,
  metadata JSON
);

CREATE INDEX idx_current_state ON task_states(current_state);
CREATE INDEX idx_timeout_at ON task_states(timeout_at);
```

### State Recovery
Restore state after system restart:
```typescript
class StateRecovery {
  async recoverTaskStates(): Promise<void> {
    const timeoutTasks = await this.getTimedOutTasks()
    for (const task of timeoutTasks) {
      await this.handleTimeout(task)
    }
    
    const stuckTasks = await this.getStuckTasks()
    for (const task of stuckTasks) {
      await this.handleStuckTask(task)
    }
  }
  
  private async getTimedOutTasks(): Promise<Task[]> {
    const now = new Date()
    return await db.query(`
      SELECT * FROM task_states 
      WHERE timeout_at < ? 
      AND current_state IN ('PENDING', 'QUEUED', 'ASSIGNED', 'PAUSED', 'WAITING')
    `, [now])
  }
  
  private async handleStuckTask(task: Task): Promise<void> {
    // Force transition based on stuck state
    const recoveryTransition = this.getRecoveryTransition(task.current_state)
    await this.transitionEngine.transition(
      task.id,
      recoveryTransition,
      { reason: 'recovery-from-stuck-state' }
    )
  }
}
```

## State Monitoring

### Real-time Tracking
Live state observation:
```typescript
class StateMonitor {
  private observers: Map<string, StateObserver[]>
  
  subscribe(taskId: string, observer: StateObserver): () => void {
    if (!this.observers.has(taskId)) {
      this.observers.set(taskId, [])
    }
    
    this.observers.get(taskId)!.push(observer)
    
    // Return unsubscribe function
    return () => {
      const observers = this.observers.get(taskId)
      if (observers) {
        const index = observers.indexOf(observer)
        if (index > -1) {
          observers.splice(index, 1)
        }
      }
    }
  }
  
  async notify(taskId: string, transition: StateTransition): Promise<void> {
    const observers = this.observers.get(taskId) || []
    for (const observer of observers) {
      try {
        await observer(transition)
      } catch (error) {
        log.error('Observer notification failed', { taskId, error })
      }
    }
  }
}
```

### Analytics and Reporting
State transition analytics:
```typescript
class StateAnalytics {
  async generateTransitionReport(period: DateRange): Promise<TransitionReport> {
    const transitions = await this.getTransitionsInPeriod(period)
    
    return {
      totalTransitions: transitions.length,
      byState: this.groupByState(transitions),
      byTask: this.groupByTask(transitions),
      averageTimeInStates: this.calculateAverageDurations(transitions),
      failureRate: this.calculateFailureRate(transitions),
      commonPaths: this.findCommonPaths(transitions)
    }
  }
  
  private calculateAverageDurations(
    transitions: StateTransition[]
  ): Map<TaskState, number> {
    const stateDurations: Map<TaskState, number[]> = new Map()
    
    for (let i = 0; i < transitions.length - 1; i++) {
      const current = transitions[i]
      const next = transitions[i + 1]
      
      const duration = next.timestamp - current.timestamp
      
      if (!stateDurations.has(current.to)) {
        stateDurations.set(current.to, [])
      }
      stateDurations.get(current.to)!.push(duration)
    }
    
    // Calculate averages
    const averages = new Map<TaskState, number>()
    for (const [state, durations] of stateDurations.entries()) {
      const avg = durations.reduce((sum, d) => sum + d, 0) / durations.length
      averages.set(state, avg)
    }
    
    return averages
  }
}
```

The 10-state lifecycle provides robust task management with comprehensive state tracking, flexible transition rules, and powerful monitoring capabilities for reliable agentic workflow execution.