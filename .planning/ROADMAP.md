# Roadmap: Portfolio Website 2024 — Modernisation

## Overview

This milestone modernises an existing React portfolio site by replacing Bootstrap with Tailwind CSS, converting legacy class components to functional components with hooks, and fixing layout and navigation issues throughout. The work proceeds page-by-page from the shared shell outward: setup and infrastructure first, then navigation, then each page group in dependency order, finishing with the highest-risk Spotify integration last. All content is preserved; only styling and component patterns change.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Tailwind Setup** - Install Tailwind, define theme tokens, and remove all Bootstrap dependencies (completed 2026-05-15)
- [x] **Phase 2: Layout & Navigation** - Rewrite the app shell and navigation components with Tailwind (completed 2026-05-15)
- [x] **Phase 3: Landing Page** - Convert landing page class component to functional and rewrite with Tailwind (completed 2026-05-15)
- [x] **Phase 4: About & CV Pages** - Replace react-bootstrap Card/CardGroup with Tailwind equivalents (completed 2026-05-15)
- [x] **Phase 5: Projects Index** - Rewrite project listing page and shared card component with Tailwind (completed 2026-05-15)
- [x] **Phase 6: Mini-Projects** - Migrate all 7 interactive tools to Tailwind styling (completed 2026-05-18)
- [x] **Phase 7: Remaining Pages** - Migrate Photos, Music, and BusinessBrains pages to Tailwind (completed 2026-05-18)
- [ ] **Phase 8: TopArtistsMap / Spotify** - Rewrite Spotify integration UI shell with Tailwind, preserving all auth/API logic

## Phase Details

