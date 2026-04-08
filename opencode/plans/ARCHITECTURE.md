# Whitt System Architecture

## 1. System Architecture Overview

The Whitt system is organized into four distinct layers, each with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│ Layer 1: User Interface                                          │
│ ┌──────────────────┐  ┌────────────────────────────────────┐  │
│ │ Whitt (Desktop)   │  │ Whitt (TUI via Ratatui)            │  │
│ │ - Tauri v2        │  │ - Terminal-based UI                │  │
│ │ - React 18 + TS   │  │ - Headless operation               │  │
│ │ - TailwindCSS     │  │ - Same functionality as Desktop    │  │
│ └──────────────────┘  └────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Layer 2: Queue Orchestration                                    │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │ agent-queue (~/code/agent-queue/)                         │  │
│ │ - Task scheduling and prioritization                      │  │
│ │ - State machine management (10 states)                    │  │
│ │ - Lease protocol and retry logic                          │  │
│ │ - 25 queue categories (ASAP, Cron, Rate-Limited, etc.)    │  │
│ │ - Priority scheduling algorithms (EDF, WRR, DRR, Fair Share)│ │
│ │ - Work stealing and backpressure                         │  │
│ └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Layer 3: Execution Engine                                       │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │ yaml-to-rust-agentsdk (~/code/yaml-to-rust-agentsdk/)     │  │
│ │ - YAML schema parsing and validation                     │  │
│ │ - WorkflowSpec → WorkflowIR compilation                  │  │
│ │ - DAG validation (cycles, dependencies)                  │  │
│ │ - Variable interpolation (${static} and {{dynamic}})      │  │
│ │ - Step executor (seq, parallel, conditional, loop)       │  │
│ │ - LLM backend abstraction (LM Studio, Ollama, llama.cpp)│  │
│ │ - Tool execution framework (file, shell, web, custom)     │  │
│ │ - Sub-workflow execution                                 │  │
│ │ - Code generation mode (workflow → standalone binary)     │  │
│ │ - Docker packaging (workflow + runtime + model)          │  │
│ │ - RAG integration (embeddings + vector search)            │  │
│ │ - Checkpointing and resume                                │  │
│ │ - Metrics collection                                      │  │
│ │ - Self-improvement loop (generate-verify-repair)          │  │
│ │ - Quality benchmarks                                     │  │
│ │ - Memory and search (local storage, fulltext, semantic)   │  │
│ └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Layer 4: Infrastructure                                         │
│ ┌────────────────────┐  ┌────────────────────┐  ┌─────────────┐ │
│ │ Local Storage       │  │ Model Runtimes      │  │ File System │ │
│ │ - sled/sqlite (WAL) │  │ - LM Studio         │  │ - Sandboxed │ │
│ │ - Queue state       │  │ - Ollama            │  │ - Permission│ │
│ │ - Workflows         │  │ - llama.cpp         │  │ - Gated     │ │
│ │ - Artifacts         │  │ - OpenAI-compatible │  │ - Read/Write│ │
│ │ - Metrics           │  │ - Custom backends   │  │             │ │
│ └────────────────────┘  └────────────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Layer 1: User Interface (Whitt)
- **Desktop UI**: Tauri v2 desktop application shell providing native window management, system tray integration, and system notifications
- **Frontend Framework**: React 18 with TypeScript for component architecture
- **Styling**: TailwindCSS for utility-first styling
- **TUI Mode**: Ratatui-based terminal interface for headless operation, providing full feature parity with desktop UI

### Layer 2: Queue Orchestration (agent-queue)
- **Scheduling Engine**: Multi-algorithm task scheduling supporting 25 queue categories
- **State Machine**: 10-state lifecycle for task tracking
- **Lease Protocol**: Time-based task assignment with heartbeat monitoring
- **Retry Logic**: Exponential backoff with configurable max attempts
- **Dead Letter Queue**: Isolation of failed tasks for manual inspection
- **Priority Algorithms**: Earliest Deadline First (EDF), Weighted Round Robin (WRR), Deficit Round Robin (DRR), Fair Share
- **Work Stealing**: Dynamic load balancing across worker pools
- **Backpressure**: Resource-aware throttling to prevent overload

