# Whitt Project Scopes

This document defines the strict scope boundaries for each project in the Whitt ecosystem. Each project has a clearly defined area of responsibility with explicit IN-scope and OUT-of-scope items.

## Project Overview

The Whitt ecosystem consists of four companion projects:

1. **yaml-to-rust-agentsdk** (`~/code/yaml-to-rust-agentsdk/`) - Execution Engine + Transpiler + CLI
2. **agent-queue** (`~/code/agent-queue/`) - Queue Orchestration + Scheduling
3. **model-router** (`~/code/model-router/`) - Model Selection + Routing
4. **Whitt** (`~/code/whitt/`) - User Interface (Desktop + TUI)

---

## 1. yaml-to-rust-agentsdk Scope

### Location
`~/code/yaml-to-rust-agentsdk/`

### Mission
**Execution Engine ONLY**: Parse, compile, and execute YAML workflows with local LLM backends and tool integrations. No network, no UI, no queue management.

---

### IN Scope

#### 1.1 YAML Processing

| Feature | Description |
|---------|-------------|
| **Schema Parsing** | Parse and validate YAML workflow definitions against schema |
| **Schema Validation** | Enforce structural constraints, required fields, type safety |
| **WorkflowSpec IR** | Internal representation (WorkflowIR) for compiled workflows |
| **Compilation Pipeline** | WorkflowSpec (YAML) → WorkflowIR (structured AST) |
| **DAG Validation** | Detect cycles, validate dependency ordering, topological sort |
| **Error Reporting** | Clear, actionable error messages for YAML syntax and schema issues |

#### 1.2 Variable System

| Feature | Description |
|---------|-------------|
| **Static Interpolation** | `${variable}` substitution at compile time |
| **Dynamic Evaluation** | `{{expression}}` evaluation at runtime |
| **Variable Scope** | Global, workflow-level, step-level variable scoping |
| **Context Variables** | Pre-defined variables (timestamp, environment, etc.) |
| **Variable Mutation** | Read-write variables within workflow steps |

#### 1.3 Workflow Execution

| Feature | Description |
|---------|-------------|
| **Sequential Execution** | Execute steps in order, with dependency satisfaction |
| **Parallel Execution** | Execute independent steps concurrently (via Tokio) |
| **Conditional Branching** | If/else logic based on variable conditions |
| **Loops** | For-each, while, repeat-until loops with convergence detection |
| **Error Handling** | Try/catch, retry, continue-on-error patterns |
| **Step Dependencies** | Explicit dependency declarations between steps |
| **Step Outputs** | Capture and propagate step results to subsequent steps |

#### 1.4 LLM Backend Abstraction

| Feature | Description |
|---------|-------------|
| **LlmBackend Trait** | Unified interface for all LLM backends |
| **Model Configuration** | Model name, temperature, max_tokens, top_p parameters |
| **Streaming Responses** | Token-by-token streaming for real-time progress |
| **Prompt Templates** | Jinja2-like templating for prompt construction |
| **Chat History** | Maintain conversation context across LLM calls |
| **Tool Calls** | Support for function calling (when model supports it) |

#### 1.5 Concrete LLM Backends

| Backend | Description | Local/Remote |
|---------|-------------|--------------|
| **LM Studio** | LM Studio server API | Local |
| **Ollama** | Ollama HTTP API | Local |
| **llama.cpp** | Direct llama.cpp binding (optional) | Local |
| **OpenAI-Compatible** | Any server with OpenAI API format | Local only (MVP) |
| **Custom Backend** | User-defined backend via plugin system | Local |

**Constraint**: MVP supports local backends only. No external API providers (OpenAI, Anthropic, etc.) to ensure offline operation and privacy.

#### 1.6 Tool Execution Framework

| Tool | Description | Capabilities |
|------|-------------|--------------|
| **file** | File system operations | read, write, delete, list, mkdir, exists, metadata |
| **shell** | Shell command execution | exec, capture stdout/stderr, timeout, working dir |
| **web** | HTTP requests (local only) | GET, POST, headers, body, response parsing |
| **custom** | User-defined tools | Plugin system for custom tools |

**Sandboxing**: File and shell tools run with permission gating. User must grant explicit permissions for sensitive operations.

#### 1.7 Sub-Workflow Execution

| Feature | Description |
|---------|-------------|
| **Nested Workflows** | Execute workflows from within workflows |
| **Context Isolation** | Separate variable scope for sub-workflows |
| **Parameter Passing** | Pass variables to sub-workflows as parameters |
| **Result Capture** | Capture sub-workflow outputs into parent context |
| **Recursion Detection** | Prevent infinite recursion depth |

#### 1.8 Code Generation Mode

| Feature | Description |
|---------|-------------|
| **Workflow Compilation** | Compile workflow to standalone Rust binary |
| **Binary Generation** | Produce executable with runtime embedded |
| **Runtime Embedding** | Embed LLM backend and tool implementations |
| **Self-Contained** | No external dependencies (except model files) |
| **Optimization** | Dead code elimination, size optimization |

#### 1.9 Docker Packaging

| Feature | Description |
|---------|-------------|
| **Container Generation** | Create Dockerfile from workflow |
| **Multi-Stage Builds** | Optimize image size (builder + runtime stages) |
| **Model Embedding** | Copy model files into container |
| **Runtime Configuration** | Environment variables, entrypoint |
| **Image Publishing** | Support for Docker Hub, local registry |

#### 1.10 RAG Integration

