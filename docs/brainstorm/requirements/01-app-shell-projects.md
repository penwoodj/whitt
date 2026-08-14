# GWT — App Shell + Project Rail

> Suite 1/9. Source: user vision dictation 2026-08-14. IDs `APP-xx`.
> Each case carries **Why** — anchored to source quote where stated, `(inferred)` where derived.
> Related: `../user-flows.md` Flow A, K.

## APP-01 App opens into new empty project

```gherkin
Given user opens app
And no project selected
Then app opens into new blank project session
And graph shows single empty bubble of light
```

**Why** (source: "that's what the app opens into similar to a new chat session with
ChatGPT"): zero-friction start. Thinking tool must be immediately usable — no project
picker wall. Single bubble = entire initial UI; one voice prompt away from a graph.

## APP-02 Project rail fixed left

```gherkin
Given app open
Then project bubbles fixed to left edge of screen
And rail independent of graph state (pan/zoom/select never moves it)
```

**Why** (source: "fixed to the left and would be independent of what's going on in the
graph in front of you"): stable anchor. Infinite canvas has no borders/back button;
rail is the one spatial constant so orientation never breaks.

## APP-03 Prior projects listed as letter bubbles

```gherkin
Given user previously worked on projects
Then each project shows as small bubble on left rail
And bubble shows first letter of project title
```

**Why** (source: "very similar to open code you have these little icons That represent
project graphs"): proven pattern (OpenCode). Compact recognition over verbose lists;
letter = identity cue; bubble form = visual kinship w/ graph nodes.

## APP-04 New project bubble blank

```gherkin
Given new project created
Then title blank
And rail bubble shows no letter until title set
```

**Why** (inferred): title is user-owned; app never invents names. Blank until
spoken/typed — voice-first creation consistency.

## APP-05 Project title editable

```gherkin
Given project selected
When user clicks into title
Then title editable inline (Google-Doc-style)
And rail bubble letter updates to match new first letter
```

**Why** (source: "similar to Google Doc titles where you can Click into it to edit it"):
familiar direct-manipulation idiom, no rename modal. Title is FS artifact (project
folder name) — edit = rename, visible in rail letter immediately.

## APP-06 Select project loads graph

```gherkin
Given projects exist on rail
When user clicks project bubble
Then app loads that project graph
And last graph state restored
```

**Why** (inferred from spatial-memory pillar): project = ongoing thinking context.
Resume must return to exact arrangement user left — spatial memory is the point of canvas.

## APP-07 New project = fresh session

```gherkin
Given user clicks new-project bubble
Then canvas resets to single white bubble of light
Comparable to new chat session in ChatGPT
```

**Why** (source: explicit ChatGPT new-chat comparison): mental model = project is a
conversation w/ a graph. Fresh project starts as one ball of light you speak to.
