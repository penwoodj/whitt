Feature: Viewport Navigation Zoom
  As usr on graph canvas
  I want zoom behavior like slippy-map
  So nav feels natural

  Scenario: NAV-01 zoom to cursor
    Given canvas w/ nodes
    And pointer at canvas point P
    When usr scrolls wheel at P
    Then zoom scales about P
    And content under cursor stays under cursor

  Scenario: NAV-03 zoom limits
    Given canvas w/ nodes
    And current zoom = 1.0
    When usr scrolls wheel beyond bounds
    Then scale clamps to min 0.1
    And scale clamps to max 2.5
    And clamping does not bounce
    And clamping does not jitter

  Scenario: NAV-02 pan modes
    Given canvas w/ nodes
    When usr drags empty canvas
    Then canvas pans
    When usr holds space and drags on node
    Then canvas pans
    When usr drags on node without space
    Then node moves
    And canvas does not pan

  Scenario: NAV-04 fit view control
    Given canvas w/ spread nodes
    When usr clicks fit view button
    Then camera animates to bound all nodes
    And nodes have padding around edges
    And animation is smooth
