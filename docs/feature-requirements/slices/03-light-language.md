# Slice 03 — Light Language Visual System

> Cross-cutting vertical slice: the ONE visual grammar — glow, breathing, halo, light bar.
> User's emphasis: glow + breathing elements "really really well documented" w/ code references.
> Owns visual states; triggers owned by other slices (recording: 02, executing: 05, grouping: 10).
> Repo already has: `theme.glow.*` tokens (primary, recordingPulse, done, idle),
> `keyframes.ts` (pulseGlow, recordingPulse) — this slice systematizes them.

## Positive Requirements

1. **PR-03-1** Light = state. Idle / recording / running / done each map to one glow treatment
   (color + intensity), reused across ball, bar, halo, group ring.
2. **PR-03-2** Breathing = live audio in. Breathing amplitude follows mic RMS level; silence
   = stillness (EXE-11 stillness rule generalized).
3. **PR-03-3** Halo = entity boundary. Node expanded (EXP-02) and group formed (GRP-08)
   both express "this is one thing" via halo.
4. **PR-03-4** All light animations animate `transform`/`opacity` (GPU) — never layout props.
5. **PR-03-5** `prefers-reduced-motion: reduce` replaces breathing/pulse w/ static state badges.
6. **PR-03-6** Glow rendering stays within frame budget at 100+ nodes (sprite-cached, not
   per-frame gradients).

## Inherited Cases (visual-state subset; full GWT + Why in brainstorm suite)

| ID | Summary | From |
|---|---|---|
| VOX-02 | Recording color shift | `../../broader-vision/requirements/02-voice-input-tooltip.md` |
| VOX-03 | Volume breathing (cadence + amplitude) | same |
| EXP-02 | Ball → halo when expanded | `03-expanded-node-modal.md` |
| EXP-04 | Bar of light, soft corners/edges | same |
| EXP-08 | Bar breathes w/ voice, tooltip-open or not | same |
| EXE-11 | Edges breathe while executing, still when idle | `04-agentic-execution-area.md` |
| EXE-12 | Border animations eventual (shape > ball glow) | same |
| EXE-14 | Morphing icon loader (Rovo/Claude style) | same |
| GRP-08 | Grouping halo | `09-canvas-grouping-manipulation.md` |

## New Cases

### LGT-01 State→glow mapping table is single-sourced

```gherkin
Given any light element (ball, bar, halo, group ring)
When its entity state changes (idle/recording/running/done)
Then glow (color, blur radius, intensity) resolves from one shared token table
And no element hand-rolls its own state colors
```

**Why** `[I]`: PR-03-1 enforcement — vision says ball/bar/halo are ONE language;
a token table (extending existing `theme.glow.*`) is the mechanical guarantee.
Reference: repo `src/shared/theme.ts` glow tokens already exist — extend, don't fork.

### LGT-02 Volume → breath amplitude curve

```gherkin
Given recording w/ mic level L (0..1 RMS)
Then breath scale = idle + L·k (k ≈ 0.08 visible-but-calm)
And mapping is smoothed (attack/release ≈ 60ms/200ms) to avoid jitter
And L below noise gate (~0.02) renders fully still
```

**Why** `[C]`: audio-visualizer convention (attack/release smoothing, noise gates);
AutoGPT `useAudioBars` (smoothing 0.45) + openai-cookbook wavtools implement exactly
this shape. Calm mapping preserves "soft breathing" aesthetic from source.

### LGT-03 Silence stillness

```gherkin
Given recording active but user silent
Then element settles to idle scale (no oscillation)
And state badge/color still says recording
```

**Why** `[S]`: "it stays still as things are not occurring" (EXE-11) generalized to
voice: motion means signal, stillness means quiet — motion semantics stay honest.

### LGT-04 Morph loader cadence

```gherkin
Given agent executing
Then loader icon morphs to next icon every ~1.2s (phase-step feel)
And morph uses transform/opacity crossfade (no reflow)
And icon set maps to agent phases (read/write/move/group/etc.)
```

**Why** `[C]`: Rovo/Claude-style loaders step icons on a slow cadence (research:
border-beam/mantine-scene timing patterns); phase-mapped icons narrate work kind.

### LGT-05 Halo geometry

```gherkin
Given node expanded OR group formed
Then halo = radial glow ring hugging the container's soft-corner rect
And halo inherits entity state glow (LGT-01)
And halo breathes ONLY if that entity is live (recording/executing)
```

