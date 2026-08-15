# E1 — STT Engine + Audio Feed Implementation Plan

> Executes: Enabler E1 (unblocks S02, S03)
> Validation spec: docs/feature-requirements/validation/E1.validation.md
> Status: NOT-STARTED
> Depends on: nothing (first enabler, parallel w/ E4)

## 1. Objective

Deliver local STT engine runtime + audio feed infrastructure. One AudioContext @16kHz splits to AnalyserNode (S03 breathing) + AudioWorklet chunks (STT). browser-whisper integration with OPFS model cache, capability detection, interim/final semantics, failure UX states. Unblocks S02 voice capture + S03 light language.

## 2. Inputs (READ FIRST — in this order)

| Input | Path |
|---|---|
| Enabler spec | `vision-graph-ui/.opencode/skills/local-stt/SKILL.md` |
| Dependent slice | `docs/feature-requirements/slices/02-voice-capture.md` |
| Validation spec | `docs/feature-requirements/validation/E1.validation.md` |
| Skills to load | `modern-react`, `local-stt`, `oss-code-adaptation`, `storybook-agentic-e2e`, `test-driven-development` |
| Code-rip sources | `.repos/browser-whisper/src/index.ts`, `.repos/omi/web/app/src/lib/audioCapture.ts` |
| Reference-only | `.repos/whisper-web/src/worker.js` (pipeline pattern) |

## 3. File plan (REAL paths)

| Action | Path | Notes |
|---|---|---|
| create | `vision-graph-ui/src/shared/stt/engine.ts` | createEngine, capability detect, OPFS cache, browser-whisper wrapper |
| create | `vision-graph-ui/src/shared/stt/types.ts` | Engine events, controls, states, error codes |
| create | `vision-graph-ui/src/shared/audio/context.ts` | AudioContext singleton, resumable, StrictMode-safe destroy |
| create | `vision-graph-ui/src/shared/audio/analyser.ts` | AnalyserNode fftSize 256, level calculation, split feed |
| create | `vision-graph-ui/src/shared/audio/worklet.ts` | AudioWorklet processor, 16k Float32 chunks for STT |
| create | `vision-graph-ui/src/features/voice-capture/hooks/useVoiceLevel.ts` | Level hook stub (S03 completes) |
| create | `vision-graph-ui/src/features/voice-capture/hooks/useStt.ts` | STT hook, interim-ghost/final-append events |
| create | `vision-graph-ui/src/features/voice-capture/fake/FakeSttEngine.ts` | Fake engine for stories (scripted curves) |
| create | `vision-graph-ui/src/features/voice-capture/fake/FakeAnalyser.ts` | Fake analyser for stories (scripted curves) |
| create | `vision-graph-ui/src/features/voice-capture/fake/index.ts` | Barrel export of fakes |
| create | `vision-graph-ui/src/features/voice-capture/stories.stories.tsx` | Storybook stories (validation spec) |
| create | `vision-graph-ui/src/features/voice-capture/stories.test.tsx` | Storybook tests (storybook-agentic-e2e) |
| rip→port | `vision-graph-ui/src/shared/stt/browser-whisper-adapter.ts` FROM `.repos/browser-whisper/src/index.ts` | API surface port, provenance header |
| rip→port | `vision-graph-ui/src/shared/audio/analyser-pattern.ts` FROM `.repos/omi/web/app/src/lib/audioCapture.ts` | getUserMedia → createMediaStreamSource → AnalyserNode fftSize 256 |

## 4. Question-cycle gate (AGENTS.md §1 Stage 1 — MANDATORY before tests)

Ask user (2-3 questions max, `question` tool):
1. STT model default: whisper-tiny (~120MB, 10-15× RT) or whisper-base (~210MB, 5-8× RT)?
   - A) tiny (fast first-run, lower accuracy)
   - B) base (better accuracy, heavier download)
2. VAD (@ricky0123/vad-web) on by default?
   - A) on (auto-endpointing, +2MB model)
   - B) off (manual toggle only)
Record answers in this file, then never re-ask.

## 5. Tasks (incremental, TDD, each ends green+committed)

