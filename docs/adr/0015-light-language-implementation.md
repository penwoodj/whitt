# ADR-0015: Light-Language Implementation Strategy

Date: 2026-08-14
Status: proposed

## Context

"Everything is light" — bubbles, bars, halos, group rings share one visual grammar
(slice 03). Rendering substrate decision matters: repo nodes are DOM (React Flow custom
nodes, styled-components), but graph scale (100+ bubbles) + future canvas/3D tiers pull
toward canvas rendering. Research (2026-08-14): CSS keyframes scale to ~1000 DOM nodes
(transform/opacity only); canvas 2D glow needs sprite caching (per-frame
`createRadialGradient` dies ~1k draws); WebGL bloom (UnrealBloomPass) is the 10k+ tier.

## Decision

1. **Tier 0 (now, DOM)**: light effects via styled-components keyframes extending
   existing `theme.glow.*` tokens + `keyframes.ts` (pulseGlow, recordingPulse).
   Constraints: animate transform/opacity only; state→glow via single token table (LGT-01).
   Reference implementations: border-beam pulse modes, deskreen pulse keyframes,
   gradient-components breathe, mantine-scene.
2. **Tier 1 (canvas bubbles, when perf demands)**: pre-rendered radial-gradient sprites
   (one per state), `drawImage`-scaled — starfield/spritesheet pattern; edge-aura
   zero-alloc discipline as engineering reference.
3. **Tier 2 (3D tier, deferred)**: UnrealBloomPass via 3d-force-graph
   `postProcessingComposer()`; adaptive resolution per graphier if node counts grow.
4. **Volume breathing** (all tiers): Web Audio AnalyserNode → RMS level → smoothed
   scale mapping (LGT-02). Reference wiring: omi `audioCapture.ts`, AutoGPT
   `useAudioBars.ts` (fftSize 512, smoothing 0.45), unsloth `dictation-level.ts`.
5. **Reduced motion**: static glow + textual badge under `prefers-reduced-motion` (LGT-07)
   — mandatory in every tier.

## Consequences

- Tiers share the LGT-01 state→glow token table; only the rendering backend changes.
- DOM tier caps visual complexity at what CSS does well (glow rings, scale, opacity) —
  no per-pixel effects until Tier 1.
- Analyser wiring is tier-independent (mic level is mic level).
- Perf budget case (LGT-06) is enforceable in Storybook via long-frame assertions on a
  100-bubble story.
