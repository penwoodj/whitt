# AGENTS.md — vision-graph-ui

> **HARD RULES for any agent (human or AI) editing files in this subfolder.** These rules are non-negotiable. Violations = revert. Read this file BEFORE every edit.

## Scope

This file governs all work under `/home/jon/code/whitt/vision-graph-ui/`. Other whitt subfolders have their own rules. If a rule here conflicts with a parent rule, this file wins **inside this subfolder**.

---

## 1. Behavior-First Workflow (the gate order)

Every feature passes through these stages IN ORDER. Skipping a stage = blocked PR.

```
1. QUESTION CYCLE  ──►  2. GHERKIN .feature  ──►  3. FAILING TESTS
                                                          │
                                                          ▼
4. STORYBOOK STORY  ──►  5. (manual) PROMOTE TO APP  ──►  6. COMMIT
```

### Stage 1 — Question Cycle (BEFORE tests)

Before writing or changing any test, ask the user exactly ONE question cycle:
- 3 to 7 multiple-choice questions
- Cover: scope, edge cases, naming, error semantics, observability
- One question per decision — never combine
- After answers: do NOT ask again for that feature. Move on.

Use the `question` tool. Skip this stage ONLY for trivial refactors (no behavior change).

### Stage 2 — Gherkin `.feature` files

Write `features/<feature-name>.feature` BEFORE any test code. Format:

```gherkin
Feature: Node inspector panel
  As a user looking at a graph node
  I want to see live token streams
  So that I can watch inference in real time

  Scenario: Inspector opens on node click
    Given a graph canvas with a Step node S
    When the user clicks S
    Then the inspector panel opens
    And the panel shows the node title
    And the panel shows the live token stream

  Scenario Outline: Inspector handles missing data
    Given a Step node with <field> = null
    When the inspector renders
    Then the <field> section shows "—"
    Examples:
      | field      |
      | status     |
      | modelId    |
      | startedAt  |
```

One `.feature` file per behavior. Multiple scenarios per feature is normal.

### Stage 3 — Failing Tests

Implement step definitions in `<feature>.test.tsx` (Vitest). Run tests. **All scenarios MUST fail** (red). If any pass before implementation, the test is wrong — rewrite it.

```
RED: every Scenario in the .feature fails
GREEN: implement the minimum to pass all Scenarios
REFACTOR: extract per Section 5
```

### Stage 4 — Storybook Story

Before the component ships in the app, it MUST have a story in `src/<Component>.stories.tsx`. The story exists so the component is reviewable in isolation. Every `.feature` Scenario should map to at least one story variant. See `.opencode/skills/storybook/SKILL.md`.

### Stage 5 — Promote to App (MANUAL ONLY)

A component is added to `src/App.tsx` (or any app-level composition) ONLY when the user explicitly says so. Default = leave in Storybook. Never auto-promote.

Verbs that count as explicit instruction: "promote", "add to app", "wire into the app", "ship it", "use in the real app". If unsure, ask.

### Stage 6 — Commit

Conventional commits. Reference the feature: `feat(graph-canvas): Node inspector panel (GH-123)`.

---

## 2. Logs — Read Reality, Toggle by File

**Rule: Never claim behavior without reading actual logs.** "Should work" is forbidden. "Test passed because log line X appeared" is required.

### Logger architecture

- One source: `src/shared/logger.ts`
- One config: `src/shared/logs.config.json` (single file, hot-reloadable in dev)
- Every module imports `log` from `shared/logger.ts`; never use `console.log` directly

### Config file shape

```json
{
  "rootLevel": "warn",
  "modules": {
    "GraphCanvas": "debug",
    "NodeInspector": "trace",
    "useTaskStream": "info",
    "neo4jDriver": "warn"
  },
  "transports": ["console", "file"],
  "filePath": "./logs/app.log"
}
```

### Operating rules

- **Default**: `rootLevel: warn`. Quiet by default.
- **When debugging**: bump the failing module to `debug` or `trace` in `logs.config.json`. Other modules stay quiet.
- **After fix**: drop the module back to `warn` or `info`. Never leave `trace` on in a commit.
- **In tests**: logger auto-resets to `silent` (test setup); tests can override per-test via `withLogConfig(cfg, () => ...)`.
- **In production build**: logger compiled to no-op except `warn`+`error`. Build-time strip via `define` in vite.config.ts.

### Violations

- `console.log(` anywhere except `src/shared/logger.ts` → fail CI
- Hardcoded level in component code (e.g., `log.setLevel('debug')`) → fail CI
- Committing a `logs.config.json` with any module at `trace` → fail CI (commit-hook checks)

---

## 3. Architecture — Vertical Slices, Exploded

### Folder layout (per slice)

```
src/
├── features/
│   ├── graph-canvas/
│   │   ├── GraphCanvas.tsx           ← component
│   │   ├── GraphCanvas.stories.tsx   ← storybook
│   │   ├── GraphCanvas.test.tsx      ← vitest (maps to .feature)
│   │   ├── useGraphData.ts           ← hook
│   │   ├── graphData.ts              ← noun-typed data builders
│   │   ├── graphPredicates.ts        ← boolean extractors
│   │   └── graphTransforms.ts        ← pure transforms (lodash/fp)
│   ├── node-inspector/
│   └── ...
├── shared/
│   ├── logger.ts
│   ├── logs.config.json
│   ├── neo4j-driver.ts
│   └── tokens.css
└── App.tsx                           ← composition root; only place slices meet
```

