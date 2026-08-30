# UI Fulfillment Plan — Fill ALL Remaining Gaps

> Created 2026-08-30 per user directive after UI review round 2. Status: NOT-STARTED.
> Exit condition: every item below implemented + tested + live-rendered, then ONE desktop-only MCQ review cycle w/ screenshots showing ALL features.
> Suite baseline (MUST hold exactly): 4 failed (GraphSim act ×3 + Node details-panel ×1) / 625 pass. tsc 0. stylelint 0.

## 0. Verbatim user requirements (round 2, authoritative)

1. "there is no light highlight around the nodes that resemble Gorse" → nodes need a GORSE-yellow light highlight (glow) treatment. Gorse = vivid yellow flowering shrub; use gorse-gold token (approx #E8B31A family — MUST go through theme token, no raw hex in styled strings).
2. DAG format = TWO-SIDED BUTTON. LEFT click cycles 3 states, applies ONLY to selected/highlighted nodes (no selection = button no-op):
   - 1st click: "lightening highlight color" + gorse light effect + format section LEFT-TO-RIGHT
   - 2nd click: DIFFERENT color + DIFFERENT icon + organize DOWNWARD
   - 3rd click: format highlighted section to the LEFT
   - Selection formatting MUST be visible in screenshots (validation is visual, not just unit).
   - (Right side of button: unspecified — propose = commit/apply format; surface in MCQ after build.)
3. TOOLTIP MUST CONTAIN THE INPUT:
   - Input starts as a SPAN (prompt text preview) w/ action buttons, inside the tooltip that sits RIGHT of node w/ arrow.
   - Click into span → becomes editable text input (focus mode).
   - Speech-to-text modeled on user's `~/code/easy-local-whisper-hotkey` (tauri-app/src/components/StreamingTextDisplay.tsx — READ IT): red bubble breathing animation as the ONLY inspiration borrowed (ping-dot + "Listening..." label + live transcript box + hold-hotkey hint pattern).
   - Breathing highlight around the NODE when chat-expanded (voice active).
   - Text + buttons LIVE in the tooltip (NOT in the node body).
   - Tooltip shows only when node chat-active OR manually focused for text editing.
   - Must follow previously documented user flows (docs/broader-vision/user-flows.md Flow B/C) + pass S02 GWT cases (VOX suite) in this integrated surface.
4. Edges: CURVED (bezier), not stepped/smoothstep.
5. Focused-node experience rated "C) Wrong" → reworked by items 2+3 (composer leaves node body, moves into tooltip).

## 1. Inventory — remaining gaps (from audits + manifest + reviews)

### A. New-feature gaps (round 2)
- A1 Gorse glow token + default node light treatment (item 1).
- A2 DAG format two-sided button + 3-state cycle + selection-only application (item 2). New cases: DAGX-01 (LR format+color), DAGX-02 (downward, 2nd color/icon), DAGX-03 (section-left 3rd state), DAGX-04 (no selection = no-op), DAGX-05 (button right side behavior). Add to slice doc + validation spec + manifest.
- A3 VoiceTooltipComposer (item 3) — replaces composer-in-node: span mode, input mode, mic button, red breathing bubble, Listening label, live transcript, breathing node highlight, send. Maps existing VOX cases (S02) onto the integrated surface + new VTC-01 (span→input on click), VTC-02 (tooltip only when active/focused), VTC-03 (node breathing while voice-active).
- A4 Bezier edges (item 4): defaultEdgeOptions type 'default' (bezier), remove smoothstep; curved visible at 2px gorse-ish or primary stroke.

### B. Stage-5 promotion gaps (slices live only in Storybook)
- B1 VoiceNode/useVoiceInput → wire into node slice app path (consumed by A3 tooltip composer).
- B2 CanvasOps (selection, grouping, lasso/pan, GRPX menus) → integrate into graph-sim app path (or behind feature flag if unstable — decide during execution; default = integrate).
- B3 ExecutionPanel (S05) → mount inside expanded-node surface/modal flow.
- B4 Context pills (S08) → surface in the A3 tooltip (pills row feeds prompt, per PIL spec — pills already render in NodePromptArea; move/bridge to tooltip composer).
- B5 FilePreview (S07) already in NodeDetailPanel — verify visible in app flow (expanded node → details).

### C. Manifest debts
- C1 3 `ready` rows missing stories: GRP-06, GRPC-03, GRPC-04 (author slice10 stories, flip to pass).
- C2 3 `deferred` stay deferred (GRP-11 nesting, FIL-03 non-md, LGT-06 sprite tier) — out of scope, documented.

### D. Verification gaps
- D1 ui-review script: add `--desktop-only` mode (user: DESKTOP VIEW ONLY for final cycle) + new captures: `04-dag-format-lr`, `05-dag-format-down`, `06-dag-format-left` (cycle through states on a selection), `07-voice-tooltip-active` (tooltip w/ streaming text + red bubble + node breathing). Shots MUST show selection formatting (item 2 requirement).
- D2 Live test cases: gherkin + vitest for A2/A3 (+ A1/A4 asserts); jsdom asserts + keep 4/625 baseline exactly; stylelint 0 (no raw hex — gorse via token); tsc 0.

## 2. Execution batches (sequential; delegate per batch; commit-per-task; verify each)

| # | Batch | Scope | Verify |
|---|-------|-------|--------|
| T1 | Graph visuals | A4 bezier edges; A1 gorse token + node glow treatment | tsc/stylelint/scoped suite + shot |
| T2 | VoiceTooltipComposer | A3 + B1 + B4 wiring into NodeTooltip surface | VOX/VTC scoped green + shot |
| T3 | DAG format button | A2 full (button, cycle, selection application, colors/icons) | DAGX scoped green + 3 shots (one per state) |
| T4 | Promotions | B2 CanvasOps→graph-sim, B3 ExecutionPanel mount | suite baseline + shot |
| T5 | Story debts | C1 3 stories | manifest flip, gate green |
| T6 | Review harness | D1 ui-review desktop-only + new shot types | run produces all shots |
| T7 | Final | Full suite + builds + ui:review full run → REVIEW.md w/ ABS paths → MCQ cycle (desktop only, ALL features shown) | user verdict |

Guardrails (all batches): styled-components + theme tokens only; gorse = new token `theme.glow.gorse` + `colors.gorse` (no hex in strings); animations transform/opacity + reduced-motion respected; breathing = existing S03 keyframes family (recordingPulse pattern); red bubble = small dot + ping ring (whisper-hotkey pattern), red token; npm only inside vision-graph-ui; no console.*; commit-per-task; orchestrator verifies personally (agents have false-claimed 7×).

## 3. Acceptance (all must hold before MCQ)

1. Baseline exact: 4 failed / 625+ pass; tsc 0; stylelint 0; vite + SB builds 0.
2. Desktop-only screenshot set shows: picker → graph (bezier edges, gorse node glow) → selection + DAG format cycle (3 states, distinct colors/icons) → voice tooltip active (span→input, buttons, red breathing bubble, Listening, live text, node breathing) → expanded details w/ FilePreview + ExecutionPanel.
3. Manifest: GRP-06/GRPC-03/04 pass; DAGX-01..05 + VTC-01..03 added + pass; gate exit 0.
4. MCQ cycle (≤3 rounds) w/ ABSOLUTE paths under docs/ui-reviews/<date>-fulfillment/.

## 4. Open questions (fold into final MCQ, don't block)

- Right side of two-sided DAG button behavior (propose: apply/commit).
- Gorse glow intensity: default-on for ALL nodes vs selection/hover only (propose: subtle idle gorse rim on all, strong on selection/voice-active).
- CanvasOps integration stability in app path (flag if suite baseline threatened).
