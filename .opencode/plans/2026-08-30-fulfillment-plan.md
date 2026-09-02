# Integrated Graph UI Fulfillment Plan

> Status: revised 2026-08-31; implementation not started.
> Authority: user review rounds, `docs/broader-vision/`, `vision-graph-ui/AGENTS.md`; later requirement overrides older conflicting app rules.
> Exit: test-backed composed Vite app + desktop-only evidence proves every in-scope behavior; user then marks screenshots worth manual review.

## Goal

Turn isolated Storybook slices into one real Vite graph workspace: gorse-lit voice nodes, Bezier edges, selected-only DAG formatting, interactive right-side voice composer, execution/files/context, and desktop evidence worth reviewer effort.

## Research verdict

Current plan could not prove readiness. `App.tsx` mounts `GraphSim`; `GraphSim` mounts `Node`, but current app does **not** compose CanvasOps, ExecutionPanel, voice-capture runtime, or context pills. `NodeTooltip` is metadata-only; prompt controls remain wrongly inside node body. Existing Storybook pass rows prove isolated fixtures, not Vite behavior.

### Sources used

- User flow contract: `docs/broader-vision/user-flows.md` B–H; voice GWT: `docs/broader-vision/requirements/02-voice-input-tooltip.md`; execution GWT: `docs/broader-vision/requirements/04-agentic-execution-area.md`.
- Local UX reference: `~/code/easy-local-whisper-hotkey/tauri-app/src/components/StreamingTextDisplay.tsx`: decorative ping-dot, `Listening...`, bordered transcript, hotkey hint. Inspiration only; no implied runtime dependency.
- React Flow: [selection](https://reactflow.dev/api-reference/hooks/use-on-selection-change), [Bezier default edge](https://reactflow.dev/api-reference/react-flow#edge-types), [layout comparison](https://reactflow.dev/learn/layouting/layouting), [Dagre update pattern](https://github.com/xyflow/xyflow/blob/2903b14fa8cdcc4695aed20b38dcb20fe5d70540/examples/react/src/examples/Layouting/index.tsx#L44-L73).
- Voice/accessibility: [MDN SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition), [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder), [W3C interactive-tooltip rule](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/), [ARIA status](https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA22), [reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).
- Local engine: [`browser-whisper@1.1.0`](https://github.com/tanpreetjolly/browser-whisper/tree/03cbfb70148f7a48335d7ba93ae494fe933191e0); requires COOP/COEP, supports `transcribePCM`, WebGPU→WASM fallback, OPFS model cache, cancellable stream/dispose. WASM assets can load remotely: offline capability is conditional until self-host/cached-asset smoke test proves it.

## Locked decisions

1. **App path wins.** Every fulfillment feature mounts in Vite `GraphSim` path. Storybook validates isolated states only; never readiness claim.
2. **DAG control.** Two visual segments: left segment is only command; right segment is noninteractive current-layout state/readout. No invented right-click/apply semantics. Left cycles only when selection exists: `RIGHT → DOWN → LEFT → RIGHT`; no selection causes zero state/position/edge mutation.
3. **DAG safety.** Dagre receives selected nodes + induced internal edges; merge positions only by selected IDs; preserve selected bounding-box origin, unselected position/object identity, selection, and edge data.
4. **Composer semantics.** Right-of-node pointer surface is `role="dialog"`, never interactive `role="tooltip"`. Preview is a semantic button/span-state; click renders a labelled textarea and pins surface. Node body has title/status/light, not prompt controls.
5. **Voice state.** `idle | permission-pending | listening | processing | denied | error | stopped`; `chatActive`, `manualFocus`, `pinned` are independent from speech. Outside click hides unpinned dialog but does not stop active recording. Second recorder stops first.
6. **STT boundary.** Local-only adapter interface: pinned `browser-whisper@1.1.0` production adapter first, local Whisper endpoint adapter only when explicitly configured, fake adapter for tests/review. Cloud Web Speech API is excluded. Vite dev/preview COOP+COEP headers are mandatory; first model preload is explicit; offline claim remains conditional until model + WASM asset cache smoke test passes. Interim text stays ghost text; final text commits at cursor. One AudioContext splits analyser breathing from STT capture; cleanup stops tracks, closes context, terminates workers, cancels animation frame.
7. **Light/motion.** Theme-owned `colors.gorse` + `glow.gorse`; subtle idle rim, stronger selected/listening state. Red listening dot is decorative; adjacent text status conveys state. Reduced motion replaces breathing with persistent visual state.
8. **Edges.** All runtime producers emit React Flow `type: 'default'` (Bezier), never `smoothstep`.
9. **Baseline.** Compare known failures by full test identity, never aggregate pass count. Measure anew before edits; every new test must pass; no unexpected failures.
10. **Scope.** Current user instruction supersedes stale deferred manifest rows: implement every authoritative `APP`, `VOX`, `EXP`, `EXE`, `AGT`, `FIL`, `PIL`, `GIT`, and `GRP` GWT case. No feature flag or “future” label substitutes for required behavior. Resolve AGENTS Stage-5/manual-promotion and composer-location conflicts explicitly in docs.

## Evidence matrix

| User requirement | Automated proof | Vite desktop proof |
|---|---|---|
| Gorse node light | theme/node tests; reduced-motion test | idle graph + listening graph |
| Curved graph lines | all producers use `default`; SVG path contains cubic `C` | idle graph shows two curves |
| Selected-only layout | DAGX-01..04 pure + UI GWT | before/right/down/left/selected-v-unselected captures |
| Tooltip owns prompt | VTC/VOX integrated GWT suite | preview + editing/listening captures |
| Local-Whisper-inspired listening UX | adapter + VTC status/transcript/error tests | red dot, Listening text, transcript, hint |
| Active node breathing | state + reduced-motion assertions | listening capture |
| Pills/execution/files | PIL/EXE/FIL composed-path tests | expanded details capture |
| Canvas/group operations | GRP/GRPC composed-path tests | selected formatting captures |

## Complete GWT trace

Every row below requires a named `it('<ID> ...')`, exact Gherkin scenario, manifest row, Storybook play function, composed `App → GraphSim → ReactFlow` test, and named Vite desktop capture. A story or unit test alone never closes a row.

| IDs | Integrated owner + behavior | Required desktop capture |
|---|---|---|
| APP-01..07 | `AppWorkspace` / project rail, blank bubble, inline title, saved graph restore, new-project reset | `01-app-blank`, `02-project-rail`, `03-project-restored` |
| VOX-01..04 | `VoiceNodeController` / single-toggle recorder, color, analyser amplitude, hover live transcript | `04-node-rec-idle`, `05-node-rec-amplitude` |
| VOX-05..08 | `VoiceTooltipComposer` / collision-aware right-first placement, left fallback, pin/edit/cursor selection | `06-tooltip-right`, `07-tooltip-left-collision`, `08-tooltip-edit` |
| VOX-09..17 | `VoiceTooltipComposer` + local adapter / Enter/Shift+Enter, outside-dismiss continuing record, toggle/resume, double-click sends, prompt persistence | `09-tooltip-recording`, `10-tooltip-dismissed-recording`, `11-tooltip-resumed` |
| EXP-01..11 | `ExpandedNodeWorkspace` / send expansion, halo, auto-record, bar parity, silent right-click, running state, all close paths | `12-expanded-halo-bar`, `13-expanded-recording`, `14-expanded-silent-open` |
| EXE-01..17 | `ExecutionPanel` / area, double-left execute, double-right confirmation, hover/pin YAML, card/loader/current-step/live updates/file creation | `15-execution-pending`, `16-execution-confirm`, `17-execution-live-file` |
| AGT-01..06 | `AgentRuntimeBridge` + graph/fs ports / spoken-node default context, linked scope, one initial file, visible mutations, intervention, FS projection | `18-agent-context-mutation` |
| FIL-01..07 | `FilePreview` / area below execution, preview, specialized typed file path, raw edit/blur save, multi-highlight, find | `19-file-preview-edit-highlight` |
| PIL-01..05 | `VoiceTooltipComposer` + `ContextPills` / highlight-to-pill, remove, line refs, pause-then-speak, weighted payload | `20-context-pills` |
| GIT-01..04 | `FsGraphSync`/git port + floating control / commit every edit, agent checkpoints, complete mutation log, explicit remote sync | `21-git-timeline-sync` |
| GRP-01..11 | `CanvasOps` + `GroupWorkspace` / multiselect/halo/box/connected drag/standalone/link/soft-hard FS group/prompt context/node-like group/nested graph | `22-group-halo-link`, `23-group-context`, `24-nested-graph` |
| DAGX-01..04 | `DagFormatControl` / no-op, right/down/left cycle, selection integrity | `25-dag-before`, `26-dag-right`, `27-dag-down`, `28-dag-left`, `29-dag-selection-integrity` |

### Mandatory cross-case tests

- `VOX-05`: right first; test left fallback when right collides with neighbor/viewport; preserve arrow direction and focus order.
- `VOX-03` + `EXP-08`: inject analyser levels 0, medium, high; assert transform/amplitude values differ, not only CSS animation class; reduced-motion asserts fixed visible recording state.
- `VOX-01/12/13/14/15`, `EXP-03/06/07/09`: explicit gesture reducer arbitration; single-click waits double-click threshold, double-click never starts/stops recorder, right-click opens silent path only.
- `DAGX`: boundary edges, disconnected selection, selected cycle, empty selection, immutable unselected nodes **and all edges**, unchanged viewport/selection, no callback on no-op.
- `GIT-01..03`: real temporary git repo integration tests with actual commit history; `GIT-04`: injected remote port plus UI transition/error recovery. Never push a real shared remote during automated tests.
- `GRP-07/11`: soft group persists session metadata; hard group moves graph-backed files through temp FS port; nested graph renders isolated child ReactFlow with return/control semantics.

## Test contract

Before T1, run `npx vitest run --reporter=verbose` in `vision-graph-ui`; save exact existing failure identities to `docs/feature-requirements/validation/fulfillment-baseline.md`. Fresh 2026-08-31 measurement: `4 failed | 625 passed | 629`; failures are three `GraphSim` project/send cases plus `Node > renders details panel when lifecycle is done and expanded`. Later suite result is valid only if failure identities exactly match baseline and all new tests pass.

All production work follows red → expected failure → minimal green → scoped suite → commit. No type suppression, mocks that assert only mocks, or post-hoc-only tests.

### New executable GWT

- **DAGX-01:** selected A/B, left command once → only A/B move rightward; gorse state/icon shown; C untouched.
- **DAGX-02:** same selection, next command → downward positions; distinct state/icon/color.
- **DAGX-03:** next command → leftward positions; third distinct state/icon/color; fourth wraps right.
- **DAGX-04:** no selection → no direction advance, callback, node/edge/selection mutation.
- **VTC-01:** preview action → labelled textarea focused inside right-side dialog.
- **VTC-02:** chat-active hover/focus opens; pin persists; outside click hides unpinned view while recording continues.
- **VTC-03:** listening node has breathing state; reduced-motion retains static state.
- **VTC-04..16 / VOX-01..17:** live interim/final text, caret/selection replacement, Enter/send, Shift+Enter/newline, empty-send rejection, left/right double-send, resume append, debounced persistence, denied/error text preserved, one-recorder transfer, accessible status/alert.
- **Bezier:** default edge type plus rendered SVG cubic curve assertion.
- **Integrated execution:** relevant PIL-01..05, EXE-02/04..17, FIL-01/02/04/05, GRP-01..10 run from Vite workspace—not only stories.

## Atomic implementation path

### T0 — Baseline and policy repair

**Files:** `vision-graph-ui/AGENTS.md`; `docs/broader-vision/user-flows.md`; `docs/feature-requirements/validation/fulfillment-baseline.md` (new).

1. Capture baseline identities and resolve 4-vs-12 discrepancy from command output.
2. Amend AGENTS: fulfillment explicitly authorizes app promotion; stories are insufficient; composer moves to right-side dialog.
3. Amend flows B/C: state model, pin/blur, one-recorder, adapter errors.
4. Commit: `docs(ui): lock integrated fulfillment contract`.

### T1 — Extract composed graph workspace

**Files:** `src/features/graph-sim/GraphSim.tsx`; `GraphWorkspace.tsx` (new); `GraphWorkspace.test.tsx` (new).

1. RED: project selection test requires composed workspace hosts for selection, dialog, canvas, expanded execution/file surface.
2. GREEN: extract ReactFlow workspace without changing behavior; `GraphSim` remains picker/app-shell owner.
3. Scoped Vite-component test green; commit `refactor(graph): extract workspace composition`.

### T2 — Gorse + Bezier foundation

**Files:** `src/shared/theme.ts`; `src/shared/fsGraphLoader.ts`; `src/features/graph-sim/GraphWorkspace.tsx`; `src/features/agent-semantics/{useSpawnPlacement.ts,useGraphMutationHandler.ts}`; affected tests/stories.

1. RED tests for gorse token/node class, default edge from loader/spawn/refine/mutation, cubic SVG path, reduced-motion state.
2. GREEN typed gorse tokens and subtle node glow; replace every runtime `smoothstep` with `default`.
3. Scoped green; commit `feat(graph): add gorse bezier foundation`.

### T3 — Selected DAG formatter

**Files:** `src/features/dag-format/{dagFormat.ts,DagFormatControl.tsx,DagFormatControl.test.tsx,DagFormatControl.stories.tsx}` (new); `src/features/graph-sim/{GraphWorkspace.tsx,GraphWorkspace.test.tsx,dag-format.feature}`; `package.json`.

1. Add pinned `@dagrejs/dagre`.
2. RED pure transform + control tests for DAGX-01..04, deterministic ID ordering, origin preservation, no selection no-op, cycle wrap, no mutation, unselected identity.
3. GREEN induced-subgraph Dagre transform; app `onSelectionChange`; accessible two-segment control with right readout.
4. Story variants per state + no selection; scoped green; commit `feat(graph): format selected dag section`.

### T4 — Canvas, grouping, and nested graph semantics in workspace

**Files:** `src/features/canvas-manipulation/{CanvasOps.tsx,CanvasOps.test.tsx,CanvasOps.stories.tsx}`; `GraphWorkspace.tsx`.

1. RED one test + feature scenario per `GRP-01..11`: pan/lasso/modifier selection, focus surround, right-click group, connected drag, floating node, hover connection, soft/hard FS-backed group, halo, group prompt, node-like expansion, nested graph.
2. GREEN compose CanvasOps and `GroupWorkspace` behavior into App path; no feature flag; hard groups use injected temp FS port; nested child graph has explicit back/close control; theme-token every touched color.
3. GRP/GRPC/GRPX scoped green; capture group states; commit `feat(canvas): compose graph operations`.

### T5 — Local STT reducer, adapter, and amplitude pipeline

**Files:** `src/features/voice-capture/{speechTypes.ts,BrowserWhisperAdapter.ts,LocalWhisperEndpointAdapter.ts}` (new); `useVoiceInput.ts`; adapter tests; `package.json`; `vite.config.ts`.

1. RED reducer table tests for every `speechState × event → nextState + side effect`, including hover/pin/blur, single/double click arbitration, expanded auto-record, silent right-click, recorder transfer, cursor/selection final insertion, and amplitude level mapping. Add configuration test proving both Vite dev/preview emit COOP+COEP headers.
2. GREEN pin `browser-whisper@1.1.0`; project-owned `LocalSttEngine` factory wraps documented `downloadModel`, `transcribePCM`, cancellation, disposal; fake yields deterministic segments/errors. Browser-whisper path uses one capture context split to analyser + worker; optional endpoint path uses `getUserMedia → MediaRecorder → configured localhost endpoint`. Model/WebGPU/WASM fallback, model-load progress, denied/no-mic/insecure-context/silence/OOM recovery are explicit.
3. Required local smoke: served dev **and** preview return COOP/COEP; preload actual runtime/model; reload with external requests blocked; transcribe deterministic 16kHz PCM; assert zero cloud requests and result text. If this fails, self-host/cache required runtime assets, repair, rerun. No offline/local manifest pass until green.
3. Scoped green; commit `feat(voice): add testable speech adapters`.

### T6 — Right-side VoiceTooltipComposer

**Files:** `src/features/node/{VoiceTooltipComposer.tsx,VoiceTooltipComposer.test.tsx,VoiceTooltipComposer.stories.tsx,voice-tooltip-composer.feature}` (new); `Node.tsx`; `NodeTooltip.tsx`; `NodePromptArea.tsx`; `NodeMicBtn.tsx`; voice tests/stories.

1. RED VTC + VOX integrated suite listed above.
2. GREEN semantic dialog/pointer arrow; preview-to-textarea; pills; mic, send, red dot, `Listening...`, transcript box, hotkey hint, `role=status`, errors via alert; focus/blur/pin/recording state machine.
3. Remove composer/mic from node body and metadata-only tooltip behavior.
4. Stories: preview, pinned edit, listening, denied/error, reduced motion, recorder transfer. Scoped green; commit `feat(node): compose voice dialog`.

### T7 — Compose expanded execution, agent context, file, pills, git

**Files:** `GraphWorkspace.tsx`; `Node.tsx`; `NodeDetailPanel.tsx`; `execution/{ExecutionPanel.tsx,ExecutionPanel.test.tsx}`; `context-pills/ContextPills.test.tsx`; workspace tests.

1. RED composed GWT for **all** `EXP-01..11`, `EXE-01..17`, `AGT-01..06`, `FIL-01..07`, `PIL-01..05`, `GIT-01..04`: bar/bubble interaction parity; execution left/right gesture; YAML pin/color/collapse/density; live status/morph/breath/current title; scoped agent mutation/intervention; file preview/edit/multi-highlight/find; pill payload weight; actual temp-repo commit history and injected sync error/retry.
2. GREEN mount `ExpandedNodeWorkspace`, execution, agent bridge, file, pills, git timeline/sync in App path. Execution file events drive FilePreview; FS port drives graph projection; no fake random stream remains in production composition.
3. Scoped composed tests green; capture all app states; commit `feat(graph): compose execution context surfaces`.

### T8 — Make validation truthfully complete

**Files:** `docs/feature-requirements/validation/{slice-02.validation.md,slice-10.validation.md,coverage-manifest.tsv,check-coverage.sh,README.md}`; `docs/feature-requirements/README.md`.

1. Register all 85 original IDs plus VTC/DAGX with real scenario, test, story/play, command output, and Vite capture path.
2. Repair malformed GRP-07; normalize TSV rows; extend checker to reject claimed `pass` lacking test result + composed capture reference; fix stale counts from checker output.
3. Remove stale deferred/pass claims. `pass` only after CI-equivalent test evidence and composed Vite capture exist; any remaining missing row stays `todo` and blocks final gate.
4. Coverage checker green; commit `docs(validation): register integrated fulfillment evidence`.

### T9 — Desktop-only review harness

**Files:** `vision-graph-ui/scripts/ui-review.mjs`; `vision-graph-ui/package.json`; deterministic review fixture if needed.

1. RED dry-run test for `--desktop-only` fixed `1440x900` and deterministic fake voice.
2. GREEN canonical 29 Vite captures, all audit console/errors/failed requests/unstyled inputs, absolute paths in `REVIEW.md`:
   - `01-app-blank`, `02-project-rail`, `03-project-restored`
   - `04-node-rec-idle`, `05-node-rec-amplitude`
   - `06-tooltip-right`, `07-tooltip-left-collision`, `08-tooltip-edit`, `09-tooltip-recording`, `10-tooltip-dismissed-recording`, `11-tooltip-resumed`
   - `12-expanded-halo-bar`, `13-expanded-recording`, `14-expanded-silent-open`
   - `15-execution-pending`, `16-execution-confirm`, `17-execution-live-file`, `18-agent-context-mutation`, `19-file-preview-edit-highlight`, `20-context-pills`, `21-git-timeline-sync`
   - `22-group-halo-link`, `23-group-context`, `24-nested-graph`
   - `25-dag-before`, `26-dag-right`, `27-dag-down`, `28-dag-left`, `29-dag-selection-integrity`
3. Script enforces `--desktop-only` (only 1440×900), verifies required labels/state before every capture, records case IDs + interactions + audit in `REVIEW.md`, exits nonzero for missing required state.
4. Run harness green; commit `test(ui): add desktop fulfillment evidence`.

### T10 — Final gate + user review

Run fresh:

```bash
cd /home/jon/code/whitt/vision-graph-ui
npx tsc --noEmit
npx stylelint "src/**/*.{ts,tsx}"
npx vitest run --reporter=verbose
npm run build
npm run build-storybook
bash ../docs/feature-requirements/validation/check-coverage.sh
npm run ui:review -- --desktop-only --topic fulfillment
```

Then inspect every screenshot, audit output, and changed-file diagnostics. Ask exactly these four MCQs, each quoting the listed absolute paths:

1. **App + graph + DAG:** `01-app-blank`, `02-project-rail`, `03-project-restored`, `04-node-rec-idle`, `05-node-rec-amplitude`, `25-dag-before`–`29-dag-selection-integrity`. Options: `A Worth manual review` / `B Fix app/project` / `C Fix gorse or curves` / `D Fix selection formatting`. B→T1, C→T2, D→T3/T4.
2. **Voice dialog:** `06-tooltip-right`–`14-expanded-silent-open`. Options: `A Worth manual review` / `B Fix placement/input` / `C Fix listening/breathing` / `D Fix gesture/accessibility`. B/C/D→T5/T6.
3. **Execution/agent/file/git:** `15-execution-pending`–`21-git-timeline-sync`. Options: `A Worth manual review` / `B Fix execution` / `C Fix agent/file/pills` / `D Fix git/sync`. B/C/D→T7.
4. **Grouping/nesting:** `22-group-halo-link`–`24-nested-graph`. Options: `A Worth manual review` / `B Fix group interaction` / `C Fix group context` / `D Fix nested graph`. B/C/D→T4/T7.

Pass condition: user selects **A Worth manual review** for all four. Any B/C/D becomes a named regression: add/fix failing test, repair only selected defect, rerun every gate command, recapture full canonical 29-set, then repeat. Max three screenshot rounds; agent may claim only `demo` until user explicitly reaches this pass condition.

## Completion checklist

- [ ] Every T0–T9 commit verified locally; no uncommitted intended source changes.
- [ ] Baseline failure identities unchanged; no unexpected Vitest failure; all new GWT pass.
- [ ] tsc, stylelint, Vite build, Storybook build, coverage checker all exit 0.
- [ ] Vite—not Storybook—desktop captures show every matrix row; audit has zero console errors, failed requests, unstyled inputs.
- [ ] User MCQ confirms screenshots worth manual review; otherwise continue selected repair cycle.