| Feature | Description |
|---------|-------------|
| **Embeddings Generation** | Generate embeddings for documents and prompts |
| **Vector Storage** | Store embeddings in sqlite-vec or similar |
| **Vector Search** | KNN search for relevant documents |
| **Context Augmentation** | Inject retrieved context into LLM prompts |
| **Document Chunking** | Intelligent chunking for optimal retrieval |
| **Semantic Search** | Fulltext + hybrid search capabilities |

**Integration**: RAG features delegate to model-router for embeddings and vector search.

#### 1.11 Checkpointing and Resume

| Feature | Description |
|---------|-------------|
| **State Snapshots** | Save workflow state at checkpoints |
| **Step-Level Checkpoints** | Save after each step completion |
| **Resume from Checkpoint** | Load state and continue execution |
| **Checkpoints Storage** | Persistent storage in sled/SQLite |
| **Garbage Collection** | Automatic cleanup of old checkpoints |

#### 1.12 Metrics Collection

| Metric | Description |
|--------|-------------|
| **Execution Time** | Workflow, step, and tool execution durations |
| **Token Usage** | Prompt and completion token counts per LLM call |
| **Memory Usage** | Peak memory consumption during execution |
| **Error Rates** | Failed steps, retries, and error types |
| **Queue Metrics** | (Delegated to agent-queue) |
| **Custom Metrics** | User-defined metrics via plugin system |

#### 1.13 Self-Improvement Loop

| Feature | Description |
|---------|-------------|
| **Generate** | Generate candidate workflow variants |
| **Verify** | Execute variants and collect metrics |
| **Repair** | Apply modifications to improve performance |
| **A/B Testing** | Compare performance between variants |
| **Optimization Targets** | Speed, token usage, success rate, cost |

#### 1.14 Quality Benchmarks

| Feature | Description |
|---------|-------------|
| **Benchmark Suite** | Standardized test workflows for performance |
| **Regression Testing** | Detect performance degradation over time |
| **Comparative Analysis** | Compare different backend implementations |
| **Baseline Metrics** | Establish performance baselines |
| **CI Integration** | Automated benchmarking in CI pipeline |

#### 1.15 Memory and Search

| Feature | Description |
|---------|-------------|
| **Local Storage** | Persistent storage in sled (key-value) |
| **Fulltext Search** | Search across workflow outputs and logs |
| **Semantic Search** | Vector similarity search for content |
| **Memory Retrieval** | Retrieve relevant past executions |
| **Context Augmentation** | Inject retrieved memory into new workflows |

#### 1.16 CLI Interface

| Command | Description |
|---------|-------------|
| **parse** | Parse and validate YAML workflow |
| **validate** | Check workflow for correctness (DAG, dependencies) |
| **compile** | Compile WorkflowSpec to WorkflowIR |
| **execute** | Execute workflow (with streaming progress) |
| **package** | Generate Dockerfile or binary from workflow |
| **benchmark** | Run performance benchmarks |
| **version** | Display version information |

**Framework**: Clap for argument parsing and help generation.

#### 1.17 Local File Access

| Feature | Description |
|---------|-------------|
| **Sandboxed Access** | File operations restricted to allowed directories |
| **Permission Gating** | User must grant permissions for sensitive operations |
| **Path Validation** | Prevent directory traversal attacks |
| **Quotas** | Limit file size and count per workflow |
| **Audit Logging** | Log all file operations for security |

---

### OUT Scope

| Category | Items (NOT IN SCOPE) |
|----------|---------------------|
| **Network Access** | No external API calls to LLM providers (OpenAI, Anthropic, etc.) - must be local-only |
| **UI/UX** | No graphical user interface, no web interface, no TUI |
| **Queue Management** | No task queuing, no scheduling, no priority management - delegated to agent-queue |
| **Scheduling** | No time-based scheduling, no cron, no deadline management - delegated to agent-queue |
| **Persistence** | No long-term storage of workflows - delegated to agent-queue (execution state) and sled (checkpoints) |
| **Work Stealing** | No multi-node coordination - delegated to agent-queue |
| **Retry Logic** | No retry policies for failed tasks - delegated to agent-queue |
| **Dead Letter Queue** | No DLQ management - delegated to agent-queue |
| **Lease Protocol** | No lease management - delegated to agent-queue |
| **Backpressure** | No queue-level backpressure - delegated to agent-queue |
| **Model Selection** | No intelligent model routing - delegated to model-router |
| **Task Classification** | No task type classification - delegated to model-router |
| **Authentication** | No user authentication, no authorization |
| **Multi-Tenancy** | No tenant isolation - delegated to agent-queue |
| **Resource Quotas** | No quota enforcement - delegated to agent-queue |
| **Webhooks** | No HTTP webhook notifications - delegated to agent-queue |
| **Git Integration** | No git hooks, no repository management |
| **Event System** | No event-driven architecture - delegated to agent-queue |
| **Monitoring** | No system monitoring, no alerting - metrics only |

---

## 2. agent-queue Scope

### Location
`~/code/agent-queue/`

### Mission
**Queue Orchestration ONLY**: Provide task scheduling, prioritization, state management, and backpressure. No execution logic, no LLM calls, no tool invocation.

---

### IN Scope

#### 2.1 Task Enqueuing