### Layer 3: Execution Engine (yaml-to-rust-agentsdk)
- **YAML Parser**: Schema validation and structured parsing of workflow definitions
- **Compilation Pipeline**: WorkflowSpec (YAML) → WorkflowIR (intermediate representation)
- **DAG Validation**: Cycle detection and dependency ordering
- **Variable System**: Static interpolation (`${static}`) and dynamic evaluation (`{{dynamic}}`)
- **Execution Modes**: Sequential, parallel, conditional branches, and loops
- **LLM Backends**: Pluggable interface supporting local model runtimes
- **Tool Framework**: Extensible system for file operations, shell commands, web interactions, and custom tools
- **Sub-workflows**: Nested workflow execution with context isolation
- **Code Generation**: Compilation of workflows into standalone Rust binaries
- **Docker Support**: Containerization of workflows with runtime and model dependencies
- **RAG Integration**: Local embeddings generation and vector similarity search
- **State Management**: Checkpoint/resume capability for long-running workflows
- **Observability**: Metrics collection for performance tracking
- **Self-Improvement**: Generate-verify-repair loop for workflow optimization
- **Quality Assurance**: Benchmarking framework for performance measurement
- **Memory System**: Local storage with fulltext and semantic search capabilities
- **CLI Interface**: Comprehensive command-line interface via Clap

### Layer 4: Infrastructure
- **Storage**: Sled key-value store with SQLite in WAL mode for persistent state
- **Model Runtimes**: Integration with local model servers (LM Studio, Ollama, llama.cpp) and OpenAI-compatible APIs
- **File System**: Sandboxed access with permission gating for security

---

## 2. Data Flow for MVP

### End-to-End Workflow Execution

```
┌─────────────┐
│ 1. User     │  "Write a Python script to parse CSV files"
│    Input    │  → Types prompt in Whitt chat interface
└──────┬──────┘
       ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Prompt Compilation                                         │
│ Whitt → yaml-to-rust-agentsdk CLI                            │
│ Protocol: subprocess with stdin/stdout JSON                 │
│ Request: {"command": "compile", "prompt": "..."}            │
│ Output: Workflow YAML (steps, tools, variables)             │
└──────┬──────────────────────────────────────────────────────┘
       ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Task Enqueuing                                            │
│ Whitt → agent-queue CLI                                      │
│ Protocol: subprocess with stdin/stdout JSON                 │
│ Request: {"command": "enqueue", "workflow": "...",          │
│          "category": "ASAP", "priority": 10}                │
│ Output: {"task_id": "uuid", "status": "QUEUED"}            │
└──────┬──────────────────────────────────────────────────────┘
       ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Task Scheduling & Dispatching                              │
│ agent-queue (internal):                                      │
│ - Task moves from QUEUED → SCHEDULED → LEASED               │
│ - Lease assigned with 60s TTL, 15s heartbeat required      │
│ - agent-queue → yaml-to-rust-agentsdk CLI                   │
│ Request: {"command": "execute", "workflow": "...",          │
│          "task_id": "uuid", "lease_id": "uuid"}            │
└──────┬──────────────────────────────────────────────────────┘
       ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Workflow Execution                                        │
│ yaml-to-rust-agentsdk:                                       │
│ a) Parse and validate workflow YAML                          │
│ b) Compile to WorkflowIR                                     │
│ c) Execute steps in order (DAG traversal)                    │
│    - Step 1: LLM call (generate code skeleton)               │
│    - Step 2: Tool execution (write script to disk)           │
│    - Step 3: LLM call (refine based on CSV structure)        │
│    - Step 4: Tool execution (test script on sample data)     │
│ d) Checkpoint after each step                                │
│ e) Stream progress updates to stdout                        │
│ Protocol: streaming JSON over stdout                          │
│ Messages: {"step": 1, "status": "running", "output": "..."}   │
└──────┬──────────────────────────────────────────────────────┘
       ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Result Propagation                                         │
│ yaml-to-rust-agentsdk → agent-queue → Whitt                  │
│                                                              │
│ yaml-to-rust-agentsdk reports:                               │
│ {"task_id": "uuid", "status": "DONE",                        │
│  "result": {"file": "/path/script.py", "metrics": {...}}}   │
│                                                              │
│ agent-queue updates state: LEASED → RUNNING → DONE          │
│ Triggers webhook/event notification to Whitt                │
└──────┬──────────────────────────────────────────────────────┘
       ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. UI Update                                                  │
│ Whitt receives event via:                                    │
│ - Event-driven hook (webhook, file watcher, timer)          │
│ - Or periodic polling of agent-queue CLI (list command)     │
│                                                              │
│ UI updates:                                                   │
│ - Task status in queue panel                                 │
│ - Progress bar updates                                        │
│ - Artifact browser shows generated Python script             │
│ - Chat shows completion message                              │
│ - Logs panel displays execution trace                        │
└─────────────────────────────────────────────────────────────┘
```

