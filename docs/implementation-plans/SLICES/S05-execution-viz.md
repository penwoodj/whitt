# S05 — Agentic Execution Visualization Implementation Plan

> Executes: `docs/feature-requirements/slices/05-execution-viz.md` (cases: EXE-01..17, EXEC-01..05)
> Validation spec: `docs/feature-requirements/validation/slice-05.validation.md`
> Status: NOT-STARTED
> Depends on: E2-agent-runtime-bridge

## 1. Objective

Build execution visualization layer: status bar card (ambient state), YAML workflow tooltip (hover expand), morphing loader (step progression), confirm dialog (double-right-click safety), live panel updates during execution, and file preview handoff. Completes Flow B (voice → execute → expanded node), Flow D (manual open + confirm), Flow E (watch execution live).

## 2. Inputs (READ FIRST — in this order)

| Input | Path |
|---|---|
| Requirements slice | `docs/feature-requirements/slices/05-execution-viz.md` |
| Inherited case source | `docs/broader-vision/requirements/04-agentic-execution-area.md` |
| Validation spec | `docs/feature-requirements/validation/slice-05.validation.md` |
| User-flow narrative | `docs/broader-vision/user-flows.md` (Flow B, D, E) |
| Skills to load | `agent-runtime-bridge`, `storybook`, `modern-react`, `storybook-agentic-e2e`, `test-driven-development` |
| Code-rip sources | `.repos/ragflow/web/src/pages/agent/canvas/node/node-wrapper.tsx`, `.repos/ragflow/web/src/pages/agent/canvas/edge/index.tsx` |

## 3. File plan (REAL paths)

| Action | Path | Notes |
|---|---|---|
| create | `vision-graph-ui/src/features/execution/ExecutionArea.tsx` | Execution area below bar of light (EXE-01) |
| create | `vision-graph-ui/src/features/execution/ExecutionArea.test.tsx` | Maps EXE-01, EXE-02, EXE-03 scenarios |
| create | `vision-graph-ui/src/features/execution/ExecutionArea.stories.tsx` | Story names from validation spec |
| create | `vision-graph-ui/src/features/execution/StatusBarCard.tsx` | Rounded minimal status card (EXE-09, EXE-10, EXE-13) |
| create | `vision-graph-ui/src/features/execution/StatusBarCard.test.tsx` | Maps EXE-09, EXE-10, EXE-13 scenarios |
| create | `vision-graph-ui/src/features/execution/StatusBarCard.stories.tsx` | Story names from validation spec |
| create | `vision-graph-ui/src/features/execution/YamlWorkflowVisualizer.tsx` | YAML tree renderer w/ colored expandable sections (EXE-06, EXE-07, EXE-08) |
| create | `vision-graph-ui/src/features/execution/YamlWorkflowVisualizer.test.tsx` | Maps EXE-06, EXE-07, EXE-08, EXEC-01, EXEC-03 scenarios |
| create | `vision-graph-ui/src/features/execution/YamlWorkflowVisualizer.stories.tsx` | Story names from validation spec |
| create | `vision-graph-ui/src/features/execution/MorphingLoader.tsx` | Icon morph cycle loader (EXE-14) |
| create | `vision-graph-ui/src/features/execution/MorphingLoader.test.tsx` | Maps EXE-14 scenario |
| create | `vision-graph-ui/src/features/execution/MorphingLoader.stories.tsx` | Story names from validation spec |
| create | `vision-graph-ui/src/features/execution/ConfirmDialog.tsx` | Confirm dialog w/ YAML viewer + execute/cancel (EXEC-01) |
| create | `vision-graph-ui/src/features/execution/ConfirmDialog.test.tsx` | Maps EXEC-01 scenario |
| create | `vision-graph-ui/src/features/execution/ConfirmDialog.stories.tsx` | Story names from validation spec |
| create | `vision-graph-ui/src/features/execution/useExecutionState.ts` | Hook: derives busy-set, step-title from AgentEvt stream |
| create | `vision-graph-ui/src/features/execution/useExecutionState.test.tsx` | Tests derivation logic (busy-set, step-title) |
| create | `vision-graph-ui/src/features/execution/fixtures/execution-events.jsonl` | Scripted AgentEvt streams for stories (3-step, error, completion) |
| create | `vision-graph-ui/src/features/execution/fixtures/workflow-valid.yaml` | Valid workflow YAML for EXE-06 visualizer tests |
| create | `vision-graph-ui/src/features/execution/fixtures/workflow-invalid.yaml` | Invalid YAML for EXEC-03 parse failure test |
| create | `vision-graph-ui/src/features/execution/executionPredicates.ts` | Boolean extractors: isRunning, isDone, hasError, isBusy |
| create | `vision-graph-ui/src/features/execution/executionTransforms.ts` | Pure transforms: deriveBusySet, deriveStepTitle, deriveErrorState |
| modify | `vision-graph-ui/src/features/node/NodeStatus.tsx` | Add execution state integration (busy glow, error state) |
| modify | `vision-graph-ui/src/features/node/NodeDetailPanel.tsx` | Wire file preview on creation (EXE-17) |
| rip→port | `vision-graph-ui/src/adapted/ragflow-spinner-pattern.ts` FROM `.repos/ragflow/web/src/pages/agent/canvas/node/node-wrapper.tsx` | Spinner-on-running derived state pattern |
| rip→port | `vision-graph-ui/src/adapted/ragflow-edge-highlight.ts` FROM `.repos/ragflow/web/src/pages/agent/canvas/edge/index.tsx` | Path highlight during execution pattern |

