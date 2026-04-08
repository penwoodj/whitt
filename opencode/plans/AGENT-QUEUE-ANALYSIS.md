# Agent-Queue Analysis: What It Already Handles

> **Version**: 1.0
> **Purpose**: Document what agent-queue provides so whitt doesn't duplicate it

---

## Executive Summary

agent-queue is the **queue orchestration backbone**. It handles ALL scheduling, state management, retry logic, and workload distribution. Whitt's job is to **display** queue state and let the user **interact** with it - NOT to reimplement any queue logic.

---

## What agent-queue Provides (Whitt Should NOT Reimplement)

### 1. Task Lifecycle Management ✅
| State | Meaning | Whitt's Role |
|-------|---------|-------------|
| NEW | Task created, not yet queued | Show "Creating..." |
| QUEUED | Waiting for execution slot | Show in queue panel |
| SCHEDULED | Time-gated, waiting for trigger | Show scheduled time |
| LEASED | Claimed by executor, starting | Show "Starting..." |
| RUNNING | Currently executing | Show progress |
| DONE | Successfully completed | Show checkmark |
| FAILED | Execution error | Show error, offer retry |
| DLQ | Dead letter queue (max retries) | Show "Failed permanently" |
| CANCELED | User canceled | Show strikethrough |
| EXPIRED | Lease expired | Show "Expired" |

**Whitt's job**: Subscribe to state changes (poll `agent-queue list` or future event stream) and render appropriate UI states. Do NOT track state independently.

### 2. Priority Scheduling ✅
- 25 queue levels (ASAP, Whenever, Scheduled, Cron, Deadline, Rate-Limited, etc.)
- EDF (Earliest Deadline First) for deadline-driven tasks
- WRR (Weighted Round-Robin) for fair sharing
- DRR (Deficit Round-Robin) for bandwidth allocation
- Fair Share with min_share guarantees
- Priority + Aging (anti-starvation)
- Work stealing across pools

**Whitt's job**: Show priority badges, let user change priority via `agent-queue` CLI, display scheduling order. Do NOT implement scheduling algorithms.

### 3. Retry and Error Recovery ✅
- Max 3 retry attempts with exponential backoff (1s → 2s → 4s)
- Jitter: ±20%
- Dead Letter Queue (DLQ) for permanently failed tasks
- Retry from DLQ with `agent-queue retry` CLI command

**Whitt's job**: Show retry count, offer retry button (calls `agent-queue retry`), show DLQ items. Do NOT implement retry logic.

### 4. Resource Management ✅
- Backpressure (reject new tasks when system overloaded)
- Concurrent execution limits
- Resource-aware scheduling

**Whitt's job**: Show "system busy" when backpressure active, display resource usage if agent-queue provides metrics. Do NOT implement resource management.

### 5. Persistence ✅
- SQLite (WAL mode) for task state
- Audit logging
- Task history

**Whitt's job**: Query history via `agent-queue list --status done --limit 50`. Do NOT maintain separate task database.

### 6. Multi-Tenancy ✅
- Tenant identification
- Quota governance
- Cost tracking

**Whitt's job**: (Future) Show tenant selector, display quota usage. Do NOT implement quotas.

---

## What Whitt MUST Provide (agent-queue Does NOT)

### 1. Chat Interface
agent-queue has NO concept of "conversations" or "chats". It only knows about "tasks" (workflows to execute). Whitt maps user chat sessions to queue tasks.

### 2. Prompt → Workflow Compilation
agent-queue accepts pre-compiled workflows. Whitt must call yaml-to-rust-agentsdk to compile prompts into workflows before enqueueing.

### 3. Visual Queue Display
agent-queue outputs JSON. Whitt renders it as a visual panel with sorting, filtering, drag-and-drop.

### 4. Real-Time Progress Streaming
agent-queue's MVP is CLI-only (poll-based). Whitt provides the real-time feel by polling and rendering updates. Post-MVP, agent-queue may add event streaming.

### 5. Settings and Configuration
Backend selection, model management, resource limits - these are Whitt's settings panels that configure the underlying systems.

### 6. Human Override UI
agent-queue supports "human-gated" tasks (QL-013). Whitt provides the approval/rejection UI.

---

## Integration Points (MVP)

### Whitt Calls agent-queue CLI:
```typescript
// Enqueue a compiled workflow
const result = await invoke('enqueue_task', {
  workflowPath: '/tmp/workflow-001.yaml',
  priority: 'high',
  category: 'asap'
});

// Poll for updates (every 2 seconds while queue is active)
const tasks = await invoke('list_tasks', { status: 'all' });

// Cancel a task
await invoke('cancel_task', { taskId: 'tq_001' });

// Retry a failed task
await invoke('retry_task', { taskId: 'tq_002' });
```

### agent-queue Calls yaml-to-rust-agentsdk CLI:
```rust
// agent-queue internally dispatches execution
// Whitt does NOT need to know about this
Command::new("yaml-to-rust-agentsdk")
    .args(["execute", "--workflow", &workflow_path])
    .spawn()?;
```

---

## What About Queue Management in Whitt?

### Whitt SHOULD show:
- ✅ Task list with status, priority, created time
- ✅ Current executing task (highlighted)
- ✅ Queue position for waiting tasks
- ✅ Progress percentage for running tasks
- ✅ Error messages for failed tasks
- ✅ Drag-and-drop reordering (calls agent-queue priority update)
- ✅ Cancel/retry buttons (calls agent-queue CLI)

### Whitt should NOT:
- ❌ Maintain its own task state database
- ❌ Implement scheduling algorithms
- ❌ Decide execution order (agent-queue decides)
- ❌ Handle retry logic (agent-queue handles)
- ❌ Manage lease expiration (agent-queue handles)
- ❌ Track resource usage internally (agent-queue provides metrics)

---

## Future: Multi-Machine Orchestration (Phase B+)

agent-queue plans to support:
- Local network machine discovery
- Distributed task dispatch
- Work stealing across machines
- Resource-aware placement

Whitt will:
- Show machine status panel (which machines are available, their load)
- Let user select target machine for a task (optional, default: auto)
- Display distributed task state (which machine is running which task)
- Show network topology (for local network deployments)

agent-queue handles:
- Machine registration and heartbeat
- Task placement decisions
- Machine failure detection and task migration
- Network communication between machines

---

## Future: P2P Gamification (Phase D)

agent-queue may eventually support:
- Task marketplace (share useful workflows)
- Compute credit accounting
- Proof-of-satisfaction verification

Whitt will provide:
- Workflow sharing UI (publish workflow to network)
- Credit balance display
- Leaderboard / reputation
- Notification when your workflow is used by others

agent-queue handles:
- Workflow distribution protocol
- Credit accounting ledger
- Proof verification logic
- Compute allocation based on credits
