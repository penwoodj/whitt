---
id: b23e4567-e89b-12d3-a456-426614174011
title: CRDT Foundations
parent: ../index.md
children:
  - yjs.md
  - automerge.md
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: expanded
focus_jump:
---

# CRDT Foundations

Conflict-free Replicated Data Types (CRDTs) provide the mathematical foundation for modern local-first applications. These data structures enable multiple devices to modify the same data independently and synchronize changes without requiring central coordination or locking. When conflicts occur, CRDTs resolve them automatically using deterministic algorithms, ensuring all devices eventually converge to the same state.

The magic of CRDTs lies in their ability to separate intent from implementation. When a user edits text, adds a todo item, or reorders a list, CRDTs capture the semantic intent rather than just the resulting state. This intent-based approach allows conflicting edits to be merged meaningfully—both edits are preserved, ordered appropriately, and presented to users in a way that makes sense.

## Core Concepts

### Operation-Based vs. State-Based
- **Operation-based**: Transmit operations, apply them deterministically
- **State-based**: Exchange entire states, merge using mathematical properties
- **Hybrid approaches**: Combine benefits of both

### Convergence Properties
- **Commutativity**: Order of operations doesn't matter
- **Associativity**: Grouping of operations doesn't matter
- **Idempotence**: Applying the same operation twice has no additional effect

## Common CRDT Types

### Counters
- **G-Counter**: Grow-only counter, tracks increments
- **PN-Counter**: Supports both increments and decrements
- Use cases: analytics, voting systems, inventory

### Registers
- **LWW-Register**: Last-write-wins using timestamps
- **MV-Register**: Multi-value register preserves concurrent writes
- Use cases: user profiles, configuration settings

### Sequences and Lists
- **RGA**: Replicated Growable Array for text editing
- **LSeq**: Log-based sequence for lists
- Use cases: document editing, task lists, playlists

### Sets
- **OR-Set**: Observed-Remove Set handles additions and removals
- **2P-Set**: Two-phase set with add and remove sets
- Use cases: tags, categories, permissions

```typescript
// CRDT usage example
import * as Y from 'yjs';

const doc = new Y.Doc();
const text = doc.getText('content');

// Local changes
text.insert(0, 'Hello ');
text.insert(6, 'World');

// Sync with remote
const state = Y.encodeStateAsUpdate(doc);
// send state to peer...

// Apply remote changes
Y.applyUpdate(doc, remoteState);

// Both devices now have same content
console.log(text.toString()); // "Hello World"
```

## Implementation Challenges

- **Memory overhead**: Metadata for conflict tracking
- **Garbage collection**: Removing unused historical data
- **Performance optimization**: Efficient delta compression
- **Complexity**: Understanding and debugging CRDT behavior

## Real-World Applications

- Collaborative text editors (Google Docs, Notion)
- Task management systems
- Configuration management
- Distributed databases

CRDTs transform the fundamental problem of distributed systems from "how do we prevent conflicts" to "how do we resolve conflicts meaningfully." This shift enables the offline-first, multi-device experiences users expect from modern applications.

> CRDTs are the closest thing to magic in distributed systems—they make the impossible possible without requiring users to understand the complexity.