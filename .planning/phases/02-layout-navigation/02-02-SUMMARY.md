---
phase: 02-layout-navigation
plan: 02
subsystem: ui
tags: [react, functional-component, react-router, tailwind, app-shell]

# Dependency graph
requires:
  - phase: 02-layout-navigation
    plan: 01
    provides: BrowserRouter removed from main.jsx — prerequisite for adding it to App.jsx without nesting
  - phase: 01-tailwind-setup
    provides: Tailwind installed with @theme tokens (bg-bg, bg-surface, text-accent)
provides:
  - src/App.jsx exports a functional App component with BrowserRouter, useState, and Tailwind shell layout
  - closeDrawer prop threaded from App.jsx to SideDrawer for close-on-navigate UX (ready for Plan 04)
affects:
  - 02-layout-navigation plan 03 (Toolbar — must stay inside BrowserRouter context now provided by App.jsx)
  - 02-layout-navigation plan 04 (SideDrawer — will receive closeDrawer prop wired here)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "App.jsx: functional component with useState hook replacing class component state"
    - "BrowserRouter at App.jsx level — single router for the entire component tree"
    - "Tailwind shell: min-h-screen bg-bg (outer), w-full pt-14 (content offset from fixed toolbar)"

key-files:
  created: []
  modified:
    - src/App.jsx
  deleted:
    - src/App.css

key-decisions:
  - "Functional App component with useState(false) for sideDrawerOpen — no class component syntax remains"
  - "BrowserRouter moved to App.jsx level (Plan 01 removed it from main.jsx) — prevents nested Router error"
  - "closeDrawer prop passed to SideDrawer as backdropClickHandler — enables Plan 04 close-on-navigate"
  - "App.css deleted — .Layout, .app-background, .page-content replaced by min-h-screen bg-bg, w-full pt-14"
  - "pt-14 (56px) content padding matches fixed Toolbar height so page content starts below the toolbar"

patterns-established:
  - "Conditional rendering with short-circuit: {sideDrawerOpen && <Backdrop />} instead of let variable pattern"
  - "<main> semantic element for page content wrapper"

requirements-completed:
  - NAV-05

# Metrics
duration: 8min
completed: 2026-05-15
---

# Phase 2 Plan 02: Convert App.jsx to Functional Component with BrowserRouter Summary

**App.jsx converted from class component to functional component using useState, wrapped in BrowserRouter with Tailwind shell layout (min-h-screen bg-bg / pt-14), and App.css deleted — all CSS classes replaced by inline Tailwind utilities**

## Performance

- **Duration:** 8 min
- **Started:** 2026-05-15T00:00:00Z
- **Completed:** 2026-05-15T00:08:00Z
- **Tasks:** 2
- **Files modified:** 1 (App.jsx rewritten)
- **Files deleted:** 1 (App.css)

## Accomplishments

- Removed class component syntax: no more `class App extends Component`, `state = {}`, or `this.setState`
- Added `useState(false)` hook for `sideDrawerOpen` state management
- Added `BrowserRouter` import and wrapper — restores router context after Plan 01 removed it from main.jsx
- Converted class methods to plain arrow functions inside the functional component body
- Passed `closeDrawer={backdropClickHandler}` to SideDrawer, enabling Plan 04's close-on-navigate UX
- Replaced `let backdrop` conditional variable pattern with inline `{sideDrawerOpen && <Backdrop />}`
- Replaced `.app-background` / `.Layout` / `.page-content` CSS classes with `min-h-screen bg-bg` / `w-full pt-14`
- Used `<main>` semantic element for the page content wrapper
- Deleted App.css — no longer referenced by any file
- Overall verification: "ALL CHECKS PASSED" (9/9 checks)

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite App.jsx as functional component with BrowserRouter and Tailwind shell** — `e022c57` (feat)
2. **Task 2: Delete App.css** — `c0fce4c` (chore)

## Files Created/Modified

- `src/App.jsx` — Complete rewrite: class → functional, BrowserRouter added, Tailwind shell layout, closeDrawer prop
- `src/App.css` — Deleted (all rules replaced by Tailwind utilities in App.jsx)

## Decisions Made

- BrowserRouter added at App.jsx level so NavLink in child components (SideDrawer, Toolbar) is within router context. Plan 01 removed it from main.jsx first to prevent nesting.
- `pt-14` (56px) used for content top padding — matches the Toolbar's `h-14` fixed height so content starts below the toolbar without overlap.
- `bg-bg` Tailwind token maps to `--color-bg: #242424` defined in src/index.css @theme (Phase 1) — no hardcoded hex values in JSX.
- App.css safe to delete: it was only imported by App.jsx (confirmed by grep); no other files reference it.

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None — App.jsx is fully wired: BrowserRouter, useState, Toolbar, SideDrawer (with closeDrawer), Backdrop (conditional), and Main (routes) are all connected.

## Threat Flags

None — no new network endpoints, auth paths, file access patterns, or schema changes introduced. BrowserRouter is a client-side routing wrapper only.

## Self-Check

- [x] src/App.jsx exists and contains useState, BrowserRouter, closeDrawer, bg-bg, pt-14
- [x] src/App.css deleted (does not exist on disk)
- [x] Commit e022c57 exists (feat — App.jsx rewrite)
- [x] Commit c0fce4c exists (chore — App.css deletion)
- [x] Overall verification node command prints "ALL CHECKS PASSED"

## Self-Check: PASSED

---
*Phase: 02-layout-navigation*
*Completed: 2026-05-15*
