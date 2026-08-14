# ADR-0004: Graph UI Node Line Settings Slices

**Status:** Proposed  
**Date:** 2026-08-08  
**Supersedes:** none

## Context

Current build slice. Core graph UI components needed for ADR-0001 vision. React Flow for canvas. Node, Line, Settings slices with explicit sub-components. Storybook for isolated testing. Foundation for all future features.

## Decision

Build Node slice, Line slice, Settings slice with explicit sub-components. Use React Flow for canvas. Storybook stories for each component. No other features in this slice.

## Consequences

- Foundation for all graph interactions
- Vertical slice architecture enforced
- All sub-components explicitly defined
- Storybook-first development
- React Flow dependency introduced

## Features

### Feature: Node slice

Main node component for graph canvas. Sub-components handle specific node responsibilities.

```gherkin
Feature: Node slice
  As usr on graph
  I want node on canvas
  So I interact with agentic tasks

  Scenario: Render node on canvas
    Given Graph canvas loaded
    When node data provided
    Then Node renders on canvas
    And NodeTitle shows
    And NodeStatus shows
    And NodeMicBtn shows

  Scenario: Activate node on click
    Given Node rendered on canvas
    When usr clicks Node
    Then Node shows active indicator
    And focus moves to Node
    And other nodes become inactive

  Scenario: Node hover shows tooltip
    Given Node rendered on canvas
    When usr hovers over Node
    Then NodeTooltip appears
    And tooltip shows summary info
```

### Feature: NodeTitle sub-component

Displays node title. Editable on click. Agentic generation from content.

```gherkin
Feature: NodeTitle sub-component
  As usr on graph
  I want see node title
  So I identify node quickly

  Scenario: Show node title
    Given Node exists w/ title "Summarize notes"
    Then NodeTitle shows "Summarize notes"

  Scenario: Edit title on click
    Given NodeTitle showing
    When usr clicks NodeTitle
    Then title becomes editable input
    When usr edits + presses Enter
    Then new title saved

  Scenario: Agentic title generation
    Given Node exists w/ untitled
    And node has prompt content
    When prompt completes
    Then agentic system generates title
    And NodeTitle updates automatically
```

### Feature: NodeMicBtn sub-component

Mic button for voice input. Toggle recording state. Streams to prompt area.

```gherkin
Feature: NodeMicBtn sub-component
  As usr on graph
  I want mic btn on node
  So I start voice input

  Scenario: Show mic btn on node
    Given Node rendered
    Then NodeMicBtn shows on node
    And btn shows "mic off" icon

  Scenario: Toggle rec on click
    Given NodeMicBtn shows "mic off"
    When usr clicks NodeMicBtn
    Then btn shows "mic on" icon
    And STT starts
    And transcribed txt streams to prompt area

  Scenario: Toggle rec off on click
    Given NodeMicBtn shows "mic on"
    When usr clicks NodeMicBtn
    Then btn shows "mic off" icon
    And STT stops
    And final txt saved to prompt area
```

### Feature: NodeStatus sub-component

Shows node execution status. Color-coded indicators. Status states: idle, running, completed, failed.

```gherkin
Feature: NodeStatus sub-component
  As usr on graph
  I want see node status
  So I know execution state

  Scenario: Show idle status
    Given Node idle
    Then NodeStatus shows gray indicator
    And label shows "idle"

  Scenario: Show running status
    Given Node running
    Then NodeStatus shows blue indicator
    And label shows "running"
    And indicator animates

  Scenario: Show completed status
    Given Node completed
    Then NodeStatus shows green indicator
    And label shows "completed"

  Scenario: Show failed status
    Given Node failed
    Then NodeStatus shows red indicator
    And label shows "failed"
```

### Feature: NodePromptArea sub-component

Text area for prompt input. Shows transcribed text. Editable before submit. Enter/Send separate from rec.

```gherkin
Feature: NodePromptArea sub-component
  As usr on graph
  I want prompt area on node
  So I input text + voice

  Scenario: Show prompt area
    Given Node rendered
    Then NodePromptArea shows below node title
    And area shows placeholder "enter prompt"

  Scenario: Stream transcribed text
    Given STT active
    When Whisper transcribes "hello world"
    Then "hello world" streams into prompt area
    And text appears character by character

  Scenario: Edit prompt before submit
    Given Prompt area shows "hello world"
    When usr edits to "hello everyone"
    And presses Enter
    Then "hello everyone" submitted
```

### Feature: NodeAgenticTodos sub-component

Dropdown showing agentic execution. Auto-accept toggle. Progress + cost per todo.

