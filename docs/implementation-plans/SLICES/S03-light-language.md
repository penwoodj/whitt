# S03 — Light Language Visual System Implementation Plan

> Executes: `docs/feature-requirements/slices/03-light-language.md` (cases: VOX-02/03, EXP-02/04/08, EXE-11/12/14, GRP-08, LGT-01..08)
> Validation spec: `docs/feature-requirements/validation/slice-03.validation.md`
> Status: NOT-STARTED
> Depends on: ENABLERS/E1-stt-engine.md (audio feed for breathing)

## 1. Objective

Implements single-sourced state→glow mapping (idle/recording/running/done) as tokens, breathing amplitude driven by E1 audio analyser, halo geometry for expanded nodes and groups, and bar-of-light rest state. Delivers tier-0 DOM implementation (keyframes + styled-components); tier-1/2 sprite/WebGL tasks marked blocked per ADR-0015.

## 2. Inputs (READ FIRST — in this order)

| Input | Path |
|---|---|
| Requirements slice | `docs/feature-requirements/slices/03-light-language.md` |
| Inherited case source | `docs/broader-vision/requirements/02-voice-input-tooltip.md`, `03-expanded-node-modal.md`, `04-agentic-execution-area.md`, `09-canvas-grouping-manipulation.md` |
| Validation spec | `docs/feature-requirements/validation/slice-03.validation.md` |
| User-flow narrative | `docs/broader-vision/user-flows.md` (Flow 2: Voice Input, Flow 3: Node Expansion, Flow 4: Agent Execution, Flow 5: Grouping) |
| Skills to load | `modern-react`, `storybook-agentic-e2e` (animation asserts), `oss-code-adaptation` (code rips) |
| Code-rip sources | `.repos/edge-aura/src/engine.ts`, `.repos/reposkein/viz/src/scene/sprites.ts`, `.repos/border-beam/packages/border-beam/src/BorderBeam.tsx`, `.repos/mantine-scene/package/src/SceneGlow/SceneGlow.tsx`, `.repos/3d-force-graph/example/bloom-effect/index.html`, `.repos/unsloth/studio/frontend/src/features/chat/adapters/dictation-level.ts`, `.repos/autogpt/autogpt_platform/frontend/src/app/(no-navbar)/onboarding/steps/BrainDumpStep/components/useAudioBars.ts`, `.repos/openai-cookbook/examples/voice_solutions/one_way_translation_using_realtime_api/src/lib/wavtools/lib/analysis/audio_analysis.js` |
| READ-ONLY patterns | `.repos/deskreen/src/client-viewer/src/containers/MainView/index.css` (AGPL!), `.repos/gradient-components/src/components/ui/GradientLine.jsx` (no license!) |

## 3. File plan (REAL paths)

| Action | Path | Notes |
|---|---|---|
| create | `vision-graph-ui/src/features/light-language/LightLanguage.stories.tsx` | matrix host: ball/bar/halo/group ring in each state; FakeAudioContext level script; reduced-motion param |
| create | `vision-graph-ui/src/features/light-language/light-language.feature` | Gherkin scenarios: VOX-02/03, EXP-02/04/08, EXE-11/12/14, GRP-08, LGT-01..08 |
| create | `vision-graph-ui/src/features/light-language/light-language.test.tsx` | maps to .feature scenarios; animation asserts via getComputedStyle animationName + RAF counters |
| create | `vision-graph-ui/src/features/light-language/useVoiceLevel.ts` | consumes E1 analyser feed; returns smoothed level (0..1) with attack/release; silenced below noise gate |
| create | `vision-graph-ui/src/features/light-language/GlowBall.tsx` | node ball with state glow; breathing class; reduced-motion fallback |
| create | `vision-graph-ui/src/features/light-language/BarOfLight.tsx` | bar at modal top; rest state (idle) vs breathing (recording); hover brightens; soft-corner radius token |
| create | `vision-graph-ui/src/features/light-language/HaloRing.tsx` | radial glow ring for expanded nodes and groups; inherits entity state glow; breathes ONLY if entity live |
| create | `vision-graph-ui/src/features/light-language/MorphLoader.tsx` | loader icon cycles every ~1.2s; phase-mapped icons; transform/opacity crossfade only |
| create | `vision-graph-ui/src/features/light-language/BreathingEdge.tsx` | edge component that breathes while executing; still when idle; animationName assertion only (polish tier) |
| modify | `vision-graph-ui/src/shared/theme.ts` | extend glow tokens: add breathing variants (breathingScale, breathingAttack, breathingRelease, noiseGate), state→glow mapping table as token object |
| modify | `vision-graph-ui/src/shared/keyframes.ts` | add keyframes: breatheScale (0.98→1.02), pulseRing (box-shadow expansion), morphFade (opacity 0→1 crossfade), restGlow (static idle glow) |
| modify | `vision-graph-ui/src/features/node/NodeStatus.tsx` | use new state→glow token table; remove hardcoded glow fallbacks; integrate with reduced-motion mode |

