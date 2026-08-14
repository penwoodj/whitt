# Aggregate UI Implications: Whitt Ecosystem

> Synthesis of the five per-repo UI implications reports into a single view of **what the whitt UI must do, what it can build on, what's missing, and what the documented vision implies for design.** Read the per-repo reports for evidence and exact quotes.

- **Scope:** `/home/jon/code/whitt` + 4 sibling repos in `~/code/`.
- **Per-repo reports (commit afe624c):**
- [`../whitt/REPORT.md`](../whitt/REPORT.md) — umbrella UI shell (Tauri + React)
- [`../whitt-agent-queue-engine/REPORT.md`](../whitt-agent-queue-engine/REPORT.md) — Layer 2 queue
- [`../whitt-execution-engine/REPORT.md`](../whitt-execution-engine/REPORT.md) — Layer 3 engine (most mature)
- [`../whitt-hardware/REPORT.md`](../whitt-hardware/REPORT.md) — ARM64 SBC port spec
- [`../whitt-model-router/REPORT.md`](../whitt-model-router/REPORT.md) — Model routing design

---

## 1. Ecosystem at a Glance

| Repo | Layer | Maturity | UI Role |
|---|---|---|---|
| `whitt` | 1 — UI shell | Docs only (no Tauri/React scaffold) | **Hosts the UI** |
| `whitt-agent-queue-engine` | 2 — Queue | Docs only (16,592 lines, no Cargo) | **State the UI projects** |
| `whitt-execution-engine` | 3 — Execution | **Working code** (758 tests, 3 binaries, 14 CLI commands) | **Content engine the UI consumes** |
| `whitt-hardware` | Edge — SBC | 1 spec file, no commits | **Constraint on remote UI** |
| `whitt-model-router` | Routing | Docs only (1,412-line DECISIONS, no code) | **Invisible hand that picks models** |

**One-line summary:** Only one repo (`whitt-execution-engine`) has working code. Everything else is documented design. The UI today can only wrap that one engine's CLI.

*All counts verified 2026-08-08. See per-repo reports for evidence.*

## 2. Unified Surface Map (What the UI Must Display)

Combining every per-repo table, the UI has **nine primary surfaces**:

1. **Chat panel** — compose prompt → compile to YAML → enqueue → stream tokens.
2. **Queue panel** — 10 states × 25 categories, drag-drop reprioritize, DLQ browser, retry budget indicator.
3. **Workflow editor** — YAML with schema validation, hook editor with 50+ template variable autocomplete, parallel-group visualizer.
4. **Model manager** — GGUF list/load/unload/swap/download, RAM footprint, context size, quantization, parameter count.
5. **Execution monitor** — live hook events (10 triggers), step DAG (React Flow), token stream, artifact browser (30-day retention).
6. **Metrics dashboard** — quality scores per step, latency, tok/s, RAM usage, retry counts.
7. **Settings** — 8 config sections (model/context/hardware/sampling/server/cache/features/vulkan), RAM-safety gate, concurrency cap.
8. **Approval modal** — human-override for sensitive tool calls (shell, file ops).
9. **Scope breadcrumbs** — workspace / project / workflow / step (persistent header per ADR-0004).

**Phase C addition (model-router):**

10. **Model recommendation panel** — "why this model" with hybrid scoring breakdown (0.45 dense + 0.25 sparse + 0.30 constraints), retry budget per task type, similarity-aware stats ("based on X similar attempts"), hardware penalty badges.

**Phase B/D additions (swarm + SBC):**

11. **Swarm topology** — LAN node discovery, remote monitor (CPU/RAM/temp/model/tok/s), remote control, log streaming.
12. **Marketplace + wallet** — workflow marketplace, compute credits, proof-of-satisfaction, network status.

## 3. Event Stream Contract (Cross-Repo)

The UI consumes one merged event stream sourced from three repos:

| Event | Source repo | UI use |
|---|---|---|
| `step_start` | execution-engine | Step node lights up |
| `llm_call` | execution-engine | Token streaming begins |
| `step_complete` | execution-engine | Step node resolves |
| `tool_execution` | execution-engine | Tool badge animates |
| `heartbeat` (15s / 60s TTL) | execution-engine | Liveness indicator |
| State transitions (10 states) | agent-queue-engine | Queue card status badge |
| Hook trigger fires (10) | execution-engine | Activity timeline entry |
| Notify messages | execution-engine (`notify_tx` → JSONL fallback) | Notification toast |
| Router recommendation | model-router (Phase C) | Model picker suggestion |
| Swarm heartbeat | hardware (Phase D, undefined) | Topology node liveness |

**Gap:** Event JSON shapes are named but not typed. No shared schema published. This is the **#1 cross-repo blocker** for UI work.

## 4. Communication Boundary (Hard Contract)

From `whitt/opencode/plans/AGENT-QUEUE-ANALYSIS.md`:

```
UI (whitt)                  Queue (agent-queue)           Engine (execution)
    │                              │                            │
    │  ── enqueue CLI ──────────►  │                            │
    │                              │  ── run workflow CLI ─────► │
    │  ◄── JSON events stream ────┤  ◄── JSON events ──────────┤
    │                              │                            │
    │  MUST own: chat, viz,        │  Owns: 10 states, 25       │  Owns: YAML → DAG,
    │  settings, approval          │  queues, retries, DLQ       │  hooks, tools, LLM
```

