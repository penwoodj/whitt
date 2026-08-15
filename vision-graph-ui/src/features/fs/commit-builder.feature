Feature: Commit builder (git operations via simple-git)
  As FS sync layer
  I want git commit-per-edit via simple-git w/ metadata
  So every file change has audit trail

  Scenario: Commit file with metadata
    Given CommitBuilder w/ git repo
    When builder commits "test.md" w/ metadata {action: "file-edit", actor: "user", refs: ["node-123"]}
    Then git commit created
    And commit message format "whitt: file-edit test.md [user]"
    And commit metadata JSON in message body

  Scenario: Agent commit vs user commit
    Given CommitBuilder w/ git repo
    When builder commits "agent-output.md" w/ metadata {action: "file-create", actor: "agent", refs: ["node-456"]}
    Then commit message format "whitt: file-create agent-output.md [agent]"

  Scenario: No auto-push to remote
    Given CommitBuilder w/ git repo
    When builder commits "local.md" w/ metadata {action: "file-edit", actor: "user", refs: ["node-789"]}
    Then file staged and committed locally
    And not pushed to remote

  Scenario: Multiple files in single commit
    Given CommitBuilder w/ git repo
    When builder commits ["a.md", "b.md"] w/ metadata {action: "file-edit", actor: "user", refs: ["node-123"]}
    Then both files in single commit
    And commit message references primary file

  Scenario: Commit metadata includes timestamp
    Given CommitBuilder w/ git repo
    When builder commits "test.md" w/ metadata {action: "file-edit", actor: "user", refs: ["node-123"], ts: "2026-08-15T00:00:00Z"}
    Then commit message includes ISO timestamp
