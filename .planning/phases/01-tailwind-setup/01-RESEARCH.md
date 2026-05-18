# Phase 1: Tailwind Setup - Research

**Researched:** 2026-05-15
**Domain:** Tailwind CSS v4, Vite plugin integration, Bootstrap removal
**Confidence:** HIGH

---

## Summary

Phase 1 is a pure infrastructure swap: install Tailwind CSS v4 via its Vite plugin, define the project colour tokens in a CSS-first `@theme` block, and strip Bootstrap from the dependency tree. No component code changes. No component CSS files are touched.

Tailwind v4 (released January 2025, current version 4.3.0 as of 2026-05-14) uses a fundamentally different integration model from v3. The `tailwind.config.js` file is gone. Configuration lives in CSS. The `@tailwindcss/vite` plugin replaces the PostCSS pipeline. One line — `@import "tailwindcss"` — replaces the old three-directive `@tailwind base/components/utilities` approach. Automatic content scanning requires no configuration. This is the correct, blessed path for new Vite projects.

The success criteria in REQUIREMENTS.md mention `tailwind.config.js` (a v3 artefact). This is a documentation inconsistency — v4 has no JS config file by design. The planner must use the v4 CSS-first approach and treat the `tailwind.config.js` mention in success criteria as incorrect.

Bootstrap removal is a clean surgical operation: one `npm uninstall`, one `import` line deleted from `src/index.jsx`, one CSS block deleted from `src/App.css`. The six component files that import from `react-bootstrap` (`Modal`, `Button`, `Carousel`, `Card`, `CardGroup`, `Row`, `Col`) are NOT touched in this phase — they remain broken visually until their respective migration phases (Phase 2–8).

**Primary recommendation:** Install `tailwindcss @tailwindcss/vite` as devDependencies, add the plugin to `vite.config.js` (after the React plugin), replace `src/index.css` content to open with `@import "tailwindcss"` followed by an `@theme` block, uninstall bootstrap and react-bootstrap, delete the Bootstrap import line and the `.btn-primary` override block.

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Use **Tailwind CSS v4** (latest stable, Jan 2025)
- **D-02:** Integrate via `@tailwindcss/vite` Vite plugin — no PostCSS pipeline, no `tailwind.config.js`
- **D-03:** Theme tokens defined using the **CSS-first `@theme` block** in a CSS file (v4 approach), not a JS config file
- **D-04:** Define the following tokens in the `@theme` block:
  - `--color-bg: #242424` (page background)
  - `--color-surface: #333134` (card/panel background)
  - `--color-accent: #ffc200` (hover states, highlights, buttons)
  - `--color-text: #ffffff` (primary text)
- **D-05:** These replace the existing `--app-background` CSS variable in `index.css`
- **D-06:** Remove `bootstrap` and `react-bootstrap` from `package.json` dependencies
- **D-07:** Remove the single Bootstrap CSS import from `src/index.jsx` (line 4)
- **D-08:** Remove the `.btn-primary` Bootstrap override block from `src/App.css`
- **D-09:** Per-component CSS files (19 total) are **left untouched** — cleaned up in later phases
- **D-10:** Remove the `@media (prefers-color-scheme: light)` block from `src/index.css`
- **D-11:** Enforce the dark `#242424` background globally; no Tailwind `dark:` prefix needed
- **D-12:** Retain the font stack, line-height, and font-rendering settings from `index.css`
- **D-13:** Retain the `html, body, #root { height: 100% }` and `body { margin: 0 }` resets
- **D-14:** Remove the Vite default link colours (`#646cff`) — links styled per-component with Tailwind later

### Claude's Discretion
- Exact `@theme` block placement (in `index.css` vs a separate `theme.css`)
- Tailwind `content` paths configuration (standard `./src/**/*.{js,jsx}`)
- Whether to add `@layer base` resets or keep the existing manual resets

