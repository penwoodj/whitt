# User Flows — Voice Bubble Graph App

> Captured 2026-08-14. Deduplicated narrative flows from user vision sessions.
> Maps flows → GWT requirement IDs (see `requirements-summary.md`).

## Flow A — First Open, New Project

1. User opens app → new blank project session (like new ChatGPT chat). APP-01, APP-07
2. Left rail fixed: prior project letter-bubbles + new empty bubble. APP-02, APP-03, APP-04
3. Canvas = single white bubble of light. APP-01

## Flow B — Voice Prompt → Execute → Expanded Node

1. Single click bubble → STT starts invisibly; bubble color shifts + breathes w/ voice. VOX-01/02/03
2. Mouse over node → tooltip pops, live-typed text visible. VOX-04, VOX-05
3. Cursor onto tooltip, click in → becomes text input, STT appends at end. VOX-06/07
4. Double left click → prompt sent immediately. VOX-14
5. Node expands into soft-corner modal; ball → halo; recording auto-starts. EXP-01/02/03
6. Bar of light at top; status bar below w/ minimal info. EXP-04, EXE-09
7. Agent runs: morphing icon loader + changing step title; edges breathe. EXE-14/15/11
8. Agent creates node md file → preview appears in expanded node. EXE-17, FIL-01/02
9. Agent assumes spoken-to node = context; initial prompt creates one file only. AGT-01/03
10. Graph shows agent mutations as real-time movement. AGT-04, AGT-06

## Flow C — Edit Prompt Before Send

1. While recording, tooltip input open (Flow B steps 1-3).
2. Click anywhere in text; highlight span; keyboard or voice type over it. VOX-08
3. Click outside → tooltip hides, recording continues. VOX-11
4. Single click bubble → stop; single click again → resume, appends at end. VOX-12/13
5. Enter sends; Shift+Enter newline. VOX-09/10
6. Prompt debounced-saves own file in hidden `.` folder beside node. VOX-16

## Flow D — Manual Open + Confirm Before Execute

1. Right click node → opens expanded WITHOUT STT. EXP-09
2. Hover bar of light → input tooltip; type/keyboard-edit prompt. EXP-05
3. Hover execution area (or status bar) → execution tooltip right of node: YAML visualizer,
   colored expandable sections, dense padding. EXE-04/05/06/07/08, EXE-10
4. Double left click execution area → immediate execute. EXE-02
5. Double RIGHT click execution area → confirm what executes, then run. EXE-03

## Flow E — Watch Execution Live

1. Execution running: status bar text + morphing loader + current step title. EXE-13/14/15
2. Execution tooltip updates live w/ user-relevant info. EXE-16
3. Result not right → user reacts/steers during or after. AGT-05

## Flow F — Target File Sections via Highlight + Pills

1. Node has file content (after Flow B). FIL-01
2. Pause STT (single click). VOX-12
3. Ctrl multi-highlight areas; Ctrl+F search highlights. FIL-06/07
4. Speak → STT tooltip shows context pills for highlights; pills show line numbers;
   X removes on hover. PIL-01/02/03, PIL-04
5. Send → agent focuses on pill'd areas over rest of graph. PIL-05

## Flow G — Group Nodes → Speak to Group

1. Highlight multiple bubbles. GRP-01/02
2. Right click select → box around group. GRP-03
3. Halo forms around group (soft = temporary, hard = folder-backed). GRP-07/08
4. Group = prompt context; tooltip appears beside group; group acts node-like. GRP-09/10

## Flow H — Move + Connect Nodes

1. Drag node → connected nodes pulled along, links intact. GRP-04
2. Create standalone floating node. GRP-05
3. Hover right of node → drag line → drop on node → link created. GRP-06

## Flow I — Direct File Edit

1. Expand node; file visualization shows markdown preview. FIL-01/02
2. Click edit icon → raw markdown text mode. FIL-04
3. Click out (focus leaves) → auto-saves. FIL-05
4. Save = git commit w/ edit metadata. GIT-01

## Flow J — Sync Remote

1. Floating button panel on graph. GIT-04
2. Click sync → repo pushed to remote. GIT-04

## Flow K — Switch Projects

1. Click project letter-bubble on rail → graph loads. APP-06
2. Click into title → inline edit; rail letter follows. APP-05

## Flow L — Time Travel (background, always on)

1. Every user edit commit = metadata message. GIT-01
2. Agents commit regularly mid-run. GIT-02
3. All state rewindable via git. GIT-03

## Dedup Notes

- "Click bubble to send" (early phrasing) resolved → double click sends, single toggles STT.
  VOX-01/12/14.
- Tooltip pin semantics stated 3× in source → single rule (cross-cutting rule 1).
- Breathing stated for ball + bar → one idiom (cross-cutting rule 4).
- Right click on unexpanded node (EXP-09) distinct from double right click send (VOX-15):
  single right click context menu NOT specified in source — open question.
- Grouping FS translation (folder + moves) lives in `user-vision-graph-interaction.md` §2
  + GRP-07 hard groups; not restated per case.

## Open Questions (not in source, flagged)

1. Single right click unexpanded node → context menu? nothing? EXP
2. ESC behavior on modal/tooltip? modal close = ESC/out/X per ADR-0012 (EXP-11); pinned tooltip close unspecified
3. Multiple simultaneous recordings? presumably one (needs confirmation)
4. Prompt file retention/lifecycle (hidden folder growth)? VOX-16
5. Grouping ↔ details-panel nesting interplay (GRP-11) sequencing
6. Pill content: line numbers only, or + text snippet/filename (Cursor-style)? PIL-03
7. Project rail overflow behavior (scroll?) + title length limit APP