**MVP transport:** CLI subprocess + JSON stdin/stdout (no network).
**Production transport:** Rust library API for zero-serialization.
**Transport ambiguity:** ADR-0004 says WebSocket + REST. Unresolved.

## 5. Maturity Gating (What Blocks the UI)

| UI capability | Blocked by | Status |
|---|---|---|
| Chat panel | execution-engine Phase 0 prereqs (8-12 wk) | In progress (meta-workflow generator active) |
| Queue panel | agent-queue-engine implementation (178 hr plan) | Not started |
| Workflow editor | execution-engine schema exists ✅ | **Unblocked** |
| Model manager | execution-engine CLI exists ✅ | **Unblocked** |
| Execution monitor | execution-engine hooks 8/10 wired ✅ | **Mostly unblocked** |
| Metrics dashboard | execution-engine benchmark runner exists ✅ | **Unblocked** |
| Settings | both engines exist (config.yml ✅) | **Unblocked** |
| Approval modal | queue-engine API undefined | Blocked |
| Router panel | model-router Phase 1 (TinyRouter, 4 wk) | Not started |
| Swarm topology | hardware deploy spec undefined | Blocked |
| Marketplace | Phase D (8-12 wk) | Not started |

**Today, a UI prototype can: workflow editor + model manager + execution monitor + metrics dashboard + settings.** That is the de-facto MVP-A slice.

## 6. Documented Vision Hooks (Ideas Worth Preserving)

These are **explicitly documented** in repo docs and must inform any future UI design (including the graph UI vision):

1. **"UI is a projection layer — no business logic, no separate state."** (whitt ADR-0004) → UI must never own task state.
2. **"Scope always visible in header"** (workspace / project / workflow / step breadcrumbs) → Persistent context is non-negotiable.
3. **"Multi-zoom navigation"** (workflow → step → agent → tool) → Already a fish-eye concept in spirit.
4. **"Drag-drop = scheduler API projection"** → Direct manipulation is the contract.
5. **"RAM-safety gate: reject new workflow if <2GB free, max 1 concurrent default"** → Hard envelope.
6. **"Observable by default"** — every state transition logged with action, before/after, duration_ms, error. → Activity feed is a first-class surface.
7. **"Idempotency keys via CLI flag, not embedded in YAML"** → Dedupe is a runtime concern, not a workflow-schema concern.
8. **"Local-first, opt-in"** for P2P/swarm. → No cloud dependency in MVP.
9. **"Headless Mode"** + **"<4GB RAM CPU support"** in README → UI must work without local compute.
10. **"Android UI & Support"** in README → Cross-form-factor is a stated goal (no plan yet).
11. **"Dynamic tuning of default workflow files to system resources"** in README → Hardware profile auto-config.
12. **Two-layer model routing** (row selection + ranking) → Multi-stage decision visualization.

## 7. Cross-Cutting Gaps (Top Issues for UI Design)

Ranked by impact:

1. **No typed event schema.** UI cannot be built robustly until JSON event shapes are pinned. **Fix:** shared `events.json` schema in `whitt/opencode/docs/`.
2. **No IPC contract published.** MVP says CLI+JSON; ADR-0004 says WebSocket+REST. **Fix:** pick one for MVP-A, defer the other.
3. **No approval-flow API.** UI owns the modal but queue engine doesn't define the block/unblock contract. **Fix:** add to `whitt-agent-queue-engine/docs/`.
4. **No remote-access spec for SBCs.** Headless edge nodes need an HTTP/SSH/libp2p surface. **Fix:** spec in `whitt-hardware/`.
5. **No model catalog source.** Router recommends models but doesn't define where the catalog comes from. **Fix:** integration doc in `whitt-model-router/`.
6. **No streaming-confirmation.** `during_step_streaming` trigger exists but is not wired. **Fix:** wire it or remove the trigger from the schema.
7. **No TUI spec.** Ratatui twin of every React surface = significant duplication. **Fix:** scope TUI to a strict subset (chat + queue + log).
8. **No Android plan.** Mentioned, not scoped.

## 8. Implications for the Graph UI Vision

The aggregate picture **strongly supports** the proposed graph UI (see `../vision-graph-ui/README.md`):

- **Workflow = subgraph, step = node, hook = edge decoration** is a natural fit for the execution engine's data model.
- **10 task states × 25 queues** map to cluster + color semantics.
- **Multi-zoom navigation** is already in ADR-0004 by another name.
- **50+ template variables** are exactly the fish-eye detail data.
- **Two-layer router** maps to two-level zoom.
- **Swarm topology** becomes another graph layer (Phase D).
- **Projection-layer principle** means the graph is *rendered from* sibling state, never owned by the UI.

The graph UI is best understood as **Phase E+** (PHASE-TIMELINE.md currently ends at Phase D; Phase E is not yet documented there) — a unification of the MVP-A surfaces (chat, queue, editor, monitor, metrics) into a single zoomable canvas. It does not replace the per-repo contracts; it consumes them. See [`../vision-graph-ui/README.md`](../vision-graph-ui/README.md).
