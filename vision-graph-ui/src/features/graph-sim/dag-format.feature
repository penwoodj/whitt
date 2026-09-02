Feature: Selected-only DAG format
  As usr on graph
  I want selected nodes formatted only
  So unselected graph state stays unchanged

  Scenario: DAGX-01 formats selected nodes right
    Given selected nodes A and B plus unselected node C
    When usr applies right format
    Then only A and B move rightward
    And control shows right state

  Scenario: DAGX-02 formats selected nodes down
    Given selected nodes A and B
    When usr applies down format
    Then selected nodes use downward layout
    And control shows down state

  Scenario: DAGX-03 formats selected nodes left and wraps
    Given selected nodes A and B
    When usr applies left format twice
    Then selected nodes use left layout
    And next format wraps right

  Scenario: DAGX-04 empty selection is strict no-op
    Given graph has no selected nodes
    When usr applies format
    Then direction does not advance
    And nodes edges selection viewport stay unchanged
    And callback does not run

  Scenario: Selected boundary edges stay unchanged
    Given selected nodes A and B have boundary edges to unselected C
    When usr applies right format
    Then induced layout uses only A to B edge
    And every edge stays unchanged

  Scenario: Disconnected selected nodes format deterministically
    Given selected nodes A and B have no connecting edge
    When usr applies right format
    Then both selected nodes format
    And ID order breaks ties

  Scenario: Selected cycle preserves graph on error
    Given selected nodes A and B form a directed cycle
    When usr applies right format
    Then format reports cycle error
    And graph stays unchanged
