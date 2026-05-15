---
phase: 02-layout-navigation
plan: 01
subsystem: ui
tags: [react-router, routing, react]

# Dependency graph
requires:
  - phase: 01-tailwind-setup
    provides: Bootstrap removed, Tailwind installed — clean base for component rewrites
provides:
  - main.jsx exports a <Routes> tree without BrowserRouter wrapper and without exact props
affects:
  - 02-layout-navigation plan 02 (App.jsx — must add BrowserRouter to restore router context)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "react-router-dom v7: Routes as root element in main.jsx, no BrowserRouter, no exact prop"

key-files:
  created: []
  modified:
    - src/components/main.jsx

key-decisions:
  - "Remove BrowserRouter from main.jsx before Plan 02 adds it to App.jsx — prevents nested Router error"
  - "Strip exact prop from all 16 routes — it is invalid and a no-op in react-router-dom v7"

patterns-established:
  - "Route definitions: path + element props only, no exact, no BrowserRouter in the routes file"

requirements-completed:
  - QUAL-02

# Metrics
duration: 5min
completed: 2026-05-15
---

# Phase 2 Plan 01: Remove BrowserRouter and exact props from main.jsx Summary

**BrowserRouter removed from main.jsx and exact prop stripped from all 16 routes, clearing the prerequisite for Plan 02 to add a single BrowserRouter at the App.jsx level**

## Performance

- **Duration:** 5 min
- **Started:** 2026-05-15T00:00:00Z
- **Completed:** 2026-05-15T00:05:00Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Removed `BrowserRouter` from both the import line and the JSX wrapper in main.jsx
- Stripped the `exact` prop from all 16 `<Route>` elements (invalid in react-router-dom v7)
- All 16 original route paths and element props preserved unchanged
- Verification node command exits 0: "PASS: main.jsx updated correctly"

## Task Commits

Each task was committed atomically:

1. **Task 1: Remove BrowserRouter from main.jsx and strip all exact props** - `39ba16c` (feat)

**Plan metadata:** (see docs commit below)

## Files Created/Modified

- `src/components/main.jsx` - BrowserRouter removed, exact props stripped, Routes is now the root element

## Decisions Made

- Removed BrowserRouter from main.jsx rather than App.jsx first because Plan 02 will add it to App.jsx — doing it in this order prevents a nested Router error during Plan 02 execution.
- exact prop removal is safe: react-router-dom v7 `<Routes>` uses exact matching by default; `exact` was already a no-op and is now also an invalid prop warning.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

The worktree has its own copy of the source files (separate from the main repo working tree). The correct file path is inside the worktree directory. This is expected behaviour for parallel git worktrees — no impact on outcome.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- main.jsx is now a clean Routes tree ready for Plan 02 to wrap in BrowserRouter inside App.jsx
- The app is in a transient broken state (useRoutes without Router context) — Plan 02 must complete before the dev server is started
- No blockers for Plan 02 execution

---
*Phase: 02-layout-navigation*
*Completed: 2026-05-15*