```gherkin
Feature: NodeAgenticTodos sub-component
  As usr on graph
  I want see agentic todos
  So I track execution progress

  Scenario: Show todo dropdown after submit
    Given Prompt submitted
    When agentic execution starts
    Then NodeAgenticTodos dropdown appears
    And dropdown shows todo items
    And each item shows progress bar

  Scenario: Show cost per todo
    Given NodeAgenticTodos visible
    Then each todo item shows cost estimate
    And total cost shown at bottom

  Scenario: Auto-accept behavior
    Given Auto-accept toggle on
    When prompt submitted
    Then todos start automatically
    When auto-accept toggle off
    Then todos wait for manual start
```

### Feature: NodeTooltip sub-component

Hover tooltip showing summary. Expandable to show more detail. Quick actions.

```gherkin
Feature: NodeTooltip sub-component
  As usr on graph
  I want tooltip on hover
  So I see node summary quickly

  Scenario: Show tooltip on hover
    Given Node rendered
    When usr hovers over Node
    Then NodeTooltip appears near node
    And tooltip shows title + status
    And tooltip shows last activity timestamp

  Scenario: Expand tooltip for detail
    Given NodeTooltip visible
    When usr clicks tooltip
    Then tooltip expands
    And shows prompt preview
    And shows "view detail" btn

  Scenario: Show quick actions
    Given NodeTooltip expanded
    Then tooltip shows "duplicate" btn
    And tooltip shows "delete" btn
    And tooltip shows "edit" btn
```

### Feature: NodeDetailPanel sub-component

Expanded panel showing full node content. Highlight text → voice chat. Edit prompts. View results.

```gherkin
Feature: NodeDetailPanel sub-component
  As usr on graph
  I want detail panel
  So I see full node content

  Scenario: Open detail panel
    Given Node rendered
    When usr double-clicks Node
    Then NodeDetailPanel opens
    And panel shows full prompt
    And panel shows results

  Scenario: Highlight text in panel
    Given NodeDetailPanel open
    When usr highlights text
    Then mic btn appears near highlight
    And tooltip shows expand + refine btns

  Scenario: Close detail panel
    Given NodeDetailPanel open
    When usr clicks close btn
    Then panel closes
    And focus returns to canvas
```

### Feature: Line slice

Connects nodes in graph. SVG-based. Labels + animations.

```gherkin
Feature: Line slice
  As usr on graph
  I want lines connect nodes
  So I see relationships

  Scenario: Render line between nodes
    Given Node A and Node B on canvas
    When edge data provided
    Then Line renders connecting A to B
    And LineSvg draws path

  Scenario: Animate line on activation
    Given Line connecting A to B
    When Node A becomes active
    Then LineAnim pulses
    And flow direction shows A to B

  Scenario: Show line label
    Given Line exists
    When edge has label "produces"
    Then LineLabel shows "produces"
    And label centers on line
```

### Feature: LineSvg sub-component

SVG rendering of line path. Curved bezier paths. Responsive to node position changes.

```gherkin
Feature: LineSvg sub-component
  As usr on graph
  I want SVG line rendering
  So I see smooth connections

  Scenario: Render bezier curve
    Given Line connecting A to B
    Then LineSvg draws bezier curve
    And curve smooths at endpoints

  Scenario: Update on node move
    Given Line rendered
    When usr drags Node A
    Then LineSvg updates path in real-time
    And curve follows node position

  Scenario: Handle multiple lines
    Given Node A connected to B, C, D
    Then LineSvg renders 3 separate paths
    And paths don't overlap
```

### Feature: LineLabel sub-component

Text label on line. Shows relationship type. Editable.

```gherkin
Feature: LineLabel sub-component
  As usr on graph
  I want line labels
  So I see relationship types

  Scenario: Show line label
    Given Line with label "depends on"
    Then LineLabel shows "depends on"
    And label centers on line

  Scenario: Edit line label
    Given LineLabel showing
    When usr double-clicks label
    Then label becomes editable input
    When usr edits + presses Enter
    Then new label saved

  Scenario: Hide label on zoom out
    Given LineLabel showing
    When usr zooms canvas out
    Then LineLabel hides
    And label reappears on zoom in
```

### Feature: LineAnim sub-component

Animation for active lines. Flow direction. Pulse effects.

```gherkin
Feature: LineAnim sub-component
  As usr on graph
  I want line animations
  So I see active flows

  Scenario: Pulse active line
    Given Line active
    Then LineAnim shows pulse effect
    And pulse repeats every second

  Scenario: Show flow direction
    Given Line active from A to B
    Then LineAnim shows flow particles
    And particles move A to B

  Scenario: Stop animation on inactive
    Given Line animating
    When line becomes inactive
    Then LineAnim stops
    And particles disappear
```

### Feature: Settings slice

Settings panel for graph UI. Auto-accept toggle, voice shortcut, model endpoint, project folder.

```gherkin
Feature: Settings slice
  As usr on graph
  I want settings panel
  So I configure graph behavior

  Scenario: Open settings panel
    Given Graph canvas loaded
    When usr clicks settings icon
    Then SettingsLayout opens
    And panel shows all settings groups

  Scenario: Save settings
    Given SettingsLayout open
    When usr modifies settings
    And clicks "save"
    Then settings persisted to local storage
    And panel closes
```

