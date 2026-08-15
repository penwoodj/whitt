---
name: storybook-agentic-e2e
description: >
  Live agentic system testing through Storybook: JSONL agent-event fixtures,
  token-streaming fakes, scripted AnalyserNode volume curves, chromatic animation
  strategy, Vitest browser-mode timer/RAF control. Use when implementing
  slice-NN.validation.md stories, streaming UI tests, or breathing/glow visual
  regression. Extends existing infra (SB 10.5.7 + addon-vitest + playwright).
---

## When to Use

- Implementing any validation spec story (`docs/feature-requirements/validation/`)
- Testing streaming agent UI (slice 05/06: events → busy-set → glow)
- Testing voice-reactive animation (slice 03: breathing w/ volume curves)
- Chromatic snapshots of animated/glowing components
- Any play fn needing deterministic timing (physics settle, rAF loops)

## 1. Scripted Agent Fixtures (JSONL event scripts)

One `.jsonl` per scenario in slice's `fixtures/` dir. Schema aligns w/
`agent-runtime-bridge` skill (AgentEvt) + Lime `AgentUiFixture` shape:

```jsonl
{"t":0.00,"kind":"run-start","runId":"r1","nodeId":"n1","workflow":"draft"}
{"t":0.10,"kind":"step-start","runId":"r1","stepId":"s1","title":"Parsing prompt"}
{"t":0.90,"kind":"step-done","runId":"r1","stepId":"s1"}
{"t":1.00,"kind":"file-write","runId":"r1","path":"topic-a.md","actor":"agent"}
{"t":1.05,"kind":"graph-mutation","runId":"r1","mutation":{"op":"spawn","parentNodeId":"n1","newNodeId":"n2","title":"Sub topic"}}
{"t":1.20,"kind":"run-done","runId":"r1","nodeId":"n1","status":"done"}
```

Fixture harness (shared, `features/agent-bridge/fixtures/`):

```typescript
const playAgentScript = async (bus: EvtBus, script: AgentEvt[], speed = 1) => {
  for (const evt of script) {
    await sleep((evt.t - prevT) * 1000 / speed)
    bus.emit(evt)
  }
}
```

- Stories inject bus + choose fixture by name; play fn awaits derived UI state
  (busy badge → step title → done glow), NEVER raw event counts alone.
- Expectation table per fixture (Lime pattern): `{ status, badgeStates, spawnCount }`
  asserted after replay completes.

## 2. Token Streaming Fakes (async generators)

```typescript
async function* fakeTokenStream(tokens: string[], msPerTok = 30) {
  for (const tok of tokens) { await sleep(msPerTok); yield tok }
}
```

- Play: start stream, `await waitFor(() => expect(input).toHaveTextContent(/world/))`
  after N tokens; assert final full text on completion.
- Cancellation case: generator checks `signal.aborted` — test abort mid-stream,
  assert partial preserved (VOXC-02 semantics).

## 3. Audio Volume Curves (breathing tests)

Fake analyser w/ scripted time-varying data (ElevenLabs useAudioVolume pattern):

```typescript
const scriptedAnalyser = (curve: number[]) => ({
  fftSize: 256, frequencyBinCount: 128,
  getByteFrequencyData: (arr: Uint8Array) => { arr.fill(curve[i++ % curve.length]) },
})
```

- Advance via rAF ticks (see §5), assert derived level state — high curve →
  `isBreathing` class present; zero curve → still (LGT-03).
- Assert CSS `animationName`/class, NOT pixel amplitude (flaky).

## 4. Chromatic + Animations

- Global: `parameters.chromatic.pauseAnimationAtEnd = true` (preview.ts).
- Story-level `chromatic: { delay: 300 }` to let entrance settle before capture.
- `body.isChromatic` CSS hooks: disable ambient loops, keep single frame:

```css
body.isChromatic .breath { animation: none; }
```

- Snapshot STRATEGY: canonical states = rest (idle) + peak (`.breathing-on` class
  forced via story args), never mid-loop random frame.
- JS animations: `document.getAnimations().forEach(a => a.pause())` in play
  before assertions when needed.
- Reduced-motion variant story (LGT-07) = free deterministic snapshot.

## 5. Timers + rAF in Browser Mode (known traps)

- Fake timers + `userEvent` HANG (vitest #10058). Fixes, in preference order:
  1. `expect.element(...)` auto-advance assertions
  2. `vi.advanceTimersByTimeAsync(ms)` before interactions
  3. `vi.setTimerTickMode('nextTimerAsync')` for whole test
- rAF: `vi.useFakeTimers({ toFake: ['requestAnimationFrame'] })` +
  `vi.advanceTimersToNextFrame()` (mui-x rafThrottle precedent).
- Physics settle (GRPC-09): drive sim N fixed ticks manually, assert positions
  deterministic — never wall-clock sleep on real sim.

## 6. Transport Mocks

- EventSource/SSE: MSW 2.x `sse()` handler (`import { sse } from 'msw'`) —
  browser-mode compatible.
- WebSocket: inject `EvtBus` port directly (skip transport in component tests;
  transport covered once in agent-bridge integration story).
- Same fixture feeds both: story (in-memory bus) + future E2E (MSW SSE).

## 7. Runner

Vitest addon (`--project=storybook`), NOT legacy test-runner (superseded; 5-10×
slower, no visual tests). CI: `vitest --project=storybook` headless chromium.
a11y: `parameters.a11y.test = 'error'` runs post-play automatically.

## MUST NOT

- Assert raw event arrays (assert DERIVED UI state)
- Sleep-on-real-physics for settle assertions
- Snapshot mid-animation without forced state
- Mix fake timers + userEvent without tick-mode fix
- Build transport-specific fixtures (bus-injected only, transport tested once)

## References

- Validation specs: `docs/feature-requirements/validation/slice-*.validation.md`
- Event schema: `.opencode/skills/agent-runtime-bridge/SKILL.md`
- Precedents: limecloud/lime `agent-ui-contracts` fixtures+replay; acp-mock
  replayRuntimeEvents; mswjs.io/docs/sse; chromatic.com/docs/animations;
  vitest issue #10058; mui-x rafThrottle tests
