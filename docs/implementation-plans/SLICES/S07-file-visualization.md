# S07 — File Visualization & Editing Implementation Plan

> Executes: `docs/feature-requirements/slices/07-file-visualization.md` (cases: FIL-01..07, FILC-01..04)
> Validation spec: `docs/feature-requirements/validation/slice-07.validation.md`
> Status: NOT-STARTED
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

3. **Highlight persistence scope**: 
   - A) Session-only (selections clear on modal close — slice doc proposal)
   - B) localStorage (survive reload)
   - C) FS annotations in frontmatter (deferred, ties to PIL)

ANSWERED 2026-08-16 (verbatim user requirements):
- Q1 renderer = react-markdown (ecosystem pattern: human-file-cartographer + charkoal-ai both use react-markdown ^10.1.0; glyphnova bundle contained NO markdown lib — Rust/Tauri research only, UI never built). HARD RULE (user verbatim): "entire app dark themed like most of the examples... similar theme to ragflow or dark+ vscode theme. all text colors must be readable according to accessibility standards... no white backgrounds anywhere. feel like a void of bubbles of light and rounded corner squares of light." → ALL preview/editor surfaces darkTheme tokens or VS Code dark+ palette; WCAG-readable text; zero white backgrounds.
- Q2 editor = IDE-style: CodeMirror 6 via `@uiw/react-codemirror` + `@codemirror/lang-markdown` + `@codemirror/view` lineNumbers extension — line numbers on left "like any normal ide editor" in BOTH preview and raw-edit modes, toggleable OFF in settings but ON by default. Plain-text button toggles to text area (CodeMirror markdown-mode w/o render). Purpose (user): "speak to line numbers or groups of line numbers to the agent so it knows what you're talking about" → line anchors feed S08 pills.
- Q3 highlights = session-only: clear on reload AND on node collapse (user verbatim: "they clear when you reload, or collapse a node").

NEW CASES (added to slice doc + validation + manifest as FILX-01..03): FILX-01 line numbers visible both modes (data-line attr per line, anchorable); FILX-02 settings toggle default-on (persisted); FILX-03 plain-text button toggles render off (still line-numbered).

## 5. Tasks (incremental, TDD, each ends green+committed)

### Task 5.1 — Preview area basic render (cases: FIL-01, FIL-02)
- **Gherkin first**: `vision-graph-ui/src/features/file-visualization/features/file-visualization.feature` (scenarios = FIL-01, FIL-02)
- **Red**: `FilePreview.test.tsx` + scenarios fail
- **Green**: `FilePreview.tsx` render react-markdown preview, `useFileEdit.ts` load content, skeleton loading state
- **Rip (if any)**: none
- **Story**: `FIL-01 area present`, `FIL-02 markdown preview` in `FilePreview.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run FilePreview.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip FIL-01, FIL-02 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(file-visualization): Preview area w/ markdown render (FIL-01, FIL-02)`

### Task 5.2 — Edit toggle + raw textarea (cases: FIL-04, FIL-05)
- **Gherkin first**: extend `file-visualization.feature` (scenarios = FIL-04, FIL-05)
- **Red**: `FilePreview.test.tsx` + scenarios fail
- **Green**: `FilePreview.tsx` edit icon button, raw textarea mode, `useFileEdit.ts` save-on-blur hook → E3 write queue
- **Rip (if any)**: none
- **Story**: `FIL-04 edit toggle`, `FIL-05 blur saves` in `FilePreview.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run FilePreview.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip FIL-04, FIL-05 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(file-visualization): Edit toggle + save-on-blur (FIL-04, FIL-05)`

