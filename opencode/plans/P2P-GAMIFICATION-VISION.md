# P2P Gamification Vision

> **Version**: 1.0
> **Status**: Far Future (Phase D) - Design Vision Only
> **Depends On**: agent-queue distributed mode, whitt stable MVP

---

## Core Concept

A peer-to-peer network where users share compute resources and useful AI workflows. Contributors earn compute credits proportional to the usefulness of their shared workflows. Consumers spend credits to use others' compute.

### Key Insight: Incentivize Quality, Not Quantity

> "If you get a lot of people using your intelligence, you get more compute for free without having to give out your compute during idle time."

This means:
- Sharing a **useful workflow** = earning credits from every execution
- Credits = right to use **other people's compute** when you need it
- No mandatory idle-time compute contribution required
- Incentivizes **efficiency** (smaller, faster workflows = more runs = more credits)

---

## Compute Credit System

### Earning Credits
| Action | Credits Earned | Notes |
|--------|---------------|-------|
| Workflow published | 0 | Must be verified first |
| Workflow executed by peer | 0.1 per execution | Weighted by proof-of-satisfaction |
| High satisfaction rating | 0.05 bonus | Average > 4/5 stars |
| Workflow reused in sub-workflow | 0.02 per reference | Composability reward |
| Model efficiency bonus | 0.01 | If uses < expected tokens |

### Spending Credits
| Action | Credits Cost | Notes |
|--------|-------------|-------|
| Execute on peer compute | 0.1 per workflow | Standard rate |
| Priority queue on peer | +0.05 | Faster execution |
| Large model access | +0.05 | 13B+ models cost more |
| Multi-step workflow | 0.1 × steps | Longer = more expensive |

### Credit Mechanics
- **Stable rate**: Very minimal per-user cost (designed to be negligible for individuals)
- **Non-zero**: Prevents abuse and spam
- **Earned, not bought**: No fiat currency, only proof-of-usefulness
- **Decay**: Unused credits decay slowly (1% per month) to encourage participation

---

## Proof of Satisfaction

Before credits are awarded, the system verifies the workflow actually produced useful results:

### Proof Types
1. **Proof-of-Completion**: Workflow ran to completion (trivial, baseline)
2. **Proof-of-Output-Quality**: Output passes automated quality checks:
   - JSON output passes schema validation
   - Code compiles without errors
   - Generated text passes coherence check
3. **Proof-of-Objective-Achievement**: User confirms the output achieved their goal:
   - Thumbs up/down rating
   - "This solved my problem" confirmation
   - Time-to-solution metric (faster = higher quality)
4. **Proof-of-Efficiency**: Workflow achieved result with minimal resources:
   - Token usage below threshold
   - Execution time below benchmark
   - No unnecessary steps

### Verification Chain
```
Workflow Published
  → Peer downloads and executes
  → Local verification (compilation, schema, etc.)
  → Result submitted to network
  → Consumer rates satisfaction (1-5 stars)
  → Credits awarded to publisher
  → Credits deducted from consumer
```

---

## Network Architecture (Future)

```
┌─────────────────────────────────────────────┐
│              P2P Overlay Network             │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Peer A  │◄─┤  Peer B  │─►│  Peer C  │  │
│  │ (whitt)  │  │ (whitt)  │  │ (whitt)  │  │
│  │ + queue  │  │ + queue  │  │ + queue  │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       │              │              │        │
│  ┌────▼─────┐  ┌────▼─────┐  ┌────▼─────┐  │
│  │ Local    │  │ Local    │  │ Local    │  │
│  │ Models   │  │ Models   │  │ Models   │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │  Distributed Ledger (credit tracking) │   │
│  │  - Workflow registry                  │   │
│  │  - Credit balances                   │   │
│  │  - Reputation scores                 │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Protocol Requirements (Future)
- DHT-based peer discovery (libp2p or similar)
- gossip protocol for workflow registry propagation
- Merkle-based verification for workflow integrity
- Local-first: all data stays on user's machine, no central server
- Optional relay nodes for NAT traversal

---

## Whitt UI for P2P (Future)

### Workflow Marketplace
- Browse shared workflows by category
- Search by description or tags
- Preview workflow YAML before using
- See satisfaction ratings and execution count
- One-click "Use This Workflow" (creates local chat pre-populated)

### Credit Dashboard
- Current credit balance
- Credit history (earned/spent)
- Most valuable workflows you've shared
- Recommendations for workflows to share

### Network Status
- Connected peers count
- Available compute pool size
- Network health indicators
- Your shared workflows' usage stats

---

## Security Considerations

1. **No untrusted code execution**: Shared workflows are YAML (declarative), not arbitrary code. yaml-to-rust-agentsdk executes within sandboxed tool permissions.
2. **Workflow signing**: Workflows are signed by publisher, verified before execution
3. **Rate limiting**: Per-peer rate limits prevent abuse
4. **Reputation system**: Low-quality publishers get reduced visibility
5. **Local-only data**: No user prompts or results leave the local machine
6. **Opt-in only**: P2P features are entirely optional - MVP works offline
