Feature: Agent event bus + derived sets
  As usr watching graph during agent run
  I want derived state from raw events
  So UI can show busy nodes, step titles, last mutations

  Scenario: Hook subscribes to bus on mount
    Given event bus exists
    When hook mounts w/ bus
    Then state exposes busyNodeIds
    And state exposes stepTitleByNode
    And state exposes lastMutation

  Scenario: Busy set tracks running nodes
    Given event bus exists
    And hook mounted
    When agent emits run-start for node n1
    Then busyNodeIds contains n1
    And other nodes not in set

  Scenario: Busy set clears on step-done
    Given node n1 running (run-start emitted)
    And step-start emitted for n1
    When agent emits step-done for n1
    Then busyNodeIds no longer contains n1

  Scenario: Busy set clears on step-error
    Given node n1 running (run-start emitted)
    And step-start emitted for n1
    When agent emits step-error for n1
    Then busyNodeIds no longer contains n1

  Scenario: Step title maps to node
    Given event bus exists
    And hook mounted
    When agent emits run-start for node n1
    And agent emits step-start for n1 w/ title "Parsing prompt"
    Then stepTitleByNode has entry n1="Parsing prompt"

  Scenario: Step title updates on new step
    Given node n1 has step "Step 1" (step-start emitted)
    When agent emits new step-start for n1 w/ title "Step 2"
    Then stepTitleByNode shows n1="Step 2" (updated)

  Scenario: Last mutation tracks graph changes
    Given event bus exists
    And hook mounted
    When agent emits graph-mutation w/ op=spawn
    Then lastMutation equals emitted mutation

  Scenario: Last mutation updates on new events
    Given lastMutation is spawn operation
    When agent emits new graph-mutation w/ op=edit
    Then lastMutation equals edit mutation (updated)

  Scenario: Hook unsubscribes on unmount
    Given hook mounted to bus
    When hook unmounts
    Then bus no longer calls hook handlers
    And subsequent events ignored