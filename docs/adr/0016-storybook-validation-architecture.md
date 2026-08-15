# ADR-0016: Storybook-Driven Validation Architecture

Date: 2026-08-14
Status: proposed

## Context

User asked for validation cases "in the context of live system testing through
Storybook" — high-level scripts validating that every GWT case is exercised, organized
by vertical slice. Repo (`vision-graph-ui/`) ALREADY has: Storybook 10.5.7 w/
`@storybook/addon-vitest` + `@storybook/addon-a11y`, Vitest + Playwright browser
runner, 22 `.stories.tsx`, 19 test files, 11 Gherkin `.feature` files, React Flow
custom node (`whittNode`).

## Decision

1. **Extend, don't add**: use existing Storybook + Vitest browser-mode infra. No new
   test framework.
2. **Story naming convention**: `sliceNN -- <CaseID> <short name>` (e.g.
   `slice02 -- VOX-06 pin tooltip`). Story = the case's live manifestation; play
   function = the When/Then.
3. **Play functions** use `@storybook/test` (expect, fn, userEvent, waitFor, step).
   Pointer API for drag/dblclick/right-click; `contextmenu` via `[MouseRight]`.
4. **Mocks**: Web Audio (FakeAudioContext w/ scripted level values) for breathing
   cases; React Flow DOM mocks (ResizeObserver, DOMMatrixReadOnly, offsetH/W, getBBox)
   already needed in jsdom; animation asserts target class/`animationName` (not frames);
   RAF-loop asserts via call counting.
5. **A11y**: `parameters.a11y.test = 'error'` on interaction stories — violations fail.
6. **Coverage manifest**: `docs/feature-requirements/validation/coverage-manifest.tsv`
   maps caseID → slice → story name → status (todo/ready). `check-coverage.sh` greps
   slice files for case IDs and reports any missing from the manifest — mechanical
   guarantee that "all cases are hit."
7. **Reduced motion**: dedicated story variant (emulate media query) for LGT-07.

## Consequences

- Case ↔ story ↔ test is 1:1 traceable; coverage script is the audit tool.
- Stories double as living design review surface (user can eyeball glow/breathing
  directly in Storybook before code lands in app).
- Pre-existing 12 failing tests (fsGraphLoader, GraphSim act() warnings, etc.) are
  OUT of scope here — tracked separately, noted in final report.
