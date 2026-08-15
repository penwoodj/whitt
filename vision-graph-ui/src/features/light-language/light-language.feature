Feature: Light language glow state mapping
  As usr viewing graph elements
  I want glow colors driven by single-sourced state tokens
  So visual consistency across ball/bar/halo/group ring

  Scenario: LGT-01 token table states
    Given theme w/ state→glow token table
    When ball element renders w/ state idle
    Then glow resolves from theme.colors.idle token
    When ball element renders w/ state recording
    Then glow resolves from theme.colors.recording token
    When ball element renders w/ state running
    Then glow resolves from theme.colors.running token
    When ball element renders w/ state done
    Then glow resolves from theme.colors.done token
    When bar element renders w/ state idle
    Then glow resolves from same theme.colors.idle token as ball
    When halo element renders w/ state recording
    Then glow resolves from same theme.colors.recording token as ball
    When group ring element wraps selection box
    Then glow resolves from same theme.colors.running token as ball
    When any element renders
    Then NO ad-hoc color hex values present

  Scenario: LGT-02 amplitude curve
    Given useVoiceLevel hook consumes E1 analyser feed
    When level script produces 0
    Then scale returns idle (no breathing)
    When level script produces 0.5
    Then scale returns idle + 0.5 * 0.08 within tolerance
    When level script produces 0.9
    Then scale returns idle + 0.9 * 0.08 within tolerance
    And smoothing applied w/ attack 60ms release 200ms

  Scenario: LGT-03 silence stillness
    Given useVoiceLevel hook consumes E1 analyser feed
    When level drops below noise gate (0.02)
    Then animation paused
    And scale returns idle (no breathing)
    And recording state color retained

  Scenario: VOX-02 recording color shift
    Given ball element renders w/ state idle
    When state changes to recording
    Then glow color shifts from idle to recording

  Scenario: VOX-03 volume breathing
    Given ball element in recording state
    When voice level script 0.2→0.9
    Then breathing class present
    And sampled transform scale grows w/ level

  Scenario: EXP-04 bar of light
    Given modal expands
    Then bar renders at modal top
    And bar uses soft-corner radius token

  Scenario: EXP-08 bar breathes tooltip-closed
    Given bar in recording state
    When tooltip closes
    Then bar still has breathing animation

  Scenario: LGT-08 bar rest state
    Given bar in idle state
    Then bar unanimated
    When usr hovers bar
    Then bar brightens via filter/opacity change

  Scenario: EXP-02 ball becomes halo
    Given modal expands
    Then halo element wraps modal
    And ball element hidden

  Scenario: GRP-08 grouping halo
    Given usr forms group
    Then halo ring element wraps selection box

  Scenario: LGT-05 halo geometry
    Given modal expands
    And usr forms group
    Then same halo component both cases (testid shared)
    And halo inherits entity state glow
    And halo breathes ONLY if entity live

  Scenario: EXE-11 edges breathe executing
    Given edge in running state
    Then edge has animationName set
    When edge becomes idle
    Then edge animationName is none

  Scenario: EXE-12 border animation eventual
    Given component executing
    Then border-beam class present

  Scenario: EXE-14 morph loader
    Given loader icon renders
    Then icon cycles every ~1.2s
    And only transform/opacity animate (no layout props)

  Scenario: LGT-04 morph cadence
    Given loader executing 4s
    Then icon step ~1.2s
    And only transform/opacity animate

  Scenario: LGT-07 reduced motion
    Given prefers-reduced-motion enabled
    Then NO animationName on breathing elements
    And state badge text present
