# Requirements: Portfolio Website 2024 — Modernisation

**Defined:** 2026-05-15
**Core Value:** Every page and interactive tool works correctly and looks polished, with a consistent visual style using the existing dark + gold colour scheme.

## v1 Requirements

### Setup

- [x] **SETUP-01**: Site builds and renders without any Bootstrap or react-bootstrap imports
- [x] **SETUP-02**: Tailwind CSS configured with custom theme tokens — `bg` (#242424), `surface` (#333134), `accent` (#ffc200), `text` (#ffffff)
- [x] **SETUP-03**: Dev server (`npm run dev`) starts cleanly with no CSS import errors
- [x] **SETUP-04**: Production build (`npm run build`) completes without errors

### Navigation

- [ ] **NAV-01**: Toolbar renders correctly on desktop with Tailwind styling (no Bootstrap classes)
- [ ] **NAV-02**: Mobile hamburger menu opens and closes the side drawer correctly
- [ ] **NAV-03**: All navigation links use React Router `<Link>` (no bare `<a href>` causing full page reloads)
- [ ] **NAV-04**: Active route is visually distinguishable in the navigation
- [ ] **NAV-05**: App.jsx converted to functional component using `useState` hook

### Landing Page

- [x] **LAND-01**: Landing page is a functional component (no class component)
- [x] **LAND-02**: Typing animation initialised via `useRef` + `useEffect` (no `document.querySelector`)
- [x] **LAND-03**: Landing page layout renders correctly on desktop and mobile with Tailwind styling

### Content Pages

- [ ] **CONT-01**: About page renders with correct layout using Tailwind (no react-bootstrap Card/CardGroup)
- [ ] **CONT-02**: CV page renders with correct layout using Tailwind
- [ ] **CONT-03**: Shared `card.jsx` component uses Tailwind styling

### Projects Index

- [ ] **PROJ-01**: Projects index page renders all project cards with correct layout
- [ ] **PROJ-02**: Clicking a project card navigates to the correct project route

### Mini-Projects

- [ ] **TOOL-01**: Arbitrage calculator renders and all calculations function correctly
- [ ] **TOOL-02**: Trio game renders and all game interactions (cards, scoring, win/lose states) work correctly
- [ ] **TOOL-03**: Train game renders and functions correctly
- [ ] **TOOL-04**: Pace calculator renders and calculates correctly
- [ ] **TOOL-05**: 500 card game renders and functions correctly
- [ ] **TOOL-06**: Noisy detector renders and functions correctly
- [ ] **TOOL-07**: NBA Ladder renders and fetches standings data via the Netlify function

### Remaining Pages

- [ ] **PAGE-01**: Photos page renders with correct layout using Tailwind
- [ ] **PAGE-02**: Music page renders with correct layout using Tailwind
- [ ] **PAGE-03**: BusinessBrains page renders with correct layout using Tailwind

### Spotify / TopArtistsMap

- [ ] **SPOT-01**: Spotify OAuth auth flow initiates and completes successfully
- [ ] **SPOT-02**: TopArtistsMap renders correctly with Tailwind UI shell, preserving all API and auth logic

### Code Quality

- [x] **QUAL-01**: No direct DOM manipulation (`document.querySelector`, `document.getElementById`) in any React component
- [ ] **QUAL-02**: Router routes use react-router-dom v7 API (no `exact` prop)
- [x] **QUAL-03**: No per-component Bootstrap CSS files imported (all component `.css` files removed or converted to Tailwind)

## v2 Requirements

### Testing

- **TEST-01**: Unit tests for mini-project calculation logic (Arbitrage, PaceCalc, TrainGame)
- **TEST-02**: Integration smoke tests for page routing

### Accessibility

- **A11Y-01**: Navigation has ARIA labels and keyboard focus management
- **A11Y-02**: All interactive elements have visible focus states

### Performance

- **PERF-01**: Lighthouse performance score ≥ 90 on mobile

## Out of Scope

| Feature | Reason |
|---------|--------|
| TypeScript migration | Not requested; no TS files exist in codebase |
| Automated test suite (v1) | Separate concern; not part of modernisation scope |
| Content changes | All existing text, links, and data preserved verbatim |
| API security hardening | Addressed in separate fix/security branch |
| Netlify function changes | Sportradar proxy works correctly, no changes needed |
| Framework change (Next.js, Astro) | React + Vite is sufficient; Netlify compatible |
| New features / pages | Modernisation only — no net-new functionality |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SETUP-01 | Phase 1 | Complete |
| SETUP-02 | Phase 1 | Complete |
| SETUP-03 | Phase 1 | Complete |
| SETUP-04 | Phase 1 | Complete |
| NAV-01 | Phase 2 | Pending |
| NAV-02 | Phase 2 | Pending |
| NAV-03 | Phase 2 | Pending |
| NAV-04 | Phase 2 | Pending |
| NAV-05 | Phase 2 | Pending |
| LAND-01 | Phase 3 | Complete |
| LAND-02 | Phase 3 | Complete |
| LAND-03 | Phase 3 | Complete |
| CONT-01 | Phase 4 | Pending |
| CONT-02 | Phase 4 | Pending |
| CONT-03 | Phase 4 | Pending |
| PROJ-01 | Phase 5 | Pending |
| PROJ-02 | Phase 5 | Pending |
| TOOL-01 | Phase 6 | Pending |
| TOOL-02 | Phase 6 | Pending |
| TOOL-03 | Phase 6 | Pending |
| TOOL-04 | Phase 6 | Pending |
| TOOL-05 | Phase 6 | Pending |
| TOOL-06 | Phase 6 | Pending |
| TOOL-07 | Phase 6 | Pending |
| PAGE-01 | Phase 7 | Pending |
| PAGE-02 | Phase 7 | Pending |
| PAGE-03 | Phase 7 | Pending |
| SPOT-01 | Phase 8 | Pending |
| SPOT-02 | Phase 8 | Pending |
| QUAL-01 | Phase 3 | Complete |
| QUAL-02 | Phase 2 | Pending |
| QUAL-03 | Phase 1 | Complete |

**Coverage:**
- v1 requirements: 32 total
- Mapped to phases: 32
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-15*
*Last updated: 2026-05-15 after initial definition*
