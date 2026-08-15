# GWT — File Visualization + Editing

> Suite 6/9. Source: user vision dictation 2026-08-14. IDs `FIL-xx`.
> Covers: file preview in details expansion, raw edit toggle, save-on-blur, future file types.
> Related: `../user-flows.md` Flow E, I.

## FIL-01 File visualization area

```gherkin
Given node expanded (details expansion)
Then file visualization area sits underneath execution area
And shows node's file content
```

**Why** (source: "Underneath that in the details expansion of a node, I want the file
visualization area for that file"): node = file (ADR-0011); expanded node's job is to
show that file. Reading position below execution area = voice/execution context on
top, content below.

## FIL-02 Markdown preview default

```gherkin
Given node has markdown file
Then visualization renders markdown preview
```

**Why** (inferred from "It displays the text content in a preview way"): nodes are md
files first; preview = reading-optimized form. Thinking tool reads documents, not
markdown syntax.

## FIL-03 Non-markdown support (eventual)

```gherkin
Given future file types supported
Then specialized syntax highlighting per type
And specialized editing features per type
```

**Why** (source: "Eventually when we expand to the point of supporting non-markdown
files We would need extra Specialized syntax highlighting and editing features"):
md-first scope now; per-type fidelity later. Placeholder so architecture doesn't
hard-code md.

## FIL-04 Edit icon toggles raw markdown

```gherkin
Given file visualization shown
When user clicks edit icon button
Then area toggles to raw text markdown
And text editable
```

**Why** (source: "There would be a button in the visualization menu to toggle it to
raw text Markdown where you can edit the text ... an edit icon"): explicit toggle —
preview for reading, raw for editing; icon = standard edit affordance. User owns the
artifact, not just the agent.

## FIL-05 Save on focus leave

```gherkin
Given raw edit mode active
When focus leaves text area
Then changes saved
```

**Why** (source: "when focus leaves the text area input for the file ... It saves the
changes made through the edit"): no save button — leaving = committing. Frictionless
persistence matches voice-first flow; pairs w/ GIT-01 (save = commit).

## FIL-06 Ctrl multi-highlight

```gherkin
Given file visualization shown
When user ctrl-highlights multiple areas
Then multi-highlight + multi-select maintained
And highlighted areas keep persistent visual highlight while selected
For speaking to specific content areas
```

**Why** (source: "different areas of the file visualization can be highlighted with
control multi-highlight and multi-select capabilities ... and speak to different areas
or pieces of the content"): targeting — complex thoughts reference multiple passages
at once; selection is the pointing gesture for voice (feeds PIL).

## FIL-07 Ctrl+F highlight

```gherkin
Given file visualization shown
When user ctrl+F searches
Then matches highlighted in visualizer
```

**Why** (source: "and control F capabilities to highlight the visualizer"): find =
fastest path to the passage worth speaking about; search hits become speakable
selections.
