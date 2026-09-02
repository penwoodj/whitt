Feature: GraphSim canvas operations
  As usr in graph workspace
  I want React Flow gestures compose CanvasOps semantics
  So canvas interactions work in Vite app

  Scenario: Empty drag pans while Shift drag lassos
    Given GraphSim shows graph nodes
    When usr drags empty pane
    Then viewport pans without selecting nodes
    When usr Shift-drags empty pane around nodes
    Then enclosed nodes become selected

  Scenario: Modifier selection and node drag
    Given GraphSim shows graph nodes
    When usr clicks node A and Ctrl-clicks node B
    Then A and B stay selected
    When usr drags selected node A
    Then A and B move together

  Scenario: Escape cancels node drag
    Given usr drags node A
    When usr presses Escape before drag ends
    Then node A returns to its start position

  Scenario: Group context and connected drag
    Given usr selects nodes A and B
    When usr right-clicks selected nodes
    Then group box and selection halo show
    When usr drags connected node A
    Then connected neighbor follows

  Scenario: Standalone node and link creation
    Given GraphSim shows graph nodes
    When usr creates standalone node
    Then new node has no edges
    When usr connects node A to standalone node
    Then new default edge shows