### Streamed Progress Flow

During workflow execution, progress is streamed in real-time:

1. **yaml-to-rust-agentsdk** emits JSON events to stdout:
   ```json
   {"type": "step_start", "step_id": 1, "step_name": "generate_code"}
   {"type": "llm_call", "model": "llama3:8b", "tokens": {"prompt": 150, "completion": 200}}
   {"type": "step_complete", "step_id": 1, "duration_ms": 1250}
   {"type": "step_start", "step_id": 2, "step_name": "write_file"}
   {"type": "tool_execution", "tool": "file", "action": "write", "path": "/tmp/script.py"}
   {"type": "step_complete", "step_id": 2, "duration_ms": 45}
   ```

2. **agent-queue** receives events and updates task state in SQLite

3. **Whitt** polls agent-queue or receives webhook notifications, updating UI

---

## 3. Communication Protocols

### MVP Protocol: CLI Subprocess with JSON

All inter-process communication in MVP uses stdin/stdout JSON over CLI subprocesses. No network layer required.

#### Whitt → yaml-to-rust-agentsdk

**Protocol**: Subprocess execution, JSON request via stdin, JSON response via stdout

**Compile Command**:
```bash
yaml-to-rust-agentsdk compile <<EOF
{
  "prompt": "Write a Python script to parse CSV files",
  "context": {
    "previous_files": ["/data/input1.csv"],
    "user_preferences": {"style": "concise"}
  }
}
EOF
```

**Response**:
```json
{
  "success": true,
  "workflow": {
    "name": "parse_csv_generator",
    "steps": [
      {
        "id": "step_1",
        "type": "llm",
        "model": "llama3:8b",
        "prompt": "${prompt}",
        "output": "code_skeleton"
      },
      {
        "id": "step_2",
        "type": "tool",
        "tool": "file",
        "action": "write",
        "path": "/tmp/script.py",
        "content": "${code_skeleton}"
      }
    ],
    "variables": {
      "prompt": "Write a Python script to parse CSV files"
    }
  }
}
```

**Execute Command**:
```bash
yaml-to-rust-agentsdk execute <<EOF
{
  "workflow": { /* YAML workflow object */ },
  "task_id": "uuid",
  "lease_id": "uuid",
  "stream_progress": true
}
EOF
```

**Streaming Response** (one JSON object per line):
```
{"type": "execution_start", "task_id": "uuid", "workflow_id": "parse_csv_generator"}
{"type": "step_start", "step_id": "step_1", "step_name": "llm_call"}
{"type": "llm_progress", "tokens_generated": 50, "total_tokens": 200}
{"type": "step_complete", "step_id": "step_1", "duration_ms": 1500}
{"type": "step_start", "step_id": "step_2", "step_name": "write_file"}
{"type": "tool_complete", "tool": "file", "path": "/tmp/script.py"}
{"type": "step_complete", "step_id": "step_2", "duration_ms": 45}
{"type": "execution_complete", "task_id": "uuid", "status": "SUCCESS", "duration_ms": 1545}
```

#### Whitt → agent-queue

**Protocol**: Subprocess execution, JSON request via stdin, JSON response via stdout

**Enqueue Command**:
```bash
agent-queue enqueue <<EOF
{
  "workflow": { /* YAML workflow object */ },
  "category": "ASAP",
  "priority": 10,
  "metadata": {
    "source": "whitt",
    "user_id": "default",
    "tags": ["code-generation", "python"]
  }
}
EOF
```

**Response**:
```json
{
  "success": true,
  "task_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "QUEUED",
  "position": 3,
  "eta_seconds": 120
}
```

**List Command**:
```bash
agent-queue list <<EOF
{
  "filter": {
    "status": ["RUNNING", "QUEUED"],
    "limit": 50
  }
}
EOF
```

