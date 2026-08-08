Feature: Line slice
  As usr on graph
  I want Line btwn nodes
  So I see relationships

  Scenario: Render line btwn two coords
    Given Line from (0,0) to (100,100)
    When Line renders
    Then SVG path visible
    And path stroke gray

  Scenario: Active state widens stroke
    Given Line w/ isActive true
    When Line renders
    Then stroke-width is 4

  Scenario: Label shows kind
    Given Line w/ kind "PRODUCED"
    When Line renders
    Then label visible at midpoint
    And label txt = "PRODUCED"

  Scenario: Loading anim dashed
    Given Line w/ status "loading"
    When Line renders
    Then stroke-dasharray set
    And dashoffset animates

  Scenario: Click label fires callback
    Given Line rendered w/ kind "DEPENDS_ON"
    When usr clicks label
    Then onLabelClick called w/ "DEPENDS_ON"

  Scenario: Error state red pulse
    Given Line w/ status "error"
    When Line renders
    Then stroke color red
    And pulse animation active
