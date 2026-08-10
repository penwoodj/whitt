---
id: e7f8a9b0-c1d2-3456-0123-567890123456
title: Server-Relay Synchronization
parent: ./index.md
children:
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: done
focus_jump:
---

# Server-Relay Synchronization

Server-relay sync provides reliable, scalable synchronization through central infrastructure while maintaining local-first principles.

## Relay Architecture

### WebSocket-Based Sync
Real-time bidirectional communication:

```javascript
const ws = new WebSocket('wss://sync.example.com')

ws.onopen = () => {
  // Authenticate and subscribe
  ws.send(JSON.stringify({
    type: 'subscribe',
    documentId: 'doc-123',
    token: userToken
  }))
}

ws.onmessage = (event) => {
  const message = JSON.parse(event.data)
  if (message.type === 'update') {
    applyRemoteChanges(message.changes)
  }
}

// Send local changes
function sendLocalChanges(changes) {
  ws.send(JSON.stringify({
    type: 'update',
    documentId: 'doc-123',
    changes: changes
  }))
}
```

### Server Responsibilities
- **Connection Management**: Handle persistent connections
- **Message Routing**: Direct updates to relevant clients
- **Conflict Detection**: Early conflict identification
- **Authentication**: Secure access control
- **Persistence**: Temporary message queuing

## Synchronization Protocols

### Real-Time Updates
WebSocket-based instant sync:
- **Change Broadcasting**: Push updates to all subscribers
- **Presence Tracking**: Show active collaborators
- **Cursor Sync**: Real-time cursor positions
- **Connection Recovery**: Automatic reconnection handling

### Polling Fallback
For environments without WebSockets:
```javascript
async function pollForUpdates() {
  const response = await fetch('/api/sync/poll', {
    method: 'POST',
    body: JSON.stringify({
      documentId: 'doc-123',
      lastSync: lastSyncTimestamp
    })
  })
  const updates = await response.json()
  applyUpdates(updates)
}
```

### Delta Compression
Minimize bandwidth usage:
- **Binary Encoding**: MessagePack, Protocol Buffers
- **Change Detection**: Only send modified data
- **Compression**: Gzip/Brotli for large payloads
- **Batching**: Group multiple changes together

## Server Infrastructure

### Horizontal Scaling
Multiple server instances:
```javascript
// Redis pub/sub for cross-server sync
const redis = require('redis')
const subscriber = redis.createClient()

subscriber.subscribe('document-updates', (message) => {
  const update = JSON.parse(message)
  broadcastToClients(update.documentId, update.changes)
})
```

### Load Balancing
- **Session Affinity**: Route user to same server
- **Document Sharding**: Distribute documents across servers
- **Geographic Distribution**: Edge servers for low latency
- **Circuit Breaking**: Fail gracefully under load

## Security and Privacy

### End-to-End Encryption
Server can't read user data:
```javascript
// Client-side encryption
const encryptedData = encrypt(changes, userKey)

// Server only routes encrypted data
ws.send(JSON.stringify({
  type: 'update',
  documentId: 'doc-123',
  encryptedData: encryptedData
}))

// Recipient decrypts
const decryptedData = decrypt(message.encryptedData, userKey)
```

### Access Control
- **Authentication**: Verify user identity
- **Authorization**: Check document permissions
- **Rate Limiting**: Prevent abuse
- **Audit Logging**: Track all sync operations

## Benefits and Trade-offs

### Advantages
- **Reliability**: Professional infrastructure
- **Scalability**: Handle millions of users
- **Cross-Network**: Works across different networks
- **Maintenance**: Centralized updates and monitoring

### Challenges
- **Cost**: Server infrastructure expenses
- **Privacy**: Centralized data access
- **Dependency**: Service availability critical
- **Complexity**: Infrastructure management required

Server-relay sync provides the best user experience for applications that need maximum reliability and cross-network collaboration.