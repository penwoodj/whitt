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
    When group ring element renders w/ state running
    Then glow resolves from same theme.colors.running token as ball
    When any element renders
    Then NO ad-hoc color hex values present
