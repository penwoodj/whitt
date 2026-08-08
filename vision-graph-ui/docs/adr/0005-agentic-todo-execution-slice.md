# ADR-0005: Agentic Todo Execution Slice

**Status:** Proposed  
**Date:** 2026-08-08  
**Supersedes:** none

## Context

Agentic system needs UI for todo execution. User sees progress, costs, results. Auto-accept default on. Connects to ADR-0001 agentic todo dropdown requirement.

## Decision

Build agentic todo execution UI. Dropdown showing todo items with progress + cost. Auto-accept toggle in settings. Real-time updates as todos complete.

## Consequences

- User visibility into agentic execution
- Cost tracking per todo
- Auto-accept behavior configurable
- Integration with ADR-0004 NodeAgenticTodos

## Features

### Feature: Show todo dropdown after prompt

After prompt submit, dropdown appears showing all agentic todos. Each todo shows status, progress, cost.

```gherkin
Feature: Show todo dropdown after prompt
  As usr on graph
  I want see todo dropdown
  So I know what agentic system doing

  Scenario: Dropdown appears on submit
    Given Active node w/ prompt submitted
    When agentic system generates todos
    Then todo dropdown appears below node
    And dropdown shows todo items
    And each item shows title

  Scenario: Show todo status
    Given Todo dropdown visible
    Then each todo shows status icon
    And status can be: pending, running, completed, failed

  Scenario: Show todo progress
    Given Todo dropdown visible
    And todo running
    Then progress bar shows completion percentage
    And progress updates in real-time
```

### Feature: Auto-accept todos

Auto-accept toggle in settings. When on, todos start automatically. When off, user manually starts each todo.

```gherkin
Feature: Auto-accept todos
  As usr on graph
  I want auto-accept todos
  So I don't manually start each one

  Scenario: Auto-start todos when toggle on
    Given Auto-accept toggle on
    When prompt submitted
    Then todos start automatically
    And no manual action needed

  Scenario: Manual start when toggle off
    Given Auto-accept toggle off
    When prompt submitted
    Then todos show "start" btn
    When usr clicks "start" on todo
    Then that todo begins execution

  Scenario: Cancel individual todo
    Given Todo running
    When usr clicks "cancel" on todo
    Then todo stops execution
    And status changes to "cancelled"
```

### Feature: Show cost per todo

Each todo shows estimated cost. Total cost shown at bottom. Costs update as execution progresses.

```gherkin
Feature: Show cost per todo
  As usr on graph
  I want see cost per todo
  So I track expenses

  Scenario: Show estimated cost
    Given Todo dropdown visible
    Then each todo shows estimated cost
    And cost shows in credits/tokens

  Scenario: Show actual cost after completion
    Given Todo completed
    Then cost updates to actual value
    And actual cost may differ from estimate

  Scenario: Show total cost
    Given Todo dropdown visible
    Then total cost shown at bottom
    And total sums all todo costs
    And total updates as todos complete
```

### Feature: Todo results display

When todo completes, results display in dropdown. User can expand to see full output.

```gherkin
Feature: Todo results display
  As usr on graph
  I want see todo results
  So I verify agentic work

  Scenario: Show completion summary
    Given Todo completed
    Then todo shows "completed" status
    And summary shows "generated 3 docs"

  Scenario: Expand to see full results
    Given Todo completed
    When usr clicks todo item
    Then todo expands
    And full results show
    And results include generated content

  Scenario: Copy results to clipboard
    Given Todo expanded showing results
    When usr clicks "copy" btn
    Then results copied to clipboard
    And confirmation shows
```

### Feature: Todo error handling

Handle todo failures. Show error messages. Retry capability.

```gherkin
Feature: Todo error handling
  As usr on graph
  I want handle todo errors
  So I retry failed tasks

  Scenario: Show error on failure
    Given Todo failed
    Then todo shows "failed" status
    And error msg shows
    And error details expandable

  Scenario: Retry failed todo
    Given Todo failed
    When usr clicks "retry" btn
    Then todo restarts
    And status changes to "running"

  Scenario: Skip failed todo
    Given Todo failed
    When usr clicks "skip" btn
    Then todo marked as skipped
    And next todo starts
```

### Feature: Todo dependencies

Some todos depend on others. Show dependency chains. Block execution until dependencies complete.

```gherkin
Feature: Todo dependencies
  As usr on graph
  I want see todo dependencies
  So I understand execution order

  Scenario: Show dependency indicators
    Given Todo B depends on Todo A
    Then Todo B shows "waiting for A"
    And Todo B disabled until A completes

  Scenario: Execute in dependency order
    Given Todo A and Todo B (B depends on A)
    When todos start
    Then Todo A executes first
    And Todo B waits for A completion
    Then Todo B starts after A completes

  Scenario: Block on dependency failure
    Given Todo A failed
    And Todo B depends on A
    Then Todo B shows "blocked"
    And Todo B cannot start
```

## Dependencies

- ADR-0001: Voice Graph Vision (master vision)
- ADR-0004: Graph UI Node Line Settings Slices (NodeAgenticTodos)
- ADR-0006: Whitt Folder Markdown YAML Slice (todo result storage)
