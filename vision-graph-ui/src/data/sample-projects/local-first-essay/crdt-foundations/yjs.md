---
id: a3b4c5d6-e7f8-9012-6789-123456789012
title: Yjs - Real-time Collaboration Framework
parent: ./index.md
children:
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: done
focus_jump:
---

# Yjs - Real-time Collaboration Framework

Yjs is a high-performance CRDT framework that enables real-time collaboration in web applications with automatic conflict resolution.

## Core Architecture

Yjs provides several fundamental data types:

```javascript
import * as Y from 'yjs'

const doc = new Y.Doc()
const text = doc.getText('content')  // Shared text
const array = doc.getArray('items')  // Shared array
const map = doc.getMap('metadata')   // Shared map
```

### Shared Types
- **Y.Text**: Rich text with formatting and embedded content
- **Y.Array**: Ordered list with insert/delete operations
- **Y.Map**: Key-value store with automatic merging
- **Y.XmlFragment**: Structured document representation

### Awareness System
Real-time user presence and cursors:
```javascript
const awareness = doc.awareness

awareness.setLocalStateField('user', {
  name: 'Alice',
  color: '#ff0000'
})

// Track other users' cursors
awareness.on('change', () => {
  const users = Array.from(awareness.getStates().values())
})
```

## Synchronization

### WebRTC Provider
Peer-to-peer synchronization:
```javascript
import { WebRTCProvider } from 'y-webRTC'

const provider = new WebRTCProvider('room-name', doc, {
  signaling: ['wss://signaling-server.com']
})
```

### WebSocket Provider
Server-mediated synchronization:
```javascript
import { WebsocketProvider } from 'y-websocket'

const provider = new WebsocketProvider(
  'wss://demos.yjs.dev',
  'room-name',
  doc
)
```

## Performance Optimizations

Yjs includes several optimizations:
- **Lazy Loading**: Load only visible portions of large documents
- **Compression**: Efficient binary encoding for updates
- **Garbage Collection**: Remove deleted content to save space
- **Delta Updates**: Only send changes, not full state

## Use Cases

Yjs excels in:
- **Collaborative Editors**: Google Docs-like applications
- **Whiteboard Apps**: Figma, Miro-style collaboration
- **Code Editors**: VS Code Live Share, real-time pair programming
- **Design Tools**: Collaborative design and prototyping

The framework's performance and reliability make it the de facto standard for real-time collaboration on the web.