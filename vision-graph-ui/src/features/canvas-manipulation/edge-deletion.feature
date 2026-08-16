Feature: Edge Deletion
  As usr on graph canvas
  I want to remove edges between nodes
  So I can restructure graph relationships

  Scenario: GRPC-05 edge delete - hover
    Given canvas w/ edge between node A and node B
    When usr hovers over edge
    Then delete affordance (X button) appears at edge midpoint
    And X button is clearly visible

  Scenario: GRPC-05 edge delete - click X
    Given canvas w/ edge between node A and node B with visible X button
    When usr clicks X button on edge
    Then edge removed from graph
    And edge no longer visible
    And FS mapping updated (unlink spy triggered)

  Scenario: GRPC-05 edge delete - keyboard
    Given canvas w/ edge between node A and node B
    When usr clicks edge to select it
    And usr presses Delete or Backspace
    Then edge removed from graph
    And edge no longer visible
    And FS mapping updated (unlink spy triggered)