### Task 5.1 — Audio context + analyser feed (unblocks S03 breathing)
- **Gherkin first**: `vision-graph-ui/src/features/voice-capture/audio-feed.feature`
- **Red**: `src/shared/audio/context.test.ts`, `src/shared/audio/analyser.test.ts` — scenarios: context resumable, StrictMode double-mount, analyser level calc
- **Green**: implement AudioContext singleton, resumable via user gesture, StrictMode-safe destroy, AnalyserNode fftSize 256, level calculation
- **Rip**: source `.repos/omi/web/app/src/lib/audioCapture.ts` → `src/shared/audio/analyser-pattern.ts` via `oss-code-adaptation`
- **Story**: `AudioContext singleton` + `AnalyserNode level` in `stories.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/shared/audio/*.test.ts && npm run build-storybook` — all exit 0
- **Commit**: `feat(audio): AudioContext singleton + AnalyserNode feed (E1-5.1)`

### Task 5.2 — Fake engine + fake analyser (unblocks S02 stories)
- **Gherkin first**: `vision-graph-ui/src/features/voice-capture/fake-engine.feature`
- **Red**: `src/features/voice-capture/fake/FakeSttEngine.test.ts`, `src/features/voice-capture/fake/FakeAnalyser.test.ts` — scenarios: scripted curves, interim/final events, level curves
- **Green**: implement FakeSttEngine (scripted text curves), FakeAnalyser (scripted level curves), both follow real interface
- **Story**: `FakeSTT scripted flow` + `FakeAnalyser breathing curve` in `stories.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/features/voice-capture/fake/*.test.ts && npm run build-storybook` — all exit 0
- **Commit**: `feat(stt): Fake engine + fake analyser for stories (E1-5.2)`

### Task 5.3 — useVoiceLevel + useStt hooks (real engine interface)
- **Gherkin first**: `vision-graph-ui/src/features/voice-capture/hooks.feature`
- **Red**: `src/features/voice-capture/hooks/useVoiceLevel.test.ts`, `src/features/voice-capture/hooks/useStt.test.ts` — scenarios: level stream, interim ghost text, final append, start/stop controls
- **Green**: implement useVoiceLevel (level 0-1 stream), useStt (interim-ghost/final-append events, start/stop controls), both refs/closures not state
- **Story**: `VoiceLevel hook` + `Stt hook interim/final` in `stories.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/features/voice-capture/hooks/*.test.ts && npm run build-storybook` — all exit 0
- **Commit**: `feat(voice): useVoiceLevel + useStt hooks (E1-5.3)`

### Task 5.4 — Engine wrapper + capability detect (browser-whisper port)
- **Gherkin first**: `vision-graph-ui/src/shared/stt/engine.feature`
- **Red**: `src/shared/stt/engine.test.ts` — scenarios: capability detect (WebGPU, mic, secure context), OPFS cache, model load
- **Green**: implement createEngine (browser-whisper wrapper), capability detect (navigator.gpu, getUserMedia, isSecureContext), OPFS model cache
- **Rip**: source `.repos/browser-whisper/src/index.ts` → `src/shared/stt/browser-whisper-adapter.ts` via `oss-code-adaptation` (API surface: BrowserWhisper, TranscribeStream, MODELS, error classes)
- **Story**: `Engine capability detect` + `Model load progress` in `stories.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/shared/stt/*.test.ts && npm run build-storybook` — all exit 0
- **Commit**: `feat(stt): Engine wrapper + capability detect (E1-5.4)`

### Task 5.5 — AudioWorklet integration (16k chunks to STT)
- **Gherkin first**: `vision-graph-ui/src/shared/audio/worklet.feature`
- **Red**: `src/shared/audio/worklet.test.ts` — scenarios: 16k Float32 chunks, split feed from source
- **Green**: implement AudioWorklet processor, 16kHz Float32Array chunks, connect to source after analyser split
- **Story**: `AudioWorklet 16k chunks` in `stories.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/shared/audio/*.test.ts && npm run build-storybook` — all exit 0
- **Commit**: `feat(audio): AudioWorklet 16k chunks (E1-5.5)`

