# GWT — Context Pills in STT Tooltip

> Suite 7/9. Source: user vision session 2026-08-14. IDs `PIL-xx`.
> Covers: highlighted content → context pills, pill removal, line numbers, highlight-then-speak flow.
> Related: `../user-flows.md` Flow F.

## PIL-01 Pills appear on highlight

```gherkin
Given file visualization areas highlighted (FIL-06/07)
And STT tooltip open
Then context pills appear in tooltip
Visualizing highlighted selections
Style like Cursor/agentic-editor context chips
```

## PIL-02 Pills removable

```gherkin
Given context pill shown
When user hovers pill
Then X button appears
And clicking X removes pill from prompt context
```

## PIL-03 Pills show line numbers

```gherkin
Given context pill shown
Then pill shows line numbers of its active highlight
```

Open: whether pill also shows text snippet of highlight
(source compares to Cursor/agentic-editor context chips, which show
filename + snippet + lines; only line numbers explicitly stated).

## PIL-04 Highlight while paused, then speak

```gherkin
Given STT paused
When user highlights areas of visualization
And speaks prompt
Then highlights captured as pills + spoken text
Both sent as prompt context together
```

## PIL-05 Selections direct agent attention

```gherkin
Given prompt sent w/ context pills
Then agent focuses on pill'd areas
More than rest of graph
(highlighted chunks = weighted context)
```
