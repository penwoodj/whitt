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
