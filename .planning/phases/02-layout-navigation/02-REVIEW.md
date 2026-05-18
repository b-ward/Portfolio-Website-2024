---
phase: 02-layout-navigation
reviewed: 2026-05-15T00:00:00Z
depth: standard
files_reviewed: 6
files_reviewed_list:
  - src/App.jsx
  - src/components/main.jsx
  - src/components/Backdrop/Backdrop.jsx
  - src/components/SideDrawer/DrawerToggleButton.jsx
  - src/components/SideDrawer/SideDrawer.jsx
  - src/components/Toolbar/Toolbar.jsx
findings:
  critical: 0
  warning: 3
  info: 3
  total: 6
status: issues_found
---

# Phase 2: Code Review Report

**Reviewed:** 2026-05-15T00:00:00Z
**Depth:** standard
**Files Reviewed:** 6
**Status:** issues_found

## Summary

Six files were reviewed covering the layout shell (App.jsx, main.jsx) and the four navigation components (Toolbar, DrawerToggleButton, SideDrawer, Backdrop). The conversion from class components to functional components is clean and correct. BrowserRouter placement in App.jsx is correct. NavLink usage in SideDrawer is idiomatic for react-router-dom v7. Colour tokens (`bg-bg`, `bg-surface`, `text-accent`) resolve correctly through the `@theme` block in `index.css`.

Three warnings were found: a z-index layering conflict that will prevent the Backdrop from blocking Toolbar clicks, a missing `aria-label` on the hamburger button that breaks accessibility, and a global `button` style in `index.css` that overrides DrawerToggleButton's carefully reset styles. Three info items cover a missing `404` catch-all route, an unused `no-underline` utility that conflicts with Tailwind v4 defaults, and the `bg-transparent` redundancy on DrawerToggleButton.

---

## Warnings

### WR-01: Backdrop z-index lower than Toolbar — Toolbar stays clickable while drawer is open

**File:** `src/components/Backdrop/Backdrop.jsx:5` and `src/components/Toolbar/Toolbar.jsx:5`

**Issue:** The Backdrop sits at `z-[100]` and the Toolbar at `z-[1]`. A higher z-index wins, so the Backdrop is drawn above the Toolbar as intended. However the Toolbar header is `z-[1]`, which means it renders *below* the Backdrop. The visual problem is the reverse of the code intention: the SideDrawer at `z-[200]` is correct, but the Toolbar at `z-[1]` means it disappears visually under the Backdrop overlay while the drawer is open. Users can still interact with toolbar area through the transparent z-stack ordering. More critically, the current values leave the Toolbar *below* the Backdrop, causing it to be obscured rather than remaining accessible or being intentionally blocked. A consistent, documented z-index scale is needed.

Expected layering (bottom to top): page content → Toolbar → Backdrop → SideDrawer.

| Layer | Current z | Required z |
|---|---|---|
| Toolbar | 1 | 50 (above page, below backdrop) |
| Backdrop | 100 | 100 |
| SideDrawer | 200 | 200 |

**Fix:**
```jsx
// src/components/Toolbar/Toolbar.jsx — raise to sit above page content but below backdrop
<header className="w-full fixed top-0 left-0 h-14 bg-transparent z-50">
```

With this change the Toolbar remains visible and focusable when the drawer is closed, and the Backdrop at `z-[100]` correctly covers it when the drawer opens (intentional lock-out behaviour). If the design intent is for the Toolbar to stay interactive while the drawer is open, raise the Toolbar above the Backdrop (`z-[150]`) and remove the Backdrop's click handler from the Toolbar area.

---

### WR-02: DrawerToggleButton has no accessible label — screen readers announce nothing

**File:** `src/components/SideDrawer/DrawerToggleButton.jsx:3`

**Issue:** The `<button>` renders three `<div>` bars (a hamburger icon) with no text content, no `aria-label`, and no `title`. Assistive technologies will announce this as an unlabelled button, failing WCAG 2.1 Success Criterion 4.1.2 (Name, Role, Value).

