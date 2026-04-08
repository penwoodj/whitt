# Communication Protocol Specification

> **Version**: 1.0
> **Scope**: How Whitt, agent-queue, yaml-to-rust-agentsdk, and model-router communicate

---

## Design Principle: CLI-First, Zero-Network

All projects communicate via **CLI subprocess invocation** in the MVP. No HTTP servers, no REST APIs, no WebSocket connections, no gRPC, no D-Bus. Just stdin/stdout/stderr with JSON payloads.

**Why CLI subprocess?**
1. Simplest possible integration - any language can call a CLI
2. No network ports needed (security: no attack surface)
3. Process isolation (crash in one doesn't crash others)
4. Easy to test (mock CLI output)
5. Works offline (no DNS, no TLS, no routing)

**Post-MVP evolution**: Rust library API (direct function calls via Cargo dependency) - still no network.

---

## Protocol 1: Whitt → yaml-to-rust-agentsdk

### 1a: Compile Prompt to Workflow

```
COMMAND:
  yaml-to-rust-agentsdk compile \
    --prompt "How do I write a Rust function?" \
    --format json \
    --output /tmp/whitt-workflow-001.yaml

STDOUT (success):
  {
    "status": "success",
    "workflow_path": "/tmp/whitt-workflow-001.yaml",
    "steps": 3,
    "estimated_tokens": 1500,
    "models_required": ["llama3-8b"],
    "tools_required": ["file_write"]
  }

STDERR (error):
  {
    "status": "error",
    "error_type": "compilation_failed",
    "message": "Prompt too ambiguous - cannot determine workflow structure",
    "suggestions": ["Try: 'Write a Rust function that...'"]
  }

EXIT CODE: 0=success, 1=error, 2=validation_warning
```

### 1b: Execute Workflow

```
COMMAND:
  yaml-to-rust-agentsdk execute \
    --workflow /tmp/whitt-workflow-001.yaml \
    --format json \
    --backend lmstudio \
    --model llama3-8b

STDOUT (streaming, NDJSON):
  {"type":"step_start","step_id":"s1","name":"analyze_prompt"}
  {"type":"llm_request","step_id":"s1","model":"llama3-8b","tokens_in":150,"tokens_out":0}
  {"type":"llm_response","step_id":"s1","tokens_out":320}
  {"type":"step_complete","step_id":"s1","duration_ms":4500}
  {"type":"step_start","step_id":"s2","name":"generate_code"}
  {"type":"tool_call","step_id":"s2","tool":"file_write","path":"/output/main.rs"}
  {"type":"tool_result","step_id":"s2","success":true}
  {"type":"step_complete","step_id":"s2","duration_ms":120}
  {"type":"step_start","step_id":"s3","name":"verify_output"}
  {"type":"step_complete","step_id":"s3","duration_ms":200}
  {"type":"workflow_complete","total_duration_ms":4820,"status":"success"}

STDERR (error):
  {"type":"error","step_id":"s2","error":"model_not_found","message":"llama3-8b not available"}

EXIT CODE: 0=success, 1=error, 2=partial_success
```

### 1c: Validate Workflow (Dry Run)

```
COMMAND:
  yaml-to-rust-agentsdk validate \
    --workflow /tmp/whitt-workflow-001.yaml \
    --format json

STDOUT:
  {
    "status": "valid",
    "warnings": [],
    "steps": 3,
    "models_required": ["llama3-8b"],
    "tools_required": ["file_write"]
  }
```

### 1d: List Available Backends and Models

```
COMMAND:
  yaml-to-rust-agentsdk backends list --format json

STDOUT:
  {
    "backends": [
      {
        "name": "lmstudio",
        "type": "local",
        "status": "available",
        "url": "http://localhost:1234",
        "models": [
          {"id": "llama3-8b", "size_gb": 4.5, "context_window": 8192, "loaded": true},
          {"id": "mistral-7b", "size_gb": 4.1, "context_window": 32768, "loaded": false}
        ]
      },
      {
        "name": "ollama",
        "type": "local",
        "status": "available",
        "url": "http://localhost:11434",
        "models": [
          {"id": "codellama-13b", "size_gb": 7.3, "context_window": 16384, "loaded": true}
        ]
      }
    ]
  }
```

---

## Protocol 2: Whitt → agent-queue

### 2a: Enqueue Workflow

```
COMMAND:
  agent-queue enqueue \
    --workflow /tmp/whitt-workflow-001.yaml \
    --priority high \
    --category asap \
    --format json

STDOUT:
  {
    "task_id": "tq_20260407_001",
    "status": "queued",
    "queue_position": 1,
    "estimated_wait_seconds": 0
  }
```

### 2b: List Tasks

```
COMMAND:
  agent-queue list \
    --status all \
    --format json

STDOUT:
  {
    "tasks": [
      {
        "task_id": "tq_20260407_001",
        "status": "running",
        "progress": 0.6,
        "workflow": "whitt-workflow-001.yaml",
        "created_at": "2026-04-07T14:30:00Z",
        "started_at": "2026-04-07T14:30:01Z"
      },
      {
        "task_id": "tq_20260407_002",
        "status": "queued",
        "queue_position": 1,
        "workflow": "whitt-workflow-002.yaml",
        "created_at": "2026-04-07T14:31:00Z"
      }
    ]
  }
```

### 2c: Inspect Task

```
COMMAND:
  agent-queue inspect --task-id tq_20260407_001 --format json

STDOUT:
  {
    "task_id": "tq_20260407_001",
    "status": "running",
    "state_history": [
      {"state": "new", "at": "14:30:00"},
      {"state": "queued", "at": "14:30:00"},
      {"state": "leased", "at": "14:30:01"},
      {"state": "running", "at": "14:30:01"}
    ],
    "current_step": "generate_code",
    "steps_completed": 1,
    "steps_total": 3,
    "tokens_used": {"input": 150, "output": 320},
    "artifacts": ["/output/main.rs"]
  }
```

### 2d: Cancel Task

```
COMMAND:
  agent-queue cancel --task-id tq_20260407_002 --format json

STDOUT:
  {"status": "canceled", "task_id": "tq_20260407_002"}
```

---

## Protocol 3: agent-queue → yaml-to-rust-agentsdk

### 3a: Dispatch Execution (agent-queue calls transpiler)

```
COMMAND (agent-queue spawns this):
  yaml-to-rust-agentsdk execute \
    --workflow /path/to/queued-workflow.yaml \
    --format json \
    --backend lmstudio \
    --model llama3-8b \
    --workspace /tmp/agent-queue/task-tq_001/

STDOUT: Same NDJSON streaming as Protocol 1b

EXIT CODE:
  0 → agent-queue marks task as DONE
  1 → agent-queue marks task as FAILED, enqueues retry
  2 → agent-queue marks task as DONE (with warnings)
```

---

## Protocol 4: Whitt → model-router (Future - Phase C)

### 4a: Route Task to Model

```
COMMAND:
  model-router route \
    --task-type "code_generation" \
    --context "Writing a Rust HTTP server" \
    --hardware '{"ram_gb": 16, "cpu_cores": 8, "gpu": false}' \
    --format json

STDOUT:
  {
    "recommended_model": "codellama-13b",
    "backend": "ollama",
    "confidence": 0.87,
    "alternatives": [
      {"model": "llama3-8b", "backend": "lmstudio", "confidence": 0.72},
      {"model": "mistral-7b", "backend": "ollama", "confidence": 0.65}
    ],
    "compensations": [],
    "estimated_tokens": 2000,
    "estimated_duration_seconds": 15
  }
```

---

## Error Handling Convention

All CLIs follow this JSON error format on stderr:

```json
{
  "error_type": "enum_value",
  "message": "Human-readable description",
  "context": {
    "step_id": "s2",
    "model": "llama3-8b"
  },
  "suggestions": ["Try X", "Check Y"],
  "retryable": true
}
```

### Standard Error Types

| Error Type | Retryable | User Action |
|------------|-----------|-------------|
| `model_not_found` | No | Install model or select different one |
| `model_unavailable` | Yes | Wait for model to load, or select different one |
| `compilation_failed` | No | Rephrase prompt |
| `execution_timeout` | Yes | Simplify workflow or increase timeout |
| `tool_not_found` | No | Install required tool |
| `permission_denied` | No | Grant file/tool permission |
| `out_of_memory` | No | Use smaller model, reduce batch size |
| `backend_offline` | Yes | Start backend (LM Studio / Ollama) |
| `invalid_workflow` | No | Fix workflow YAML |
| `queue_full` | Yes | Wait for slot or cancel existing task |

---

## Post-MVP: Library API (Phase B+)

After MVP stabilizes, migrate to direct Rust library calls:

```rust
// In whitt's Cargo.toml:
// [dependencies]
// yaml-to-rust-agentsdk = { path = "../yaml-to-rust-agentsdk" }
// agent-queue = { path = "../agent-queue" }

use yaml_to_rust_agentsdk::{Engine, WorkflowSpec, ExecuteOptions};
use agent_queue::{QueueClient, TaskPriority};

// Direct function call - no subprocess overhead
let engine = Engine::new(ExecuteOptions::default())?;
let result = engine.execute(&workflow).await?;

let queue = QueueClient::local()?;
let task_id = queue.enqueue(workflow, TaskPriority::High).await?;
let status = queue.inspect(&task_id).await?;
```

This eliminates:
- Process spawn overhead (~50-100ms per call)
- JSON serialization/deserialization overhead
- Filesystem-based workflow passing
- Stdin/stdout buffering latency

But it requires:
- Shared Cargo workspace or path dependencies
- ABI compatibility between Rust versions
- Careful error handling across FFI boundaries (not an issue in Rust)
