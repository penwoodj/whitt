# Requirements Suite Summary — GWT Index

> Captured 2026-08-14, rationale pass added same day. Index of Given/When/Then
> requirement files extracted from user vision dictation (see
> `user-vision-graph-interaction.md`, `user-flows.md`).
> Status: brainstorm requirements, not implementation spec. Pre-gate for future ADRs/slices.

## Suite Files

| File | Scope | IDs | Count |
|---|---|---|---|
| `requirements/01-app-shell-projects.md` | Project rail, app open, title edit | APP | 7 |
| `requirements/02-voice-input-tooltip.md` | STT, tooltip pin/edit, send keys, prompt files | VOX | 17 |
| `requirements/03-expanded-node-modal.md` | Modal expansion, halo, bar of light, right-click open, close | EXP | 11 |
| `requirements/04-agentic-execution-area.md` | Execution viz, YAML tooltip, status bar, loader | EXE | 17 |
| `requirements/05-agent-context-semantics.md` | Default context, cross-node refs, mutation projection | AGT | 6 |
| `requirements/06-file-visualization-editing.md` | File preview, raw edit, save-on-blur, ctrl+F | FIL | 7 |
| `requirements/07-context-pills.md` | Highlight → pills, removal, line numbers, attention | PIL | 5 |
| `requirements/08-git-time-travel-sync.md` | Commit-per-edit, agent commits, remote sync | GIT | 4 |
| `requirements/09-canvas-grouping-manipulation.md` | Multi-select, groups, connected drag, links, nesting | GRP | 11 |

**Total: 85 GWT cases.**

## Rationale Coverage

Every case carries a **Why** line:
- **(source: "...")** — rationale quoted/paraphrased from user dictation (authoritative).
- **(inferred)** — derived from user intent/vision docs; flagged for user confirmation.
No case lacks rationale. Whys live with their cases (not centralized) so context
travels with the requirement.

## Cross-Cutting Interaction Rules (apply everywhere)

1. **One tooltip idiom**: hover → open; click/click-into → pin; pinned stays w/o hover.
   Used by STT input (VOX-06, VOX-17), execution YAML (EXE-05). Same semantics, zero relearning.
2. **One toggle idiom**: single click = STT on/off — on unexpanded ball (VOX-01/12/13)
   AND bar of light (EXP-06).
3. **One send idiom**: double click (left or right on new bubble, VOX-14/15; bar,
   EXP-07) OR Enter in focused input (VOX-09); Shift+Enter = newline (VOX-10).
4. **Volume breathing**: recording bubble + bar of light both breathe w/ voice
   amplitude (VOX-03, EXP-08).
5. **Status = light motion**: edges breathe while executing, still when idle (EXE-11);
   breathing = live activity, always visible w/o opening anything.
6. **Light = entity**: halo marks node-ness (EXP-02) and group-ness (GRP-08);
   balls/bars/halos are one continuous light-language.

## Key Decision Points Surfaced (resolve before slicing)

| # | Question | Where |
|---|---|---|
| 1 | Tooltip side-choice algorithm (right vs left) | VOX-05 |
| 2 | Soft group → hard group promotion UX | GRP-07 |
| 3 | Confirm-dialog content (EXE-03) vs YAML tooltip (EXE-06) overlap | EXE |
| 4 | Prompt file format + naming in hidden `.` folder | VOX-16 |
| 5 | Loader icon set for morphing indicator | EXE-14 |
| 6 | Status bar ↔ bar of light layout stacking in modal | EXP-04, EXE-09 |
| 7 | Pinned tooltip close mechanism (ESC? X? click-out only?) — VOX-11 covers click-out only | VOX |
| 8 | Pill content: line numbers only vs + snippet/filename | PIL-03 |

## Source Provenance

Cases cite two user dictations from 2026-08-14:
- **Main flow dictation** — interaction flows (app open → voice → execute → edit → group).
- **First vision dictation** (earlier same day) — vision/semantics (bubbles of light, movement
  meaning, attention weighting, grouping=FS). Its thematic capture:
  `user-vision-graph-interaction.md`. Quotes marked "(source: earlier vision session)"
  are verbatim from that dictation (AGT-05, PIL-05, GRP-04 secondary, VOX-03 magic note).

## Verification

Coverage checked against both source dictations 2026-08-14.
Review cycles: (1) momus pass → NEEDS_FIXES → fixed (OpenCode ref, EXP-11 close,
cursor clarifications, FIL-06 persistent highlight, PIL-03 open q). (2) rationale
pass w/ per-case Why + AGT-06; momus flagged 3 earlier-vision citations as
unverifiable — cross-checked against first dictation verbatim: all 3 accurate
(false alarm from paraphrase-only review input); provenance note added (this section).
