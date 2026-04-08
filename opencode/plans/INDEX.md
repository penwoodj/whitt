# Whitt Plan Suite - Master Index

> **Version**: 1.0 (Initial)
> **Last Updated**: 2026-04-07
> **Status**: Planning - Pre-Implementation
> **Review Cycles Completed**: 3/3

---

## What is Whitt?

Whitt is a **fully local agentic orchestration IDE** - a Tauri + React desktop application that provides TUI and GUI interfaces for local AI workflow execution. It wraps three companion projects:

| Project | Location | Role |
|---------|----------|------|
| **yaml-to-rust-agentsdk** | ~/code/yaml-to-rust-agentsdk/ | Execution engine + transpiler + CLI |
| **agent-queue** | ~/code/agent-queue/ | Queue orchestration + scheduling + prioritization |
| **model-router** | ~/code/model-router/ | Automatic LLM model selection + routing |

Whitt itself provides the **user-facing shell** - the chat interface, queue visualization, and eventually p2p gamified compute sharing. It does NOT contain any execution, scheduling, or model routing logic.

---

## Plan Suite Structure

```
~/code/whitt/opencode/
├── plans/
│   ├── INDEX.md                          ← YOU ARE HERE (master index)
│   ├── ARCHITECTURE.md                   ← System architecture & project relationships
│   ├── PROJECT-SCOPES.md                 ← Detailed scope of each project
│   ├── DOC-TRANSFER-PLAN.md              ← Documentation migration plan (108 files)
│   ├── MVP-DEFINITION.md                 ← Whitt MVP spec (16GB desktop, chat bot)
│   ├── COMMUNICATION-PROTOCOL.md         ← How projects talk to each other
│   ├── REVIEW-CYCLE-1.md                 ← First critical review findings & fixes
│   ├── REVIEW-CYCLE-2.md                 ← Second critical review findings & fixes
│   ├── REVIEW-CYCLE-3.md                 ← Third critical review findings & fixes
│   ├── AGENT-QUEUE-ANALYSIS.md           ← What agent-queue already handles
│   ├── P2P-GAMIFICATION-VISION.md        ← Future p2p compute sharing design
│   └── RISKS-AND-MITIGATIONS.md          ← Upstream risks for implementation agents
└── docs/
    ├── diagrams/
    │   ├── viewer.html                    ← SVG viewer container (open in Firefox)
    │   ├── 00-system-overview.svg         ← High-level 4-project relationship
    │   ├── 01-whitt-mvp-architecture.svg  ← Mid-level MVP data flow
    │   ├── 02-comm-protocols.svg          ← Detail-level communication protocols
    │   ├── 03-queue-integration.svg       ← Detail-level agent-queue integration
    │   ├── 04-future-p2p.svg              ← Future p2p compute sharing vision
    │   └── 05-scope-boundaries.svg        ← Feature ownership boundaries
    └── reports/
        └── doc-inventory.md              ← Complete file-by-file classification
```

---

## Evolution Roadmap

### Phase A: MVP (Whitt Chat Bot)
**Target**: 16GB DDR4 desktop, CPU-only, works even if slow
- Tauri shell with React frontend
- Chat interface that compiles prompts → YAML workflows → executes via yaml-to-rust-agentsdk CLI
- Smart blocking: new chats queue behind active execution
- Queue visualization panel (navigateable, sortable)
- Uses yaml-to-rust-agentsdk CLI directly (no network)
- Uses agent-queue CLI for queue management (no network)
- No remote model providers - local only (LM Studio, Ollama, llama.cpp)

### Phase B: Local Network
- Multi-machine orchestration via agent-queue's local network features
- Private LAN model distribution
- TUI mode for headless operation

### Phase C: Model Router Integration
- Integrate ~/code/model-router/ as whitt addon
- Automatic model selection based on task type
- Hardware-aware scaling (compensate with smaller models on weak hardware)

### Phase D: P2P Compute Sharing
- Gamified workflow sharing network
- Proof-of-satisfaction / proof-of-objective-achievement
- Earn compute credits by sharing useful workflows
- Minimal per-user compute contribution required

---

## Repo Inventory (Current State)

| Repo | Status | Files | Code | Docs |
|------|--------|-------|------|------|
| yaml-to-rust-agentsdk | Active dev | 381 | ~50% Rust | 278 MD + 87 YAML |
| whitt | Empty shell | 1 | 0 | README.md only |
| agent-queue | Planning only | 13 | 0 | 10,292 lines MD |
| model-router | Planning only | 5 | 0 | 3,900 lines MD |

---

## Safety: Backups Created

Before any documentation transfer:
- ~/data/whitt-backup-20260407/ (252K)
- ~/data/agent-queue-backup-20260407/ (2.4M)
- ~/data/yaml-to-rust-agentsdk-backup-20260407/ (16M)
- ~/data/model-router-backup-20260407/ (196K)

---

## Viewing the Diagrams

```bash
# Open all SVG diagrams in Firefox with one command:
firefox ~/code/whitt/opencode/docs/diagrams/viewer.html

# Or open individual diagrams:
firefox ~/code/whitt/opencode/docs/diagrams/00-system-overview.svg
```