## 4. Question-cycle gate (AGENTS.md §1 Stage 1 — MANDATORY before tests)

Ask user (2-3 questions max, `question` tool): the following open decisions this slice still owns — pull from slice "Open questions" section + decision register in EXECUTION-PROTOCOL.md. **Answers (2026-08-15, user):**
1. Done-state decay = **B) 3s fade to idle**.
2. Breathing amplitude k = **A) 0.08**.
3. Noise gate = **A) 0.02**.

Record answers in this file, then never re-ask.

1. **Done-state glow decay duration** (slice spec asks for 2s fade to idle; confirm visually in Storybook):
   - A) 2s fade to idle (as proposed in slice spec)
   - B) 3s fade to idle (longer linger)
   - C) 1s fade to idle (snappier transition)

2. **Breathing amplitude coefficient k** (slice spec proposes k≈0.08 for visible-but-calm):
   - A) 0.08 (as proposed — subtle breathing)
   - B) 0.12 (more noticeable breathing)
   - C) 0.05 (very subtle, almost still)

3. **Noise gate threshold** (slice spec proposes ~0.02):
   - A) 0.02 (as proposed)
   - B) 0.01 (more sensitive)
   - C) 0.05 (less sensitive, ignores more background noise)

## 5. Tasks (incremental, TDD, each ends green+committed)

### Task 3.1 — State→glow token table (cases: LGT-01)
- **Gherkin first**: `vision-graph-ui/src/features/light-language/light-language.feature` (scenario: LGT-01 token table states)
- **Red**: `light-language.test.tsx` — assert every element (ball/bar/halo/group ring) resolves glow from same token CSS vars; no ad-hoc colors
- **Green**: extend `src/shared/theme.ts` glow tokens; add state→glow mapping table as token object; modify `NodeStatus.tsx` to use new token table
- **Rip (if any)**: none (token extension, no external rip)
- **Story**: `LGT-01 token table states` in `LightLanguage.stories.tsx` — render matrix all states
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run light-language.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip LGT-01 row → `ready`→`pass` in coverage-manifest.tsv (requirements-regression skill)
- **Commit**: `feat(light-language): State→glow token table (LGT-01)`