| Feature | Description |
|---------|-------------|
| **Task Submission** | Accept workflows from CLI (stdin JSON) |
| **Task Validation** | Validate task structure and required fields |
| **Task Metadata** | Store tags, user_id, source, priority |
| **Enqueue Response** | Return task_id, initial status, queue position |
| **Bulk Enqueue** | Support enqueuing multiple tasks at once |

#### 2.2 Queue Categories (25 Categories)

| Category | Description | Priority Behavior |
|----------|-------------|-------------------|
| **ASAP** | Execute immediately, highest priority | Fixed high priority |
| **Whenever** | Background tasks, no deadline | Low priority, FIFO |
| **Scheduled** | Run at specific time | Time-based scheduling |
| **Cron** | Recurring tasks (cron syntax) | Periodic scheduling |
| **Deadline** | Must complete by deadline | Earliest Deadline First |
| **Rate-Limited** | Throttled execution rate | Token bucket |
| **Interactive** | User-initiated, low latency | High priority |
| **Batch** | Bulk processing, throughput-focused | Fair share |
| **Maintenance** | System maintenance tasks | Low priority, off-hours |
| **Retry** | Failed task retries | High priority |
| **Backfill** | Catch-up on missed tasks | Low priority |
| **Canary** | Test tasks with limited scope | Low priority |
| **Critical** | System-critical tasks | Highest priority |
| **Low-Priority** | Best-effort tasks | Lowest priority |
| **High-Priority** | Important but not critical | High priority |
| **Standard** | Default category | Normal priority |
| **Urgent** | Time-sensitive | Very high priority |
| **Deferred** | Delayed execution | Scheduled |
| **One-Time** | Single execution | FIFO |
| **Recurring** | Periodic execution | Time-based |
| **Dependent** | Depends on other tasks | Dependency-aware |
| **Independent** | No dependencies | Parallel-friendly |
| **Chained** | Sequential chain of tasks | Dependency chain |
| **Custom** | User-defined category | User-specified priority |

#### 2.3 State Machine (10 States)

```
        ┌─────────────┐
        │    NEW      │  ← Task created, validated
        └──────┬──────┘
               ↓ enqueue
        ┌─────────────┐
        │   QUEUED    │  ← Waiting in queue
        └──────┬──────┘
               ↓ schedule
        ┌─────────────┐
        │  SCHEDULED  │  ← Assigned to worker
        └──────┬──────┘
               ↓ lease
        ┌─────────────┐
        │   LEASED    │  ← Worker holds lease
        └──────┬──────┘
               ↓ heartbeat
        ┌─────────────┐
        │   RUNNING   │  ← Execution in progress
        └──────┬──────┘
               ↓ completion/failure/cancel
    ┌──────────┼──────────┐
    ↓          ↓          ↓
┌───────┐  ┌───────┐  ┌─────────┐
│  DONE  │  │FAILED │  │CANCELED │
└───────┘  └───┬───┘  └─────────┘
               ↓ max retries
        ┌─────────────┐
        │     DLQ     │  ← Dead Letter Queue
        └─────────────┘
               ↓ lease timeout
        ┌─────────────┐
        │   EXPIRED   │  ← Lease expired
        └─────────────┘
```

| State | Description | Valid Transitions |
|-------|-------------|-------------------|
| **NEW** | Task created, awaiting validation | NEW → QUEUED, NEW → FAILED |
| **QUEUED** | Waiting in queue for scheduling | QUEUED → SCHEDULED, QUEUED → CANCELED |
| **SCHEDULED** | Assigned to worker, awaiting lease | SCHEDULED → LEASED, SCHEDULED → EXPIRED |
| **LEASED** | Worker holds lease, starting execution | LEASED → RUNNING, LEASED → EXPIRED |
| **RUNNING** | Execution in progress | RUNNING → DONE, RUNNING → FAILED, RUNNING → CANCELED |
| **DONE** | Execution completed successfully | DONE (terminal) |
| **FAILED** | Execution failed (may retry) | FAILED → QUEUED (retry), FAILED → DLQ |
| **DLQ** | Dead Letter Queue (manual intervention) | DLQ (terminal), DLQ → QUEUED (manual retry) |
| **CANCELED** | Task canceled by user or system | CANCELED (terminal) |
| **EXPIRED** | Lease expired (task re-queued) | EXPIRED → QUEUED |

#### 2.4 Lease Protocol

| Feature | Description |
|---------|-------------|
| **Lease Assignment** | Assign lease when task transitions SCHEDULED → LEASED |
| **Lease TTL** | 60 seconds default (configurable) |
| **Heartbeat Requirement** | Worker must send heartbeat every 15s |
| **Lease Renewal** | Heartbeats extend lease TTL |
| **Lease Expiration** | Missed heartbeat → LEASED → EXPIRED → QUEUED |
| **Lease ID** | Unique identifier for each lease instance |
| **Lease Reclamation** | Expired leases automatically reclaimed |

#### 2.5 Retry Logic

| Feature | Description |
|---------|-------------|
| **Exponential Backoff** | Retry delay increases exponentially (1s, 2s, 4s, 8s) |
| **Max Retries** | 3 attempts by default (configurable) |
| **Retryable Errors** | Transient errors (timeout, network) are retried |
| **Non-Retryable Errors** | Permanent errors (validation) go to DLQ |
| **Retry Counter** | Track retry count per task |
| **Backoff Jitter** | Randomized backoff to prevent thundering herd |

#### 2.6 Dead Letter Queue (DLQ)

