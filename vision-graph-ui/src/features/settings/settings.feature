Feature: Settings slice
  As usr
  I want Settings pg w/ toggles + inputs
  So I cfg app behavior

  Scenario: Auto-accept default on
    Given Settings fresh
    When Settings renders
    Then AutoAcceptToggle shows on

  Scenario: Toggle auto-accept off
    Given AutoAcceptToggle on
    When usr clicks toggle
    Then toggle shows off
    And onChange called w/ false

  Scenario: Voice shortcut default Ctrl+Space
    Given Settings fresh
    When VoiceShortcutInput renders
    Then input value = "Ctrl+Space"

  Scenario: Invalid shortcut shows err
    Given VoiceShortcutInput w/ value "x"
    When input blurs
    Then input border red
    And err msg "must contain modifier key"

  Scenario: Model endpoint default localhost
    Given Settings fresh
    When ModelEndpointInput renders
    Then input value = "http://localhost:8080"

  Scenario: Invalid endpoint shows err
    Given ModelEndpointInput w/ value "ftp://bad"
    When input blurs
    Then input border red

  Scenario: Folder picker empty default
    Given Settings fresh
    When ProjectFolderPicker renders
    Then input empty

  Scenario: Folder picker browse btn
    Given ProjectFolderPicker rendered
    When usr clicks Browse btn
    Then btn calls onBrowse
    And no real file picker opens

  Scenario: Settings persist to localStorage
    Given Settings w/ autoAccept=false
    When usr reloads pg
    Then Settings restored w/ autoAccept=false

  Scenario: Layout has all 4 sections
    Given Settings rendered
    When usr views pg
    Then sees AutoAccept section
    And VoiceShortcut section
    And ModelEndpoint section
    And ProjectFolder section
