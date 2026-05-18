# Portfolio Website 2024 — Claude Code Guide

## Project

Portfolio website modernisation — replacing Bootstrap with Tailwind CSS, converting class components to functional components, and fixing layout/navigation issues throughout. Content is preserved; only styling and component patterns change.

See `.planning/PROJECT.md` for full context and `.planning/ROADMAP.md` for the 8-phase execution plan.

## GSD Workflow

This project uses the GSD (Get Shit Done) planning framework.

**Current state:** `.planning/STATE.md`
**Roadmap:** `.planning/ROADMAP.md`
**Requirements:** `.planning/REQUIREMENTS.md`

### Typical flow per phase

```
/gsd-discuss-phase N    # gather context and clarify approach (or /gsd-ui-phase N for UI phases)
/gsd-plan-phase N       # create PLAN.md with task breakdown
/gsd-execute-phase N    # execute all plans with atomic commits
/gsd-verify-work N      # verify phase goal was achieved
```

### Check progress

```
/gsd-progress
```

## Stack

- React 18 + Vite 6
- Tailwind CSS (being added — Phase 1)
- react-router-dom 7
- Netlify hosting (SPA, `public/_redirects` for fallback routing)
- Netlify Function at `netlify/functions/standings.js` (Sportradar proxy — do not modify)

## Key Constraints

- **Preserve all content** — no text, links, or data changes
- **Colour tokens** — `#242424` bg, `#333134` surface, `#ffc200` accent, `#ffffff` text
- **No framework change** — React + Vite only, no Astro/Next.js
- **Spotify auth logic in TopArtistsMap** — preserve all API/OAuth logic; only rewrite UI shell

## Development Commands

```bash
npm run dev       # start dev server at http://127.0.0.1:5173
npm run build     # production build
npm run preview   # preview production build
npm run lint      # ESLint
```

## Watch Out For

- `trioGame.jsx` is 1000+ lines with complex mutable state — test thoroughly after migration (Phase 6)
- `SpotifyAuthProvider.jsx` uses OAuth redirect — test auth flow end-to-end in Phase 8
- NBA Ladder requires the Netlify function to be running locally (`netlify dev`) for full testing
