# Phase 5: Projects Index - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Rewrite `projects.jsx` from a class component to a functional component, replacing Bootstrap `Card`/`CardGroup` with Tailwind equivalents. Extract a `ProjectCard` component for the image-top card pattern. Fix `<a href>` links to use React Router `<Link>` for SPA navigation. Fix image paths (`../X` → `/X`). Delete `projects.css` after migration. All 7 active project entries are preserved verbatim (3 commented-out entries remain commented out).

</domain>

<decisions>
## Implementation Decisions

### Component Conversion
- **D-01:** Convert `Projects` from class component to functional component — established pattern from Phases 2–4
- **D-02:** No hooks needed (no state, no effects) — pure render function is sufficient
- **D-03:** Delete `projects.css` after migration; remove its import from `projects.jsx`
- **D-04:** Replace `<a href>` with React Router `<Link to>` on every project card — required by PROJ-02, established pattern from Phase 2

### ProjectCard Component
- **D-05:** Extract a `ProjectCard` component to `src/components/Projects/ProjectCard.jsx` — co-located with `projects.jsx`, only used on the projects index page
- **D-06:** `ProjectCard` props: `{ src, title, description, route }` — covers all variation between cards
- **D-07:** `projects.jsx` maps over an array of card data objects to render the grid — avoids 7 copies of repeated markup

### Card Visual Design
- **D-08:** Card background: **white (`bg-white`)** with **black text** — matches Bootstrap original and Phase 4 SharedCard implementation; cards pop as bright elements against the dark page background
- **D-09:** Card hover effect: **subtle shadow + scale** — `hover:shadow-lg hover:scale-105 transition-transform duration-150` — gives tactile clickable feel expected for card grids
- **D-10:** Link text color: black, no underline — replicates `.project-card a { color: black; text-decoration: none; }` from `projects.css`
- **D-11:** Card corners: `rounded-lg` — consistent with SharedCard from Phase 4
- **D-12:** Card has `overflow-hidden rounded-lg` so image corners clip at the top

### Card Sizing
- **D-13:** Card image: **`h-[150px] w-full object-cover`** — fixed height, full width, preserves original 150px constraint; `object-cover` handles different aspect ratios cleanly
- **D-14:** Card description: **`h-[80px] overflow-hidden`** — fixed height matches original `style={{height: '80px'}}`; ensures consistent card height across a grid row

### Responsive Grid
- **D-15:** Grid layout: **`grid grid-cols-2 lg:grid-cols-4`** — 2 columns on mobile, 4 columns on desktop; matches Bootstrap `col-sm-6 col-lg-3` original
- **D-16:** Grid wrapper padding: **`px-4 sm:px-8 lg:px-20`** — responsive horizontal padding (smaller on mobile, 5rem equivalent on desktop); replicates the spirit of `margin: 2rem 5rem` with better mobile UX
- **D-17:** Grid vertical padding: `py-8` — replicates the `margin-top: 56px` of `.projects-wrapper` (toolbar height) and `padding-bottom: 2vh` of `.projects-title`
- **D-18:** Grid gap: `gap-4` — breathing room between cards; adjust as needed

### Page Header
- **D-19:** Page title "Personal Projects" uses `text-accent` (#ffc200) — replicates `.projects-title { color: #ffc200 }` from `projects.css`
- **D-20:** Page title centred with `text-center`
- **D-21:** `mt-14` on the outer wrapper to clear the 56px toolbar — replicates `.projects-wrapper { margin-top: 56px }`

### Image Path Fix
- **D-22:** All `src="../X.jpg"` → `src="/X.jpg"` — images live in `public/`, correct Vite reference is absolute root path; established pattern from Phases 2–4

### Claude's Discretion
- Exact gap size between grid cells (gap-4 is the starting point — adjust if cards look too crowded or sparse)
- Whether to add `min-w-0` to grid items to prevent overflow issues
- Card body padding (`p-4` is the default starting point)
- Max card width constraint (original had `maxWidth: '300px'` — may not be needed in a proper grid)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project requirements
- `.planning/REQUIREMENTS.md` — PROJ-01, PROJ-02 define success criteria for this phase
- `.planning/PROJECT.md` — Colour tokens and constraints (dark-only, content-preserving)

### Source files to rewrite
- `src/components/Projects/projects.jsx` — class component; uses Bootstrap CardGroup + 7 inline Cards with images
- `src/components/Projects/projects.css` — CSS to replicate in Tailwind and delete

### New file to create
- `src/components/Projects/ProjectCard.jsx` — new extracted component (image-top card pattern)

### Prior phase context
- `.planning/phases/01-tailwind-setup/01-CONTEXT.md` — Tailwind v4 token definitions, dark-only decision
- `.planning/phases/02-layout-navigation/02-CONTEXT.md` — Link/NavLink pattern, image path fix pattern, CSS deletion pattern
- `.planning/phases/04-about-cv-pages/04-CONTEXT.md` — SharedCard implementation (white card pattern established)

### Routing reference
- `src/components/main.jsx` — all project routes defined here; verify each card's `route` prop matches an existing route

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/index.css` `@theme` block: tokens `--color-bg` (#242424), `--color-surface` (#333134), `--color-accent` (#ffc200), `--color-text` (#ffffff) — use `text-accent` for page title
- React Router `<Link>` already used throughout the codebase (Toolbar, SideDrawer from Phase 2) — same import pattern applies here

### Established Patterns
- Functional component: established in Phases 2–4 — `const Projects = () => {}` pattern
- CSS deletion: delete `projects.css` and its import once Tailwind takes over
- Image paths as `/X.jpg` (absolute from public root): established in Phases 2–4
- Tailwind v4: no `tailwind.config.js`, classes from `@theme` in `src/index.css` via Vite plugin
- Dark-only: no `dark:` prefix needed — site is dark-only

### Integration Points
- `projects.jsx` is routed at `/Projects` in `src/components/main.jsx` — no route changes needed
- Project card routes (`/Projects/TrainGame`, `/Projects/Arbitrage`, etc.) are all already defined in `main.jsx`
- `react-bootstrap` import can be removed from `projects.jsx` once migration is complete — verify no other file in the Projects folder still imports it before removing

### Active Cards (7 total)
| Title | Route | Image |
|-------|-------|-------|
| Train Game | /Projects/TrainGame | /train_numbers.jpg |
| Arbitrage Betting | /Projects/Arbitrage | /arbitrage.jpg |
| Trio | /Projects/TrioGame | /card-games.jpg |
| Pace Calculator | /Projects/PaceCalculator | /runner.jpg |
| 500 Scorer | /Projects/FiveHundred | /500.jpg |
| NBA Ladder | /Projects/NBA-Ladder | /nba.png |
| Top Artists World Map | /Projects/TopArtistsMap | /pin.png |

(3 entries — Alexa Spotify, Noisy Detector, Facebook Analytics — remain commented out; keep them commented)

</code_context>

<specifics>
## Specific Ideas

- The `ProjectCard` component should wrap the entire card in a `<Link to={route}>` so the whole card is clickable, not just the text — consistent with the original `<a href>` wrapping the full card body
- `object-cover` on the card image is important — the original images have different aspect ratios and Bootstrap's `Card.Img` clipped them; `object-cover` in Tailwind achieves the same

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-projects-index*
*Context gathered: 2026-05-15*