## 4. Question-cycle gate (AGENTS.md §1 Stage 1 — MANDATORY before tests)

Ask user (2-3 questions max):

1. **YAML viewer library decision**: Should we add `js-yaml` (MIT, 18KB) as a dependency for YAML parsing, or implement a minimal custom YAML parser for the workflow schema?
   - Option A: Add `js-yaml` dependency (recommended for robustness, handles edge cases)
   - Option B: Implement minimal custom parser (smaller bundle, but maintenance burden)

2. **Morphing loader icon set**: Which icon set should we use for the step-phase morphing loader (EXE-14, LGT-04)?
   - Option A: Lucide React icons (already in ecosystem per ragflow pattern)
   - Option B: Heroicons (recommended per modern-react skill conventions)
   - Option C: Custom SVG icons (design flexibility, more work)

3. **Confirm dialog vs YAML tooltip**: Should the confirm dialog (EXEC-01) reuse the exact same `YamlWorkflowVisualizer` component as the tooltip, or create a read-only variant?
   - Option A: Reuse exact component (DRY, consistent rendering)
   - Option B: Create read-only variant (smaller bundle for confirm-only use case)

Record answers in this file, then never re-ask.

## 5. Tasks (incremental, TDD, each ends green+committed)

### Task 5.1 — Execution state derivation hook (cases: EXE-11, EXE-15, EXE-16, EXEC-04, EXEC-05)
- **Gherkin first**: `vision-graph-ui/src/features/execution/execution-state.feature` (scenarios = EXE-11, EXE-15, EXE-16, EXEC-04, EXEC-05)
- **Red**: `useExecutionState.test.tsx` + scenarios fail (hook not defined)
- **Green**: `useExecutionState.ts` + `executionPredicates.ts` + `executionTransforms.ts` — implement ragflow pattern: busy-set from startButNotFinished, step-title from last step-start
- **Rip (if any)**: None — pure derivation from AgentEvt stream
- **Story**: `ExecutionState — derived busy-set and step-title` in `useExecutionState.test.tsx` (not a visual story, covered by integration tests)
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/features/execution/useExecutionState.test.tsx` — all exit 0
- **Manifest**: Flip EXE-11, EXE-15, EXE-16, EXEC-04, EXEC-05 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(execution): execution state derivation hook (EXE-11, EXE-15, EXE-16, EXEC-04, EXEC-05)`

### Task 5.2 — YAML workflow visualizer (cases: EXE-06, EXE-07, EXE-08, EXEC-01, EXEC-03)
- **Gherkin first**: `vision-graph-ui/src/features/execution/yaml-visualizer.feature` (scenarios = EXE-06, EXE-07, EXE-08, EXEC-01, EXEC-03)
- **Red**: `YamlWorkflowVisualizer.test.tsx` + scenarios fail (component not defined)
- **Green**: `YamlWorkflowVisualizer.tsx` — implement tree renderer with colored expandable sections, dense padding, error state for invalid YAML
- **Rip (if any)**: None — custom component, js-yaml dependency per question gate decision
- **Story**: `EXE-06 yaml visualizer`, `EXE-07 colored expandable`, `EXE-08 dense padding`, `EXEC-01 confirm shows yaml`, `EXEC-03 yaml failure` in `YamlWorkflowVisualizer.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/features/execution/YamlWorkflowVisualizer.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: Flip EXE-06, EXE-07, EXE-08, EXEC-01, EXEC-03 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(execution): yaml workflow visualizer (EXE-06, EXE-07, EXE-08, EXEC-01, EXEC-03)`

