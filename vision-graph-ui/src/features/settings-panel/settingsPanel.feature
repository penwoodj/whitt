Feature: Settings panel slide-over
  As usr
  I want settings slide-over panel
  So I cfg app w/o leaving graph

  Scenario: Closed by default
    Given SettingsPanel rendered
    When usr views
    Then panel hidden

  Scenario: Open via prop
    Given SettingsPanel isOpen=true
    When rendered
    Then panel visible right side
    And backdrop dims main UI
    And Settings form visible

  Scenario: Close btn hides panel
    Given SettingsPanel open
    When usr clicks X btn
    Then onClose called
    And panel hidden

  Scenario: ESC key closes
    Given SettingsPanel open
    When usr presses Escape
    Then onClose called
