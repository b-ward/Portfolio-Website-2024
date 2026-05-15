# Phase 01 Deferred Items

## ESLint lint gate — 250 pre-existing errors in src/

**Deferred at:** Plan 01-02, Task 3
**Status:** Out of scope — pre-existing issues

**Description:**
The lint gate (`npm run lint`) cannot pass because the codebase has 250 pre-existing lint
errors across legacy component files. These errors were always present but were never
surfaced: the project shipped with ESLint v9 but an old-style `.eslintrc.cjs` config that
ESLint v9 cannot load — so the lint script was silently erroring with "cannot find config"
rather than reporting actual code errors.

Plan 01-02 created `eslint.config.js` (ESLint v9 flat config) to replace `.eslintrc.cjs`,
which now correctly loads and surfaces the pre-existing errors.

**Categories of deferred errors:**
- `no-unused-vars`: `import React from 'react'` in every file (pre-React 17 pattern) — ~20 files
- `react/no-unescaped-entities`: unescaped apostrophes in about.jsx, landingpage.jsx
- `react/no-direct-mutation-state`: trioGame.jsx class component mutations — ~150 errors
- `react/jsx-key`: missing key props in array renders in cv.jsx
- `react/prop-types`: missing prop validation in Backdrop, SideDrawer, Toolbar
- `react/no-unknown-property`: `frameborder` / `allowtransparency` HTML attrs in music.jsx, businessBrains.jsx
- `netlify/functions/standings.js`: `process` and `event`/`context` not defined (Node globals)

**Resolution path:**
- React import errors: resolved as each component is rewritten in Phases 2–7
- trioGame.jsx: resolved in Phase 6 (class component conversion)
- netlify function: fix by adding `node` to globals for `netlify/` files, or scoping lint to `src/` only
- All others: resolved as each component is touched in its migration phase

**Recommendation for Phase 2:**
Before starting Phase 2, update the lint script to scope to `src/` only
(`eslint src/ --ext js,jsx ...`) or add Node globals for `netlify/` in eslint.config.js.
This prevents the lint gate from blocking future plan verifications.
