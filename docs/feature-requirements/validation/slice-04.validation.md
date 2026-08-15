# Slice 04 Validation — Node Lifecycle & Modal

Fixture: `NodeLifecycle.stories.tsx` — graph w/ 3 nodes; expansion mocked end-to-end
(send spy triggers expansion + fake execution state).

| Case | Story (`slice04 -- …`) | Play outline | Assert |
|---|---|---|---|
| EXP-01 | `EXP-01 send expands` | dblClick node w/ prompt | modal visible; execution started spy |
| EXP-03 | `EXP-03 expand auto-records` | expand | STT started w/o extra click |
| EXP-05 | `EXP-05 bar hover tooltip` | expand; hover bar | input tooltip opens (same component as VOX-06) |
| EXP-06 | `EXP-06 bar click toggles STT` | expand; click bar; click again | STT stop/start spies |
| EXP-07 | `EXP-07 bar dblclick sends` | type; dblClick bar | send spy |
| EXP-09 | `EXP-09 right click no STT` | `[MouseRight]` click node | modal open; STT NOT started |
| EXP-10 | `EXP-10 ball running state` | collapse node while executing | bubble shows running glow token |
| EXP-11 | `EXP-11 close tri-path` | expand; then ESC / click-outside / X (3 stories or steps) | modal closes each path; bubble at same canvas position |
| EXPC-01 | `EXPC-01 single modal` | expand A; expand B | A collapsed (state kept); B expanded |
| EXPC-02 | `EXPC-02 size caps` | huge file preview story | modal ≤80% viewport; inner scroll; graph visible around |
| EXPC-03 | `EXPC-03 esc precedence` | modal + pinned tooltip; ESC; ESC | tooltip closes first, modal persists; second ESC closes modal |
| EXPC-04 | `EXPC-04 origin transition` | expand | transition ~200-300ms; transform-origin = node position; no FOUC |
