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

  Scenario: NAV-05 minimap
    Given canvas w/ content beyond viewport
    Then minimap shows in corner
    And minimap shows all nodes
    And minimap shows viewport rect
    When usr drags viewport rect on minimap
    Then canvas pans
    When usr clicks minimap
    Then camera jumps to clicked location

  Scenario: NAV-08 spawn reveal
    Given agent/user spawns node outside viewport
    And spawn involves user action
    Then canvas auto-pans to reveal node
    And pan is animated
    When background agent spawns node
    Then camera does not pan
    And minimap shows glow on new node

  Scenario: NAV-06 cursor semantics
    Given canvas w/ nodes
    When usr hovers over node
    Then cursor shows grab
    When usr starts dragging node
    Then cursor shows grabbing
    When usr hovers over empty canvas
    Then cursor shows default
    When usr hovers over actionable affordance
    Then cursor shows pointer

  Scenario: NAV-07 keyboard nudge
    Given node selected
    When usr presses arrow key
    Then node moves 1px in arrow direction
    When usr holds shift and presses arrow key
    Then node moves 10px in arrow direction

  Scenario: NAVX-01 ctrl-accelerated pan
    Given canvas w/ nodes
    When usr left-clicks and drags empty canvas while holding Ctrl
    Then pan speed is accelerated compared to normal pan
    And pan direction follows mouse movement

  Scenario: NAVX-02 arrow keys pan
    Given canvas w/ nodes
    And usr not focused in speech-to-text input
    When usr presses arrow keys
    Then canvas pans in arrow key direction
    And pan speed is consistent

  Scenario: NAVX-03 WASD pan
    Given canvas w/ nodes
    And usr not focused in speech-to-text input
    When usr presses W, A, S, or D keys
    Then canvas pans in corresponding direction
    And pan speed is consistent with arrow keys
