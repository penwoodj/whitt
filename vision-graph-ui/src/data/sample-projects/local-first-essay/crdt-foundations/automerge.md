---
id: b4c5d6e7-f8a9-0123-7890-234567890123
title: Automerge - JSON CRDT Implementation
parent: ./index.md
children:
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: done
focus_jump:
---

# Automerge - JSON CRDT Implementation

Automerge brings CRDT power to JSON documents, enabling seamless collaboration on structured data with automatic conflict resolution.

## JSON-Centric Design

Automerge works directly with JSON data:

```javascript
import { Doc } from '@automerge/automerge'

let doc = Doc.create()
doc = Doc.change(doc, (d) => {
  d.text = new Automerge.Text()
  d.items = []
  d.metadata = { created: Date.now() }
})
```

### JSON Compatibility
- **Native Types**: Objects, arrays, strings, numbers, booleans
- **Counter Type**: Special counter for conflict-free increments
- **Text Type**: Rich text with character-level merging
- **Date Handling**: Proper timestamp synchronization

## Conflict Resolution

Automerge provides automatic conflict resolution:

### Last-Writer-Wins
For scalar values:
```javascript
// Concurrent edits to same field
doc1 = Doc.change(doc1, (d) => { d.status = 'active' })
doc2 = Doc.change(doc2, (d) => { d.status = 'pending' })

// Merged result uses last writer's value
const merged = Doc.merge(doc1, doc2)
```

### Sequence Merging
For arrays and lists:
- **Insertion**: Concurrent inserts maintain relative order
- **Deletion**: Deletions are idempotent and commute
- **Movement**: Complex moves are handled correctly

### Counter Type
Conflict-free counting:
```javascript
doc = Doc.change(doc, (d) => {
  d.views = new Automerge.Counter(0)
})

// Concurrent increments
doc1 = Doc.change(doc, (d) => { d.views.increment(1) })
doc2 = Doc.change(doc, (d) => { d.views.increment(1) })

// Result: views = 2 (no conflict)
```

## Synchronization

### Patch-Based Sync
Efficient binary patch format:
```javascript
// Get changes since last sync
const changes = Doc.getChanges(doc, lastSync)

// Apply changes to another document
doc = Doc.applyChanges(doc, changes)
```

### Save and Load
Binary serialization:
```javascript
// Save document state
const binary = Doc.save(doc)

// Load document state
doc = Doc.load(binary)
```

## Storage Backends

Automerge supports multiple storage options:
- **IndexedDB**: Browser-local persistence
- **File System**: Node.js applications
- **Custom Storage**: Pluggable storage interface
- **Cloud Sync**: Compatible with any storage backend

## Applications

Automerge is ideal for:
- **Document Collaboration**: Word processors, note apps
- **Configuration Management**: Distributed configuration files
- **Data Collection**: Forms and surveys with offline support
- **Game State**: Multiplayer game state synchronization

The JSON-first approach makes Automerge accessible to developers familiar with traditional web development.