Feature: Pan/lasso gesture split
  As usr working on graph canvas
  I want left-click drag to pan canvas
  I want right-click drag to lasso select
  So gestures don't conflict

  Scenario: Left-click drag pans canvas
    Given canvas with multiple nodes
    When usr left-clicks on empty canvas and drags
    Then canvas pans (moves viewport)
    And nodes move together in same direction

  Scenario: Right-click drag creates lasso selection
    Given canvas with multiple nodes
    When usr right-clicks on empty canvas and drags
    Then lasso selection box appears
    And nodes enclosed by lasso become selected

  Scenario: Left-click on node selects node (no pan)
    Given canvas with nodes
    When usr left-clicks on a node
    Then node becomes selected
    And canvas does not pan

  Scenario: Right-click on selected nodes creates group
    Given 2+ nodes selected
    When usr right-clicks on selected nodes
    Then group box created around selected nodes
    And lasso selection not triggered
