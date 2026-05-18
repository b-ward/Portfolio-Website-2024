# Phase 1: Tailwind Setup - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-15
**Phase:** 1 - Tailwind Setup
**Areas discussed:** Tailwind version, CSS file strategy, Light mode support

---

## Tailwind Version

| Option | Description | Selected |
|--------|-------------|----------|
| v4 | Latest stable (Jan 2025). @tailwindcss/vite plugin, CSS-first @theme config, faster builds | ✓ |
| v3 | Battle-tested. PostCSS pipeline, tailwind.config.js. Vast examples online | |

**User's choice:** v4
**Notes:** Vite-native integration preferred; CSS-first config aligns with the project's existing CSS variable pattern.

---

## CSS File Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Keep all, remove only Bootstrap import | Phase 1 just removes the bootstrap package and its CSS import. Component CSS files survive untouched. | ✓ |
| Delete all component CSS files now | Clean slate — wipe all 19 CSS files. Site looks very broken until later phases. | |
| Audit and purge Bootstrap-only files | Read each CSS file, delete only pure Bootstrap override files. | |

**User's choice:** Keep all, remove only Bootstrap import
**Notes:** Per-component CSS files will be removed when each component is migrated in Phases 2–8.

---

## Light Mode Support

| Option | Description | Selected |
|--------|-------------|----------|
| Dark only — drop light mode | Remove prefers-color-scheme: light media query. Enforce dark theme. | ✓ |
| Keep light mode via Tailwind dark: | Use dark: prefix on components. More work per component in later phases. | |

**User's choice:** Dark only
**Notes:** The portfolio is intentionally designed dark. Light mode support is removed.

---

## Claude's Discretion

- Exact `@theme` block placement (inline in `index.css` vs separate `theme.css`)
- Tailwind `content` paths configuration
- Whether to use `@layer base` for resets or keep existing manual resets

## Deferred Ideas

- Per-component CSS file deletion — handled in Phases 2–8 when each component is migrated