| Feature | Description |
|---------|-------------|
| **DLQ Storage** | Separate table in SQLite for failed tasks |
| **DLQ Inspection** | CLI command to inspect DLQ tasks |
| **DLQ Retry** | Manual command to retry DLQ tasks |
| **DLQ Purge** | Manual command to purge old DLQ tasks |
| **DLQ Analysis** | Aggregate statistics on failure reasons |

#### 2.7 Multi-Tenancy and Quotas

| Feature | Description |
|---------|-------------|
| **Tenant ID** | Associate tasks with tenant/user ID |
| **Quota Enforcement** | Limit tasks per tenant (configurable) |
| **Priority Per Tenant** | Tenant-specific priority weights |
| **Quota Alerts** | Notify when approaching quota limits |
| **Quota Exceeded** | Reject new tasks when quota exceeded |

#### 2.8 Priority Scheduling Algorithms

| Algorithm | Description | Use Case |
|-----------|-------------|----------|
| **EDF (Earliest Deadline First)** | Schedule tasks with nearest deadline first | Deadline tasks |
| **WRR (Weighted Round Robin)** | Round robin with category weights | Fairness across categories |
| **DRR (Deficit Round Robin)** | WRR with byte/quantum accounting | Variable-sized tasks |
| **Fair Share** | Distribute capacity proportionally to tenants | Multi-tenant environments |
| **Priority Queue** | Simple priority-based scheduling | General purpose |

#### 2.9 Work Stealing

| Feature | Description |
|---------|-------------|
| **Worker Pools** | Multiple worker pools for different task types |
| **Load Balancing** | Workers steal tasks from busy pools |
| **Pool Affinity** | Prefer tasks matching pool specialization |
| **Work Discovery** | Workers discover available work from shared queue |
| **Lock-Free** | Use crossbeam channels for lock-free coordination |

#### 2.10 Event-Driven Hooks

| Hook Type | Description |
|-----------|-------------|
| **Webhooks** | HTTP POST notifications on state changes |
| **File Watchers** | Trigger tasks when files change |
| **Git Hooks** | Trigger tasks on git events (commit, push) |
| **Timers** | Schedule tasks at specific times |
| **Cron Jobs** | Recurring task scheduling |

#### 2.11 Audit Logging

| Feature | Description |
|---------|-------------|
| **Event Logging** | Log all state transitions |
| **User Actions** | Log enqueue, cancel, retry operations |
| **System Events** | Log lease expiration, DLQ moves |
| **Searchable Logs** | Fulltext search across logs |
| **Log Retention** | Configurable retention period |
| **Log Export** | Export logs to JSON or CSV |

#### 2.12 Backpressure Mechanism

| Feature | Description |
|---------|-------------|
| **Queue Limits** | Maximum queue size (configurable) |
| **Admission Control** | Reject tasks when queue full |
| **Priority Admission** | Admit high-priority tasks even when full |
| **Rate Limiting** | Limit task enqueue rate per tenant |
| **System Load** | Monitor RAM/CPU, reject tasks when overloaded |

#### 2.13 CLI Interface

| Command | Description |
|---------|-------------|
| **enqueue** | Submit new task to queue |
| **list** | List tasks with filters (status, category, tenant) |
| **inspect** | Inspect task details (state, history, metadata) |
| **cancel** | Cancel task (if not RUNNING) |
| **retry** | Retry failed task from DLQ or FAILED state |
| **drain** | Drain queue (wait for all tasks to complete) |
| **validate** | Validate task structure without enqueueing |
| **run** | Run scheduler (daemon mode) |

**Framework**: Clap for argument parsing and help generation.

#### 2.14 Storage

| Feature | Description |
|---------|-------------|
| **SQLite Database** | Persistent task storage |
| **WAL Mode** | Write-Ahead Logging for performance |
| **Task Table** | Store task metadata, state, history |
| **Lease Table** | Store active leases |
| **DLQ Table** | Store Dead Letter Queue tasks |
| **Audit Table** | Store audit logs |
| **Indexes** | Optimized queries for common operations |

---

### OUT Scope

| Category | Items (NOT IN SCOPE) |
|----------|---------------------|
| **Execution Logic** | No workflow execution, no step processing - delegated to yaml-to-rust-agentsdk |
| **LLM Calls** | No LLM inference, no prompt handling - delegated to yaml-to-rust-agentsdk |
| **Tool Invocation** | No tool execution, no file operations - delegated to yaml-to-rust-agentsdk |
| **YAML Parsing** | No workflow schema validation - delegated to yaml-to-rust-agentsdk |
| **Model Selection** | No intelligent model routing - delegated to model-router |
| **Task Classification** | No task type classification - delegated to model-router |
| **UI/UX** | No graphical user interface, no web interface, no TUI - delegated to Whitt |
| **Authentication** | No user authentication, no authorization - delegated to future enhancements |
| **Resource Management** | No CPU/RAM allocation, no process management - delegated to OS |
| **Network Access** | No external API calls, no webhooks (except notifications) |
| **Persistence** | No long-term storage of workflows - only queue state and metadata |
| **Metrics Collection** | No detailed execution metrics - delegated to yaml-to-rust-agentsdk |
| **Benchmarking** | No performance benchmarking - delegated to yaml-to-rust-agentsdk |

---

## 3. model-router Scope

### Location
`~/code/model-router/`

### Mission
**Model Selection ONLY**: Provide intelligent model routing based on task classification, similarity-aware ranking, and multi-stage verification. No execution, no scheduling, no UI.

---

### IN Scope

#### 3.1 Two-Layer Routing