### Deferred Ideas (OUT OF SCOPE)
- Converting component CSS files to Tailwind — Phase 2 onward
- Adding Tailwind `dark:` variants — Not needed (dark-only decision)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SETUP-01 | Site builds and renders without any Bootstrap or react-bootstrap imports | Covered: exact uninstall steps, import removal locations documented |
| SETUP-02 | Tailwind CSS configured with custom theme tokens — bg, surface, accent, text | Covered: `@theme` block syntax verified from official docs |
| SETUP-03 | Dev server (`npm run dev`) starts cleanly with no CSS import errors | Covered: `@import "tailwindcss"` replaces `@tailwind` directives; no PostCSS config needed |
| SETUP-04 | Production build (`npm run build`) completes without errors | Covered: `@tailwindcss/vite` handles Vite build; no additional config |
| QUAL-03 | No per-component Bootstrap CSS files imported (all component `.css` files removed or converted to Tailwind) | NOTE: QUAL-03 is the end-state goal for ALL phases — Phase 1 does NOT fully satisfy this requirement. Phase 1 only removes the Bootstrap package and its single global CSS import. The 19 per-component CSS files (which are not Bootstrap files — they are custom CSS files) are left untouched. QUAL-03 is only green after all 8 phases complete. |
</phase_requirements>

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| CSS framework installation | Build tooling (Vite) | — | `@tailwindcss/vite` integrates at build time |
| Theme token definition | CSS (index.css) | — | v4 `@theme` is a CSS-first concern |
| Bootstrap removal | package.json + source files | — | Package uninstall + import deletions |
| Global CSS resets | CSS (index.css) | — | Retained existing body/html resets |
| Colour variables | CSS `@theme` block | — | Replaces existing `--app-background` CSS var |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tailwindcss | 4.3.0 | CSS utility framework | Latest stable; CSS-first, no config file [VERIFIED: npm registry 2026-05-14] |
| @tailwindcss/vite | 4.3.0 | Vite plugin for Tailwind v4 | Official integration; replaces PostCSS pipeline [VERIFIED: npm registry 2026-05-14] |

### Packages Being Removed
| Library | Current Version | Removal Reason |
|---------|----------------|----------------|
| bootstrap | ^5.2.3 | Replaced by Tailwind CSS |
| react-bootstrap | ^2.7.0 | Component replacements deferred to Phases 2–8 |

### Installation

```bash
npm install -D tailwindcss @tailwindcss/vite
npm uninstall bootstrap react-bootstrap
```

**Version verification:** tailwindcss and @tailwindcss/vite are both 4.3.0 as of 2026-05-14. [VERIFIED: npm registry]

---

## Architecture Patterns

### System Architecture Diagram

```
src/index.jsx
  └── imports src/index.css
        └── @import "tailwindcss"           ← activates Tailwind
              ├── @theme { ... }             ← project colour tokens
              └── existing resets retained

vite.config.js
  └── plugins: [react(), tailwindcss()]     ← Vite plugin processes Tailwind at build time

Build output:
  node_modules/tailwindcss scans src/**/*.{js,jsx} automatically (auto-detection)
  → generates CSS only for used utility classes
  → injects into bundle
```

### Recommended Project Structure (Phase 1 changes only)

```
src/
├── index.css          # MODIFIED: @import "tailwindcss" + @theme block added;
│                      #           light mode media query removed; link colours removed
├── index.jsx          # MODIFIED: Bootstrap import line removed (line 4)
├── App.css            # MODIFIED: .btn-primary override block removed
vite.config.js         # MODIFIED: tailwindcss() plugin added
package.json           # MODIFIED: bootstrap + react-bootstrap removed from dependencies
```

### Pattern 1: Tailwind v4 Vite Plugin Setup

**What:** Register `@tailwindcss/vite` plugin in `vite.config.js`. The React plugin must come first.
**When to use:** Always, for v4 with Vite.

```javascript
// Source: https://tailwindcss.com/docs/installation/using-vite [CITED]
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // ... existing server/proxy config is retained unchanged
})
```

### Pattern 2: CSS Entry Point with @import and @theme

