Feature: Watcher adapter (chokidar + hash-diff)
  As FS sync layer
  I want chokidar watcher w/ hash-diff external change detection
  So FS edits trigger memory reload

  Scenario: Watch directory and emit on file change
    Given WatcherAdapter watching "/"
    When file "test.md" changes externally
    Then debounced change event emitted after 500ms
    And event contains path "test.md"

  Scenario: Hash-diff detects real content changes
    Given WatcherAdapter watching "/" w/ memory hash for "test.md" = "old-hash"
    When file "test.md" changes but content hash same
    Then no event emitted
    When file "test.md" changes w/ new hash
    Then event emitted

  Scenario: Multiple rapid changes coalesce into single event
    Given WatcherAdapter watching "/"
    When file "test.md" changes 3 times within 500ms
    Then single change event emitted after debounce

  Scenario: External change detected triggers reload
    Given WatcherAdapter watching "/" w/ callback
    When external edit to "test.md" detected
    Then callback emits "external-change" event
    And event path equals "test.md"

  Scenario: Watcher ignores ignored paths
    Given WatcherAdapter watching "/" ignoring ["node_modules", ".git"]
    When file in "node_modules/package.json" changes
    Then no event emitted
