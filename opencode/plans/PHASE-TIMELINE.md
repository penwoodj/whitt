# Phase Timeline and Milestones

> **Version**: 1.0
> **Last Updated**: 2026-04-07

---

## Milestone Overview

```
NOW ──► Phase 0 ──► MVP-A ──► Phase B ──► Phase C ──► Phase D
         (pre-req)   (whitt)   (network)  (router)   (p2p)
          8-12wk      6-8wk     4-6wk      4-6wk      8-12wk
```

---

## Phase 0: Prerequisites ( yaml-to-rust-agentsdk must complete )

### Critical Path Items
These MUST exist before whitt MVP-A can begin:

| # | Deliverable | Owner | Status |
|---|-------------|-------|--------|
| P0.1 | YAML schema parser | yaml-to-rust-agentsdk | Planning |
| P0.2 | WorkflowIR compiler (YAML → IR) | yaml-to-rust-agentsdk | Planning |
| P0.3 | DAG validator (cycle detection) | yaml-to-rust-agentsdk | Planning |
| P0.4 | `compile --prompt` CLI command | yaml-to-rust-agentsdk | Not started |
| P0.5 | `execute --workflow` CLI command | yaml-to-rust-agentsdk | Not started |
| P0.6 | `validate --workflow` CLI command | yaml-to-rust-agentsdk | Not started |
| P0.7 | LlmBackend trait + at least 1 backend (LM Studio) | yaml-to-rust-agentsdk | Not started |
| P0.8 | Basic step executor (sequential) | yaml-to-rust-agentsdk | Not started |
| P0.9 | Error handling (JSON stderr) | yaml-to-rust-agentsdk | Partially done |

**Estimated**: 8-12 weeks (aligns with yaml-to-rust-agentsdk Phase 0 + Phase 1 + Phase 2)

### Dependencies
- yaml-to-rust-agentsdk Phase 0 (Foundation): YAML parsing, schema, IR, storage
- yaml-to-rust-agentsdk Phase 1 (MVP Queue): Basic execution (but whitt has its own queue for MVP-A)
- yaml-to-rust-agentsdk Phase 2 (CLI & Backends): CLI interface + at least one backend

---

## MVP-A: Whitt Chat Bot (Whitt's First Release)

### Scope
- Tauri v2 + React 18 chat application
- Compile prompt → YAML workflow → execute → show results
- Simple internal queue (VecDeque + JSON persistence)
- Settings panel (backend selection, model selection)
- Works on 16GB desktop, CPU-only

### Deliverables

| # | Deliverable | Effort | Depends On |
|---|-------------|--------|------------|
| A1 | Tauri project scaffold (Rust + React) | 2 days | Phase 0 complete |
| A2 | Tauri command layer (CLI subprocess bridge) | 3 days | A1 |
| A3 | Chat UI (message list, input, markdown render) | 5 days | A1 |
| A4 | Workflow compilation flow (prompt → compile → execute) | 3 days | A2, A3, P0.4-P0.5 |
| A5 | Internal queue (FIFO, persistence, smart blocking) | 3 days | A2 |
| A6 | Queue visualization panel | 3 days | A5 |
| A7 | Settings panel (backend, model, resource limits) | 3 days | A2 |
| A8 | Error handling (timeout, crash, model missing) | 2 days | A4, A5 |
| A9 | Graceful shutdown (save state, kill processes) | 1 day | A5 |
| A10 | First-run wizard (detect backend, choose model) | 2 days | A7 |
| A11 | Testing (unit + integration + manual) | 3 days | All above |

**Estimated**: 6-8 weeks (30 working days)

### Success Criteria
1. User types prompt → receives AI response within 60 seconds
2. 3+ chat sessions work simultaneously
3. Queue properly serializes execution
4. Application runs 1 hour without crash on 16GB desktop
5. All operations work offline

---

## Phase B: Local Network Integration

### Scope
- Multi-machine orchestration via agent-queue
- agent-queue integration (replace internal queue)
- TUI mode (Ratatui terminal interface)
- LAN model distribution

### Deliverables

| # | Deliverable | Effort | Depends On |
|---|-------------|--------|------------|
| B1 | agent-queue integration (replace internal queue) | 5 days | agent-queue MVP |
| B2 | agent-queue state display (real-time updates) | 3 days | B1 |
| B3 | TUI mode (Ratatui terminal interface) | 10 days | A1-A5 |
| B4 | LAN model discovery (find models on other machines) | 5 days | agent-queue network |
| B5 | Remote model execution | 5 days | B4 |
| B6 | Machine status panel | 3 days | B4 |
| B7 | Testing | 5 days | All above |

**Estimated**: 4-6 weeks

---

## Phase C: Model Router Integration

### Scope
- Integrate ~/code/model-router/ as whitt addon
- Automatic model selection per task type
- Hardware-aware workflow modification
- Model switching mid-workflow

### Deliverables

| # | Deliverable | Effort | Depends On |
|---|-------------|--------|------------|
| C1 | model-router CLI integration | 3 days | model-router Phase 1 |
| C2 | Auto model selection in compile flow | 3 days | C1 |
| C3 | Hardware-aware workflow modification | 5 days | C2 |
| C4 | Model switch UI (show recommended model, allow override) | 3 days | C2 |
| C5 | Fallback chain (large model fails → small model) | 3 days | C3 |
| C6 | Testing | 3 days | All above |

**Estimated**: 4-6 weeks

---

## Phase D: P2P Gamified Compute Sharing

### Scope
- Peer-to-peer workflow sharing
- Compute credit system
- Proof-of-satisfaction verification
- Workflow marketplace UI

### Deliverables

| # | Deliverable | Effort | Depends On |
|---|-------------|--------|------------|
| D1 | P2P network layer (libp2p or similar) | 15 days | Phase B complete |
| D2 | Workflow publishing protocol | 5 days | D1 |
| D3 | Credit accounting system | 5 days | D1 |
| D4 | Proof-of-satisfaction verification | 10 days | D3 |
| D5 | Workflow marketplace UI | 10 days | D2 |
| D6 | Credit dashboard UI | 5 days | D3 |
| D7 | Network status UI | 5 days | D1 |
| D8 | Security audit (workflow signing, sandboxing) | 10 days | D1-D7 |
| D9 | Testing + stress testing | 10 days | All above |

**Estimated**: 8-12 weeks (most complex phase)

---

## Dependency Graph

```
yaml-to-rust-agentsdk Phase 0-2 ──► Whitt MVP-A ──► Phase B ──► Phase C
                                    (agent-queue)  (router)
                                                          │
                                                          ▼
                                                     Phase D (p2p)
```

## Total Estimated Timeline

| Phase | Duration | Cumulative |
|-------|----------|------------|
| Phase 0 (prerequisites) | 8-12 weeks | 8-12 weeks |
| MVP-A | 6-8 weeks | 14-20 weeks |
| Phase B | 4-6 weeks | 18-26 weeks |
| Phase C | 4-6 weeks | 22-32 weeks |
| Phase D | 8-12 weeks | 30-44 weeks |
| **TOTAL** | **30-44 weeks** | **7-11 months** |
