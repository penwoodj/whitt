# Implementation Gaps — Brainstorm → Buildable

> Audited 2026-08-14 against: brainstorm suite (85 cases), feature-requirements
> (11 slices, 141 cases), validation suite (manifest + check-coverage.sh), existing
> skills (`vision-graph-ui/.opencode/skills/`), user vision docs.
> Question answered: what else is needed — requirements, regression tests, research,
> skills, e2e live-system testing — so an implementation plan suite referencing these
> skills can accomplish what the brainstorm lays out.

## Method

Internal audit (greps over docs + skills + AGENTS.md) + 3 external research tasks
(OSS code adaptation, Storybook agentic E2E, local STT wiring). Each gap: what
exists → what's missing → closure artifact (skill / cases / research).

## Gap Category A — Runtime Integration (invisible to UI cases, blocks any live run)

### A1. Local STT engine wiring — GAP (skill: `local-stt`)

- Exists: VOX cases (engine-agnostic), slice 02 open question "whisper.cpp streaming
  vs chunked", audio LEVEL metering refs (omi/AutoGPT/unsloth, AnalyserNode RMS).
- Missing: engine decision + wiring — whisper.cpp WASM vs transformers.js vs Web
  Speech vs native sidecar; model download/caching for local-first; interim-vs-final
  transcript semantics mapped to VOX-07/13 cursor-append; ONE AudioContext feeding
  both STT and level metering; failure UX (VOXC covers some).
- Closure: `local-stt` skill (research-backed), ADR for engine pick.

### A2. Agent runtime bridge — GAP (skill: `agent-runtime-bridge`)

- Exists: slice 05 open question "event transport (WebSocket vs polled FS events)
  from whitt-execution-engine — engine slice decision, UI consumes either way";
  AGTC-01 mutation event vocabulary; ragflow event-derived busy-set pattern.
- Missing: contract between whitt-execution-engine and UI — event schema
  (step-start/step-done/file-write/graph-mutation/log), transport decision, UI-side
  derivation (busy-set, current-step title EXE-15), graph mutation projection
  (AGT-06) incl. spawn placement (AGTC-02).
- Closure: `agent-runtime-bridge` skill + event-schema ADR when engine lands.

### A3. FS↔graph sync runtime — GAP (skill: `fs-graph-sync`)

- Exists: ADR-0011 + AGENTS.md §16 (mapping lifecycle, frontmatter, slug rules,
  memory layer, debounce 2s, git mv renames); fsGraphLoader.ts (7 pre-existing
  failing tests); VOX-16 hidden `.` prompt folder; GIT-01..04.
- Missing: watcher→projection implementation path (chokidar? fs.watch? Vite import
  context vs runtime FS in local-first app), commit-per-edit mechanics (simple-git
  vs isomorphic-git vs shell git), conflict rule (FS wins — AGENTS.md §16) wiring,
  prompt-file naming format.
- Closure: `fs-graph-sync` skill.

### A4. Git-in-app operations — GAP (folded into A3 skill)

- Exists: GIT cases; time-travel vision.
- Missing: lib pick, commit message metadata schema (GITC defines fields — actor/
  action/refs — needs serialization format), sync-to-remote auth UX beyond button.

## Gap Category B — Testing Infrastructure (validation suite covers plays w/ mocks; live-system testing missing)

### B1. Live agentic E2E through Storybook — GAP (skill: `storybook-agentic-e2e`)

- Exists: validation suite (141 stories specced, play outlines, RF jsdom mocks,
  FakeAudioContext static, pointer patterns); SB 10.5.7 + addon-vitest + playwright
  browser mode installed.
