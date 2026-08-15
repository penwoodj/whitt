# S01 — App Shell & Project Rail Implementation Plan

> Executes: `docs/feature-requirements/slices/01-app-shell.md` (cases: APP-01..07, APPC-01..03)
> Validation spec: `docs/feature-requirements/validation/slice-01.validation.md`
> Status: NOT-STARTED
> Depends on: E4 (react-flow upgrade — canvas mounts with @xyflow/react 12)

## 1. Objective

Delivers app shell with fixed left project rail, project load/switch, new project session, rail scroll, empty state, and load failure handling. Completes Flow A (first open) and Flow K (switch projects).

## 2. Inputs (READ FIRST — in this order)

| Input | Path |
|---|---|
| Requirements slice | `docs/feature-requirements/slices/01-app-shell.md` |
| Inherited case source | `docs/broader-vision/requirements/01-app-shell-projects.md` |
| Validation spec | `docs/feature-requirements/validation/slice-01.validation.md` |
| User-flow narrative | `docs/broader-vision/user-flows.md` (Flow A, K) |
| Skills to load | `modern-react`, `storybook`, `react-flow`, `test-driven-development`, `verification-before-completion` |
| Code-rip sources | `none` (no OSS rip for this slice) |

## 3. File plan (REAL paths)

| Action | Path | Notes |
|---|---|---|
| modify | `vision-graph-ui/src/features/app-shell/AppShell.tsx` | add error state region, compose rail+topbar+canvas |
| modify | `vision-graph-ui/src/features/app-shell/appShellTypes.ts` | add error state props, project loading state |
| modify | `vision-graph-ui/src/features/project-picker/ProjectPicker.tsx` | add vertical scroll when overflow, keep selected visible |
| create | `vision-graph-ui/src/features/app-shell/useProjectState.ts` | project selection, loading, error state hook |
| create | `vision-graph-ui/src/features/app-shell/useProjectState.test.ts` | maps .feature scenarios for project state |
| create | `vision-graph-ui/src/features/app-shell/AppShell.stories.tsx` | (replace existing) validation stories from spec |
| create | `vision-graph-ui/src/features/app-shell/AppShell.test.tsx` | (replace existing) maps .feature scenarios |
| modify | `vision-graph-ui/src/features/graph-page/GraphPage.tsx` | accept project id prop, handle single bubble on new project |
| create | `vision-graph-ui/src/features/app-shell/features/app-shell.feature` | Gherkin for APP-01..07, APPC-01..03 |
| create | `vision-graph-ui/src/features/app-shell/ErrorState.tsx` | persistent error region with retry (APPC-03) |
| create | `vision-graph-ui/src/features/app-shell/ErrorState.stories.tsx` | validation story for APPC-03 |
| create | `vision-graph-ui/src/features/app-shell/ErrorState.test.tsx` | maps APPC-03 scenario |

<Every task in §5 touches ONLY files listed here. New file = new row.>

## 4. Question-cycle gate (AGENTS.md §1 Stage 1 — MANDATORY before tests)

Ask user (2-3 questions max, `question` tool):

1. **Rail overflow behavior**: When project count exceeds rail height, should rail scroll (default per OpenCode/VS Code pattern) or should projects wrap to multiple columns?
   - A) Vertical scroll (standard fixed-rail pattern)
   - B) Horizontal scroll (unusual for vertical rail)
   - C) Wrap to multi-column (breaks fixed-width rail)

2. **Project title persistence**: Where should project title persist — as folder name only, or as YAML frontmatter `title` field in `.whitt/config.yml` per ADR-0011 mapping?
   - A) Folder name only (simplest, matches current NewProjectModal)
   - B) YAML frontmatter `title` in `.whitt/config.yml` (supports special chars, per ADR-0011)
   - C) Both (folder slug + human-readable title in YAML)

3. **Load failure retry behavior**: When project graph fails to load (corrupt/missing files), should retry attempt to reload from FS or prompt user to select different project?
   - A) Auto-retry once, then show error
   - B) Show error immediately with retry button (manual control)
   - C) Auto-retry 3x with backoff, then error

**Answers (2026-08-15, user):**
1. Rail overflow = **A) vertical scroll**.
2. Title persistence = **C) both** — folder slug + human-readable title in `.whitt/config.yml`.
3. Load failure = **A) auto-retry once, then show error**.

Record answers in this file, then never re-ask.

## 5. Tasks (incremental, TDD, each ends green+committed)

### Task 1.1 — App shell foundation (cases: APP-01, APP-02)
- **Gherkin first**: `vision-graph-ui/src/features/app-shell/features/app-shell.feature` (scenarios = APP-01, APP-02)
- **Red**: `AppShell.test.tsx` — scenarios fail (no fixed rail, no single bubble on mount)
- **Green**: modify `AppShell.tsx` to compose ProjectPicker (sidebar), TopBar (topbar), GraphPage (children), verify rail fixed left on pan/zoom
- **Rip (if any)**: none
- **Story**: `APP-01 opens new project`, `APP-02 rail fixed` in `AppShell.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run AppShell.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip `APP-01`, `APP-02` rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(app-shell): Shell foundation w/ fixed rail (APP-01, APP-02)`

