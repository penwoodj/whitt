Feature: Morphing loader
  As user watching execution progress
  I want morphing icon that transitions during execution
  So I see visual feedback of workflow progress

  Scenario: EXE-14 morphing icon loader
    Given execution in progress
    When loader renders
    Then icon morphs through cycle
    And icon bound to step title
    And transitions follow LGT-05 cadence