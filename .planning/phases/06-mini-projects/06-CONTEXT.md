# Phase 6: Mini-Projects - Context

**Gathered:** 2026-05-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Migrate all 7 interactive mini-project tools to Tailwind styling. Delete all per-component CSS files. Replace Bootstrap Modal/Button/Carousel usages with custom Tailwind equivalents. Convert class components to functional where safe. Preserve all game/calculation logic verbatim — no behaviour changes.

Tools in scope: Arbitrage, TrainGame, PaceCalculator, 500 Scorer, NoisyDetector, NBA Ladder, TrioHome, TrioGame (8 files across 7 project routes).

</domain>

<decisions>
## Implementation Decisions

### Bootstrap Modal Replacement
- **D-01:** Replace Bootstrap `Modal`/`Button` with a **custom Tailwind modal** — a fixed-position `div` with a semi-transparent backdrop overlay and centred content panel, built entirely from Tailwind utilities. No new dependencies. This applies to TrainGame, TrioHome, and TrioGame.
- **D-02:** Bootstrap `Carousel` in TrioGame → replace with a simple Tailwind-styled step indicator or slide wrapper (no library needed — game flow is already state-driven).

### TrioGame Strategy (1090-line high-risk component)
- **D-03:** **Leave TrioGame as a class component.** Only replace Bootstrap imports and migrate `trioGame.css` to Tailwind inline classes. Do NOT convert to functional — the complex mutable state is too high a regression risk. This is the explicit safe path.
- **D-04:** TrioGame's Bootstrap `Modal`, `Button`, and `Carousel` imports are replaced with the custom Tailwind modal (D-01) and plain Tailwind-styled `<button>` elements. Class structure and all `this.state`, `this.setState`, lifecycle methods stay untouched.

### Component Conversions
- **D-05:** TrainGame — convert class → functional (simpler state than Trio), replace Bootstrap Modal with custom Tailwind modal, delete `trainGame.css`.
- **D-06:** TrioHome — convert class → functional, replace Bootstrap Modal with custom Tailwind modal, delete `trioHome.css`.
- **D-07:** NoisyDetector — convert class → functional, **remove all commented-out Bootstrap modal blocks** (they were already dead code), migrate `noisyDetector.css` to Tailwind, delete CSS file.

### Already-Functional Components (CSS migration only)
- **D-08:** Arbitrage — already functional, no Bootstrap visible. Full Tailwind rewrite: replace all custom CSS class names (`arb-card`, `arb-modal-backdrop`, etc.) with Tailwind utilities inline. Delete `arbitrage.css` (429 lines).
- **D-09:** NBA Ladder — already functional. Migrate `nbaLadder.css` to Tailwind inline, delete CSS file. Preserve the `/.netlify/functions/standings` API call exactly as-is.
- **D-10:** PaceCalculator — already functional with inline styles. Replace inline style objects with Tailwind utility classes. No CSS file to delete.
- **D-11:** 500 Scorer — already functional. Replace hardcoded `COLORS` object and inline styles with Tailwind utilities using the project colour tokens (`text-accent` for `#ffc200`, `bg-surface` for `#333134`, etc.). No CSS file to delete.

### Shared Patterns
- **D-12:** All converted tools use `mt-0` (no extra top margin) — `App.jsx` `<main className="pt-14">` already clears the toolbar. Do NOT add `mt-14` to any tool wrapper (learned from Phase 5 spacing fix).
- **D-13:** Dark background for tool pages: `bg-bg` or no background class (inherits from `bg-surface` body) — consistent with site-wide dark theme.
- **D-14:** Gold accent (`text-accent`) for headings/titles; white (`text-white` or default) for body text — consistent colour scheme across all tools.
- **D-15:** Delete all per-component CSS files after Tailwind migration — consistent with all prior phases.

### Claude's Discretion
- Exact Tailwind classes for button styles within each tool (use `bg-accent text-black font-semibold px-4 py-2 rounded` as starting point for primary actions)
- Custom Tailwind modal exact structure (fixed inset-0 backdrop + centred content div)
- Whether PaceCalculator or 500 Scorer need any layout wrapper adjustments for mobile

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — TOOL-01 through TOOL-07 define success criteria
- `.planning/PROJECT.md` — colour tokens, content-preserving constraint, regression risk warning for Trio

### Source files (all tools)
- `src/components/Projects/Arbitrage/arbitrage.jsx` + `arbitrage.css` — functional, custom CSS, no Bootstrap
- `src/components/Projects/TrainGame/trainGame.jsx` + `trainGame.css` — class component, Bootstrap Modal/Button
- `src/components/Projects/PaceCalculator/paceCalculator.jsx` — functional, inline styles
- `src/components/Projects/500/500.jsx` — functional, inline COLORS object
- `src/components/Projects/NoisyDetector/noisyDetector.jsx` + `noisyDetector.css` — class, Bootstrap commented out
- `src/components/Projects/NBA-Ladder/NBA-Ladder.jsx` + `nbaLadder.css` — functional, CSS file
- `src/components/Projects/Trio/trioHome.jsx` + `trioHome.css` — class, Bootstrap Modal/Button
- `src/components/Projects/Trio/trioGame.jsx` + `trioGame.css` — class, Bootstrap Modal/Button/Carousel, 1090 lines

### Prior phase context
- `.planning/phases/01-tailwind-setup/01-CONTEXT.md` — Tailwind v4 token definitions
- `.planning/phases/02-layout-navigation/02-CONTEXT.md` — functional component pattern, CSS deletion pattern
- `.planning/phases/05-projects-index/05-CONTEXT.md` — mt-14 / toolbar spacing lesson

### Routing
- `src/components/main.jsx` — all tool routes; note Trio has two routes: `/Projects/Trio` (TrioHome) and `/Projects/TrioGame` (TrioGame)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/index.css` `@theme` tokens: `text-accent` (#ffc200), `bg-surface` (#333134), `bg-bg` (#242424), `text-white` (#ffffff)
- `src/components/Projects/ProjectCard.jsx` — Link wrapping pattern (Phase 5)

### Established Patterns
- Custom Tailwind modal: build as `<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">` with inner content div
- Functional component: `const Foo = () => { ... }` — established in Phases 2–5
- CSS deletion: delete file + remove import line
- `pt-14` already on `<main>` in App.jsx — no `mt-14` needed on tool wrappers

### Integration Points
- NBA Ladder fetches from `/.netlify/functions/standings` — must not change
- Trio has two components: TrioHome (rules/entry) routes to TrioGame (actual game) — both need migration
- `trioGame-state.jsx` is a separate state file for Trio — read before planning but likely no changes needed

### Risk Flags
- TrioGame: 1090 lines, class component with complex mutable state — **leave as class, CSS/Bootstrap only**
- Arbitrage: 429-line CSS file — plan sufficient tasks for full Tailwind conversion
- NoisyDetector: microphone feature uses a commented-out React Native library — this is dead code, leave it commented

</code_context>

<specifics>
## Specific Ideas

- Custom Tailwind modal should be reusable across TrainGame, TrioHome, and TrioGame — consider extracting to `src/components/Shared/Modal.jsx` so it's defined once and imported by all three
- 500 Scorer's `COLORS` object should map directly to Tailwind tokens: `primary: "#fcc001"` → `text-accent`/`bg-accent`, `surface: "#ffffff"` → `bg-white`, etc.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 06-mini-projects*
*Context gathered: 2026-05-17*
