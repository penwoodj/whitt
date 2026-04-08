# Review Cycle 1: Critical Review Findings

> **Version**: 1.0
> **Date**: 2026-04-07
> **Reviewer**: Sisyphus (self-review)
> **Plan Files Reviewed**: INDEX.md, ARCHITECTURE.md, PROJECT-SCOPES.md, DOC-TRANSFER-PLAN.md, MVP-DEFINITION.md, COMMUNICATION-PROTOCOL.md, AGENT-QUEUE-ANALYSIS.md, P2P-GAMIFICATION-VISION.md, RISKS-AND-MITIGATIONS.md

---

## Issues Found

### Issue 1.1: [HIGH] agent-queue CLI Commands Are Speculative
**Finding**: COMMUNICATION-PROTOCOL.md specifies agent-queue CLI commands (`enqueue`, `list`, `inspect`, `cancel`) but agent-queue has NO CODE. These commands are from its planning docs, not implemented.
**Risk**: Implementation agent builds whitt around CLI commands that don't exist yet.
**Fix**: 
1. Add explicit warning in COMMUNICATION-PROTOCOL.md: "agent-queue CLI commands are planned, not implemented. Whitt must either (a) wait for agent-queue implementation, or (b) implement a simple queue internally as temporary bridge."
2. Update MVP-DEFINITION.md to note agent-queue integration is Phase B, not MVP-A.
3. Define MVP-A fallback: whitt manages its own simple FIFO queue using yaml-to-rust-agentsdk CLI directly.

### Issue 1.2: [HIGH] MVP Dependencies on Unimplemented Systems
**Finding**: MVP-DEFINITION.md shows whitt depending on both yaml-to-rust-agentsdk AND agent-queue, but:
- yaml-to-rust-agentsdk: Has some Rust code (error module, tests) but NO compile/execute CLI commands
- agent-queue: Has zero code
**Risk**: MVP cannot be built until at least yaml-to-rust-agentsdk has working `compile` and `execute` CLI commands.
**Fix**: 
1. Add prerequisite section to MVP-DEFINITION.md listing what must exist in yaml-to-rust-agentsdk before whitt MVP can start
2. Define MVP-A (whitt standalone) vs MVP-B (whitt + agent-queue integration)
3. MVP-A works with yaml-to-rust-agentsdk only (single workflow at a time, simple internal queue)

### Issue 1.3: [MEDIUM] Documentation Transfer Precedes Implementation
**Finding**: DOC-TRANSFER-PLAN.md moves Phase 3/6/7 docs to whitt before whitt has any code. These docs describe features far beyond MVP.
**Risk**: Agent implementing whitt gets confused about priority - should it build MVP chat or implement automation scheduling?
**Fix**:
1. In whitt's received docs, add a prominent README stating these are FUTURE phase docs, not MVP requirements
2. MVP-DEFINITION.md already clearly scopes MVP - ensure implementation agents read MVP-DEFINITION.md first

### Issue 1.4: [MEDIUM] Tauri v2 vs Tauri v1 Not Locked Down
**Finding**: MVP-DEFINITION.md says "Tauri v2 + React 18" but RISKS-AND-MITIGATIONS.md says "Use Tauri v2 documentation exclusively". No lock file or version pinning specified.
**Risk**: Agent installs Tauri v1 and builds incompatible code.
**Fix**:
1. Add to MVP-DEFINITION.md: exact Tauri version to use (check latest stable v2)
2. Specify `tauri = "2"` in Cargo.toml template
3. Add check to pre-implementation checklist: `tauri --version` must output 2.x

### Issue 1.5: [MEDIUM] Model-Router Integration Timeline Unclear
**Finding**: P2P-GAMIFICATION-VISION.md and PROJECT-SCOPES.md reference model-router as "Phase C" but no concrete timeline.
**Risk**: Agent might try to integrate model-router during MVP.
**Fix**:
1. Add explicit "NOT IN MVP" banner to any model-router references
2. Create a simple milestone table: MVP-A (chat) → Phase B (multi-machine) → Phase C (model-router) → Phase D (p2p)

### Issue 1.6: [LOW] SVG Diagrams Use IMG Tags Instead of Inline SVG
**Finding**: viewer.html uses `<img src="...svg">` instead of inline SVG.
**Risk**: CSS styling can't reach SVG internals (can't change colors, fonts dynamically).
**Fix**: Acceptable for now - inline SVG would make the HTML file 10x larger. Keep img tags, note as future improvement.

### Issue 1.7: [LOW] No Windows/macOS Consideration
**Finding**: All docs assume Linux (~/ paths, bash commands).
**Risk**: Whitt targets Tauri desktop which runs on Windows/macOS too.
**Fix**: 
1. Add note in MVP-DEFINITION.md: "Primary target: Linux. Windows/macOS support via Tauri's cross-platform nature, but not explicitly tested in MVP."

### Issue 1.8: [LOW] DOC-TRANSFER-PLAN Cross-Reference Updates Missing
**Finding**: DOC-TRANSFER-PLAN.md Section 5 says "Update cross-references" but doesn't specify WHICH references to update.
**Fix**: 
1. Add specific search patterns: grep for `03-glyphnova-ui`, `06-automation`, `07-autonomy-metrics` in yaml-to-rust-agentsdk docs
2. Add specific search patterns: grep for `../plans/`, `../../reports/` in whitt received docs
3. Provide sed commands for bulk updates

---

## Changes Made After Review Cycle 1

1. ✅ Updated INDEX.md - Added MVP-A vs MVP-B distinction
2. ✅ Updated MVP-DEFINITION.md - Added prerequisites section, agent-queue as Phase B
3. ✅ Updated COMMUNICATION-PROTOCOL.md - Added warnings about unimplemented CLIs
4. ✅ Updated RISKS-AND-MITIGATIONS.md - Added agent-queue-has-no-code risk
5. ✅ Created PHASE-TIMELINE.md - Clear milestone table with dates

## Status: Review Cycle 1 Complete
Proceeding to Review Cycle 2.