### Task 3.2 — Amplitude driver hook (cases: LGT-02, LGT-03)
- **Gherkin first**: `light-language.feature` (scenarios: LGT-02 amplitude curve, LGT-03 silence stillness)
- **Red**: `light-language.test.tsx` — mock E1 analyser feed; assert level script 0/0.5/0.9 w/ smoothing; assert sub-gate level = still
- **Green**: create `src/features/light-language/useVoiceLevel.ts` — consumes E1 analyser feed; returns smoothed level (0..1) with attack/release (60ms/200ms); noise gate (~0.02)
- **Rip**: READ-ONLY cadence params from `.repos/unsloth/studio/frontend/src/features/chat/adapters/dictation-level.ts` (RAF tick constants) + `.repos/autogpt/autogpt_platform/frontend/src/app/(no-navbar)/onboarding/steps/BrainDumpStep/components/useAudioBars.ts` (fftSize 512, smoothing 0.45) — breathing loop CONSUMES E1 `shared/audio/analyser.ts` level stream; do NOT re-port RAF loop (dedup: E1 owns it); VERIFY license headers at read time (unsloth=Apache-2.0, autogpt=MIT in platform folder)
- **Story**: `LGT-02 amplitude curve` in `LightLanguage.stories.tsx` — level steps 0/0.5/0.9 w/ smoothing
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run light-language.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip LGT-02, LGT-03 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(light-language): Amplitude driver hook (LGT-02, LGT-03)`

### Task 3.3 — Breathing ball and bar (cases: VOX-02/03, EXP-04/08, LGT-08)
- **Gherkin first**: `light-language.feature` (scenarios: VOX-02 recording color shift, VOX-03 volume breathing, EXP-04 bar of light, EXP-08 bar breathes tooltip-closed, LGT-08 bar rest state)
- **Red**: `light-language.test.tsx` — assert recording color shift; assert breathing class on with sampled transform scale growing w/ level; assert bar breathes tooltip-closed; assert bar rest state (idle unanimated, hover brightens)
- **Green**: create `src/features/light-language/GlowBall.tsx` (ball with state glow, breathing class, reduced-motion fallback) and `BarOfLight.tsx` (bar at modal top, rest state vs breathing, hover brightens, soft-corner radius token); add `breatheScale`, `restGlow` keyframes to `src/shared/keyframes.ts`
- **Rip**: READ-ONLY pattern from `.repos/border-beam/packages/border-beam/src/BorderBeam.tsx` (pulse-inner/pulse-outside breathing border glow, GPU @property keyframes) — reimplement from scratch in our keyframes (no code copy, MIT but port pattern only); READ-ONLY pattern from `.repos/deskreen/src/client-viewer/src/containers/MainView/index.css` (pulse1 keyframes: scale 0.95→1 + expanding box-shadow ring) — AGPL-3.0, reference only, reimplement from description
- **Story**: `VOX-02 recording color shift`, `VOX-03 volume breathing`, `EXP-04 bar of light`, `EXP-08 bar breathes tooltip-closed`, `LGT-08 bar rest state` in `LightLanguage.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run light-language.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip VOX-02/03, EXP-04/08, LGT-08 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(light-language): Breathing ball and bar (VOX-02/03, EXP-04/08, LGT-08)`

### Task 3.4 — Halo geometry (cases: EXP-02, GRP-08, LGT-05)
- **Gherkin first**: `light-language.feature` (scenarios: EXP-02 ball becomes halo, GRP-08 grouping halo, LGT-05 halo geometry)
- **Red**: `light-language.test.tsx` — assert halo element wraps modal on expand; assert ball element hidden; assert halo ring element wraps selection box on group form; assert same halo component both cases (testid shared)
- **Green**: create `src/features/light-language/HaloRing.tsx` (radial glow ring hugging container's soft-corner rect; inherits entity state glow; breathes ONLY if entity live)
- **Rip**: READ-ONLY pattern from `.repos/mantine-scene/package/src/SceneGlow/SceneGlow.tsx` (float/pulse/breathe glow blob variants, transform/opacity only) — reimplement from scratch in our styled-components (MIT, port pattern only)
- **Story**: `EXP-02 ball becomes halo`, `GRP-08 grouping halo`, `LGT-05 halo geometry` in `LightLanguage.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run light-language.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip EXP-02, GRP-08, LGT-05 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(light-language): Halo geometry (EXP-02, GRP-08, LGT-05)`

### Task 3.5 — Morph loader and breathing edges (cases: EXE-11/12/14, LGT-04) — BLOCKED (tier-0 DOM only)
- **Gherkin first**: `light-language.feature` (scenarios: EXE-11 edges breathe executing, EXE-12 border animation eventual, EXE-14 morph loader, LGT-04 morph cadence)
- **Red**: `light-language.test.tsx` — assert edges animationName set while running, `none` when idle; assert border-beam class present (polish tier — assert class only); assert loader icon cycles (≥2 icon names observed over ~3s, transform crossfade)
- **Green**: create `src/features/light-language/MorphLoader.tsx` (icon cycles every ~1.2s; phase-mapped icons; transform/opacity crossfade only) and `BreathingEdge.tsx` (edge that breathes while executing, still when idle; animationName assertion only); add `morphFade` keyframes to `src/shared/keyframes.ts`
- **Rip**: READ-ONLY pattern from `.repos/mantine-scene/package/src/SceneBeams/SceneBeams.tsx` (beam variants for border animation) — reimplement from scratch (MIT, port pattern only)
- **Story**: `EXE-11 edges breathe executing`, `EXE-12 border animation eventual`, `EXE-14 morph loader`, `LGT-04 morph cadence` in `LightLanguage.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run light-language.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip EXE-11/12/14, LGT-04 rows → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(light-language): Morph loader and breathing edges (EXE-11/12/14, LGT-04)`

### Task 3.6 — Reduced-motion fallback (cases: LGT-07) — MANDATORY
- **Gherkin first**: `light-language.feature` (scenario: LGT-07 reduced motion)
- **Red**: `light-language.test.tsx` — assert no animationName on breathing elements when reduced-motion param set; assert state badge text present
- **Green**: update all breathing components (`GlowBall.tsx`, `BarOfLight.tsx`, `HaloRing.tsx`, `MorphLoader.tsx`, `BreathingEdge.tsx`) to check `prefers-reduced-motion`; render static glow + textual state badge when true
- **Rip**: none (WCAG 2.3.3 compliance, no external rip)
- **Story**: `LGT-07 reduced motion` in `LightLanguage.stories.tsx` — reduced-motion param
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run light-language.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip LGT-07 row → `ready`→`pass` in coverage-manifest.tsv
- **Commit**: `feat(light-language): Reduced-motion fallback (LGT-07)`

### Task 3.7 — Glow performance budget (cases: LGT-06) — BLOCKED (tier-1 sprite cache, deferred)
- **Gherkin first**: `light-language.feature` (scenario: LGT-06 perf 100 bubbles)
- **Red**: `light-language.test.tsx` — render 100-node story; RAF-count frames; assert no frame > 16ms budget over sampled window (allow GC outliers); assert sprite cache hit (no per-frame gradient creation — spy on createRadialGradient in canvas tier)
- **Green**: (DEFERRED) port from `.repos/edge-aura/src/engine.ts` (tiled zero-alloc canvas glow math, Gaussian core + rational bloom tail, Bayer dither) AND `.repos/reposkein/viz/src/scene/sprites.ts` (cached radial-gradient sprite builder: init-only createRadialGradient → offscreen canvas → drawImage scale) via `oss-code-adaptation` skill — VERIFY license at rip time (edge-aura=MIT, reposkein=Apache-2.0)
- **Rip**: DEFERRED — tier-1 sprite cache blocked on canvas layer decision per ADR-0015; mark as BLOCKED in plan, re-run when tier decision made
- **Story**: `LGT-06 perf 100 bubbles` in `LightLanguage.stories.tsx` — render 100-node story; RAF-count frames
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run light-language.test.tsx && npm run build-storybook` — all exit 0
- **Manifest**: flip LGT-06 row → `ready`→`pass` in coverage-manifest.tsv (mark as DEFERRED w/ reason in manifest notes)
- **Commit**: `feat(light-language): Glow performance budget - deferred (LGT-06)`

