Feature: Link Drawing
  As usr on graph canvas
  I want to draw connections between nodes
  So I can create relationships + graph structure

  Scenario: GRP-06 drag link
    Given canvas w/ node A at (100, 100) and node B at (300, 100)
    When usr hovers over right edge strip of node A
    And drags from node A right edge to node B
    And drops on node B
    Then link created between node A and node B
    And link visible in graph

  Scenario: GRPC-03 connection preview - valid
    Given canvas w/ node A and node B at diff positions
    When usr starts connection drag from node A right edge
    And drags toward node B (valid target, no self-loop)
    Then preview line follows pointer
    And preview line styled as valid (solid, blue)
    And node B highlighted with glow state

  Scenario: GRPC-03 connection preview - invalid
    Given canvas w/ node A at (100, 100)
    When usr starts connection drag from node A right edge
    And drags back toward node A (would create self-loop)
    Then preview line follows pointer
    And preview line styled as invalid (dashed, red)
    And no glow state on node A

  Scenario: GRPC-04 connection cancel - ESC
    Given connection drag in progress from node A
    When usr presses ESC
    Then no link created
    And connection preview disappears
    And affordance gone cleanly

  Scenario: GRPC-04 connection cancel - drop empty
    Given connection drag in progress from node A
    When usr drops on empty canvas (no valid target)
    Then no link created
    And connection preview disappears
    And affordance gone cleanly

  Scenario: GRPC-04 connection cancel - drop invalid
    Given connection drag in progress from node A
    When usr drops on invalid target (would create self-loop)
    Then no link created
    And connection preview disappears
    And affordance gone cleanly