### Task 5.3 — Status bar card (cases: EXE-09, EXE-10, EXE-13, EXEC-02)
- **Gherkin first**: `vision-graph-ui/src/features/execution/status-bar.feature` (scenarios = EXE-09, EXE-10, EXE-13, EXEC-02)
- **Red**: `StatusBarCard.test.tsx` + scenarios fail (component not defined)
- **Green**: `StatusBarCard.tsx` — implement rounded minimal card with status text + loader only, hover affordance; step title truncates w/ ellipsis at card edge, full text on title hover (EXEC-02)
- **Rip (if any)**: None — styled-components component per AGENTS.md §15
- **Story**: `EXE-09 status card minimal`, `EXE-10 hover affordance`, `EXE-13 only text+loader`, `EXEC-02 title truncation` in `StatusBarCard.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/features/execution/StatusBarCard.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: Flip EXE-09, EXE-10, EXE-13, EXEC-02 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(execution): status bar card (EXE-09, EXE-10, EXE-13, EXEC-02)`

### Task 5.4 — Morphing loader (cases: EXE-14)
- **Gherkin first**: `vision-graph-ui/src/features/execution/morphing-loader.feature` (scenarios = EXE-14)
- **Red**: `MorphingLoader.test.tsx` + scenario fails (component not defined)
- **Green**: `MorphingLoader.tsx` — implement icon morph cycle while executing, bound to step title per LGT-05 cadence (S03 owns cadence, S05 owns component + binding)
- **Rip (if any)**: None — custom component, icon set per question gate decision
- **Story**: `EXE-14 morphing icon loader` in `MorphingLoader.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/features/execution/MorphingLoader.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: Flip EXE-14 row → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(execution): morphing icon loader (EXE-14)`

### Task 5.5 — Execution area + launch gestures (cases: EXE-01, EXE-02, EXE-03)
- **Gherkin first**: `vision-graph-ui/src/features/execution/execution-area.feature` (scenarios = EXE-01, EXE-02, EXE-03)
- **Red**: `ExecutionArea.test.tsx` + scenarios fail (component not defined)
- **Green**: `ExecutionArea.tsx` — implement area below bar of light, double-left-click immediate execute, double-right-click confirm-first, integrate `useExecutionState` hook
- **Rip (if any)**: None — integrates existing components (StatusBarCard, ConfirmDialog)
- **Story**: `EXE-01 area present`, `EXE-02 dbl-left executes`, `EXE-03 dbl-right confirms` in `ExecutionArea.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/features/execution/ExecutionArea.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: Flip EXE-01, EXE-02, EXE-03 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(execution): execution area + launch gestures (EXE-01, EXE-02, EXE-03)`

### Task 5.6 — Confirm dialog (cases: EXEC-01)
- **Gherkin first**: `vision-graph-ui/src/features/execution/confirm-dialog.feature` (scenarios = EXEC-01)
- **Red**: `ConfirmDialog.test.tsx` + scenario fails (component not defined)
- **Green**: `ConfirmDialog.tsx` — implement dialog with YAML visualizer (reused per question gate decision) + execute/cancel actions
- **Rip (if any)**: None — styled-components modal, reuses YamlWorkflowVisualizer
- **Story**: `EXEC-01 confirm shows yaml` in `ConfirmDialog.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/features/execution/ConfirmDialog.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: Flip EXEC-01 row → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(execution): confirm dialog (EXEC-01)`

### Task 5.7 — Integration: live panel updates + file preview (cases: EXE-04, EXE-05, EXE-16, EXE-17)
- **Gherkin first**: `vision-graph-ui/src/features/execution/live-updates.feature` (scenarios = EXE-04, EXE-05, EXE-16, EXE-17)
- **Red**: Integration tests in `ExecutionArea.test.tsx` + scenarios fail (tooltip pinning, live updates, file preview not wired)
- **Green**: Wire tooltip pinning semantics (same as input tooltip VOX-06), integrate file-write events with NodeDetailPanel preview, script agent-event fixtures via `playAgentScript`
- **Rip (if any)**: Port ragflow spinner pattern to `src/adapted/ragflow-spinner-pattern.ts` for derived busy-set
- **Story**: `EXE-04 hover yaml tooltip`, `EXE-05 tooltip pins`, `EXE-16 panel live`, `EXE-17 file preview on create` in `ExecutionArea.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/features/execution/ExecutionArea.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: Flip EXE-04, EXE-05, EXE-16, EXE-17 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(execution): live panel updates + file preview (EXE-04, EXE-05, EXE-16, EXE-17)`

