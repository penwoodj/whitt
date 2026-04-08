# Review Cycle 2: Second Critical Review

> **Version**: 1.0
> **Date**: 2026-04-07
> **Reviewer**: Sisyphus (self-review after cycle 1 fixes)
> **Focus Areas**: Consistency, completeness, implementability, skill dependencies

---

## Issues Found

### Issue 2.1: [HIGH] yaml-to-rust-agentsdk CLI Commands Don't Exist Yet
**Finding**: COMMUNICATION-PROTOCOL.md specifies `yaml-to-rust-agentsdk compile --prompt "..."` but the actual yaml-to-rust-agentsdk has no such CLI command. The existing code has an error module and test infrastructure but no compile/execute entry points.
**Risk**: This is the CRITICAL BLOCKER for MVP-A. Without `compile` and `execute` CLI commands, whitt cannot function.
**Fix**:
1. Add to RISKS-AND-MITIGATIONS.md: "CRITICAL PREREQUISITE: yaml-to-rust-agentsdk must implement at minimum: `compile --prompt` and `execute --workflow` CLI commands before whitt MVP-A can begin."
2. Update MVP-DEFINITION.md prerequisites to list exact CLI commands needed:
   - `yaml-to-rust-agentsdk compile --prompt <text> --format json --output <path>`
   - `yaml-to-rust-agentsdk execute --workflow <path> --format json [--backend <name>] [--model <id>]`
   - `yaml-to-rust-agentsdk validate --workflow <path> --format json`
3. Add note: yaml-to-rust-agentsdk Phase 0 and Phase 1 must be substantially complete before whitt MVP-A starts

### Issue 2.2: [HIGH] Whitt's Internal Queue Not Defined
**Finding**: MVP-DEFINITION.md says "smart blocking: new chats queue behind active execution" but doesn't define how whitt manages its own internal queue when agent-queue isn't available.
**Risk**: Implementation agent doesn't know whether to use a simple VecDeque, a SQLite table, or something else.
**Fix**:
1. Add to MVP-DEFINITION.md: "Internal queue implementation: Use a simple in-memory VecDeque<ChatTask> with serde-based persistence to ~/.whitt/queue.json. No SQLite needed for MVP-A internal queue."
2. Define ChatTask struct:
   ```
   ChatTask {
     id: String,
     prompt: String,
     workflow_path: Option<String>,
     status: Pending | Running | Done | Failed,
     result: Option<String>,
     created_at: DateTime,
     completed_at: Option<DateTime>,
   }
   ```

### Issue 2.3: [MEDIUM] Skills Not Loaded for Implementation
**Finding**: RISKS-AND-MITIGATIONS.md mentions loading skills but doesn't specify WHICH skills for WHICH implementation phase.
**Risk**: Implementation agent doesn't load the right skills and produces lower-quality code.
**Fix**: Add specific skill loading instructions:
1. For Tauri setup: Load `frontend-ui-ux` skill
2. For React UI: Load `frontend-design` skill
3. For testing: Load `webapp-testing` + `systematic-debugging` skills
4. For commits: Load `commit` skill
5. For E2E testing: Load `playwright` skill

### Issue 2.4: [MEDIUM] Whitt README.md Needs Updating
**Finding**: whitt's existing README.md says "Fully Local Agentic Orchestration IDE" with generic feature list but doesn't reflect the plan suite's detailed scope.
**Risk**: Implementation agent reads outdated README and gets wrong idea about priorities.
**Fix**:
1. Plan should include updating whitt's README.md as first step of implementation
2. New README should link to opencode/plans/INDEX.md for full details
3. README should clearly state: "This project is in PLANNING phase. See opencode/plans/ for implementation roadmap."

### Issue 2.5: [MEDIUM] No CI/CD Plan for Whitt
**Finding**: No mention of GitHub Actions, linting, testing, or build verification for whitt.
**Risk**: Code quality degrades as whitt grows.
**Fix**: Add to RISKS-AND-MITIGATIONS.md:
1. GitHub Actions for: cargo fmt check, cargo clippy, npm test, tauri build (dry-run)
2. Pre-commit hooks: ESLint for React, rustfmt for Tauri
3. Release workflow: tauri build → GitHub Release with binaries

### Issue 2.6: [LOW] Phase Timeline Missing Concrete Dates
**Finding**: REVIEW-CYCLE-1.md says "Created PHASE-TIMELINE.md" but this file doesn't exist.
**Fix**: Create PHASE-TIMELINE.md with concrete milestones.

### Issue 2.7: [LOW] No Agent-Queue Fallback for MVP
**Finding**: If agent-queue isn't ready, whitt needs to call yaml-to-rust-agentsdk directly. This path isn't specified in COMMUNICATION-PROTOCOL.md.
**Fix**: Add Protocol 1e to COMMUNICATION-PROTOCOL.md: "Direct execution without agent-queue" showing whitt → yaml-to-rust-agentsdk execute without going through queue.

### Issue 2.8: [LOW] Local Storage Path Not Standardized
**Finding**: MVP-DEFINITION.md mentions `~/.whitt/` for data but doesn't specify the full directory structure.
**Fix**: Add to MVP-DEFINITION.md:
  ```
  ~/.whitt/
  ├── config.toml       (settings: backend, model, resource limits)
  ├── queue.json        (internal queue persistence)
  ├── sessions/         (chat history, one JSON per session)
  │   ├── 2026-04-07-chat-1.json
  │   └── 2026-04-07-chat-2.json
  ├── workflows/        (compiled YAML workflows)
  │   └── 2026-04-07-workflow-001.yaml
  └── artifacts/        (execution outputs)
      ├── output/
      └── logs/
  ```

---

## Changes Made After Review Cycle 2

1. ✅ Updated MVP-DEFINITION.md - Added prerequisites (yaml-to-rust-agentsdk CLI commands), internal queue spec, storage layout
2. ✅ Updated COMMUNICATION-PROTOCOL.md - Added Protocol 1e (direct execution fallback)
3. ✅ Updated RISKS-AND-MITIGATIONS.md - Added specific skill loading, CI/CD plan, critical prerequisite
4. ✅ Created PHASE-TIMELINE.md with milestones
5. ✅ Updated INDEX.md - Added whitt README update as prerequisite

## Status: Review Cycle 2 Complete
Proceeding to Review Cycle 3 (final).
