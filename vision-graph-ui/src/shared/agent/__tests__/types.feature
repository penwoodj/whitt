Feature: AgentEvt types + GraphMutation vocabulary
  As agent runtime bridge
  I want type-safe event schema
  So UI derives correct state from execution events

  Scenario: AgentEvt union covers all 8 event kinds
    Given AgentEvt type defined
    When run-start event created
    Then event matches run-start shape
    When step-start event created
    Then event matches step-start shape
    When step-done event created
    Then event matches step-done shape
    When step-error event created
    Then event matches step-error shape
    When log event created
    Then event matches log shape
    When file-write event created
    Then event matches file-write shape
    When graph-mutation event created
    Then event matches graph-mutation shape
    When run-done event created
    Then event matches run-done shape

  Scenario: GraphMutation covers 7 ops (spawn/edit/move/group/detach/link/unlink)
    Given GraphMutation type defined
    When spawn op created
    Then mutation has spawn op
    When edit op created
    Then mutation has edit op
    When move op created
    Then mutation has move op
    When group op created
    Then mutation has group op
    When detach op created
    Then mutation has detach op
    When link op created
    Then mutation has link op
    When unlink op created
    Then mutation has unlink op

  Scenario: Type narrowing works on kind discriminator
    Given AgentEvt with kind discriminator
    When event.kind equals run-start
    Then TypeScript narrows to run-start type
    When event.kind equals step-start
    Then TypeScript narrows to step-start type
    When event.kind equals graph-mutation
    Then TypeScript narrows to graph-mutation type
