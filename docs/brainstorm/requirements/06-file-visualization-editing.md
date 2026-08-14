# GWT — File Visualization + Editing

> Suite 6/9. Source: user vision session 2026-08-14. IDs `FIL-xx`.
> Covers: file preview in details expansion, raw edit toggle, save-on-blur, future file types.
> Related: `../user-flows.md` Flow E, I.

## FIL-01 File visualization area

```gherkin
Given node expanded (details expansion)
Then file visualization area sits underneath execution area
And shows node's file content
```

## FIL-02 Markdown preview default

```gherkin
Given node has markdown file
Then visualization renders markdown preview
```

## FIL-03 Non-markdown support (eventual)

```gherkin
Given future file types supported
Then specialized syntax highlighting per type
And specialized editing features per type
```

## FIL-04 Edit icon toggles raw markdown

```gherkin
Given file visualization shown
When user clicks edit icon button
Then area toggles to raw text markdown
And text editable
```

## FIL-05 Save on focus leave

```gherkin
Given raw edit mode active
When focus leaves text area
Then changes saved
```

## FIL-06 Ctrl multi-highlight

```gherkin
Given file visualization shown
When user ctrl-highlights multiple areas
Then multi-highlight + multi-select maintained
And highlighted areas keep persistent visual highlight while selected
For speaking to specific content areas
```

## FIL-07 Ctrl+F highlight

```gherkin
Given file visualization shown
When user ctrl+F searches
Then matches highlighted in visualizer
```
