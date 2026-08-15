# C2 — xyflow 12 Migration Facts (researched 2026-08-14)

> Source: official migrate guide https://reactflow.dev/learn/troubleshooting/migrate-to-v12
> + Azure/LogicAppsUX migration PR #5139 (commit 0f871dd, 47 files, 1-day merge).
> Feeds E4 plan. Verdict: MIGRATE NOW — low effort, unblocks v12 features slices rely on.

## Repo impact (verified by grep, 2026-08-14)

Files importing `reactflow`: only 4 —
- `vision-graph-ui/src/features/graph-page/GraphPage.tsx` (41-line demo)
- `vision-graph-ui/src/features/graph-sim/GraphSim.tsx` (main graph)
- `vision-graph-ui/src/features/graph-page/GraphPage.stories.tsx`
- `vision-graph-ui/src/shared/fsGraphLoader.ts`

No deprecated patterns in repo (no parentNode/onEdgeUpdate/posY/nodeInternals usage).
One fix needed: `nodeTypes` not memoized (GraphSim.tsx ~line 391) — v12 requires `useMemo`.
Styled-components custom nodes: compatible, no changes.

## Rename map

```typescript
// OLD
import ReactFlow from 'reactflow'
import 'reactflow/dist/style.css'
// NEW
import { ReactFlow } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
```

- updateEdge → reconnectEdge; onEdgeUpdate → onReconnect; edge.updatable → edge.reconnectable
- nodeInternals → nodeLookup; parentNode → parentId; posX/posY → positionAbsoluteX/Y
- node.width/height → node.measured?.width/height; fixed dims = top-level props
- No object mutations: `setNodes(nds => nds.map(n => ({ ...n, hidden: true })))`
- getRectOfNodes → getNodesBounds; getTransformForBounds → getViewportForBounds
- Handle connect classes: `connectingfrom`/`connectingto`

## v12 features slices consume (why E4 first)

- `connectionStatus` ('valid'|'invalid') on ConnectionLineComponentProps → S10 GRPC-03
- `isValidConnection` callback → S10 connection validation
- `nodeDragThreshold` (default 1) → S10 GRPC-01
- `panOnScroll` + `selectionOnDrag` + space-pan → S11 NAV-02 hybrid
- `colorMode="dark"` → theme alignment
- `onBeforeDelete` confirm hook → S10 GRPC-07 delete guard
- `useHandleConnections`/`useNodesData` → S06 data flow
- `ViewportPortal` → popover-outside-node rendering (S02 tooltip side-placement)

## No codemod exists. Manual. Estimated 2-4h (Azure evidence: 5 packages, 1 day, mostly find/replace + type fixes).

## Steps (E4 executes)

1. `npm install @xyflow/react@^12.11.3 && npm uninstall reactflow`
2. Find/replace imports (4 files) + CSS path
3. `useMemo` nodeTypes in GraphSim.tsx
4. `npx tsc --noEmit` → fix type errors (expect minimal)
5. Full verify: vitest run + build-storybook + vite build
6. Storybook smoke: GraphPage + GraphSim stories render, drag works
