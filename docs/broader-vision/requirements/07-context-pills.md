# GWT — Context Pills in STT Tooltip

> Suite 7/9. Source: user vision dictation 2026-08-14. IDs `PIL-xx`.
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

**Why** (source: "there will be a little context pill visual pill visualizer in the
speech to text tool tip when those things are highlighted similar to how context text
is visualized and cursor or in other agentic text editors"): proven agentic-editor
pattern — selections become visible prompt ingredients. User sees exactly what
context ships with the prompt; no hidden context.

## PIL-02 Pills removable

```gherkin
Given context pill shown
When user hovers pill
Then X button appears
And clicking X removes pill from prompt context
```

**Why** (source: "those would be removable with an X button on them on hover"):
context assembly is user-controlled — drop a selection without un-highlighting the
file; hover-reveal keeps pills visually clean at rest.

## PIL-03 Pills show line numbers

```gherkin
Given context pill shown
Then pill shows line numbers of its active highlight
```

**Why** (source: "show line numbers in the speech to text tooltip of the things that
are highlighted actively"): precise addressing — line numbers disambiguate WHICH
passage when several pills stack; shared vocabulary between user and agent output.

Open: whether pill also shows text snippet (Cursor-style filename+snippet) — only
line numbers explicitly stated in source.

## PIL-04 Highlight while paused, then speak

```gherkin
Given STT paused
When user highlights areas of visualization
And speaks prompt
Then highlights captured as pills + spoken text
Both sent as prompt context together
```

**Why** (source: "So when you pause speech-to-text you can highlight different things
and speak to them before sending the prompt"): pause is for aiming — mouse selects
while voice is silent, then voice narrates over the aim. Gesture+speech compose into
one prompt.

## PIL-05 Selections direct agent attention

```gherkin
Given prompt sent w/ context pills
Then agent focuses on pill'd areas
More than rest of graph
(highlighted chunks = weighted context)
```

**Why** (source earlier vision session: "By doing so you are directing the agent that
you're speaking to focus on different elements more than others of the graph"):
pills are not decoration — they are attention weights. Selection = instruction.
