# ADR-0011: Graph-to-Filesystem Mapping

Status: Proposed
Date: 2026-08-09
Supersedes: none

## Context

Graph UI represents research as nodes. Nodes need persistent storage on local FS for Git versioning + backup. UI must be fast — direct FS reads on every render too slow. Memory layer needed for speed.

## Decision

Each graph node maps to local FS artifact. Lifecycle: md file → folder + index.md when expanded. Titles rename lazily. Memory layer holds hot state.

## Consequences

- One md file per leaf node (no children yet)
- One folder per expanded node (has children)
- Folder name = current title (lazy rename on title change)
- `index.md` inside folder = the expanded node's own content
- Child nodes = sibling md files (or folders) inside parent folder
- Memory layer (Neo4j + in-mem cache) drives UI; FS is source of truth
- Git commits capture every state change at FS level
- Renames = git mv (preserves history)

## Features

### Feature: Node creation = md file

```gherkin
Feature: Node creation writes md file
  As usr creates node
  I want md file on disk
  So node persists via Git

  Scenario: New node creates md file
    Given usr on graph w/ project folder /path/to/proj
    When new node spawned w/ title "Research Notes"
    Then file /path/to/proj/research-notes.md created
    And file contains YAML frontmatter w/ node id + created_at
    And body contains placeholder markdown

  Scenario: Title slugified for filename
    Given new node w/ title "Hello World! Special?"
    When md file created
    Then filename = "hello-world-special.md"
    And original title preserved in YAML title field

  Scenario: Idempotent filename collision
    Given existing file hello-world.md
    When new node w/ title "Hello World" created
    Then filename = "hello-world-2.md"
    And YAML title field = "Hello World"
```

### Feature: Node expand = folder + index.md

```gherkin
Feature: Node expand converts md to folder
  As usr expands node
  I want folder w/ index.md
  So children nest inside

  Scenario: Expand leaf node creates folder
    Given node w/ file research-notes.md
    When usr expands node (adds first child)
    Then research-notes.md → research-notes/ folder
    And research-notes/index.md created w/ prior content
    And research-notes/index.md YAML has node id + parent=null

  Scenario: Child node creates sibling md inside folder
    Given expanded node research-notes/
    When new child node spawned w/ title "Sub Topic"
    Then research-notes/sub-topic.md created
    And child YAML has parent=research-notes/index

  Scenario: Expand child repeats pattern
    Given child research-notes/sub-topic.md
    When usr expands child
    Then sub-topic.md → research-notes/sub-topic/ folder
    And research-notes/sub-topic/index.md created
    And prior children of sub-topic (if any) now inside sub-topic/ folder
```

### Feature: Lazy title rename

```gherkin
Feature: Lazy title rename via git mv
  As usr edits node title
  I want folder/file renamed lazily
  So FS stays synced w/ UI

  Scenario: Rename leaf md file
    Given node file old-name.md w/ title "Old Name"
    When title agentically updated to "New Name"
    Then git mv old-name.md new-name.md
    And YAML title field = "New Name"
    And memory layer updated immediately (UI snappy)
    And FS rename queued (lazy, debounced 2s)

  Scenario: Rename expanded folder
    Given folder old-name/ w/ index.md + children
    When title updated to "New Name"
    Then git mv old-name/ new-name/
    And new-name/index.md YAML title = "New Name"
    And child paths updated in memory layer
    And edges in graph updated to reflect new path

  Scenario: Rename collision
    Given rename target new-name.md exists
    When rename attempted
    Then append -2 (or next int) to filename
    And UI title unchanged (preserves user intent)
    And log warn "filename collision, appended suffix"

  Scenario: Lazy rename batching
    Given 5 title edits in 2s window
    When debounce timer fires
    Then single git mv executed for final name
    And intermediate names discarded
    And log info "batched 5 renames into 1 git mv"
```

### Feature: Memory layer for speed

