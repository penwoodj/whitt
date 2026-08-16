Feature: Physics Simulation
  As usr on graph canvas
  I want nodes to have physics-based movement
  So graph feels organic and self-organizing

  Scenario: GRPC-09 reheat on drag
    Given canvas w/ settled nodes in stable positions
    When usr drags any node
    Then physics simulation reheats
    And nearby nodes respond to movement
    And graph gradually settles back to stability

  Scenario: GRPC-09 collision resolution
    Given canvas w/ nodes positioned close together
    When physics simulation runs
    Then nodes push apart to avoid overlap
    And minimum separation maintained between nodes

  Scenario: GRPC-09 auto-sleep
    Given canvas w/ active physics simulation
    When nodes reach stable equilibrium
    Then simulation auto-sleeps to save resources
    And drag wakes simulation again

  Scenario: GRPC-09 center force
    Given canvas w/ nodes scattered at edges
    When physics simulation runs
    Then nodes gently pulled toward canvas center
    And distribution balanced across canvas

  Scenario: GRPC-09 velocity decay
    Given nodes moving due to physics forces
    When simulation progresses over time
    Then node velocities gradually decay
    And movement becomes smoother and more controlled