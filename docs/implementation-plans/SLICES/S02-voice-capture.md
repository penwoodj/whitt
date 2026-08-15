# S02 — Voice Capture & STT Pipeline Implementation Plan

> Executes: `docs/feature-requirements/slices/02-voice-capture.md` (cases: VOX-01,04..17, VOXC-01..05)
> Validation spec: `docs/feature-requirements/validation/slice-02.validation.md`
> Status: NOT-STARTED
> Depends on: E1-stt-engine, E4-react-flow-upgrade

## 1. Objective

Deliver mic → analyser → STT → tooltip → send → prompt file flow. Consumes E1's STT engine API (interim/final transcript + AudioContext split-feed). Owns UI semantics (tooltip pin, edit, send) while E3 owns persistence mechanics (.prompts/ write queue).

## 2. Inputs (READ FIRST — in this order)

| Input | Path |
|---|---|
| Requirements slice | `docs/feature-requirements/slices/02-voice-capture.md` |
| Inherited case source | `docs/broader-vision/requirements/02-voice-input-tooltip.md` |
| Validation spec | `docs/feature-requirements/validation/slice-02.validation.md` |
| User-flow narrative | `docs/broader-vision/user-flows.md` (Flow B, C) |
| Skills to load | modern-react, storybook, local-stt, test-driven-development |
| Code-rip sources | `.repos/omi/web/app/src/lib/audioCapture.ts`, `.repos/unsloth/studio/frontend/src/features/chat/adapters/dictation-level.ts` |

## 3. File plan (REAL paths)

| Action | Path | Notes |
|---|---|---|
| create | `vision-graph-ui/src/features/voice-capture/voiceCapture.feature` | Gherkin scenarios for VOX cases |
| create | `vision-graph-ui/src/features/voice-capture/VoiceNode.stories.tsx` | Stories from validation spec (VoiceNode fixture) |
| create | `vision-graph-ui/src/features/voice-capture/VoiceNode.test.tsx` | Tests map to .feature scenarios |
| create | `vision-graph-ui/src/features/voice-capture/useVoiceInput.ts` | Hook wrapping E1 STT engine + AudioContext level feed |
| create | `vision-graph-ui/src/features/voice-capture/VoiceTooltip.tsx` | Pinnable tooltip (hover shows, click pins) |
| create | `vision-graph-ui/src/features/voice-capture/VoicePromptInput.tsx` | Editable textarea (cursor-aware append) |
| create | `vision-graph-ui/src/adapted/analyserLevelMeter.ts` | Rip from omi audioCapture.ts (analyser wiring) |
| create | `vision-graph-ui/src/adapted/rafLevelLoop.ts` | Rip from unsloth dictation-level.ts (RAF tick loop) |
| modify | `vision-graph-ui/src/features/node/Node.tsx` | Wire mic btn click → useVoiceInput start/stop |
| modify | `vision-graph-ui/src/features/node/NodeMicBtn.tsx` | Add recording state + dblClick handlers |
| modify | `vision-graph-ui/src/features/node/NodePromptArea.tsx` | Render VoiceTooltip when recording active |

Every task in §5 touches ONLY files listed here. New file = new row.

## 4. Question-cycle gate (AGENTS.md §1 Stage 1 — MANDATORY before tests)

Ask user (2-3 questions max):

1. **Tooltip side-choice algorithm (C1 O1, VOX-05)**: How does tooltip pick right vs left of node?
   - A) Bounding-box overlap check vs nearest neighbors (precise, O(n) per open)
   - B) Viewport quadrant preference (cheap: node left-of-center → tooltip right)
   - C) Hybrid — quadrant default, overlap check when neighbors within 1 node-width

2. **Prompt file naming (VOX-16)**: Format inside `<node-dir>/.prompts/`?
   - A) `<ts>-<slug>.md` w/ YAML frontmatter (sent-state, ts) — matches fs-graph-sync skill default
   - B) `prompt-<n>.md` sequential counter
   - C) `<iso-ts>.md` raw timestamp only

