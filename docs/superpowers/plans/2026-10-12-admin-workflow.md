# Admin Workflow Implementation Plan

> Execute inline with Superpowers executing-plans; user explicitly requests immediate implementation.

**Goal:** A welcoming portfolio workspace with clear next actions, fewer navigation choices, safe editing and reliable publication/order changes.
**Architecture:** Keep owner authorization and CMS ownership. Extract overview into a focused component; use shared edit guard; move reorder into one validated server operation.
**Tech Stack:** Existing Next.js, React, TypeScript, Supabase; no new dependencies.
**Spec:** User request: simplify dashboard logic/workflow, improve stiff UI, audit and QA, execute directly.

## Design

Palette: paper #f7f8fa, white #ffffff, ink #20252e, slate #647084, blue #3159b8; night surfaces #15181e and #20252e. Retain Barlow; use more generous form typography, quiet surfaces and one expressive welcome panel. Primary navigation: overview, profile, projects, experience, CV. Secondary collections and tools grouped. Overview prioritizes incomplete profile, unpublished content and CV readiness rather than decorative counts. Mobile collections become cards with selection and named actions.

## Constraints and review focus

No automatic publication or new user accounts. Preserve all content and existing routes. Owner-only API. Protect unsaved edits and busy saves. Reorder must work with tied positions, endpoints and missing IDs. Handle local and dark mobile layouts. Clearly distinguish saved records from publication status.

## Tasks

- [x] Add reorder regression tests, implement pure ordering helper and single database statement in owner API, switch dashboard reorder/publication calls.
- [x] Add unsaved edit protection to entry and profile forms; prevent editing/closing during save; distinguish saved-but-refresh-failed states.
- [x] Extract overview with actionable setup list and draft shortcuts, simplify grouped navigation, refresh state on new server props.
- [x] Apply workspace styling, form hierarchy, readable mobile collection cards and dark-mode tokens.
- [x] Run automated tests/build, owner HTTP audit and browser checks if available; record limitations and QA results.

No git repository is present, so commits/worktrees are not applicable.

## Execution ledger

Ruling: use a security-invoker PostgreSQL RPC with kind advisory lock and row locks for ordering, rather than upsert full records — preserves concurrent content changes and changes only position/timestamp.

Ruling: no browser runtime is available; complete unit/render/token tests, transactional database tests and owner HTTP audit, and explicitly leave browser visual/interaction checks unverified.

Review: independent reviewer identified active-nav contrast, pre-logout confirmation, pending uploads, position tie ordering, and failed-refresh stale data. All addressed; shared refresh behavior has failure/recovery regression tests.

Verification: 63 tests passed, production build passed; transactional SQL QA rolled back, 17 pages and 28 internal links HTTP 200, owner authorization and invalid reorder inputs checked.