**What:** The CSS file that serves as Tailwind's entry point must begin with `@import "tailwindcss"`, followed immediately by the `@theme` block. Everything else follows after.
**When to use:** In the single global CSS file — `src/index.css` in this project.

```css
/* Source: https://tailwindcss.com/docs/theme [CITED] */
@import "tailwindcss";

@theme {
  --color-bg: #242424;
  --color-surface: #333134;
  --color-accent: #ffc200;
  --color-text: #ffffff;
}

/* Remainder of src/index.css content (resets, font stack) follows here */
```

**Critical detail:** The `@import "tailwindcss"` must be the very first statement. Existing `:root` rules, `@media` blocks, and element selectors all follow after the `@theme` block.

### Pattern 3: @theme Token Naming and Usage

**What:** Theme variables defined under `--color-*` namespace automatically generate utility classes: `bg-{name}`, `text-{name}`, `border-{name}`, etc.
**Effect of D-04 tokens:**

| CSS Variable | Generated Utilities |
|---|---|
| `--color-bg: #242424` | `bg-bg`, `text-bg`, `border-bg` |
| `--color-surface: #333134` | `bg-surface`, `text-surface`, `border-surface` |
| `--color-accent: #ffc200` | `bg-accent`, `text-accent`, `border-accent` |
| `--color-text: #ffffff` | `bg-text`, `text-text`, `border-text` |

**Note on naming:** `text-text` is an odd but valid utility class. The planner may want to consider naming the white token `--color-white` or `--color-foreground` instead to produce cleaner utilities (`text-white`, `text-foreground`). This falls under Claude's Discretion (D-03 does not mandate the exact variable names beyond the semantic intent).

### Pattern 4: Automatic Content Scanning (v4, no configuration needed)

**What:** Tailwind v4 scans all files in the project automatically. It respects `.gitignore` and skips `node_modules`, binary files, CSS files, and lock files. No `content:` array in a config file is required.

**No action needed:** Unlike v3, there is no `content: ["./src/**/*.{js,jsx}"]` to configure. Source detection is zero-config.

```css
/* Source: https://tailwindcss.com/docs/detecting-classes-in-source-files [CITED] */
/* Optional: explicit source path if auto-detection needs override */
@import "tailwindcss";
@source "../src";   /* NOT needed for this project — auto-detection covers ./src */
```

### Anti-Patterns to Avoid

- **Using old `@tailwind` directives:** `@tailwind base`, `@tailwind components`, `@tailwind utilities` are v3 syntax, removed in v4. Use `@import "tailwindcss"` instead. [VERIFIED: official upgrade docs]
- **Creating `tailwind.config.js`:** No JS config file in v4. Doing so would require explicit `@config "tailwind.config.js"` in CSS and is unnecessary for this project.
- **Adding PostCSS config:** The `@tailwindcss/vite` plugin handles all CSS processing. A `postcss.config.js` is not only unnecessary — it can conflict.
- **Placing `@import "tailwindcss"` after other rules:** The import must come first. Putting it after `:root {}` blocks may cause cascade ordering issues.
- **Putting tailwindcss() before react() in plugins array:** React plugin must come first so JSX transforms work before Tailwind's CSS scanning. [CITED: community guides]

---

## The tailwind.config.js Discrepancy — Resolution

**Situation:** The original success criteria in `REQUIREMENTS.md` (SETUP-02) states "Tailwind CSS configured with custom theme tokens" without specifying file format. The phase description (in `CONTEXT.md` and above) explicitly states "tailwind.config.js defines `bg`, `surface`, `accent`, `text` tokens" — this language is a copy of v3 mental model.

**Resolution:** SETUP-02's intent is satisfied by the CSS-first `@theme` block. A `tailwind.config.js` does NOT exist in a v4-native setup. The CONTEXT.md decisions (D-02, D-03) take precedence — they lock in v4's CSS-first approach. The planner should document this explicitly: "SETUP-02 is satisfied by `@theme` block in `src/index.css`, not by a `tailwind.config.js` file."

