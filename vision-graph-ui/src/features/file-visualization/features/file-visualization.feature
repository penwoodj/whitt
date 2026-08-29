Feature: File preview area
  As usr on node detail panel
  I want see file content rendered
  So I can read markdown content

  Scenario: FIL-01 area present
    Given expanded node w/ file content
    When preview area renders
    Then preview area appears under execution area
    And content is shown

  Scenario: FIL-02 markdown preview
    Given preview area w/ markdown content
    When markdown rendered
    Then headings appear as h2 elements
    And raw markdown not shown

  Scenario: FIL-04 edit toggle
    Given preview area w/ content
    When usr clicks edit icon
    Then raw textarea shown w/ source md
    And edit button becomes save

  Scenario: FIL-05 blur saves
    Given edit mode active w/ modified content
    When usr clicks outside
    Then save enqueued to write queue
    And view returns to preview

  Scenario: FILC-01 skeleton
    Given slow loader (300ms delay)
    When preview area renders
    Then skeleton shown at >200ms
    And skeleton has layout-matched blocks
    And skeleton caps at 5s

  Scenario: FILC-02 save failure
    Given save operation fails
    When save attempted
    Then inline error shown + retry btn
    And in-memory text intact

  Scenario: FILC-03 concurrent guard
    Given edit mode active
    And disk-change event fires
    When usr attempts save
    Then conflict notice shown
    And keep-mine preserves usr text

  Scenario: FILC-04 close guard
    Given edit mode active w/ unsaved changes
    When save fails
    Then close blocked
    And error shown
    And text preserved

  Scenario: FIL-07 ctrl+F
    Given preview area w/ markdown content
    When usr opens find dialog
    And usr types search term
    Then all matches highlighted in preview
    And matches remain highlighted after search

  Scenario: FILX-01 line numbers both modes
    Given preview area w/ multi-line content
    When preview renders
    And usr toggles raw mode
    Then line numbers shown in preview mode
    And line numbers shown in raw mode
    And line numbers persist across mode toggles

  Scenario: FIL-07 ctrl+F
    Given preview area w/ markdown content
    When usr opens find dialog
    And usr types search term
    Then all matches highlighted in preview
    And matches remain highlighted after search

  Scenario: FILX-01 line numbers both modes
    Given preview area w/ multi-line content
    When preview renders
    And usr toggles raw mode
    Then line numbers shown in preview mode
    And line numbers shown in raw mode
    And line numbers persist across mode toggles

  Scenario: NodeDetailPanel integration
    Given NodeDetailPanel w/ markdown content
    When panel renders
    Then FilePreview area present
    And markdown rendered
    And edit button functional