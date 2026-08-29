# S07 — File Visualization & Editing Implementation Plan

> Executes: `docs/feature-requirements/slices/07-file-visualization.md` (cases: FIL-01..07, FILC-01..04)
> Validation spec: `docs/feature-requirements/validation/slice-07.validation.md`
> Status: DONE — Tasks 5.1-5.7 complete, FIL-03 deferred, FILX-02/03 out of scope
> Depends on: E3-fs-graph-sync

## 1. Objective

Deliver file preview/edit in node detail panel: markdown render, edit toggle, save-on-blur → E3 write queue, skeleton loading, save-failure recovery, concurrent-edit guard, close guard, highlight surfaces (ctrl-multi-highlight, ctrl+F) feeding S08 pills. Completes Flow E (watch execution) + Flow I (direct file edit).

## 2. Inputs (READ FIRST — in this order)

| Input | Path |
|---|---|
| Requirements slice | `docs/feature-requirements/slices/07-file-visualization.md` |
| Inherited case source | `docs/broader-vision/requirements/06-file-visualization-editing.md` (FIL-01..07) |
| Validation spec | `docs/feature-requirements/validation/slice-07.validation.md` |
| User-flow narrative | `docs/broader-vision/user-flows.md` (Flow E, Flow I) |
| Skills to load | `modern-react`, `storybook`, `test-driven-development`, `fs-graph-sync` |
| Code-rip sources | `none` |

## 3. File plan (REAL paths)

| Action | Path | Notes |
|---|---|---|
| create | `vision-graph-ui/src/features/file-visualization/FilePreview.tsx` | preview area, edit toggle, CodeMirror raw mode, save-on-blur hook |
| create | `vision-graph-ui/src/features/file-visualization/FilePreview.test.tsx` | maps FIL-01..07, FILC-01..04, FILX-01..03 scenarios |
| create | `vision-graph-ui/src/features/file-visualization/FilePreview.stories.tsx` | story names from validation spec (FIL-01..07, FILC-01..04, FILX-01..03) |
| create | `vision-graph-ui/src/features/file-visualization/useFileEdit.ts` | save-on-blur → E3 write queue, skeleton loading, save-failure, concurrent-edit guard |
| create | `vision-graph-ui/src/features/file-visualization/features/file-visualization.feature` | Gherkin scenarios |
| create | `vision-graph-ui/src/features/file-visualization/useHighlight.ts` | ctrl-multi-highlight, ctrl+F, selection persistence, S08 pill feed |
| create | `vision-graph-ui/src/features/file-visualization/useLineNumbers.ts` | line-number state (FILX), settings toggle read, line-range selection model |
| modify | `vision-graph-ui/src/features/node/NodeDetailPanel.tsx` | import FilePreview, pass file content, remove ReactMarkdown (move to FilePreview) |
| modify | `vision-graph-ui/src/features/settings-panel/*` | add line-numbers toggle (default on, persisted localStorage) |

## 4. Question-cycle gate (AGENTS.md §1 Stage 1 — MANDATORY before tests)

Ask user (2-3 questions max, `question` tool):

1. **Markdown renderer choice**: 
   - A) `react-markdown` (already in package.json, used in NodeDetailPanel.tsx)
   - B) `marked` + DOMPurify (lighter, manual sanitization)
   - C) `markdown-it` (plugin-rich)

2. **Raw edit textarea vs code editor lib**: 
   - A) Plain `<textarea>` now (per slice doc; CodeMirror deferred to FIL-03 non-md work)
   - B) CodeMirror 6 now (md syntax highlight in raw mode)
   - C) Shiki read-only highlight + textarea edit

## 5. Task breakdown (execute in order)

### Task 5.1 — Preview area basic render (cases: FIL-01, FIL-02)
- **Gherkin first**: `file-visualization.feature` (scenarios = FIL-01 area present, FIL-02 markdown preview)
- **Red**: `FilePreview.test.tsx` + scenarios fail (no component)
- **Green**: `FilePreview.tsx` skeleton: styled wrapper, `isLoading` prop → skeleton loader, react-markdown with `components` mapping → `h2`, `p`, `ul`, `ol`, `li` (keep existing NodeDetailPanel styles), no edit button yet
- **Rip (if any)**: `NodeDetailPanel.tsx` styling → migrate to `FilePreview.tsx` styled components
- **Story**: `FIL-01 area present`, `FIL-02 markdown preview` in `FilePreview.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run FilePreview.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip FIL-01, FIL-02 rows → `pass`
- **Commit**: `feat(file-visualization): Preview area w/ markdown render (FIL-01, FIL-02)`

### Task 5.2 — Edit toggle + raw textarea (cases: FIL-04, FIL-05)
- **Gherkin first**: `file-visualization.feature` (scenarios = FIL-04 edit toggle, FIL-05 blur saves)
- **Red**: `FilePreview.test.tsx` + scenarios fail (no edit toggle, no save-on-blur)
- **Green**: `useFileEdit.ts` hook (toggle state, saveOnBlur callback, writeQueue enqueue), FilePreview edit button → toggleEdit, CodeMirror raw mode (defer lineNumbers to 5.7), blur event → `saveOnBlur`
- **Rip (if any)**: none
- **Story**: `FIL-04 edit toggle`, `FIL-05 blur saves` in `FilePreview.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run FilePreview.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip FIL-04, FIL-05 rows → `pass`
- **Commit**: `feat(file-visualization): Edit toggle + save-on-blur (FIL-04, FIL-05)`

