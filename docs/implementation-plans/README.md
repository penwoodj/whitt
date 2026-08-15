# Implementation Plan Suite — vision-graph-ui

> EXECUTION-READY plans implementing every GWT case from `docs/feature-requirements/`
> (141 cases) + `docs/broader-vision/` vision. Built 2026-08-14, verified via
> `check-plans.sh` + momus review. NOT YET EXECUTED — plans only.

## Reading order

1. `EXECUTION-PROTOCOL.md` — the loop: how plans execute, validate live, retry until pass
2. `CONTEXT/C0-reference-repos.md` — local rip sources (VERIFIED paths + license gates)
3. `CONTEXT/TEMPLATE.md` — plan file format (all plans conform)
4. `CONTEXT/C1-decision-register.md` — open decisions routed to question-cycles
5. Enabler plans (E*) — infra that slices depend on
6. Slice plans (S*) — the 11 vertical slices

## Suite map

### Enablers (run first, in order)

| Plan | Delivers | Unblocks |
|---|---|---|
| `ENABLERS/E1-stt-engine.md` | local browser-whisper STT runtime + audio feed (AnalyserNode split) | S02, S03 |
| `ENABLERS/E2-agent-runtime-bridge.md` | AgentEvt bus + fake runtime + useAgentEvtStream | S05, S06, S09 |
| `ENABLERS/E3-fs-graph-sync.md` | FS↔graph sync layer + write queue + FsPort | S06, S07, S09 |
| `ENABLERS/E4-react-flow-upgrade.md` | reactflow 11 → @xyflow/react 12 migration | S04, S10, S11 |

### Slices (parallelizable after deps)

| Plan | Cases | Depends on |
|---|---|---|
| `SLICES/S01-app-shell.md` | APP-01..07, APPC-01..03 | E4 |
| `SLICES/S02-voice-capture.md` | VOX-01,04..17, VOXC-01..05 | E1, E4 |
| `SLICES/S03-light-language.md` | VOX-02/03, EXP-02/04/08, EXE-11/12/14, GRP-08, LGT-01..08 | E1 |
| `SLICES/S04-node-lifecycle-modal.md` | EXP-01..11, EXPC-01..04 | E4 |
| `SLICES/S05-execution-viz.md` | EXE-01..17, EXEC-01..05 | E2 |
| `SLICES/S06-agent-semantics.md` | AGT-01..06, AGTC-01..03 | E2, E3 |
| `SLICES/S07-file-visualization.md` | FIL-01..07, FILC-01..04 | E3 |
| `SLICES/S08-context-pills.md` | PIL-01..05, PILC-01..02 | S07 |
| `SLICES/S09-git-time-travel.md` | GIT-01..04, GITC-01..04 | E3 |
| `SLICES/S10-canvas-manipulation.md` | GRP-01..11, GRPC-01..10 | E4 |
| `SLICES/S11-viewport-navigation.md` | NAV-01..08 | E4 |

Execution wave order: E1+E4 → E2+E3 → S01+S03+S04 → S02 → S05+S10+S11 → S06+S07 → S08 → S09.
(Adjust per EXECUTION-PROTOCOL dependency rules; waves = max parallelism.)

## Verification (this suite's own quality gates)

- `check-plans.sh` — mechanical: paths exist, case IDs real, story names match, template conformance
- momus review — completeness/consistency (see Review Log below)
- All `.repos/` paths hand-verified on disk 2026-08-14 (see C0)

## Review Log

| Date | Pass | Result |
|---|---|---|
| 2026-08-14 | template + C0 written, 16 repos cloned + verified | — |