- Missing: scripted agent event fixtures (JSONL → fake runtime streaming into
  stories), token-by-token transcript simulation w/ controllable fake streams,
  time-varying audio level curves (breathing states need amplitude changes, static
  FakeAudioContext can't drive VOX-03 assertions), settle-then-assert patterns for
  streaming UI, awaiting N events in play fns.
- Closure: `storybook-agentic-e2e` skill (research-backed).

### B2. Animation/glow visual regression — GAP (same skill)

- Exists: chromatic addon installed; LGT token table + perf budget.
- Missing: chromatic strategy for animated components — disableAnimations vs
  stable-state snapshots, play-to-state-then-capture, freezing CSS animations,
  breathing-state framing (capture at rest vs peak amplitude), reduced-motion
  variants as canonical snapshots.
- Closure: `storybook-agentic-e2e` skill §visual-regression.

### B3. RAF/timer control in browser mode — GAP (same skill)

- Exists: RAF call-count pattern noted in earlier research.
- Missing: vi.useFakeTimers compatibility w/ playwright provider (known issues),
  rAF control patterns, flake avoidance for physics-settle assertions (GRPC-09
  reheat/settle/sleep needs deterministic settle).
- Closure: `storybook-agentic-e2e` skill §timing.

### B4. Requirements regression harness — GAP (skill: `requirements-regression`)

- Exists: coverage-manifest.tsv (141 rows + status), check-coverage.sh (GREEN),
  ADR-0016 (1:1 case↔story↔test naming).
- Missing: CI gate wiring (manifest status must be `ready`/`pass` not `todo` for
  shipped slices), drift detection (GWT case edited/deleted → which stories/tests
  flagged — git-diff-driven), status transition rules (todo→ready→pass→fail),
  per-slice coverage report for plan suites to reference, failing-test triage
  protocol (12 pre-existing failures block "all green" claims — need quarantine
  list so new work verifiable).
- Closure: `requirements-regression` skill + extend check-coverage.sh (flagged,
  not built now — skill documents procedure).

## Gap Category C — Code Adaptation Workflow (code-rip refs exist; process missing)

### C1. OSS→React adaptation protocol — GAP (skill: `oss-code-adaptation`)

- Exists: slice 03 code-rip table (edge-aura, 3d-force-graph bloom, graphier,
  border-beam, deskreen, reposkein), perf scaling table.
- Missing: license quick-check + attribution requirements, vendor-vs-port decision,
  vanilla-canvas→React-hook wrapper pattern (effect lifecycle, StrictMode
  double-mount, rAF ownership), provenance headers (source URL + SHA),
  third-party-notices file, staging location.
- Closure: `oss-code-adaptation` skill (research-backed).

## Gap Category D — Requirements Coverage Gaps (owned deferrals + thin spots)

### D1. Fish-eye dual-scale — DEFERRED, UNOWNED CASES

- Exists: user vision (core aim — whole-graph awareness while zoomed); research
  survey (3 candidates: minimap / lens transform / border-ghost); slice 11 note
  "fish-eye remains deferred", NAV-05 minimap = interim.
- Missing: GWT cases for lens/border-ghost tiers (zero today — intentional), perf
  budget for continuous-zoom LOD, research on existing fisheye implementations
  (d3-fisheye lineage, sigma.js lens plugins).
- Closure: when activated — new slice or NAV extension + LGT LOD cases + research
  pass. Tracked here so it cannot be silently forgotten.

### D2. 3D tier — DEFERRED, PARTIAL REFS

- Exists: user vision (eventual 3D bubbles); react-force-graph-3d + bloom refs.
- Missing: cases, tier-trigger criteria (node count?), DOM-overlay-vs-canvas
  decision for popovers in 3D.
- Closure: ADR when 2D proves out (ADR-0015 tier 2 exists for bloom only).

### D3. Memory layer (Neo4j) — PARTIAL

- Exists: ADR-0007, AGENTS.md §16 (in-mem cache + Neo4j edges, FS wins conflicts),
  neo4j skill.
- Missing: sync protocol cases (cache invalidation on external FS edit), query
  patterns for graph-derived UI (backlinks à la charkoal).
- Closure: cases when memory layer slice activates.

### D4. A11y beyond reduced-motion — GAP

- Exists: LGT-07 reduced-motion mandatory; a11y addon test='error' convention.
- Missing: keyboard navigation cases for voice-first UI (all interactions voice OR
  keyboard reachable? VOX-09/10 covers input keys only), focus management cases
  (modal EXP, tooltips pinning, rail), screen-reader labels for glow states (state
  must not be color/motion-only — VOX-02/03 need aria equivalents).
- Closure: a11y pass adding cases to slices 01/02/03/04 — flagged for next
  requirements revision, NOT silently dropped.

### D5. Open questions register — EXISTS, needs ownership

- requirements-summary decision table (8 items) + per-slice open questions +
  user-flows open questions (7). No single owner/triage view.
- Closure: gap doc references them; plan suite must consume per-slice.

## Gap Category E — Pre-existing Debt (blocks "all green" verification)

- 12 failing tests (fsGraphLoader ×7, NodeDetailPanel, Node, GraphSim act() ×3) —
  pre-date all doc work.
- LSP errors: GraphSim.tsx ×3 (NodeData casts), .storybook/preview.tsx (css import).
- styled-components migration uncommitted portions (from handoff note — verify).
- Closure: NOT fixed here (out of scope, flagged). requirements-regression skill
  mandates quarantine list so new-slice verification isn't blocked by legacy red.

## Skills Index (new, in `vision-graph-ui/.opencode/skills/`)

| Skill | Closes | Research-dep | Status |
|---|---|---|---|
| `local-stt` | A1 | yes (bg_ad87e845) | ✅ written |
| `agent-runtime-bridge` | A2 | no (slice 05/06 + survey) | ✅ written |
| `fs-graph-sync` | A3+A4 | no (ADR-0011/AGENTS §16) | ✅ written |
| `storybook-agentic-e2e` | B1+B2+B3 | yes (bg_ec82e72f) | ✅ written |
| `requirements-regression` | B4 | no (manifest/ADR-0016) | ✅ written |
| `oss-code-adaptation` | C1 | yes (bg_901ac47a) | ✅ written |

Research sources (librarian reports, 2026-08-14): OSS adaptation (licenses,
vendor-vs-port, StrictMode patterns, VS Code/opensquilla notice precedents),
agentic E2E (Lime AgentUiFixture replay, MSW 2.x sse(), chromatic
pauseAnimationAtEnd + isChromatic, vitest #10058 timer fixes, mui-x rAF
precedent, scripted analyser curves), local STT (browser-whisper stack,
transformers.js v3 WebGPU/q4, Web Speech API = cloud — rejected, sidecars,
one-AudioContext split, VAD, failure UX). Key research-driven decisions encoded:
Web Speech API FORBIDDEN (cloud), provenance headers = license-mandated
exception to no-comments rule, Vitest addon over test-runner, engine behind
interface.

All six referenced from this doc; implementation plan suites cite skill names +
this gap doc. Skills follow existing SKILL.md format (frontmatter + sections),
registered in AGENTS.md §8/§10 tables (edit pending user approval — AGENTS.md
changes require `chore(agents):` commit per §9).

## Non-Gaps (verified covered — do NOT re-plan)

- Interaction conventions: slices 10/11 + validation cover thresholds, cancels,
  selection, edges, zoom.
- Glow/breathing implementation refs: slice 03 table + ADR-0015 tiers.
- GWT provenance + dedup: momus-approved 2 cycles.
- Coverage manifest integrity: check-coverage.sh GREEN (141/141).