### Slice rules

- A slice is **vertically self-contained**: it owns its UI + hooks + data + tests + story.
- **Duplication across slices is OK.** Two slices re-deriving the same helper is preferred over a premature shared utility.
- **DRY inside a slice.** Same helper used 3+ times in one slice = extract.
- **Shared utilities** live in `shared/`. Move only when ≥2 slices need the same code AND the abstraction is obvious.
- Slices never import from each other's internal files. If slice A needs slice B's behavior, A imports B's exported component from B's index.

---

## 4. Naming (Hard Rules)

| Thing | Rule | Examples |
|---|---|---|
| Boolean variables | Predicate names: `is`/`has`/`should`/`can`/`will`/`did` + noun | `isActive`, `hasError`, `shouldRender` |
| Functions | Verbs | `fetchUser`, `renderNode`, `cancelTask` |
| Data (variables, props) | Nouns | `user`, `taskList`, `workflowGraph` |
| Components | PascalCase nouns | `GraphCanvas`, `NodeInspector` |
| Hooks | `use` + verb-or-noun | `useTaskStream`, `useGraphData` |
| Files | Match default export | `GraphCanvas.tsx` exports `GraphCanvas` |
| Test files | `<Name>.test.tsx` next to source | |
| Story files | `<Name>.stories.tsx` next to source | |
| Feature files | `features/<kebab-name>.feature` | `features/node-inspector.feature` |

**Forbidden**: single-letter names (`x`, `e`), abbreviations except well-known (`req`, `res`, `ctx`, `cfg`, `init`), hungarian notation (`strName`).

---

## 5. Functional + Point-Free Style (Hard Rules)

### Required

- **Functional components only.** No `class X extends Component`.
- **Hooks only.** No HOCs, no render props (except where a hook genuinely cannot express it).
- **lodash/fp** for transforms. Destructured imports:
  ```typescript
  import flow from 'lodash/fp/flow'
  import filter from 'lodash/fp/filter'
  import map from 'lodash/fp/map'
  import sortBy from 'lodash/fp/sortBy'
  ```
  NOT `import _ from 'lodash'`.
- **`flow()` composition** over nested calls:
  ```typescript
  const activeTasks = flow([
    filter(hasStatus('active')),
    sortBy('priority'),
    take(10),
  ])(allTasks)
  ```
  NOT `take(sortBy(filter(...)))`.

### Extraction (mandatory)

- Anything nested more than 1 level deep MUST be extracted into a named subfunction.
- Extract for **human readability**, not just for reuse. A 5-line function with a clear name beats a 15-line inline expression.
- Build data incrementally with named intermediates:
  ```typescript
  const fetchedTasks = await fetchTasks()
  const activeTasks = filter(hasStatus('active'), fetchedTasks)
  const sortedTasks = sortBy('priority', activeTasks)
  const renderableTasks = take(10, sortedTasks)
  ```

### Forbidden

- `//` or `/* */` comments (anywhere). Code extraction = documentation.
- JSDoc on functions. The function name + types ARE the documentation.
- `import _ from 'lodash'` (whole-module).
- Mutation of props or state. Use new objects.
- Inline business logic in JSX:
  ```typescript
  // WRONG
  return <div>{tasks.filter(t => t.active).map(renderTask)}</div>

  // RIGHT
  const activeTasks = filter(hasStatus('active'), tasks)
  return <div>{map(renderTask, activeTasks)}</div>
  ```

---

## 6. TypeScript Hard Rules

- `strict: true` in tsconfig (already set).
- **Never** `any`, `@ts-ignore`, `@ts-expect-error`, `as unknown as`.
- Component prop types: `type ComponentNameProps = { ... }` (not interface), defined in same file.
- Inference for locals; explicit types for exports, function args, generics.
- `unknown` over `any` when catching errors from external libs.
- No default exports except for components matching the file name.

---

## 7. Verification — Run BEFORE Claiming Done

For ANY code change in this subfolder:

```bash
cd vision-graph-ui
npx tsc --noEmit          # type check, must exit 0
npx vitest run            # tests, all green
npm run build-storybook   # storybook builds
npx vite build            # production build, must exit 0
```

Plus, per the logs rule (Section 2): show the actual log lines that prove the new behavior, not just "tests pass".

A claim of "done" without these four commands exiting 0 = invalid claim.

---

## 8. Skills Loaded Automatically

OpenCode loads skills from `.opencode/skills/` in this subfolder. The following skills are pre-installed and apply to all work here:

- `storybook` — Storybook 10 + Vite + React 19 conventions
- `modern-react` — functional + point-free + lodash/fp rules (mirrors Section 5)
- `neo4j` — Cypher patterns + Docker dev instance for the graph data model
- `react-flow` — primary canvas library for MVP slices
- `d3-graphics` — custom layouts + force-directed graphs
- `pixi-graphics` — WebGL renderer for 100k+ node fish-eye
- `cytoscape` — graph-theory algorithms + layouts
- `d2` — diagram-as-code for planning docs

Agents MUST load the relevant skill before working in that domain. Loading is cheap; not loading = violating conventions.

---

## 9. When This File Changes

Bump `Revision:` below. Any change to this file requires a commit message starting `chore(agents):` and a one-line summary in the commit body of what rule changed and why.

Revision: 1 (2026-08-08)
