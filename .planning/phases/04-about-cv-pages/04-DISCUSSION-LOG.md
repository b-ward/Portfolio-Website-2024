# Phase 4: About & CV Pages - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-15
**Phase:** 04-about-cv-pages
**Areas discussed:** About page card layout, Card visual design, Links inside card content

---

## About page card layout

| Option | Description | Selected |
|--------|-------------|----------|
| Side-by-side grid | 1 column mobile, 3 equal columns lg+ — more visually interesting | |
| Stacked full-width | Each card takes full width, cards stack vertically. Matches current actual render | ✓ |

**User's choice:** Stacked full-width
**Notes:** Current rendering already stacks (due to SharedCard's col-sm-12 wrapper), user confirmed this is the desired layout.

---

## Card visual design

| Option | Description | Selected |
|--------|-------------|----------|
| bg-surface (#333134) | Established surface token, subtle contrast against page background | Claude's discretion → bg-surface |
| Same as page (bg-bg) | Card blends into page background | |

| Option | Description | Selected |
|--------|-------------|----------|
| No border | Clean minimal look | ✓ |
| Subtle border | e.g. white/10 opacity thin border | |

| Option | Description | Selected |
|--------|-------------|----------|
| Rounded (rounded-lg) | Soft corners, modern feel | ✓ |
| No rounding | Sharp corners | |

**User's choice:** No border + rounded-lg; background deferred to Claude's discretion
**Notes:** Claude will use bg-surface (#333134) as the established surface token — provides clean contrast against the #242424 page background without being jarring.

---

## Links inside card content

| Option | Description | Selected |
|--------|-------------|----------|
| text-accent gold (#ffc200) | Matches design system accent, applies .about-link intent | |
| White / default text | Low visual noise, differentiated by underline only | |
| Claude's discretion | Pick whatever looks best | ✓ |

**User's choice:** Claude's discretion
**Notes:** Claude will apply text-accent (#ffc200) with no underline — consistent with design system and finally applies the intent of the unused .about-link CSS class.

---

## Claude's Discretion

- Card background: `bg-surface` (#333134) chosen for clean contrast on the dark-theme site
- Link styling: `text-accent` gold with no underline, matching design system

## Deferred Ideas

None — discussion stayed within phase scope.
