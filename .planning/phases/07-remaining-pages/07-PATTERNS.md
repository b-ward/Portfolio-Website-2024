# Phase 7: Remaining Pages - Pattern Map

**Mapped:** 2026-05-18
**Files analyzed:** 3 new/modified files
**Analogs found:** 3 / 3

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/components/Photos/photos.jsx` | component | render-only | `src/components/Projects/projects.jsx` | exact |
| `src/components/Music/music.jsx` | component | render-only | `src/components/About/about.jsx` | exact |
| `src/components/BusinessBrains/businessBrains.jsx` | component | render-only | `src/components/About/about.jsx` | exact |

---

## Pattern Assignments

### `src/components/Photos/photos.jsx` (component, render-only)

**Analog:** `src/components/Projects/projects.jsx`

All three files are pure render-only leaf pages. Photos is the closest to projects.jsx in shape: a single wrapper div, a heading, and a list of repeated content elements (iframes instead of cards).

**Imports pattern** (projects.jsx lines 1-2, about.jsx line 1):
```jsx
import React from 'react';
```
Drop the `{Component}` named import and the CSS file import entirely. No other imports needed.

**Component declaration pattern** (projects.jsx lines 17-18, about.jsx lines 4-5):
```jsx
const Photos = () => (
  <div>
```
Arrow function, no `render()` method, no `class` keyword. Use implicit return with parentheses when there is no logic body.

**Title pattern** — D-05 from CONTEXT.md, consistent with projects.jsx line 19 and cv.jsx line 13:
```jsx
<h3 className="text-accent text-center text-2xl font-semibold mb-4">Videography</h3>
```
`text-accent` maps to `#ffc200`. No `margin-top: 56px` — toolbar clearance already provided by `pt-14` on `<main>` in App.jsx.

**Subtitle pattern** — D-05 specifics from CONTEXT.md:
```jsx
<p className="text-center text-white">Make sure to change the quality to 1080p/4k</p>
```

**Core iframe pattern** — D-02 from CONTEXT.md (replaces `.video` CSS class):
```jsx
<iframe
  className="aspect-video w-3/5 mx-auto block mb-8"
  title="Northern Territory 2021"
  src="https://www.youtube.com/embed/z_7wfXeZL-g?si=2c-qHQHLI3aRFfkB"
  allow="fullscreen;"
></iframe>
```
`aspect-video` = 16:9 ratio (replaces 60vw × 40vw which was 3:2).
`w-3/5` = 60% width (faithful to original `60vw`).
`mx-auto block` = horizontal centering (replaces `margin-left: auto; margin-right: auto; display: block`).
`mb-8` = 2rem bottom margin (replaces `margin-bottom: 2rem`).
Apply all five iframes identically.

**Export pattern** (projects.jsx line 28):
```jsx
export default Photos;
```

**CSS file to delete:** `src/components/Photos/photos.css`
Remove import line: `import './photos.css';`

---

### `src/components/Music/music.jsx` (component, render-only)

**Analog:** `src/components/About/about.jsx`

about.jsx is the best match: a wrapper div with an inner constrained-width centred content div containing repeated content sections, mirroring Music's `soundcloud-wrapper` pattern.

**Imports pattern** (about.jsx line 1):
```jsx
import React from 'react';
```

**Component declaration pattern** (about.jsx lines 4-5):
```jsx
const Music = () => (
  <div>
```

**Title pattern** — same as Photos, D-05:
```jsx
<h3 className="text-accent text-center text-2xl font-semibold mb-4">Music</h3>
```

**Wrapper pattern** — D-03 from CONTEXT.md (replaces `.soundcloud-wrapper` CSS):
```jsx
<div className="w-4/5 mx-auto mt-8 mb-8">
```
`w-4/5` = 80% width (faithful to `width: 80%`).
`mx-auto` = `margin-left: auto; margin-right: auto`.
`mt-8 mb-8` = `margin-top: 2rem; margin-bottom: 2rem`.

**Core iframe pattern** — D-04 from CONTEXT.md (replaces `.soundcloud-audio` CSS):
```jsx
<iframe
  className="mb-8"
  title="Mix 8"
  width="100%"
  height="120"
  src="https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&feed=%2Fbrendon-ward%2Fprogressive-house-mix-1%2F"
  frameBorder="0"
></iframe>
```
`mb-8` = 2rem bottom margin (replaces `margin-bottom: 2rem` on `.soundcloud-audio`).
`width="100%" height="120"` are kept as inline HTML attributes — they were already inline in the source; only the CSS class moves to Tailwind.
Apply identically to all eight iframes.

**Export pattern** (about.jsx line 88):
```jsx
export default Music;
```

**CSS file to delete:** `src/components/Music/music.css`
Remove import line: `import './music.css';`

---

### `src/components/BusinessBrains/businessBrains.jsx` (component, render-only)

**Analog:** `src/components/About/about.jsx`

Identical structure to Music: wrapper div + constrained inner wrapper + repeated iframes. CSS values are identical to music.css.

**Imports pattern** (about.jsx line 1):
```jsx
import React from 'react';
```

**Component declaration pattern** (about.jsx lines 4-5):
```jsx
const BusinessBrains = () => (
  <div>
```

**Title pattern** — D-05:
```jsx
<h3 className="text-accent text-center text-2xl font-semibold mb-4">Business Brains</h3>
```

**Wrapper pattern** — D-03, identical to Music:
```jsx
<div className="w-4/5 mx-auto mt-8 mb-8">
```

**Core iframe pattern** — D-04 (replaces `.business-brains-audio` CSS):
```jsx
<iframe
  className="mb-8"
  title="Pod 2"
  src="https://open.spotify.com/embed/episode/3uqsIqXuVVHPeMTlB5FQ1i?theme=0"
  width="100%"
  height="232"
  frameBorder="0"
  allowTransparency="true"
  allow="encrypted-media"
></iframe>
```
`mb-8` = 2rem bottom margin (replaces `margin-bottom: 2rem` on `.business-brains-audio`).
`width="100%" height="232"` stay as inline HTML attributes.
`allowtransparency` in source is lowercase — React requires camelCase `allowTransparency`.
Apply to both iframes.

**Export pattern**:
```jsx
export default BusinessBrains;
```

**CSS file to delete:** `src/components/BusinessBrains/businessBrains.css`
Remove import line: `import './businessBrains.css';`

---

## Shared Patterns

### Functional Component Conversion
**Source:** `src/components/Projects/projects.jsx` (lines 17-28), `src/components/About/about.jsx` (lines 4-88)
**Apply to:** All three files

```jsx
// Before (class):
import React, {Component} from 'react';
import './component.css';
class Foo extends Component {
  render() {
    return ( ... );
  }
}
export default Foo;

// After (functional):
import React from 'react';
const Foo = () => (
  ...
);
export default Foo;
```

### Title / Heading Token
**Source:** `src/components/Projects/projects.jsx` line 19, `src/components/CV/cv.jsx` line 13
**Apply to:** All three components — every page-level heading

```jsx
<h3 className="text-accent text-center text-2xl font-semibold mb-4">Page Title</h3>
```
`text-accent` resolves to `#ffc200` via the `@theme` token in `src/index.css` (line 5).

### CSS Token Reference
**Source:** `src/index.css` lines 3-8

```css
@theme {
  --color-bg: #242424;
  --color-surface: #333134;
  --color-accent: #ffc200;
  --color-text: #ffffff;
}
```
Use `text-accent`, `bg-surface`, `bg-bg` as Tailwind utility classes throughout.

---

## No Analog Found

None — all three files have close analogs in the migrated codebase.

---

## Metadata

**Analog search scope:** `src/components/` — all `.jsx` files
**Files scanned:** about.jsx, cv.jsx, projects.jsx, landingpage.jsx, paceCalculator.jsx, trioHome.jsx, photos.jsx, music.jsx, businessBrains.jsx + all three CSS files
**Pattern extraction date:** 2026-05-18
