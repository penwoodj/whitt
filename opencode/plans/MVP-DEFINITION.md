# Whitt MVP Definition

> **Version**: 1.0
> **Target Hardware**: 16GB DDR4 RAM desktop, CPU-only
> **Philosophy**: Works even if slow. Optimize later.

---

## MVP Goal

Build a **chat bot** Tauri desktop application that:
1. Accepts natural language prompts from the user
2. Compiles prompts into executable YAML workflows via yaml-to-rust-agentsdk CLI
3. Executes workflows locally using yaml-to-rust-agentsdk CLI
4. Displays results in a chat-style interface
5. Queues additional chats when compute is busy (smart blocking)
6. Works on a 16GB desktop without crashing

---

## MVP Features (In Scope)

### F1: Chat Interface
- Multi-session chat (create, switch between conversations)
- Message history (persisted locally)
- Markdown rendering for LLM responses
- Code syntax highlighting
- Image/file attachment support (future)

### F2: Workflow Execution
- Send prompt to yaml-to-rust-agentsdk CLI for compilation
- Display compilation status (compiling → ready → error)
- Execute compiled workflow via yaml-to-rust-agentsdk CLI
- Stream execution progress (step-by-step updates)
- Display final results in chat
- Handle execution errors gracefully (show error, offer retry)

### F3: Smart Blocking Queue
- When a workflow is executing, new prompts enter a send-order queue
- Queue is visible in the UI (separate panel or sidebar)
- Queue items show: prompt preview, status (waiting/running/done/failed), timestamp
- User can reorder queue items (drag-and-drop or up/down buttons)
- User can cancel queued items
- User can skip to a specific queue item (cancel everything before it)

### F4: Queue Visualization Panel
- Sidebar or panel showing all queue items
- Status indicators: waiting (gray), running (blue pulse), done (green), failed (red)
- Progress bars for running items
- Click to view details of any queue item
- Sort by: time added, status, priority

### F5: Settings Panel (Basic)
- Backend selection (LM Studio / Ollama / llama.cpp)
- Backend connection URL (default: localhost)
- Model selection (list available models from backend)
- Resource limits (max RAM for models, concurrent workflows)
- Working directory (where workflows can access files)
- Theme selection (light/dark)

### F6: Tauri Shell Features
- System tray icon (show/hide, quick status)
- Native notifications (workflow complete, error)
- Window management (remember size/position)
- Auto-start on login (optional)

### F7: Local-Only Operation
- NO internet connectivity required
- NO external LLM API calls
- All models run locally via LM Studio, Ollama, or llama.cpp
- All files accessed locally (sandboxed to working directory)

---

## MVP NOT In Scope

These are **deferred** to post-MVP phases:

### Deferred to Phase B (Local Network)
- Multi-machine orchestration
- LAN model distribution
- Remote model discovery
- TUI mode (terminal interface)

### Deferred to Phase C (Model Router)
- Automatic model selection
- Hardware-aware workflow modification
- Model switching mid-workflow

### Deferred to Phase D (P2P)
- Peer-to-peer compute sharing
- Gamification mechanics
- Workflow marketplace
- Proof-of-satisfaction
- Compute credit system

### Deferred to Future
- Drag-and-drop workflow builder
- Visual workflow editor
- Artifact browser (view generated files/images)
- Quality metrics dashboard
- Automation scheduling UI
- Human override controls for autonomous execution
- Plugin/MCP integration UI
- Custom tool configuration UI
- Mobile/Android UI

---

## Architecture for MVP

```
┌─────────────────────────────────────────────┐
│                   WHITT                     │
│  ┌───────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Chat UI  │  │  Queue   │  │ Settings │ │
│  │  (React)  │  │  Panel   │  │  Panel   │ │
│  └─────┬─────┘  └────┬─────┘  └──────────┘ │
│        │              │                     │
│  ┌─────┴──────────────┴──────────────────┐  │
│  │        Tauri Command Layer            │  │
│  │  (spawn CLI processes, parse output)  │  │
│  └──────────┬───────────┬───────────────┘  │
└─────────────┼───────────┼───────────────────┘
              │           │
    ┌─────────▼──────┐  ┌▼───────────────┐
    │ yaml-to-rust   │  │  agent-queue   │
    │ agentsdk CLI   │  │     CLI        │
    │ (execute)      │  │  (enqueue)     │
    └────────┬───────┘  └───────┬────────┘
             │                  │
             │     ┌────────────▼──────┐
             │     │  agent-queue CLI  │
             │     │  (run - dispatch) │
             │     └────────┬──────────┘
             │              │
             ◄──────────────┘
     (agent-queue dispatches
      to yaml-to-rust-agentsdk
      for execution)
```

