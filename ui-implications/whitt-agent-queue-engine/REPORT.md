# UI Implications: `whitt-agent-queue-engine`

> The **Layer 2 queue orchestration** repo. It owns task lifecycle, scheduling, retries, dead-letter, and parallel execution semantics for YAML-defined agent workflows. It does **not** execute workflows itself — it delegates to `whitt-execution-engine`. The UI is a *projection* of queue state.

- **Repository:** `/home/jon/code/whitt-agent-queue-engine`
- **Synthesized from:** `README.md`, `docs/MVP_DEFINITION.md`, `docs/REQUIREMENTS_ROADMAP_SUMMARY.md`, `docs/TRANSPILER_INTEGRATION_SPEC.md`, `docs/AGENT_QUEUE_VS_TRANSPILER_COMPARISON.md`, `docs/PARALLEL_EXECUTION_DESIGN.md`, `docs/GAP_CONSISTENCY_REPORT.md`, `plans/mvp-implementation/README.md`, git log (23 commits).
- **Last reviewed:** 2026-08-08

---

## What This Project IS (in 3 lines)

1. **Multi-dimensional queue workflow engine** coordinating YAML-driven agent workflows.
2. **Delegates execution** to `whitt-execution-engine` ("the transpiler") via CLI (MVP) → Rust library API (production).
3. **Pre-implementation.** 16,592 lines of docs/plans (verified via `find docs plans -name "*.md" | wc -l`); no `Cargo.toml`, no source, no tests. 5-phase 178-hour plan, 156 planned tests, not started.

## What the UI Must Consume / Display

| Capability | Source | UI Surface |
|---|---|---|
| 10-state task lifecycle: NEW / QUEUED / SCHEDULED / LEASED / RUNNING / DONE / FAILED / DLQ / CANCELED / EXPIRED | `MVP_DEFINITION.md` | Status badge per task |
| 25 queue categories (incl. Hook-Triggered, metasystem flows) | `docs/REQUIREMENTS_ROADMAP_SUMMARY.md` | Category tabs / filter |
| Priority algorithms: EDF, WRR, DRR, Fair Share | `PARALLEL_EXECUTION_DESIGN.md` | Algorithm selector in settings |
| Work stealing, backpressure, fair share, rate limiting | parallel design doc | Advanced config + live monitor |
| SQLite WAL persistence | `MVP_DEFINITION.md` | Hidden; exposes durability guarantee |
| Dead-letter queue (DLQ) | `MVP_DEFINITION.md` | DLQ browser panel |
| Retry with exponential backoff (max 3) | `MVP_DEFINITION.md` | Retry indicator + countdown |
| Scheduling: ASAP / Repeat-Cron / Whenever queues | requirements roadmap | Schedule picker |
| Idempotency keys (passed via CLI flag only; YAML support not planned) | `TRANSPILER_INTEGRATION_SPEC.md` | Optional "dedupe key" field |
| Artifacts: 30-day retention, downloadable | transpiler spec | Artifact browser |
| Structured JSON logs with correlation IDs (trace_id, run_id, task_id, step_id) | transpiler spec | Log viewer with ID filter |
| 8 CLI commands: enqueue, list, inspect, cancel, retry, schedule, drain, validate | MVP definition | Command surface UI must call |
| 3 user stories → UI flows: emergency response (ASAP), scheduled backup (cron + catchup), multi-tenant batch (fair share + work stealing) | requirements roadmap | Demo / template workflows |

## Documented UI Hooks

**Queue engine responsibilities (what UI projects):**
- Orchestration, scheduling, state management, retry, DLQ, audit.

**Transpiler (NOT this repo) responsibilities:**
- Workflow parsing, step execution, LLM integration, tool invocation.

**Integration contract** (`TRANSPILER_INTEGRATION_SPEC.md`):
- MVP: synchronous CLI invocation.
- Production: direct Rust library API (async).
- Defines data flow protocol, error handling, heartbeat management, artifact collection.

**Observable by default:**
- Every state transition logged with: action, before/after state, duration_ms, error details.
- Hierarchical Clap + Console CLI.

## Current State (code vs docs)

- **Code:** None. No `Cargo.toml`. Planned deps: tokio, serde, serde_yaml, chrono, rusqlite, clap, tracing, thiserror, uuid.
- **Docs:** Exhaustive. All 4 prior gaps closed (`GAP_CONSISTENCY_REPORT.md`): YAML schema, mock transpiler, transpiler CLI interface, project scaffold. 20+ stale references fixed across 7 files.
- **Commits:** All 23 commits are `docs:` — requirements, roadmap, MVP, integration spec, gap fixes.
- **Plan:** 5-phase, 178 hours, 156 tests, 100% requirement coverage. Not started.

## Gaps & Open Questions for UI

1. **No event stream schema published.** States named, but transition event JSON shape not specified.
2. **Concurrency model for UI unspecified.** How many tasks can the UI observe/edit simultaneously? Queue depth limit?
3. **Approval / human-override flow underspecified.** Whitt's `AGENT-QUEUE-ANALYSIS.md` says whitt owns approval UI; this repo doesn't define the API for blocking on human input.
4. **Idempotency key UX.** Auto-generate? User-supplied? Hash of payload? Not specified.
5. **Schedule catchup policy.** Missed cron runs: skip / run-once / run-all? UI must expose this.
6. **No partial-cancel.** Once leased, can UI cancel? If not, how is "cancel" surfaced to user (queued = yes, leased = "request cancel")?

## Implications for the Graph UI Vision

A graph UI maps naturally onto this repo's model: **each task = a node, each queue = a cluster, state transitions = animated edge color flows.** The 10 lifecycle states map cleanly to fish-eye detail levels (NEW/QUEUED at zoom-out, RUNNING/LEASED expand to show step DAG at zoom-in). Drag-drop reprioritization becomes a graph-edge operation. The graph UI should treat this repo as the **live topology source** for the "active work" subgraph.
