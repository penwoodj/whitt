# ADR-0001: Voice Graph Vision

**Status:** Proposed  
**Date:** 2026-08-08  
**Supersedes:** none

## Context

Voice-driven agentic graph UI needs clear direction. Infinite canvas fish-eye visualization. Local-first, offline-capable. Voice + mouse input. Agentic generation from markdown + YAML. Git versioning. This ADR defines master vision all other slices follow.

## Decision

Build voice + mouse infinite canvas graph UI with local llama.cpp models, Whisper STT, markdown-driven behavior, Neo4j + FS sync, web research, Git versioning, time travel via git log.

## Consequences

- All other ADRs implement subsets of this vision
- ADR-0004 is first build slice (Node/Line/Settings)
- React Flow for graph canvas (scalable to fish-eye later)
- Markdown + YAML = single source of truth
- Git = versioning + backup, invisible except "sync remote" btn
- Time travel = git commit log traversal

## Features

### Feature: Voice input to active node

User speaks, text streams to active node's prompt area. Ctrl+Space toggles rec. Enter/Send submits prompt separately.

```gherkin
Feature: Voice input to active node
  As usr on graph
  I want voice input stream to active node
  So I talk to graph w/out typing

  Scenario: Start rec on Ctrl+Space
    Given Active node w/ prompt area empty
    When usr presses Ctrl+Space
    Then mic btn shows rec
    And STT starts
    And transcribed txt streams to prompt area

  Scenario: Stop rec on Ctrl+Space
    Given mic btn rec active
    When usr presses Ctrl+Space
    Then mic btn shows stop
    And STT stops
    And transcribed txt saved to prompt area

  Scenario: Submit prompt on Enter
    Given Active node w/ txt in prompt area
    When usr presses Enter
    Then prompt submitted to agentic system
    And agentic todo dropdown appears
    And mic btn stays off
```

### Feature: Active node selection

One node active at a time. Voice typing goes to active node. Click node to activate. Visual indicator shows active state.

```gherkin
Feature: Active node selection
  As usr on graph
  I want one active node
  So I know where voice input goes

  Scenario: Activate node on click
    Given Graph w/ multiple nodes
    When usr clicks Node A
    Then Node A shows active indicator
    And all other nodes show inactive
    And voice input targets Node A

  Scenario: Keep active state during rec
    Given Node A active
    And mic btn rec active
    When usr clicks Node B
    Then rec stops
    And Node B becomes active
    And previous txt saved to Node A
```

### Feature: Agentic todo dropdown

After prompt submit, dropdown shows agentic execution. Auto-accept default on (toggle in settings). Shows progress + cost.

```gherkin
Feature: Agentic todo dropdown
  As usr on graph
  I want see agentic execution progress
  So I know what's happening

  Scenario: Show todo dropdown after submit
    Given Active node w/ prompt submitted
    When agentic system starts execution
    Then todo dropdown appears below node
    And dropdown shows todo items
    And each item shows progress

  Scenario: Auto-accept default behavior
    Given Auto-accept toggle on in settings
    When prompt submitted
    Then todos start automatically
    And usr can still cancel individual items

  Scenario: Show cost per todo
    Given Todo dropdown open
    When todos executing
    Then each todo item shows cost estimate
    And total cost shown at bottom
```

### Feature: Project selection flow

User selects project from left icon btn. New project = single blank node. Existing project = restores previous graph state.

```gherkin
Feature: Project selection flow
  As usr on graph
  I want select project
  So I work on specific whitt folder

  Scenario: New project starts blank
    Given Project picker open
    When usr selects new project name
    Then graph renders single blank node
    And node title untitled
    And .whitt/ folder created

  Scenario: Existing project restores state
    Given Project picker open
    And project XYZ has saved graph state
    When usr selects project XYZ
    Then graph renders previous state
    And all nodes + lines restored
    And node titles preserved
```

### Feature: Web research agentic scope

Web research → single markdown summary doc → linked as nodes attached to start node. Agentic generation from web results.

```gherkin
Feature: Web research agentic scope
  As usr on graph
  I want web research results
  So I expand graph w/ external knowledge

  Scenario: Web research creates summary doc
    Given Active node w/ prompt requesting web research
    When prompt submitted
    Then agentic system searches web
    And generates summary markdown doc
    And doc saved to .whitt/ folder
    And new node linked to start node

  Scenario: Multiple web research prompts
    Given Start node w/ existing web research child
    When usr submits another web research prompt
    Then new summary doc generated
    And new node attached to start node
    And existing web research nodes preserved
```

### Feature: Agentic title generation

Node title agentically generated from current state. Graph name agentically generated from all context.

```gherkin
Feature: Agentic title generation
  As usr on graph
  I want titles generated automatically
  So I don't name every node manually

  Scenario: Generate node title after completion
    Given Untitled node w/ completed prompt
    When prompt execution finishes
    Then agentic system generates title
    And node title updated
    And title reflects prompt content

  Scenario: Generate graph name from context
    Given Graph w/ multiple nodes
    And graph name untitled
    When usr saves graph
    Then agentic system generates graph name
    And name reflects all node content
```

### Feature: Edit existing node

User edits existing node. Downstream updates agentic applicable. Changes propagate through graph.

```gherkin
Feature: Edit existing node
  As usr on graph
  I want edit existing nodes
  So I refine my thinking

  Scenario: Edit node prompt
    Given Node A w/ existing prompt txt
    When usr clicks node prompt area
    And modifies txt
    And submits changes
    Then node markdown updated
    And downstream nodes notified
    And agentic system re-evaluates if needed

  Scenario: Cancel edit without save
    Given Node A w/ existing prompt txt
    When usr clicks node prompt area
    And modifies txt
    And presses Escape
    Then changes discarded
    And original txt preserved
```

