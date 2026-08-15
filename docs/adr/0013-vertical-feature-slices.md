# ADR-0013: Vertical Feature Slices as Requirements Organism

Date: 2026-08-14
Status: proposed

## Context

85 brainstorm GWT cases live in `docs/brainstorm/requirements/` organized by UI surface
(app shell, voice, modal, execution...). User asked for reorganization into **feature
slices** — vertical, buildable/testable units — plus expansion with convention-derived
behavior, code references, and validation specs.

## Decision

1. `docs/feature-requirements/slices/` holds 11 vertical slices. Each slice:
   positive requirements + inherited case manifest (links to brainstorm files —
   NOT copies) + new full GWT cases + implementation references + open questions.
2. Brainstorm suite remains the authoritative full text of inherited cases
   (single source of truth — no duplication).
3. New case IDs use `PREFIXC-NN` convention (C = convention-expanded), except new-system
   slices 03/11 (LGT, NAV).
4. Why-provenance tags on every new case: `[S]` source, `[C]` convention, `[I]` inferred.
5. Validation specs (`feature-requirements/validation/`) map EVERY case ID (inherited +
   new) to a Storybook story — coverage checked by script (ADR-0016).

## Consequences

- Slice ↔ case mapping is many-to-many where cross-cutting (light-language slice 03
  owns visual states whose triggers live in 02/05/10 — trigger cases stay in their
  interaction slice, visual cases concentrate in 03).
- Adding a case = decide slice home + validation row; coverage script catches drift.
- Brainstorm folder stays frozen as vision capture; feature-requirements is the living set.
