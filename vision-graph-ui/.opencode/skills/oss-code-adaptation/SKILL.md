---
name: oss-code-adaptation
description: >
  Protocol for adapting OSS code ("code-ripping") into vision-graph-ui — license
  check, vendor-vs-port decision, React wrapping for canvas/WebAudio engines,
  provenance headers, third-party notices. Use BEFORE copying any chunk from
  edge-aura, 3d-force-graph, reposkein, bubble-chart-js, omi, or any external repo.
---

## When to Use

- Pulling any glow/bloom/physics/audio chunk referenced in slice 03 code-rip table
- Wrapping a vanilla canvas/WebAudio engine in a React component
- Vendoring or porting any file from an external repo
- Reviewing a PR that adds adapted code

## 1. License Quick-Check (BEFORE copying — hard gate)

| License | Verdict | Requirement |
|---|---|---|
| MIT / ISC | ✅ copy | preserve copyright + permission notice |
| Apache-2.0 | ✅ copy | preserve notices incl. patent grant; include upstream NOTICE if exists |
| BSD-2/3 | ✅ copy | preserve copyright + disclaimer |
| MPL-2.0 | ⚠️ file-level copyleft | modified MPL files stay MPL; keep separate |
| LGPL | ⚠️ link, don't embed | dynamic use OK; modifications stay LGPL |
| GPL-2/3 | ❌ avoid | share-alike infects app on distribution |
| AGPL / SSPL | ❌ NEVER | network use triggers source disclosure |

All current code-rip targets (edge-aura, 3d-force-graph, graphier, reposkein,
border-beam, gradient-components, mantine-scene, deskreen, omi, AutoGPT, unsloth,
bubble-chart-js, react-force-graph) = MIT/Apache/BSD — verified in survey. Re-verify
per-file at pull time (license can change upstream).

## 2. Vendor vs Port

VENDOR (copy + minimal edits) when: battle-tested logic, want upstream diff path,
file <500 LOC, structure sound.
PORT (rewrite in our idiom) when: framework mismatch is deep, need <20% of it,
source has quality issues, diverging long-term.

Default for this repo: **PORT** — our rules (styled-components, lodash/fp, no
classes, terse naming) diverge from most sources. Vendor only when logic density
is high and React-agnostic (physics math, glow shaders, DSP).

## 3. React Wrapping Pattern (vanilla canvas/WebAudio engine)

Engine class stays vanilla (per AGENTS.md style where possible); React owns lifecycle:

```typescript
useEffect(() => {
  const engine = new GlowEngine(canvasRef.current)
  engine.init()
  let rafId = requestAnimationFrame(function loop() {
    engine.render()
    rafId = requestAnimationFrame(loop)
  })
  return () => {
    cancelAnimationFrame(rafId)
    engine.destroy()
  }
}, [])
```

- Empty deps. Instance lives in ref or closure — NEVER in state.
- StrictMode double-mount: `setup → cleanup → setup` must equal `setup`. Make
  `destroy()` idempotent.
- One-way-door ops (`transferControlToOffscreen`): create canvas imperatively
  inside effect + `canvas.remove()` on cleanup. Do NOT guard w/ mounted ref.
- Props → engine updates via separate effect calling `engine.setOpts(opts)`.

Precedents: `@p5-wrapper/react` (callback refs + useImperativeHandle),
anam-halftone-shader (vanilla Engine class + thin React wrapper).

## 4. Provenance + Attribution (mandatory)

**Header on EVERY adapted file** (license-mandated EXCEPTION to AGENTS.md §5
no-comment rule — attribution is a legal requirement, not documentation):

```typescript
// Adapted from: edge-aura src/engine.ts
// Source: https://github.com/takuyajodai/edge-aura/blob/<sha>/src/engine.ts
// License: MIT — Copyright (c) 2024 takuyajodai
// Changes: TS types, removed strip tiling, React-owned rAF
```

- Record commit SHA at pull time. `PROVENANCE.md` per component when >1 file.
- Root `THIRD_PARTY_NOTICES.md`: one entry per adapted component (source, commit,
  license, copyright line, full license text or link to `LICENSES/<name>.txt`).
- Precedents: microsoft/vscode `ThirdPartyNotices.txt`, opensquilla
  `THIRD_PARTY_NOTICES.md` + per-plugin PROVENANCE.md.

## 5. Staging

```
src/adapted/<component>/     ← ported code (our idiom, provenance headers)
src/vendor/<component>/      ← near-verbatim vendored (only if vendoring)
LICENSES/<license>.txt       ← license texts
THIRD_PARTY_NOTICES.md       ← root index (repo root, next to README)
```

Adapted code follows ALL repo rules (styled-components, naming, file caps) EXCEPT
it keeps provenance headers. Inside a feature slice: `features/<slice>/glow/`
also acceptable — keep w/ its consumer.

## Checklist (per rip)

- [ ] License verified at pull time → recorded in header
- [ ] Vendor-or-port decision recorded (one line in header "Changes" field)
- [ ] Provenance header w/ SHA on every file
- [ ] `THIRD_PARTY_NOTICES.md` entry added
- [ ] StrictMode double-mount tested (dev console, no leaks/warnings)
- [ ] rAF/worker cleanup verified on unmount
- [ ] Slice file code-rip table row updated w/ "pulled" status

## MUST NOT

- Copy from GPL/AGPL/SSPL sources
- Strip or alter license/copyright lines
- Skip header because "it's small"
- Leave engine instances alive after unmount
- Put vendored code in `src/shared/` (adapted code ≠ shared utility)

## References

- Slice 03 code-rip table: `docs/feature-requirements/slices/03-light-language.md`
- Survey perf table: `docs/brainstorm/research-inspiration-survey.md`
- choosealicense.com (license texts), upstream repos' LICENSE files
