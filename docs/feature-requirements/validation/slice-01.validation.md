# Slice 01 Validation — App Shell & Project Rail

Fixture: `AppShell.stories.tsx` — app frame w/ rail (3 seeded projects + new bubble)
over a mock graph canvas. Project store mocked (load/save spies).

| Case | Story (`slice01 -- …`) | Play outline | Assert |
|---|---|---|---|
| APP-01 | `APP-01 opens new project` | mount app | single white bubble rendered; no picker |
| APP-02 | `APP-02 rail fixed` | pan/zoom canvas hard right | rail still at left edge, unaffected |
| APP-03 | `APP-03 project letter bubbles` | mount w/ seeded projects | one letter bubble per project, letters match titles |
| APP-04 | `APP-04 new project blank` | click new bubble | title empty; no letter glyph |
| APP-05 | `APP-05 title inline edit` | click title, type "Deep Work", blur | title text updated; rail letter now "D" |
| APP-06 | `APP-06 select loads graph` | click project bubble B | mock loader called w/ B; nodes of B rendered |
| APP-07 | `APP-07 fresh session` | click new bubble after loading B | canvas reset to single bubble |
| APPC-01 | `APPC-01 rail scrolls` | seed 30 projects | rail scrollable; selected stays visible |
| APPC-02 | `APPC-02 empty rail` | mount zero projects | only new-project bubble; no list chrome |
| APPC-03 | `APPC-03 load failure` | mock loader rejects | error region visible w/ cause + retry; retry clickable |