**Fix:**
```jsx
const DrawerToggleButton = ({ click }) => (
  <button
    className="flex flex-col justify-around h-6 w-[30px] bg-transparent border-0 rounded-none p-0 box-border cursor-pointer focus:outline-none"
    onClick={click}
    aria-label="Open navigation menu"
  >
    <div className="w-[30px] h-[3px] bg-white" aria-hidden="true" />
    <div className="w-[30px] h-[3px] bg-white" aria-hidden="true" />
    <div className="w-[30px] h-[3px] bg-white" aria-hidden="true" />
  </button>
);
```

If the open/closed state is tracked in a parent, also add `aria-expanded={show}` passed down as a prop, and `aria-controls` pointing to the SideDrawer's `id`.

---

### WR-03: Global `button` styles in index.css override DrawerToggleButton resets

**File:** `src/index.css:43-60` (affects `src/components/SideDrawer/DrawerToggleButton.jsx`)

**Issue:** `index.css` defines a global `button` rule that sets `border-radius: 8px`, `border: 1px solid transparent`, `padding: 0.6em 1.2em`, `background-color: #1a1a1a`, and a `:hover { border-color: #646cff }`. DrawerToggleButton attempts to reset these via Tailwind utilities (`border-0`, `rounded-none`, `p-0`, `bg-transparent`) but specificity and source order mean the global CSS is applied first and the Tailwind utilities override it. However, `bg-transparent` in Tailwind v4 sets `background-color: transparent` which *does* override the global `#1a1a1a` — so that reset works. The hover state `border-color: #646cff` is not overridden and will show a purple border on hover, conflicting with the design.

**Fix:** Add a `hover:border-transparent` utility to DrawerToggleButton, or scope the global button styles in `index.css` to a class (e.g., `.btn`) so they don't leak onto icon buttons:
```jsx
// Option A — add to DrawerToggleButton className:
"... hover:border-transparent hover:border-color-transparent"

// Option B (preferred) — in index.css, replace the bare `button` selector:
.btn {
  border-radius: 8px;
  /* ... */
}
```

---

## Info

### IN-01: No catch-all 404 route in main.jsx

**File:** `src/components/main.jsx:22-39`

**Issue:** The `<Routes>` block has no `<Route path="*">` fallback. Any URL that does not match an existing path renders nothing — a blank page. This is a content omission that degrades user experience for mistyped or stale links.

**Fix:**
```jsx
import { Routes, Route, Navigate } from 'react-router-dom';

// At the end of the <Routes> block:
<Route path="*" element={<Navigate to="/" replace />} />
// Or a dedicated NotFound component for better UX.
```

---

### IN-02: `no-underline` utility in SideDrawer is redundant under Tailwind v4 defaults

**File:** `src/components/SideDrawer/SideDrawer.jsx:19, 30`

**Issue:** `no-underline` is applied to `NavLink` elements. In Tailwind v4, `text-decoration: none` is part of the Preflight reset for `a` elements, making `no-underline` a no-op. The utility is harmless but adds noise and may mislead future maintainers into thinking it is load-bearing.

**Fix:** Remove `no-underline` from both NavLink `className` strings. If Preflight is ever disabled, add it back at that point.

---

### IN-03: `bg-transparent` on DrawerToggleButton is redundant after global button override is resolved

**File:** `src/components/SideDrawer/DrawerToggleButton.jsx:5`

**Issue:** Once WR-03 is addressed by scoping the global `button` style, `bg-transparent` becomes a no-op because buttons have no background by default in standard CSS. It can be removed to reduce class string length. (This is a future cleanup item; leave it in place until WR-03 is resolved to avoid reintroducing the background-colour bleed.)

**Fix:** After scoping the global button style, remove `bg-transparent` from the className.

---

_Reviewed: 2026-05-15T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
