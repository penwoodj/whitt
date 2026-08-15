---
name: local-stt
description: >
  Local speech-to-text wiring for whitt voice UI. Engine options (browser-whisper/
  transformers.js/whisper.cpp WASM/native sidecar), capability detection, mic
  pipeline (one AudioContext → STT + AnalyserNode breathing), interim-vs-final
  transcript → VOX cursor semantics, failure UX. Use when implementing slice 02
  (voice capture) or any live mic feature.
---

## When to Use

- Implementing VOX cases (recording, transcript append, toggle)
- Wiring mic pipeline + level metering (VOX-03 breathing needs AnalyserNode feed)
- Choosing/configuring local STT engine (no cloud, ever)
- Handling permission/silence/OOM failures (VOXC cases)

## Engine Options (2025-2026 state)

| Engine | Streaming | Local | Notes |
|---|---|---|---|
| `browser-whisper` (tanpreetjolly) | ✅ AsyncIterable segments | ✅ | PRODUCTION PICK: 2 workers (decoder+inference), WebGPU+q4, OPFS cache, WebCodecs |
| `@huggingface/transformers` v3+ | ❌ (chunked only) | ✅ | pipeline('automatic-speech-recognition', 'onnx-community/whisper-base', {device:'webgpu', dtype:'q4'}) |
| whisper.cpp `stream.wasm` | ✅ near-real-time | ✅ | tiny/base/small only, WASM SIMD req, heavy |
| Web Speech API | ✅ interim | ❌ cloud | Chrome/Safari = server-backed; Electron fails error:network. NOT local — reject for whitt (local-first mandate). Chrome 139+ `processLocally` flag = experimental, desktop-only, not shippable |
| Sidecar (whisper.cpp server / faster-whisper-server / speaches / vosk-server) | ✅ | ✅ | HTTP/WS; when Tauri/Electron shell lands, strongest long-term option |

**Recommendation**: browser-whisper w/ `whisper-base` (WebGPU, ~210MB hybrid) →
fallback `whisper-tiny` (~120MB) on WASM/no-GPU. Revisit sidecar when desktop
shell exists. Engine behind interface — cases are engine-agnostic (slice 02 rule).

Model reality: whisper-tiny 10-15× realtime on WebGPU, base 5-8×; WASM ~10×
slower. WebGPU: Chrome 113+, Safari 18+; detect + fallback.

## Mic Pipeline (ONE AudioContext, split feed)

```
getUserMedia({audio:true})
  → AudioContext({sampleRate:16000})
  → createMediaStreamSource(stream)
      ├─ connect(analyser)   → getByteFrequencyData → RMS → bubble breathing (VOX-03)
      └─ connect(sttWorklet) → 16k Float32 chunks → whisper worker
```

- Whisper needs 16kHz mono Float32Array. AudioWorklet for capture
  (ScriptProcessor deprecated).
- AnalyserNode fftSize 256 (omi precedent), smoothingTimeConstant ~0.45 (AutoGPT)
  — feeds level only, never STT.
- VAD endpointing: `@ricky0123/vad-web` (~2MB ONNX, Web Worker) — pairs w/
  silence handling (VOX-12 stop).

## React Integration

```typescript
const useVoiceInput = (nodeId: string) => {
  // engine ref (worker), analyser ref, rAF loop for level
  // init in useEffect, destroy idempotent (StrictMode double-mount safe)
  // expose: startRec, stopRec, interimTxt, appendFinal, level
}
```

- Engine instance + AudioContext live in refs/closures, NEVER state.
- Cleanup: stop tracks (`stream.getTracks().forEach(t => t.stop())`), close
  AudioContext, terminate workers, cancel level rAF.

## Interim vs Final → VOX Semantics

- Interim = ghost text in tooltip (gray, below cursor), NOT committed (VOX-07
  appends finals only at cursor; user editing mid-stream unaffected by interims).
- Final = append at cursor position (or input end if untouched), commit solid
  text, clear interim (VOX-13 resume appends at bottom).
- browser-whisper: `for await (const segment of transcribe(stream))` — segments
  are finals w/ timestamps.

## Failure UX (VOXC-01 territory + more)

| Failure | Detection | UX |
|---|---|---|
| Permission denied | getUserMedia reject | persistent toast + retry + keyboard fallback (EXP-09 path) |
| No mic | enumerateDevices | disable voice affordance, show why |
| Insecure context | `!isSecureContext` | explain HTTPS/localhost req |
| No WebGPU | `navigator.gpu` + requestAdapter | auto-fallback tiny+WASM + perf warning |
| Model loading | first-run download | progress % on bubble (LGT states), block record until ready |
| Silence timeout | VAD | auto-stop matches VOX-12 single-click stop |
| Engine OOM/crash | worker error evt | preserve partial finals (VOXC-02), retry prompt |

Capability detection up front (before first record click), not on failure.

## Model Caching (local-first)

- OPFS (Origin Private File System) persistent cache after first download.
- Offline-capable after initial model fetch. Bundle model w/ desktop shell later.

## MUST NOT

- Use cloud STT (Web Speech API included — it phones home)
- Create second AudioContext for level metering (split ONE source)
- Commit interim text to prompt state
- Block UI thread w/ inference (workers mandatory)
- Re-download model per session (OPFS cache)

## References

- Slice 02: `docs/feature-requirements/slices/02-voice-capture.md`
- Audio refs: survey §2 (omi audioCapture.ts, AutoGPT useAudioBars, unsloth dictation-level)
- Repos: tanpreetjolly/browser-whisper, xenova/whisper-web, ggml-org/whisper.cpp
  (examples/stream.wasm), speaches-ai/speaches, @ricky0123/vad-web
