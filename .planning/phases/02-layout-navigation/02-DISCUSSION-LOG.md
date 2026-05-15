# Phase 2: Layout & Navigation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-15
**Phase:** 02-layout-navigation
**Areas discussed:** Toolbar desktop layout, Active link indicator, Drawer close on navigation, Drawer profile section styling

---

## Toolbar Desktop Layout

| Option | Description | Selected |
|--------|-------------|----------|
| Hamburger-only | Just the 3-line button, nothing else. All navigation via the side drawer. | ✓ |
| Logo + hamburger | Site name/logo on the left next to the hamburger. No inline nav links. | |
| Logo + inline nav on desktop | Nav links inline on wider viewports, drawer on mobile. | |

**User's choice:** Hamburger-only  
**Notes:** Hamburger always visible on all screen widths (not hidden on desktop).

---

## Active Link Indicator

| Option | Description | Selected |
|--------|-------------|----------|
| Accent colour (gold text) | Active link turns gold (#ffc200). Matches hover colour in SideDrawer.css. | ✓ |
| Accent + underline | Gold text plus an underline. More distinct from hover state. | |
| Bold only | Active link is bold, keeping white colour. Subtle. | |

**User's choice:** Accent colour (gold text)  
**Notes:** Scope is drawer only for Phase 2. Toolbar is hamburger-only so no active state needed there.

---

## Drawer Close on Navigation

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — close on navigate | Pass close handler to SideDrawer; NavLink click also closes drawer. | ✓ |
| No — backdrop only | Drawer stays open after link click; user closes via backdrop. | |

**User's choice:** Close on navigate  
**Notes:** Backdrop close also confirmed kept (no change). Close handler threaded from App → SideDrawer as a prop.

---

## Drawer Profile Section Styling

| Option | Description | Selected |
|--------|-------------|----------|
| Keep layout, migrate CSS to Tailwind | Fix image path, preserve existing design. | |
| Remove profile section | Remove photo/name, start drawer with nav links directly. | |
| Keep with minor redesign | Migrate to Tailwind with layout improvements. | ✓ |

**User's choice:** Keep with minor redesign  
**Improvements selected:** Better spacing/padding, centered layout, Claude's discretion  
**Notes:** User clarified the image appears circular in the browser — it's a transparent-background PNG, not a rectangular photo. No `rounded-full` clipping needed. Image path corrected from `../BrendonWard.png` to `/BrendonWard.png` (file is in `public/`).

---

## Claude's Discretion

- Exact Tailwind utility classes for toolbar height, padding, z-index values
- Drawer slide-in animation implementation (translateX transition)
- Hamburger button three-line styling
- Tasteful spacing improvements to the drawer profile section

## Deferred Ideas

- Desktop inline nav in Toolbar (logo + nav links on large screens) — user chose hamburger-only for Phase 2
- Keyboard focus management for the drawer — v2 accessibility requirement (A11Y-01)
- Hamburger animation (lines morphing to X on open) — not requested
