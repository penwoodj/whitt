Feature: Drag Coherence
  As usr on graph canvas
  I want drag interactions to be coherent and predictable
  So I can move nodes without unintended side effects

  Scenario: GRP-04 connected pull
    Given canvas w/ node A connected to node B via edge
    When usr drags node A
    Then node B follows the movement
    And edge stays connected between nodes

  Scenario: GRPC-01 click vs drag
    Given canvas w/ node A at position (100, 100)
    When usr clicks node A without moving mouse
    Then node A becomes selected
    And node A position unchanged

  Scenario: GRPC-01 drag threshold
    Given canvas w/ node A at position (100, 100)
    When usr presses mouse on node A and moves less than 4px
    And releases mouse
    Then node A becomes selected
    And node A position unchanged

  Scenario: GRPC-01 actual drag
    Given canvas w/ node A at position (100, 100)
    When usr presses mouse on node A and moves more than 4px
    And releases mouse at position (150, 150)
    Then node A position updated to (150, 150)
    And node A not selected

  Scenario: GRPC-02 esc cancels drag
    Given canvas w/ node A at position (100, 100)
    When usr starts dragging node A to position (150, 150)
    And usr presses ESC key
    Then drag operation cancelled
    And node A position remains at (100, 100)

  Scenario: GRPC-08 multi-drag coherence
    Given canvas w/ nodes A, B, C selected
    When usr drags node A by (50, 50)
    Then all selected nodes move by (50, 50)
    And relative positions between selected nodes preserved

  Scenario: GRPC-08 multi-drag edge preservation
    Given canvas w/ nodes A, B selected and connected by edge
    When usr drags selected nodes by (50, 50)
    Then edge remains connected between A and B
    And edge follows node movement