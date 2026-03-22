# CONVENTIONS

## React Component Style
- Mixed paradigm:
  - Class components (`src/App.jsx`, `src/components/Projects/projects.jsx`, large `Trio` modules).
  - Functional components + hooks (`src/components/Projects/NBA-Ladder/NBA-Ladder.jsx`, `src/components/Toolbar/Toolbar.jsx`).

## File Pairing and Styling
- Common pattern is one component file + one CSS file in same folder.
- CSS class naming is descriptive and feature-specific (for example `nba-table`, `side-drawer-picture`).
- Inline styles are used in several components (example cards in `src/components/Projects/projects.jsx`).

## Naming Conventions
- Variables/functions are primarily camelCase.
- Component folders use capitalized names; filenames are mostly lowercase.
- Some typo/inconsistency appears (`arbitrageCalcutations.jsx` spelling).

## Routing & Navigation Patterns
- Centralized route table in `src/components/main.jsx`.
- Navigation often uses `<a href>` links instead of React Router `<Link>` components (`Toolbar`, `SideDrawer`, `projects.jsx`).

## Error Handling Patterns
- Newer async code uses try/catch with user-friendly errors (`NBA-Ladder.jsx`, `netlify/functions/standings.js`).
- Older logic-heavy modules have less structured error handling and heavy imperative flow (`arbitrageCalcutations.jsx`, `trioGame.jsx`).

## Linting and Static Analysis
- ESLint configured via `.eslintrc.cjs` with React + hooks recommended rules.
- `npm run lint` script is present in `package.json`.

## Code Organization Characteristics
- Significant business logic can live directly in UI component files.
- Some modules are very large and state-heavy (notably `src/components/Projects/Trio/trioGame.jsx`).
- Comments capture intent and TODOs, but cleanup/refactor tasks remain in-place.
