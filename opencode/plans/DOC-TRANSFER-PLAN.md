# Documentation Transfer Plan

**Version:** 1.0  
**Date:** 2026-04-07  
**Status:** READY TO EXECUTE (after review cycle 3)

> **2026-08-14 dedup note:** transferred `opencode/docs/plans/03-glyphnova-ui/` tree
> removed — near-duplicate of canonical `docs/inspiration-reports/yaml-to-rust-agentsdk/`
> (17/18 files identical; diverged `tasks/00` variant + full tree retained in git history,
> commit before `chore(docs)` dedup of 2026-08-14).

This plan governs the one-time transfer of documentation from `~/code/yaml-to-rust-agentsdk/` to `~/code/whitt/opencode/docs/`. It was reviewed in 3 full critical review cycles (see REVIEW-CYCLE-{1,2,3}.md).

---

## Table of Contents

1. [Pre-flight Checklist](#1-pre-flight-checklist)
2. [Transfer Summary](#2-transfer-summary)
3. [Files to COPY to Whitt (62 files)](#3-files-to-copy-to-whitt)
4. [Files to REFERENCE as Shared (38 files)](#4-files-to-reference-as-shared)
5. [Files that STAY in yaml-to-rust-agentsdk (unchanged)](#5-files-that-stay)
6. [Post-Transfer Verification](#6-post-transfer-verification)
7. [Rollback Plan](#7-rollback-plan)

---

## 1. Pre-flight Checklist

Before ANY file operations:

- [x] **Backup all repos to ~/data/**
  - [x] `~/data/yaml-to-rust-agentsdk-backup-20260407/` (16MB)
  - [x] `~/data/whitt-backup-20260407/` (252K)
  - [x] `~/data/agent-queue-backup-20260407/` (2.4MB)
  - [x] `~/data/model-router-backup-20260407/` (196K)
- [x] **model-router moved** to `~/code/model-router/` (commit 2c063c7)
- [x] **model-router removed** from parent repo (commit 6a6cf191)
- [ ] **yaml-to-rust-agentsdk committed and pushed** (do before transfer)
- [ ] **whitt committed and pushed** (do before transfer)
- [ ] **Verify clean working tree** on both repos

### Safety Commands (run before transfer)

```bash
# Verify backups exist
ls -la ~/data/*backup-20260407/

# Verify repos are clean
cd ~/code/yaml-to-rust-agentsdk && git status
cd ~/code/whitt && git status

# Verify remote push
cd ~/code/yaml-to-rust-agentsdk && git log --oneline -1
cd ~/code/whitt && git log --oneline -1
```

---

## 2. Transfer Summary

| Category | Count | Action |
|---|---|---|
| **COPY to whitt** | 62 files | `cp` from yaml-to-rust-agentsdk → whitt/opencode/docs/ |
| **SHARED (reference)** | 38 files | Leave in yaml-to-rust-agentsdk; add README pointer in whitt |
| **STAY (unchanged)** | ~281 files | No action needed |

**Total files in yaml-to-rust-agentsdk:** ~381  
**Total files affected:** 100 (62 copy + 38 shared reference)

### Transfer Method: COPY (not move)

We **COPY** files, not move them. yaml-to-rust-agentsdk retains its full documentation. Whitt gets its own copy of UI/UX/automation docs. Shared docs stay in yaml-to-rust-agentsdk with a pointer in whitt.

**Rationale:**
- yaml-to-rust-agentsdk needs its own complete docs for phases 3/6/7 context during implementation
- Whitt needs its own copy to modify freely without affecting SDK docs
- Shared docs are architecture-level and should be single-source-of-truth in yaml-to-rust-agentsdk

---

## 3. Files to COPY to Whitt

### 3.1 Phase 3: Glyphnova UI (14 files)

**Source:** `~/code/yaml-to-rust-agentsdk/opencode/docs/plans/03-glyphnova-ui/`  
**Destination:** `~/code/whitt/opencode/docs/plans/03-glyphnova-ui/`

| # | Source File | Destination File |
|---|---|---|
| 1 | `03-glyphnova-ui/plan.md` | `03-glyphnova-ui/plan.md` |
| 2 | `03-glyphnova-ui/tasks/00-desktop-shell-setup.md` | `03-glyphnova-ui/tasks/00-desktop-shell-setup.md` |
| 3 | `03-glyphnova-ui/tasks/01-shared-backend-api.md` | `03-glyphnova-ui/tasks/01-shared-backend-api.md` |
| 4 | `03-glyphnova-ui/tasks/02-queue-visualization.md` | `03-glyphnova-ui/tasks/02-queue-visualization.md` |
| 5 | `03-glyphnova-ui/tasks/03-scope-indicators.md` | `03-glyphnova-ui/tasks/03-scope-indicators.md` |
| 6 | `03-glyphnova-ui/tasks/04-multi-zoom-navigation.md` | `03-glyphnova-ui/tasks/04-multi-zoom-navigation.md` |
| 7 | `03-glyphnova-ui/tasks/05-drag-drop-reprioritization.md` | `03-glyphnova-ui/tasks/05-drag-drop-reprioritization.md` |
| 8 | `03-glyphnova-ui/tasks/06-artifact-browser.md` | `03-glyphnova-ui/tasks/06-artifact-browser.md` |
| 9 | `03-glyphnova-ui/tasks/07-summary-graph-views.md` | `03-glyphnova-ui/tasks/07-summary-graph-views.md` |
| 10 | `03-glyphnova-ui/tasks/08-quality-metrics-dashboard.md` | `03-glyphnova-ui/tasks/08-quality-metrics-dashboard.md` |
| 11 | `03-glyphnova-ui/validation/criteria.md` | `03-glyphnova-ui/validation/criteria.md` |
| 12 | `03-glyphnova-ui/validation/adr-compliance.md` | `03-glyphnova-ui/validation/adr-compliance.md` |
| 13 | `03-glyphnova-ui/validation/acceptance-criteria.md` | `03-glyphnova-ui/validation/acceptance-criteria.md` |
| 14 | `03-glyphnova-ui/tests/mock-strategies.md` | `03-glyphnova-ui/tests/mock-strategies.md` |

### 3.2 Phase 6: Automation (18 files)

**Source:** `~/code/yaml-to-rust-agentsdk/opencode/docs/plans/06-automation/`  
**Destination:** `~/code/whitt/opencode/docs/plans/06-automation/`

| # | Source File |
|---|---|
| 15 | `06-automation/plan.md` |
| 16 | `06-automation/tasks/00-cron-scheduler.md` |
| 17 | `06-automation/tasks/01-git-experiment-framework.md` |
| 18 | `06-automation/tasks/02-merge-proposal-generation.md` |
| 19 | `06-automation/tasks/03-manual-refinement-capture.md` |
| 20 | `06-automation/tasks/04-experiment-result-tracking.md` |
| 21 | `06-automation/tasks/05-rollback-cleanup.md` |
| 22 | `06-automation/tasks/06-scheduling-policy-compiler.md` |
| 23 | `06-automation/tasks/07-automation-cli.md` |
| 24 | `06-automation/tasks/08-automation-ui-integration.md` |
| 25 | `06-automation/validation/adr0007_cron_compilation_test.rs` |
| 26 | `06-automation/validation/adr0007_branch_isolation_test.rs` |
| 27 | `06-automation/validation/adr0007_merge_outputs_test.rs` |
| 28 | `06-automation/validation/adr0007_refinement_events_test.rs` |
| 29 | `06-automation/validation/checkpoint-criteria.md` |
| 30 | `06-automation/validation/acceptance-criteria.md` |
| 31 | `06-automation/tests/unit-tests.md` |
| 32 | `06-automation/tests/integration-tests.md` |

### 3.3 Phase 7: Autonomy & Metrics (21 files)

**Source:** `~/code/yaml-to-rust-agentsdk/opencode/docs/plans/07-autonomy-metrics/`  
**Destination:** `~/code/whitt/opencode/docs/plans/07-autonomy-metrics/`

| # | Source File |
|---|---|
| 33 | `07-autonomy-metrics/plan.md` |
| 34 | `07-autonomy-metrics/tasks/00-autonomous-loop-contracts.md` |
| 35 | `07-autonomy-metrics/tasks/01-metrics-collection.md` |
| 36 | `07-autonomy-metrics/tasks/02-human-override-controls.md` |
| 37 | `07-autonomy-metrics/tasks/03-intervention-tracking.md` |
| 38 | `07-autonomy-metrics/tasks/04-success-regression-dashboards.md` |
| 39 | `07-autonomy-metrics/tasks/05-stop-condition-evaluation.md` |
| 40 | `07-autonomy-metrics/tasks/06-checkpoint-generation.md` |
| 41 | `07-autonomy-metrics/tasks/07-autonomy-scope-risk.md` |
| 42 | `07-autonomy-metrics/tasks/08-confidence-thresholds.md` |
| 43 | `07-autonomy-metrics/tasks/09-autonomy-cli-ui.md` |
| 44 | `07-autonomy-metrics/validation/mock_autonomous_workflow.yaml` |
| 45 | `07-autonomy-metrics/validation/mock_metrics_collector.yaml` |
| 46 | `07-autonomy-metrics/validation/mock_override_events.yaml` |
| 47 | `07-autonomy-metrics/validation/checkpoint-criteria.md` |
| 48 | `07-autonomy-metrics/validation/acceptance-criteria.md` |
| 49 | `07-autonomy-metrics/tests/integration_tests.rs` |
| 50 | `07-autonomy-metrics/tests/validation_tests.rs` |
| 51 | `07-autonomy-metrics/tests/unit-tests.md` |
| 52 | `07-autonomy-metrics/tests/integration-tests.md` |
| 53 | `07-autonomy-metrics/tests/property-tests.md` |

### 3.4 Future Research (8 files)

**Source:** `~/code/yaml-to-rust-agentsdk/opencode/docs/research/next-steps/`  
**Destination:** `~/code/whitt/opencode/docs/research/next-steps/`

| # | Source File |
|---|---|
| 54 | `next-steps/README.md` |
| 55 | `next-steps/01-advanced-transpiler-features.md` |
| 56 | `next-steps/02-emerging-technologies.md` |
| 57 | `next-steps/03-future-research-directions.md` |
| 58 | `next-steps/04-enhancement-roadmap.md` |
| 59 | `next-steps/05-scalability-considerations.md` |
| 60 | `next-steps/github-patterns-reference.md` |
| 61 | `next-steps/SUMMARY.md` |

### 3.5 Assessment Report (1 file)

**Source:** `~/code/yaml-to-rust-agentsdk/opencode/docs/reports/BAREBONES_APPROACH_ASSESSMENT.md`  
**Destination:** `~/code/whitt/opencode/docs/reports/BAREBONES_APPROACH_ASSESSMENT.md`

| # | Source File |
|---|---|
| 62 | `reports/BAREBONES_APPROACH_ASSESSMENT.md` |

---

## 4. Files to REFERENCE as Shared

These files stay in yaml-to-rust-agentsdk. Whitt will have a `SHARED-DOCS.md` pointer file listing their locations.

### 4.1 Architecture (3 files)

| File | Why Shared |
|---|---|
| `opencode/docs/plans/INDEX.md` | Master plan index - both projects need context |
| `opencode/docs/plans/ARCHITECTURE.md` | 4-layer system architecture - both need to understand |
| `opencode/docs/plans/transpiler/transpiler_architecture.md` | Compiler pipeline - SDK implements, Whitt consumes |

### 4.2 Traceability (4 files)

| File | Why Shared |
|---|---|
| `opencode/docs/plans/traceability/schema-to-phase-matrix.md` | Schema ownership across phases |
| `opencode/docs/plans/traceability/adr-to-phase-matrix.md` | ADR constraint mapping |
| `opencode/docs/plans/traceability/workflow-to-phase-matrix.md` | Workflow test ownership |
| `opencode/docs/plans/traceability/requirements-traceability.md` | Requirements R01-R31 trace |

### 4.3 Validation Framework (12 files)

| File | Why Shared |
|---|---|
| `opencode/docs/plans/validation-criteria/framework.md` | 7-layer verification system |
| `opencode/docs/plans/validation-criteria/phase-00-criteria.md` | Phase 0 criteria |
| `opencode/docs/plans/validation-criteria/phase-01-criteria.md` | Phase 1 criteria |
| `opencode/docs/plans/validation-criteria/phase-02-criteria.md` | Phase 2 criteria |
| `opencode/docs/plans/validation-criteria/phase-03-criteria.md` | Phase 3 criteria |
| `opencode/docs/plans/validation-criteria/phase-04-criteria.md` | Phase 4 criteria |
| `opencode/docs/plans/validation-criteria/phase-05-criteria.md` | Phase 5 criteria |
| `opencode/docs/plans/validation-criteria/phase-06-criteria.md` | Phase 6 criteria |
| `opencode/docs/plans/validation-criteria/phase-07-criteria.md` | Phase 7 criteria |
| `opencode/docs/plans/validation-criteria/phase-08-criteria.md` | Phase 8 criteria |
| `opencode/docs/plans/validation-criteria/anti-goal-drift-checklist.md` | Goal drift prevention |
| `opencode/docs/plans/validation-criteria/cumulative-progress.md` | Progress tracking |

### 4.4 Deep Research (7 files)

| File | Why Shared |
|---|---|
| `opencode/docs/plans/deep-research/00-research-master-plan.md` | Research coordination |
| `opencode/docs/plans/deep-research/01-yaml-schema-research.md` | YAML patterns |
| `opencode/docs/plans/deep-research/02-rust-ecosystem-research.md` | Rust libraries |
| `opencode/docs/plans/deep-research/03-llm-backend-research.md` | LLM backend patterns |
| `opencode/docs/plans/deep-research/04-agent-patterns-research.md` | Agent design patterns |
| `opencode/docs/plans/deep-research/05-testing-strategy-research.md` | Testing approaches |
| `opencode/docs/plans/deep-research/06-performance-research.md` | Performance benchmarks |

### 4.5 Roadmap Research (11 files)

| File | Why Shared |
|---|---|
| `opencode/docs/reports/roadmap/research/*.md` (7 reports) | Cross-phase research |
| `opencode/docs/reports/roadmap/research/*.csv` (2 evidence files) | Research evidence |
| `opencode/docs/reports/roadmap/research/*.yml` (1 completion) | Completion tracking |
| `opencode/docs/sync-iteration-1.md` | Schema sync documentation |

---

## 5. Files that STAY

The following remain in `~/code/yaml-to-rust-agentsdk/` with no changes:

- **Root docs:** README.md, DEVELOPER_GUIDE.md, INSTALL.md, TESTING_GUIDE.md, etc.
- **Phase 0 (Foundation):** 23 files - YAML parsing, schema, IR compiler, storage
- **Phase 1 (MVP Queue):** 19 files - Chat sessions, state machine, executor
- **Phase 2 (CLI & Backends):** 19 files - CLI interface, LLM backends, tools
- **Phase 4 (Quality Loops):** 15 files - Verify-repair runtime, benchmarks
- **Phase 5 (Memory & Search):** 33 files - Local memory, fulltext/semantic search
- **Phase 8 (Final Validation):** 12 files - 7-layer verification, progressive benchmarks
- **Core Requirements:** Schema consolidation (1705 lines), 52 YAML workflow examples
- **Model Router Research:** 11 files in `opencode/docs/reports/requirements/model-router/`
- **Benchmark User Flows:** 20 files in `opencode/docs/reports/requirements/benchmark-100-model-userflows/`
- **All YAML schema files:** 87 YAML files
- **All test specification files:** 02-*.md through 08-*.md

---

## 6. Post-Transfer Verification

After completing the transfer, verify:

### 6.1 File Count Verification

```bash
# Verify whitt received all files
cd ~/code/whitt
echo "Phase 3 files:" && find opencode/docs/plans/03-glyphnova-ui/ -type f | wc -l   # Expect: 14
echo "Phase 6 files:" && find opencode/docs/plans/06-automation/ -type f | wc -l      # Expect: 18
echo "Phase 7 files:" && find opencode/docs/plans/07-autonomy-metrics/ -type f | wc -l # Expect: 21
echo "Research files:" && find opencode/docs/research/ -type f | wc -l               # Expect: 8
echo "Total copied:" && find opencode/docs/ -type f | wc -l                          # Expect: 62+
```

### 6.2 yaml-to-rust-agentsdk Integrity

```bash
# Verify source repo is unchanged
cd ~/code/yaml-to-rust-agentsdk
git diff --stat  # Should show NO changes
git status       # Should be clean
```

### 6.3 Cross-Reference Check

```bash
# Verify no broken internal links in transferred docs
cd ~/code/whitt
grep -r '\.\./\.\.' opencode/docs/ | head -20  # Check for links pointing above docs/
```

---

## 7. Rollback Plan

If the transfer causes issues:

```bash
# 1. Revert whitt to pre-transfer state
cd ~/code/whitt
git log --oneline -5                    # Find pre-transfer commit
git reset --hard <pre-transfer-commit>  # Restore

# 2. yaml-to-rust-agentsdk was never modified (COPY, not MOVE)
cd ~/code/yaml-to-rust-agentsdk
git diff --stat  # Should be clean

# 3. Restore from backup if git reset fails
cp -r ~/data/whitt-backup-20260407/* ~/code/whitt/
```

---

## Execution Commands

When ready to execute, run these commands in order:

```bash
#!/bin/bash
set -euo pipefail

SDK=~/code/yaml-to-rust-agentsdk/opencode/docs
WHITT=~/code/whitt/opencode/docs

# Step 1: Create destination directories
mkdir -p "$WHITT/plans/03-glyphnova-ui/"{tasks,validation,tests}
mkdir -p "$WHITT/plans/06-automation/"{tasks,validation,tests}
mkdir -p "$WHITT/plans/07-autonomy-metrics/"{tasks,validation,tests}
mkdir -p "$WHITT/research/next-steps"
mkdir -p "$WHITT/reports"

# Step 2: Copy Phase 3 UI (14 files)
cp -r "$SDK/plans/03-glyphnova-ui/"* "$WHITT/plans/03-glyphnova-ui/"

# Step 3: Copy Phase 6 Automation (18 files)
cp -r "$SDK/plans/06-automation/"* "$WHITT/plans/06-automation/"

# Step 4: Copy Phase 7 Autonomy (21 files)
cp -r "$SDK/plans/07-autonomy-metrics/"* "$WHITT/plans/07-autonomy-metrics/"

# Step 5: Copy Future Research (8 files)
cp -r "$SDK/research/next-steps/"* "$WHITT/research/next-steps/"

# Step 6: Copy Assessment Report (1 file)
cp "$SDK/reports/BAREBONES_APPROACH_ASSESSMENT.md" "$WHITT/reports/"

# Step 7: Create shared docs pointer
cat > "$WHITT/SHARED-DOCS.md" << 'POINTER'
# Shared Documentation (Source of Truth: yaml-to-rust-agentsdk)

These documents live in ~/code/yaml-to-rust-agentsdk/ and are referenced here.
Do NOT copy them - they are single-source-of-truth.

## Architecture (3 files)
- ../../yaml-to-rust-agentsdk/opencode/docs/plans/INDEX.md
- ../../yaml-to-rust-agentsdk/opencode/docs/plans/ARCHITECTURE.md
- ../../yaml-to-rust-agentsdk/opencode/docs/plans/transpiler/transpiler_architecture.md

## Traceability (4 files)
- ../../yaml-to-rust-agentsdk/opencode/docs/plans/traceability/schema-to-phase-matrix.md
- ../../yaml-to-rust-agentsdk/opencode/docs/plans/traceability/adr-to-phase-matrix.md
- ../../yaml-to-rust-agentsdk/opencode/docs/plans/traceability/workflow-to-phase-matrix.md
- ../../yaml-to-rust-agentsdk/opencode/docs/plans/traceability/requirements-traceability.md

## Validation Framework (12 files)
- ../../yaml-to-rust-agentsdk/opencode/docs/plans/validation-criteria/

## Deep Research (7 files)
- ../../yaml-to-rust-agentsdk/opencode/docs/plans/deep-research/

## Roadmap Research (11 files)
- ../../yaml-to-rust-agentsdk/opencode/docs/reports/roadmap/research/
- ../../yaml-to-rust-agentsdk/opencode/docs/sync-iteration-1.md
POINTER

echo "Transfer complete. Verify with:"
echo "  find $WHITT -type f | wc -l"
echo "  cd ~/code/yaml-to-rust-agentsdk && git diff --stat"
```

---

## Review Cycle Results

This plan was reviewed in 3 critical cycles. Key findings addressed:

| Cycle | Issues Found | Critical |
|---|---|---|
| Cycle 1 | 8 issues | 2 (SDK has no CLI commands yet; agent-queue has no code) |
| Cycle 2 | 8 issues | 2 (Whitt needs internal queue for MVP-A; no timeout handling) |
| Cycle 3 | 8 issues | 2 (No graceful shutdown; no CI/CD plan) |

See REVIEW-CYCLE-{1,2,3}.md for full details.

---

## Appendix: File Counts by Phase

| Phase/Section | In yaml-to-rust-agentsdk | Action |
|---|---|---|
| Phase 0: Foundation | 23 files | STAY |
| Phase 1: MVP Queue | 19 files | STAY |
| Phase 2: CLI & Backends | 19 files | STAY |
| **Phase 3: Glyphnova UI** | **14 files** | **COPY → whitt** |
| Phase 4: Quality Loops | 15 files | STAY |
| Phase 5: Memory & Search | 33 files | STAY |
| **Phase 6: Automation** | **18 files** | **COPY → whitt** |
| **Phase 7: Autonomy** | **21 files** | **COPY → whitt** |
| Phase 8: Final Validation | 12 files | STAY |
| **Research/Next-steps** | **8 files** | **COPY → whitt** |
| **Barebones Assessment** | **1 file** | **COPY → whitt** |
| Traceability | 4 files | SHARED (reference) |
| Validation Criteria | 12 files | SHARED (reference) |
| Deep Research | 7 files | SHARED (reference) |
| Architecture | 3 files | SHARED (reference) |
| Roadmap Research | 11 files | SHARED (reference) |
| Root docs | 16 files | STAY |
| YAML schemas/examples | 87 files | STAY |
| Core requirements/reports | ~100 files | STAY |
