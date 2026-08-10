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

---

## 10. Skill Usage + Improvement Loop

### Skill loading is MANDATORY

Before ANY edit in a skill's domain, the agent MUST `skill(name="...")` load it. Loading is cheap; not loading = violation.

| Domain | Skill to load |
|---|---|
| `.stories.tsx` files, CSF3, story coverage | `storybook` |
| React component code (any `.tsx`) | `modern-react` |
| Cypher queries, Neo4j Docker, graph schema | `neo4j` |
| `<ReactFlow>` canvas, nodes, edges | `react-flow` |
| Force layouts, d3 scales, axes | `d3-graphics` |
| WebGL canvas, 100k+ nodes, fish-eye perf | `pixi-graphics` |
| Graph algorithms (shortest path, centrality) | `cytoscape` |
| `.d2` diagram files in `docs/` | `d2` |

### Improvement loop (skills are LIVING)

When agent learns a lesson (gotcha, better pattern, new edge case) while working in this project:

1. Update the relevant skill's `SKILL.md` or `helper.py`.
2. Commit with `chore(skill-<name>): <one-line lesson>` (e.g., `chore(skill-react-flow): Edge label rotation gotcha`).
3. Next agent in that domain auto-benefits.

Do NOT let lessons die in chat. They go in the skill.

---

## 11. File Organization (Hard Limits)

### File size caps

| File type | Soft cap | Hard cap (split mandatory) |
|---|---|---|
| Component `.tsx` | 100 LOC | 200 LOC |
| Hook `.ts` | 80 LOC | 150 LOC |
| Test `.test.tsx` | 150 LOC | 300 LOC |
| Story `.stories.tsx` | 100 LOC | 200 LOC |
| Skill `SKILL.md` | 400 LOC | 600 LOC |
| `helper.py` | 300 LOC | 500 LOC |

Past hard cap = split. Split criterion = single responsibility. Component splits by sub-component. Hook splits by concern. Test splits by feature scenario group.

### Folder rules

- One concept per file. `Node.tsx` only renders `Node`. `Node.stories.tsx` only stories for `Node`.
- Sub-components live in same slice folder, never nested deeper: `features/node/NodeTitle.tsx`, NOT `features/node/title/NodeTitle.tsx`.
- `index.ts` per slice barrel-exports its public surface. Internal files are NOT re-exported.
- Max 12 files per slice folder. More = sub-slice or extract to `shared/`.
- No file >500 LOC anywhere (excluding generated/lockfiles).

### Forbidden

- God components (`GraphCanvas.tsx` doing 10 things).
- Barrels that re-export whole slices (defeats tree-shaking).
- Files named `utils.ts`, `helpers.ts`, `misc.ts`, `constants.ts` (vague). Name by content: `nodePredicates.ts`, `graphTokens.ts`.
- Dead files (zero imports). If unused for 3+ commits, delete.

### Project root boundary (HARD)

`vision-graph-ui/` is the ONLY place where these files may live:

- `package.json`, `package-lock.json`
- `node_modules/`
- `.storybook/`, `storybook-static/`
- `vite.config.ts`, `vitest.config.ts`, `tsconfig*.json`
- `src/` (React app source)

The whitt repo ROOT (`/home/jon/code/whitt/`) must NEVER contain any of these. If an agent runs `npm install` / `npm create` / `npx storybook init` from the wrong directory, it pollutes the root.

**Recovery**: if found at root, delete + add to root `.gitignore`. Root `.gitignore` (already in place) blocks: `node_modules/`, `package-lock.json`, `.storybook/`, `storybook-static/`, `dist/`.

**Agent guard**: before running any `npm`/`npx`/`yarn`/`pnpm` command, verify `pwd` is inside `vision-graph-ui/`. Run `cd /home/jon/code/whitt/vision-graph-ui && pwd` first if unsure.

---

## 12. Caveman Everywhere (Terse)

Caveman = terse output style. Active in ALL artifacts under this subfolder: docs, code, tests, Gherkin, commit messages (except ADR body which can be fuller prose).

### Doc files (`*.md`)

Drop articles, filler, hedging. Fragments OK. `[thing] [action] [reason]`. NO "the/and/just/really".

BAD: `The Node component renders the microphone button which the user toggles to record audio.`
GOOD: `Node renders mic btn. Usr toggles to rec audio.`

### Code identifiers

Terse caveman + naming rules from Section 4 still apply (predicates, verbs, nouns). Compress common words:

| Full | Caveman |
|---|---|
| configuration | cfg |
| event | evt |
| properties | props |
| request/response | req/res |
| context | ctx |
| initialize | init |
| message | msg |
| text | txt |
| record(ing) | rec |
| button | btn |
| user | usr |
| fetch | fetch (unchanged) |
| toggle | toggle (unchanged) |
| is recording | isRec |
| send message | sendMsg |
| stream text | streamTxt |

Examples (caveman + Section 4):
- `isRec` (predicate), `streamTxt` (verb), `nodeList` (noun), `cfg` (noun), `useRec` (hook), `MicBtn` (PascalCase component)
- AVOID: `isCurrentlyRecordingAudioStream` (too verbose), `r` (too short, forbidden by Section 4)

