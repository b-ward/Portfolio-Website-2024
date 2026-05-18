# Phase 7: Remaining Pages - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-18
**Phase:** 07-remaining-pages
**Areas discussed:** Video iframe sizing, Content wrapper width, Mobile responsiveness

---

## Video iframe sizing

| Option | Description | Selected |
|--------|-------------|----------|
| aspect-video | w-3/5 mx-auto aspect-video block mb-8 — correct 16:9 for YouTube, eliminates letterboxing | ✓ |
| Preserve 60vw×40vw | w-[60vw] h-[40vw] block mx-auto mb-8 — exact match to current 3:2 sizing | |
| You decide | Let Claude pick the most idiomatic Tailwind approach | |

**User's choice:** aspect-video (Recommended)
**Notes:** Current CSS gives 3:2 ratio (60:40) which letterboxes 16:9 YouTube content. Switching to aspect-video is both cleaner Tailwind and more correct for the embed type.

---

## Content wrapper width

| Option | Description | Selected |
|--------|-------------|----------|
| Direct port: w-4/5 mx-auto | Exact equivalent of current 80% — faithful migration | ✓ |
| max-w-2xl mx-auto w-full | Cap at ~672px on large screens | |
| max-w-3xl mx-auto w-full | Cap at ~768px | |

**User's choice:** Direct port: w-4/5 mx-auto (Recommended)
**Notes:** Faithful migration preferred — no visual change from current layout.

---

## Mobile responsiveness

| Option | Description | Selected |
|--------|-------------|----------|
| Strict migration — no new breakpoints | Preserve existing behaviour exactly | ✓ |
| Add simple mobile breakpoint | w-full on mobile, constrained on md+ | |

**User's choice:** Strict migration — no new breakpoints (Recommended)
**Notes:** Responsive improvements are out of scope for a CSS migration phase.

---

## Claude's Discretion

- Exact padding/margin choices within components beyond what was discussed
- Whether to add a class on the Photos subtitle `<p>` element

## Deferred Ideas

None — discussion stayed within phase scope.
