# C1 — Decision Register (pre-answered defaults)

> Check here BEFORE asking user a question-cycle (EXECUTION-PROTOCOL §6).
> Entries = decisions already made in ADRs/slices/skills. Plans cite, don't re-ask.
> Open (unanswered) decisions live in each plan's §4 question-gate.

## Answered (do not re-ask)

| # | Decision | Answer | Source |
|---|---|---|---|
| 1 | Node types | ONE node type: file bubble. No new types ever (yet) | ADR-0014, user dictation |
| 2 | Styling | styled-components only, theme tokens, no new libs | AGENTS.md §15 |
| 3 | STT engine | browser-whisper (WebGPU+q4, OPFS); Web Speech API FORBIDDEN | local-stt skill |
| 4 | FS truth | FS = source of truth; memory layer cache later (Neo4j deferred gap D3) | ADR-0011 |
| 5 | Prompt files | `<node-dir>/.prompts/<ts>-<slug>.md`, one per prompt, never deleted | fs-graph-sync skill |
| 6 | Commits | every edit save = commit w/ metadata JSON message | GIT-01, fs-graph-sync skill |
| 7 | Validation runner | Vitest browser mode via storybook addon, NOT test-runner | ADR-0016 |
| 8 | Story naming | `sliceNN -- <CaseID> <name>` | ADR-0016 |
| 9 | Light tiers | tier-0 DOM keyframes now; sprite canvas tier-1; UnrealBloom tier-2 deferred | ADR-0015 |
| 10 | Migration | reactflow 11 → @xyflow/react 12 now, E4 | C2 research verdict |
| 11 | Fish-eye | deferred; minimap = tier-1 spatial awareness | gap D1, slice 11 |
| 12 | Grouping FS | hard group = folder + file moves (ADR-0011); soft = visual only | GRP-07 |
| 13 | Conversation popover | RIGHT of node, never inside node | user dictation |
| 14 | RIP policy | port-by-default; deskreen(AGPL)+gradient-components+bubble-chart-js(no lic) = READ-ONLY | C0, oss-code-adaptation |
| 15 | Retry | max 1, condition-gated transient-only; never mask assertion failures | EXECUTION-PROTOCOL §4 |
| 16 | Quarantine | user-approval only; 12 pre-existing failures already quarantined | gap E, protocol §4 |

## Open (routed to plan question-gates)

| # | Question | Owner plan |
|---|---|---|
| O1 | Tooltip side-choice algorithm details | S02 |
| O2 | STT model default (tiny vs base) + VAD on/off | E1 |
| O3 | fsGraphLoader repair vs replace | E3 |
| O4 | Real FsPort backend (FSA API vs desktop shell wait) | E3 |
| O5 | Modal size caps + ESC precedence details | S04 |
| O6 | Confirm-dialog = YAML tooltip reuse? | S05 |
| O7 | Loader icon set | S05 |
| O8 | Spawn placement radius | S06 |
| O9 | Intervention gesture shape | S06 |
| O10 | md renderer dep choice | S07 |
| O11 | Pill content: lines only vs +snippet | S08 |
| O12 | Remote URL config UX + conflict policy | S09 |
| O13 | Soft→hard promotion gesture | S10 |
| O14 | Lasso vs shift-select default | S10 |
| O15 | NAV-02 hybrid vs slippy default (feel-test) | S11 |
| O16 | Rail overflow behavior | S01 |