### Communication in MVP

All communication is **CLI subprocess invocation** - no network, no HTTP, no IPC.

```rust
// Tauri command to execute a workflow
#[tauri::command]
async fn execute_workflow(prompt: String) -> Result<ExecutionResult, String> {
    // 1. Compile prompt to workflow
    let output = Command::new("yaml-to-rust-agentsdk")
        .args(["compile", "--prompt", &prompt, "--format", "json"])
        .output()
        .map_err(|e| format!("Failed to compile: {}", e))?;

    let workflow: WorkflowSpec = serde_json::from_slice(&output.stdout)
        .map_err(|e| format!("Parse error: {}", e))?;

    // 2. Execute workflow
    let exec_output = Command::new("yaml-to-rust-agentsdk")
        .args(["execute", "--workflow", "-"])
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to execute: {}", e))?;

    // 3. Stream results to UI via events
    // ... event emitter pattern
}
```

---

## Resource Budget (16GB Desktop)

| Component | Max RAM | Notes |
|-----------|---------|-------|
| Whitt (Tauri + React) | 200-400MB | Electron-free, native |
| yaml-to-rust-agentsdk | 100-200MB | Rust runtime + workflow state |
| agent-queue | 50-100MB | SQLite + scheduler |
| LLM Model (7B Q4) | ~4.5GB | Fits comfortably |
| LLM Model (13B Q4) | ~7.5GB | Tight but workable |
| OS + Other | ~4GB | Linux desktop overhead |
| **Total (7B model)** | ~9-10GB | Safe margin |
| **Total (13B model)** | ~12-13GB | Tight, monitor closely |

### Memory Safety Rules
1. Whitt monitors available RAM before enqueueing
2. If RAM < 2GB free → reject new workflow with "low memory" message
3. agent-queue enforces max concurrent workflows (default: 1 for 16GB)
4. Model loading/unloading managed by backend (LM Studio handles this)
5. OOM protection: whitt catches SIGTERM from OS, gracefully shuts down

### CPU Considerations
- Model inference is CPU-bound (no GPU)
- 7B model: ~5-15 tokens/sec on modern CPU
- Expect slow but functional responses
- User should be informed about expected speed

---

## UI Layout (MVP)

```
┌──────────────────────────────────────────────────┐
│  Whitt - Local AI                    ─  □  ×    │
├────────────┬─────────────────────┬───────────────┤
│            │                     │               │
│  Sessions  │   Chat Area         │  Queue Panel  │
│            │                     │               │
│  > Chat 1  │  User: How do I... │  [1] Running  │
│    Chat 2  │  ┌──────────────┐   │  ▓▓▓▓░░░ 40%  │
│    Chat 3  │  │ AI: Here's   │   │               │
│            │  │ how to do    │   │  [2] Waiting  │
│            │  │ that step... │   │  Prompt: "..."│
│            │  └──────────────┘   │               │
│            │                     │  [3] Waiting  │
│            │  ┌──────────────┐   │  Prompt: "..."│
│            │  │ ▓▓▓▓▓▓▓░░   │   │               │
│            │  │ Compiling... │   │               │
│            │  └──────────────┘   │               │
│            │                     │               │
│            │  ┌──────────────┐   │               │
│            │  │ > Type here  │   │               │
│            │  └──────────────┘   │               │
├────────────┴─────────────────────┴───────────────┤
│  Model: llama3-8b (LM Studio) │ RAM: 3.2/16GB   │
└──────────────────────────────────────────────────┘
```

---

## Success Criteria

1. User can type a prompt and receive an AI-generated response
2. Multiple chat sessions can exist simultaneously
3. Queue properly serializes execution (one at a time)
4. Queue panel shows real-time status updates
5. Application runs for 1 hour without memory leak or crash
6. All models run locally (no network required)
7. Graceful error handling (backend offline, model missing, OOM)