| Layer | Description |
|-------|-------------|
| **Layer 1: Task Classification** | Classify task into categories (code-generation, analysis, qa, summarization) |
| **Layer 2: Model Ranking** | Rank models within category based on task requirements |

**Routing Flow**:
1. User submits task prompt
2. Task embedding generated
3. Task classified (layer 1)
4. Model candidates retrieved (layer 2)
5. Models ranked by relevance
6. Top model selected (or top N for ensemble)

#### 3.2 Hybrid Retrieval

| Component | Description |
|-----------|-------------|
| **Dense Vector Retrieval** | KNN search on task embeddings |
| **Sparse BM25 Retrieval** | Keyword-based retrieval |
| **Hybrid Scoring** | Combine dense and sparse scores with learned weights |
| **Query Expansion** | Expand query with synonyms and related terms |
| **Re-Ranking** | Re-rank top results with cross-encoder |

#### 3.3 Similarity-Aware Statistics

| Feature | Description |
|---------|-------------|
| **Task Embeddings** | Generate embeddings for task prompts |
| **KNN Search** | Find similar historical tasks |
| **Performance Statistics** | Aggregate performance metrics per model-task pair |
| **Success Rates** | Track success rate per model-task combination |
| **Latency Statistics** | Track average latency per model-task combination |

#### 3.4 Adaptive Ranking

| Stage | Description |
|-------|-------------|
| **Static Ranking** | Rule-based ranking (model specs, context window) |
| **Learned Ranking** | ML-based ranking (train on historical performance) |
| **Real-Time Ranking** | Update rankings based on recent task outcomes |
| **Cold Start** | Use static ranking when insufficient data |

#### 3.5 Specialization-Based Retry Budgets

| Feature | Description |
|---------|-------------|
| **Model Specialization** | Track model specialization (e.g., "good at code", "good at math") |
| **Retry Allocation** | Allocate retry budget to specialized models |
| **Fallback Chain** | Define fallback chain per task category |
| **Budget Depletion** | Stop retrying when budget exhausted |

#### 3.6 Multi-Stage Verification Chains

| Stage | Description |
|-------|-------------|
| **Output Verification** | Validate LLM output (format, constraints) |
| **Consistency Check** | Check output consistency across models |
| **Quality Score** | Assign quality score to model output |
| **Chain Termination** | Stop when quality threshold met or max stages reached |

#### 3.7 Model Catalog Management

| Feature | Description |
|---------|-------------|
| **Model Registry** | Register available models (name, params, context window) |
| **Hardware Tiers** | Categorize models by hardware requirements (low, medium, high) |
| **Performance Benchmarks** | Store benchmark results per model |
| **Metadata** | Store model metadata (license, architecture, training data) |
| **Version Tracking** | Track model versions and updates |

---

### OUT Scope

| Category | Items (NOT IN SCOPE) |
|----------|---------------------|
| **Execution Logic** | No workflow execution, no step processing - delegated to yaml-to-rust-agentsdk |
| **LLM Calls** | No LLM inference, no prompt handling - delegated to yaml-to-rust-agentsdk |
| **Scheduling** | No task scheduling, no priority management - delegated to agent-queue |
| **State Management** | No task state tracking - delegated to agent-queue |
| **UI/UX** | No graphical user interface, no web interface, no TUI - delegated to Whitt |
| **Authentication** | No user authentication, no authorization |
| **Persistence** | No long-term storage - only model catalog and routing metadata |
| **Metrics Collection** | No detailed execution metrics - delegated to yaml-to-rust-agentsdk |
| **Network Access** | No external API calls - local only |

---

## 4. Whitt Scope

### Location
`~/code/whitt/`

### Mission
**UI/TUI ONLY**: Provide desktop and terminal-based user interfaces for interacting with workflows, queue, and artifacts. No execution logic, no scheduling, no model routing, no direct LLM calls.

---

### IN Scope

#### 4.1 Desktop UI (Tauri Shell)

| Feature | Description |
|---------|-------------|
| **Window Management** | Multi-window support, minimize/maximize/close |
| **System Tray** | Tray icon with quick actions (show, hide, queue status) |
| **Notifications** | System notifications for task completion/failure |
| **Auto-Start** | Option to start on OS boot |
| **Keyboard Shortcuts** | Global shortcuts for common actions |
| **Theme Support** | Dark/light mode, custom themes |
| **Accessibility** | Screen reader support, keyboard navigation |

#### 4.2 React Frontend

| Component | Description |
|-----------|-------------|
| **Chat Interface** | Conversational UI for prompt input and AI responses |
| **Chat Session Management** | Create, switch, archive, delete chat sessions |
| **Message History** | Display conversation history with timestamps |
| **Prompt Suggestions** | Suggest prompt templates and auto-complete |
| **Response Formatting** | Rich text formatting (markdown, code blocks) |
| **Message Actions** | Copy, regenerate, save to file |

#### 4.3 Queue Visualization

| Component | Description |
|-----------|-------------|
| **Task List** | Display queued, running, completed, failed tasks |
| **Task Status** | Show task status (10 states) with color coding |
| **Progress Tracking** | Progress bars for running tasks |
| **Task Details** | Expandable details panel for task metadata |
| **Task Ordering** | Sort by priority, status, timestamp |
| **Filtering** | Filter by status, category, user |
| **Pagination** | Paginated task list for large queues |

#### 4.4 Artifact Browser

