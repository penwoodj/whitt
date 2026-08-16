Feature: Delete guard + standalone node creation

  Scenario: GRPC-07 delete guard shows confirm dialog
    Given a canvas with 3 selected nodes "Node A", "Node B", "Node C"
    When the user presses Delete
    Then a confirm dialog appears
    And the dialog says "Delete 3 nodes?"
    And the nodes remain selected
    When the user clicks cancel
    Then the dialog disappears
    And the 3 nodes remain on the canvas

  Scenario: GRPC-07 delete guard allows deletion after confirm
    Given a canvas with 2 selected nodes "Node A", "Node B"
    When the user presses Delete
    Then a confirm dialog appears saying "Delete 2 nodes?"
    When the user clicks confirm
    Then the dialog disappears
    And the 2 nodes are removed from the canvas
    And no nodes remain selected

  Scenario: GRP-05 standalone node creation
    Given a canvas with existing nodes
    When the user invokes create-node action
    Then a new unconnected node appears
    And the new node has no edges
    And the new node can be dragged freely
    And the new node has default title "New Node"
