Feature: Graph simulation full flow
  As usr exploring graph UI vision
  I want complete UX sim w/ all slices
  So I validate UI/UX before backend work

  Scenario: Initial state shows project picker
    Given GraphSim loads
    When usr sees initial state
    Then shows project picker
    And shows placeholder "Select or create project"

  Scenario: Project selected shows main area
    Given GraphSim loaded
    When usr selects project
    Then shows app-shell layout
    And shows sidebar w/ project highlighted
    And shows topbar w/ auto-gen title
    And shows main area w/ single Node

  Scenario: Mic click starts recording
    Given Project selected w/ single Node
    When usr clicks mic btn
    Then Node status shows recording
    And lorem streams to prompt area

  Scenario: Mic click again stops recording
    Given Node recording
    When usr clicks mic btn again
    Then Node status shows done
    And stream saved to prompt area

  Scenario: Agentic todos appear after stop
    Given Node stopped recording
    When 500ms elapsed
    Then agentic todo dropdown expands
    And shows fake todos w/ status + cost

  Scenario: Child node spawns after todos complete
    Given Agentic todos visible
    When 4s elapsed
    Then new child Node spawns
    And child connected via Line
    And child has agentic-generated title
    And child detail panel shows markdown

  Scenario: Click child node becomes active
    Given Multiple nodes on graph
    When usr clicks child Node
    Then child becomes active
    And mic btn appears on child
    And cycle can repeat

  Scenario: Time travel back enabled after child spawn
    Given Child node spawned
    When todos complete
    Then time travel back btn enabled
    And user can click to revert state

  Scenario: Sync btn cycles through statuses
    Given GraphSim loaded w/ project
    When usr clicks sync btn
    Then status shows syncing (spinner)
    When 1.5s elapsed
    Then status shows synced
    And label shows "Synced just now"
    When 60s elapsed
    Then label shows "Synced 1m ago"

  Scenario: Settings gear opens settings
    Given GraphSim loaded w/ project
    When usr clicks settings gear
    Then settings modal opens
    When usr closes settings
    Then returns to main view

  Scenario: Highlight text shows menu
    Given Node detail panel expanded w/ markdown
    When usr highlights text
    Then markdown highlight menu appears at cursor
    And shows Expand + Refine buttons

  Scenario: Click Expand spawns child node
    Given Highlight menu visible w/ selected text
    When usr clicks Expand
    Then new child node spawns
    And child title shows "Expand: <selection>"
    And menu closes

  Scenario: Click Refine is stub
    Given Highlight menu visible w/ selected text
    When usr clicks Refine
    Then onRefine called
    And menu closes
    And no node spawned (stub)
