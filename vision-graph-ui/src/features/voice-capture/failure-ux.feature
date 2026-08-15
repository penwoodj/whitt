Feature: Failure UX states
  As usr on graph
  I want clear error messages when voice capture fails
  So I understand what went wrong and can fix it

  Scenario: Permission denied shows helpful error
    Given usr clicks mic btn
    When browser denies mic permission
    Then engine emits error event
    And error message explains permission denied
    And UI shows retry option

  Scenario: No mic detected disables voice
    Given browser has no microphone
    When voice capture attempted
    Then engine detects no mic
    And UI disables voice affordance
    And UI explains why voice unavailable

  Scenario: Insecure context explains HTTPS requirement
    Given browser not on HTTPS or localhost
    When voice capture attempted
    Then engine detects insecure context
    And error explains HTTPS/localhost requirement
    And UI shows security explanation

  Scenario: No WebGPU falls back w/ perf warning
    Given browser lacks WebGPU
    When voice capture attempted
    Then engine detects no WebGPU
    And engine falls back to WASM
    And UI warns about reduced performance

  Scenario: Engine OOM preserves partial finals
    Given engine running with partial text
    When engine crashes with OOM
    Then engine emits error event
    And partial final text preserved
    And UI shows error + partial text
    And UI offers retry option
