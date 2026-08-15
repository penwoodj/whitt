Feature: useAgentEvtStream hook + story integration
  As UI component
  I want hook exposing derived agent state
  So components show busy nodes, step titles, mutations

  Scenario: hook subscribes to bus on mount
    Given React component using useAgentEvtStream
    When component mounts
    Then hook subscribes to event bus
    And derived states initialize

  Scenario: hook exposes busyNodeIds derived set
    Given event stream with run-start events
    When hook processes events
    Then busyNodeIds contains running node IDs
    And set updates on step-done/step-error

  Scenario: hook exposes stepTitleByNode map
    Given event stream with step-start events
    When hook processes events
    Then stepTitleByNode maps node IDs to current step titles
    And map updates on new step-start

  Scenario: hook exposes lastMutation (graph-mutation event)
    Given event stream with graph-mutation events
    When hook processes events
    Then lastMutation contains most recent mutation
    And updates on new graph-mutation

  Scenario: hook unsubscribes on unmount
    Given component using useAgentEvtStream
    When component unmounts
    Then hook unsubscribes from event bus
    And no memory leaks
