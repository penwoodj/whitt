Feature: Canvas Grouping Basics
  As usr on graph canvas
  I want to create + interact w/ node groups
  So I can organize + manipulate related nodes efficiently

  Scenario: GRP-03 right-click box
    Given canvas w/ 6 nodes at diff positions
    When usr multi-selects 3 nodes (A, B, C) via ctrl+click
    And usr right-clicks on selection
    Then group box drawn around selected nodes
    And group box has visible border
    And group box encloses all 3 selected nodes

  Scenario: GRP-09 group prompt context
    Given canvas w/ soft group containing nodes A, B, C
    When usr focuses on group box
    Then STT tooltip appears at group side
    And tooltip shows group member count (3 nodes)
    And tooltip payload contains member refs (A, B, C)

  Scenario: GRP-10 group node-like
    Given canvas w/ soft group containing nodes A, B, C
    When usr double-clicks group box
    Then group opens as unit w/ expansion surface
    And expansion surface shows group contents
    And group behaves like single node in graph interactions