### Task 5.8 — Integration: edge breathing + completion glow (cases: EXE-11, EXE-12, EXEC-05)
- **Gherkin first**: `vision-graph-ui/src/features/execution/edge-animation.feature` (scenarios = EXE-11, EXE-12, EXEC-05)
- **Red**: Integration tests + scenarios fail (edge breathing not wired, completion glow not integrated)
- **Green**: Port ragflow edge-highlight pattern to `src/adapted/ragflow-edge-highlight.ts`, wire breathing edges during execution (EXE-11), integrate completion glow per LGT-01 done-glow fade (~2s)
- **Rip (if any)**: Port ragflow edge-highlight pattern for path highlight during execution
- **Story**: `EXE-11 edges breathe`, `EXE-12 border animations`, `EXEC-05 completion` in `ExecutionArea.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/features/execution/ExecutionArea.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: Flip EXE-11, EXE-12, EXEC-05 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(execution): edge breathing + completion glow (EXE-11, EXE-12, EXEC-05)`

## 6. Skill + agent routing (per task)

| Task | Skills to load | Delegate to |
|---|---|---|
| 5.1 | `agent-runtime-bridge`, `modern-react`, `test-driven-development` | `category="deep"` |
| 5.2 | `modern-react`, `storybook`, `test-driven-development` | `category="deep"` |
| 5.3 | `modern-react`, `storybook`, `test-driven-development` | `category="visual-engineering"` |
| 5.4 | `modern-react`, `storybook`, `test-driven-development` | `category="visual-engineering"` |
| 5.5 | `agent-runtime-bridge`, `modern-react`, `storybook`, `test-driven-development` | `category="deep"` |
| 5.6 | `modern-react`, `storybook`, `test-driven-development` | `category="visual-engineering"` |
| 5.7 | `agent-runtime-bridge`, `storybook-agentic-e2e`, `modern-react`, `test-driven-development` | `category="deep"` |
| 5.8 | `agent-runtime-bridge`, `storybook-agentic-e2e`, `modern-react`, `test-driven-development` | `category="visual-engineering"` |

## 7. Live-system validation gate (slice DONE only when ALL pass)

1. Run validation stories: `npx vitest run --project=storybook -t "slice05"`
2. Every case ID in slice → story → play fn asserts pass (see validation spec assert table)
3. Manifest: all slice rows `pass` (or `deferred` w/ reason)
4. `check-coverage.sh` GREEN
5. Manual review: user eyeballs stories in Storybook UI (serve: `npm run storybook`)

## 8. Retry loop (failure = iterate, NEVER skip)

```
attempt → fail → read actual log lines (AGENTS.md §2)
  → hypothesis → minimal fix → re-run story
  → fail again? ×2 → load systematic-debugging skill
  → fail ×3 → escalate: oracle subagent w/ full ctx → fix → re-run
  → NEVER: delete test, loosen assert, extend timeout >2×, mark skip w/o user OK
```

## 9. Out of scope / guards

- **EXE-11 edge breathing cadence**: Owned by S03 (light-language slice) — S05 only wires the derived busy-set to edge animation
- **EXE-12 border animations**: Marked "eventual" in requirements — defer to future polish
- **EXE-14 morph cycle cadence**: LGT-05 cadence owned by S03 — S05 only owns component + step-title binding
- **Transport layer (WebSocket vs FS events)**: Engine-side decision per agent-runtime-bridge skill — UI consumes AgentEvt stream either way
- **Canvas physics/layout**: S10/S11 scope — S05 does not modify node positioning
- **File preview editing**: S07 scope — S05 only surfaces file preview on creation (EXE-17)

---

## Notes

- **Fixture dependencies**: Scripted AgentEvt streams from `storybook-agentic-e2e` skill depend on E2 fake runtime — tasks 5.7, 5.8 use `playAgentScript` with JSONL fixtures
- **Ragflow patterns**: Two rip tasks (spinner pattern, edge highlight) port per Apache-2.0 license via `oss-code-adaptation` skill
- **Cross-slice boundaries**: S03 owns breathing/glow cadence (LGT patterns), S05 only wires derived execution state; S07 owns file editing, S05 only surfaces preview on creation
- **Panel components independent of canvas**: Depends on E2 only, not E4 (react-flow upgrade) — panel components work without canvas context
- **YAML viewer decision**: Custom small renderer vs js-yaml dependency — resolved in question gate, affects task 5.2 bundle size
