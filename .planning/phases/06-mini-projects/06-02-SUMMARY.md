---
phase: 06-mini-projects
plan: 02
subsystem: ui
tags: [react, tailwind, modal, class-to-functional, train-game]

# Dependency graph
requires:
  - "06-01 — src/components/Shared/Modal.jsx"
provides:
  - "src/components/Projects/TrainGame/trainGame.jsx — functional component with Tailwind styling and shared Modal"
affects:
  - none

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "class→functional conversion: useState replaces this.state, plain functions replace class methods"
    - "Shared Modal consumption: {condition && <Modal title=... onClose=...>...</Modal>}"
    - "Flex header row: flex items-center justify-between px-4 py-3 for left/center/right layout"
    - "Input row: flex items-center justify-center gap-2 for input+button pairing"

key-files:
  created: []
  modified:
    - src/components/Projects/TrainGame/trainGame.jsx
  deleted:
    - src/components/Projects/TrainGame/trainGame.css

key-decisions:
  - "validateAndSubmit logic preserved verbatim — only this.setState calls converted to setters"
  - "onInputChange simplified: removed computed property key pattern, now calls setNumber directly (simpler — only one field)"
  - "Modal content (help text and app images) preserved verbatim per content-preservation constraint"
  - "react/no-unescaped-entities lint errors in modal text content are pre-existing (apostrophes in original text) — out of scope per deviation scope boundary"

requirements-completed:
  - TOOL-03

# Metrics
duration: ~2min
completed: 2026-05-17
---

# Phase 6 Plan 02: TrainGame Migration Summary

**TrainGame converted from class component to functional, Bootstrap Modal/Button replaced with shared Tailwind Modal, trainGame.css deleted — all with npm run build passing.**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-05-17T08:30:23Z
- **Completed:** 2026-05-17T08:32:13Z
- **Tasks:** 2
- **Files modified:** 1 (trainGame.jsx), 1 deleted (trainGame.css)

## Accomplishments

- Converted `trainGame.jsx` from class component to functional component using `useState` hooks
- Removed `import { Component } from 'react'`, `import { Modal, Button } from 'react-bootstrap'`, and `import './trainGame.css'`
- Added `import { useState } from 'react'` and `import Modal from '../../Shared/Modal'`
- Preserved `validateAndSubmit` and `getSolutions` logic verbatim — only `this.setState` calls converted to setters
- Replaced Bootstrap `Button` elements with plain `<button>` elements using `bg-accent text-black font-semibold px-4 py-2 rounded`
- Replaced Bootstrap `HelpModal`/`MadeModal` inner wrappers with the shared `Modal` component
- New layout: flex header row (Creation left, title center, Help right) using `flex items-center justify-between px-4 py-3`
- Root wrapper: `text-center text-accent min-h-screen` — no `mt-14` or `margin-top` per D-12
- All inline styles removed: `position:absolute`, `width:100%`, `height:33px`, `marginTop:-3px`
- All CSS class names from `trainGame.css` replaced with Tailwind inline utilities
- Deleted `trainGame.css` — 26 lines of CSS eliminated
- `npm run build` passes with 113 modules transformed, no errors

## Task Commits

1. **Task 1: Convert trainGame.jsx — class to functional, Bootstrap to Tailwind Modal** — `0d6d1c9` (feat)
2. **Task 2: Delete trainGame.css** — `b3cafcb` (chore)

## Files Created/Modified

- `src/components/Projects/TrainGame/trainGame.jsx` — rewritten as functional component; 123 lines removed, 89 inserted
- `src/components/Projects/TrainGame/trainGame.css` — deleted (26 lines, all classes replaced with Tailwind)

## Decisions Made

- `onInputChange` simplified: the original used a computed property key `[event.target.name]: event.target.value` to handle multiple fields, but since only `number` is controlled, the functional version calls `setNumber(event.target.value)` directly
- Modal title "How this was made" preserved from `MadeModal` (original `Modal.Title` content)
- App image `className="app-image"` replaced with `className="w-1/2"` per CSS table in RESEARCH.md

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all state, logic, and content is fully wired. `getSolutions` call is preserved, input validation is preserved, modal content is preserved verbatim.

## Threat Flags

None — no new network endpoints, auth paths, file access patterns, or schema changes introduced. Input validation preserved (validateAndSubmit gates getSolutions call).

## Issues Encountered

- `react/no-unescaped-entities` lint errors appear on trainGame.jsx for apostrophes in modal text content (e.g., "I'm", "I've", "didn't"). These are identical to the same errors in `about.jsx`, `landingpage.jsx` etc. throughout the codebase — pre-existing content pattern, not introduced by this plan. Logged but out of scope per deviation scope boundary.

## User Setup Required

None.

## Next Phase Readiness

- Plan 06-02 complete. TrainGame renders as functional component with Tailwind styling.
- Bootstrap stubs for TrainGame are no longer needed (import removed).
- No blockers for subsequent plans.

---
*Phase: 06-mini-projects*
*Completed: 2026-05-17*
