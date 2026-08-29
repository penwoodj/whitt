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