# Phase 7: Remaining Pages - Context

**Gathered:** 2026-05-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Migrate the 3 remaining content pages — Photos, Music, and BusinessBrains — to Tailwind CSS.
Convert class components to functional. Delete all per-component CSS files.
No Bootstrap present in any of these files (pure custom CSS migration).
All three are render-only components with embedded iframes; no state or game logic to preserve.

</domain>

<decisions>
## Implementation Decisions

### Class → Functional Conversion
- **D-01:** All three components (Photos, Music, BusinessBrains) are converted from class to functional components — consistent with all prior phases. No state or lifecycle methods exist in any of them.

### Video Iframe Sizing (Photos)
- **D-02:** YouTube videos use `aspect-video` (16:9) — the correct ratio for YouTube content. Width: `w-3/5 mx-auto block mb-8`. This replaces the current `60vw × 40vw` (3:2) sizing, which was technically letterboxed for 16:9 content. No inline arbitrary values needed.

### Content Wrapper Width (Music + BusinessBrains)
- **D-03:** Direct port of the `80%`-wide centred wrapper: `w-4/5 mx-auto` with `mt-8 mb-8` (replacing `margin-top: 2rem; margin-bottom: 2rem`). Faithful migration — no width constraint change.

### Iframe Spacing
- **D-04:** Per-iframe bottom margin: `mb-8` (replaces `margin-bottom: 2rem` on `.soundcloud-audio`, `.business-brains-audio`). Applied as a class directly on each `<iframe>` element.

### Title Styling
- **D-05:** All three page titles use `text-accent text-center` — consistent with the site-wide heading pattern. No `margin-top: 56px` — toolbar clearance is already handled by `pt-14` on `<main>` in App.jsx (D-12 from Phase 6 carries forward).

### Responsive Behaviour
- **D-06:** Strict migration — no new responsive breakpoints added. Existing behaviour is preserved (vw-based sizing for Photos, percentage-based for Music/BB). Responsive improvements are out of scope for this migration phase.

### CSS File Deletion
- **D-07:** Delete `photos.css`, `music.css`, and `businessBrains.css` after Tailwind migration — consistent with all prior phases.

### Claude's Discretion
- Exact padding/margin choices within components beyond what was discussed above (e.g., page-level vertical padding)
- Whether to add a `<p>` subtitle wrapper class on the Photos subtitle line (currently unstyled)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — PAGE-01, PAGE-02, PAGE-03 define success criteria
- `.planning/PROJECT.md` — colour tokens, content-preserving constraint

### Source files (all 3 pages)
- `src/components/Photos/photos.jsx` + `photos.css` — class component, 5 YouTube iframes, vw-based sizing
- `src/components/Music/music.jsx` + `music.css` — class component, 8 Mixcloud iframes, 80%-wide wrapper
- `src/components/BusinessBrains/businessBrains.jsx` + `businessBrains.css` — class component, 2 Spotify iframes, 80%-wide wrapper

### Prior phase context
- `.planning/phases/01-tailwind-setup/01-CONTEXT.md` — Tailwind v4 token definitions
- `.planning/phases/02-layout-navigation/02-CONTEXT.md` — functional component pattern, CSS deletion
- `.planning/phases/06-mini-projects/06-CONTEXT.md` — D-12 (no mt-14 on wrappers), D-13 (dark bg), D-14 (text-accent titles)

### Routing
- `src/components/main.jsx` — Photos, Music, BusinessBrains routes confirm component names

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/index.css` `@theme` tokens: `text-accent` (#ffc200), `bg-surface` (#333134), `bg-bg` (#242424)

### Established Patterns
- Functional component: `const Foo = () => { ... }` — established in Phases 2–6
- CSS deletion: delete file + remove import line
- `pt-14` already on `<main>` in App.jsx — no extra top margin on component wrappers
- Title: `<h3 className="text-accent text-center text-2xl font-semibold mb-4">` (from prior phases)

### Integration Points
- All three are leaf routes in `main.jsx` — no children or sub-routing
- iframes reference external URLs (YouTube, Mixcloud, Spotify) — preserve all `src` attributes exactly

</code_context>

<specifics>
## Specific Ideas

- Photos subtitle ("Make sure to change the quality to 1080p/4k") is a `<p>` element — style as `text-center text-white` consistent with body text
- Music iframes already have `width="100%" height="120"` as inline HTML attributes — these stay; only the CSS-class-based styles move to Tailwind
- BusinessBrains iframes already have `width="100%" height="232"` — same, keep inline attributes

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 07-remaining-pages*
*Context gathered: 2026-05-18*