**Response**:
```json
{
  "tasks": [
    {
      "task_id": "550e8400-e29b-41d4-a716-446655440000",
      "status": "RUNNING",
      "category": "ASAP",
      "priority": 10,
      "started_at": "2026-04-07T10:30:00Z",
      "progress": 0.6,
      "step": "write_file"
    }
  ],
  "total": 1
}
```

**Cancel Command**:
```bash
agent-queue cancel <<EOF
{
  "task_id": "550e8400-e29b-41d4-a716-446655440000",
  "reason": "user_canceled"
}
EOF
```

**Response**:
```json
{
  "success": true,
  "task_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "CANCELED"
}
```

#### agent-queue → yaml-to-rust-agentsdk

**Protocol**: Subprocess execution, JSON request via stdin, JSON streaming via stdout

**Dispatch Command** (agent-queue initiates):
```bash
yaml-to-rust-agentsdk execute <<EOF
{
  "workflow": { /* YAML workflow object */ },
  "task_id": "550e8400-e29b-41d4-a716-446655440000",
  "lease_id": "660e8400-e29b-41d4-a716-446655440001",
  "lease_ttl_seconds": 60,
  "heartbeat_interval_seconds": 15,
  "stream_progress": true
}
EOF
```

**Heartbeat Protocol**:
- yaml-to-rust-agentsdk must emit heartbeat events every 15s
- Missing heartbeat for 60s triggers lease expiration and task re-queue

**Heartbeat Event**:
```json
{
  "type": "heartbeat",
  "task_id": "550e8400-e29b-41d4-a716-446655440000",
  "lease_id": "660e8400-e29b-41d4-a716-446655440001",
  "timestamp": "2026-04-07T10:30:15Z",
  "progress": 0.3,
  "step": "step_2"
}
```

### Future Protocol: Rust Library API

Post-MVP, CLI subprocess calls will be replaced with direct Rust library function calls for performance and type safety.

**Integration Pattern**:
```rust
// Whitt (Tauri backend) imports as libraries
use yaml_to_rust_agentsdk::{compile, execute};
use agent_queue::{enqueue, TaskHandle};

// Direct function calls instead of subprocess
let workflow = compile(prompt, context)?;
let task = enqueue(workflow, category, priority)?;
let result = execute(task, workflow)?.await?;
```

**Benefits**:
- Zero serialization overhead
- Compile-time type checking
- Shared memory for large workflows
- Structured error handling via `Result<T, E>`
- Better performance for high-throughput scenarios

---

## 4. Technology Stack

### Whitt (Layer 1 - User Interface)

| Component | Technology | Version/Details |
|-----------|-----------|----------------|
| **Desktop Shell** | Tauri | v2.0+ (Rust-based cross-platform framework) |
| **Frontend Framework** | React | 18.3+ (with TypeScript) |
| **Language** | TypeScript | 5.5+ |
| **Styling** | TailwindCSS | 3.4+ (utility-first CSS) |
| **UI Components** | shadcn/ui (optional) | For consistent design system |
| **State Management** | Zustand or Redux Toolkit | For global state (chat sessions, queue state) |
| **TUI Framework** | Ratatui | Terminal-based UI (Rust) |
| **Cross-Platform Support** | Windows, macOS, Linux | Native binaries via Tauri |
| **Build Tool** | Vite | Frontend bundler and dev server |
| **Package Manager** | npm/pnpm | Dependency management |

### yaml-to-rust-agentsdk (Layer 3 - Execution Engine)

| Component | Technology | Version/Details |
|-----------|-----------|----------------|
| **Language** | Rust | 1.75+ (stable) |
| **Async Runtime** | Tokio | 1.35+ (multi-threaded async executor) |
| **CLI Framework** | Clap | 4.5+ (argument parsing) |
| **Serialization** | serde | 1.0+ (JSON/YAML) |
| **YAML Parsing** | serde_yaml | 0.9+ |
| **DAG Validation** | petgraph | 0.6+ (graph algorithms) |
| **Template Engine** | handlebars | 5.0+ (variable interpolation) |
| **HTTP Client** | reqwest | 0.11+ (for OpenAI-compatible APIs) |
| **Vector Search** | sqlite-vec (via model-router) | Local RAG integration |
| **Embeddings** | FastEmbed (via model-router) | Python 3.11+ |
| **Docker** | docker-rs | Container generation |
| **Storage** | sled | 0.34+ (embedded key-value store) |
| **Metrics** | metrics crate | 0.21+ (observability) |
| **Logging** | tracing | 0.1+ (structured logging) |
| **Testing** | rstest | 0.18+ (parameterized tests) |
| **Build Tool** | cargo | Rust package manager |

