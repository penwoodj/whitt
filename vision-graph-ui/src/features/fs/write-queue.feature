Feature: Write queue (debounce, coalesce, flush events)
  As FS sync layer
  I want debounced write queue w/ per-path coalescing
  So rapid edits to same file result in single write+commit

  Scenario: Single write queued and flushed after debounce
    Given WriteQueue w/ 2s debounce
    When queue writes "test.md" w/ "content"
    And 2s debounce expires
    Then flush event emitted
    And event contains path "test.md"
    And event contains content "content"

  Scenario: Multiple writes to same path coalesce into single flush
    Given WriteQueue w/ 2s debounce
    When queue writes "test.md" w/ "v1"
    And queue writes "test.md" w/ "v2" within 500ms
    And queue writes "test.md" w/ "v3" within 500ms
    And 2s debounce expires
    Then single flush event emitted
    And flushed content equals "v3"
    And not flushed "v1" or "v2"

  Scenario: Multiple paths flush independently
    Given WriteQueue w/ 2s debounce
    When queue writes "a.md" w/ "content a"
    And queue writes "b.md" w/ "content b"
    And 2s debounce expires
    Then two flush events emitted
    And one event contains path "a.md"
    And one event contains path "b.md"

  Scenario: Flush triggered manually before debounce expires
    Given WriteQueue w/ 2s debounce
    When queue writes "test.md" w/ "content"
    And queue flush triggered manually
    Then flush event emitted immediately
    And event contains path "test.md"

  Scenario: Write after flush starts new debounce window
    Given WriteQueue w/ 2s debounce
    When queue writes "test.md" w/ "first"
    And queue flush triggered
    And queue writes "test.md" w/ "second"
    And 2s debounce expires
    Then second flush event emitted
    And flushed content equals "second"

  Scenario: Queue clears after flush
    Given WriteQueue w/ 2s debounce
    When queue writes "test.md" w/ "content"
    And flush triggered
    And queue checked for pending writes
    Then queue is empty
