# C0 — Reference Repo Map (LOCAL, VERIFIED)

> Local clones at `.repos/` (gitignored, shallow/sparse). Every path below VERIFIED
> to exist on disk 2026-08-14. Plans MUST use these exact paths for code-rip sources.
> Re-clone: `git clone --depth 1 <url>` (small) or `--filter=blob:none --sparse` + `git sparse-checkout set <dir>` (giants).

## Rip-able (permissive license)

| Repo | Local path | Verified key files | Rip for | License |
|---|---|---|---|---|
| edge-aura | `.repos/edge-aura/` | `src/engine.ts` | tiled zero-alloc canvas glow math (Gaussian core, rational bloom, Bayer dither) → slice 03 tier-1 sprite engine | MIT |
| 3d-force-graph | `.repos/3d-force-graph/` | `example/bloom-effect/index.html` | UnrealBloomPass wiring via postProcessingComposer → slice 03 tier-2 + D2 3D tier | MIT |
| graphier | `.repos/graphier/` | `src/core/scene-setup.ts`, `src/core/NetworkGraph3D.tsx` | adaptive bloom resolution (1.5-3× by node count), InstancedMesh 1-draw-call pattern → slice 03 perf tier | MIT |
| border-beam | `.repos/border-beam/` | `packages/border-beam/src/BorderBeam.tsx` (+ `PulseBeam.tsx` in react-native port: `packages/border-beam/ports/react-native/border-beam-native/src/PulseBeam.tsx`) | pulse-inner/pulse-outside breathing border glow, GPU @property keyframes → slice 03 bar-of-light + status-card edges | MIT |
| mantine-scene | `.repos/mantine-scene/` | `package/src/SceneGlow/SceneGlow.tsx`, `package/src/SceneBeams/SceneBeams.tsx` | float/pulse/breathe glow blob variants, GPU transform/opacity-only animations → slice 03 | MIT |
| reposkein | `.repos/reposkein/` | `viz/src/scene/sprites.ts` | cached radial-gradient sprite builder (init-only createRadialGradient → canvas → drawImage) → slice 03 sprite cache | Apache-2.0 |
| deskreen | `.repos/deskreen/` (sparse `src/client-viewer`) | `src/client-viewer/src/containers/MainView/index.css` | `pulse1` keyframes: scale(0.95→1) + expanding box-shadow ring → slice 03 halo/breathing | AGPL-3.0 ⚠ |
| whisper-web | `.repos/whisper-web/` | `src/App.tsx`, `src/Worker.ts` (pipeline) | transformers.js ASR pipeline + worker split pattern → E1 STT | MIT |
| browser-whisper | `.repos/browser-whisper/` | `src/index.ts` | 2-worker arch (decoder+inference), WebGPU+q4 hybrid, OPFS cache, AsyncIterable segments → E1 STT (PRIMARY pick per local-stt skill) | MIT |
| omi | `.repos/omi/` (sparse `web/app/src/lib`) | `web/app/src/lib/audioCapture.ts` | getUserMedia → createMediaStreamSource → AnalyserNode fftSize 256 level metering → E1 audio feed | MIT |
| autogpt | `.repos/autogpt/` (sparse BrainDumpStep) | `autogpt_platform/frontend/src/app/(no-navbar)/onboarding/steps/BrainDumpStep/components/useAudioBars.ts` | analyser fftSize 512 + smoothingTimeConstant 0.45 smooth level → slice 03 amplitude curve | Multi (platform folder MIT — verify at rip time) |
| unsloth | `.repos/unsloth/` (sparse chat/adapters) | `studio/frontend/src/features/chat/adapters/dictation-level.ts` | RAF tick loop: getByteFrequencyData → level → UI → slice 03 breathing driver | Apache-2.0 |
| openai-cookbook | `.repos/openai-cookbook/` (sparse) | `examples/voice_solutions/one_way_translation_using_realtime_api/src/lib/wavtools/lib/analysis/audio_analysis.js` | RMS math + high-res analyser tuning → slice 03 RMS mapping | MIT |
| ragflow | `.repos/ragflow/` (sparse `web/src/pages/agent`) | `canvas/index.tsx`, `hooks.tsx`, `hooks/use-connection-drag.ts`, `constant/index.tsx`, `canvas/edge/index.tsx`, `canvas/node/node-wrapper.tsx` | event-derived busy-set (startButNotFinished), edge hover-delete, hasCycle validation, drag-from-handle placeholder → slices 05/06/10 | Apache-2.0 |

## ⚠ License-caution rows

- **deskreen** = AGPL-3.0. Code-rip FORBIDDEN per `oss-code-adaptation` skill (strong copyleft).
  Use = **pattern reference only** (re-implement pulse keyframes from description; CSS technique
  not copyrightable expression — but do NOT copy code lines). Plans must say READ-ONLY.
- **autogpt** = multi-license monorepo; `autogpt_platform/**` is MIT but VERIFY file header at
  rip time. Default treat as reference; rip only after license check passes.

## ❌ NO LICENSE FILE — READ-ONLY, NEVER RIP

| Repo | Local path | Use |
|---|---|---|
| gradient-components | `.repos/gradient-components/` | READ `src/components/ui/GradientLine.jsx` for breathe/flow animation-mode UX ideas — reimplement from scratch in our tokens. No code copying (no license = all rights reserved). |
| bubble-chart-js | `.repos/bubble-chart-js/` | READ `src/` physics params (centerStrength, collisionPad, velocityDecay, maxVelocity, deterministic seed) as SPEC INSPIRATION — reimplement physics via d3-force (MIT) in slice 10. No code copying. |

## Also local (sibling projects, not cloned — already on disk)

| Path | Relevance |
|---|---|
| `/home/jon/code/whitt/whitt-execution-engine/` | YAML workflow engine — E2 agent bridge counterpart, workflow YAML authoring |
| `/home/jon/code/whitt/whitt-agent-queue-engine/` | agent queue runtime — E2 event source |
| `/home/jon/code/whitt/whitt-model-router/` | local model routing (STT/LLM selection) — E1/E2 |
| `/home/jon/code/whitt/whitt-hardware/` | hardware layer context |
| `/home/jon/code/whitt/charkoal-ai/` | charkoal exploration clone — nesting/breadcrumb patterns |
| `/home/jon/code/whitt/easy-local-whisper-hotkey/` | existing local whisper hotkey app — E1 prior art |

## Rules for plans referencing this map

1. Rip sources MUST come from Rip-able table (or sibling projects). Exact local paths required.
2. READ-ONLY repos: plans cite path + what to LEARN, never "copy".
3. Every rip task in a slice plan MUST invoke `oss-code-adaptation` skill workflow
   (license gate → port-vs-vendor → provenance header → THIRD_PARTY_NOTICES entry).
4. If a path 404s at execution time: `cd .repos/<repo> && git pull --depth 1` or re-clone per header.
