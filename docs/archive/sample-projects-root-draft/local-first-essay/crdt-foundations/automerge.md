---
id: d23e4567-e89b-12d3-a456-426614174013
title: Automerge Framework
parent: index.md
children:
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: done
focus_jump:
---

# Automerge Framework

Automerge takes a different approach to CRDTs compared to Yjs. While Yjs focuses on real-time collaboration with low-latency synchronization, Automerge emphasizes local-first workflows with offline-first capabilities and strong consistency guarantees. The framework is particularly well-suited for applications where users need to work offline for extended periods and sync when connectivity becomes available.

The key innovation in Automerge is its focus on JSON-like data structures rather than specialized shared types. This makes it feel more natural for developers accustomed to working with JSON data, while still providing the benefits of CRDT-based synchronization. Automerge also includes built-in change tracking and history, enabling features like time travel and conflict visualization.

## Design Philosophy

### JSON-First Approach
- **Natural data modeling**: Work with familiar JSON structures
- **Schema flexibility**: No rigid type definitions required
- **Incremental adoption**: Migrate existing JSON-based apps
- **Language portability**: Available in JavaScript, Rust, and Python

### Offline-First Focus
- **Local operations**: All reads and writes are local
- **Async synchronization**: Sync happens in the background
- **Conflict handling**: Automatic resolution with user override
- **Change history**: Complete audit trail of all changes

## Core API

### Basic Usage
```javascript
import Automerge from 'automerge';

let doc = Automerge.init();

// Local changes
doc = Automerge.change(doc, (doc) => {
  doc.title = "My Document";
  doc.items = ["Item 1", "Item 2"];
});

// Sync with remote
const [newDoc, syncState] = Automerge.sync(doc, remoteSyncState);

// Apply remote changes
doc = Automerge.merge(doc, remoteDoc);
```

### Advanced Patterns
```javascript
// Conflict resolution with custom logic
doc = Automerge.change(doc, (doc) => {
  if (Automerge.isConflicted(doc.title)) {
    // Custom conflict resolution
    doc.title = resolveTitleConflict(doc.title);
  }
});

// Time travel through history
const pastVersion = Automerge.getHistory(doc)[5].snapshot;
```

## Comparison with Yjs

| Feature | Automerge | Yjs |
|---------|-----------|-----|
| Primary focus | Offline-first workflows | Real-time collaboration |
| Data model | JSON-like structures | Specialized shared types |
| Sync strategy | Async, batched | Real-time, streaming |
| Change tracking | Built-in history | Manual implementation |
| Use case | Long-form content, documents | Real-time editing, whiteboards |

## Strengths

- **Natural developer experience**: JSON-like API feels familiar
- **Strong offline support**: Designed for extended offline work
- **Built-in history**: Change tracking and time travel
- **Language diversity**: Rust core with JavaScript bindings
- **Conflict visualization**: Tools for understanding and resolving conflicts

## Weaknesses

- **Real-time performance**: Not optimized for low-latency collaboration
- **Memory usage**: History tracking increases memory footprint
- **Learning curve**: Conflict resolution requires understanding
- **Ecosystem size**: Smaller community than Yjs

## Best Use Cases

- **Document editing**: Word processors, note-taking apps
- **Project management**: Task lists, project plans
- **Configuration management**: Settings, preferences
- **Data collection**: Forms, surveys, field research

## Integration Patterns

Automerge works well as a local database with sync:
```javascript
// Local-first pattern
class LocalFirstStore {
  constructor() {
    this.doc = Automerge.load(localStorage.getItem('doc') || Automerge.init());
  }

  update(updater) {
    this.doc = Automerge.change(this.doc, updater);
    this.persist();
    this.scheduleSync();
  }

  persist() {
    localStorage.setItem('doc', Automerge.save(this.doc));
  }

  async scheduleSync() {
    if (navigator.onLine) {
      await this.syncWithServer();
    }
  }
}
```

> Automerge proves that offline-first and real-time collaboration require different tradeoffs—there's no one-size-fits-all CRDT solution.