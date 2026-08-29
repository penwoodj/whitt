# Slice 07 — File Visualization & Editing

> Vertical slice: markdown preview in modal, raw-edit toggle, save-on-blur → commit,
> load states, highlight surfaces (feeding slice 08 pills).

## Positive Requirements

1. **PR-07-1** Reading is primary: markdown renders as preview by default.
2. **PR-07-2** Editing is a deliberate toggle (edit icon) — never accidental.
3. **PR-07-3** Save is implicit on focus-leave; every save is a commit (GIT-01).
4. **PR-07-4** Load/save states never block reading what's already there.
5. **PR-07-5** Selection surfaces (ctrl-multi-highlight, ctrl+F) are speakable — they
   feed context pills (slice 08).

## Inherited Cases (full GWT + Why: `../../broader-vision/requirements/06-file-visualization-editing.md`)

| ID | Summary |
|---|---|
| FIL-01 | File visualization area under execution area |
| FIL-02 | Markdown preview default |
| FIL-03 | Non-markdown types later (syntax highlighting per type) |
| FIL-04 | Edit icon toggles raw markdown |
| FIL-05 | Focus-leave saves |
| FIL-06 | Ctrl multi-highlight, persistent visual |
| FIL-07 | Ctrl+F highlights matches |

## New Cases (convention-derived gap-fill)

### FILC-01 Load skeleton

```gherkin
Given file content loading (>200ms)
Then preview area shows skeleton matching final layout (block shapes)
And skeleton never shows before 200ms (avoid flash)
And caps at 5s w/ error state fallback
```

**Why** `[C]`: skeleton rules from UX-pattern research (match layout, 200ms delay,
5s cap) — prevents layout jump + spinner noise in the modal.

### FILC-02 Save failure recovery

```gherkin
Given focus-leave save fails (IO error)
Then inline error region shows near the editor (cause + retry)
And edited text preserved in-memory (never lost)
And modal refuses to silently discard user edits
```

**Why** `[C]`: error-pattern rules; FS writes can fail — user text is sacred.

### FILC-03 Concurrent edit guard

```gherkin
Given file changed on disk by agent while user edits raw text
When user focus-leave saves
Then conflict notice appears (agent version vs user version)
And user chooses: keep mine / inspect diff
And no silent overwrite either direction
```

**Why** `[I]`: agent + user edit same file is COMMON in this product (user edits
while agent runs); git backend gives merge story but UI needs explicit guard.
Minimal version: notice + choice, no full diff UI yet.

### FILC-04 Unsaved-changes close guard

```gherkin
Given raw edit mode w/ unsaved changes
When user closes modal (ESC/out/X)
Then save fires first (FIL-05)
And if save fails, close blocked w/ FILC-02 error
```

**Why** `[I]`: FIL-05 + EXPC close interplay — close must not become a data-loss path.

## Implementation References

| Source | What to adapt |
|---|---|
| react-markdown + remark-gfm (ecosystem standard) | FIL-02 preview rendering |
| CodeMirror 6 / Shiki (per-type later) | FIL-03 raw edit + highlight path (FIL-04 now = plain textarea acceptable; CM6 when FIL-03 lands) |
| Repo `markdown-highlight-menu` feature | existing highlight-menu slice — extend for FIL-06/07 |
| UX pattern guide (research) | skeleton + error rules quoted in FILC-01/02 |

## Open Questions

- Highlight persistence across modal close/reopen — session-only propose; confirm.
- Ctrl+F scope: node file only vs whole project graph search (propose node-only now).

## FILX — IDE Line Numbers + Plain-Text Mode (added 2026-08-16, user dictation)

## FILX-01 Line numbers both modes

```gherkin
Given file visualization open (preview or raw mode)
Then IDE-style line numbers visible on left
And each line carries data-line anchor
So user can speak line numbers or line ranges to agent
```

**Why** (source: user 2026-08-16 — "line numbers on the left like in any normal IDE editor... so I can speak to line numbers or groups of line numbers to the agent and it knows what I'm talking about"): line-addressable content = voice targeting vocabulary for agent commands.

## FILX-02 Settings toggle default-on

```gherkin
Given settings panel open
Then line-numbers toggle exists
And default = ON
And choice persists across sessions
```

**Why** (source: same dictation — "toggleable off in settings but on by default"): some users want clean reading view; default serves the voice-first addressing use case.

## FILX-03 Plain-text button

```gherkin
Given preview mode shown
When user clicks plain-text button
Then markdown render toggles off
And raw text shown (still line-numbered)
```

**Why** (source: same dictation — "normal-text-rendering button that toggles it to text area"): inspect raw markdown source w/o losing line-number addressing.
