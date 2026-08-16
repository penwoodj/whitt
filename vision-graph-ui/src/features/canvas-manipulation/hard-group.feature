Feature: Hard group promotion

  Scenario: GRP-07 soft vs hard grouping distinction
    Given a canvas with 3 selected nodes "Node A", "Node B", "Node C"
    When the user creates a soft group via right-click
    Then a group box appears with soft border style
    And the group is marked as soft (non-persistent)
    When the user invokes "Make Folder" on the soft group
    Then the group border becomes pronounced/harsher
    And the center glow becomes more solid and less opaque
    And the group is marked as hard (persistent)

  Scenario: GRPC-10 hard group creates folder and moves files
    Given a soft group with 3 nodes "Node A", "Node B", "Node C"
    When the user invokes "Make Folder" on the soft group
    Then a new folder is created in the filesystem
    And the 3 node files are moved into the new folder
    And a new blank .md node is created at the top level
    And the group box+halo persist after graph reload
