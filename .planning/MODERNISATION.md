# Portfolio Modernisation Plan

## Goals

- Modernise UI/UX across all pages without changing content
- Replace Bootstrap + react-bootstrap with Tailwind CSS
- Fix formatting and layout issues throughout
- Convert class components to functional components + hooks
- Keep existing colour scheme (dark background, golden yellow accent)
- Retain Netlify hosting (no framework change required)

## Colour Scheme (preserve)

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#242424` | Page background |
| `--color-bg-alt` | `#333134` | Card/surface background |
| `--color-accent` | `#ffc200` | Hover states, highlights |
| `--color-text` | `#ffffff` | Primary text |

## Stack (before → after)

| Concern | Before | After |
|---|---|---|
| Styling | Bootstrap 5 + react-bootstrap + per-component CSS | Tailwind CSS with custom theme |
| Components | Mix of class and functional | All functional with hooks |
| Animation | `ityped` + direct DOM manipulation | `useEffect`-based, no direct DOM access |

## Phases

### Phase 1 — Tailwind Setup
- Install and configure Tailwind CSS
- Define custom theme tokens (colours, fonts, spacing) matching existing palette
- Remove `bootstrap`, `react-bootstrap` from dependencies
- Remove all Bootstrap CSS imports
- Verify dev server starts cleanly

### Phase 2 — Layout & Navigation
Files: `Toolbar`, `SideDrawer`, `DrawerToggleButton`, `Backdrop`, `App.jsx`
- Convert `App.jsx` class component to functional component with `useState`
- Rewrite Toolbar and SideDrawer with Tailwind (currently has styling issues)
- Fix mobile nav behaviour

### Phase 3 — Landing Page
Files: `landingpage.jsx`, `landingpage.css`
- Convert class component to functional component
- Replace direct `document.querySelector` DOM manipulation with `useRef` + `useEffect`
- Rewrite layout with Tailwind

### Phase 4 — About & CV
Files: `about.jsx`, `cv.jsx` and their CSS files
- Replace react-bootstrap `Card`/`CardGroup` with Tailwind equivalents
- Fix any layout/formatting issues

### Phase 5 — Projects Index
Files: `projects.jsx`, `projects.css`, `card.jsx`
- Rewrite project listing/routing page with Tailwind
- Clean up shared `card.jsx` component

### Phase 6 — Mini-Projects (7 total)
Each project is self-contained — tackle individually:
- Arbitrage calculator
- Trio game
- Train game
- Pace calculator
- 500 card game
- Noisy detector
- NBA Ladder

### Phase 7 — Remaining Pages
Files: `photos.jsx`, `music.jsx`, `businessBrains.jsx`
- Rewrite with Tailwind
- Fix any layout issues

### Phase 8 — TopArtistsMap (Spotify)
Files: `topArtistsMap.jsx`, `SpotifyAuthProvider.jsx`, `musicBrainzService.js`
- Treat separately due to external API integrations
- Rewrite UI shell with Tailwind, preserve all API/auth logic

## Notes

- The mini-projects (Phase 6) are highest risk for regressions — test each one after migrating
- `react-simple-maps` and all d3 packages were already removed (they had no imports)
- Netlify config (`netlify.toml` or `_redirects`) should be checked to ensure SPA routing redirects are in place after any routing changes
