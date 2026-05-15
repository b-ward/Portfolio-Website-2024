# Phase 5: Projects Index - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-15
**Phase:** 05-projects-index
**Areas discussed:** Card color scheme, Responsive grid layout, ProjectCard component, Fixed image/description heights

---

## Card color scheme

| Option | Description | Selected |
|--------|-------------|----------|
| White card, black text | Matches Bootstrap original and Phase 4 SharedCard implementation | ✓ |
| Dark surface card, white text | bg-surface (#333134) with white text — fully dark theme | |
| Dark card with accent title | bg-surface with text-accent gold titles | |

**User's choice:** White card, black text

---

### Card hover effect

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle shadow/scale on hover | hover:shadow-lg or hover:scale-105 | ✓ |
| No hover effect | Matches original — no visual change on hover | |

**User's choice:** Subtle shadow/scale on hover

---

## Responsive grid layout

| Option | Description | Selected |
|--------|-------------|----------|
| 2 cols mobile → 4 cols desktop | grid-cols-2 lg:grid-cols-4 — matches Bootstrap original | ✓ |
| 2 cols → 3 cols → 4 cols | grid-cols-2 md:grid-cols-3 lg:grid-cols-4 — smoother progression | |
| 1 col → 2 cols → 4 cols | Single column on small phones | |

**User's choice:** 2 cols mobile → 4 cols desktop

---

### Grid horizontal padding

| Option | Description | Selected |
|--------|-------------|----------|
| px-20 (5rem fixed) | Matches original exactly | |
| Responsive: px-4 sm:px-8 lg:px-20 | Smaller padding on mobile, full padding on desktop | ✓ |

**User's choice:** Responsive padding (px-4 sm:px-8 lg:px-20)

---

## ProjectCard component

| Option | Description | Selected |
|--------|-------------|----------|
| Extract ProjectCard component | Separate file, projects.jsx maps over data array | ✓ |
| Keep inline in projects.jsx | All card markup repeated inline | |
| Claude's discretion | Claude picks approach | |

**User's choice:** Extract ProjectCard component to src/components/Projects/ProjectCard.jsx

---

## Fixed image/description heights

| Option | Description | Selected |
|--------|-------------|----------|
| Fixed image + description heights | h-[150px] image, h-[80px] description — replicates original | ✓ |
| Fixed total card height | Single fixed height on the card itself | |

**User's choice:** Fixed image (h-[150px]) + fixed description (h-[80px])

**Notes:** User specifically said "all the cards should be the same height and width" — uniform grid appearance is the goal.

---

## Claude's Discretion

- Exact gap size between grid cells
- Whether to add min-w-0 to grid items
- Card body padding amount
- Max card width constraint

## Deferred Ideas

None — discussion stayed within phase scope.
