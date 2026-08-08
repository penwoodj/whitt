# ADR-0006: Whitt Folder Markdown YAML Slice

**Status:** Proposed  
**Date:** 2026-08-08  
**Supersedes:** none

## Context

Single source of truth for graph state. Markdown docs with YAML frontmatter drive graph behavior. Stored in .whitt/ folder. Git-friendly. Connects to ADR-0001 markdown-driven requirement.

## Decision

Store all graph state as markdown docs in .whitt/ folder. YAML frontmatter controls graph behavior: focus jump, expand details, edit nodes, expand graph. Git versioning applies automatically.

## Consequences

- Human-readable storage
- Git versioning works naturally
- YAML controls graph behavior
- All state recoverable from FS

## Features

### Feature: Create .whitt/ folder structure

On new project, create .whitt/ folder with standard structure. Folders for nodes, lines, settings.

```gherkin
Feature: Create .whitt/ folder structure
  As usr on graph
  I want .whitt/ folder created
  So I store graph state

  Scenario: Create folder on new project
    Given New project started
    When graph initializes
    Then .whitt/ folder created
    And nodes/ subfolder created
    And lines/ subfolder created
    And settings/ subfolder created

  Scenario: Validate existing folder
    Given Project has .whitt/ folder
    When graph initializes
    Then folder structure validated
    And missing folders created
```

### Feature: Node markdown docs

Each node = markdown doc. YAML frontmatter stores metadata. Body stores prompt, results.

```gherkin
Feature: Node markdown docs
  As usr on graph
  I want nodes as markdown
  So I edit nodes in text editor

  Scenario: Create node doc
    Given New node created
    Then markdown file created in nodes/
    And filename = node-id.md
    And YAML frontmatter includes: id, title, status, created_at

  Scenario: Read node doc
    Given node-123.md exists
    When graph loads
    Then markdown file read
    And YAML frontmatter parsed
    And body content loaded into node

  Scenario: Update node doc
    Given node-123.md exists
    When usr edits node prompt
    Then markdown file updated
    And body reflects changes
    And YAML frontmatter updated
```

### Feature: YAML frontmatter controls

YAML controls graph behavior. Fields: focus_jump, expand_details, edit_existing, expand_graph.

```gherkin
Feature: YAML frontmatter controls
  As usr on graph
  I want YAML control behavior
  So I script graph actions

  Scenario: Focus jump on load
    Given node-123.md has focus_jump: true
    When graph loads
    Then focus jumps to this node
    And node becomes active

  Scenario: Expand details on load
    Given node-123.md has expand_details: true
    When graph loads
    Then node detail panel opens
    And full content shows

  Scenario: Edit existing node
    Given node-123.md has edit_existing: true
    When usr loads graph
    Then node prompt becomes editable
    And usr can modify existing content

  Scenario: Expand graph off node
    Given node-123.md has expand_graph: true
    When graph loads
    Then child nodes load
    And lines connect parent to children
```

### Feature: Line markdown docs

Each line = markdown doc. YAML stores source, target, label. Body stores metadata.

```gherkin
Feature: Line markdown docs
  As usr on graph
  I want lines as markdown
  So I edit relationships in text editor

  Scenario: Create line doc
    Given Line created from A to B
    Then markdown file created in lines/
    And filename = line-A-B.md
    And YAML includes: source: A, target: B, label: "depends on"

  Scenario: Read line doc
    Given line-A-B.md exists
    When graph loads
    Then markdown file read
    And YAML parsed
    And line rendered on canvas

  Scenario: Update line label
    Given line-A-B.md exists
    When usr edits line label to "produces"
    Then markdown file updated
    And YAML label field changed
```

### Feature: Settings markdown docs

Settings stored as markdown. YAML stores configuration. Body stores descriptions.

```gherkin
Feature: Settings markdown docs
  As usr on graph
  I want settings as markdown
  So I version config changes

  Scenario: Create settings doc
    Given Settings initialized
    Then settings.md created in settings/
    And YAML includes: auto_accept_todos, voice_shortcut, model_endpoint

  Scenario: Read settings doc
    Given settings.md exists
    When graph loads
    Then settings read from file
    And UI reflects saved values

  Scenario: Update settings doc
    Given settings.md exists
    When usr changes settings
    Then markdown file updated
    And YAML fields changed
```

### Feature: Git-friendly storage

All changes tracked by git. Human-readable diffs. Easy rollback.

```gherkin
Feature: Git-friendly storage
  As usr on graph
  I want git track changes
  So I version graph state

  Scenario: Git tracks node edits
    Given node-123.md committed
    When usr edits node prompt
    And saves changes
    Then git diff shows human-readable markdown diff

  Scenario: Git tracks new nodes
    Given graph has 2 nodes
    When usr creates new node
    Then git status shows new .md file
    And commit includes new node

  Scenario: Rollback via git
    Given node-123.md has unwanted changes
    When usr runs git checkout node-123.md
    Then file reverts to previous version
    And graph reflects rollback
```

### Feature: Frontmatter validation

Validate YAML frontmatter on load. Reject invalid docs. Show errors.

```gherkin
Feature: Frontmatter validation
  As usr on graph
  I want YAML validated
  So I catch errors early

  Scenario: Validate required fields
    Given node-123.md missing required field
    When graph loads
    Then validation error shows
    And file marked as invalid
    And node not loaded

  Scenario: Validate field types
    Given node-123.md has status: "invalid_value"
    When graph loads
    Then validation error shows
    And field must be enum: idle, running, completed, failed

  Scenario: Show validation summary
    Given multiple files have errors
    When graph loads
    Then error list shows all invalid files
    And each error explains issue
```

## Dependencies

- ADR-0001: Voice Graph Vision (master vision)
- ADR-0004: Graph UI Node Line Settings Slices (node/line storage)
- ADR-0009: Git GitHub OAuth Slice (versioning)
