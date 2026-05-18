# Portfolio Website 2024 — Modernisation

## What This Is

A personal portfolio website built with React 18 + Vite, hosted on Netlify. It showcases professional background (About, CV), a collection of interactive mini-projects (Arbitrage calculator, Trio game, Train game, Pace calculator, 500 card game, Noisy detector, NBA Ladder), a Spotify-powered TopArtistsMap, and lifestyle pages (Photos, Music, BusinessBrains). This milestone modernises the UI/UX across all pages by replacing Bootstrap with Tailwind CSS, converting legacy class components to functional components with hooks, and fixing layout and navigation issues throughout — without changing any content.

## Core Value

Every page and interactive tool works correctly and looks polished, with a consistent visual style using the existing dark + gold colour scheme.

## Requirements

### Validated

- ✓ SPA routing with React Router across 14 routes — existing
- ✓ Responsive navigation with Toolbar and hamburger side drawer — existing
- ✓ Interactive mini-projects: Arbitrage, Trio, Train, PaceCalc, 500, Noisy, NBA Ladder — existing
- ✓ Spotify TopArtistsMap with OAuth auth flow — existing
- ✓ NBA standings via Netlify serverless function (Sportradar proxy) — existing
- ✓ SPA fallback routing via `public/_redirects` on Netlify — existing
- ✓ About, CV, Photos, Music, BusinessBrains content pages — existing

### Validated

- ✓ All Bootstrap / react-bootstrap dependencies replaced with Tailwind CSS — validated in Phase 1
- ✓ Colour scheme (bg `#242424`, accent `#ffc200`) defined as Tailwind theme tokens (`@theme` block in `src/index.css`) — validated in Phase 1
- ✓ Landing page converted from class component — useRef/useEffect replace DOM manipulation, Tailwind replaces CSS file — validated in Phase 3
- ✓ No `document.querySelector` or `document.getElementById` anywhere in the React component tree (QUAL-01) — validated in Phase 3

### Active
- [ ] App.jsx converted from class component to functional component
- [ ] All internal links use React Router `<Link>` (no bare `<a href>` causing full reloads)
- [ ] Router routes updated to react-router-dom v7 API (remove `exact` prop)
- [ ] All pages and tools render correctly with Tailwind styling
- [ ] Navigation (Toolbar + SideDrawer) works correctly on desktop and mobile

### Out of Scope

- TypeScript migration — not requested, no TS files exist
- Automated test suite — separate concern, not in modernisation scope
- Content changes — preserving all existing content verbatim
- API security hardening — addressed separately in fix/security branch
- Backend / Netlify function changes — Sportradar proxy stays as-is
- Framework change (Astro, Next.js) — React + Vite is sufficient for Netlify

## Context

Brownfield modernisation of an existing portfolio site. The codebase has working features that must be preserved:
- React 18.2, Vite 6, react-router-dom 7 already in use
- Bootstrap 5 + react-bootstrap used throughout — to be fully replaced by Tailwind
- Per-component CSS files exist alongside every component — these will be deleted as Tailwind takes over
- `ityped` library used for landing page typing animation (keep the library, fix the DOM access pattern)
- Spotify SDK (`@spotify/web-api-ts-sdk`) and MusicBrainz API used in TopArtistsMap — preserve all auth/API logic
- Netlify function at `netlify/functions/standings.js` serves NBA data — no changes needed

## Constraints

- **Hosting**: Netlify — no SSR, must remain a SPA with `_redirects` fallback
- **Content**: All existing text, links, and functionality must be preserved exactly
- **Colour scheme**: `#242424` background, `#333134` surface, `#ffc200` accent, `#ffffff` text — must be preserved
- **Dependencies**: Bootstrap and react-bootstrap removed; Tailwind CSS added
- **Regression risk**: Mini-projects have complex game state (Trio is 1000+ lines) — test each after migration

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Replace Bootstrap with Tailwind CSS | Eliminates `!important` overrides, gives full design control, more modern DX | Done — Tailwind v4 installed, @theme tokens defined, Bootstrap removed (Phase 1) |
| Keep React + Vite (no Astro/Next.js) | Netlify compatible, minimal change, preserves existing routing logic | Confirmed — build and dev server clean after Phase 1 |
| Content-preserving rewrite (no content changes) | Reduces risk, keeps focus on visual/code quality | — Pending |
| Phase TopArtistsMap last | Spotify OAuth + MusicBrainz integration makes it highest regression risk | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-15 after Phase 3 completion*
