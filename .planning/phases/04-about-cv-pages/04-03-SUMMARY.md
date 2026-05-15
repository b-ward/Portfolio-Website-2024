---
phase: 04-about-cv-pages
plan: "03"
subsystem: cv-page
tags: [tailwind, functional-component, cv, bootstrap-removal, css-deletion]
dependency_graph:
  requires: [04-01 SharedCard Tailwind functional component]
  provides: [CV Tailwind functional component]
  affects: [src/components/CV/cv.jsx]
tech_stack:
  added: []
  patterns: [functional-component, tailwind-utility-classes, css-file-deletion, root-absolute-image-paths]
key_files:
  created: []
  modified:
    - src/components/CV/cv.jsx
  deleted:
    - src/components/CV/cv.css
decisions:
  - "D-01: functional component — class CV extends Component removed"
  - "D-03: cv.css deleted — no import in cv.jsx"
  - "D-06: section headers interleaved with SharedCard instances inside single container div"
  - "D-07: section headers use text-accent mt-5"
  - "D-08: h1 CV title uses text-center"
  - "D-09: col-sm-12 col-lg-12 wrapper divs around section headers removed"
  - "D-18: profile image path /BrendonWard.png (root-absolute)"
  - "D-19: all 11 company logo paths changed to /CV/X.ext root-absolute format"
  - "D-20: profile image mt-14 w-[40vw] h-[40vw] max-w-[300px] max-h-[300px] mx-auto block"
metrics:
  duration: "5 minutes"
  completed_date: "2026-05-15T17:49:12Z"
  tasks_completed: 2
  files_changed: 2
---

# Phase 04 Plan 03: CV Page Tailwind Rewrite Summary

**One-liner:** CV page rewritten from Bootstrap class component to Tailwind functional component with 12 SharedCard instances, 4 section headers using text-accent mt-5, root-absolute image paths, and cv.css deleted.

## What Was Built

Rewrote `src/components/CV/cv.jsx` from a react-bootstrap `CardGroup`/class component to a pure functional component using Tailwind utility classes. The page structure is preserved: profile image, centred h1 title, then a container div with section header h3 elements interleaved with SharedCard instances. All 12 SharedCard entries are present with verbatim content. Fixed all image paths from relative (`../`) to root-absolute (`/`). Deleted the companion `cv.css` file after all CSS rules were replicated in Tailwind classes.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Rewrite cv.jsx as functional Tailwind component | 4bfa892 | src/components/CV/cv.jsx |
| 2 | Delete cv.css and verify build | 9bc9539 | src/components/CV/cv.css (deleted) |

## Verification Results

- `npm run build` exits 0 — no broken imports, no missing CSS file
- `grep -r "react-bootstrap" src/components/CV/` — no results
- `grep -c "text-accent mt-5" src/components/CV/cv.jsx` — 4 matches (Career Summary, Experience, Certifications, Education)
- `grep -n 'src="/BrendonWard.png"' src/components/CV/cv.jsx` — 1 match on line 7
- `grep -c "../CV/" src/components/CV/cv.jsx` — 0 (no relative paths)
- `test ! -f src/components/CV/cv.css` — passes

## Decisions Implemented

All decisions from CONTEXT.md applied:

| Decision | Implementation |
|----------|----------------|
| D-01 functional component | `const CV = () => (...)` |
| D-03 no css import | No `import './cv.css'` |
| D-06 section structure | h3 headers interleaved with SharedCard in container div |
| D-07 section headers | `className="text-accent mt-5"` on all 4 h3 elements |
| D-08 h1 centre | `className="text-center"` on h1 |
| D-09 remove col wrappers | No `col-sm-12 col-lg-12` divs |
| D-18 profile image path | `src="/BrendonWard.png"` |
| D-19 company logo paths | `imageSrc="/CV/WTG.jpg"` etc. (11 instances) |
| D-20 profile image sizing | `mt-14 w-[40vw] h-[40vw] max-w-[300px] max-h-[300px] mx-auto block` |

## CSS Rules Replicated in Tailwind

| CSS Rule | Tailwind Equivalent | Location |
|----------|---------------------|----------|
| `.cv-title { margin-top: 20px; color: #ffc200 }` | `text-accent mt-5` | h3 elements |
| `.about-img { margin-top: 56px; width/height: 40vw; max: 300px; margin: auto; display: block }` | `mt-14 w-[40vw] h-[40vw] max-w-[300px] max-h-[300px] mx-auto block` | img element |
| `.cv-title.main { text-align: center }` | `text-center` | h1 element |
| `.cv-wrapper { text-align: left }` | (browser default — no class needed) | — |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — CV is a static render component with developer-supplied content only.

## Threat Flags

None — static render component; no user inputs, no network calls, no new security surface introduced.

## Self-Check: PASSED

- src/components/CV/cv.jsx: FOUND
- src/components/CV/cv.css: CONFIRMED DELETED
- Commit 4bfa892: FOUND
- Commit 9bc9539: FOUND
