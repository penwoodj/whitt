# Risks and Mitigations for Implementation Agents

> **Version**: 1.0
> **Purpose**: Upstream risk factors that could cause an agent to fail during implementation
> **Audience**: AI coding agents tasked with implementing whitt, documentation transfer, etc.

---

## Risk Categories

### R1: Documentation Transfer Risks

#### R1.1: Cross-Reference Breakage
**Risk**: Files moved to whitt still reference paths in yaml-to-rust-agentsdk (e.g., `../requirements.md`, `../../schema/`)
**Impact**: Broken links in transferred documentation
**Mitigation**:
1. After transfer, search all moved files for `../`, `../../`, absolute paths containing `yaml-to-rust-agentsdk`
2. Update to relative paths within whitt's structure
3. For files that reference content that STAYED in yaml-to-rust-agentsdk, add a note: `This references content in ~/code/yaml-to-rust-agentsdk/opencode/docs/...`

#### R1.2: Shared File Duplication
**Risk**: 35 "SHARED" files get duplicated in both repos, leading to drift
**Impact**: Documentation becomes inconsistent between repos
**Mitigation**:
1. For SHARED files, whitt should contain a **reference document** pointing to the canonical source
2. Use relative path references, not copies
3. Example: whitt/opencode/docs/shared/ARCHITECTURE.md contains only: `See: ~/code/yaml-to-rust-agentsdk/opencode/docs/plans/ARCHITECTURE.md`
4. Alternative: symlinks (but fragile across git repos)

#### R1.3: File Classification Errors
**Risk**: A file was classified wrong (should STAY but was moved, or vice versa)
**Impact**: Missing documentation in one or both repos
**Mitigation**:
1. Verify every moved file against the classification in doc-inventory.md
2. Check that yaml-to-rust-agentsdk still has all Phase 0,1,2,4,5,8 files
3. Check that whitt has all Phase 3,6,7 files plus future research
4. Spot-check 10 random files in each repo for content matching their classification

---

### R2: Repository Structure Risks

#### R2.1: Git History Not Preserved
**Risk**: Moving files between repos loses git history
**Impact**: Cannot trace when/why documentation was created
**Mitigation**:
1. Use `git log --follow` if files were moved within the same repo
2. For cross-repo moves, the source repo retains history; destination starts fresh
3. Add migration commit messages referencing the source: `Moved from yaml-to-rust-agentsdk Phase 3 UI plans`

#### R2.2: agent-queue Has No Code
**Risk**: Implementation agent tries to import agent-queue as a library but no Cargo.toml exists
**Impact**: Build failures
**Mitigation**:
1. agent-queue is planning-only - do NOT try to `cargo add agent-queue`
2. In MVP, agent-queue communication is CLI subprocess only
3. Library API is post-MVP - wait for agent-queue to implement it

#### R2.3: model-router is Python, Others are Rust
**Risk**: Language mismatch causes integration confusion
**Impact**: Agent tries to import Python module from Rust, or vice versa
**Mitigation**:
1. model-router communicates via CLI subprocess (like agent-queue)
2. No cross-language library imports in MVP
3. model-router Python binary called via `Command::new("model-router")`

---

### R3: Technology Stack Risks

#### R3.1: Tauri v2 API Differences
**Risk**: Agent uses Tauri v1 APIs which don't exist in v2
**Impact**: Build failures, runtime errors
**Mitigation**:
1. Use Tauri v2 documentation exclusively
2. Key v2 changes: `tauri::command` → `#[tauri::command]`, `invoke` API changed
3. Check Tauri v2 plugin compatibility before using any plugin

#### R3.2: React 18 vs React 19
**Risk**: Agent uses React 19 APIs that don't exist in React 18
**Impact**: Runtime errors in frontend
**Mitigation**:
1. Pin to React 18.x in package.json
2. Use stable hooks only (useState, useEffect, useRef, useMemo, useCallback)
3. No Server Components (React 19 feature)

#### R3.3: CLI Binaries Not on PATH
**Risk**: Whitt tries to call `yaml-to-rust-agentsdk` or `agent-queue` but they're not installed
**Impact**: Command not found errors
**Mitigation**:
1. Whitt should bundle or detect CLI locations at startup
2. Settings panel should allow configuring CLI paths
3. First-run wizard checks for required CLIs and offers installation guidance
4. Default search paths: `~/.cargo/bin/`, `/usr/local/bin/`, `~/code/*/target/release/`

