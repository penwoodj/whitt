# UI Implications: `whitt` (Umbrella / UI Shell)

> The `whitt` repo is the **Layer 1 desktop UI shell** for a fully-local, multi-repo "Agentic Orchestration IDE." It owns the user-facing surface (chat, queue visualization, settings) and delegates everything else (scheduling, execution, model routing, hardware targets) to sibling repositories over CLI/JSON subprocess boundaries.

- **Repository:** `/home/jon/code/whitt`
- **Branch:** `initial-creation`
- **Synthesized from:** `README.md`, `opencode/plans/*.md` (ARCHITECTURE, MVP-DEFINITION, PHASE-TIMELINE, COMMUNICATION-PROTOCOL, AGENT-QUEUE-ANALYSIS, P2P-GAMIFICATION-VISION, PROJECT-SCOPES, RISKS-AND-MITIGATIONS), `inspiration-reports/yaml-to-rust-agentsdk/plan.md`, `inspiration-reports/yaml-to-rust-agentsdk/adr-0004-glyphnova-ui-control-plane.yml`.

---

## What This Project IS (in 3 lines)

1. **A Tauri v2 + React 18 + TypeScript desktop app** (with a planned Ratatui TUI twin) that serves as the user-facing entry point for the whitt ecosystem.
2. **The control plane / projection layer** — it contains no business logic; every queue entry, status badge, and workflow card is a direct projection of state owned by a sibling repo.
3. **The integrator** — it shells out to `whitt-agent-queue-engine` (Layer 2) and `whitt-execution-engine` (Layer 3), and is planned to integrate `whitt-model-router` (Phase C) and remote Orange Pi Zero 3W nodes (Phase B/D).

## What the UI Must Consume / Display

| Capability | Source (repo / doc) | UI Surface |
|---|---|---|
| Chat → compile prompt to YAML workflow | `whitt-execution-engine` CLI | Chat panel |
| Enqueue compiled workflow | `whitt-agent-queue-engine` CLI | "Send" action in chat |
| Live execution stream | JSON events on stdout (`step_start`, `llm_call`, `step_complete`, `tool_execution`, `heartbeat` 15s/60s TTL) | Streaming chat + activity log |
| Visual queue (25 categories, 10 states) | `whitt-agent-queue-engine` | Queue panel |
| Status badges (waiting gray / running blue pulse / done green / failed red) | `MVP-DEFINITION.md` | Per-task card |
| Drag-drop reprioritization | `AGENT-QUEUE-ANALYSIS.md` | Queue cards |
| Workspace / project / workflow / step breadcrumbs | ADR-0004 "Glyphnova" | Persistent header |
| Settings: model path, RAM ceiling, concurrency, queue config | local + sibling CLIs | Settings panel |
| RAM-safety gate (reject new workflow if <2GB free, max 1 concurrent default) | `MVP-DEFINITION.md` | Reject toast + RAM meter |
| Human-override approval UI | `AGENT-QUEUE-ANALYSIS.md` | Modal / inline approval flow |
| DAG visualization (React Flow) | ADR-0004 | Workflow viewer |
| Metrics dashboard (Recharts) | ADR-0004 | Quality / latency charts |
| Multi-zoom navigation (workflow → step → agent → tool) | ADR-0004 | Zoomable canvas |
| Phase D: P2P marketplace, credit ledger, network status | `P2P-GAMIFICATION-VISION.md` | Marketplace + wallet panels |
| Phase D: swarm topology, remote SBC nodes | `whitt-hardware` + P2P vision | Network map |

## Documented UI Hooks

**Hard boundary — what whitt MUST own** (`opencode/plans/AGENT-QUEUE-ANALYSIS.md`):
- Chat interface
- Prompt → workflow compile trigger
- Visual queue display
- Real-time progress streaming
- Settings / config
- Human-override approval UI

**Hard boundary — what whitt must NOT do:**
- Maintain its own task DB
- Implement scheduling
- Decide execution order
- Handle retry logic
- Manage lease expiration
- Track resources internally

**Communication contract** (`COMMUNICATION-PROTOCOL.md`):
- MVP: CLI subprocess + JSON on stdin/stdout. No network.
- Future: Rust library API for zero-serialization.

**"Glyphnova" UI design** (`inspiration-reports/yaml-to-rust-agentsdk/adr-0004-glyphnova-ui-control-plane.yml`):
- UI is a **projection layer** — no separate state.
- Queue = direct scheduler projection.
- Scope always visible in header.
- Drag-drop = scheduler API projection.
- Tech stack: Tauri 2 + React 18 + TS + Vite + shadcn/ui + Zustand + React Query + React Flow + Recharts + @dnd-kit.

## Current State (code vs docs)

- **Code:** No Tauri scaffold, no React source, no Cargo workspace. Repo is **documentation-only**.
- **Docs:** Heavy. `opencode/plans/` has 13 plan docs, `inspiration-reports/yaml-to-rust-agentsdk/` has a 9-task implementation plan, `opencode/docs/SHARED-DOCS.md` indexes canonical source-of-truth in the renamed `whitt-execution-engine`.
- **Branch:** `initial-creation`, pushed to `origin=https://github.com/penwoodj/whitt.git`.
- **Phase:** Phase 0 prereqs (8-12 wk) on the execution engine have not started. MVP-A (6-8 wk) blocked on that.

## Gaps & Open Questions for UI

1. **No Tauri/React scaffold exists.** Every UI mock is in prose.
2. **Streaming transport ambiguous.** MVP says CLI subprocess + JSON; Glyphnova ADR says WebSocket + REST. Unresolved.
3. **No IPC contract schema published.** JSON event shapes are listed by name but not typed.
4. **TUI mode planned but unspecified.** Ratatui twin of every React surface = significant design duplication.
5. **Swarm / remote UI not designed.** Phase B/D mention multi-machine + Orange Pi Zero 3W targets but no UI mock for topology, deployment, or remote debugging.
6. **Android UI mentioned in README** with no plan, scope, or design.

## Implications for the Graph UI Vision

The umbrella repo is *where* the proposed **voice + mouse infinite-canvas fish-eye graph UI** would live. The current MVP scope (chat + queue panel + settings) is a strict subset of that vision. The graph UI is best treated as **Phase E+** — it requires all four sibling repos to ship their MVP contracts first, then reframes the chat/queue/breadcrumbs surfaces as nodes on a single zoomable canvas. See `../vision-graph-ui/README.md`.