### agent-queue (Layer 2 - Queue Orchestration)

| Component | Technology | Version/Details |
|-----------|-----------|----------------|
| **Language** | Rust | 1.75+ (stable) |
| **Async Runtime** | Tokio | 1.35+ (multi-threaded async executor) |
| **CLI Framework** | Clap | 4.5+ (argument parsing) |
| **Storage** | SQLite | 3.44+ with WAL mode (via rusqlite) |
| **Scheduling Algorithms** | Custom implementation | EDF, WRR, DRR, Fair Share |
| **Concurrency Control** | Tokio channels | Async message passing |
| **Work Stealing** | Crossbeam | Lock-free data structures |
| **Event Hooks** | notify | File watching |
| **Webhooks** | reqwest | HTTP notifications |
| **Metrics** | metrics crate | 0.21+ (observability) |
| **Logging** | tracing | 0.1+ (structured logging) |
| **Testing** | rstest | 0.18+ (parameterized tests) |
| **Build Tool** | cargo | Rust package manager |

### model-router (Layer 3/4 - Model Selection)

| Component | Technology | Version/Details |
|-----------|-----------|----------------|
| **Language** | Python | 3.11+ |
| **Web Framework** | FastAPI | 0.104+ (optional, for REST API) |
| **Vector Database** | sqlite-vec | SQLite extension for vector search |
| **Embeddings** | FastEmbed | 0.2+ (local embeddings) |
| **Sparse Retrieval** | BM25 | Custom implementation |
| **Machine Learning** | scikit-learn | 1.3+ (for ranking models) |
| **Task Classification** | Custom classifier | Two-layer routing (task → model) |
| **Similarity Search** | faiss (optional) | KNN for task embeddings |
| **Caching** | diskcache | Model catalog cache |
| **Logging** | structlog | Structured logging |
| **Testing** | pytest | 7.4+ (test framework) |
| **Package Manager** | uv (preferred) or pip | Dependency management |

### Infrastructure (Layer 4)

| Component | Technology | Version/Details |
|-----------|-----------|----------------|
| **Operating Systems** | Windows 10+, macOS 11+, Linux (Ubuntu 22.04+, Debian 12+) | Supported platforms |
| **Desktop Environment** | Any (for Whitt Desktop), Terminal (for Whitt TUI) | UI requirements |
| **Storage** | Local disk | Sled/SQLite files |
| **Model Runtimes** | LM Studio, Ollama, llama.cpp | Local LLM execution |
| **Container Runtime** | Docker (optional) | For Docker packaging feature |
| **Network** | Localhost only (MVP) | No external dependencies |

---

## 5. Hardware Constraints for MVP

### Target Hardware Profile

| Specification | Value | Implications |
|--------------|-------|--------------|
| **RAM** | 16GB DDR4 | Limits model size (max 7-8B parameters with full precision) |
| **CPU** | Multi-core (4-8 cores recommended) | Parallel workflow execution, concurrent LLM inference |
| **Storage** | SSD preferred (min 50GB free) | Faster workflow storage, model loading |
| **GPU** | None (CPU-only for MVP) | LLM inference on CPU, slower but guaranteed to work |
| **Network** | Not required (local-only) | No external API calls, air-gappable |

### Model Size Constraints

| Model Size | Parameters | RAM Required | VRAM Required | Inference Speed (CPU) |
|-----------|-----------|--------------|--------------|----------------------|
| Tiny | 1-3B | 2-4GB | N/A | Fast (5-15 tok/s) |
| Small | 3-7B | 4-8GB | 4-8GB | Moderate (3-8 tok/s) |
| Medium | 7-13B | 8-16GB | 8-16GB | Slow (1-4 tok/s) |
| **Recommended for MVP** | **3-7B** | **4-8GB** | **4-8GB** | **3-8 tok/s** |

**Supported Models (examples)**:
- Llama 3 8B (fits in 8GB with quantization)
- Mistral 7B (fits in 8GB)
- Phi-3 Mini 3.8B (fast, fits in 4GB)
- Gemma 2B (very fast, fits in 3GB)

### Performance Guarantees

The system must satisfy the following constraints on target hardware:

