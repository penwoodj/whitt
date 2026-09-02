Feature: T7 composed graph surfaces
  As usr on graph
  I want execution, context, files, agent, and git surfaces reachable
  So graph state stays inspectable

  Scenario: Expanded node shows execution state
    Given usr opens AI Frameworks Research
    When usr expands Voice Node and sends prompt
    Then execution panel shows running state
    And agent step event shows in panel

  Scenario: Completed node shows file preview
    Given usr sends prompt on expanded Voice Node
    When execution completes with file-write event
    Then FilePreview shows generated markdown
    And Edit control is visible

  Scenario: Context pill remove and jump stay typed
    Given expanded Voice Node has context pill L12-18
    When usr removes pill
    Then pill remove callback updates graph state
    When usr jumps to pill
    Then file jump callback receives pill id

  Scenario: Context pill payload reaches prompt run
    Given expanded Voice Node has context pill L12-18
    When usr sends prompt with pill context
    Then run payload keeps prompt text
    And run payload keeps pill id, file path, and line range

  Scenario: Step error shows retry branch
    Given expanded Voice Node run has active step
    When step emits error
    Then execution panel shows error state
    And execution panel shows retry action
    When usr clicks retry
    Then retry callback receives failed step id

  Scenario: Run confirmation keeps prompt pending
    Given expanded Voice Node has prompt text
    When usr requests execution
    Then confirmation dialog shows workflow
    When usr confirms execution
    Then execution panel shows loading state

  Scenario: Agent event shows status and context
    Given expanded Voice Node has agent step event
    When agent emits status update
    Then node shows agent status
    And dialog shows agent context

  Scenario: Git unavailable keeps graph interactive
    Given graph has no git adapter
    When usr opens project graph
    Then git surface shows unavailable state
    And graph node remains interactive

  Scenario: Git sync and timeline remain reachable
    Given usr opens AI Frameworks Research
    When usr clicks Sync
    Then sync status shows synced
    And timeline controls remain visible

  Scenario: Group path stays reachable
    Given graph has selected nodes
    When usr groups selected nodes
    Then group box remains rendered in GraphWorkspace
