# Slice 05 — Agentic Execution Visualization

> Vertical slice: status bar, execution tooltip (YAML visualizer), morphing loader,
> step titles, execute/confirm gestures, live panel updates, result preview handoff.

## Positive Requirements

1. **PR-05-1** Execution state is ambient: what's running + current step visible without
   opening anything (EXE-13/15).
2. **PR-05-2** Detail is one hover away: full YAML workflow in a pinned tooltip (EXE-04..08).
3. **PR-05-3** Two launch gestures: immediate (dbl-left) and confirm-first (dbl-right)
   — same workflow, different trust levels (EXE-02/03).
4. **PR-05-4** Panel reflects live execution, never stale (EXE-16).
5. **PR-05-5** Created files surface immediately in the node's preview area (EXE-17).

## Inherited Cases (full GWT + Why: `../../broader-vision/requirements/04-agentic-execution-area.md`)

| ID | Summary |
|---|---|
| EXE-01 | Execution area below bar of light, visualizes what will execute |
| EXE-02 | Double left click = immediate execute |
| EXE-03 | Double right click = confirm dialog first |
| EXE-04 | Hover expands details tooltip (right of node) |
| EXE-05 | Tooltip pins on click (same idiom as input) |
| EXE-06 | YAML visualizer of workflow |
| EXE-07 | Sections colored + expandable |
| EXE-08 | Dense padding (small indent, minimal gaps) |
| EXE-09 | Status bar: rounded minimal card |
| EXE-10 | Status bar hover: slight color change + tooltip expands |
| EXE-11 | Edges breathe while executing, still when idle |
| EXE-12 | Border animations eventual |
| EXE-13 | Status text + loader only |
| EXE-14 | Morphing icon loader (Rovo/Claude style) |
| EXE-15 | Current step title, changes per step |
| EXE-16 | Panel updates live during execution |
| EXE-17 | File preview appears on creation |

## New Cases (convention-derived gap-fill)

### EXEC-01 Confirm dialog content = YAML tooltip + action buttons

```gherkin
Given double right click on execution area
Then confirm dialog shows the SAME YAML visualizer as EXE-06 (read-only)
Plus execute + cancel actions
And no second/different preview format
```

**Why** `[I]`: resolves open question #3 (confirm-dialog vs YAML-tooltip overlap) —
reuse beats reinvention; user sees exactly what will run before confirming.

### EXEC-02 Step title truncation + full text on hover

```gherkin
Given status bar step title longer than bar width
Then title ellipsizes to one line
And hover shows full step title tooltip
```

**Why** `[C]`: agent-chat status-line convention (Claude/Cursor activity lines
truncate + hover-reveal); keeps EXE-13 minimalism intact.

### EXEC-03 YAML parse/Load failure state

```gherkin
Given workflow YAML fails to parse or load
Then YAML tooltip shows persistent inline error (cause + raw text fallback)
And execute gestures disabled until valid
And error never silently swallowed
```

**Why** `[C]`: error-pattern rules applied to the YAML surface — the tooltip IS a
viewer; invalid input must degrade visibly, raw-text fallback preserves inspectability.

### EXEC-04 Execution error state

```gherkin
Given agent step fails
Then status bar shows error state (color + icon, still edges)
And step title names the failed step
And tooltip shows error detail at failure point
And retry affordance present
```

**Why** `[C]`: ragflow-derived pattern (running-node states via events) + error rules;
user must diagnose + retry from the canvas without leaving the node.

### EXEC-05 Completion state

```gherkin
Given execution finishes successfully
Then loader stops, done-glow per LGT-01 (fade ~2s)
And status bar settles still w/ final step title
And preview area (FIL) shows final file state
```

**Why** `[I]`: completes the execution lifecycle; LGT open question (done decay) wired
here as proposal pending visual confirmation.

## Implementation References

| Source | What to adapt |
|---|---|
| ragflow (research survey §6) | event-driven node states: `NodeStarted/Finished` → derived busy-set (no prop drilling); spinner-on-running pattern → our LGT states |
| border-beam conic/`offset-path: border-box` | EXE-12 border animations (trailing light along modal border) |
| gradient-components `flow` mode | animated energy flow along the status bar edge while executing |
| React Flow Node Status Indicator (UI component) | badge pattern for step title slot |

## Open Questions

- Event transport (WebSocket vs polled FS events) from whitt-execution-engine — engine slice decision, UI consumes event stream either way.
- Morph icon set final art (LGT-04 open) — pick at design pass.