**Why** `[I]`: unifies EXP-02 + GRP-08 into one component w/ two triggers —
dedup of the halo concept (user's dedup requirement).

### LGT-06 Glow performance budget

```gherkin
Given 100+ file bubbles visible
Then per-frame glow cost stays O(1) per node via pre-rendered gradient sprites
(one sprite per state, scaled on draw)
And no per-frame createRadialGradient calls
And 60fps on mid-range hardware (frame time < 16ms)
```

**Why** `[C]`: starfield/spritesheet pattern (research: SO 18662930 — 1500 live
gradients kills frame rate; cached sprites don't). Budget makes "graph of lights"
survive real graphs. edge-aura proves the tiled/zero-alloc discipline for 2D.

### LGT-07 Reduced-motion fallback

```gherkin
Given OS prefers-reduced-motion
Then breathing/morph/pulse animations render as static glow + textual state badge
And no essential information is lost (state still legible)
```

**Why** `[C]`: WCAG 2.3.3 / a11y convention; motion carries state here, so static
equivalent is mandatory, not optional.

### LGT-08 Light bar rest state

```gherkin
Given expanded node idle (not recording, not executing)
Then bar of light renders at rest: present, soft, unanimated
And brightens on hover (affordance) before tooltip opens
```

**Why** `[I]`: completes bar lifecycle (source defines breathing-while-recording +
still-while-idle for status bar; bar of light needs explicit rest affordance).

## Implementation References (code-rip targets)

| Feature | Source | Path | Technique |
|---|---|---|---|
| Canvas glow engine | [edge-aura](https://github.com/takuyajodai/edge-aura) | `src/engine.ts` | zero-alloc tiled glow, Gaussian core + rational bloom tail, Bayer dither |
| Sprite-cached radial glow | starfield pattern (SO 18662930) | — | init-only `createRadialGradient` → offscreen canvas → `drawImage` scale |
| Reusable radial sprite builder | [reposkein](https://github.com/reposkein/reposkein) | `viz/src/scene/sprites.ts` | cached `THREE.CanvasTexture` from gradient stops (3D tier later) |
| WebGL bloom (3D tier) | [3d-force-graph](https://github.com/vasturiano/3d-force-graph) | `example/bloom-effect/index.html` | `UnrealBloomPass` via `postProcessingComposer()` |
| Adaptive bloom at scale | [graphier](https://github.com/CocoRoF/graphier) | `src/core/scene-setup.ts` | resolution 1.5–3× by node count; InstancedMesh 1-draw-call nodes |
| Breathing border glow (DOM) | [border-beam](https://github.com/Jakubantalik/border-beam) | component | `pulse-inner`/`pulse-outside` modes, GPU `@property` keyframes |
| Breathe-mode gradient bar | [gradient-components](https://github.com/alexpuliatti/gradient-components) | `GradientLine` | `animation="breathe"` + glow prop |
| Ambient glow blobs | [mantine-scene](https://github.com/gfazioli/mantine-scene) | `Scene.Glow/Beams` | float/pulse/breathe variants, transform/opacity only |
| Box-shadow pulse keyframes | [deskreen](https://github.com/pavlobu/deskreen) | `MainView/index.css` | scale 0.95→1 + expanding shadow ring (`pulse1`) |
| Volume metering | [omi](https://github.com/BasedHardware/omi) `audioCapture.ts`; [AutoGPT](https://github.com/Significant-Gravitas/AutoGPT) `useAudioBars.ts`; [unsloth](https://github.com/unslothai/unsloth) `dictation-level.ts` | — | AnalyserNode fftSize 256–512, smoothing 0.45, RAF tick → level |
| RMS/level math | [openai-cookbook](https://github.com/openai/openai-cookbook) | `wavtools/lib/analysis/audio_analysis.js` | high-res analysis reference |

## Perf Scaling Table (research-derived)

| Technique | Scales to | Bottleneck | Fix |
|---|---|---|---|
| Live radial gradients | ~1k draws | gradient creation/frame | sprite cache (LGT-06) |
| CSS keyframes | 1000+ DOM nodes | layout thrash | transform/opacity only (PR-03-4) |
| UnrealBloom (3D tier) | 10k+ nodes | post passes | adaptive resolution (graphier) |
| AnalyserNode | 1 stream | FFT | single analyser, fftSize ≤512 |

## Open Questions

- Done-state glow decay duration (how long after agent finishes does done-glow linger?) — propose 2s fade to idle; confirm visually in Storybook.
- 2D canvas vs DOM bubbles: repo Node.tsx is DOM (React Flow node) — sprite glow applies when canvas tier arrives (fish-eye/3D); DOM tier uses border-beam/deskreen patterns. Bridge documented in ADR-0015.