### Gherkin `.feature` files

Terse caveman in all Gherkin text. Feature names, scenarios, step prose, examples — all caveman.

```gherkin
Feature: Node mic btn rec toggle
  As usr on graph
  I want mic btn toggle rec
  So I talk to graph

  Scenario: Rec start on click
    Given Node w/ mic btn off
    When usr clicks mic btn
    Then mic btn shows stop
    And txt streams to prompt area

  Scenario: Rec stop on second click
    Given mic btn on
    When usr clicks mic btn
    Then mic btn shows rec
    And stream saved to prompt area
```

### Test names

`describe`/`it`/`test` blocks in caveman. Match Gherkin scenario name.

```typescript
describe('MicBtn', () => {
  it('toggles to stop on click', () => { ... })
  it('stops stream on second click', () => { ... })
})
```

### Commit messages

Subject ≤50 chars. Body terse. Conventional commit prefix required.

BAD: `feat(node): Add microphone button component with recording toggle`
GOOD: `feat(node): MicBtn w/ rec toggle`

---

## 13. Sub-Agent Routing (Caveman)

When delegating work in this subfolder, route by domain. Caveman prompts to sub-agents too.

| Task domain | subagent_type OR category | Skill to load |
|---|---|---|
| New `.stories.tsx`, story coverage | `category="quick"` | `storybook`, `modern-react` |
| Component `.tsx` + hooks + tests | `category="deep"` | `modern-react`, `storybook` |
| Cypher / Neo4j Docker | `subagent_type="librarian"` then `category="deep"` | `neo4j` |
| Hard logic (graph algos, layout math) | `subagent_type="oracle"` (read-only) | relevant gfx skill |
| Visual / styling / animation | `category="visual-engineering"` | `modern-react`, gfx skill |
| ADR / docs / Gherkin | `category="writing"` | none |
| Bug after 2+ failed fix attempts | `subagent_type="oracle"` (read-only) | `modern-react`, relevant |
| Find pattern in this repo | `subagent_type="explore"` | none |
| Find pattern in OSS / docs | `subagent_type="librarian"` | none |

### Routing rules (caveman)

- ALL impl tasks → DELEGATE. Orchestrator writes prompts, not code.
- Prompts to sub-agents MUST have 6 sections: TASK, EXPECTED OUTCOME, REQUIRED TOOLS, MUST DO, MUST NOT DO, CONTEXT.
- Parallel independent work → fire 2-5 agents at once.
- Same agent follow-up → use `session_id` to preserve ctx.
- Verify each delegation result by reading actual files + running actual cmds.

---

## 14. Question Protocol (Going Forward)

Per-user directive (2026-08-08): from now on, ask at most **2-3 multiple-choice questions per turn** in this subfolder.

- Use the `question` tool.
- Each question: clear decision, 2-5 options.
- After answers: execute agentically. Don't re-ask same question.
- Documentation in `docs/` (ADRs especially) MUST stay synced to the latest answered intent. Drift = bug.
- Incremental commits lock progress. Easy undo via git.

Override: user explicitly invokes "build now" or "don't stop" → skip questions for that turn, use reasonable defaults documented in the relevant ADR.

---

Revision: 5 (2026-08-09)

Changes in Rev 5:
- Section 17: Added "Node Lifecycle (Collapsed → Hover → Expand)" rules per ADR-0012 (sphere→square morph, 3-state lifecycle, details panel gating).

Changes in Rev 4:
- Section 11: Added "Project root boundary" rule (no package.json/node_modules/.storybook at whitt repo root — must live in vision-graph-ui/ only).

---

## 17. Node Lifecycle (Collapsed → Hover → Expand)

Per ADR-0012. Default node state = title text only (no shape, no composer).
Hover reveals sphere outline. Click morphs sphere→square containing composer.

States:
- collapsed: title text floating, no shape
- hovered: title in sphere outline (dashed primary border)
- expanded: square composer (textarea + mic + send), auto-focused

Transitions:
- collapsed → hovered: mouse enter
- hovered → collapsed: mouse leave (if not focused)
- hovered → expanded: click
- expanded → collapsed: Escape OR click outside

Morph: 240ms ease on border-radius, width, height, padding, background-color.

Details panel: ONLY appears after lifecycle='done' (full record → stream → stop → send → cycle → done flow).

---

## 16. Graph ↔ Filesystem Mapping (HARD)

Per ADR-0011. Every graph node has a filesystem artifact.

### Lifecycle

```
NODE CREATED        →  <slug>.md                          (leaf, no children yet)
NODE EXPANDED       →  <slug>/ folder + <slug>/index.md   (now has children)
CHILD SPAWNED       →  <slug>/<child-slug>.md             (sibling inside parent folder)
TITLE RENAMED       →  git mv old-slug new-slug           (lazy, debounced 2s)
```

### File layout per project

