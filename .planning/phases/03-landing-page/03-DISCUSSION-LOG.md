# Phase 3: Landing Page - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-15
**Phase:** 03-landing-page
**Areas discussed:** Heading text treatment, Mobile breakpoint, Mobile image pinning

---

## Heading Text Treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Keep bg-surface boxes | Preserve the existing look — each heading line has a #333134 surface-coloured rectangle behind it. Translates directly to bg-surface in Tailwind. | ✓ |
| Remove backgrounds | Clean text directly on the dark bg (#242424) with no box behind each heading. Simpler but changes the current visual. | |

**User's choice:** Keep bg-surface boxes
**Notes:** This is an intentional design choice — bg-surface behind h1/h2/h3 text creates a subtle layered panel effect.

---

## Mobile Breakpoint

| Option | Description | Selected |
|--------|-------------|----------|
| lg: (1024px) — closest standard | Tailwind's lg breakpoint at 1024px. Very close to the existing 1000px, minimal visible difference. | ✓ |
| Exact 1000px — arbitrary value | Use Tailwind's arbitrary value syntax: max-[1000px]: to match the current breakpoint exactly. | |
| md: (768px) — standard tablet | Use the common Tailwind tablet breakpoint. Columns stay side-by-side on a wider range of screens than today. | |

**User's choice:** lg: (1024px)
**Notes:** Standard Tailwind breakpoint, visually indistinguishable from the current 1000px threshold.

---

## Mobile Image Pinning

| Option | Description | Selected |
|--------|-------------|----------|
| Keep bottom-pinned behavior | Preserve the current look: image sticks to the bottom of the top half so it visually 'sits on' the text section below it. | ✓ |
| Centre the image | Simpler approach: image is centred in its container, no absolute positioning. Easier to implement in Tailwind but changes the mobile look. | |

**User's choice:** Keep bottom-pinned behavior
**Notes:** Image container is relative, image is absolute bottom-0 h-[80%] — the same visual effect as the current CSS.

---

## Claude's Discretion

- Exact Tailwind arbitrary values vs. closest standard utilities for font sizes and spacing
- Whether to add overflow-hidden to the outer container on mobile
- Exact padding/margin values for heading elements

## Deferred Ideas

None.
