Feature: T7 app path composition
  As usr on Vite GraphSim
  I want expanded node surfaces compose
  So execution, files, context, agent, and git state stay visible

  Scenario: Expanded node opens semantic prompt dialog
    Given GraphSim loaded project graph
    When usr clicks node body
    Then dialog shows Open prompt
    And node body shows title, status, light only

  Scenario: Expanded run composes execution and agent state
    Given expanded node dialog open
    When usr sends prompt
    Then execution panel shows running step
    And agent event state remains visible

  Scenario: Completed run composes file preview
    Given expanded node run completed
    When completion state renders
    Then completed file preview shows Edit control

  Scenario: Context pills stay in dialog
    Given expanded node dialog open
    When usr views node context
    Then dialog shows context pill

  Scenario: Git sync stays browser safe
    Given GraphSim loaded project graph
    When usr views graph chrome
    Then sync state shows available browser action
