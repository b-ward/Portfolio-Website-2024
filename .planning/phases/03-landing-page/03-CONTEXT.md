# Phase 3: Landing Page - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Convert `src/components/Landing/landingpage.jsx` from a class component to a functional component: replace `componentDidMount` + `document.querySelector` with `useRef` + `useEffect`, and rewrite the existing CSS layout as Tailwind utilities. Delete `landingpage.css` after migration. All content is preserved — typing strings, heading text, and image are unchanged.

</domain>

<decisions>
## Implementation Decisions

### Component Conversion
- **D-01:** Convert `Landing` from `class Landing extends Component` to a functional component using `const Landing = () => {}`
- **D-02:** Replace `componentDidMount` with a `useEffect` hook (empty dependency array — runs once on mount)
- **D-03:** Add a `useRef(null)` ref (e.g., `typingRef`) attached to the `<div id="typing">` element, replacing the `document.querySelector('#typing')` call (satisfies QUAL-01)
- **D-04:** Preserve typing animation configuration exactly: `{ showCursor: false, backDelay: 1500, strings: ['Product Manager', 'Tester', 'Developer', 'Technology Enthusiast'] }`
- **D-05:** Remove `import React, {Component} from 'react'` — replace with `import React, { useRef, useEffect } from 'react'`

### Heading Text Treatment
- **D-06:** Preserve the `bg-surface` (i.e., `background-color: #333134`) boxes behind h1, h2, and h3 — this is an intentional design choice. In Tailwind: add `bg-surface` to each heading element

### Layout — Desktop
- **D-07:** Full-viewport two-column flex layout: left half (image) and right half (text). Height fills screen below toolbar using `h-[calc(100vh-3.5rem)]` (3.5rem = 56px toolbar)
- **D-08:** Image on the left: centred vertically and horizontally within its container, height 70% of container
- **D-09:** Text on the right: wrapper is `max-w-[600px]`, `h-[600px]`, `pl-[50px] pr-5`, flex column, vertically centred
- **D-10:** h1 font size 45px, h2 30px, h3 20px — replicate with Tailwind arbitrary sizes or closest standard values
- **D-11:** `white-space: nowrap` on h1 — use `whitespace-nowrap` in Tailwind
- **D-12:** h3 span (the typing animation container) uses accent colour: `text-accent`

### Layout — Mobile
- **D-13:** Breakpoint for column switch: **`lg:` (1024px)** — Tailwind standard, close enough to the existing 1000px
- **D-14:** On screens narrower than lg: column layout (flex-col), image stacked above text
- **D-15:** Mobile image: **preserve the bottom-pinned behavior** — image container is `relative`, image is `absolute bottom-0 h-[80%]`
- **D-16:** Mobile text wrapper: full width, 50vh height, centred (no left/right padding)

### Image and CSS
- **D-17:** Fix image path: `../BrendonWard.png` → `/BrendonWard.png` (image lives in `public/`, correct Vite reference is absolute root path)
- **D-18:** Delete `src/components/Landing/landingpage.css` after migration — remove the CSS import from the component

### Claude's Discretion
- Exact Tailwind arbitrary values vs. closest standard utilities for font sizes and spacing
- Whether to add `overflow-hidden` to the outer container on mobile (replicate existing `overflow: hidden` on `.intro .left`)
- Exact padding/margin values for the heading elements (matching the current `margin: 10px 0` on h1)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Source file to rewrite
- `src/components/Landing/landingpage.jsx` — class component to convert; contains all JSX and current ityped init logic
- `src/components/Landing/landingpage.css` — CSS to replicate in Tailwind and then delete

### Project and requirements
- `.planning/REQUIREMENTS.md` — LAND-01, LAND-02, LAND-03, QUAL-01 define success criteria for this phase
- `.planning/PROJECT.md` — Colour tokens, content-preserving constraint

### Prior phase context
- `.planning/phases/01-tailwind-setup/01-CONTEXT.md` — Tailwind v4 token definitions, dark-only decision
- `.planning/phases/02-layout-navigation/02-CONTEXT.md` — Image path correction pattern (D-16), CSS deletion pattern, NavLink/routing approach

### Image asset
- `public/BrendonWard.png` — Profile photo; reference as `/BrendonWard.png` in JSX (already used in SideDrawer after Phase 2)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/index.css` `@theme` block: tokens `--color-bg` (#242424), `--color-surface` (#333134), `--color-accent` (#ffc200), `--color-text` (#ffffff) — use `bg-surface`, `text-accent`, etc.
- `ityped` library already installed — keep it, only change the DOM access pattern

### Established Patterns
- Functional component with hooks: all other components in the codebase are already functional — this is the last class component on the landing page
- Tailwind v4: no `tailwind.config.js`, token classes come from `@theme` in `src/index.css` via the Vite plugin
- Dark-only: use `bg-bg`, `bg-surface`, `text-text`, `text-accent` — no `dark:` prefix needed
- CSS file deletion: established in Phase 2 — once Tailwind takes over, delete the companion `.css` file and remove its import

### Integration Points
- Landing component is rendered at route `/` in `src/components/main.jsx` — no routing changes needed
- The `<div id="typing">` element needs to become a `ref`-attached element — the `useRef` replaces the `document.querySelector` entirely

### Key Measurements to Replicate
- Container height: `calc(100vh - 3.5rem)` — full viewport minus 56px toolbar (use `h-[calc(100vh-3.5rem)]`)
- Left/right split: `flex: 0.5` each side — use `flex-1` on both (equal halves)
- Desktop image: `height: 70%` of container — use `h-[70%]`
- Mobile image: `position: absolute; bottom: 0; height: 80%` — replicate with `absolute bottom-0 h-[80%]` inside a `relative` container
- Wrapper: `max-width: 600px; height: 600px; padding-left: 50px; padding-right: 20px`
- h1: font-size 45px, margin-top/bottom 10px, white-space: nowrap
- h2: font-size 30px
- h3: font-size 20px; span in accent colour, `display: inline-block`

</code_context>

<specifics>
## Specific Ideas

- The `ityped` init call must receive the actual DOM node — using `typingRef.current` inside `useEffect` is the correct pattern (the ref is guaranteed to be set by the time the effect runs)
- The typing animation `div` with `id="typing"` can keep its id if desired, but the ref is the critical thing — the `document.querySelector` call is what must go
- Phase 2 already demonstrated the image path fix: `/BrendonWard.png` in the SideDrawer works correctly

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-landing-page*
*Context gathered: 2026-05-15*
