# Feature Requirements — Vertical Slices

> Created 2026-08-14. Reorganizes the 85 brainstorm GWT cases into 11 vertical feature
> slices, adds positive requirements, expands coverage with convention-derived cases,
> and attaches implementation references (open-source code to adapt) + validation specs.
>
> Sources: `../broader-vision/requirements/` (user dictation, authoritative),
> `../broader-vision/user-flows.md`, web research (graph-tool UX conventions, glow/animation
> implementations, Storybook testing patterns).

## Constraint (user-stated)

**Single node type.** Every node = a file bubble (markdown now, other types later).
No workflow-builder node types, no per-node forms. Complexity stays OUT of the node;
richness lives in light-language, voice, and agent behavior.

## Slice Index

| # | Slice | Inherited cases | New cases | Mission |
|---|---|---|---|---|
| 01 | [App Shell & Project Rail](slices/01-app-shell.md) | APP-01..07 | APPC-01..03 | Open/load/switch projects; fixed rail |
| 02 | [Voice Capture & STT Pipeline](slices/02-voice-capture.md) | VOX-01,04..17 | VOXC-01..05 | Mic → text → prompt; permission + error states |
| 03 | [Light Language Visual System](slices/03-light-language.md) | VOX-02/03, EXP-02/04/08, EXE-11/12/14, GRP-08 | LGT-01..08 | Glow, breathing, halo: one visual grammar |
| 04 | [Node Lifecycle & Detail Modal](slices/04-node-lifecycle-modal.md) | EXP-01..11 | EXPC-01..04 | Bubble ↔ modal states, close, stacking |
| 05 | [Agentic Execution Visualization](slices/05-execution-viz.md) | EXE-01..17 | EXEC-01..05 | Status bar, YAML tooltip, loader, confirm |
| 06 | [Agent Context & Mutation Semantics](slices/06-agent-semantics.md) | AGT-01..06 | AGTC-01..03 | Context defaults, mutation event grammar |
| 07 | [File Visualization & Editing](slices/07-file-visualization.md) | FIL-01..07 | FILC-01..04 | Preview, raw edit, save, load states |
| 08 | [Context Pills](slices/08-context-pills.md) | PIL-01..05 | PILC-01..02 | Highlight → pills → weighted prompt |
| 09 | [Git Time Travel & Sync](slices/09-git-time-travel.md) | GIT-01..04 | GITC-01..04 | Commit-per-edit, agent commits, sync states |
| 10 | [Canvas Manipulation](slices/10-canvas-manipulation.md) | GRP-01..11 | GRPC-01..10 | Drag, connect, select, group, physics feel |
| 11 | [Viewport & Navigation](slices/11-viewport-navigation.md) | — | NAV-01..08 | Pan/zoom conventions, fit-view, minimap |

**Total: 85 inherited + 56 new = 141 GWT cases.**

## Provenance Legend (Why lines + case tags)

| Tag | Meaning |
|---|---|
| `[S]` | Source — verbatim user dictation (main flow or first vision). Authoritative. |
| `[C]` | Convention — standard behavior in established graph tools (React Flow, Cytoscape, G6, tldraw, d3) or UX-pattern research. Gap-fill; user-confirmable. |
| `[I]` | Inferred — derived from user intent/vision docs. |

Inherited cases keep their Why lines in `../broader-vision/requirements/` (linked, not
copied — single source of truth, no duplication). New cases carry full GWT + Why here.

## Case ID Scheme

- Inherited: original IDs (APP, VOX, EXP, EXE, AGT, FIL, PIL, GIT, GRP).
- New: `<PREFIX>C-NN` (C = convention/expanded) except slices 03/11 which introduce
  their own prefixes (LGT, NAV) since they are new-system slices.

## Validation

`validation/` holds per-slice Storybook validation specs + a coverage manifest +
`check-coverage.sh` that verifies every case ID maps to a validation story.
Approach + infra notes: `validation/README.md`.

## Related Decisions

- `../adr/0013-vertical-feature-slices.md`
- `../adr/0014-single-node-type-file-bubble.md`
- `../adr/0015-light-language-implementation.md`
- `../adr/0016-storybook-validation-architecture.md`
