# Slice 02 Validation — Voice Capture & STT

Fixture: `VoiceNode.stories.tsx` — single bubble node; STT engine mocked (scripted
transcript stream); mic mocked (FakeAudioContext w/ level script); prompt-file writer
spied.

| Case | Story (`slice02 -- …`) | Play outline | Assert |
|---|---|---|---|
| VOX-01 | `VOX-01 click starts recording` | single click bubble | STT engine started; no tooltip chrome auto-opened |
| VOX-04 | `VOX-04 hover tooltip live text` | start rec; hover bubble | tooltip visible; streamed words appear |
| VOX-05 | `VOX-05 tooltip side adaptive` | place neighbor right of node; hover | tooltip opens LEFT (collision avoided) |
| VOX-06 | `VOX-06 click pins tooltip` | hover tooltip; click into it; unhover | tooltip persists; input focused |
| VOX-07 | `VOX-07 append at cursor` | pinned input; script "hello"; click mid-text; script "X" | "X" inserted at cursor, not at end |
| VOX-08 | `VOX-08 edit over highlight` | highlight span; keyboard type over | span replaced; voice continues at cursor |
| VOX-09 | `VOX-09 enter sends` | focus input; Enter | send spy called once |
| VOX-10 | `VOX-10 shift-enter newline` | focus input; Shift+Enter | newline in value; send spy NOT called |
| VOX-11 | `VOX-11 click-out keeps recording` | pinned input; click canvas | tooltip hidden; STT still streaming |
| VOX-12 | `VOX-12 click stops` | recording; single click | STT stopped |
| VOX-13 | `VOX-13 click resumes appends` | stopped w/ text; click; script "more" | "more" appended at end |
| VOX-14 | `VOX-14 dblclick sends` | content present; dblClick bubble | send spy called |
| VOX-15 | `VOX-15 dbl-right-click sends` | `[MouseRight]` dblClick | send spy called |
| VOX-16 | `VOX-16 debounced prompt file` | type; wait debounce window | writer spy called once w/ text; path under hidden folder beside node |
| VOX-17 | `VOX-17 pinned survives unhover` | pin; move pointer away | tooltip still open; bubble still breathing class |
| VOXC-01 | `VOXC-01 mic permission flow` | mock getUserMedia deny | denied state + recovery text; no crash |
| VOXC-02 | `VOXC-02 interim styling` | script interim then final | interim span styled `data-interim`; finalizes to normal w/o cursor jump |
| VOXC-03 | `VOXC-03 stt error preserves text` | stream then engine error | status near input; text intact in prompt file spy |
| VOXC-04 | `VOXC-04 single recorder` | rec on A; click B | A stopped cleanly; B sole recorder |
| VOXC-05 | `VOXC-05 empty send noop` | empty input; dblClick | send spy NOT called; shake affordance class applied |
