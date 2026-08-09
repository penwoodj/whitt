Feature: Graph sim voice→markdown flow
  As usr testing app
  I want mic btn → lorem stream → stop → markdown
  So I walk thru UX flow

  Scenario: Initial render shows idle Node
    Given GraphSim mounted
    When canvas renders
    Then single Node visible
    And Node status idle

  Scenario: Mic click starts lorem stream
    Given GraphSim mounted, Node idle
    When usr clicks mic btn
    Then Node status recording
    And lorem txt streams to prompt area
    And prompt grows over time

  Scenario: Mic click again stops stream
    Given GraphSim streaming lorem
    When usr clicks mic btn
    Then Node status done
    And stream stops
    And prompt txt frozen

  Scenario: Stop triggers markdown render
    Given GraphSim stream stopped
    When 500ms passes
    Then detail panel expands
    And markdown doc visible
    And markdown shows headers + lists + code

  Scenario: Reset cycle on next mic click
    Given GraphSim done w/ markdown shown
    When usr clicks mic btn
    Then prompt cleared
    And markdown hidden
    And status recording
    And lorem streams again
