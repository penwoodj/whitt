---
id: 133e4567-e89b-12d3-a456-426614174027
title: 10-State Lifecycle
parent: index.md
children:
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: done
focus_jump:
---

# 10-State Lifecycle

The 10-State Lifecycle provides comprehensive tracking of task execution from creation to completion. This granular state model enables precise monitoring, sophisticated error handling, and detailed performance analysis. Each state transition is logged, timed, and can trigger custom hooks, giving users deep visibility into workflow execution.

The lifecycle is designed to handle real-world complexity including retries, timeouts, user interventions, and resource constraints. States are mutually exclusive and transitions follow well-defined rules, preventing invalid state combinations and ensuring predictable behavior. This rigorous approach makes the system reliable and debuggable even under complex scenarios.

## State Definitions

### 1. Pending
**Definition**: Task created but not yet queued for execution.

**Triggers**: Initial task creation, workflow initialization.

**Valid next states**: Scheduled, Cancelled.

**Use cases**: Tasks waiting for dependencies, resource availability, or scheduled execution time.

```typescript
interface PendingState {
  state: 'pending';
  createdAt: number;
  reason?: string;
  dependencies?: string[];
}
```

### 2. Scheduled
**Definition**: Task queued and awaiting execution resources.

**Triggers**: Resources available, dependencies satisfied, priority reached.

**Valid next states**: Running, Cancelled, TimedOut.

**Use cases**: Tasks in queue waiting for CPU, memory, or model availability.

### 3. Running
**Definition**: Task actively executing on allocated resources.

**Triggers**: Resource allocation complete, execution started.

**Valid next states**: Completed, Failed, Waiting, Cancelled, TimedOut.

**Use cases**: Active LLM inference, tool execution, data processing.

### 4. Waiting
**Definition**: Task paused awaiting external input or conditions.

**Triggers**: User input required, external dependency, manual approval.

**Valid next states**: Running, Cancelled, TimedOut.

**Use cases**: Awaiting user confirmation, external API rate limits, manual intervention.

### 5. Completed
**Definition**: Task finished successfully with valid output.

**Triggers**: Successful execution, all requirements met.

**Valid next states**: Archived.

**Use cases**: Successful research, data processing, content generation.

### 6. Failed
**Definition**: Task terminated with error after exhausting retries.

**Triggers**: Maximum retries exceeded, unrecoverable error, validation failure.

**Valid next states**: Archived.

**Use cases**: API errors, data validation failures, resource constraints.

### 7. Retrying
**Definition**: Task being retried after transient failure.

**Triggers**: Retryable error, automatic retry policy triggered.

**Valid next states**: Running, Failed, Cancelled.

**Use cases**: Network timeouts, temporary API failures, resource contention.

### 8. Cancelled
**Definition**: Task terminated by user or system intervention.

**Triggers**: User cancellation, system shutdown, dependency failure.

**Valid next states**: Archived.

**Use cases**: User stopped workflow, system maintenance, upstream failure.

### 9. TimedOut
**Definition**: Task exceeded allowed execution time.

**Triggers**: Timeout limit reached, watchdog timer expired.

**Valid next states**: Failed, Archived.

**Use cases**: Long-running LLM calls, hanging tool execution, infinite loops.

### 10. Archived
**Definition**: Task completed and cleaned up, retained for history.

**Triggers**: Final state reached, retention period started.

**Valid next states**: None (terminal state).

**Use cases**: Historical records, audit trails, performance analysis.

## State Transition Matrix

| From | To | Triggers | Conditions |
|------|----|---------|-------------|
| Pending | Scheduled | Resources available | Dependencies satisfied |
| Scheduled | Running | Resource allocated | Queue priority reached |
| Running | Completed | Success criteria met | Output validated |
| Running | Failed | Non-retryable error | Max retries exceeded |
| Running | Waiting | External input needed | Awaiting user/API |
| Running | Retrying | Retryable error | Retry count < max |
| Running | Cancelled | Cancellation request | User/system initiated |
| Running | TimedOut | Timeout exceeded | Time limit reached |
| Waiting | Running | Condition satisfied | Input received |
| Retrying | Running | Retry attempt starting | Backoff completed |
| Any | Cancelled | Cancellation request | Unless in terminal state |
| Terminal | Archived | Cleanup initiated | Retention policy |

## State Management Implementation

```typescript
class LifecycleManager {
  private state: TaskState = 'pending';
  private stateHistory: StateTransition[] = [];
  private stateTimings: Map<TaskState, number> = new Map();

  async transition(newState: TaskState, reason?: string): Promise<void> {
    if (!this.isValidTransition(this.state, newState)) {
      throw new Error(`Invalid transition: ${this.state} -> ${newState}`);
    }

    const previousState = this.state;
    const timestamp = Date.now();

    // Record transition
    this.stateHistory.push({
      from: previousState,
      to: newState,
      timestamp,
      reason
    });

    // Update state timing
    this.stateTimings.set(previousState, timestamp - (this.stateTimings.get(previousState) || timestamp));
    this.stateTimings.set(newState, timestamp);

    // Update current state
    this.state = newState;

    // Trigger state change hooks
    await this.executeHooks('on_state_change', {
      previousState,
      newState,
      reason
    });
  }

  private isValidTransition(from: TaskState, to: TaskState): boolean {
    // Implementation of transition rules
    return VALID_TRANSITIONS[from].includes(to);
  }
}
```

## State-Specific Behaviors

### Timeout Handling
Each state can have timeout policies:
- **Pending**: Max time in queue before escalation
- **Scheduled**: Max wait time for resources
- **Running**: Max execution time
- **Waiting**: Max wait for external input
- **Retrying**: Max total retry time

### Retry Logic
Configurable retry strategies per state:
- **Exponential backoff**: Increasing delays between retries
- **Linear backoff**: Fixed delay between retries
- **Custom backoff**: User-defined retry schedules
- **Max retry limits**: Prevent infinite retry loops

### Cleanup Actions
State-specific cleanup on transitions:
- **Resource release**: Free allocated resources
- **Temporary file cleanup**: Remove intermediate files
- **Connection cleanup**: Close network connections
- **State persistence**: Save final state for audit

## Monitoring and Observability

### State Metrics
- **State duration**: Time spent in each state
- **Transition frequency**: How often transitions occur
- **State distribution**: Current distribution across states
- **Bottleneck identification**: States causing delays

### Alerting
- **Stuck tasks**: Tasks in non-terminal states too long
- **High failure rates**: Excessive transitions to failed state
- **Timeout patterns**: Repeated timeout occurrences
- **State anomalies**: Unusual state transition patterns

The 10-State Lifecycle provides the foundation for reliable, observable, and debuggable task execution in complex orchestration scenarios.

> A well-defined lifecycle is the difference between a system that works and one that can be understood and maintained.