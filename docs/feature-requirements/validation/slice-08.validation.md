# Slice 08 Validation — Context Pills

Fixture: `ContextPills.stories.tsx` — expanded modal, preview w/ highlightable spans,
STT tooltip open.

| Case | Story (`slice08 -- …`) | Play outline | Assert |
|---|---|---|---|
| PIL-01 | `PIL-01 pills on highlight` | highlight 2 spans | 2 pills in tooltip; Cursor-chip styling |
| PIL-02 | `PIL-02 remove via X` | hover pill; click X | pill gone; highlight retained in file |
| PIL-03 | `PIL-03 line numbers` | highlight span | pill shows line range of selection |
| PIL-04 | `PIL-04 pause highlight speak` | stop STT; highlight; send | payload = text + pill refs |
| PIL-05 | `PIL-05 attention weighting` | send w/ pills | payload marks pill'd ranges weighted |
| PILC-01 | `PILC-01 overflow stacking` | highlight 8 spans | 6 pills + "+2 more"; expand list on click |
| PILC-02 | `PILC-02 hover preview` | hover pill | snippet + line range shown; click scrolls preview to span |