### Task 5.3 — Skeleton + save-failure recovery (cases: FILC-01, FILC-02)
- **Gherkin first**: `file-visualization.feature` (scenarios = FILC-01 skeleton, FILC-02 save failure)
- **Red**: `FilePreview.test.tsx` + scenarios fail (no skeleton, no error UI, no retry)
- **Green**: `useFileEdit.ts` add saveError state + retrySave function, FilePreview error UI (inline error + retry button), skeleton loader with `useEffect` + 200ms delay → 5s cap
- **Rip (if any)**: none
- **Story**: `FILC-01 skeleton`, `FILC-02 save failure` in `FilePreview.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run FilePreview.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip FILC-01, FILC-02 rows → `pass`
- **Commit**: `feat(file-visualization): Skeleton + save-failure recovery (FILC-01, FILC-02)`

### Task 5.4 — Concurrent-edit + close guards (cases: FILC-03, FILC-04)
- **Gherkin first**: `file-visualization.feature` (scenarios = FILC-03 concurrent guard, FILC-04 close guard)
- **Red**: `FilePreview.test.tsx` + scenarios fail (no conflict detection, no close blocking)
- **Green**: `useFileEdit.ts` add conflict state + handleDiskChange + keepMine, FilePreview conflict UI (notice + keep-mine/use-disk buttons), saveError blocking check → prevent close on error
- **Rip (if any)**: none
- **Story**: `FILC-03 concurrent guard`, `FILC-04 close guard` in `FilePreview.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run FilePreview.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip FILC-03, FILC-04 rows → `pass`
- **Commit**: `feat(file-visualization): Concurrent-edit + close guards (FILC-03, FILC-04)`

### Task 5.5 — Highlight surfaces (cases: FIL-06, FIL-07)
- **Gherkin first**: `file-visualization.feature` (scenarios = FIL-06, FIL-07)
- **Red**: `FilePreview.test.tsx` + scenarios fail
- **Green**: `useHighlight.ts` ctrl-multi-select (persistent `data-highlighted`), ctrl+F search highlight, selection state export for S08 pill feed
- **Rip (if any)**: none
- **Story**: `FIL-06 multi-highlight`, `FIL-07 ctrl+F` in `FilePreview.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run FilePreview.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip FIL-06, FIL-07 rows → `pass`
- **Commit**: `feat(file-visualization): Highlight surfaces (FIL-06, FIL-07)`

### Task 5.6 — Integrate into NodeDetailPanel (cases: integration)
- **Gherkin first**: `file-visualization.feature` (integration scenarios = FilePreview wired into NodeDetailPanel)
- **Red**: `FilePreview.test.tsx` + scenarios fail
- **Green**: modify `NodeDetailPanel.tsx`, import FilePreview, pass file content, remove inline ReactMarkdown
- **Rip (if any)**: none
- **Story**: integration story in `FilePreview.stories.tsx` (NodeDetailPanel containing FilePreview)
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run FilePreview.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: integration scenario → `pass`
- **Commit**: `feat(file-visualization): Integrate FilePreview into NodeDetailPanel`

### Task 5.7 — FIL-03 placeholder (deferred, non-markdown types)
- **Gherkin first**: add placeholder scenario to `file-visualization.feature` (FIL-03)
- **Red**: `FilePreview.test.tsx` + scenario fails (expected: not implemented)
- **Green**: placeholder task only — no implementation, marked deferred
- **Rip (if any)**: none
- **Story**: `FIL-03 non-markdown` placeholder in `FilePreview.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run FilePreview.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip FIL-03 row → `deferred` w/ reason "syntax highlighting per type deferred"
- **Commit**: `feat(file-visualization): Add FIL-03 placeholder (deferred)`

