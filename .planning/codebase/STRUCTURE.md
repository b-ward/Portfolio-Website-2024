# STRUCTURE

## Repository Layout
- `src/` — frontend source code.
- `public/` — static assets and Netlify redirect config.
- `netlify/functions/` — serverless functions.
- Root config/docs: `package.json`, `vite.config.js`, `.eslintrc.cjs`, `README.md`.

## Frontend Structure (`src/`)
- `src/index.jsx` — React root mounting.
- `src/App.jsx` — app shell and drawer/backdrop orchestration.
- `src/components/main.jsx` — route declarations.
- `src/components/` contains page sections and reusable UI pieces:
  - `About/`, `CV/`, `Landing/`, `Music/`, `Photos/`, `BusinessBrains/`
  - `Projects/` with feature subfolders (`Arbitrage/`, `NBA-Ladder/`, `Trio/`, `TrainGame/`, etc.)
  - shared shell/navigation (`Toolbar/`, `SideDrawer/`, `Backdrop/`, `Shared/`)

## Naming and Organization Patterns
- Folder names are mostly PascalCase or title-like.
- File names are mostly lowercase with `.jsx` and paired `.css` files.
- Several features keep helper logic adjacent to view files (for example `arbitrageCalcutations.jsx`, `trainGameCalculations.jsx`).

## Static and Media Assets
- Dedicated media under `public/CV/` and `public/Trio/` (Audio, Images, Instruction_images).
- Additional assets under `src/assets/`.

## Serverless Structure
- Netlify function currently includes `standings.js` for secure Sportradar proxying.

## Route Surface (from `src/components/main.jsx`)
- Pages include `/`, `/About`, `/CV`, `/Projects`, `/Photos`, `/Music`, `/BusinessBrains`.
- Project tool routes include `/Projects/TrainGame`, `/Projects/Arbitrage`, `/Projects/TrioGame`, `/Projects/PaceCalculator`, `/Projects/FiveHundred`, `/Projects/NBA-Ladder`, etc.

## Structural Notes
- No dedicated `tests/` or `__tests__/` hierarchy detected.
- No monorepo tooling detected; single package app structure.