### Phase 1: Tailwind Setup
**Goal**: Tailwind CSS is installed and configured with the project colour tokens, and Bootstrap is fully removed from the dependency tree.
**Depends on**: Nothing (first phase)
**Requirements**: SETUP-01, SETUP-02, SETUP-03, SETUP-04, QUAL-03
**Success Criteria** (what must be TRUE):
  1. `npm install` completes with no Bootstrap or react-bootstrap packages in node_modules
  2. `tailwind.config.js` defines `bg` (#242424), `surface` (#333134), `accent` (#ffc200), and `text` (#ffffff) as theme tokens
  3. `npm run dev` starts and serves the app with no CSS import errors in the terminal or browser console
  4. `npm run build` produces a production bundle without errors
**Plans**: 2 plans
Plans:
- [x] 01-01-PLAN.md — Uninstall Bootstrap, install Tailwind v4 packages (npm only)
- [x] 01-02-PLAN.md — Register Vite plugin, rewrite index.css with @theme tokens, remove Bootstrap imports from index.jsx and App.css; verify build
**UI hint**: yes

### Phase 2: Layout & Navigation
**Goal**: The app shell (App.jsx, Toolbar, SideDrawer) is fully converted to functional components with Tailwind styling, and all navigation links use React Router.
**Depends on**: Phase 1
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04, NAV-05, QUAL-02
**Success Criteria** (what must be TRUE):
  1. The toolbar renders correctly on desktop with gold accent colours and no Bootstrap classes present in the DOM
  2. The hamburger menu opens and closes the side drawer on a mobile-width viewport
  3. Navigating between pages via the nav links does not trigger a full page reload
  4. The active route link is visually distinct (e.g., accent colour or underline) in the navigation
**Plans**: TBD
**UI hint**: yes

### Phase 3: Landing Page
**Goal**: The landing page is a functional React component that uses refs for DOM access and renders correctly with Tailwind styling.
**Depends on**: Phase 2
**Requirements**: LAND-01, LAND-02, LAND-03, QUAL-01
**Success Criteria** (what must be TRUE):
  1. The landing page typing animation plays correctly on load with no console errors
  2. No `document.querySelector` or `document.getElementById` calls exist anywhere in the React component tree
  3. The landing page layout is correct on both desktop and mobile viewport widths
**Plans**: 1 plan
Plans:
- [x] 03-01-PLAN.md — Rewrite landingpage.jsx as functional component with Tailwind; delete landingpage.css
**UI hint**: yes

### Phase 4: About & CV Pages
**Goal**: The About and CV pages render with correct Tailwind layouts, replacing all react-bootstrap Card and CardGroup usage.
**Depends on**: Phase 3
**Requirements**: CONT-01, CONT-02, CONT-03
**Success Criteria** (what must be TRUE):
  1. The About page displays all content sections with correct card-style layout using Tailwind (no react-bootstrap imports)
  2. The CV page renders all sections with correct layout using Tailwind
  3. The shared `card.jsx` component uses Tailwind classes exclusively and renders correctly wherever it is used
**Plans**: 3 plans
Plans:
- [x] 04-01-PLAN.md — Rewrite card.jsx as functional Tailwind component; delete card.css
- [x] 04-02-PLAN.md — Rewrite about.jsx as functional Tailwind component; delete about.css
- [x] 04-03-PLAN.md — Rewrite cv.jsx as functional Tailwind component; delete cv.css
**UI hint**: yes

### Phase 5: Projects Index
**Goal**: The projects index page and shared card component are fully migrated to Tailwind, with all project cards routing correctly.
**Depends on**: Phase 4
**Requirements**: PROJ-01, PROJ-02
**Success Criteria** (what must be TRUE):
  1. The projects index page displays all project cards in a correct grid or list layout using Tailwind
  2. Clicking any project card navigates to the correct project route without a full page reload
**Plans**: 1 plan
Plans:
- [x] 05-01-PLAN.md — Create ProjectCard.jsx, rewrite projects.jsx as functional Tailwind component, delete projects.css
**UI hint**: yes

### Phase 6: Mini-Projects
**Goal**: All 7 interactive mini-project tools are migrated to Tailwind styling with all game and calculation logic verified as working.
**Depends on**: Phase 5
**Requirements**: TOOL-01, TOOL-02, TOOL-03, TOOL-04, TOOL-05, TOOL-06, TOOL-07
**Success Criteria** (what must be TRUE):
  1. The Arbitrage calculator renders with Tailwind styling and produces correct odds calculations
  2. The Trio game renders and all card interactions, scoring, and win/lose states function correctly end-to-end
  3. The Train game, Pace calculator, 500 card game, and Noisy detector each render and function correctly after migration
  4. The NBA Ladder renders standings data fetched from the Netlify serverless function
**Plans**: 9 plans
Plans:
- [ ] 06-01-PLAN.md — Create shared Modal.jsx component (Wave 1 foundation)
- [ ] 06-02-PLAN.md — TrainGame: class→functional, Bootstrap→shared Modal, delete trainGame.css
- [ ] 06-03-PLAN.md — TrioHome: class→functional, Bootstrap→shared Modal, delete trioHome.css
- [ ] 06-04-PLAN.md — NoisyDetector: class→functional stub, delete dead code, delete noisyDetector.css
- [ ] 06-05-PLAN.md — Arbitrage: replace all arb-* CSS classes with Tailwind inline, delete arbitrage.css
- [ ] 06-06-PLAN.md — NBALadder: replace nba-* CSS classes with dark Tailwind, delete nbaLadder.css
- [ ] 06-07-PLAN.md — PaceCalculator: replace inline styles object with Tailwind classes
- [ ] 06-08-PLAN.md — 500 Scorer: delete StyleTag, delete COLORS, replace inline styles with Tailwind
- [ ] 06-09-PLAN.md — TrioGame: Bootstrap removal only (stay class component), Carousel→step indicator, trim trioGame.css
**UI hint**: yes

### Phase 7: Remaining Pages
**Goal**: The Photos, Music, and BusinessBrains pages are migrated to Tailwind with correct layouts and no Bootstrap remnants.
**Depends on**: Phase 6
**Requirements**: PAGE-01, PAGE-02, PAGE-03
**Success Criteria** (what must be TRUE):
  1. The Photos page renders its content with correct Tailwind layout
  2. The Music page renders its content with correct Tailwind layout
  3. The BusinessBrains page renders its content with correct Tailwind layout
**Plans**: 3 plans
Plans:
- [x] 07-01-PLAN.md — Photos: class→functional, aspect-video iframes, delete photos.css
- [x] 07-02-PLAN.md — Music: class→functional, 80%-wide wrapper, delete music.css
- [x] 07-03-PLAN.md — BusinessBrains: class→functional, 80%-wide wrapper, delete businessBrains.css
**UI hint**: yes

### Phase 8: TopArtistsMap / Spotify
**Goal**: The TopArtistsMap UI shell is rewritten with Tailwind while the Spotify OAuth flow and MusicBrainz API integration remain fully intact.
**Depends on**: Phase 7
**Requirements**: SPOT-01, SPOT-02
**Success Criteria** (what must be TRUE):
  1. The Spotify OAuth login flow initiates and completes successfully, returning the user to the app with a valid session
  2. The TopArtistsMap renders correctly with Tailwind styling after authentication, displaying the expected map and artist data
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Tailwind Setup | 2/2 | Complete   | 2026-05-15 |
| 2. Layout & Navigation | 4/4 | Complete | 2026-05-15 |
| 3. Landing Page | 1/1 | Complete | 2026-05-15 |
| 4. About & CV Pages | 3/3 | Complete | 2026-05-15 |
| 5. Projects Index | 1/1 | Complete | 2026-05-15 |
| 6. Mini-Projects | 9/9 | Complete | 2026-05-18 |
| 7. Remaining Pages | 3/3 | Complete | 2026-05-18 |
| 8. TopArtistsMap / Spotify | 0/? | Not started | - |