```gherkin
Feature: Memory layer holds hot state
  As UI renders graph
  I want memory layer
  So rendering fast + FS authoritative

  Scenario: Initial load reads FS once
    Given project folder selected
    When graph first opened
    Then recursive FS scan builds node tree
    And tree loaded into memory layer (Neo4j + in-mem cache)
    And UI renders from memory (fast)

  Scenario: UI updates from memory
    Given graph open
    When usr clicks node
    Then node data fetched from memory layer (sub-ms)
    And no FS read

  Scenario: Mutation writes memory + queues FS
    Given graph open
    When usr edits node title
    Then memory layer updated immediately
    And UI re-renders (snappy)
    And FS write queued (lazy, debounced)

  Scenario: Periodic FS sync
    Given mutations in memory queue
    When debounce timer fires (2s default)
    Then queue flushed to FS
    And git commit auto-created w/ "auto: sync N mutations"
    And memory layer marked clean

  Scenario: Neo4j as graph index
    Given memory layer active
    When usr traverses edges
    Then Neo4j queried for neighbors
    And FS not touched
    And result cached in memory (LRU, 1000 nodes)

  Scenario: Crash recovery from FS
    Given memory layer corrupted
    When app restarts
    Then FS scan rebuilds memory layer
    And Neo4j re-seeded from FS
    And log info "memory layer rebuilt from FS"

  Scenario: FS is source of truth on conflict
    Given memory layer + FS diverge
    When conflict detected (e.g., external edit)
    Then FS wins (reload into memory)
    And log warn "FS/memory conflict, FS won"
    And unsaved memory mutations discarded w/ user prompt
```

### Feature: Project folder layout

```gherkin
Feature: Project folder layout
  As usr picks project
  I want consistent folder structure
  So Git tracks everything

  Scenario: New project creates root folder
    Given usr clicks New Project + names it "My Research"
    When Create btn clicked
    Then folder selected via ProjectFolderPicker created
    And .whitt/ config subfolder created inside
    And .whitt/config.yml stores project metadata
    And root index.md created w/ placeholder markdown
    And initial commit "init: My Research project"

  Scenario: Project tree structure
    Given existing project w/ 3 expanded nodes + children
    When usr views folder tree
    Then structure looks like:
      | my-research/
      | ├── .whitt/
      | │   └── config.yml
      | ├── index.md             # root node
      | ├── topic-a/             # expanded node
      | │   ├── index.md
      | │   ├── sub-1.md
      | │   └── sub-2.md
      | └── topic-b/             # expanded node
      |     ├── index.md
      |     └── child.md

  Scenario: Whitt config subfolder
    Given any project folder
    When inspected
    Then .whitt/ exists
    And .whitt/config.yml has project uuid, name, created_at, neo4j_path
    And .whitt/cache/ for transient artifacts (gitignored)
    And .whitt/logs/ for app logs (gitignored)
```

### Feature: Markdown + YAML frontmatter

```gherkin
Feature: Markdown w/ YAML frontmatter per node
  As usr views node content
  I want md w/ YAML header
  So both human-readable + machine-parseable

  Scenario: Node md file format
    Given any node md file
    When read
    Then starts w/ YAML frontmatter delimited by ---
    And YAML has: id (uuid), title, parent (path|nullable), children (array of paths), created_at, updated_at, status
    And body is markdown content (agentically generated or user-edited)

  Scenario: YAML drives graph behavior
    Given node YAML w/ status="expanded"
    When graph renders
    Then node shows expand arrow
    And children rendered as connected nodes

  Scenario: YAML focus_jump field
    Given node YAML w/ focus_jump="sibling-node-id"
    When usr activates node
    Then graph focus jumps to focus_jump target
    And camera animates to target node
```

## Open Questions

- Memory layer eviction policy under RAM pressure (LRU vs LFU vs priority)
- Concurrent edit conflict resolution if multiple machines sync via Git
- Neo4j instance per-project vs single instance w/ project-scoped queries
- FS rename atomicity on Windows (git mv on case-insensitive FS)
- Lazy rename debounce window (2s default — needs validation under heavy edit)

## References

- ADR-0001 (master vision)
- ADR-0006 (.whitt/ markdown + YAML drive)
- ADR-0007 (Neo4j + local FS sync)
