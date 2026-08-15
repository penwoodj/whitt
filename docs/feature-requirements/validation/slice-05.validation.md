# Slice 05 Validation — Execution Visualization

Fixture: `ExecutionPanel.stories.tsx` — expanded modal w/ mocked workflow YAML +
scripted execution event stream (start/step/finish/error).

| Case | Story (`slice05 -- …`) | Play outline | Assert |
|---|---|---|---|
| EXE-01 | `EXE-01 area present` | expand | execution area below bar; workflow summary visible |
| EXE-02 | `EXE-02 dbl-left executes` | dblClick execution area | exec start spy immediate |
| EXE-03 | `EXE-03 dbl-right confirms` | `[MouseRight]` dblClick | confirm dialog w/ YAML; not started until confirm |
| EXE-04 | `EXE-04 hover yaml tooltip` | hover execution area | tooltip right of node w/ YAML tree |
| EXE-05 | `EXE-05 tooltip pins` | click tooltip; unhover | stays open |
| EXE-06 | `EXE-06 yaml visualizer` | open tooltip | YAML rendered as tree structure |
| EXE-07 | `EXE-07 colored expandable` | open tooltip | section colors differ; collapse/expand toggles |
| EXE-08 | `EXE-08 dense padding` | open tooltip | indent ≤ small token; inter-element gap ≤ minimal token |
| EXE-09 | `EXE-09 status card minimal` | expand | rounded card; contains only status text + loader |
| EXE-10 | `EXE-10 hover affordance` | hover status card | color shift; tooltip opens |
| EXE-13 | `EXE-13 only text+loader` | expand | no third content type in card (DOM audit) |
| EXE-15 | `EXE-15 step title changes` | script 3 steps | title text updates per event |
| EXE-16 | `EXE-16 panel live` | script events w/ delays | tooltip content updates w/o reopen |
| EXE-17 | `EXE-17 file preview on create` | script file-created event | preview area shows content |
| EXEC-01 | `EXEC-01 confirm shows yaml` | open confirm | same YAML component as EXE-06 (testid) + execute/cancel |
| EXEC-02 | `EXEC-02 title truncates` | long step title | ellipsis; hover shows full text |
| EXEC-03 | `EXEC-03 yaml failure` | feed invalid YAML | inline error + raw text; execute disabled |
| EXEC-04 | `EXEC-04 step error` | script step-failure | error state color/icon; failed step named; retry present |
| EXEC-05 | `EXEC-05 completion` | script finish | loader stops; done glow fades (~2s); final title; preview final |