### Task 5.6 — Failure UX states (permission, no mic, insecure, no WebGPU, OOM)
- **Gherkin first**: `vision-graph-ui/src/features/voice-capture/failure-ux.feature`
- **Red**: `src/features/voice-capture/failure.test.ts` — scenarios: permission denied, no mic, insecure context, no WebGPU, engine OOM
- **Green**: implement failure states in useStt, error events, preserve partial finals on crash
- **Story**: `Permission denied` + `No WebGPU fallback` + `Engine OOM recovery` in `stories.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/features/voice-capture/failure.test.ts && npm run build-storybook` — all exit 0
- **Commit**: `feat(stt): Failure UX states (E1-5.6)`

### Task 5.7 — Real browser-whisper integration (deferred-flagged: heavy, needs WebGPU device)
- **Gherkin first**: `vision-graph-ui/src/features/voice-capture/real-engine.feature`
- **Red**: `src/features/voice-capture/real.test.ts` — scenarios: real transcribe stream, interim/final semantics, model switch
- **Green**: wire useStt to real browser-whisper via engine wrapper, test with WebGPU device or fallback WASM
- **Story**: `Real browser-whisper transcribe` in `stories.stories.tsx`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run src/features/voice-capture/real.test.ts && npm run build-storybook` — all exit 0
- **Commit**: `feat(stt): Real browser-whisper integration (E1-5.7)`

### Task 5.8 — Storybook validation (storybook-agentic-e2e audio mocks)
- **Gherkin first**: (reuse existing `.feature` files)
- **Red**: `src/features/voice-capture/stories.test.tsx` — scenarios: scripted curves via storybook-agentic-e2e
- **Green**: implement stories in `stories.stories.tsx` using fake engine + fake analyser, mock audio curves
- **Story**: all E1 validation stories from `E1.validation.md`
- **Verify**: `cd vision-graph-ui && npx tsc --noEmit && npx vitest run --project=storybook -t "E1" && npm run build-storybook` — all exit 0
- **Commit**: `feat(stt): Storybook validation complete (E1-5.8)`

## 6. Skill + agent routing (per task)

| Task | Skills to load | Delegate to |
|---|---|---|
| 5.1 | `modern-react`, `oss-code-adaptation` | `category="deep"` |
| 5.2 | `modern-react`, `storybook-agentic-e2e` | `category="quick"` |
| 5.3 | `modern-react`, `test-driven-development` | `category="deep"` |
| 5.4 | `modern-react`, `oss-code-adaptation`, `local-stt` | `category="deep"` |
| 5.5 | `modern-react` | `category="deep"` |
| 5.6 | `modern-react`, `test-driven-development` | `category="deep"` |
| 5.7 | `modern-react`, `local-stt`, `test-driven-development` | `category="deep"` (deferred-flagged) |
| 5.8 | `storybook-agentic-e2e`, `test-driven-development` | `category="visual-engineering"` |

## 7. Live-system validation gate (E1 DONE only when ALL pass)

1. Run validation stories: `npx vitest run --project=storybook -t "E1"`
2. Every story in `E1.validation.md` → play fn asserts pass
3. Manual review: user eyeballs stories in Storybook UI (serve: `npm run storybook`)
4. Verify fake engine + fake analyser scripted curves work
5. Verify real browser-whisper integration with WebGPU or WASM fallback

## 8. Retry loop (failure = iterate, NEVER skip)

```
attempt → fail → read actual log lines (AGENTS.md §2)
  → hypothesis → minimal fix → re-run story
  → fail again? ×2 → load systematic-debugging skill
  → fail ×3 → escalate: oracle subagent w/ full ctx → fix → re-run
  → NEVER: delete test, loosen assert, extend timeout >2×, mark skip w/o user OK
```

## 9. Out of scope / guards

- Web Speech API (FORBIDDEN per local-stt skill — not local)
- Second AudioContext for level metering (MUST split ONE source)
- Committing interim text to prompt state (interim = ghost only)
- Model default selection (tiny vs base) — question-gate
- VAD on/off default — question-gate
- VAD implementation itself (deferred to dependent slice)