```
<project-root>/
├── .whitt/
│   ├── config.yml              (project uuid, name, created_at, neo4j_path)
│   ├── cache/                  (gitignored, transient artifacts)
│   └── logs/                   (gitignored, app logs)
├── index.md                    (root node)
├── topic-a/                    (expanded node w/ children)
│   ├── index.md                (this node's content)
│   ├── sub-1.md                (child node)
│   └── sub-2.md                (child node)
└── topic-b/                    (another expanded node)
    ├── index.md
    └── child.md
```

### Markdown format

Every `.md` file starts with YAML frontmatter:

```yaml
---
id: <uuid>
title: <current title>
parent: <path-to-parent-index.md | null>
children: [<path-to-child>, ...]
created_at: <iso>
updated_at: <iso>
status: <leaf | expanded | done | error>
focus_jump: <node-id | null>
---

<markdown body — agentic-generated or user-edited>
```

### Memory layer (for UI speed)

- **FS = source of truth.** Git tracks every change.
- **Memory layer** = in-mem cache + Neo4j for graph edges. UI reads from memory (sub-ms).
- **Mutations**: write memory immediately (UI snappy), queue FS write (debounced 2s), git commit on flush.
- **Conflict**: if FS edited externally, FS wins. Memory reloads. Warn user.

### Naming rules

- Filenames = slug of title (`Hello World!` → `hello-world.md`).
- Slug collisions → append `-2`, `-3`, etc. (`hello-world-2.md`).
- Title preserved in YAML `title` field (human-readable, can have any chars).
- Renames = `git mv` (preserve history). Lazy batched.

### References

- Full spec: `docs/adr/0011-graph-to-filesystem-mapping.md`
- Related: ADR-0006 (.whitt/ markdown + YAML), ADR-0007 (Neo4j + FS sync)

---

## 15. Styling — styled-components + Theme (HARD)

### Library

**`styled-components` v6+** is the ONLY allowed styling approach for components in this subfolder. Inline `style={{...}}` props are FORBIDDEN in component `.tsx` files (allowed only in stories for story-level layout wrappers).

CSS files (`.css`) for new code are FORBIDDEN. Existing CSS (App.css, index.css) is legacy — migrate when touched.

### Scoped styling

`styled-components` automatically scopes styles to the component + its children via generated class names. NEVER use global CSS selectors. NEVER use `createGlobalStyle` except for resets in `src/shared/`.

### Theme tokens (single source of truth)

`src/shared/theme.ts` exports `Theme` type + `darkTheme` (default). Tokens cover:
- `colors` (bg, bgElevated, bgHover, border, borderActive, text, textMuted, textInverse, primary, primaryHover, success, warning, error, recording, idle, running, done)
- `spacing` (xs/sm/md/lg/xl)
- `radius` (sm/md/lg/pill)
- `font` (sans/mono/sizeXs..sizeXl/weightNormal/Medium/Bold)
- `shadow` (sm/md/lg)
- `transition` (fast/base/slow)
- `zIndex` (base/overlay/modal/tooltip)

Access in components via `${({ theme }) => theme.colors.bg}` interpolation.

### ThemeProvider

`src/shared/ThemeProvider.tsx` wraps `styled-components`'s ThemeProvider. Use it at app root + in Storybook preview + in tests.

```typescript
import { ThemeProvider } from '@/shared/ThemeProvider'

<ThemeProvider>
  <App />
</ThemeProvider>
```

### Styling rules (caveman)

| Pattern | Use |
|---|---|
| Define styled component | `const Title = styled.h1\`color: ${({ theme }) => theme.colors.text};\`` |
| Reference theme | `${({ theme }) => theme.colors.primary}` |
| Conditional style | `${({ $isRec }) => $isRec ? \`color: red\` : \`color: gray\`}` |
| Hover/state | `&:hover { background: ${({ theme }) => theme.colors.bgHover}; }` |
| Nested child | `& > span { font-weight: bold; }` |
| Prop-driven | Use transient props (`$isActive` not `isActive`) to avoid DOM warnings |
| Compose | `const Btn = styled(BaseBtn)\`...\`` |

### Forbidden

- Inline `style={{...}}` in component `.tsx` (only stories/layout wrappers)
- CSS files for new code (legacy `.css` migrations allowed when touched)
- Global CSS selectors in styled-components strings
- Hardcoded color hex (use theme token)
- Tailwind, emotion, CSS modules, scss files (legacy libs not in deps)
- `!important` in styled strings

### Dark theme default

`darkTheme` is the only theme for now. NO light theme work. When `ThemeProvider` is used without props, defaults to `darkTheme`.

### Migration protocol

When converting existing component from inline styles:
1. Read component, identify all inline `style={{...}}` blocks
2. Create one `const X = styled.Tag\`...\`` per logical block
3. Replace theme-able values with `${({ theme }) => theme.colors.X}` (etc.)
4. Replace conditional values with transient props (`$isRec`, `$hasErr`)
5. Keep behavior identical — only styling changes
6. Tests must still pass (queries by text/role, not by inline style)

### Skill loading

Before styling work, agents MUST load `modern-react` skill (project-local at `.opencode/skills/modern-react/SKILL.md`). It has the styled-component patterns + dark theme conventions.
