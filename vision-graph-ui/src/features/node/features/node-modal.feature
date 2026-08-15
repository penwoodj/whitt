Feature: Node Modal Lifecycle
  As usr on graph
  I want node modals w/ single-active constraint + origin-anchored transitions
  So I focus one node at a time while maintaining smooth visual morph

  Scenario: EXPC-01 single modal constraint
    Given graph w/ nodes A and B
    When usr expands node A
    Then modal A visible
    When usr expands node B
    Then modal A collapsed (state kept)
    And modal B visible

  Scenario: EXPC-04 origin-anchored transition
    Given graph w/ node at position (x: 100, y: 200)
    When usr expands node
    Then modal expands ~200-300ms
    And transform-origin = node position
    And no FOUC during transition
    And modal visible after transition
