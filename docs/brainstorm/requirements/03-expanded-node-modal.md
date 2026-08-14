# GWT — Expanded Node Modal

> Suite 3/9. Source: user vision session 2026-08-14. IDs `EXP-xx`.
> Covers: expansion into detail modal, halo, bar of light, right-click open.
> Related: `../user-flows.md` Flow B, D.

## EXP-01 Send expands node into modal

```gherkin
Given node w/ prompt sent (double click)
Then node expands into soft-corner square modal (detail view)
And agent execution begins
```

## EXP-02 Ball becomes halo

```gherkin
Given node expanded into modal
Then ball of light becomes halo around expanded node
```

## EXP-03 Expansion auto-starts recording

```gherkin
Given node just expanded
Then STT recording starts immediately (same as unexpanded click behavior)
```

## EXP-04 Bar of light at top

```gherkin
Given node expanded
Then bar of light sits at top inside modal
And bar has soft corners + soft edges
```

## EXP-05 Bar hover opens input tooltip

```gherkin
Given expanded node
When user hovers bar of light
Then same tooltip input menu expands (edit text before send)
And behavior identical to unexpanded bubble tooltip (pin, edit, Enter send)
```

## EXP-06 Bar single click toggles STT

```gherkin
Given expanded node
When user single clicks bar of light
Then STT toggles on/off
Same as unexpanded bubble single click
And when on, text appends at end of input (or cursor position)
```

## EXP-07 Bar double click / Enter sends

```gherkin
Given expanded node w/ input content
When user double clicks bar of light OR presses Enter in focused input
Then prompt sent
```

## EXP-08 Bar breathes with voice

```gherkin
Given expanded node recording
Then bar of light breathes in line w/ speaker volume
Whether tooltip open or not
So speaking always visually indicated
```

## EXP-09 Right click opens without STT

```gherkin
Given node on graph
When user right clicks node
Then node opens expanded WITHOUT activating speech-to-text
So user can type/execute agent behavior manually
```

## EXP-10 Running indicated on ball

```gherkin
Given agent executing for node
Then ball of light (unexpanded form) indicates running state
```

## EXP-11 Expanded node close

```gherkin
Given node expanded
When user presses Escape OR clicks outside OR clicks close btn (X)
Then node collapses back to bubble form
```

Source: not in voice dictation — from ADR-0012 / AGENTS.md §17 node lifecycle
(expanded → collapsed: Escape OR click outside OR close btn).
