# GWT — App Shell + Project Rail

> Suite 1/9. Source: user vision session 2026-08-14. IDs `APP-xx`.
> Related: `../user-flows.md` Flow A, K.

## APP-01 App opens into new empty project

```gherkin
Given user opens app
And no project selected
Then app opens into new blank project session
And graph shows single empty bubble of light
```

## APP-02 Project rail fixed left

```gherkin
Given app open
Then project bubbles fixed to left edge of screen
And rail independent of graph state (pan/zoom/select never moves it)
```

## APP-03 Prior projects listed as letter bubbles

```gherkin
Given user previously worked on projects
Then each project shows as small bubble on left rail
And bubble shows first letter of project title
```

Design reference: rail similar to OpenCode's project icons
(source: "very similar to open code you have these little icons
That represent project graphs").

## APP-04 New project bubble blank

```gherkin
Given new project created
Then title blank
And rail bubble shows no letter until title set
```

## APP-05 Project title editable

```gherkin
Given project selected
When user clicks into title
Then title editable inline (Google-Doc-style)
And rail bubble letter updates to match new first letter
```

## APP-06 Select project loads graph

```gherkin
Given projects exist on rail
When user clicks project bubble
Then app loads that project graph
And last graph state restored
```

## APP-07 New project = fresh session

```gherkin
Given user clicks new-project bubble
Then canvas resets to single white bubble of light
Comparable to new chat session in ChatGPT
```