#### R3.4: LM Studio / Ollama Not Running
**Risk**: User starts whitt but no LLM backend is running
**Impact**: All workflows fail immediately
**Mitigation**:
1. Health check on startup (try connecting to localhost:1234 and localhost:11434)
2. Clear error message: "No LLM backend found. Start LM Studio or Ollama, then restart whitt."
3. Don't crash - show settings panel to configure backend

---

### R4: Resource Constraint Risks

#### R4.1: OOM on 16GB Desktop
**Risk**: Loading a large model + running whitt + OS exceeds 16GB
**Impact**: System freeze, OOM killer terminates processes
**Mitigation**:
1. Whitt monitors available RAM before allowing workflow execution
2. Default to smallest available model on first run
3. Warn before loading models > 8GB on 16GB systems
4. Catch SIGTERM gracefully and save state

#### R4.2: SQLite WAL Mode Conflicts
**Risk**: Both agent-queue and other processes access SQLite simultaneously
**Impact**: Database locked errors
**Mitigation**:
1. agent-queue uses WAL mode which allows concurrent reads
2. Only one writer at a time (SQLite guarantees this via file locks)
3. Configure busy_timeout to 5000ms for retry on lock contention

---

### R5: Skills and Tooling Risks

#### R5.1: No Tauri Skills Loaded
**Risk**: Agent implementing whitt doesn't know Tauri v2 APIs
**Impact**: Incorrect Tauri usage, security vulnerabilities
**Mitigation**:
1. Before implementing whitt, load relevant skills:
   - `frontend-design` for React/TypeScript UI
   - `playwright` for testing the Tauri app in browser context
   - `webapp-testing` for E2E testing
2. Consult Context7 for Tauri v2 documentation

#### R5.2: No Rust CLI Skills
**Risk**: Agent implementing yaml-to-rust-agentsdk CLI commands doesn't follow Clap patterns
**Impact**: Inconsistent CLI interface
**Mitigation**:
1. Follow existing Clap patterns in yaml-to-rust-agentsdk source
2. Use `#[derive(Parser)]` for command structures
3. All output should be JSON when `--format json` flag present

#### R5.3: Missing Node.js Toolchain
**Risk**: Agent tries to build React frontend but npm/node not installed
**Impact**: Build failures
**Mitigation**:
1. Verify node/npm installed before starting frontend work
2. Use `npm install --yes` for dependency installation
3. Use `npm run build` for production builds
4. Tauri's `tauri build` handles the full pipeline

---

### R6: Integration Testing Risks

#### R6.1: Cannot Test CLI Integration in CI
**Risk**: CI environment doesn't have yaml-to-rust-agentsdk or agent-queue binaries
**Impact**: Integration tests pass locally but fail in CI
**Mitigation**:
1. Build CLI binaries as part of CI pipeline
2. Use `cargo build --release` in CI before running whitt tests
3. Mock CLI output for unit tests
4. Integration tests run only when CLIs are available (feature-gated)

#### R6.2: Flaky Tests Due to LLM Response Timing
**Risk**: Tests depend on LLM response speed which varies
**Impact**: Intermittent test failures
**Mitigation**:
1. Mock LLM backend for all non-E2E tests
2. Use timeout guards (max 30s per test step)
3. E2E tests should use smallest model available
4. Mark LLM-dependent tests with `#[ignore]` for fast CI runs

---

## Pre-Implementation Checklist

Before an agent starts implementing whitt:

- [ ] All 4 repos are backed up to ~/data/
- [ ] yaml-to-rust-agentsdk has clean git status (committed, pushed)
- [ ] agent-queue has clean git status (committed, pushed)
- [ ] whitt has clean git status (committed, pushed)
- [ ] model-router has clean git status (committed, pushed)
- [ ] Node.js 18+ and npm 9+ are installed
- [ ] Rust toolchain (stable) is installed
- [ ] Tauri CLI is installed (`cargo install tauri-cli`)
- [ ] LM Studio or Ollama is available for testing
- [ ] Plan files are reviewed and finalized (3 cycles complete)
- [ ] Documentation transfer is complete and verified
