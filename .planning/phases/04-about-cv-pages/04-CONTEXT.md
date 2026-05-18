# Phase 4: About & CV Pages - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Convert `about.jsx`, `cv.jsx`, and the shared `card.jsx` from class components to functional components, replacing all react-bootstrap `Card`/`CardGroup` usage with Tailwind equivalents. Delete `about.css`, `cv.css`, and `card.css` after migration. All content (text, links, image sources) is preserved verbatim. Fix image paths from relative (`../X`) to absolute root (`/X`).

</domain>

<decisions>
## Implementation Decisions

### Component Conversion
- **D-01:** Convert `About`, `CV`, and `SharedCard` from class components to functional components — established pattern from Phases 2 & 3
- **D-02:** No hooks needed in these components (no state, no effects) — pure render functions are sufficient
- **D-03:** Delete `about.css`, `cv.css`, and `card.css` after migration; remove their imports from the respective components

### About Page Layout
- **D-04:** The 3 cards (About Me, Contact Details, About This Site) are displayed **stacked full-width** — each card takes the full container width, cards stack vertically
- **D-05:** Replace `<CardGroup style={{margin: '2rem 8vw 2rem 8vw'}}>` with a plain `<div>` container with equivalent horizontal/vertical margin (`mx-[8vw] my-8`)

### CV Page Layout
- **D-06:** Keep the CV's existing structure: section header `<h3>` elements interleaved with `SharedCard` instances, all inside a single container div (replaces `CardGroup`)
- **D-07:** Section headers (`Career Summary`, `Experience`, `Certifications`, `Education`) use `text-accent` colour and top margin — replicate `cv.css` `.cv-title` rule: `text-accent mt-5`
- **D-08:** The CV `<h1>CV</h1>` title is centred — use `text-center`
- **D-09:** Remove the Bootstrap `col-sm-12 col-lg-12` grid-column divs wrapping section headers (not needed in Tailwind context)

### SharedCard Visual Design
- **D-10:** Card background: **`bg-surface` (#333134)** — established surface token; provides clean contrast against the `#242424` page background
- **D-11:** Card border: **none** — the surface background colour provides sufficient visual separation
- **D-12:** Card corners: **`rounded-lg`** — soft modern corners
- **D-13:** Card bottom margin: **`mb-8`** (2rem) — replicates the existing `margin: '0 0 2rem 0'` inline style on the Bootstrap Card
- **D-14:** Remove the `<div className="col-sm-12 col-lg-12">` wrapper from SharedCard — not needed without Bootstrap's grid

### SharedCard Image Layout (CV company logos)
- **D-15:** Optional `imageSrc` prop: if provided, render image to the **left** of the card body in a flex row (`flex flex-row`)
- **D-16:** Image sizing: `max-h-[100px] w-auto` — replicates the existing `maxHeight: '100px', width: 'auto'` inline style
- **D-17:** Image has right padding (`pr-4`) to give breathing room before the card body text

### Image Path Fixes
- **D-18:** Fix profile photo path in `about.jsx` and `cv.jsx`: `../BrendonWard.png` → `/BrendonWard.png`
- **D-19:** Fix CV company logo paths in `cv.jsx`: `../CV/X.jpg` → `/CV/X.jpg` (same public-root pattern)
- **D-20:** Profile image styling (replicates `.about-img` from both CSS files): `mt-14 w-[40vw] h-[40vw] max-w-[300px] max-h-[300px] mx-auto block`

### Links Inside Card Content
- **D-21:** Inline `<a href>` links within card bodies use **`text-accent` (#ffc200) with no underline** (`text-accent no-underline`) — consistent with the design system accent colour; finally applies the intent of the unused `.about-link` class in `card.css`

### Claude's Discretion
- Exact Tailwind padding values inside the card body (replicate Bootstrap's ~1.25rem/1rem default padding)
- Whether to apply a `p-4` or `p-6` card body padding
- Hover state on card links (e.g., `hover:underline`)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project requirements
- `.planning/REQUIREMENTS.md` — CONT-01, CONT-02, CONT-03 define success criteria for this phase
- `.planning/PROJECT.md` — Colour tokens and constraints (dark-only, content-preserving)

### Source files to rewrite
- `src/components/About/about.jsx` — class component; uses CardGroup + 3× SharedCard + profile image
- `src/components/About/about.css` — CSS to replicate in Tailwind and delete
- `src/components/CV/cv.jsx` — class component; uses CardGroup + ~12× SharedCard + section headers + profile image
- `src/components/CV/cv.css` — CSS to replicate in Tailwind and delete
- `src/components/Shared/card.jsx` — shared class component; react-bootstrap Card with optional image; used by About + CV (and later phases)
- `src/components/Shared/card.css` — CSS to replicate in Tailwind and delete

### Prior phase context
- `.planning/phases/01-tailwind-setup/01-CONTEXT.md` — Tailwind v4 token definitions, dark-only decision
- `.planning/phases/02-layout-navigation/02-CONTEXT.md` — Image path correction pattern (`/BrendonWard.png`), CSS deletion pattern
- `.planning/phases/03-landing-page/03-CONTEXT.md` — Functional component conversion pattern; token class usage

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/index.css` `@theme` block: tokens `--color-bg` (#242424), `--color-surface` (#333134), `--color-accent` (#ffc200), `--color-text` (#ffffff) — use `bg-surface`, `text-accent`, `text-text` throughout
- `SharedCard` is shared between About, CV — and will be used by Projects phases too; rewriting it cleanly here avoids rework in Phase 5

### Established Patterns
- Functional component: all other components already functional after Phases 2–3; class→functional conversion is routine
- CSS file deletion: established in Phase 2 — once Tailwind takes over, delete companion `.css` file and its import
- Tailwind v4: no `tailwind.config.js`, classes come from `@theme` in `src/index.css` via the Vite plugin
- Dark-only: use `bg-bg`, `bg-surface`, `text-text`, `text-accent` — no `dark:` prefix needed

### Integration Points
- `SharedCard` is imported by `about.jsx` and `cv.jsx` — rewrite SharedCard first, then update both consumers
- Profile image: `public/BrendonWard.png` — already correctly referenced as `/BrendonWard.png` in SideDrawer (Phase 2) and Landing (Phase 3)
- CV company logos: need to verify `public/CV/` directory exists with all referenced images before planning

### Key Measurements to Replicate
- Profile image: `margin-top: 56px` (toolbar height), `width/height: 40vw`, `max-width/max-height: 300px`, `margin: auto`, `display: block`
- Card margin: `margin: 0 0 2rem 0` (bottom only)
- CardGroup outer margin: `margin: 2rem 8vw 2rem 8vw` (top/bottom 2rem, left/right 8vw)
- Company logo image: `max-height: 100px; width: auto; float: left` → use `max-h-[100px] w-auto`
- CV title: `color: #ffc200; margin-top: 20px` → use `text-accent mt-5`

</code_context>

<specifics>
## Specific Ideas

- The SharedCard `cardBody` prop accepts both strings and JSX (arrays with `<br/>` elements in cv.jsx) — the functional rewrite must preserve this; just render `{props.cardBody}` in a `<div>` or `<p>`
- The `.about-link` CSS class was defined but never applied in the JSX — the Tailwind migration is the right time to actually style these links consistently (text-accent, no-underline)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 04-about-cv-pages*
*Context gathered: 2026-05-15*