### Feature: SettingsLayout sub-component

Layout container for settings. Groups related settings. Save/Cancel actions.

```gherkin
Feature: SettingsLayout sub-component
  As usr on graph
  I want settings layout
  So I navigate settings easily

  Scenario: Show settings groups
    Given SettingsLayout open
    Then "Voice" group shows
    And "Models" group shows
    And "Project" group shows

  Scenario: Save btn persists changes
    Given SettingsLayout open
    When usr modifies settings
    And clicks "save"
    Then changes saved
    And layout shows "saved" confirmation

  Scenario: Cancel btn discards changes
    Given SettingsLayout open
    When usr modifies settings
    And clicks "cancel"
    Then changes discarded
    And settings revert
```

### Feature: AutoAcceptToggle sub-component

Toggle for auto-accepting agentic todos. Default on. Saved to settings.

```gherkin
Feature: AutoAcceptToggle sub-component
  As usr on graph
  I want auto-accept toggle
  So I control todo automation

  Scenario: Show auto-accept toggle
    Given SettingsLayout open
    Then AutoAcceptToggle shows
    And toggle shows current state (on/off)

  Scenario: Toggle auto-accept on
    Given AutoAcceptToggle off
    When usr clicks toggle
    Then toggle shows on
    And agentic todos auto-start

  Scenario: Toggle auto-accept off
    Given AutoAcceptToggle on
    When usr clicks toggle
    Then toggle shows off
    And agentic todos wait for manual start
```

### Feature: VoiceShortcutInput sub-component

Input field for voice shortcut key. Default: Ctrl+Space. Customizable.

```gherkin
Feature: VoiceShortcutInput sub-component
  As usr on graph
  I want customize voice shortcut
  So I use preferred key combo

  Scenario: Show current shortcut
    Given SettingsLayout open
    Then VoiceShortcutInput shows "Ctrl+Space"

  Scenario: Change shortcut
    Given VoiceShortcutInput showing
    When usr clicks input
    And presses new key combo
    Then input updates to new combo
    And shortcut saved

  Scenario: Validate shortcut
    Given VoiceShortcutInput focused
    When usr presses invalid combo
    Then input shows error "invalid shortcut"
    And previous shortcut preserved
```

### Feature: ModelEndpointInput sub-component

Input for llama.cpp model endpoint. Local path or HTTP URL. Connection test.

```gherkin
Feature: ModelEndpointInput sub-component
  As usr on graph
  I want set model endpoint
  So I connect to local models

  Scenario: Show current endpoint
    Given SettingsLayout open
    Then ModelEndpointInput shows current path

  Scenario: Set local model path
    Given ModelEndpointInput focused
    When usr enters "/models/llama-3-8b"
    And clicks "test connection"
    Then endpoint validated
    And success msg shows

  Scenario: Set HTTP endpoint
    Given ModelEndpointInput focused
    When usr enters "http://localhost:8080"
    And clicks "test connection"
    Then endpoint validated
    And success msg shows
```

### Feature: ProjectFolderPicker sub-component

Picker for .whitt project folder. Browse local FS. Validate folder structure.

```gherkin
Feature: ProjectFolderPicker sub-component
  As usr on graph
  I want pick project folder
  So I work on specific project

  Scenario: Show current folder
    Given SettingsLayout open
    Then ProjectFolderPicker shows current path

  Scenario: Browse for folder
    Given ProjectFolderPicker focused
    When usr clicks "browse"
    Then folder picker dialog opens
    And usr selects folder
    And path updates

  Scenario: Validate folder structure
    Given ProjectFolderPicker set to new path
    When usr clicks "validate"
    Then checker looks for .whitt/ folder
    And validation result shows
```

### Feature: Graph page Storybook story

Storybook story for graph page. Just Node inside ReactFlow canvas. No other features.

```gherkin
Feature: Graph page Storybook story
  As dev testing UI
  I want Storybook story
  So I verify Node in isolation

  Scenario: Render Node in ReactFlow
    Given Storybook loaded
    When usr opens "Graph/Node" story
    Then ReactFlow canvas renders
    And single Node shows on canvas
    And Node has title, status, mic btn

  Scenario: Node interactive in Storybook
    Given Node story open
    When usr clicks Node
    Then Node becomes active
    And mic btn clickable
    And tooltip appears on hover

  Scenario: No other features in story
    Given Node story open
    Then Settings not visible
    And Line components not present
    And Agentic todos not visible
```

## Dependencies

- ADR-0001: Voice Graph Vision (master vision)
- ADR-0002: Llama.cpp Slice (model endpoint)
- ADR-0003: Whisper STT Slice (voice shortcut)
- React Flow library
- Storybook 10
