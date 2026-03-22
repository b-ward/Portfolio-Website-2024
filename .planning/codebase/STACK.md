# STACK

## Overview
This codebase is a client-side portfolio web app with a small serverless backend function.

## Languages & Runtime
- JavaScript/JSX (ES modules) in the frontend (`package.json` has `"type": "module"`).
- Browser runtime for UI (`src/index.jsx`, `src/App.jsx`).
- Node runtime for Netlify Function (`netlify/functions/standings.js`).

## Frontend Frameworks & Libraries
- React 18 (`react`, `react-dom`) for UI rendering.
- React Router (`react-router-dom`) for route-based page switching in `src/components/main.jsx`.
- React Bootstrap + Bootstrap CSS for cards/modals/layout in multiple components (for example `src/components/Projects/projects.jsx`, `src/components/Projects/Trio/trioGame.jsx`).
- `ityped` and `react-mdl` are present in dependencies (usage appears limited/specialized).

## Build, Dev, and Tooling
- Vite 6 as bundler/dev server (`vite`, `@vitejs/plugin-react`).
- Scripts from `package.json`:
  - `npm run dev`
  - `npm run build`
  - `npm run preview`
  - `npm run lint`
- ESLint config in `.eslintrc.cjs` (React + hooks recommended presets).

## Styling Approach
- Global styles in `src/App.css` and `src/index.css`.
- Component-scoped CSS files colocated with components (example: `src/components/Projects/NBA-Ladder/nbaLadder.css`).
- Bootstrap utility/classes mixed with custom CSS.

## Delivery/Hosting
- Designed for Netlify deployment (`README.md`, `netlify/functions/`, `public/_redirects`).
- SPA fallback route configured in `public/_redirects`.

## Notable Stack Observations
- `@vitejs/plugin-react` appears in both dependencies and devDependencies in `package.json`.
- Codebase mixes legacy class components and modern hooks/function components.
- No TypeScript setup detected.