### Task 5.8 — IDE line numbers + plain-text mode + settings toggle (cases: FILX-01..03) [NEW — user 2026-08-16]
- **Gherkin first**: extend `file-visualization.feature` (scenarios = FILX-01 line numbers both modes, FILX-02 settings toggle default-on, FILX-03 plain-text button)
- **Red**: `FilePreview.test.tsx` + scenarios fail
- **Green**: `useLineNumbers.ts` hook (toggle state, localStorage persistence, line-range selection model); FilePreview renders line-number gutter in preview mode (per-line `data-line` anchors, react-markdown source-position mapping) AND raw mode (CodeMirror `lineNumbers()` extension, removable via `EditorView.lineNumbers` reconfigure); plain-text button toggles markdown render off (CodeMirror stays, no preview transform); settings-panel toggle row wired to hook
- **Deps to install** (inside vision-graph-ui ONLY): `@uiw/react-codemirror @codemirror/lang-markdown @codemirror/view` (MIT)
- **Rip (if any)**: none
- **Story**: `FILX-01 line numbers both modes`, `FILX-02 settings toggle default on`, `FILX-03 plain text mode` in `FilePreview.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run FilePreview.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip FILX-01..03 rows → `pass`
- **Commit**: `feat(file-visualization): IDE line numbers + plain-text mode (FILX-01..03)`

NOTE task 5.1/5.2 adjust: raw mode = CodeMirror (dark+ theme) NOT textarea; line numbers integrated from 5.1 onward if simpler (single pass acceptable — keep story coverage per-case regardless).

## 6. Skill + agent routing (per task)

| Task | Skills to load | Delegate to |
|---|---|---|
| 5.1 | `modern-react`, `storybook`, `test-driven-development`, `fs-graph-sync` | `category="deep"` |
| 5.2 | `modern-react`, `storybook`, `test-driven-development`, `fs-graph-sync` | `category="deep"` |
| 5.3 | `modern-react`, `storybook`, `test-driven-development` | `category="deep"` |
| 5.4 | `modern-react`, `storybook`, `test-driven-development`, `fs-graph-sync` | `category="deep"` |
| 5.5 | `modern-react`, `storybook`, `test-driven-development` | `category="deep"` |
| 5.6 | `modern-react`, `storybook`, `test-driven-development` | `category="deep"` |
| 5.7 | `test-driven-development` | do-not-delegate (placeholder only) |

## 7. Out of scope / guards

- **FIL-03 (non-markdown types)**: syntax highlighting per type, specialized editing features — deferred, placeholder task only
- **S08 pill UI**: selection surfaces feed pills (S08 owns pill rendering), this slice only exports selection state
- **S09 commit mechanics**: save-on-blur fires E3 write + GIT-01 commit (S09 owns commit flow), this slice only triggers save
- **Full diff UI for concurrent-edit**: minimal version only (notice + choice), no merge tool
- **Markdown-highlight-menu slice**: does not exist — this slice implements selection from scratch (may factor out later if S08 needs shared infra)
- **New deps without question-gate**: CodeMirror 6/Shiki install only after question-gate approval

## 8. Completion gate (MANDATORY before claiming done)

Run ALL commands in this order, exit 0:

```bash
cd vision-graph-ui
npx tsc --noEmit          # type check
npx vitest run            # tests (no file filter)
npm run build-storybook   # Storybook build
```

AND verify docs:
- `docs/feature-requirements/validation/coverage-manifest.tsv` has all 07 cases as `pass` (except FIL-03 as `deferred`)
- NO failed tests in this slice's test files

AND git commit:
- Final summary commit: `docs(plans): S07 DONE; all tasks 5.1-5.8 complete; manifest AGT/AGTC/FIL-XX pass, FIL-03 deferred`

→ NEVER claim done w/o running ALL 3 cmds + docs check + summary commit.

---

## Template rules (enforced by check-plans.sh)

1. Sections 1-8 present, in order, headings exact.
2. Every case ID mentioned exists in `docs/feature-requirements/validation/coverage-manifest.tsv`.
3. Every `.repos/` path mentioned exists on disk (checked against CONTEXT/C0).
4. Every `vision-graph-ui/` create/modify path matches slice layout rules (AGENTS.md §3/§11).
5. Every question-gate section has 2-3 questions only, never more; skip if `AGENTS.md` says so.
6. Every commit message follows conventional commits; subject ≤50 chars.
7. Every task has a `Verify` block with 3 commands (typecheck, tests, storybook build).
8. No test `skip()` w/o user confirmation; use `test.skip()` ONLY if `AGENTS.md` allows.
9. Every task flips manifest rows to `pass` AFTER verification commands exit 0.
10. Summary commit comes AFTER all tasks done, BEFORE claiming done to user.
11. No task description or spec text copied from requirements — write own words.

→ Failure in any rule = invalid plan. Use check-plans.sh to validate.