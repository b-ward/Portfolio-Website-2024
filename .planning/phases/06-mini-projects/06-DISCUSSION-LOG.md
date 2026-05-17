# Phase 6: Mini-Projects - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-17
**Phase:** 06-mini-projects
**Areas discussed:** Modal replacement, Trio strategy, Arbitrage CSS, NoisyDetector

---

## Modal Replacement

| Option | Description | Selected |
|--------|-------------|----------|
| Custom Tailwind modal | Fixed-position div + backdrop overlay, no new dependencies | ✓ |
| HTML `<dialog>` element | Native browser dialog, zero deps, needs useRef/useEffect wrapper | |
| Keep Bootstrap modals | Leave Bootstrap imports in place for 3 tools | |

**User's choice:** Custom Tailwind modal
**Notes:** Applies to TrainGame, TrioHome, TrioGame

---

## Trio Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| CSS + Bootstrap only — leave class structure | Keep class component, only replace Bootstrap + migrate CSS. Zero regression risk. | ✓ |
| Full functional rewrite | Convert to functional with hooks. High regression risk at 1090 lines. | |

**User's choice:** Leave class structure — CSS/Bootstrap replacement only
**Notes:** TrioGame is explicitly the high-risk component called out in PROJECT.md and CLAUDE.md

---

## Arbitrage CSS

| Option | Description | Selected |
|--------|-------------|----------|
| Full Tailwind — delete arbitrage.css | Replace all custom CSS classes with Tailwind inline | ✓ |
| Keep arbitrage.css | No Bootstrap, leave as-is | |

**User's choice:** Full Tailwind migration, delete arbitrage.css

---

## NoisyDetector

| Option | Description | Selected |
|--------|-------------|----------|
| Convert to functional, drop commented code | Full conversion + clean up dead code | ✓ |
| Minimal — CSS only | Leave class structure, CSS migration only | |

**User's choice:** Convert all to Tailwind (including removing commented Bootstrap blocks)

---

## Claude's Discretion

- Exact button styles within each tool
- Custom Tailwind modal exact structure
- Layout wrapper adjustments for PaceCalculator/500 on mobile

## Deferred Ideas

None
