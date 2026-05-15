---
phase: 01-tailwind-setup
reviewed: 2026-05-15T00:00:00Z
depth: standard
files_reviewed: 6
files_reviewed_list:
  - eslint.config.js
  - package.json
  - src/App.css
  - src/index.css
  - src/index.jsx
  - vite.config.js
findings:
  critical: 0
  warning: 2
  info: 6
  total: 8
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-05-15
**Depth:** standard
**Files Reviewed:** 6
**Status:** issues_found

## Summary

Reviewed the six files changed in Phase 1 (Tailwind v4 setup, Bootstrap removal, ESLint v9 flat config). The Tailwind installation and Vite plugin registration are correct. The Bootstrap removal is clean. Two warnings were found: an invalid CSS value that browsers will silently discard, and a stale CLI flag in the lint script that is not recognised by ESLint v9. Neither blocks the build or the dev server, but both should be addressed before later phases depend on them. Six informational items cover minor drift from the project colour token strategy, leftover Vite scaffold defaults, and unused code.

---

## Warnings

### WR-01: Invalid CSS value `background-color: none` in `.Layout`

**File:** `src/App.css:6`
**Issue:** `none` is not a valid value for the `background-color` property. Valid keywords are `transparent`, `inherit`, `initial`, etc. Browsers silently discard invalid declarations and fall back to the element's initial or inherited value. The visual result may be accidental rather than intentional, and it will fail CSS validation.
**Fix:** Replace with `transparent` to explicitly state "no background":
```css
.Layout {
  background-color: transparent;
  display: flex;
  flex-direction: row;
}
```

---

### WR-02: `--ext` flag in lint script is not recognised by ESLint v9

**File:** `package.json:9`
**Issue:** The `lint` script passes `--ext js,jsx` to ESLint. The `--ext` flag was removed in ESLint v9 (flat config). In ESLint v9, file extension filtering is done exclusively through `files` glob patterns in the config. The flag is silently ignored, meaning the linter may scan files outside the intended `.js`/`.jsx` scope (e.g., `.cjs` test files, config stubs) or behave unexpectedly when `--max-warnings 0` is combined with extra lint targets.
**Fix:** Remove the `--ext` flag. The `files` glob in `eslint.config.js` already restricts linting to `**/*.{js,jsx}`:
```json
"lint": "eslint . --report-unused-disable-directives --max-warnings 0"
```

---

## Info

### IN-01: Explicit `React` import is unnecessary with the new JSX transform

**File:** `src/index.jsx:1`
**Issue:** `import React from 'react'` is not required when using the automatic JSX transform (React 17+). The project already enables the `jsx-runtime` ESLint config (which targets the new transform), making this import dead code.
**Fix:** Remove the import:
```jsx
import { createRoot } from 'react-dom/client'
import App from './App';
```

---

### IN-02: Commented-out `.circle` block

**File:** `src/App.css:38-47`
**Issue:** A multi-line commented-out CSS rule (`.circle { … }`) was left from an earlier iteration.
**Fix:** Delete the commented block if it is no longer needed.

---

### IN-03: Vite scaffold button styles use an off-palette hover colour

**File:** `src/index.css:43-60`
**Issue:** The `button` and `button:hover` base styles (`background-color: #1a1a1a`, `border-color: #646cff` on hover) are Vite's default scaffold values. `#646cff` (Vite purple) has no relation to the project colour palette (`#ffc200` accent, `#242424` bg). These global element styles will apply to all `<button>` elements and may conflict with Tailwind Preflight or component-level utility classes added in Phases 2–7.
**Fix:** Remove or replace these styles when button components are migrated in later phases. Not urgent for Phase 1, but flag for cleanup before Phase 2.

---

### IN-04: Background colour is hardcoded in `index.css` rather than using the theme token

**File:** `src/index.css:18,27`
**Issue:** `:root` (line 18) and `html, body, #root` (line 27) both use the literal value `#242424` for `background-color`. The Tailwind `@theme` block on lines 3–8 of the same file defines `--color-bg: #242424` as the canonical token. Hardcoding the same value in two places creates drift risk: if the token changes, the `:root` and `body` backgrounds won't update.
**Fix:** Reference the token:
```css
:root {
  background-color: var(--color-bg);
}
html, body, #root {
  background-color: var(--color-bg);
}
```

---

### IN-05: Slight opacity inconsistency between `:root` text colour and `--color-text` token

**File:** `src/index.css:16`
**Issue:** `:root` sets `color: rgba(255, 255, 255, 0.87)` (87% opacity white), while the `@theme` token `--color-text` is `#ffffff` (fully opaque). Components that use the token will render text at full white; the base `:root` cascade applies 87% opacity. This inconsistency is subtle but could produce unexpected text colours if the cascade is relied upon.
**Fix:** Align the values. If 87% opacity is intentional for body copy, update the token to match:
```css
@theme {
  --color-text: rgba(255, 255, 255, 0.87);
}
```
Or, if full-opacity white is correct, update `:root`:
```css
color: var(--color-text);
```

---

### IN-06: `react-bootstrap` externalized in Rollup — runtime breakage risk until Phases 2–7 complete

**File:** `vite.config.js:13`
**Issue:** Externalizing `react-bootstrap` means any component that still imports from it will throw a runtime `Cannot find module 'react-bootstrap'` error in the browser (no CDN provides it as a global). This is documented and intentional, but a production build deployed before all per-component removals are complete would silently break those pages. The risk is time-bounded to Phases 2–7.
**Fix:** No action needed for Phase 1. Recommended: remove the `external` entry (and the entire `rollupOptions.build` block) as the final task of Phase 7 to ensure no stale references remain, and add a note to the Phase 7 checklist.

---

_Reviewed: 2026-05-15_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
