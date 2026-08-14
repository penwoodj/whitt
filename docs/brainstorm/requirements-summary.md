# Requirements Suite Summary — GWT Index

> Captured 2026-08-14. Index of Given/When/Then requirement files extracted from
> user vision sessions (see `user-vision-graph-interaction.md`, `user-flows.md`).
> Status: brainstorm requirements, not implementation spec. Pre-gate for future ADRs/slices.

## Suite Files

| File | Scope | IDs | Count |
|---|---|---|---|
| `requirements/01-app-shell-projects.md` | Project rail, app open, title edit | APP | 7 |
| `requirements/02-voice-input-tooltip.md` | STT, tooltip pin/edit, send keys, prompt files | VOX | 17 |
| `requirements/03-expanded-node-modal.md` | Modal expansion, halo, bar of light, right-click open, close | EXP | 11 |
| `requirements/04-agentic-execution-area.md` | Execution viz, YAML tooltip, status bar, loader | EXE | 17 |
| `requirements/05-agent-context-semantics.md` | Default context, cross-node refs, mutation movement | AGT | 5 |
| `requirements/06-file-visualization-editing.md` | File preview, raw edit, save-on-blur, ctrl+F | FIL | 7 |
| `requirements/07-context-pills.md` | Highlight → pills, removal, line numbers, attention | PIL | 5 |
| `requirements/08-git-time-travel-sync.md` | Commit-per-edit, agent commits, remote sync | GIT | 4 |
| `requirements/09-canvas-grouping-manipulation.md` | Multi-select, groups, connected drag, links, nesting | GRP | 11 |

**Total: 84 GWT cases.**

Review cycle 1 (momus, 2026-08-14): NEEDS_FIXES → fixed. Applied: OpenCode
reference (APP-03), EXP-11 close (ADR-0012), VOX-07/08 cursor-position
clarifications, FIL-06 persistent highlight, PIL-03 snippet open question.
0 fabrications, 0 contradictions, counts verified.

## Cross-Cutting Interaction Rules (apply everywhere)

1. **One tooltip idiom**: hover → open; click/click-into → pin; pinned stays w/o hover.
   Used by STT input (VOX), execution YAML (EXE). Same semantics, zero relearning.
2. **One toggle idiom**: single click = STT on/off — on unexpanded ball AND bar of light (EXP-06).
3. **One send idiom**: double click (left or right on new bubble) OR Enter in focused input;
   Shift+Enter = newline (VOX-09/10, EXP-07).
4. **Volume breathing**: recording bubble + bar of light both breathe w/ voice amplitude (VOX-03, EXP-08).
5. **Status = light motion**: edges breathe while executing, still when idle (EXE-11);
   breathing = live activity, always visible w/o opening anything.

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

## Verification

Coverage checked against source user message 2026-08-14 (voice-flow dictation).
Review cycle: momus pass, dedup pass — see git history of this folder.