### Task 1.2 — Project rail display (cases: APP-03, APP-04, APPC-02)
- **Gherkin first**: extend `app-shell.feature` (scenarios = APP-03, APP-04, APPC-02)
- **Red**: `ProjectPicker.test.tsx` — scenarios fail (no letter bubbles, no blank new bubble, empty rail state)
- **Green**: modify `ProjectPicker.tsx` to render letter bubbles from project titles, blank new bubble, empty rail shows only new button
- **Rip (if any)**: none
- **Story**: `APP-03 project letter bubbles`, `APP-04 new project blank`, `APPC-02 empty rail` in `ProjectPicker.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run ProjectPicker.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip `APP-03`, `APP-04`, `APPC-02` rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(project-picker): Letter bubbles + empty state (APP-03, APP-04, APPC-02)`

### Task 1.3 — Project title editing (cases: APP-05)
- **Gherkin first**: extend `app-shell.feature` (scenarios = APP-05)
- **Red**: `ProjectIcon.test.tsx` — scenario fails (no inline edit, no letter update on change)
- **Green**: modify `ProjectIcon.tsx` to add Google-Doc-style inline editable title, update letter on blur, wire to project state
- **Rip (if any)**: none
- **Story**: `APP-05 title inline edit` in `ProjectIcon.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run ProjectIcon.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip `APP-05` rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(project-icon): Inline title edit w/ letter update (APP-05)`

### Task 1.4 — Project load/switch (cases: APP-06, APP-07)
- **Gherkin first**: extend `app-shell.feature` (scenarios = APP-06, APP-07)
- **Red**: `useProjectState.test.ts` — scenarios fail (no load on click, no fresh session on new)
- **Green**: implement `useProjectState.ts` hook with loadGraph, resetToNew, error handling, wire to ProjectPicker onSelect, GraphPage
- **Rip (if any)**: none
- **Story**: `APP-06 select loads graph`, `APP-07 fresh session` in `AppShell.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run useProjectState.test.ts && npm run build-storybook` — all exit 0
- **Manifest**: flip `APP-06`, `APP-07` rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(app-shell): Project load/switch state (APP-06, APP-07)`

### Task 1.5 — Rail overflow scroll (cases: APPC-01)
- **Gherkin first**: extend `app-shell.feature` (scenarios = APPC-01)
- **Red**: `ProjectPicker.test.tsx` — scenario fails (no scroll on overflow, selected not jumped-to)
- **Green**: modify `ProjectPicker.tsx` to add `overflow-y: auto` to ProjectList, implement `scrollIntoView` on select for active project
- **Rip (if any)**: none
- **Story**: `APPC-01 rail scrolls` in `ProjectPicker.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run ProjectPicker.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip `APPC-01` rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(project-picker): Rail overflow scroll w/ auto-jump (APPC-01)`

### Task 1.6 — Load failure state (cases: APPC-03)
- **Gherkin first**: extend `app-shell.feature` (scenarios = APPC-03)
- **Red**: `ErrorState.test.tsx` — scenario fails (no error region, no retry action)
- **Green**: create `ErrorState.tsx` component with persistent error region near rail/canvas, plain-language cause, retry button, wire to useProjectState error handling
- **Rip (if any)**: none
- **Story**: `APPC-03 load failure` in `ErrorState.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run ErrorState.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip `APPC-03` rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(app-shell): Load failure error state (APPC-03)`

<4-8 tasks per slice. Task N depends only on N-1 and listed deps. No task spans >1 case-group.>

## 6. Skill + agent routing (per task)

| Task | Skills to load | Delegate to |
|---|---|---|
| 1.1 | `modern-react`, `storybook`, `react-flow` | `category="deep"` |
| 1.2 | `modern-react`, `storybook` | `category="deep"` |
| 1.3 | `modern-react`, `storybook` | `category="deep"` |
| 1.4 | `modern-react`, `storybook`, `test-driven-development` | `category="deep"` |
| 1.5 | `modern-react`, `storybook` | `category="deep"` |
| 1.6 | `modern-react`, `storybook` | `category="deep"` |

## 7. Live-system validation gate (slice DONE only when ALL pass)

1. Run validation stories: `npx vitest run --project=storybook -t "slice01"`
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

- Project folder creation (NewProjectModal already handles, not modified in this slice)
- Git integration/sync (tracked in slice 09)
- Graph canvas pan/zoom/fits (tracked in slice 11)
- Node creation/editing (tracked in slice 04)
- Context menus on rail items (deferred, not in slice requirements)
- Project rename beyond title edit (deferred, not in slice requirements)

---

## Template rules (enforced by check-plans.sh)

1. Sections 1-9 present, in order, headings exact.
2. Every case ID mentioned exists in `docs/feature-requirements/validation/coverage-manifest.tsv`.
3. Every `.repos/` path mentioned exists on disk (checked against CONTEXT/C0).
4. Every `vision-graph-ui/` create/modify path matches slice layout rules (AGENTS.md §3/§11).
5. Every story name matches validation spec story column.
6. Status line filled. No TBD / TODO / <fill in> placeholders in final plans.
7. Rip tasks only from C0 "Rip-able" table. READ-ONLY repos never appear in rip rows.