3. **Empty send guard (VOXC-04)**: Enter/double-click on empty prompt does what?
   - A) Shake/flash feedback only
   - B) Flash + auto-start mic
   - C) No-op silent

Debounce window: 2s per ADR-0011 — settled default, no question needed.

Record answers in this file, then never re-ask.

## 5. Tasks (incremental, TDD, each ends green+committed)

### Task 5.1 — Mic permission flow (cases: VOXC-01)

- **Gherkin first**: `vision-graph-ui/src/features/voice-capture/voiceCapture.feature` (scenario: VOXC-01 mic permission flow)
- **Red**: `VoiceNode.test.tsx` → mock getUserMedia deny → expect denied state + recovery text
- **Green**: `useVoiceInput.ts` wraps E1's `getUserMedia`, handles PermissionDenied → state, no crash
- **Rip (if any)**: none (uses E1's permission handling)
- **Story**: `VOXC-01 mic permission flow` in `VoiceNode.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run VoiceNode.test.tsx && npm run build-storybook`
- **Manifest**: flip VOXC-01 row → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(voice-capture): mic permission flow (VOXC-01)`

### Task 5.2 — Recording toggle + interim/final styling (cases: VOX-01, VOXC-02)

- **Gherkin first**: `voiceCapture.feature` (scenarios: VOX-01 click starts recording, VOXC-02 interim styling)
- **Red**: `VoiceNode.test.tsx` → click bubble → STT started, interim spans `data-interim` attr, finalizes to normal
- **Green**: `NodeMicBtn.tsx` adds `isRec` state + onClick toggle, `VoicePromptInput.tsx` renders interim dimmed/italic, final normal
- **Rip (if any)**: none (consumes E1's interim/final API)
- **Story**: `VOX-01 click starts recording`, `VOXC-02 interim styling` in `VoiceNode.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run VoiceNode.test.tsx && npm run build-storybook`
- **Manifest**: flip VOX-01, VOXC-02 rows → `ready`→`pass`
- **Commit**: `feat(voice-capture): recording toggle + interim styling (VOX-01, VOXC-02)`

### Task 5.3 — Hover tooltip + side adaptation (cases: VOX-04, VOX-05)

- **Gherkin first**: `voiceCapture.feature` (scenarios: VOX-04 hover tooltip live text, VOX-05 tooltip side adaptive)
- **Red**: `VoiceNode.test.tsx` → hover bubble → tooltip visible, streamed words appear; neighbor right → tooltip opens LEFT
- **Green**: `VoiceTooltip.tsx` positioned relative to node with collision detection, renders live transcript
- **Rip (if any)**: none (tooltip positioning logic new)
- **Story**: `VOX-04 hover tooltip live text`, `VOX-05 tooltip side adaptive` in `VoiceNode.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run VoiceNode.test.tsx && npm run build-storybook`
- **Manifest**: flip VOX-04, VOX-05 rows → `ready`→`pass`
- **Commit**: `feat(voice-capture): hover tooltip + side adaptation (VOX-04, VOX-05)`

### Task 5.4 — Pin tooltip + cursor-aware append (cases: VOX-06, VOX-07, VOX-08)

- **Gherkin first**: `voiceCapture.feature` (scenarios: VOX-06 click pins tooltip, VOX-07 append at cursor, VOX-08 edit over highlight)
- **Red**: `VoiceNode.test.tsx` → click into tooltip → persists unhovered; click mid-text → STT appends at cursor; highlight + type/voice → replaced
- **Green**: `VoicePromptInput.tsx` manages `cursorPos`, `useVoiceInput` appends finals at cursor; textarea handles keyboard + voice overwrite
- **Rip (if any)**: none (cursor management new)
- **Story**: `VOX-06 click pins tooltip`, `VOX-07 append at cursor`, `VOX-08 edit over highlight` in `VoiceNode.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run VoiceNode.test.tsx && npm run build-storybook`
- **Manifest**: flip VOX-06, VOX-07, VOX-08 rows → `ready`→`pass`
- **Commit**: `feat(voice-capture): pin tooltip + cursor-aware append (VOX-06, VOX-07, VOX-08)`

### Task 5.5 — Send mechanics + empty guard (cases: VOX-09, VOX-10, VOX-14, VOX-15, VOXC-05)

- **Gherkin first**: `voiceCapture.feature` (scenarios: VOX-09 enter sends, VOX-10 shift-enter newline, VOX-14 dblclick sends, VOX-15 dbl-right-click sends, VOXC-05 empty send noop)
- **Red**: `VoiceNode.test.tsx` → Enter → send spy called; Shift+Enter → newline; dblClick → send; dblRightClick → send; empty → shake class, no send
- **Green**: `VoicePromptInput.tsx` onKeyDown handles Enter/Shift+Enter; `NodeMicBtn.tsx` onDoubleClick triggers send; empty check prevents dispatch, adds shake class
- **Rip (if any)**: none (send handlers new)
- **Story**: `VOX-09 enter sends`, `VOX-10 shift-enter newline`, `VOX-14 dblclick sends`, `VOX-15 dbl-right-click sends`, `VOXC-05 empty send noop` in `VoiceNode.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run VoiceNode.test.tsx && npm run build-storybook`
- **Manifest**: flip VOX-09, VOX-10, VOX-14, VOX-15, VOXC-05 rows → `ready`→`pass`
- **Commit**: `feat(voice-capture): send mechanics + empty guard (VOX-09, VOX-10, VOX-14, VOX-15, VOXC-05)`

### Task 5.6 — Stop/resume recording (cases: VOX-11, VOX-12, VOX-13, VOX-17)

- **Gherkin first**: `voiceCapture.feature` (scenarios: VOX-11 click-out keeps recording, VOX-12 click stops, VOX-13 click resumes appends, VOX-17 pinned survives unhover)
- **Red**: `VoiceNode.test.tsx` → click canvas → tooltip hidden, STT still streaming; click bubble → stopped; click again → resumed, appended at end; pin → unhover → persists
- **Green**: `VoiceTooltip.tsx` onClickOutside hides but doesn't stop; `useVoiceInput` toggle start/stop; resume appends at input end
- **Rip (if any)**: none (state management new)
- **Story**: `VOX-11 click-out keeps recording`, `VOX-12 click stops`, `VOX-13 click resumes appends`, `VOX-17 pinned survives unhover` in `VoiceNode.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run VoiceNode.test.tsx && npm run build-storybook`
- **Manifest**: flip VOX-11, VOX-12, VOX-13, VOX-17 rows → `ready`→`pass`
- **Commit**: `feat(voice-capture): stop/resume recording (VOX-11, VOX-12, VOX-13, VOX-17)`

### Task 5.7 — Analyser level feed (cases: none — infrastructure for slice 03)

- **Gherkin first**: `voiceCapture.feature` (scenario: analyser level feeds bubble breathing)
- **Red**: `VoiceNode.test.tsx` → mock AudioContext → analyser.getByteFrequencyData called, level emitted
- **Green**: `useVoiceInput.ts` splits AudioContext source → AnalyserNode (fftSize 256) + STT worklet; `analyserLevelMeter.ts` (rip from omi) calculates RMS
- **Rip (if any)**: `.repos/omi/web/app/src/lib/audioCapture.ts` → `src/adapted/analyserLevelMeter.ts` via `oss-code-adaptation` (MIT license)
- **Story**: `analyser level feed` in `VoiceNode.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run VoiceNode.test.tsx && npm run build-storybook`
- **Manifest**: no coverage rows (infrastructure only)
- **Commit**: `feat(voice-capture): analyser level feed (infrastructure for slice 03)`

### Task 5.8 — STT error handling + single recorder (cases: VOXC-03, VOXC-04)

- **Gherkin first**: `voiceCapture.feature` (scenarios: VOXC-03 stt error preserves text, VOXC-04 single recorder)
- **Red**: `VoiceNode.test.tsx` → mock STT error → status near input, text intact; rec on A, click B → A stopped, B sole recorder
- **Green**: `useVoiceInput.ts` handles engine error, preserves finals in prompt file; global singleton ensures one active recorder
- **Rip (if any)**: none (error handling + singleton new)
- **Story**: `VOXC-03 stt error preserves text`, `VOXC-04 single recorder` in `VoiceNode.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run VoiceNode.test.tsx && npm run build-storybook`
- **Manifest**: flip VOXC-03, VOXC-04 rows → `ready`→`pass`
- **Commit**: `feat(voice-capture): STT error handling + single recorder (VOXC-03, VOXC-04)`

### Task 5.9 — Prompt file persistence (cases: VOX-16)

- **Gherkin first**: `voiceCapture.feature` (scenario: VOX-16 debounced prompt file)
- **Red**: `VoiceNode.test.tsx` → type → wait debounce → writer spy called once with text, path under hidden folder
- **Green**: `useVoiceInput.ts` debounces writes (2s), calls E3's `fsGraphSync.writePrompt` (stubbed in this slice, real in E3)
- **Rip (if any)**: none (debounce logic new, E3 owns actual FS write)
- **Story**: `VOX-16 debounced prompt file` in `VoiceNode.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run VoiceNode.test.tsx && npm run build-storybook`
- **Manifest**: flip VOX-16 row → `ready`→`pass`
- **Commit**: `feat(voice-capture): prompt file persistence (VOX-16)`

4-8 tasks per slice. Task N depends only on N-1 and listed deps. No task spans >1 case-group.

## 6. Skill + agent routing (per task)

| Task | Skills to load | Delegate to |
|---|---|---|
| 5.1 | modern-react, local-stt, test-driven-development | category="deep" |
| 5.2 | modern-react, local-stt, test-driven-development | category="deep" |
| 5.3 | modern-react, storybook | category="visual-engineering" |
| 5.4 | modern-react, storybook, test-driven-development | category="deep" |
| 5.5 | modern-react, storybook, test-driven-development | category="deep" |
| 5.6 | modern-react, storybook, test-driven-development | category="deep" |
| 5.7 | modern-react, oss-code-adaptation | category="deep" |
| 5.8 | modern-react, test-driven-development | category="deep" |
| 5.9 | modern-react, test-driven-development | category="deep" |

## 7. Live-system validation gate (slice DONE only when ALL pass)

1. Run validation stories: `npx vitest run --project=storybook -t "slice02"`
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

- Breathing visuals (VOX-02/03) → slice 03 (light-language visual system)
- Actual FS write mechanics (`.prompts/` folder creation) → E3 (fs-graph-sync)
- STT engine implementation → E1 (stt-engine)
- Prompt file naming convention details → open question #1 (resolve in question-cycle gate)
- Debounce duration → open question #2 (resolve in question-cycle gate)
- Empty send alternative path (trigger mic start) → open question #3 (resolve in question-cycle gate)
- Global singleton recorder may need refactor if user confirms multi-recording desire in future
- Voice-to-text accuracy tuning → E1 responsibility
- Prompt-file history UI → future slice (not in scope)

---

## Template rules (enforced by check-plans.sh)

1. Sections 1-9 present, in order, headings exact.
2. Every case ID mentioned exists in `docs/feature-requirements/validation/coverage-manifest.tsv`.
3. Every `.repos/` path mentioned exists on disk (checked against CONTEXT/C0).
4. Every `vision-graph-ui/` create/modify path matches slice layout rules (AGENTS.md §3/§11).
5. Every story name matches validation spec story column.
6. Status line filled. No TBD / TODO / <fill in> placeholders in final plans.
7. Rip tasks only from C0 "Rip-able" table. READ-ONLY repos never appear in rip rows.
