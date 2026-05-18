# Phase 8: TopArtistsMap / Spotify - Context

**Gathered:** 2026-05-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace all custom CSS class names in `topArtistsMap.jsx` with Tailwind utility classes and delete `topArtistsMap.css`. The component is already a functional component — no class→functional conversion required.

`SpotifyAuthProvider.jsx` is fully untouched — all Spotify OAuth, SDK initialisation, token refresh, login, and logout logic is preserved exactly.

</domain>

<decisions>
## Implementation Decisions

### Info Modal
- **D-01:** The "How it works" info modal is converted to a **dark theme** using the shared `Modal.jsx` component from Phase 6 (`bg-surface`, `text-accent` title, white/muted body text). The current light theme is not preserved.
- **D-02:** `Modal.jsx` is used directly — the existing backdrop-dismiss and aria-modal behaviour inside Modal.jsx replaces the custom implementation. Pass `title="How this map works"` and render the body paragraphs as children.

### Map Wrapper & SVG Background
- **D-03:** The map wrapper div gets `bg-white` via Tailwind (currently `.map-wrapper { background: #ffffff }`).
- **D-04:** The `<svg>` element's `style={{ background: '#ffffff', display: 'block' }}` inline style stays unchanged — the white background on the SVG is intentional (maps render best on white) and SVG inline styles are safe to leave.

### Outer Wrapper Margin-Top
- **D-05:** Remove `margin-top: 56px` (and the mobile `margin-top: 52px`) from the outer wrapper. Toolbar clearance is handled by `pt-14` on `<main>` in App.jsx (D-12 from Phase 6, carried forward).

### Dynamic Cursor States
- **D-06:** The `is-zoomed` and `is-dragging` CSS class toggles are replaced with inline Tailwind conditionals on the map wrapper:
  - `zoomLevel > 1 ? 'cursor-grab' : ''`
  - `isDragging ? 'cursor-grabbing' : ''`
  No separate CSS file needed for these states.

### Loading Spinner Animation
- **D-07:** The `.loading-spinner` custom `@keyframes spin` is replaced with Tailwind's built-in `animate-spin` utility. Tailwind v4 includes the `spin` keyframe natively.

### Dead Code Removal
- **D-08:** Remove the inert `className={hoveredCountry?.countryCode === countryCode ? 'hovered' : ''}` attribute from SVG `<path>` elements. No CSS rule uses `.hovered` — the hover effect is handled via the `fill` prop — so this attribute has no effect.

### Responsive Behaviour
- **D-09:** Strict migration — all existing mobile breakpoint behaviour is preserved via Tailwind responsive prefixes (`md:`, `sm:`). No new responsive improvements added (D-06 from Phase 7 carries forward).

### CSS File Deletion
- **D-10:** Delete `topArtistsMap.css` after all classes are migrated to Tailwind. Remove the `import './topArtistsMap.css'` line from `topArtistsMap.jsx`.

### Claude's Discretion
- SVG path `stroke` and `strokeWidth` inline props (currently set programmatically) — leave as-is
- Exact Tailwind class choices for the mobile breakpoint layout changes (column header, larger zoom buttons, hidden floating tooltip, visible pinch hint)
- Whether to keep the `style={{ cursor: bucket ? 'pointer' : 'default' }}` on SVG paths as-is (programmatic, not from CSS) or replace with a conditional Tailwind class

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — SPOT-01, SPOT-02 define success criteria
- `.planning/PROJECT.md` — colour tokens, content-preserving constraint, Spotify auth constraint

### Source files
- `src/components/Projects/TopArtistsMap/topArtistsMap.jsx` — component to migrate
- `src/components/Projects/TopArtistsMap/topArtistsMap.css` — CSS to replace and delete
- `src/components/Projects/TopArtistsMap/auth/SpotifyAuthProvider.jsx` — DO NOT MODIFY

### Shared components
- `src/components/Shared/Modal.jsx` — reuse for info modal (dark theme, backdrop dismiss, aria-modal)

### Prior phase context
- `.planning/phases/01-tailwind-setup/01-CONTEXT.md` — Tailwind v4 @theme token definitions
- `.planning/phases/02-layout-navigation/02-CONTEXT.md` — functional component pattern, `pt-14` on main
- `.planning/phases/06-mini-projects/06-CONTEXT.md` — D-12 (no margin-top on wrappers), D-13 (dark bg), D-14 (text-accent titles)
- `.planning/phases/07-remaining-pages/07-CONTEXT.md` — D-06 (strict migration, no responsive improvements)

### Theme tokens
- `src/index.css` `@theme` block — `text-accent` (#ffc200), `bg-surface` (#333134), `bg-bg` (#242424)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/Shared/Modal.jsx` — dark-themed modal with backdrop dismiss; use for "How it works" info modal
- `src/index.css` `@theme` tokens — `accent`, `surface`, `bg` colour utilities

### Established Patterns
- `animate-spin` — Tailwind v4 built-in; direct replacement for the custom `@keyframes spin` / `.loading-spinner`
- Conditional className strings — `zoomLevel > 1 ? 'cursor-grab' : ''` pattern consistent with other interactive components
- No outer `margin-top: 56px` — `pt-14` on `<main>` handles toolbar clearance (established in Phase 6)

### Integration Points
- `topArtistsMap.jsx` wraps `SpotifyAuthProvider` at the export level — do not alter this wrapper structure
- Route in `src/components/main.jsx` at `/Projects/TopArtistsMap` — no changes needed
- `SpotifyAuthProvider.jsx` exposes `useSpotifyAuth` hook — only JSX/className changes in the consumer, not the hook

### Components Not to Touch
- `SpotifyAuthProvider.jsx` — zero changes
- `src/components/Projects/TopArtistsMap/services/` — MusicBrainz service logic, not in scope

</code_context>

<specifics>
## Specific Ideas

- The map colour scale (`MAP_COLOR_SCALE`) uses hardcoded hex values for heatmap gradient — these are SVG fill values, not CSS classes. Keep as-is (not Tailwind colours).
- Hover fill `HOVER_FILL = '#fb7185'` is defined but not currently applied to the hover state in `renderGeoJSONFeature` — leave this as-is (preserve existing behaviour).
- The mobile breakpoint layout for `.map-zoom-controls` switches from top-right horizontal to bottom-right vertical column — preserve this via Tailwind `sm:` or `md:` responsive variants.
- The `map-mobile-hint` (`display: none` normally, `display: block` on mobile) maps directly to `hidden md:block` or similar responsive utility.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 08-topartistsmap-spotify*
*Context gathered: 2026-05-18*
