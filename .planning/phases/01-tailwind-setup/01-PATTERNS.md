# Phase 1: Tailwind Setup - Pattern Map

**Mapped:** 2026-05-15
**Files analyzed:** 5
**Analogs found:** 5 / 5 (all files are modifications of existing files — patterns are the files themselves)

---

## File Classification

| File | Role | Data Flow | Change Type | Match Quality |
|------|------|-----------|-------------|---------------|
| `vite.config.js` | config | build-time transform | Add plugin import + plugin call | exact (file is its own analog) |
| `src/index.css` | config / global stylesheet | transform (CSS cascade) | Add directives + @theme; remove two blocks | exact (file is its own analog) |
| `src/index.jsx` | entrypoint | request-response (module graph) | Delete one import line | exact (file is its own analog) |
| `src/App.css` | global stylesheet | transform (CSS cascade) | Delete one rule block | exact (file is its own analog) |
| `package.json` | config | batch (npm lifecycle) | Uninstall two packages | exact (file is its own analog) |

> This phase has no net-new files. Every file already exists; the executor makes surgical edits. There are no external codebase analogs to reference — the files themselves are the patterns.

---

## Pattern Assignments

### `vite.config.js` (config, build-time)

**Current state** (full file, lines 1–22):
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: {
      // Proxy requests starting with /sportradar to the Sportradar API
      // Dev only; this avoids CORS errors during local development.
      '/sportradar': {
        target: 'https://api.sportradar.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/sportradar/, ''),
      },
    },
  },
})
```

**Target state — two changes only:**
1. Add import on line 3: `import tailwindcss from '@tailwindcss/vite'`
2. Expand `plugins` array on line 6 to `[react(), tailwindcss()]`

**Target imports block** (lines 1–3 after edit):
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
```

**Target plugins line** (line 6 after edit):
```javascript
  plugins: [react(), tailwindcss()],
```

**Everything else (server, proxy) is left unchanged.**

---

### `src/index.css` (global stylesheet, CSS cascade)

**Current state** (full file, lines 1–79):
```css
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  /* app background variable used by components to fill the viewport */
  --app-background: #242424;
  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: var(--app-background);

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

html, body, #root {
  height: 100%;
  /* make the document background the same app background to avoid gaps */
  background-color: var(--app-background, #242424);
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  display: flex;
  /* keep layout starting at the top so background fills the viewport */
  align-items: flex-start;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    /* allow light preference to change app background */
    --app-background: #ffffff;
    background-color: var(--app-background);
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}
```

**Changes required (D-03 to D-14):**

| # | Decision | Action | Location in current file |
|---|----------|--------|--------------------------|
| D-03 | Add Tailwind v4 import | Prepend `@import "tailwindcss";` as line 1 | Before existing line 1 |
| D-04 | Add @theme colour tokens | Insert `@theme { ... }` block after the import | After new line 1 |
| D-05 | Remove `--app-background` CSS var | Delete lines 6–7 (`/* app background ... */` + `--app-background: #242424;`) | Current lines 6–7 |
| D-05 | Update `:root` background-color | Change `var(--app-background)` to `#242424` literal | Current line 10 |
| D-10 | Remove light mode media query | Delete lines 66–79 (`@media (prefers-color-scheme: light) { ... }`) | Current lines 66–79 |
| D-11 | Dark-only color-scheme | Change `color-scheme: light dark` to `color-scheme: dark` | Current line 8 |
| D-13 | Update `html, body, #root` background-color | Change `var(--app-background, #242424)` to `#242424` literal | Current line 30 |
| D-14 | Remove Vite default link colours | Delete lines 18–25 (`a { ... }` and `a:hover { ... }`) | Current lines 18–25 |

**Target state (complete file after all edits):**
```css
@import "tailwindcss";

@theme {
  --color-bg: #242424;
  --color-surface: #333134;
  --color-accent: #ffc200;
  --color-text: #ffffff;
}

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html, body, #root {
  height: 100%;
  background-color: #242424;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}
```

**Key constraint:** `@import "tailwindcss"` must be on line 1 — CSS spec requires `@import` before all other rules.

---

### `src/index.jsx` (entrypoint, module graph)

**Current state** (full file, lines 1–8):
```javascript
import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')).render(
    <App />,
);
```

**Change required (D-07):**
- Delete line 4: `import 'bootstrap/dist/css/bootstrap.min.css';`
- Leave a blank line in its place, OR close up the gap — either is acceptable. No replacement import is needed; Tailwind is activated via `src/index.css` which is already in the module graph.

**Target state:**
```javascript
import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App';

createRoot(document.getElementById('root')).render(
    <App />,
);
```

---

### `src/App.css` (global stylesheet, CSS cascade)

**Current state** (full file, lines 1–52):
```css
.App {
  text-align: center;
}

.Layout {
  background-color: none;
  display: flex;
  flex-direction: row;
}
.app-background {
  min-height: 100vh;
  background-color: var(--app-background, #333134);
}

.page-content {
  background-color: var(--app-background, #333134);
  width: 100%;
  min-height: calc(100vh - 72px);
  box-sizing: border-box;
}

/* Bootstrap button colour */
.btn-primary, .btn-primary:hover, .btn-primary:active, .btn-primary:visited {
  background-color: #ffc200 !important;
  border-color: #ffc200 !important;
}

.ball {
  position: absolute;
  border-radius: 100%;
  opacity: 0.7;
  z-index: -1;
}

.App::-webkit-scrollbar {
  display: none;
}

/* .circle { ... } */
```

