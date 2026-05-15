---
phase: "05-projects-index"
plan: "01"
subsystem: "Projects"
tags: [tailwind, react-router, component-extraction, bootstrap-removal]
dependency_graph:
  requires: []
  provides: [ProjectCard, Projects]
  affects: [src/components/Projects/projects.jsx, src/components/Projects/ProjectCard.jsx]
tech_stack:
  added: []
  patterns: [functional-component, data-array-map, css-grid, react-router-link, fixed-height-card]
key_files:
  created:
    - src/components/Projects/ProjectCard.jsx
  modified:
    - src/components/Projects/projects.jsx
  deleted:
    - src/components/Projects/projects.css
decisions:
  - "Whole-card Link wrapping (not just title) for full clickable area — D-05/D-06"
  - "Fixed image height h-[150px] and description height h-[80px] for consistent grid row alignment"
  - "2-column mobile / 4-column desktop grid matching original Bootstrap col-sm-6 col-lg-3"
  - "projects.css deleted after all rules replaced by Tailwind utilities"
metrics:
  duration: "~15 minutes"
  completed: "2026-05-15"
  tasks_completed: 2
  tasks_total: 2
  files_created: 1
  files_modified: 1
  files_deleted: 1
---

# Phase 05 Plan 01: Projects Index Tailwind Rewrite Summary

Replaced Bootstrap `Card`/`CardGroup` class component with a Tailwind functional component and extracted `ProjectCard` as a reusable image-top card with React Router `Link` navigation replacing bare `<a href>` tags.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create ProjectCard.jsx | 339fccf | src/components/Projects/ProjectCard.jsx (created) |
| 2 | Rewrite projects.jsx and delete projects.css | 87d35d6 | src/components/Projects/projects.jsx (rewritten), src/components/Projects/projects.css (deleted) |

## What Was Built

**ProjectCard.jsx** — New functional component wrapping a full card in `<Link to={route}>` so the entire card surface is clickable (not just the title). White `bg-white` card with `rounded-lg overflow-hidden` clips the image at corners. Fixed image height (`h-[150px]`) and description height (`h-[80px]`) ensures consistent row alignment across the grid. Hover effect (`hover:shadow-lg hover:scale-105 transition-transform duration-150`) provides tactile feedback.

**projects.jsx** — Rewritten as a pure functional component. A module-level `PROJECTS` constant holds all 7 active project entries (plus 3 commented-out entries preserved verbatim). The component maps over this array to render `ProjectCard` instances in a `grid grid-cols-2 lg:grid-cols-4 gap-4` layout. `mt-14` on the outer wrapper clears the 56px fixed toolbar. `text-accent text-center` on the `<h1>` renders "Personal Projects" in gold (#ffc200).

**projects.css** — Deleted. All four rules were replaced by Tailwind utilities:
- `.projects-wrapper { margin-top: 56px }` → `mt-14`
- `.projects-title { color: #ffc200 }` → `text-accent`
- `.project-card a { color: black; text-decoration: none }` → `no-underline text-black` on Link
- `.cards-wrapper` flex layout → CSS Grid via `grid grid-cols-2 lg:grid-cols-4`

## Verification Results

1. Build passes: `npm run build` exits 0 — 113 modules transformed, no errors
2. No Bootstrap remnants in `projects.jsx` or `ProjectCard.jsx`
3. No bare `<a href>` tags in `projects.jsx`
4. `projects.css` deleted and confirmed absent
5. 7 active routes present in PROJECTS array (all verified against main.jsx)
6. 3 commented-out entries (AlexaSpotify, Noisy, Analytics) preserved as JS comments
7. Grid classes `grid-cols-2 lg:grid-cols-4` present at correct location

## Decisions Made

- **Whole-card Link wrapper:** `<Link to={route}>` wraps the entire card `<div>`, not just title/text — matches original `<a href>` wrapping `<Card.Body>` and ensures the image is also clickable. Applied `no-underline text-black` on the Link itself.
- **Fixed heights:** `h-[150px]` on image and `h-[80px]` on description match the original Bootstrap inline styles exactly, preserving the grid row alignment behavior.
- **PROJECTS as module-level constant:** Using `const PROJECTS = [...]` at module scope (uppercase) signals it is a static constant, not component state. This avoids re-creating the array on every render.
- **No Link import in projects.jsx:** Link is only used inside ProjectCard — projects.jsx has no direct router dependency, keeping concerns separated.

## Deviations from Plan

None — plan executed exactly as written. The grep for `react-bootstrap` in the Projects folder returns matches from sub-project files (TrainGame, Trio, NoisyDetector) which are out of scope for this plan and will be addressed in Phase 6.

## Known Stubs

None — all 7 project entries are wired to real image assets in `public/` and real routes defined in `main.jsx`. No placeholder data.

## Threat Flags

No new threat surface introduced — this is a pure static render component with no auth, no user input, no API calls, and no PII. All route and image values are compile-time constants.

## Self-Check: PASSED

- `src/components/Projects/ProjectCard.jsx` — EXISTS
- `src/components/Projects/projects.jsx` — EXISTS (rewritten)
- `src/components/Projects/projects.css` — ABSENT (confirmed deleted)
- Commit `339fccf` — EXISTS (feat(05-01): create ProjectCard component)
- Commit `87d35d6` — EXISTS (feat(05-01): rewrite projects.jsx as functional component)
- Build: PASSED (✓ built in 1.53s)