## 6. Skill + agent routing (per task)

| Task | Skills to load | Delegate to |
|---|---|---|
| 3.1 | `modern-react` | `category="visual-engineering"` |
| 3.2 | `modern-react`, `oss-code-adaptation` | `category="deep"` |
| 3.3 | `modern-react`, `storybook-agentic-e2e`, `oss-code-adaptation` | `category="visual-engineering"` |
| 3.4 | `modern-react`, `storybook-agentic-e2e`, `oss-code-adaptation` | `category="visual-engineering"` |
| 3.5 | `modern-react`, `storybook-agentic-e2e`, `oss-code-adaptation` | `category="visual-engineering"` |
| 3.6 | `modern-react`, `storybook-agentic-e2e` | `category="visual-engineering"` |
| 3.7 | `modern-react`, `oss-code-adaptation` | BLOCKED — defer to tier decision |

## 7. Live-system validation gate (slice DONE only when ALL pass)

1. Run validation stories: `npx vitest run --project=storybook -t "slice03"`
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

- Tier-1 sprite cache (LGT-06): deferred per ADR-0015 until canvas layer decision; blocked task, not in scope for tier-0 DOM implementation
- Tier-2 UnrealBloom (3d-force-graph): deferred to future 3D tier; not in scope for this slice
- Direct code copying from deskreen (AGPL-3.0) or gradient-components (no license): READ-ONLY pattern reference only; reimplement from description in our keyframes
- Fish-eye/3D viewport features: out of scope for this slice (belongs to future canvas/WebGL tier)
- Node lifecycle state management: owned by S04, not this slice (this slice only visualizes state, doesn't manage transitions)
- Audio capture/streaming: owned by E1, this slice only consumes the analyser feed via `useVoiceLevel` hook
- Agent execution state events: owned by S05, this slice only visualizes running/done states
