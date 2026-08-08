# ADR-0010: Time Travel Slice

**Status:** Proposed  
**Date:** 2026-08-08  
**Supersedes:** none

## Context

User wants to view past graph states. Git commit log provides history. Navigate through versions. Restore past state. Connects to ADR-0001 time travel requirement.

## Decision

Build time travel UI using git commit log. User navigates graph history. View past state. Restore to current if desired. Edits disabled while viewing history.

## Consequences

- Full history navigation
- Restore capability
- Git dependency
- Complex UI for history browsing

## Features

### Feature: Show time travel UI

Panel showing commit list. Each commit shows timestamp, graph preview, change summary. Accessible from toolbar.

```gherkin
Feature: Show time travel UI
  As usr on graph
  I want time travel panel
  So I view graph history

  Scenario: Open time travel panel
    Given Graph page loaded
    When usr clicks "time travel" icon
    Then time travel panel opens
    And commit list shows

  Scenario: Show commit metadata
    Given Time travel panel open
    Then each commit shows: timestamp, node_count, line_count
    And commit msg shows
    And change summary shows

  Scenario: Show graph preview
    Given Time travel panel open
    When usr hovers over commit
    Then mini graph preview shows
    And preview represents that commit's state
```

### Feature: Navigate to past commit

User selects past commit. Graph renders that state. Current view labeled "viewing history". Edits disabled.

```gherkin
Feature: Navigate to past commit
  As usr on graph
  I want navigate to past commit
  So I view historical state

  Scenario: Select past commit
    Given Time travel panel open
    And commit list shows 10 commits
    When usr selects commit 5
    Then graph renders commit 5 state
    And current view shows "viewing history: commit 5"
    And all edit controls disabled

  Scenario: Disable edits in history view
    Given Viewing historical commit
    When usr attempts to edit node
    Then edit blocked
    And msg shows "edits disabled in history view"

  Scenario: Show history indicator
    Given Viewing historical commit
    Then prominent banner shows "HISTORY MODE"
    And banner shows commit hash
    And banner shows timestamp
```

### Feature: Restore from history

User can restore historical state to current. Creates new commit. Returns to current mode.

```gherkin
Feature: Restore from history
  As usr on graph
  I want restore from history
  So I revert to past state

  Scenario: Restore commit to current
    Given Viewing historical commit
    When usr clicks "restore this" btn
    Then confirmation dialog shows
    And dialog explains: "creates new commit from past state"

  Scenario: Confirm restore
    Given Confirmation dialog open
    When usr confirms
    Then files reverted to past state
    And new commit created
    And commit msg "restored from commit <hash>"
    And user returned to current mode

  Scenario: Cancel restore
    Given Confirmation dialog open
    When usr cancels
    Then restore aborted
    And user remains in history view
```

### Feature: Compare commits

User compares two commits. Shows diff. Highlights changed nodes and lines.

```gherkin
Feature: Compare commits
  As usr on graph
  I want compare commits
  So I see what changed

  Scenario: Select two commits for compare
    Given Time travel panel open
    When usr selects commit A
    And holds Shift + selects commit B
    Then compare mode activates
    And diff panel shows

  Scenario: Show changed nodes
    Given Compare mode active
    Then nodes added in B highlighted green
    And nodes removed in B highlighted red
    And nodes modified highlighted yellow

  Scenario: Show changed lines
    Given Compare mode active
    Then lines added in B highlighted green
    And lines removed in B highlighted red
    And line label changes shown
```

### Feature: Search commit history

User searches commits by msg, date, or changed files. Filters commit list.

```gherkin
Feature: Search commit history
  As usr on graph
  I want search commits
  So I find specific change

  Scenario: Search by commit msg
    Given Time travel panel open
    When usr types "web research" in search
    Then commit list filtered
    And only commits matching "web research" show

  Scenario: Search by date range
    Given Time travel panel open
    When usr selects date range
    Then commit list filtered
    And only commits in range show

  Scenario: Search by changed files
    Given Time travel panel open
    When usr searches for "node-123.md"
    Then commit list filtered
    And only commits touching that file show
```

### Feature: Animate time travel transitions

Smooth transitions between commits. Graph morphs from old state to new state. Visual feedback.

```gherkin
Feature: Animate time travel transitions
  As usr on graph
  I want smooth transitions
  So I see how graph evolved

  Scenario: Animate node position changes
    Given Viewing commit A
    When usr selects commit B
    Then nodes animate to new positions
    And transition duration 500ms

  Scenario: Animate node appearance/disappearance
    Given Viewing commit A
    When usr selects commit B
    Then new nodes fade in
    And removed nodes fade out

  Scenario: Animate line changes
    Given Viewing commit A
    When usr selects commit B
    Then new lines draw in
    And removed lines fade out
```

### Feature: Branch from historical commit

User creates new branch from historical commit. Edits enabled on new branch. Switch between branches.

```gherkin
Feature: Branch from historical commit
  As usr on graph
  I want branch from history
  So I explore alternate paths

  Scenario: Create branch from history
    Given Viewing historical commit
    When usr clicks "branch from here" btn
    Then branch name dialog shows
    When usr enters branch name
    Then new branch created from commit
    And user switched to new branch

  Scenario: Edit on new branch
    Given On new branch created from history
    Then edits enabled
    And changes commit to new branch
    And original branch unchanged

  Scenario: Switch branches
    Given Multiple branches exist
    When usr selects branch from dropdown
    Then graph switches to that branch
    And current branch indicator updates
```

## Dependencies

- ADR-0001: Voice Graph Vision (master vision)
- ADR-0009: Git GitHub OAuth Slice (git commits with metadata)
