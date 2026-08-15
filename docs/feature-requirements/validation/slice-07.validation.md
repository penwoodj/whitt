# Slice 07 Validation — File Visualization & Editing

Fixture: `FilePreview.stories.tsx` — expanded modal w/ file content (mock FS loader:
fast/slow/fail), edit toggle, save spy.

| Case | Story (`slice07 -- …`) | Play outline | Assert |
|---|---|---|---|
| FIL-01 | `FIL-01 area present` | expand node w/ file | preview area under execution area; content shown |
| FIL-02 | `FIL-02 markdown preview` | md content w/ headings | rendered HTML (h2 etc.), not raw md |
| FIL-04 | `FIL-04 edit toggle` | click edit icon | raw textarea w/ source md |
| FIL-05 | `FIL-05 blur saves` | edit; click outside | save spy called w/ new content |
| FIL-06 | `FIL-06 multi-highlight` | ctrl+select 2 spans in preview | both marked `data-highlighted` persist |
| FIL-07 | `FIL-07 ctrl+F` | open find; query term | matches highlighted |
| FILC-01 | `FILC-01 skeleton` | slow loader (300ms) | skeleton at >200ms; layout-matched blocks; caps at 5s |
| FILC-02 | `FILC-02 save failure` | save spy rejects | inline error + retry; in-memory text intact |
| FILC-03 | `FILC-03 concurrent guard` | disk-change event while editing; blur | conflict notice; keep-mine preserves user text |
| FILC-04 | `FILC-04 close guard` | edit; ESC w/ failing save | close blocked; error shown; text preserved |