**Verification approach:** `grep -n "color-bg\|color-surface\|color-accent\|color-text" src/index.css` confirms tokens exist in the CSS-first manner.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSS utility generation | Custom utility CSS classes | Tailwind v4 @theme tokens → auto-generated utilities | Tailwind handles responsive, hover, focus variants |
| Bootstrap removal script | Shell script to remove imports | `npm uninstall` + manual file edits (two files only) | No script needed — only 3 precise edits |
| CSS variable bridge | Manual mapping from @theme vars to :root vars | Tailwind v4 outputs `@theme` vars as `:root` CSS vars automatically | All `--color-*` variables appear in compiled output at `:root` |
| Content path config | `@source` directives | Tailwind v4 auto-detection | No config needed for standard `src/` layout |

**Key insight:** In v4, the framework handles everything that required manual configuration in v3. Less is more — the fewer files added, the better.

---

## Bootstrap Removal — Exact Scope

### What is currently importing Bootstrap

1. `src/index.jsx` line 4: `import 'bootstrap/dist/css/bootstrap.min.css'`
   - **Action:** Delete this line. Tailwind is activated via the `@import "tailwindcss"` directive in `index.css`, which is already imported on line 1 (implicit via Vite entry point handling). No replacement import is needed in `index.jsx`.

2. `src/App.css` lines 28–31: `.btn-primary` override block
   - **Action:** Delete these 4 lines. The `!important` overrides are only needed because Bootstrap's button styles override custom colours. Without Bootstrap, this block is meaningless.

3. `package.json`: `bootstrap` and `react-bootstrap` in `dependencies`
   - **Action:** `npm uninstall bootstrap react-bootstrap`

### What is NOT removed in Phase 1 (deferred to Phases 2–8)

These files import `react-bootstrap` components and will fail to render their Bootstrap-dependent JSX after the package is removed. However, per D-09, they are left untouched. The application will still run — it just won't render those components correctly:

| File | Bootstrap Components Used | Migration Phase |
|------|--------------------------|-----------------|
| `src/components/About/about.jsx` | `CardGroup` | Phase 4 |
| `src/components/CV/cv.jsx` | `CardGroup` | Phase 4 |
| `src/components/Projects/projects.jsx` | `Card`, `CardGroup` | Phase 5 |
| `src/components/Shared/card.jsx` | `Card`, `Row`, `Col` | Phase 4 |
| `src/components/Projects/Trio/trioGame.jsx` | `Modal`, `Button`, `Carousel` | Phase 6 |
| `src/components/Projects/Trio/trioGame-state.jsx` | `Modal`, `Button`, `Carousel` | Phase 6 |
| `src/components/Projects/Trio/trioHome.jsx` | `Modal`, `Button` | Phase 6 |
| `src/components/Projects/TrainGame/trainGame.jsx` | `Modal`, `Button` | Phase 6 |

**Important:** After `npm uninstall react-bootstrap`, these files will throw `Cannot find module 'react-bootstrap'` at runtime when their routes are visited. This is expected and accepted for Phase 1. The app entry point, navigation, and unaffected routes remain functional.

### Bootstrap class names in JSX (col-sm-*, py-2, etc.)

A grep audit found Bootstrap grid class names used inline in JSX classNames:
- `cv.jsx`: `col-sm-12 col-lg-12`
- `card.jsx`: `col-sm-12 col-lg-12`
- `projects.jsx`: `col-sm-6 col-lg-3 py-2`

These are string values — not imports. Without Bootstrap CSS, they simply have no effect (the classes are not in the DOM stylesheet). They will not throw errors. They are left in place and replaced in the component migration phases.

---

## Common Pitfalls

### Pitfall 1: Removing react-bootstrap package causes runtime crashes on component routes

