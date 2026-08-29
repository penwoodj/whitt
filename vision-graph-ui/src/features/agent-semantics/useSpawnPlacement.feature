Feature: Spawn placement semantics
  As usr watching agent spawn child nodes
  I want new nodes appear adjacent to parent (spring distance)
  So I can see causality (child came from HERE)

  Scenario: AGTC-02 spawn placement - adjacent placement
    Given agent spawns child off node N
    When useSpawnPlacement calculates position
    Then new node position adjacent to N (distance window 150-250px)
    And offset from siblings (crowd-aware)

  Scenario: AGTC-02 spawn placement - fade-in animation
    Given agent spawns child node
    When node added to graph
    Then node has fade-in animation class
    And animation duration 400ms (fade+settle)

  Scenario: AGTC-02 spawn placement - parent link drawn
    Given agent spawns child node N2 off parent N1
    When node N2 added to graph
    Then link N1→N2 drawn in same beat
    And edge has draw animation class