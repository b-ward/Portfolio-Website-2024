---
phase: 06-mini-projects
plan: 09
subsystem: ui
tags: [react, tailwind, modal, class-component, trio, bootstrap-removal]

# Dependency graph
requires:
  - 06-01  # shared Modal component
  - 06-03  # TrioHome pattern for consistency
provides:
  - "src/components/Projects/Trio/trioGame.jsx — TrioGame class component with Bootstrap removed, shared Modal + step indicator"
  - "src/components/Projects/Trio/trioGame.css — trimmed to absolute-position ID rules only"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Bootstrap removal from class component: replace Bootstrap Modal/Button/Carousel imports with shared Modal and plain <button> elements while leaving class structure 100% untouched"
    - "React.useState in function component inside class component file: HelpModal uses React.useState (not destructured) because it is a function component defined at module scope in a class component file"
    - "Step-based image navigator: replaces Bootstrap Carousel with prev/next buttons + slide counter state (React.useState)"
    - "CSS trimming strategy: remove only class-based rules replaced by Tailwind; keep all absolute-position ID rules required for game board canvas"

key-files:
  created: []
  modified:
    - src/components/Projects/Trio/trioGame.jsx
    - src/components/Projects/Trio/trioGame.css

key-decisions:
  - "TrioGame stays as class component — D-03/D-04 preserved; only Bootstrap JSX and CSS class names changed"
  - "React.useState used as React.useState (not destructured import) in HelpModal because HelpModal is a function component inside a class-component file — destructured useState would require changing the React import line"
  - "trioGame.css kept (not deleted) — absolute-position ID rules define the game board canvas and are required for gameplay"
  - "MadeModal converted to shared Modal pattern but remains commented-out in render — preserves existing state of codebase"
  - "YouTube iframe src URL https://www.youtube.com/embed/OvWgewf9uEA preserved verbatim"

patterns-established:
  - "Bootstrap removal from class component: surgical replacement of import/JSX lines only — class structure, this.state, this.setState, all game logic methods untouched"

requirements-completed:
  - TOOL-02

# Metrics
duration: 5min
completed: 2026-05-17T08:52:40Z
---

# Phase 6 Plan 09: TrioGame Bootstrap Removal Summary

**Bootstrap removed from 1090-line TrioGame class component — shared Modal with 13-page step indicator replaces Carousel, plain Tailwind buttons replace Bootstrap Button, CSS trimmed to game board ID rules only**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-05-17T08:47:00Z
- **Completed:** 2026-05-17T08:52:40Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Removed `import { Modal, Button, Carousel } from 'react-bootstrap'` — replaced with `import Modal from '../../Shared/Modal'`
- Replaced `HelpModal` Bootstrap Carousel with a `React.useState`-driven step indicator navigating 13 instruction PNG images
- Replaced `MadeModal` Bootstrap Modal with shared Modal — body content preserved verbatim (MadeModal remains commented-out in render per existing codebase state)
- Replaced two `<Button>` elements in render() with plain `<button className="bg-accent text-black font-semibold px-4 py-2 rounded cursor-pointer">`
- Replaced `className="trio-wrapper"` with `className="text-center min-h-screen"` (no margin-top, D-12)
- Replaced `className="trio-title"` with `className="text-accent text-2xl font-semibold py-3"`
- Trimmed `trioGame.css`: removed `.trio-wrapper`, `.trio-title`, `.trio-button:hover`, `.video-container`, `.instruction-video`, `.instruction-image` — all replaced by Tailwind inline classes
- Kept all absolute-position `#id` rules in CSS — these define the game board canvas geometry required for gameplay
- **TrioGame remains a class component** — `class TrioGame extends Component`, all `this.state.*`, `this.setState(...)`, and every game logic method (shuffle, card_clicked, CPU_turn, discard1-13, etc.) left completely untouched
- `npm run build` passes (108 modules, 0 errors) — module count reduced from 113 as Bootstrap chunks eliminated

## Task Commits

1. **Task 1: Remove Bootstrap from trioGame.jsx** — `da6e098` (feat)
2. **Task 2: Trim trioGame.css** — `1db037d` (chore)

## Files Created/Modified

- `src/components/Projects/Trio/trioGame.jsx` — Bootstrap removed; HelpModal uses shared Modal with step indicator; MadeModal uses shared Modal (commented-out in render); plain `<button>` elements; Tailwind wrapper/title class names; all game logic untouched
- `src/components/Projects/Trio/trioGame.css` — Class rules removed (`.trio-wrapper`, `.trio-title`, `.trio-button:hover`, `.video-container`, `.instruction-video`, `.instruction-image`); all absolute-position `#id` rules preserved

## Decisions Made

- Used `React.useState` (not destructured `useState`) in HelpModal — HelpModal is a function component defined at module scope in a class-component file; destructuring would require changing the top-of-file `import React, {Component}` line which is out of scope
- Preserved MadeModal as commented-out — the existing codebase had it commented out in render; plan spec required keeping that state
- Kept `trioGame.css` (not deleted) — the absolute-position ID rules are load-bearing for the game board canvas geometry

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None. All acceptance criteria for both tasks passed on first attempt.

## Known Stubs

None — trioGame.jsx is a fully functional game. All UI is wired to real game state. MadeModal is commented-out in the render, which is the intentional pre-existing state preserved verbatim.

## Threat Surface Scan

No new network endpoints, auth paths, file access patterns, or schema changes introduced. This is a pure CSS/Bootstrap-to-Tailwind migration with no logic changes.

## Self-Check: PASSED

- `src/components/Projects/Trio/trioGame.jsx` — exists, contains `class TrioGame extends Component`, no `react-bootstrap` import
- `src/components/Projects/Trio/trioGame.css` — exists, no `.trio-wrapper`, contains `#player_card_` and `#play` rules
- Commit `da6e098` — exists in git log
- Commit `1db037d` — exists in git log
- `npm run build` — passes (108 modules, 0 errors)

---
*Phase: 06-mini-projects*
*Completed: 2026-05-17*