### Feature: Highlight text → voice chat

Highlight text in expanded detail → tooltip dropdown on hover → expand/refine buttons → become voice chats typing in textarea.

```gherkin
Feature: Highlight text to voice chat
  As usr on graph
  I want highlight text to start voice chat
  So I expand on specific content

  Scenario: Show tooltip on highlighted text hover
    Given Node detail panel expanded
    And usr highlights text in panel
    When usr hovers over highlight
    Then tooltip dropdown appears
    And tooltip shows expand + refine buttons

  Scenario: Expand button starts voice chat
    Given Tooltip visible w/ expand button
    When usr clicks expand
    Then new voice chat opens
    And highlighted txt pre-fills textarea
    And instruction shows "expand on this"

  Scenario: Refine button starts voice chat
    Given Tooltip visible w/ refine button
    When usr clicks refine
    Then new voice chat opens
    And highlighted txt pre-fills textarea
    And instruction shows "refine this"
```

### Feature: Voice chat tooltip over node

Voice chat tooltip over node. Expandable/contractible on hover/focus. Shows context + allows new prompt.

```gherkin
Feature: Voice chat tooltip over node
  As usr on graph
  I want voice chat tooltip on node
  So I quick-add content w/out expanding

  Scenario: Show tooltip on node hover
    Given Node on canvas
    When usr hovers over node
    Then voice chat tooltip appears
    And tooltip shows mic btn
    And tooltip shows last activity

  Scenario: Expand tooltip on focus
    Given Tooltip visible
    When usr clicks tooltip
    Then tooltip expands
    And shows full prompt area
    And shows recent history

  Scenario: Submit prompt from tooltip
    Given Tooltip expanded w/ prompt txt
    When usr clicks send
    Then prompt submitted
    And new node attached
    And tooltip collapses
```

### Feature: Mic btn on highlighted text

Mic btn on highlighted text opens text-to-chat. Instructions on using highlighted info to add more docs to graph.

```gherkin
Feature: Mic btn on highlighted text
  As usr on graph
  I want mic btn on highlighted text
  So I voice-add docs related to highlight

  Scenario: Mic btn appears on text highlight
    Given Node detail panel expanded
    When usr highlights text
    Then mic btn appears near highlight
    And btn shows "voice-add docs"

  Scenario: Mic btn opens voice chat
    Given Mic btn visible on highlight
    When usr clicks mic btn
    Then voice chat tooltip opens
    And highlighted txt copied to textarea
    And instruction shows "add docs about this"

  Scenario: Voice-add creates new doc node
    Given Voice chat open w/ highlighted txt
    When usr speaks instruction
    And submits prompt
    Then new doc generated
    And doc linked to original node
    And graph expands
```

### Feature: Git versioning

Git versioning strict reliable all markdown docs local FS. GitHub OAuth in React → use GitHub CLI push changes.

```gherkin
Feature: Git versioning
  As usr on graph
  I want git versioning
  So I track graph changes reliably

  Scenario: Auto-commit on save
    Given Graph w/ unsaved changes
    When usr saves graph
    Then all markdown files committed to git
    And commit msg auto-generated
    And commit reflects changes

  Scenario: Sync remote button
    Given Git repo w/ local commits
    And "sync remote" btn visible
    When usr clicks "sync remote"
    Then GitHub CLI pushes changes
    And OAuth flow handles auth
    And remote updated
```

### Feature: Only sync remote visible

UI: only "sync remote" btn visible, rest invisible (Git/GitHub as versioning + backup).

```gherkin
Feature: Only sync remote visible
  As usr on graph
  I want only sync remote btn visible
  So git stays invisible unless needed

  Scenario: Hide all git UI except sync
    Given Graph page loaded
    Then only "sync remote" btn visible
    And git status invisible
    And branch selector invisible
    And commit history invisible

  Scenario: Sync remote shows status
    Given "sync remote" btn visible
    When local commits ahead of remote
    Then btn shows "push (3)"
    When remote ahead of local
    Then btn shows "pull (2)"
```

### Feature: Time travel via git log

Time travel via git commit log traversing graph versions. User navigates graph history.

```gherkin
Feature: Time travel via git log
  As usr on graph
  I want time travel
  So I view past graph states

  Scenario: Show time travel UI
    Given Graph w/ git history
    When usr opens time travel panel
    Then commit list shows
    And each commit shows timestamp
    And each commit shows graph preview

  Scenario: Navigate to past commit
    Given Time travel panel open
    When usr selects past commit
    Then graph renders that state
    And current view labeled "viewing history"
    And edits disabled

  Scenario: Restore from history
    Given Viewing past commit
    When usr clicks "restore this"
    Then graph state copied to current
    And new commit created
    And user returned to current state
```

## Dependencies

- ADR-0002: Llama.cpp Slice (local models)
- ADR-0003: Whisper STT Slice (voice input)
- ADR-0004: Graph UI Node Line Settings Slices (current build)
- ADR-0005: Agentic Todo Execution Slice (agentic system)
- ADR-0006: Whitt Folder Markdown YAML Slice (storage)
- ADR-0007: Neo4j Local FS Sync Slice (performance)
- ADR-0008: Web Research Slice (external knowledge)
- ADR-0009: Git GitHub OAuth Slice (versioning)
- ADR-0010: Time Travel Slice (history navigation)
