Feature: Node Modal Lifecycle
  As usr on graph
  I want node modals w/ single-active constraint + origin-anchored transitions + size caps + close paths
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

  Scenario: EXP-11 close tri-path ESC
    Given modal open for node
    When usr presses ESC
    Then modal closes
    And node bubble visible at same canvas position

  Scenario: EXP-11 close tri-path click-outside
    Given modal open for node
    When usr clicks overlay outside modal
    Then modal closes
    And node bubble visible at same canvas position

  Scenario: EXP-11 close tri-path X button
    Given modal open for node
    When usr clicks X close button
    Then modal closes
    And node bubble visible at same canvas position

  Scenario: EXPC-02 size caps
    Given node w/ huge file content preview
    When usr expands node
    Then modal width = 810px (90 chars max)
    And modal height ≤ 80% viewport
    And modal has inner scroll
    And graph visible around modal
