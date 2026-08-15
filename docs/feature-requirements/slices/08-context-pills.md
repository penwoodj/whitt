# Slice 08 — Context Pills

> Vertical slice: file selections → pills in STT tooltip → weighted prompt context.

## Positive Requirements

1. **PR-08-1** What ships with the prompt is VISIBLE before send (pills) — no hidden context.
2. **PR-08-2** Pills are individually removable (hover X) — context assembly is user-owned.
3. **PR-08-3** Pills address content precisely (line numbers) — shared user/agent vocabulary.
4. **PR-08-4** Selections weight agent attention (PIL-05) — pills are instructions, not decor.

## Inherited Cases (full GWT + Why: `../../brainstorm/requirements/07-context-pills.md`)

| ID | Summary |
|---|---|
| PIL-01 | Pills appear in STT tooltip on highlight (Cursor-style) |
| PIL-02 | Hover X removes pill |
| PIL-03 | Pills show line numbers (snippet open) |
| PIL-04 | Pause → highlight → speak → send composed prompt |
| PIL-05 | Pills direct agent attention/weighting |

## New Cases (gap-fill)

### PILC-01 Pill overflow stacking

```gherkin
Given more active highlights than fit one tooltip row
Then pills wrap to additional rows (tooltip grows, capped)
And beyond cap (~6), excess collapse into "+N more" pill
And "+N" pill expands a list on click
```

**Why** `[C]`: chip-overflow convention (filter bars everywhere); keeps tooltip
usable when user ctrl-highlights a dozen passages.

### PILC-02 Pill hover preview

```gherkin
Given context pill hovered
Then small preview shows the highlighted text snippet + line range
And preview includes jump affordance (click → scrolls visualizer to highlight)
```

**Why** `[C]`: Cursor context-chip behavior (hover = verify what chip contains);
jump closes the loop pill→source so user can double-check what they're sending.

## Implementation References

| Source | What to adapt |
|---|---|
| Cursor / agentic-editor context chips (product reference) | pill visual grammar |
| Repo `markdown-highlight-menu` + Node tooltip (slice 02/07 surfaces) | host surfaces — pills slot into existing STT tooltip |
| shadcn Chip/Badge patterns | removable-chip w/ hover X (PIL-02) |

## Open Questions

- PIL-03 snippet content (open #8 in brainstorm summary): PILC-02 puts snippet in hover — resolves the open question by placement (pill = lines, hover = snippet). Confirm w/ user.