| Component | Description |
|-----------|-------------|
| **File Viewer** | View generated files (code, data, logs) |
| **Syntax Highlighting** | Code syntax highlighting for multiple languages |
| **File Navigation** | Tree view for exploring artifacts directory |
| **File Search** | Search across artifacts (fulltext) |
| **File Actions** | Download, open in external editor, delete |
| **Diff View** | Compare file versions (if versioning enabled) |

#### 4.5 Settings Panel

| Category | Settings |
|----------|----------|
| **Model Configuration** | Select default model, configure backends (LM Studio, Ollama) |
| **Backend Selection** | Choose LLM backend, configure endpoint URLs |
| **Resource Limits** | Set max concurrent workflows, RAM limits |
| **Queue Settings** | Configure queue preferences, notifications |
| **UI Settings** | Theme, font size, layout preferences |
| **Storage Settings** | Artifact directory, retention policy |
| **Advanced** | Debug mode, logging level, API keys (future) |

#### 4.6 TUI Mode (Ratatui)

| Feature | Description |
|---------|-------------|
| **Terminal UI** | Full-featured terminal interface (no X11/wayland required) |
| **Headless Operation** | Works over SSH, on servers without GUI |
| **Feature Parity** | Same functionality as desktop UI |
| **Keyboard Navigation** | Vim-like keybindings |
| **Layout Management** | Split panes, resizable panels |
| **Color Themes** | Multiple color schemes (dracula, solarized, etc.) |

#### 4.7 Smart Blocking

| Feature | Description |
|---------|-------------|
| **Active Execution Lock** | Prevent new chat creation while task running |
| **Queue Management** | Queue new chats behind active execution |
| **Priority Override** | Allow canceling current task for new high-priority task |
| **Execution Limits** | Limit concurrent executions (configurable) |

#### 4.8 Future Features (Post-MVP)

| Feature | Description |
|---------|-------------|
| **Drag-and-Drop Workflow Builder** | Visual workflow editor with drag-and-drop steps |
| **Quality Metrics Dashboard** | Display performance metrics, benchmarks, trends |
| **Automation Scheduling UI** | UI for scheduling recurring workflows (cron) |
| **Human Override Controls** | Manual intervention buttons (pause, resume, cancel) |
| **P2P Gamification Interface** | Leaderboards, achievements for workflow sharing |

---

### OUT Scope

| Category | Items (NOT IN SCOPE) |
|----------|---------------------|
| **Execution Logic** | No workflow execution, no step processing - delegated to yaml-to-rust-agentsdk |
| **LLM Calls** | No direct LLM API calls - delegated to yaml-to-rust-agentsdk |
| **Scheduling** | No task scheduling, no priority management - delegated to agent-queue |
| **Queue Management** | No queue state manipulation (except via CLI) - delegated to agent-queue |
| **Model Selection** | No model routing logic - delegated to model-router |
| **Task Classification** | No task type classification - delegated to model-router |
| **Persistence** | No long-term storage - delegated to agent-queue and yaml-to-rust-agentsdk |
| **Authentication** | No user authentication, no authorization - single-user for MVP |
| **Multi-Tenancy** | No tenant isolation - delegated to agent-queue |
| **Network Access** | No external API calls - local only |
| **Metrics Collection** | No detailed execution metrics - delegated to yaml-to-rust-agentsdk |
| **Audit Logging** | No audit log storage - delegated to agent-queue |

---

## 5. Integration Points

### 5.1 Communication Protocols

| Direction | Protocol | Purpose |
|-----------|----------|---------|
| **Whitt → yaml-to-rust-agentsdk** | CLI subprocess (stdin/stdout JSON) | Compile and execute workflows |
| **Whitt → agent-queue** | CLI subprocess (stdin/stdout JSON) | Enqueue, list, cancel tasks |
| **agent-queue → yaml-to-rust-agentsdk** | CLI subprocess (stdin/stdout JSON) | Dispatch tasks for execution |
| **yaml-to-rust-agentsdk → model-router** | Function call (future) | Model selection and routing |

### 5.2 Data Flow

```
User Input (Whitt)
    ↓
Workflow Compilation (yaml-to-rust-agentsdk)
    ↓
Task Enqueuing (agent-queue)
    ↓
Task Scheduling (agent-queue)
    ↓
Task Execution (yaml-to-rust-agentsdk)
    ↓
Model Selection (model-router)
    ↓
LLM Inference (yaml-to-rust-agentsdk)
    ↓
Result Streaming (agent-queue)
    ↓
UI Update (Whitt)
```

### 5.3 Shared Storage

| Storage Type | Owner | Consumer |
|--------------|-------|----------|
| **Workflows** | yaml-to-rust-agentsdk | Whitt (view), agent-queue (execute) |
| **Queue State** | agent-queue | Whitt (display) |
| **Artifacts** | yaml-to-rust-agentsdk | Whitt (browse) |
| **Model Catalog** | model-router | yaml-to-rust-agentsdk (query) |
| **Metrics** | yaml-to-rust-agentsdk | Whitt (display - future) |

---

## 6. Strict Boundary Enforcement

### 6.1 Cross-Project Dependencies

| Project | Can Call | Cannot Call |
|---------|----------|-------------|
| **Whitt** | yaml-to-rust-agentsdk CLI, agent-queue CLI | model-router (no direct access) |
| **agent-queue** | yaml-to-rust-agentsdk CLI (for execution) | Whitt, model-router |
| **yaml-to-rust-agentsdk** | model-router (for model selection) | Whitt, agent-queue |
| **model-router** | None (read-only catalog) | Whitt, agent-queue, yaml-to-rust-agentsdk |

