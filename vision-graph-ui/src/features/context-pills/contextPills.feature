Feature: Context pills in STT tooltip
  As usr on graph w/ file visualization
  I want highlighted content shown as pills in STT tooltip
  So I see exactly what context ships w/ prompt

  Scenario: PIL-01 pills on highlight
    Given file visualization w/ 2 spans highlighted (L12-18, L24-30)
    And STT tooltip open
    When Node renders expanded
    Then 2 pills shown in tooltip
    And pill faces show line range only (L12-18, L24-30)
    And pills styled like Cursor chips (dark, elevated, rounded)

  Scenario: PIL-02 remove via X
    Given context pill shown (L12-18)
    When usr hovers pill
    Then X button visible
    When usr clicks X
    Then pill removed from pills list
    And highlight retained in file visualization

  Scenario: PIL-03 line numbers
    Given span highlighted (L12-18)
    When pill rendered
    Then pill shows line range format "L12-18"
    And line range clickable to preview snippet

  Scenario: PIL-04 pause highlight speak
    Given STT stopped
    When usr highlights 2 spans (L12-18, L24-30)
    And usr speaks prompt
    When usr sends prompt
    Then payload = spoken transcript + pill references
    And pills include lineRange + textSnippet

  Scenario: PIL-05 attention weighting
    Given prompt sent w/ 2 pills
    When payload composed
    Then weightedContext flag true
    And agent receives weighted pill ranges

  Scenario: PILC-01 overflow stacking
    Given 8 spans highlighted (L1-3, L5-7, L9-11, L13-15, L17-19, L21-23, L25-27, L29-31)
    When tooltip renders
    Then 6 pills shown (2 rows of 3)
    And "+2 more" pill shown
    When usr clicks "+2 more"
    Then overflow list shown w/ remaining 2 pills

  Scenario: PILC-02 hover preview
    Given context pill shown (L12-18)
    When usr hovers pill
    Then preview shows text snippet + line range
    And preview includes jump button
    When usr clicks jump button
    Then file preview scrolls to span
    And span visually expanded