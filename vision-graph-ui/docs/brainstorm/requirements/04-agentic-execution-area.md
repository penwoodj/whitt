# GWT — Agentic Execution Area

> Suite 4/9. Source: user vision session 2026-08-14. IDs `EXE-xx`.
> Covers: execution visualization, YAML workflow tooltip, status bar, morphing loader, confirm flow.
> Related: `../user-flows.md` Flow B, D, E. Deeper page design deferred (user: "explain more later").

## EXE-01 Execution area below bar of light

```gherkin
Given node expanded
Then agentic execution area sits below bar of light
And area visualizes what is going to execute
```

## EXE-02 Double left click executes immediately

```gherkin
Given execution area w/ pending workflow
When user double left clicks
Then workflow executes immediately
```

## EXE-03 Double right click opens confirm

```gherkin
Given execution area w/ pending workflow
When user double right clicks
Then confirm dialog shows what will execute
And execution waits for user confirmation
```

## EXE-04 Hover expands execution tooltip

```gherkin
Given execution area
When user hovers it
Then details tooltip expands (same interaction pattern as STT tooltip)
And tooltip positioned right of node
```

## EXE-05 Tooltip pins on click

```gherkin
Given execution tooltip open
When user clicks tooltip OR clicks into it
Then tooltip stays open (same pin semantics as input tooltip)
```

## EXE-06 YAML workflow visualizer

```gherkin
Given execution tooltip open
Then tooltip shows YAML visualizer of workflow
```

## EXE-07 YAML sections colored + expandable

```gherkin
Given YAML visualizer shown
Then different sections different colors
And sections expandable/collapsible
```

## EXE-08 Dense YAML padding

```gherkin
Given YAML visualizer shown
Then small indent padding per level
And minimal padding between settings/elements
Dense, information-forward
```

## EXE-09 Status bar minimal info card

```gherkin
Given node expanded
Then metadata status bar shows below bar of light
And bar is rounded-corner small card w/ very minimal information
```

## EXE-10 Status bar hover affordance

```gherkin
Given status bar shown
When user hovers
Then slight color change
And execution tooltip expands (see EXE-04)
```

## EXE-11 Breathing edges while executing

```gherkin
Given agent executing
Then status bar edges breathe
And when idle, bar stays still
```

## EXE-12 Border animations (eventual)

```gherkin
Given agent executing
Then status bar border animates (future polish)
More shape-expressive than ball glow
```

## EXE-13 Status text + loader only

```gherkin
Given status bar shown
Then bar contains only:
| status text
| loading indicator
Nothing else (minimal)
```

## EXE-14 Morphing icon loader

```gherkin
Given agent executing
Then loading indicator = icon morphing into next icon
Continuous morph cycle while execution runs
Style like Rovo / Claude loading indicators
```

## EXE-15 Current step title

```gherkin
Given agent executing
Then status bar shows title of current step
And title changes as execution progresses steps
Like agent chat apps' activity titles
```

## EXE-16 Panel updates during execution

```gherkin
Given agent executing
Then execution tooltip/panel updates w/ info relevant to user
Live, not after completion
```

## EXE-17 File preview appears on creation

```gherkin
Given agent execution creates node markdown file
Then file text content displays in preview form
Inside expanded node (file visualization area)
```
