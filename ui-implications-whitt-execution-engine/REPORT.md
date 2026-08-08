# UI Implications: `whitt-execution-engine`

> The **Layer 3 Rust execution engine** (formerly `yaml-to-rust-agentsdk`). It parses YAML workflows into a DAG, runs steps (LLM inference or tool calls) in parallel, fires 10 lifecycle hooks × 12 actions, and produces JSON/YAML/JSONL output. The UI is primarily a **consumer of its CLI and event stream**.

- **Repository:** `/home/jon/code/whitt-execution-engine`
- **Synthesized from:** `README.md`, `Cargo.toml`, `config.yml`, `docs/contributing/hooks-reference.md`, `docs/schema/hooks-semantics.md`, `docs/schema/unified-workflow-schema.yml`, `docs/requirements/index.md`, `src/bin/whitt.rs`, `src/workflow/hooks/` module map, `configs/models/`, git log (last 30 commits).
- **Last reviewed:** 2026-08-08

---

## What This Project IS (in 3 lines)

1. **YAML-driven workflow orchestration** with LLM agents, lifecycle hooks, and parallel execution (`tokio::spawn` + `Arc<Mutex<HookEngine>>`).
2. **The actual "engine"** behind every whitt workflow — the only repo with working Rust code today (758 passing tests, 0 failures; verified `cargo test --all-targets` 2026-08-08).
3. **Schema-driven** — every workflow validated against `docs/schema/unified-workflow-schema.yml`. Backend: llama.cpp + Vulkan in Docker (NOT LM Studio, NOT Ollama).

## What the UI Must Consume / Display

| Capability | Source | UI Surface |
|---|---|---|
| **14 CLI commands:** chat, model {list,load,unload,swap}, server {start,stop,status,gpu,logs}, agent, benchmark, workflow, download | `README.md` L30-48 | Command surface / hotkeys |
| **YAML workflow validation** against unified schema | `docs/schema/unified-workflow-schema.yml` | Inline linting in workflow editor |
| **10 lifecycle hook triggers:** before_step_starts, during_step_streaming*, after_step_succeeds, after_step_fails, after_all_retries_exhausted, after_step_starts, before_gwt_evaluates*, after_gwt_evaluates*, on_requires_failed, after_loop_iteration_fails (* = partial) | `hooks-reference.md` L20-189 | Event timeline / activity feed |
| **12 hook actions:** log, save_to, append_to, route_to, bookmark, notify, fail, shell, skip_step, skip_remaining, gwt, iterate_values | `hooks-reference.md` L192-405 | Hook editor / debug view |
| **51 template variables** across 12 scopes (workflow, model, provider, step, error, retry, loop, checkpoint, sub-workflow, tool, file operation, generative) | `docs/schema/hooks-semantics.md` L834-920 | Variable picker / autocomplete |
| **8 config sections:** model, context, hardware, sampling, server, cache, features, vulkan | `config.yml` L1-48 | Settings form |
| **Model lifecycle:** GGUF format, list/load/unload/swap/download (HuggingFace) | `configs/models/*.yml`, README | Model manager panel |
| **ReAct agent** implementation | `src/agent/` | Agent inspector |
| **Workflow checkpointing** | README L153-165 | Resume button per run |
| **Tool sandbox security** | README L153-165 | Tool approval modal |
| **SSE streaming** support | `src/client/http_client.rs` | Token-by-token chat |
| **Docker + llama.cpp + Vulkan** integration | `src/client/docker_manager.rs` | Backend status panel |
| **Quality verifier** (built-in checkers) | `src/quality/verifier/` | Quality score per step |
| **Benchmark runner** with hook firing points | `src/benchmark/runner.rs` | Benchmark dashboard |

## Documented UI Hooks

**Data flow** (`README.md` L51-57):
```
YAML Workflow → Validation → Step Execution → Hooks → Output
                     ↓              ↓            ↓
                Schema Check   Parallel     Trigger/Action Dispatch
```

**Output formats the UI must parse/render:**
- JSON files (`save_to`, `bookmark` actions)
- Text logs (`log` action)
- YAML files (`append_to`)
- JSONL for notifications
- Structured context JSON for all hook triggers

**Implementation status** (`docs/contributing/hooks-reference.md` L449-480):
- Triggers: source enumerates 8 fully wired + 2 partial (GWT logging only) + 1 not wired (`during_step_streaming`) = 11, vs the stated 10 total — the source doc's own tally is internally inconsistent. Treat the *list* as authoritative, not the count.
- Actions: 12/12 unit + integration verified; 6/12 live-verified (log, save_to, bookmark, shell, skip_step, skip_remaining, gwt).
- NOT live-verified: append_to, route_to, notify, fail, iterate_values.

## Current State (code vs docs)

- **Code:** Working Rust. 3 binaries (`whitt`, `poc_client`, `model_chain`). Library crate with features `client`, `sqlite`, `clipboard`. **758 passing tests** (verified `cargo test --all-targets` 2026-08-08; README claims 637 — README is stale).
- **Recent activity:** Active development on meta-v6 (workflow generator), model benchmarking, stress testing, safety rules.
- **Planned (not built):** Code generation / compilation mode, OpenAI + Anthropic backends, advanced scheduling, distributed execution.
- **This is the most mature repo in the ecosystem.** Phase 0 prereqs (8-12 wk) for the umbrella whitt MVP block on this.

## Gaps & Open Questions for UI

1. **No UI-specific documentation.** All docs developer-facing. No guide for building UI integrations.
2. **Streaming status ambiguous.** `during_step_streaming` trigger exists but NOT wired. Unclear if real-time streaming is available for UI consumption today.
3. **Notification channel.** `notify` action uses `notify_tx` channel with JSONL file fallback. Unclear how UI subscribes to real-time notifications.
4. **No benchmark progress API.** No documented endpoint for querying running benchmark status.
5. **No REST API for model state.** CLI can list/load/unload, but no HTTP surface.
6. **No standalone validation endpoint.** Schema validation exists, but no API for UI to validate workflows before enqueue.
7. **Error recovery UI patterns absent.** Hooks handle errors internally; no guidance on UI presentation of retry / failure.
8. **Template variable resolution timing.** Parse-time vs runtime unclear (likely runtime for step outputs).

## Implications for the Graph UI Vision

This repo is the **content engine** for the graph UI. Each workflow = a subgraph; each step = a node; each hook = an edge decoration. The 50+ template variables become the **fish-eye detail data** — when the user zooms into a step, the UI resolves `{{step.output}}`, `{{tool_result}}`, etc. into inline panels. The graph UI should treat this repo's hook event stream as its **primary animation source** (10 triggers → 10 visual state transitions).
