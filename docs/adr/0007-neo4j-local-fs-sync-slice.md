# ADR-0007: Neo4j Local FS Sync Slice

**Status:** Proposed  
**Date:** 2026-08-08  
**Supersedes:** none

## Context

Graph queries need speed. Local FS is truth but slow. Neo4j provides fast graph queries. Dual storage: Neo4j for speed, FS for truth. Sync keeps both in sync. Connects to ADR-0001 memory requirement.

## Decision

Implement dual storage: Neo4j for queries, local FS for truth. Sync layer keeps Neo4j updated when FS changes. FS remains single source of truth.

## Consequences

- Fast graph queries
- Reliable FS storage
- Sync complexity
- Neo4j dependency

## Features

### Feature: Initialize Neo4j connection

Connect to local Neo4j instance. Create database schema. Verify connection.

```gherkin
Feature: Initialize Neo4j connection
  As usr on graph
  I want Neo4j connected
  So I query graph fast

  Scenario: Connect on startup
    Given Neo4j running locally
    When graph app starts
    Then connection established
    And database schema created
    And connection status shows "connected"

  Scenario: Handle connection failure
    Given Neo4j not running
    When graph app starts
    Then connection fails
    And error msg shows "Neo4j unavailable"
    And app falls back to FS-only mode
```

### Feature: Sync nodes to Neo4j

Read node markdown docs from FS. Write to Neo4j as nodes. Keep in sync on changes.

```gherkin
Feature: Sync nodes to Neo4j
  As usr on graph
  I want nodes in Neo4j
  So I query node relationships fast

  Scenario: Initial sync of all nodes
    Given FS has 5 node docs
    And Neo4j empty
    When sync runs
    Then 5 nodes created in Neo4j
    And node properties match YAML frontmatter

  Scenario: Sync new node
    Given FS and Neo4j synced
    When usr creates new node doc
    Then sync detects new file
    And node added to Neo4j

  Scenario: Sync node update
    Given node-123.md exists in FS and Neo4j
    When usr edits node title
    Then sync detects change
    And Neo4j node updated
```

### Feature: Sync lines to Neo4j

Read line markdown docs from FS. Write to Neo4j as relationships. Keep in sync on changes.

```gherkin
Feature: Sync lines to Neo4j
  As usr on graph
  I want lines in Neo4j
  So I query relationships fast

  Scenario: Initial sync of all lines
    Given FS has 3 line docs
    And Neo4j has nodes
    When sync runs
    Then 3 relationships created in Neo4j
    And relationships connect correct nodes

  Scenario: Sync new line
    Given FS and Neo4j synced
    When usr creates new line doc
    Then sync detects new file
    And relationship added to Neo4j

  Scenario: Sync line label update
    Given line-A-B.md exists in FS and Neo4j
    When usr edits line label
    Then sync detects change
    And Neo4j relationship updated
```

### Feature: Query graph from Neo4j

Query nodes and relationships from Neo4j. Return results to UI. Much faster than FS scans.

```gherkin
Feature: Query graph from Neo4j
  As usr on graph
  I want query Neo4j
  So I get fast results

  Scenario: Query all nodes
    Given Neo4j has 100 nodes
    When UI requests all nodes
    Then query returns all nodes
    And response time < 100ms

  Scenario: Query node relationships
    Given Node A connected to B, C, D
    When UI requests neighbors of A
    Then query returns B, C, D
    And response time < 50ms

  Scenario: Query by status
    Given Neo4j has mixed node statuses
    When UI requests failed nodes
    Then query returns only failed nodes
```

### Feature: Watch FS for changes

Watch .whitt/ folder for file changes. Trigger sync on change. Debounce rapid changes.

```gherkin
Feature: Watch FS for changes
  As usr on graph
  I want FS watched
  So Neo4j stays synced

  Scenario: Detect file creation
    Given FS watcher active
    When usr creates new node doc
    Then watcher detects creation
    And sync triggered

  Scenario: Detect file modification
    Given FS watcher active
    When usr edits existing node doc
    Then watcher detects modification
    And sync triggered

  Scenario: Debounce rapid changes
    Given FS watcher active
    When usr saves file 3 times in 1 second
    Then sync triggered once after debounce
    And only final state synced
```

### Feature: Handle sync conflicts

Detect conflicts between FS and Neo4j. Resolve by trusting FS. Log conflicts for review.

```gherkin
Feature: Handle sync conflicts
  As usr on graph
  I want conflicts resolved
  So Neo4j matches FS

  Scenario: FS wins conflict
    Given Neo4j node has different title than FS
    When sync runs
    Then Neo4j updated to match FS
    And conflict logged

  Scenario: Log conflict details
    Given sync conflict detected
    Then log entry shows: file path, field, FS value, Neo4j value
    And log saved to sync-conflicts.log

  Scenario: Show conflict count in UI
    Given conflicts occurred during sync
    Then UI shows conflict notification
    And notification shows conflict count
```

### Feature: Fallback to FS-only

If Neo4j unavailable, fall back to FS-only mode. Show warning. Continue with degraded performance.

```gherkin
Feature: Fallback to FS-only
  As usr on graph
  I want fallback if Neo4j fails
  So I keep working

  Scenario: Detect Neo4j failure
    Given Neo4j connection lost
    When query attempted
    Then error caught
    And fallback to FS-only mode triggered

  Scenario: Show fallback warning
    Given FS-only mode active
    Then UI shows warning "Neo4j unavailable, using FS"
    And warning persists until Neo4j returns

  Scenario: Reconnect to Neo4j
    Given FS-only mode active
    When Neo4j becomes available
    Then reconnection attempted
    And sync runs to catch up
    And normal mode restored
```

## Dependencies

- ADR-0001: Voice Graph Vision (master vision)
- ADR-0006: Whitt Folder Markdown YAML Slice (FS truth)
- Neo4j local instance
