Feature: Group detail panel + mini-window
  As usr working with groups
  I want group detail panel with full graph view
  I want unfocused groups to show as bubble with mini-window
  So I can see group contents at different zoom levels

  Scenario: Group detail panel with full graph view
    Given soft or hard group node
    When group is spoken to (STT invocation)
    Then group displays detail panel similar to node detail panel
    And first section in detail panel is full-size graph view of group contents
    And member nodes and edges visible in full-size graph

  Scenario: Unfocused group bubble + halo + mini-window
    Given group node not focused
    When group renders in unfocused state
    Then node becomes bubble of light
    And soft or hard group halo border surrounds bubble
    And inner graph displays zoomed-out view inside node
    And node is reasonably sized (bigger than average node)
    And mini-window shows subgraph of information within collapsed node
