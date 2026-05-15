# Phase 2: Layout & Navigation - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Convert App.jsx from class component to functional component, wire up the app shell (Toolbar, SideDrawer, Backdrop, DrawerToggleButton) with Tailwind CSS replacing all component CSS files, replace bare `<a href>` links in SideDrawer with React Router `<NavLink>`, and ensure the active route is visually distinct. The BrowserRouter must move to App.jsx level so nav links are inside the router context.

</domain>

<decisions>
## Implementation Decisions

### App.jsx Conversion
- **D-01:** Convert `App` from a class component to a functional component using `useState(false)` for `sideDrawerOpen` state
- **D-02:** Move `<BrowserRouter>` from `main.jsx` up to `App.jsx` (wrapping the entire layout) so that `<Link>`/`<NavLink>` in Toolbar and SideDrawer are within router context — this is a technical necessity
- **D-03:** The existing handler logic (`drawerToggleClickHandler`, `backdropClickHandler`) becomes plain functions inside the functional component

### Toolbar Layout
- **D-04:** Toolbar stays **hamburger-only** — no logo, no inline nav links
- **D-05:** Hamburger button (DrawerToggleButton) is **always visible** on all screen widths — no responsive hide/show
- **D-06:** Toolbar background stays transparent (as per existing CSS) — do not add a solid background

### Navigation Links
- **D-07:** Replace all bare `<a href>` links in SideDrawer with `<NavLink>` from react-router-dom v7
- **D-08:** Remove the `exact` prop from all `<Route>` elements in `main.jsx` — it is not valid in react-router-dom v7 (QUAL-02)
- **D-09:** Pass a `closeDrawer` callback from App.jsx down to SideDrawer so each NavLink click also closes the drawer (close-on-navigate UX)

### Active Link Indicator
- **D-10:** Use `<NavLink>` `className` prop as a function: `({ isActive }) => isActive ? 'text-accent ...' : 'text-white ...'`
- **D-11:** Active route: **gold accent text** (`text-accent` = `#ffc200`) — matches existing hover colour, consistent with the design system
- **D-12:** Scope: active indicator in the **SideDrawer only** for Phase 2 (Toolbar is hamburger-only, so no active state needed there)

### Drawer Close Behavior
- **D-13:** Drawer closes on nav link click (close-on-navigate) via the `closeDrawer` prop threaded from App → SideDrawer
- **D-14:** Backdrop click continues to close the drawer (existing behavior preserved)

### SideDrawer Profile Section
- **D-15:** Keep the profile section at the top of the drawer (photo + "Brendon Ward" name)
- **D-16:** Fix the image path from `../BrendonWard.png` → `/BrendonWard.png` (image is in `public/`, correct Vite reference is the absolute root path)
- **D-17:** The image is a transparent-background PNG that already appears circular — do NOT apply `rounded-full` clipping; render naturally
- **D-18:** Improve layout: **center the photo and name horizontally**, add proper **padding/spacing** around the profile block

### Component CSS File Cleanup
- **D-19:** Delete all 5 component CSS files after their component is migrated to Tailwind:
  - `src/components/Toolbar/Toolbar.css`
  - `src/components/SideDrawer/SideDrawer.css`
  - `src/components/SideDrawer/DrawerToggleButton.css`
  - `src/components/Backdrop/Backdrop.css`
  - `src/App.css`

### Claude's Discretion
- Exact Tailwind utility classes for the toolbar height, padding, z-index (use values matching the existing CSS: 56px height, z-1 for toolbar, z-100 for backdrop, z-200 for drawer)
- Exact slide-in animation for the drawer (replicate existing translateX transition using Tailwind's `transition-transform duration-300 ease-out` or a custom class if needed)
- Hamburger button three-line visual (replicate 30x24px button with 3 white 30x3px lines)
- Tasteful spacing improvements to the drawer profile section beyond the specified changes

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project requirements
- `.planning/REQUIREMENTS.md` — NAV-01 through NAV-05 and QUAL-02 define success criteria for this phase
- `.planning/PROJECT.md` — Colour tokens and constraints (dark-only, Netlify SPA)

### Phase 1 context (carry-forward decisions)
- `.planning/phases/01-tailwind-setup/01-CONTEXT.md` — Tailwind v4 token definitions, dark-only decision, CSS-file cleanup approach

### Existing source files to rewrite
- `src/App.jsx` — Class component → functional; add BrowserRouter wrapper; thread closeDrawer to SideDrawer
- `src/components/Toolbar/Toolbar.jsx` — Tailwind styling; keep hamburger-only layout
- `src/components/SideDrawer/SideDrawer.jsx` — Replace `<a href>` with `<NavLink>`; add closeDrawer prop; center profile section
- `src/components/SideDrawer/DrawerToggleButton.jsx` — Tailwind styling
- `src/components/Backdrop/Backdrop.jsx` — Tailwind styling
- `src/components/main.jsx` — Remove BrowserRouter wrapper; remove `exact` prop from all routes

### Existing CSS files to delete after migration
- `src/components/Toolbar/Toolbar.css`
- `src/components/SideDrawer/SideDrawer.css`
- `src/components/SideDrawer/DrawerToggleButton.css`
- `src/components/Backdrop/Backdrop.css`
- `src/App.css`

### Image asset
- `public/BrendonWard.png` — Profile photo (transparent circular PNG); reference as `/BrendonWard.png` in JSX

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/index.css` `@theme` block: tokens `--color-bg`, `--color-surface`, `--color-accent`, `--color-text` defined in Phase 1 — use these throughout all Tailwind classes
- `BrowserRouter` already in `main.jsx` — move it up, don't add a second one

### Established Patterns
- All components are already functional components except `App.jsx` — the conversion pattern is already established in the codebase
- Tailwind v4: no `tailwind.config.js`, tokens via `@theme` in `index.css`, classes generated via Vite plugin
- Dark-only: use `bg-bg`, `bg-surface`, `text-text`, `text-accent`, no `dark:` prefix needed

### Integration Points
- `App.jsx` is the layout root — all shell components (Toolbar, SideDrawer, Backdrop) mount here
- `main.jsx` (renamed to the `<Main>` component) contains the route definitions — BrowserRouter moves out of here
- SideDrawer needs a new `closeDrawer` prop from App.jsx — must be passed through the component tree

### Key Measurements from Existing CSS (to replicate in Tailwind)
- Toolbar height: 56px, fixed, z-index: 1, transparent background
- Drawer: width 70%, max 400px, fixed left-0 top-0, z-index: 200, `translateX(-100%)` closed → `translateX(0)` open, 0.3s ease-out transition
- Backdrop: fixed full-screen, z-index: 100, `rgba(0,0,0,0.3)` background
- Hamburger button: 30×24px, 3 lines each 30×3px white, no border/background

</code_context>

<specifics>
## Specific Ideas

- The drawer slide animation currently uses CSS `transform: translateX(-100%)` toggled by a class — this can be replicated in Tailwind using `-translate-x-full` and `translate-x-0` with `transition-transform duration-300 ease-out`
- Profile photo is already circular due to transparent PNG background — no CSS clipping needed, just good centering and padding

</specifics>

<deferred>
## Deferred Ideas

- Desktop inline nav in the Toolbar (logo + nav links on large screens) — user chose hamburger-only for Phase 2; can be added later if desired
- Keyboard focus management for the drawer (A11Y-01 in v2 requirements) — out of scope for Phase 2
- Hamburger animation (3 lines morphing to X on open) — noted but not requested

</deferred>

---

*Phase: 02-layout-navigation*
*Context gathered: 2026-05-15*
