Feature: Gorse graph visuals
  As usr viewing graph
  I want gorse-lit nodes and curved edges
  So graph state stays visible

  Scenario: Idle node shows gorse light
    Given node in idle state
    When node renders
    Then node uses gorse light token
    And reduced motion keeps light visible

  Scenario: Runtime edges use Bezier
    Given graph edge emitted by loader, spawn, refine, or mutation
    When edge renders in React Flow
    Then edge type is default
    And SVG path contains cubic C
    And SVG path does not use step geometry