**What goes wrong:** After `npm uninstall react-bootstrap`, visiting any route that renders a component with `import { Modal } from 'react-bootstrap'` throws a module resolution error.
**Why it happens:** The package is gone but the import statement remains in source files.
**How to avoid:** This is accepted behaviour in Phase 1 per D-09. The affected routes are not the primary verification targets for this phase. Verify by visiting routes that do NOT import react-bootstrap (e.g., Landing page, if it has no react-bootstrap imports).
**Warning signs:** A blank page or console error `Cannot resolve module 'react-bootstrap'` on affected routes is expected — not a Phase 1 regression.

### Pitfall 2: @import "tailwindcss" placed after existing CSS rules

**What goes wrong:** If `@import "tailwindcss"` is placed anywhere other than the very first line of `index.css`, CSS cascade order breaks. Tailwind's base styles may override custom resets, or Tailwind utilities may not take effect.
**Why it happens:** CSS `@import` must come before any other rules (this is a CSS spec requirement).
**How to avoid:** Place `@import "tailwindcss"` on line 1 of `src/index.css`, before the `@theme` block and before all existing rules.

### Pitfall 3: Expecting tailwindcss utility classes to work immediately without an import

**What goes wrong:** Some guides show Tailwind classes working via a CDN script in `index.html`. In the Vite plugin setup, Tailwind processes CSS files only — utility classes are generated from the CSS `@import "tailwindcss"` entry point. If `src/index.css` is not imported somewhere in the JS entry point chain, Tailwind CSS is never injected.
**Why it happens:** `src/index.jsx` already imports `src/index.css` (this is the existing import chain). No change needed.
**Warning signs:** Tailwind classes have no effect in the browser; no CSS from Tailwind appears in DevTools.

### Pitfall 4: Confusing --color-* token names with generated class names

**What goes wrong:** Token `--color-bg` generates utility class `bg-bg` (not `bg-background` or `bg-app-background`).
**Why it happens:** Tailwind v4 strips the `--color-` prefix and uses the remainder as the class suffix.
**How to avoid:** Verify token names map to intended class names before relying on them in Phase 2+.

### Pitfall 5: Adding postcss.config.js

**What goes wrong:** The `@tailwindcss/vite` plugin is a complete, self-contained Vite integration. Adding a `postcss.config.js` with `@tailwindcss/postcss` (the PostCSS variant) alongside the Vite plugin can cause double-processing or conflicts.
**How to avoid:** Do not create `postcss.config.js`. This project uses `@tailwindcss/vite` only.

---

## Code Examples

### Complete vite.config.js after Phase 1

```javascript
// Source: https://tailwindcss.com/docs/installation/using-vite [CITED]
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: {
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

### Complete src/index.css after Phase 1

```css
/* Source: https://tailwindcss.com/docs/installation/using-vite + https://tailwindcss.com/docs/theme [CITED] */
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

**Changes from original:**
- Line 1: `@import "tailwindcss"` added
- Lines 3-8: `@theme` block added (D-04)
- `:root`: `color-scheme` changed from `light dark` to `dark` (D-11); `--app-background` CSS var removed (D-05); `background-color` now uses literal value
- `html, body, #root`: `background-color` now uses literal value (CSS var removed)
- `a` / `a:hover` block: removed entirely (D-14, Vite default link colours)
- `@media (prefers-color-scheme: light)` block: removed entirely (D-10)
- `button:hover` border-color: retained as-is (not a Bootstrap default — component CSS files will handle button styling in later phases)

### src/index.jsx after Phase 1

```javascript
import React from 'react';
import { createRoot } from 'react-dom/client'
import App from './App';
// Line 4 removed: import 'bootstrap/dist/css/bootstrap.min.css';

createRoot(document.getElementById('root')).render(
    <App />,
);
```

### src/App.css after Phase 1 — deleted block

