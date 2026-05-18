# Phase 8: TopArtistsMap / Spotify - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-18
**Phase:** 08-topartistsmap-spotify
**Areas discussed:** Info modal theme, Map wrapper white background, Dead code cleanup, Dynamic cursor classes

---

## Info Modal Theme

| Option | Description | Selected |
|--------|-------------|----------|
| Keep light theme (current) | White background, dark text — intentional visual contrast, dialog-like feel | |
| Switch to dark theme | Use shared Modal.jsx — gold title, dark surface bg, white/muted body text | ✓ |
| Dark theme, keep custom JSX | Don't use Modal.jsx, style modal dark with Tailwind | |

**User's choice:** Dark theme via shared Modal.jsx
**Notes:** User initially selected "keep light theme" then changed to dark theme using Modal.jsx. Reuses existing Phase 6 shared component.

---

## Map Wrapper White Background

| Option | Description | Selected |
|--------|-------------|----------|
| Keep SVG inline style as-is | Leave `style={{ background: '#ffffff', display: 'block' }}` unchanged | ✓ |
| Replace with className | Use `className='bg-white block'` on the SVG element | |
| You decide | Claude picks the safest approach | |

**User's choice:** Claude decides — keeping inline style (safest, avoids SVG CSS quirks)
**Notes:** Wrapper div gets `bg-white` Tailwind class. SVG inline style preserved unchanged.

---

## Dead Code Cleanup

| Option | Description | Selected |
|--------|-------------|----------|
| Remove it | Clean up dead `'hovered'` className toggle during migration | ✓ |
| Leave unchanged | Strict migration — only replace CSS class names | |

**User's choice:** Remove the dead className
**Notes:** No `.hovered` CSS rule exists; the className has no effect. Safe to remove.

---

## Dynamic Cursor Classes

| Option | Description | Selected |
|--------|-------------|----------|
| Inline Tailwind conditionals | `cursor-grab` / `cursor-grabbing` conditional strings in JSX | ✓ |
| Keep a thin CSS file for cursors only | Preserve CSS class toggle approach for cursor rules | |

**User's choice:** Inline Tailwind conditionals
**Notes:** Replaces `is-zoomed` / `is-dragging` CSS class toggles. No separate CSS file needed.

---

## Claude's Discretion

- SVG inline `style={{ background: '#ffffff', display: 'block' }}` kept as-is
- Exact Tailwind classes for mobile breakpoint layout (column header, larger zoom buttons)
- Whether to replace `style={{ cursor: bucket ? 'pointer' : 'default' }}` on SVG paths

## Deferred Ideas

None.