### Task 5.3 — Skeleton + save-failure recovery (cases: FILC-01, FILC-02)
- **Gherkin first**: extend `file-visualization.feature` (scenarios = FILC-01, FILC-02)
- **Red**: `FilePreview.test.tsx` + scenarios fail
- **Green**: `useFileEdit.ts` skeleton loading (200ms delay, 5s cap, layout-matched blocks), inline error region on save failure, in-memory text preservation
- **Rip (if any)**: none
- **Story**: `FILC-01 skeleton`, `FILC-02 save failure` in `FilePreview.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run FilePreview.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip FILC-01, FILC-02 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(file-visualization): Skeleton + save-failure recovery (FILC-01, FILC-02)`

### Task 5.4 — Concurrent-edit + close guards (cases: FILC-03, FILC-04)
- **Gherkin first**: extend `file-visualization.feature` (scenarios = FILC-03, FILC-04)
- **Red**: `FilePreview.test.tsx` + scenarios fail
- **Green**: `useFileEdit.ts` disk-change event listener, conflict notice (agent vs user version), keep-mine choice, close guard (save fires first, block on error)
- **Rip (if any)**: none
- **Story**: `FILC-03 concurrent guard`, `FILC-04 close guard` in `FilePreview.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run FilePreview.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip FILC-03, FILC-04 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(file-visualization): Concurrent-edit + close guards (FILC-03, FILC-04)`

### Task 5.5 — Highlight surfaces (cases: FIL-06, FIL-07)
- **Gherkin first**: extend `file-visualization.feature` (scenarios = FIL-06, FIL-07)
- **Red**: `FilePreview.test.tsx` + scenarios fail
- **Green**: `useHighlight.ts` ctrl-multi-select (persistent `data-highlighted`), ctrl+F search highlight, selection state export for S08 pill feed
- **Rip (if any)**: none
- **Story**: `FIL-06 multi-highlight`, `FIL-07 ctrl+F` in `FilePreview.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run FilePreview.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip FIL-06, FIL-07 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(file-visualization): Highlight surfaces (FIL-06, FIL-07)`

### Task 5.6 — Integrate into NodeDetailPanel (cases: integration)
- **Gherkin first**: extend `file-visualization.feature` (integration scenarios = FilePreview wired into NodeDetailPanel)
- **Red**: `FilePreview.test.tsx` + scenarios fail
- **Green**: modify `NodeDetailPanel.tsx`, import FilePreview, pass file content, remove inline ReactMarkdown
- **Rip (if any)**: none
- **Story**: integration story in `FilePreview.stories.tsx` (NodeDetailPanel containing FilePreview)
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run FilePreview.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: integration scenario → `pass` in coverage-manifest.tsv
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

## 7. Live-system validation gate (slice DONE only when ALL pass)

1. Run validation stories: `npx vitest run --project=storybook -t "slice07"`
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

- **FIL-03 (non-markdown types)**: syntax highlighting per type, specialized editing features — deferred, placeholder task only
- **S08 pill UI**: selection surfaces feed pills (S08 owns pill rendering), this slice only exports selection state
- **S09 commit mechanics**: save-on-blur fires E3 write + GIT-01 commit (S09 owns commit flow), this slice only triggers save
- **Full diff UI for concurrent-edit**: minimal version only (notice + choice), no merge tool
- **Markdown-highlight-menu slice**: does not exist — this slice implements selection from scratch (may factor out later if S08 needs shared infra)
- **New deps without question-gate**: CodeMirror 6/Shiki install only after question-gate approval

---

## Template rules (enforced by check-plans.sh)

1. Sections 1-9 present, in order, headings exact.
2. Every case ID mentioned exists in `docs/feature-requirements/validation/coverage-manifest.tsv`.
3. Every `.repos/` path mentioned exists on disk (checked against CONTEXT/C0).
4. Every `vision-graph-ui/` create/modify path matches slice layout rules (AGENTS.md §3/§11).
5. Every story name matches validation spec story column.
6. Status line filled. No TBD / TODO / <fill in> placeholders in final plans.
7. Rip tasks only from C0 "Rip-able" table. READ-ONLY repos never appear in rip rows.