Lines 28–31 are removed:
```css
/* REMOVED:
.btn-primary, .btn-primary:hover, .btn-primary:active, .btn-primary:visited {
  background-color: #ffc200 !important;
  border-color: #ffc200 !important;
}
*/
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@tailwind base; @tailwind components; @tailwind utilities` | `@import "tailwindcss"` | v4.0 (Jan 2025) | Single import replaces three directives |
| `tailwind.config.js` with `content: [...]` | Auto-detection + `@theme` in CSS | v4.0 (Jan 2025) | No JS config file needed |
| PostCSS pipeline (`@tailwindcss/postcss`) | `@tailwindcss/vite` plugin | v4.0 (Jan 2025) | Faster, no postcss.config.js needed |
| `theme.extend.colors` in JS | `--color-*` variables in `@theme {}` | v4.0 (Jan 2025) | CSS-first, tokens exposed as CSS vars automatically |
| v3 `content` array for scanning | Automatic scanning (respects .gitignore) | v4.0 (Jan 2025) | Zero-config source detection |

**Deprecated/outdated:**
- `tailwind.config.js` (auto-detected): Not auto-detected in v4. Requires explicit `@config` directive if used at all.
- `@tailwind` at-rule directives: Removed in v4. Use `@import "tailwindcss"` instead.
- `@apply` in component CSS files: Still works in v4 but is discouraged for component-level styling.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Plugin order `[react(), tailwindcss()]` is required (React before Tailwind) | Code Examples | Low risk — swapping order may still work; not officially specified in Tailwind docs |
| A2 | `button:hover` border-color `#646cff` in `index.css` is a Vite default leftover, not intentional project styling | Code Examples | Low risk — component CSS files set their own button styles; this only affects unstyled buttons |
| A3 | The `--app-background` CSS variable is safe to remove because no component CSS file references it with CSS var() | Bootstrap Removal | Medium risk — if any component CSS file uses `var(--app-background)`, it will silently fall back to transparent. Planner should add a verification step. |

---

## Open Questions

1. **Does `var(--app-background)` appear in any per-component CSS file?**
   - What we know: `src/App.css` uses `var(--app-background, #333134)` and `src/App.css` references `page-content` and `app-background` classes. These are in `App.css`, which survives Phase 1 untouched except for the `.btn-primary` block.
   - What's unclear: Whether any of the 19 per-component CSS files also reference `var(--app-background)`.
   - Recommendation: Planner should add a verification task: `grep -r "app-background" src/` to enumerate all usages. If found, retain the CSS var alongside the `@theme` tokens or replace with the literal value.

2. **QUAL-03 scope in Phase 1**
   - What we know: QUAL-03 states "No per-component Bootstrap CSS files imported" — but the 19 CSS files in this project are custom CSS files, not Bootstrap CSS files. The only actual Bootstrap CSS file is `bootstrap.min.css` (in `node_modules`, imported via `index.jsx`).
   - What's unclear: Whether QUAL-03 is intended to mean "no Bootstrap-related imports anywhere" (satisfied by Phase 1 removing the `index.jsx` import) or "all 19 per-component CSS files removed" (satisfied only after all 8 phases).
   - Recommendation: The traceability table maps QUAL-03 to Phase 1, but the requirement text aligns with the end state of all 8 phases. Planner should note this nuance. Phase 1 satisfies the spirit of QUAL-03 by removing the only Bootstrap CSS import.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js / npm | `npm install`, `npm uninstall` | Assumed present (project already runs) | — | — |
| tailwindcss | CSS framework | Not installed yet | 4.3.0 (target) | — |
| @tailwindcss/vite | Vite integration | Not installed yet | 4.3.0 (target) | — |
| Vite | Build tool | Installed (^6.4.2) | 6.x | — |
| @vitejs/plugin-react | JSX transform | Installed (^4.2.1) | 4.x | — |

**No blocking dependencies missing.**

---

## Project Constraints (from CLAUDE.md)

