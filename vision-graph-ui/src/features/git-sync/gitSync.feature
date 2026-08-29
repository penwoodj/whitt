Feature: Git time travel + sync
  As usr on graph
  I want git commit per edit + sync btn
  So I time travel via git + remote backup

  Scenario: GIT-01 commit per save
    Given canvas w/ node
    When usr saves node edit (FIL-05 flow)
    Then commit called once
    And msg contains metadata fields

  Scenario: GIT-02 agent commits
    Given canvas w/ node
    When agent runs 3 mutations
    Then ≥3 commits at mutation boundaries

  Scenario: GIT-03 all mutations logged
    Given canvas w/ nodes
    When usr does edit + spawn + group
    Then each produced commit (count + types)

  Scenario: GIT-04 sync button
    Given canvas w/ sync button
    When usr clicks sync
    Then push spy called

  Scenario: GITC-01 sync progress
    Given canvas w/ sync button
    When slow push runs
    Then btn shows running state
    And canvas interactive

  Scenario: GITC-02 sync failure
    Given canvas w/ sync button + commits
    When push rejects (auth)
    Then error shown near btn
    And local commits intact

  Scenario: GITC-03 metadata schema
    Given commits made
    When inspecting commit msgs
    Then footer parseable: actor/action/refs/ts

  Scenario: GITC-04 cadence guard
    Given usr editing node
    When agent writes during edit
    Then agent commit ordered after usr editor flush