### 6.2 No Circular Dependencies

- **Whitt** → **yaml-to-rust-agentsdk** (compile) → **model-router** (select) ✅
- **Whitt** → **agent-queue** (enqueue) → **yaml-to-rust-agentsdk** (execute) ✅
- **yaml-to-rust-agentsdk** → **model-router** (select) ✅
- **agent-queue** → **yaml-to-rust-agentsdk** (execute) ✅

**Forbidden**:
- agent-queue → Whitt ❌ (no UI dependencies)
- model-router → yaml-to-rust-agentsdk ❌ (no execution dependencies)
- yaml-to-rust-agentsdk → agent-queue ❌ (no queue dependencies)

### 6.3 Data Ownership

| Data | Owner | Read Access | Write Access |
|------|-------|-------------|--------------|
| **Workflow Definitions** | yaml-to-rust-agentsdk | Whitt (view) | yaml-to-rust-agentsdk only |
| **Queue State** | agent-queue | Whitt (view) | agent-queue only |
| **Task Metadata** | agent-queue | Whitt (view) | agent-queue only |
| **Execution Metrics** | yaml-to-rust-agentsdk | Whitt (view - future) | yaml-to-rust-agentsdk only |
| **Model Catalog** | model-router | yaml-to-rust-agentsdk (query) | model-router only |
| **Artifacts** | yaml-to-rust-agentsdk | Whitt (view, download) | yaml-to-rust-agentsdk only |

### 6.4 API Boundaries

| Project | Public API | Internal API |
|---------|-----------|--------------|
| **Whitt** | React components, Tauri commands | Internal state management |
| **agent-queue** | CLI (stdin/stdout JSON) | Internal state machine |
| **yaml-to-rust-agentsdk** | CLI (stdin/stdout JSON), Rust library (future) | Internal compilation pipeline |
| **model-router** | Python API (function calls) | Internal ML models |

### 6.5 Testing Boundaries

| Project | Unit Tests | Integration Tests | E2E Tests |
|---------|-----------|-------------------|------------|
| **Whitt** | React components, Tauri commands | CLI integration (mock subprocess) | Full workflow (future) |
| **agent-queue** | State machine, scheduling logic | SQLite persistence, CLI | Task lifecycle (future) |
| **yaml-to-rust-agentsdk** | Parser, compiler, executor | LLM backend mocks, tool mocks | Full workflow execution |
| **model-router** | Retrieval, ranking, classification | Model catalog integration | End-to-end routing |

---

## 7. Security and Privacy

### 7.1 Local-First Design

| Principle | Implementation |
|-----------|----------------|
| **No External Network** | All components run locally, no external API calls |
| **Data Privacy** | User data never leaves local machine |
| **Air-Gap Operation** | Full functionality without internet connection |
| **No Telemetry** | No data collection or analytics (opt-in future) |

### 7.2 Permission Model

| Operation | Permission Required | UI Prompt |
|-----------|---------------------|-----------|
| **File Read** | Directory access grant | Yes (first time) |
| **File Write** | Directory access grant | Yes (first time) |
| **Shell Execution** | Explicit approval per command | Yes (every time) |
| **Network Access** | Not allowed in MVP | N/A |
| **Model Access** | Backend selection approval | Yes (configuration) |

### 7.3 Sandboxing

| Component | Sandboxing Strategy |
|-----------|-------------------|
| **File Operations** | Path validation, directory restrictions |
| **Shell Execution** | Timeout, working directory restriction, output size limit |
| **LLM Calls** | No external network, local backends only |
| **Resource Usage** | RAM/CPU limits, process isolation |

---

## 8. MVP Scope Summary

### Included in MVP

| Feature | Whitt | agent-queue | yaml-to-rust-agentsdk | model-router |
|---------|-------|------------|----------------------|--------------|
| **Desktop UI** | ✅ Basic chat + queue view | ❌ | ❌ | ❌ |
| **TUI Mode** | ✅ Full feature parity | ❌ | ❌ | ❌ |
| **Task Enqueue** | ✅ Via CLI | ✅ | ❌ | ❌ |
| **Task Scheduling** | ❌ | ✅ EDF + Priority | ❌ | ❌ |
| **Workflow Execution** | ❌ | ❌ | ✅ Full pipeline | ❌ |
| **LLM Backends** | ❌ | ❌ | ✅ Local only | ❌ |
| **Model Selection** | ❌ | ❌ | ✅ Manual selection | ❌ Basic catalog |
| **Tool Execution** | ❌ | ❌ | ✅ File + Shell | ❌ |
| **Checkpoints** | ❌ | ❌ | ✅ | ❌ |
| **Metrics** | ❌ Display basic | ❌ Queue metrics only | ✅ Execution metrics | ❌ |
| **Docker Packaging** | ❌ | ❌ | ✅ Basic | ❌ |
| **RAG** | ❌ | ❌ | ✅ Basic | ❌ Embeddings only |

### Excluded from MVP