- React + Vite only — no framework change. `@tailwindcss/vite` satisfies this (not Next.js, not Astro).
- Preserve all content — Phase 1 touches no component content, only CSS and package manifest.
- Netlify SPA — `public/_redirects` not affected. Tailwind changes are build-time CSS only.
- Netlify function at `netlify/functions/standings.js` — not affected.
- Spotify auth logic in `TopArtistsMap` — not affected (Phase 8).
- Colour tokens: `#242424` bg, `#333134` surface, `#ffc200` accent, `#ffffff` text — encoded in `@theme` block (D-04).

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None (no test framework installed — v2 requirement TEST-01/02 is deferred) |
| Config file | None |
| Quick run command | `npm run build` (zero-error build as primary gate) |
| Full suite command | `npm run build && npm run lint` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Exists? |
|--------|----------|-----------|-------------------|---------|
| SETUP-01 | No Bootstrap imports in bundle | grep / build | `grep -r "bootstrap" src/index.jsx` returns no matches; `npm run build` has no CSS errors | Grep: run manually |
| SETUP-02 | @theme tokens present | grep | `grep -A5 "@theme" src/index.css` shows all four colour tokens | Grep: Wave 0 task |
| SETUP-03 | Dev server starts cleanly | smoke | `npm run dev` — no console errors on startup | Manual |
| SETUP-04 | Production build succeeds | build | `npm run build` exits with code 0 | `npm run build` |
| QUAL-03 (partial) | Bootstrap CSS import removed | grep | `grep "bootstrap" src/index.jsx` returns no matches | Grep: run manually |

### Sampling Rate
- **Per task commit:** `npm run build` (fast — confirms no CSS import errors)
- **Per wave merge:** `npm run build && npm run lint`
- **Phase gate:** `npm run build` exits 0; manual browser check of dev server confirms Tailwind is active (inspect DevTools for Tailwind-generated CSS)

### Wave 0 Gaps
None — no new test files are needed for this infrastructure phase. Verification is purely via build commands and grep checks.

---

## Security Domain

> `security_enforcement` is not set to false in `.planning/config.json` (key absent).

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | Not applicable — no auth changes in this phase |
| V3 Session Management | No | Not applicable |
| V4 Access Control | No | Not applicable |
| V5 Input Validation | No | No new input handling |
| V6 Cryptography | No | No cryptographic operations |

### Known Threat Patterns for Tailwind CSS Setup

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Malicious npm package via typosquat | Tampering | Install from exact package names: `tailwindcss` and `@tailwindcss/vite` — both are official Tailwind Labs packages |
| CSS injection via user-generated content | Tampering | Not applicable — Tailwind utilities are static; no dynamic CSS generation from user input in this phase |

**Security assessment:** This is a CSS framework installation phase. No authentication, authorization, data handling, or input validation changes occur. Security risk is minimal. The only action required is confirming that the exact official package names are used.

---

## Sources

### Primary (HIGH confidence)
- `https://tailwindcss.com/docs/installation/using-vite` — Vite installation steps, plugin registration, CSS entry point [CITED]
- `https://tailwindcss.com/docs/theme` — @theme block syntax, --color-* namespace, token-to-utility mapping [CITED]
- `https://tailwindcss.com/docs/detecting-classes-in-source-files` — Auto-detection behavior, @source directive [CITED]
- `https://tailwindcss.com/docs/upgrade-guide` — v3 to v4 changes, @tailwind directive removal, tailwind.config.js deprecation [CITED]
- `https://tailwindcss.com/blog/tailwindcss-v4` — v4 architecture overview, CSS-first config [CITED]
- npm registry (`npm view tailwindcss version`, `npm view @tailwindcss/vite version`) — Version 4.3.0 confirmed 2026-05-14 [VERIFIED]

### Secondary (MEDIUM confidence)
- DEV Community: "Tailwind CSS v4 + Vite + React Setup (The Clean Way)" — plugin order `[react(), tailwindcss()]` confirmed [CITED: dev.to]
- Multiple 2025/2026 community guides consistent on plugin order [CITED: medium.com guides]

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — npm registry verified, official docs cited
- Architecture: HIGH — official installation docs followed exactly
- Bootstrap removal scope: HIGH — codebase grep verified all import locations
- Pitfalls: HIGH — verified from official upgrade guide + community patterns
- QUAL-03 scope note: MEDIUM — interpretation based on requirement text vs traceability table

**Research date:** 2026-05-15
**Valid until:** 2026-06-14 (stable framework, 30-day window reasonable)
