---
phase: 07-remaining-pages
plan: "03"
subsystem: BusinessBrains page component
tags: [tailwind, functional-component, css-deletion, iframe, spotify]
dependency_graph:
  requires: []
  provides: [BusinessBrains Tailwind component]
  affects: [src/components/BusinessBrains/businessBrains.jsx]
tech_stack:
  added: []
  patterns: [functional-component, text-accent title, w-4/5 wrapper, mb-8 iframe spacing]
key_files:
  created: []
  modified:
    - src/components/BusinessBrains/businessBrains.jsx
  deleted:
    - src/components/BusinessBrains/businessBrains.css
decisions:
  - "Use allowTransparency={true} (boolean JSX form) per plan spec — fixes pre-existing lowercase allowtransparency React warning"
  - "w-4/5 mx-auto mt-8 mb-8 wrapper per D-03 (faithful 80% width migration)"
  - "mb-8 per iframe per D-04 (replaces margin-bottom: 2rem on .business-brains-audio)"
  - "text-accent text-center text-2xl font-semibold mb-4 title per D-05"
  - "businessBrains.css deleted per D-07"
metrics:
  duration: "< 5 minutes"
  completed_date: "2026-05-18"
  tasks_completed: 1
  tasks_total: 1
---

# Phase 7 Plan 03: BusinessBrains Tailwind Migration Summary

**One-liner:** Functional BusinessBrains component with Tailwind classes — 80%-wide Spotify iframe wrapper, gold title, mb-8 iframe spacing, allowTransparency camelCase fix, CSS file deleted.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Rewrite businessBrains.jsx as functional Tailwind component and delete businessBrains.css | 2144df5 | businessBrains.jsx (modified), businessBrains.css (deleted) |

## What Was Built

Converted `businessBrains.jsx` from a class component (`class BusinessBrains extends Component`) to a functional component (`const BusinessBrains = () => ...`) with Tailwind CSS utility classes replacing all custom CSS. The `businessBrains.css` file was deleted.

**Key changes:**
- Class component syntax replaced with arrow function functional component
- `import {Component}` and `import './businessBrains.css'` removed
- `.business-brains-title` replaced with `text-accent text-center text-2xl font-semibold mb-4`
- `.business-brains-wrapper` replaced with `w-4/5 mx-auto mt-8 mb-8`
- `.business-brains-audio` on each iframe replaced with `mb-8`
- Pre-existing React warning fixed: `allowtransparency="true"` (lowercase HTML attribute, invalid in JSX) corrected to `allowTransparency={true}` (camelCase boolean)
- Both Spotify episode URLs preserved exactly: `3uqsIqXuVVHPeMTlB5FQ1i` (Pod 2) and `0eoHeo60heCHlVDOHZOug7` (Pod 1)
- `width="100%"` and `height="232"` retained as inline HTML attributes

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — both Spotify embed iframes are fully wired with real episode URLs.

## Threat Flags

None — component is render-only with no user input, no state mutation, and no dynamic URL construction. Both `src` attributes are hardcoded string literals. The `allow="encrypted-media"` attribute is the minimum required for Spotify embeds. No new security surface introduced.

## Self-Check: PASSED

- `src/components/BusinessBrains/businessBrains.jsx` exists and contains `const BusinessBrains`
- `src/components/BusinessBrains/businessBrains.css` does not exist (deleted)
- Commit 2144df5 verified in git log
- `npm run build` exited 0 with no warnings
