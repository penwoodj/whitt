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