| Feature | Whitt | agent-queue | yaml-to-rust-agentsdk | model-router |
|---------|-------|------------|----------------------|--------------|
| **Drag-and-Drop Builder** | ❌ | ❌ | ❌ | ❌ |
| **Quality Dashboard** | ❌ | ❌ | ❌ | ❌ |
| **Automation Scheduling UI** | ❌ | ✅ CLI only | ❌ | ❌ |
| **Human Override** | ❌ | ❌ | ❌ | ❌ |
| **P2P Gamification** | ❌ | ❌ | ❌ | ❌ |
| **Multi-Tenancy** | ❌ | ❌ | ❌ | ❌ |
| **Authentication** | ❌ | ❌ | ❌ | ❌ |
| **External LLM APIs** | ❌ | ❌ | ❌ | ❌ |
| **Advanced RAG** | ❌ | ❌ | ❌ | ❌ |
| **Work Stealing** | ❌ | ✅ Basic | ❌ | ❌ |
| **Learned Ranking** | ❌ | ❌ | ❌ | ❌ |

---

## Appendix: Project File Structure

```
/home/jon/code/
├── whitt/                           # Layer 1: User Interface
│   ├── opencode/
│   │   └── plans/
│   │       ├── ARCHITECTURE.md       # This file's companion
│   │       └── PROJECT-SCOPES.md     # This file
│   ├── src-tauri/                   # Tauri backend (Rust)
│   │   ├── src/
│   │   │   ├── lib.rs               # Tauri commands
│   │   │   ├── commands/            # CLI subprocess calls
│   │   │   └── utils.rs
│   │   └── Cargo.toml
│   ├── src/                         # React frontend (TypeScript)
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── Chat.tsx             # Chat interface
│   │   │   ├── QueuePanel.tsx       # Queue visualization
│   │   │   ├── ArtifactBrowser.tsx  # File viewer
│   │   │   └── Settings.tsx         # Settings panel
│   │   ├── hooks/
│   │   ├── store/                   # Zustand state management
│   │   └── utils/
│   ├── src-tui/                     # Ratatui TUI (Rust) - Optional
│   │   ├── src/
│   │   │   ├── main.rs
│   │   │   ├── app.rs
│   │   │   ├── ui/
│   │   │   └── event.rs
│   │   └── Cargo.toml
│   └── package.json
│
├── yaml-to-rust-agentsdk/           # Layer 3: Execution Engine
│   ├── src/
│   │   ├── main.rs                  # CLI entrypoint
│   │   ├── parser.rs                # YAML schema parsing
│   │   ├── compiler.rs              # WorkflowSpec → WorkflowIR
│   │   ├── executor.rs              # Step execution engine
│   │   ├── dag.rs                   # DAG validation
│   │   ├── variable.rs              # Variable interpolation
│   │   ├── backends/
│   │   │   ├── mod.rs               # LlmBackend trait
│   │   │   ├── lm_studio.rs         # LM Studio backend
│   │   │   ├── ollama.rs            # Ollama backend
│   │   │   ├── llama_cpp.rs         # llama.cpp backend
│   │   │   └── openai_compat.rs     # OpenAI-compatible backend
│   │   ├── tools/
│   │   │   ├── mod.rs               # Tool trait
│   │   │   ├── file.rs              # File operations
│   │   │   ├── shell.rs             # Shell execution
│   │   │   └── web.rs               # HTTP requests (local only)
│   │   ├── subworkflow.rs           # Nested workflows
│   │   ├── codegen.rs               # Binary generation
│   │   ├── docker.rs                # Docker packaging
│   │   ├── rag.rs                   # RAG integration
│   │   ├── checkpoint.rs            # Checkpoint/resume
│   │   ├── metrics.rs               # Metrics collection
│   │   ├── self_improve.rs          # Self-improvement loop
│   │   ├── benchmark.rs             # Benchmarking
│   │   ├── memory.rs                # Memory and search
│   │   └── cli.rs                   # Clap CLI commands
│   ├── tests/
│   │   ├── integration/
│   │   └── unit/
│   ├── Cargo.toml
│   └── README.md
│
├── agent-queue/                     # Layer 2: Queue Orchestration
│   ├── src/
│   │   ├── main.rs                  # CLI entrypoint
│   │   ├── scheduler.rs             # Scheduling algorithms
│   │   ├── state_machine.rs         # 10-state lifecycle
│   │   ├── lease.rs                 # Lease protocol
│   │   ├── retry.rs                 # Retry logic
│   │   ├── dlq.rs                   # Dead Letter Queue
│   │   ├── tenant.rs                # Multi-tenancy and quotas
│   │   ├── priority.rs              # Priority scheduling
│   │   ├── work_stealing.rs         # Work stealing
│   │   ├── hooks.rs                 # Event-driven hooks
│   │   ├── audit.rs                 # Audit logging
│   │   ├── backpressure.rs          # Backpressure mechanism
│   │   ├── storage.rs               # SQLite persistence
│   │   └── cli.rs                   # Clap CLI commands
│   ├── tests/
│   │   ├── integration/
│   │   └── unit/
│   ├── Cargo.toml
│   └── README.md
│
└── model-router/                    # Layer 3/4: Model Selection
    ├── src/
    │   ├── __init__.py
    │   ├── router.py                # Two-layer routing
    │   ├── retrieval.py             # Hybrid vector + BM25
    │   ├── ranking.py               # Adaptive ranking
    │   ├── classification.py        # Task classification
    │   ├── verification.py           # Multi-stage verification
    │   ├── catalog.py               # Model catalog
    │   ├── embeddings.py            # Embedding generation
    │   └── api.py                   # Python API
    ├── tests/
    │   ├── integration/
    │   └── unit/
    ├── pyproject.toml
    ├── requirements.txt
    └── README.md
```