| Constraint | Requirement | Mitigation Strategy |
|------------|-------------|---------------------|
| **Stability** | Must not crash under load | Queue backpressure, lease timeouts |
| **Resource Limits** | Must respect RAM limits | Model size detection, auto-scaling |
| **Degradation** | Must work even if slow | Graceful degradation, progress indicators |
| **Recovery** | Must resume after crash | Checkpointing, SQLite WAL mode |
| **Concurrency** | Support 1-5 concurrent workflows | Tokio multi-threading, work stealing |

### Backpressure Mechanism

To prevent overload on hardware-constrained systems:

1. **Queue-Level Backpressure**:
   - Enforce maximum queue size (configurable, default 100 tasks)
   - Reject new tasks when queue is full
   - Priority-based admission control

2. **Execution-Level Backpressure**:
   - Limit concurrent workflows (default 2-3)
   - Monitor RAM usage, pause execution if >80%
   - Lease timeouts prevent stuck workflows

3. **LLM-Level Backpressure**:
   - Rate-limit LLM calls per model
   - Queue LLM requests if model is busy
   - Fallback to smaller model if larger model overloaded

### Scaling Strategy

When hardware allows (future enhancements):

| Hardware Tier | Max Concurrent Workflows | Recommended Model Size |
|--------------|------------------------|----------------------|
| **Low** (8GB RAM, 2 cores) | 1-2 | 1-3B parameters |
| **Medium** (16GB RAM, 4 cores) | 3-5 | 3-7B parameters |
| **High** (32GB RAM, 8+ cores, GPU) | 5-10 | 7-13B parameters |
| **Ultra** (64GB+ RAM, GPU) | 10+ | 13-70B parameters |

### Degradation Mode

When system is under heavy load:

1. **Automatic Model Downscaling**: Switch to smaller, faster model
2. **Queue Admission Control**: Reject low-priority tasks
3. **Workflow Throttling**: Limit parallel steps within workflows
4. **Progressive Timeout**: Reduce timeouts for non-critical operations
5. **User Notification**: Inform user of degraded performance

### Monitoring and Alerts

The system must provide visibility into resource utilization:

| Metric | Collection | Alert Threshold |
|--------|------------|-----------------|
| RAM Usage | yaml-to-rust-agentsdk metrics | >85% (warning), >95% (critical) |
| CPU Usage | Tokio runtime metrics | >90% sustained |
| Queue Depth | agent-queue metrics | >80 tasks (warning), >95 (full) |
| Average Latency | agent-queue metrics | >5s for ASAP tasks |
| Model Load Time | yaml-to-rust-agentsdk metrics | >30s (slow) |
| Workflow Failure Rate | agent-queue metrics | >10% (degraded) |

---

## Appendix: File Paths and Project Structure

```
/home/jon/code/
├── whitt/                           # Layer 1: User Interface
│   ├── opencode/
│   │   └── plans/
│   │       ├── ARCHITECTURE.md       # This file
│   │       └── PROJECT-SCOPES.md     # Project boundaries
│   ├── src-tauri/                   # Tauri backend (Rust)
│   ├── src/                         # React frontend (TypeScript)
│   └── package.json
├── yaml-to-rust-agentsdk/           # Layer 3: Execution Engine
│   ├── src/
│   │   ├── parser.rs                # YAML schema parsing
│   │   ├── compiler.rs              # WorkflowSpec → WorkflowIR
│   │   ├── executor.rs              # Step execution
│   │   ├── backends/                # LLM backend implementations
│   │   ├── tools/                   # Tool implementations
│   │   └── cli.rs                   # Clap CLI entrypoint
│   └── Cargo.toml
├── agent-queue/                     # Layer 2: Queue Orchestration
│   ├── src/
│   │   ├── scheduler.rs             # Scheduling algorithms
│   │   ├── state_machine.rs         # 10-state lifecycle
│   │   ├── lease.rs                 # Lease protocol
│   │   ├── storage.rs               # SQLite persistence
│   │   └── cli.rs                   # Clap CLI entrypoint
│   └── Cargo.toml
└── model-router/                    # Layer 3/4: Model Selection
    ├── src/
    │   ├── router.rs                # Two-layer routing
    │   ├── retrieval.rs             # Hybrid vector + BM25
    │   ├── ranking.rs               # Adaptive ranking
    │   └── catalog.rs               # Model catalog
    └── pyproject.toml
```
