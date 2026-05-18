# Phase 1: Tailwind Setup - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Install Tailwind CSS v4, configure the project colour tokens as a theme, and remove all Bootstrap dependencies (package, CSS import, Bootstrap-specific overrides). Per-component CSS files are NOT touched in this phase — they will be removed per-component in later phases.

</domain>

<decisions>
## Implementation Decisions

### Tailwind Version
- **D-01:** Use **Tailwind CSS v4** (latest stable, Jan 2025)
- **D-02:** Integrate via `@tailwindcss/vite` Vite plugin — no PostCSS pipeline, no `tailwind.config.js`
- **D-03:** Theme tokens defined using the **CSS-first `@theme` block** in a CSS file (v4 approach), not a JS config file

### Colour Theme Tokens
- **D-04:** Define the following tokens in the `@theme` block:
  - `--color-bg: #242424` (page background)
  - `--color-surface: #333134` (card/panel background)
  - `--color-accent: #ffc200` (hover states, highlights, buttons)
  - `--color-text: #ffffff` (primary text)
- **D-05:** These replace the existing `--app-background` CSS variable in `index.css`

### Bootstrap Removal Scope
- **D-06:** Remove `bootstrap` and `react-bootstrap` from `package.json` dependencies
- **D-07:** Remove the single Bootstrap CSS import from `src/index.jsx` (line 4: `import 'bootstrap/dist/css/bootstrap.min.css'`)
- **D-08:** Remove the `.btn-primary` Bootstrap override block from `src/App.css` (the `!important` hack is no longer needed)
- **D-09:** Per-component CSS files (19 total) are **left untouched** — they will be cleaned up when each component is migrated in later phases

### Light Mode
- **D-10:** Remove the `@media (prefers-color-scheme: light)` block from `src/index.css` — the site is dark-only
- **D-11:** Enforce the dark `#242424` background globally; no Tailwind `dark:` prefix needed

### Global CSS (`index.css`) Cleanup
- **D-12:** Retain the font stack, line-height, and font-rendering settings from `index.css`
- **D-13:** Retain the `html, body, #root { height: 100% }` and `body { margin: 0 }` resets
- **D-14:** Remove the Vite default link colours (`#646cff`) — links will be styled per-component with Tailwind in later phases

### Claude's Discretion
- Exact `@theme` block placement (in `index.css` vs a separate `theme.css`)
- Tailwind `content` paths configuration (standard `./src/**/*.{js,jsx}`)
- Whether to add `@layer base` resets or keep the existing manual resets

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project requirements
- `.planning/REQUIREMENTS.md` — SETUP-01 through SETUP-04 and QUAL-03 define the success criteria for this phase
- `.planning/PROJECT.md` — Colour tokens and constraints (dark-only, Netlify SPA)

### Existing code to modify
- `src/index.jsx` — Remove Bootstrap CSS import (line 4)
- `src/index.css` — Keep font/reset rules, remove light mode media query, add Tailwind directives and @theme block
- `src/App.css` — Remove `.btn-primary` Bootstrap override block
- `package.json` — Remove `bootstrap` and `react-bootstrap` from dependencies

### No external specs
No ADRs or external design docs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/index.css`: Has solid global resets (font stack, body margin, height: 100%) — these survive Bootstrap removal and can coexist with Tailwind

### Established Patterns
- Single entry point for global CSS: `src/index.jsx` imports `src/index.css` — Tailwind directives go here
- Colour scheme: already uses CSS variables (`--app-background`) — the `@theme` block extends this pattern

### Integration Points
- `vite.config.js` — `@tailwindcss/vite` plugin added here (alongside existing `@vitejs/plugin-react`)
- `src/index.jsx` — Bootstrap import removed; Tailwind is picked up automatically via Vite plugin (no explicit CSS import needed in v4)

</code_context>

<specifics>
## Specific Ideas

No specific design references — this is an infrastructure phase. Tailwind v4 docs: https://tailwindcss.com/docs/installation/vite

</specifics>

<deferred>
## Deferred Ideas

- Converting component CSS files to Tailwind — Phase 2 onward (per-component, not Phase 1)
- Adding Tailwind `dark:` variants — Not needed (dark-only decision)

</deferred>

---

*Phase: 01-tailwind-setup*
*Context gathered: 2026-05-15*
