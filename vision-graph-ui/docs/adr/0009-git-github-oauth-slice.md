# ADR-0009: Git GitHub OAuth Slice

**Status:** Proposed  
**Date:** 2026-08-08  
**Supersedes:** none

## Context

Git versioning required for reliable backup. GitHub OAuth in React enables remote sync. Only "sync remote" btn visible to user. Rest invisible. Connects to ADR-0001 git versioning requirement.

## Decision

Integrate Git + GitHub OAuth. Auto-commit markdown changes. GitHub CLI for push/pull. Only "sync remote" btn visible. Use React OAuth flow.

## Consequences

- Reliable versioning
- Remote backup
- GitHub dependency
- OAuth flow complexity

## Features

### Feature: Auto-commit markdown changes

Auto-commit on save. All markdown docs in .whitt/ committed. Git history tracks all graph state.

```gherkin
Feature: Auto-commit markdown changes
  As usr on graph
  I want auto-commit
  So I never lose changes

  Scenario: Commit on save
    Given Node edited
    When usr saves graph
    Then git add all .whitt/ files
    And git commit with auto-generated msg
    And commit msg describes changes

  Scenario: Generate meaningful commit msg
    Given Multiple nodes edited
    When auto-commit runs
    Then commit msg lists changed files
    And msg summarizes changes: "edited 3 nodes"

  Scenario: Handle no changes
    Given No files changed
    When usr saves graph
    Then git status shows clean
    And no commit created
```

### Feature: GitHub OAuth in React

OAuth flow in React app. User authorizes GitHub access. Token stored securely.

```gherkin
Feature: GitHub OAuth in React
  As usr on graph
  I want authorize GitHub
  So I sync to remote

  Scenario: Start OAuth flow
    Given usr clicks "sync remote" first time
    Then OAuth popup opens
    And GitHub login page shows

  Scenario: Complete OAuth
    Given GitHub login page open
    When usr authorizes app
    Then OAuth callback received
    And access token stored
    And "sync remote" btn shows "connected"

  Scenario: Handle OAuth rejection
    Given GitHub login page open
    When usr rejects authorization
    Then OAuth error received
    And error msg shows "authorization denied"
    And "sync remote" btn shows "connect"
```

### Feature: Only sync remote btn visible

Git UI hidden except "sync remote" btn. No commit history, no branch selector, no status visible. Git invisible.

```gherkin
Feature: Only sync remote btn visible
  As usr on graph
  I want only sync btn visible
  So git stays invisible

  Scenario: Hide all git UI
    Given Graph page loaded
    Then "sync remote" btn visible
    And commit history invisible
    And branch selector invisible
    And git status invisible

  Scenario: Sync btn shows status
    Given Local commits ahead of remote
    Then "sync remote" btn shows "push (3)"
    Given Remote commits ahead of local
    Then btn shows "pull (2)"
    Given Up to date
    Then btn shows "synced"

  Scenario: No other git controls
    Given Graph page loaded
    Then no "commit" btn visible
    And no "branch" dropdown visible
    And no "history" panel visible
```

### Feature: Sync remote via GitHub CLI

GitHub CLI handles push/pull. OAuth token passed to CLI. Sync status shown on btn.

```gherkin
Feature: Sync remote via GitHub CLI
  As usr on graph
  I want sync via CLI
  So I use GitHub tools

  Scenario: Push local commits
    Given "sync remote" btn shows "push (3)"
    When usr clicks btn
    Then GitHub CLI pushes commits
    And push progress shows
    And btn updates to "synced"

  Scenario: Pull remote changes
    Given "sync remote" btn shows "pull (2)"
    When usr clicks btn
    Then GitHub CLI pulls changes
    And pull progress shows
    And graph reloads with new state

  Scenario: Handle sync conflict
    Given Local and remote both have changes
    When usr clicks "sync remote"
    Then GitHub CLI detects conflict
    And error msg shows "merge conflict"
    And usr must resolve manually
```

### Feature: Git ignore non-markdown files

Ignore non-markdown files in .whitt/. Only version markdown docs. Cache, logs, temp files ignored.

```gherkin
Feature: Git ignore non-markdown files
  As usr on graph
  I want only markdown versioned
  So I keep repo clean

  Scenario: Create .gitignore
    Given .whitt/ folder created
    Then .gitignore created
    And ignore patterns: *.log, *.tmp, cache/, node_modules/

  Scenario: Commit only markdown
    Given Mixed files in .whitt/
    When auto-commit runs
    Then only .md files added to git
    And ignored files excluded

  Scenario: Validate .gitignore
    Given .gitignore exists
    When new file created in .whitt/
    If file matches ignore pattern
    Then file not shown in git status
```

### Feature: Time travel via git log (prep)

Prepare git log for time travel. Commits tagged with graph state. Ready for ADR-0010.

```gherkin
Feature: Time travel via git log (prep)
  As usr on graph
  I want commits tagged
  So I can time travel later

  Scenario: Tag commits with graph state
    Given Auto-commit creates commit
    Then commit tagged with: timestamp, node_count, line_count

  Scenario: Store commit metadata
    Given Commit created
    Then metadata stored in commit body
    And metadata includes: changed_files, node_ids, line_ids

  Scenario: Query commit history
    Given Multiple commits exist
    When time travel feature queries history
    Then commit list returned with metadata
    And metadata enables graph state preview
```

### Feature: Handle git repo initialization

Initialize git repo on first use. Detect existing repo. Create initial commit.

```gherkin
Feature: Handle git repo initialization
  As usr on graph
  I want git auto-initialized
  So I don't setup manually

  Scenario: Detect existing repo
    Given .git folder exists
    When app starts
    Then git repo detected
    And no initialization needed

  Scenario: Initialize new repo
    Given .git folder missing
    When app starts
    Then git init executed
    And initial commit created
    And .gitignore created

  Scenario: Create initial commit
    Given Git repo initialized
    Then initial commit created
    And commit msg "Initial graph state"
    And all .md files committed
```

## Dependencies

- ADR-0001: Voice Graph Vision (master vision)
- ADR-0006: Whitt Folder Markdown YAML Slice (markdown to version)
- GitHub OAuth SDK
- GitHub CLI
