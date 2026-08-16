Feature: Canvas Selection Model
  As usr on graph canvas
  I want multi-select nodes w/ diff gestures
  So I can organize + manipulate groups efficiently

  Scenario: GRP-01 multi-select
    Given canvas w/ 6 nodes at diff positions
    When usr ctrl+clicks node A, node B, node C
    Then 3 nodes selected (A, B, C)
    When usr drags any selected node 120px right, 40px down
    Then all 3 selected nodes move same delta (120px right, 40px down)
    And unselected nodes stay at original positions

  Scenario: GRP-02 selection surround
    Given canvas w/ 6 nodes at diff positions
    When usr multi-selects 3 nodes (A, B, C)
    Then selection halo box drawn around all 3 nodes
    And halo encloses bounds of all selected nodes
    And halo has visible border

  Scenario: GRPC-06 selection model - click
    Given canvas w/ nodes A, B, C at diff positions
    When usr clicks node A
    Then node A selected
    And nodes B, C not selected
    When usr clicks node B
    Then node B selected
    And node A not selected (selection replaced)

  Scenario: GRPC-06 selection model - ctrl+click toggle
    Given canvas w/ nodes A, B, C at diff positions
    When usr clicks node A
    Then node A selected
    When usr ctrl+clicks node B
    Then nodes A and B selected (additive)
    When usr ctrl+clicks node A again
    Then only node B selected (A toggled off)

  Scenario: GRPC-06 selection model - lasso
    Given canvas w/ 6 nodes at diff positions
    When usr drags on empty canvas creating lasso box
    And lasso box encloses nodes A, B, C
    Then nodes A, B, C selected
    And nodes outside lasso not selected

  Scenario: GRPC-06 selection model - clear
    Given canvas w/ 3 selected nodes (A, B, C)
    When usr clicks on empty canvas
    Then no nodes selected
    And selection halo disappears
