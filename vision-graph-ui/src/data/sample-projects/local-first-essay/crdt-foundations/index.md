---
id: f2a3b4c5-d6e7-8901-5678-012345678901
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

Conflict-free Replicated Data Types (CRDTs) form the mathematical foundation for local-first collaboration, enabling multiple users to edit the same data simultaneously without coordination.

## CRDT Fundamentals

CRDTs guarantee convergence:
- **Commutativity**: Operations can be applied in any order
- **Idempotency**: Duplicate operations have no additional effect
- **Associativity**: Grouping of operations doesn't matter
- **Convergence**: All replicas eventually reach the same state

These properties ensure that concurrent edits automatically resolve without conflicts or central coordination.

## Types of CRDTs

### State-based CRDTs
Each replica maintains full state:
- **G-Counters**: Conflict-free incrementing counters
- **G-Sets**: Grow-only sets
- **OR-Sets**: Observed-remove sets
- **LWW-Element-Sets**: Last-write-wins element sets

State-based CRDTs require exchanging full state but are simple to implement and understand.

### Operation-based CRDTs
Replicas exchange operations only:
- **Commutative Replicated Growable Arrays (CRRGA)**
- **Commutative Replicated Data Types (CmRDT)**
- **Sequence CRDTs** for text editing

Operation-based CRDTs are more bandwidth-efficient but require reliable delivery and causality tracking.

## Practical Implementations

### Yjs
Real-time collaboration framework:
- **Text Editing**: Rich text collaboration with Y.Text
- **Data Structures**: Y.Array, Y.Map, Y.Set for complex data
- **Awareness**: Real-time cursor positions and user presence
- **Persistence**: Multiple storage backends

Y.js is widely used for collaborative editing applications like Notion, Figma, and VS Code Live Share.

### Automerge
JSON-based CRDT implementation:
- **JSON-compatible**: Works with existing data structures
- **Automatic Merging**: Seamless conflict resolution
- **Patch-based**: Efficient synchronization with diff patches
- **TypeScript Support**: Strong typing for documents

Automerge is ideal for document collaboration and configuration management where JSON is the native format.

## Applications

CRDTs enable:
- **Collaborative Editing**: Google Docs, Notion-style collaboration
- **Distributed Systems**: Multi-database consistency
- **Offline-First Apps**: Local-first with background sync
- **IoT Networks**: Device coordination without central servers

The mathematical guarantees of CRDTs make them ideal for building reliable, user-centric applications.