**Change required (D-08):**
- Delete lines 27–31: the `/* Bootstrap button colour */` comment and the `.btn-primary` rule block (5 lines total — comment on line 27, rule block on lines 28–31).

**Target state of lines 25–35 after edit:**
```css
.page-content {
  background-color: var(--app-background, #333134);
  width: 100%;
  min-height: calc(100vh - 72px);
  box-sizing: border-box;
}

.ball {
  position: absolute;
  border-radius: 100%;
  opacity: 0.7;
  z-index: -1;
}
```

**Note on `var(--app-background, #333134)` in App.css:** The `--app-background` CSS variable is removed from `index.css` by D-05, but these two `App.css` rules use it with a fallback value of `#333134`. After the variable is removed, both rules silently fall back to `#333134`. This is correct behaviour — the fallback matches the intended surface colour. **No change needed to `App.css` beyond deleting the `.btn-primary` block.** These two rules will be replaced with Tailwind utilities in their component migration phase.

---

### `package.json` (config, npm lifecycle)

**Current state — relevant section** (lines 13–19):
```json
"dependencies": {
  "@spotify/web-api-ts-sdk": "^1.2.0",
  "bootstrap": "^5.2.3",
  "ityped": "^1.0.3",
  "react": "^18.2.0",
  "react-bootstrap": "^2.7.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^7.12.0"
},
"devDependencies": {
  "@vitejs/plugin-react": "^4.2.1",
  "eslint": "^9.26.0",
  ...
  "vite": "^6.4.2"
}
```

**Changes required (D-02, D-06):**

| Action | Command | Effect on package.json |
|--------|---------|------------------------|
| Remove Bootstrap packages | `npm uninstall bootstrap react-bootstrap` | Removes `"bootstrap"` and `"react-bootstrap"` from `dependencies` |
| Add Tailwind packages | `npm install -D tailwindcss @tailwindcss/vite` | Adds `"tailwindcss": "^4.3.0"` and `"@tailwindcss/vite": "^4.3.0"` to `devDependencies` |

**Target `dependencies` section after changes:**
```json
"dependencies": {
  "@spotify/web-api-ts-sdk": "^1.2.0",
  "ityped": "^1.0.3",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^7.12.0"
},
```

**Target `devDependencies` section after changes (additions highlighted):**
```json
"devDependencies": {
  "@tailwindcss/vite": "^4.3.0",
  "@vitejs/plugin-react": "^4.2.1",
  "eslint": "^9.26.0",
  "eslint-plugin-react": "^7.34.1",
  "eslint-plugin-react-hooks": "^5.0.0",
  "eslint-plugin-react-refresh": "^0.4.6",
  "tailwindcss": "^4.3.0",
  "vite": "^6.4.2"
}
```

**Execution order matters:** Run `npm uninstall` and `npm install` before editing other files, so the Vite plugin is resolvable when the dev server is started during verification.

---

## Shared Patterns

### CSS Variable Fallback Safety (`--app-background`)

**Finding from codebase grep:** `var(--app-background)` appears only in `src/index.css` and `src/App.css`. No per-component CSS files reference it.

**Impact:** When `--app-background` is removed from `index.css` (D-05), the two remaining usages in `App.css` both carry a fallback value (`#333134`). They silently fall back to the surface colour. This is safe — no visual regression on routes that do not use react-bootstrap components.

**Apply to:** The executor can confidently remove `--app-background` from `index.css` without touching `App.css` beyond the `.btn-primary` deletion.

### Broken react-bootstrap Routes (Accepted Regression)

**Context (from RESEARCH.md):** After `npm uninstall react-bootstrap`, these files throw `Cannot find module 'react-bootstrap'` at runtime when their routes are visited:

| File | Phase to Fix |
|------|-------------|
| `src/components/About/about.jsx` | Phase 4 |
| `src/components/CV/cv.jsx` | Phase 4 |
| `src/components/Projects/projects.jsx` | Phase 5 |
| `src/components/Shared/card.jsx` | Phase 4 |
| `src/components/Projects/Trio/trioGame.jsx` | Phase 6 |
| `src/components/Projects/Trio/trioGame-state.jsx` | Phase 6 |
| `src/components/Projects/Trio/trioHome.jsx` | Phase 6 |
| `src/components/Projects/TrainGame/trainGame.jsx` | Phase 6 |

**This is expected and accepted per D-09.** The Phase 1 verification targets are routes that do NOT import react-bootstrap (e.g., the Landing page and navigation).

---

## No Analog Found

Not applicable — all five files exist and are their own analogs. No net-new files are created in Phase 1.

---

## Metadata

**Analog search scope:** `src/` directory, CSS and JS/JSX files
**Grep checks run:**
- `var(--app-background)` across all `*.css` in `src/` — confirmed usage only in `App.css` and `index.css`
**Pattern extraction date:** 2026-05-15
**Key risk resolved:** A3 from RESEARCH.md assumptions log — `--app-background` is safe to remove from `index.css`; `App.css` fallback values (`#333134`) absorb the change without visual regression.
