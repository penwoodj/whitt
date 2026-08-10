---
id: c5d6e7f8-a9b0-1234-8901-345678901234
title: Sync Strategies
parent: ../index.md
children:
  - peer-to-peer.md
  - server-relay.md
created_at: 2026-08-09T00:00:00Z
updated_at: 2026-08-09T00:00:00Z
status: expanded
focus_jump:
---

# Sync Strategies

Synchronization strategies define how local-first applications keep data consistent across devices while maintaining offline capability and user privacy.

## Synchronization Goals

Effective sync strategies balance:
- **Consistency**: All devices eventually have the same data
- **Availability**: Work offline without limitations
- **Performance**: Fast sync with minimal bandwidth
- **Privacy**: User control over data sharing
- **Conflict Resolution**: Automatic handling of concurrent edits

## Architecture Patterns

### Peer-to-Peer Sync
Direct device-to-device communication:
- **WebRTC**: Browser-based peer connections
- **Local Network**: LAN discovery and sync
- **Bluetooth**: Mobile device proximity sync
- **QR Codes**: Manual pairing for secure connections

**Advantages**:
- No central server required
- Maximum privacy and security
- Direct control over data sharing
- Reduced infrastructure costs

**Challenges**:
- Device discovery complexity
- NAT traversal issues
- Connection establishment overhead
- Limited offline queueing

### Server-Relay Sync
Central server mediates synchronization:
- **WebSocket**: Real-time bidirectional communication
- **REST APIs**: Polling-based sync
- **WebSub**: Pub/sub notification system
- **Custom Protocols**: Optimized binary protocols

**Advantages**:
- Reliable connectivity
- Easy device discovery
- Efficient for many devices
- Simplified conflict resolution

**Challenges**:
- Server dependency and cost
- Privacy concerns with centralized data
- Single point of failure
- Requires internet connectivity

## Hybrid Approaches

### Local-First with Cloud Backup
Combines benefits of both:
- **Primary**: P2P sync for nearby devices
- **Backup**: Cloud storage for remote access
- **Optional**: Cloud sync for specific sharing scenarios
- **Fallback**: Server relay when P2P unavailable

### Mesh Networks
Decentralized synchronization:
- **Device Mesh**: Each device acts as relay
- **Gossip Protocol**: Updates propagate through network
- **Opportunistic Sync**: Sync when devices meet
- **Ephemeral Connections**: Brief connections sufficient for sync

## Sync Optimization

### Delta Synchronization
Only send changes:
```javascript
// Instead of sending full document
send(fullDocument)

// Send only changes since last sync
send(calculateDelta(lastSync, currentDocument))
```

### Compression and Batching
- **Binary Formats**: Efficient encoding (MessagePack, CBOR)
- **Batching**: Group multiple changes together
- **Compression**: Apply compression to large payloads
- **Prioritization**: Sync important changes first

### Conflict Prevention
Reduce conflicts before they happen:
- **Field-Level Locking**: Temporary locks on active edits
- **Operational Transformation**: Transform concurrent edits
- **Intent Preservation**: Maintain user intentions during merge
- **User Feedback**: Show conflicts in real-time

The right sync strategy depends on the application's specific requirements around privacy, reliability, and user experience.