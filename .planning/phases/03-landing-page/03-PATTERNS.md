# Phase 3: Landing Page - Pattern Map

**Mapped:** 2026-05-15
**Files analyzed:** 2 (1 rewrite, 1 delete)
**Analogs found:** 2 / 2

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/components/Landing/landingpage.jsx` | component (rewrite) | event-driven (mount-once effect) | `src/components/Projects/TopArtistsMap/topArtistsMap.jsx` + `src/components/SideDrawer/SideDrawer.jsx` | role-match (hooks) + exact (Tailwind tokens) |
| `src/components/Landing/landingpage.css` | CSS (delete) | — | — | n/a (no analog needed — file is removed) |

---

## Pattern Assignments

### `src/components/Landing/landingpage.jsx` (component rewrite, mount-once effect)

#### Analog 1 — `useRef` usage pattern
**Source:** `src/components/Projects/PaceCalculator/paceCalculator.jsx`

`paceCalculator.jsx` is the only file in the codebase that calls `React.useRef` to attach a ref to a DOM element, which is exactly the pattern needed for replacing `document.querySelector('#typing')`.

**Imports pattern** (line 1):
```jsx
import React, { useEffect, useMemo, useState } from "react";
```
For the Landing rewrite, adapt this to:
```jsx
import React, { useRef, useEffect } from 'react';
```

**useRef declaration pattern** (lines 121–122):
```jsx
const mmRef = React.useRef(null);
const ssRef = React.useRef(null);
```
For the Landing rewrite, adapt to:
```jsx
const typingRef = useRef(null);
```

**ref attached to JSX element** (lines 183–193, abbreviated):
```jsx
<input
  ref={mmRef}
  aria-label="Minutes"
  ...
/>
```
For the Landing rewrite, attach to the typing div:
```jsx
<div ref={typingRef}></div>
```

---

#### Analog 2 — `useEffect` with empty dependency array (run-once on mount)
**Source:** `src/components/Projects/NBA-Ladder/NBA-Ladder.jsx`

**useEffect run-once pattern** (lines 14–46):
```jsx
useEffect(() => {
  async function load() {
    // ...
  }
  load()
}, [])   // <-- empty array = runs once on mount
```
For the Landing rewrite, the ityped init runs once on mount with no cleanup needed:
```jsx
useEffect(() => {
  init(typingRef.current, {
    showCursor: false,
    backDelay: 1500,
    strings: ['Product Manager', 'Tester', 'Developer', 'Technology Enthusiast'],
  });
}, []);
```

---

#### Analog 3 — Tailwind colour token classes and arbitrary values
**Source:** `src/components/SideDrawer/SideDrawer.jsx`

This is the only converted component that uses the `@theme` token classes (`bg-surface`, `text-accent`, `text-white`) and Tailwind arbitrary values (`w-[70%]`, `max-w-[400px]`, `z-[200]`).

**Imports pattern** (lines 1–2):
```jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
```
Landing has no routing imports; the import line is simply:
```jsx
import React, { useRef, useEffect } from 'react';
import { init } from 'ityped';
```

**Colour token class usage** (lines 15–31):
```jsx
className={`... bg-surface shadow-[1px_0px_7px_rgba(0,0,0,0.5)] z-[200] ...`}
// ...
className="... text-white text-base font-medium"
// ...
className={({ isActive }) =>
  `block text-xl no-underline hover:text-accent ${isActive ? 'text-accent' : 'text-white'}`
}
```
Apply to Landing headings:
```jsx
<h1 className="bg-surface text-white whitespace-nowrap ...">Brendon Ward</h1>
<h2 className="bg-surface text-white ...">G'day! My name's</h2>
<h3 className="bg-surface text-white ...">I'm a <span className="text-accent inline-block"><div ref={typingRef}></div></span></h3>
```

**Arbitrary value pattern** (line 15):
```jsx
className={`... w-[70%] max-w-[400px] ...`}
```
Apply in Landing for image height, container height, and wrapper dimensions:
```jsx
h-[calc(100vh-3.5rem)]   // outer container height
h-[70%]                  // desktop image height
h-[80%]                  // mobile image height (absolute bottom-0)
max-w-[600px]            // text wrapper max-width
h-[600px]                // text wrapper height
pl-[50px]                // text wrapper left padding (desktop)
```

**Image path pattern** (line 20):
```jsx
<img src="/BrendonWard.png" alt="Brendon Ward" className="w-24 h-auto" />
```
Landing uses the same asset — absolute root path confirmed working:
```jsx
<img src="/BrendonWard.png" alt="Brendon Ward" className="h-[70%]" />
```

---

#### Analog 4 — Tailwind toolbar height and page shell context
**Source:** `src/components/Toolbar/Toolbar.jsx` and `src/App.jsx`

**Toolbar height** (Toolbar.jsx line 5):
```jsx
<header className="w-full fixed top-0 left-0 h-14 ...">
```
`h-14` = 3.5rem = 56px. This confirms `calc(100vh - 3.5rem)` is the correct clearance for the landing container.

**App shell wrapper** (App.jsx line 26):
```jsx
<main className="w-full pt-14">
```
Landing renders inside this `<main>` which already has `pt-14`. The outer container therefore needs `h-[calc(100vh-3.5rem)]` to fill the remaining viewport below the toolbar.

---

#### Analog 5 — Functional component shell pattern
**Source:** `src/components/SideDrawer/SideDrawer.jsx` (lines 13–39) and `src/App.jsx` (lines 9–32)

Both show the established functional component shape: `const Name = (props) => { ... return (...) }; export default Name;`

**Functional component with hooks shape** (App.jsx lines 9–32):
```jsx
const App = () => {
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  // ...
  return (
    <BrowserRouter>
      ...
    </BrowserRouter>
  );
};

export default App;
```
Landing rewrite follows the same shape with `useRef`/`useEffect` instead of `useState`.

---

### `src/components/Landing/landingpage.css` (CSS file — delete)

**Pattern:** Established in Phase 2. Once Tailwind classes are applied to the JSX, remove the CSS import line from `landingpage.jsx` and delete the file. No analog needed.

The Phase 2 pattern: the companion `.css` import (`import './landingpage.css'`) is removed from the component header, and the `.css` file is deleted from the filesystem.

---

## Shared Patterns

### Colour Tokens
**Source:** `src/index.css` lines 3–8
**Apply to:** All className strings in the Landing rewrite
```css
@theme {
  --color-bg: #242424;
  --color-surface: #333134;
  --color-accent: #ffc200;
  --color-text: #ffffff;
}
```
These map directly to Tailwind utility classes: `bg-bg`, `bg-surface`, `text-accent`, `text-text` (and `text-white` for explicit white where `text-text` isn't available). No `dark:` prefix needed — dark-only project.

### Arbitrary Value Syntax
**Source:** `src/components/SideDrawer/SideDrawer.jsx` line 15
**Apply to:** All measurements that have no standard Tailwind equivalent
```jsx
// Square bracket syntax for non-standard values
w-[70%]          // percentage sizes
max-w-[400px]    // pixel max-widths
z-[200]          // z-index above standard scale
h-[calc(100vh-3.5rem)]  // calc expressions (no spaces around operators in Tailwind v4)
shadow-[1px_0px_7px_rgba(0,0,0,0.5)]  // complex shadows (underscores for spaces)
```

### Responsive Breakpoint
**Source:** `src/components/SideDrawer/SideDrawer.jsx` (uses `lg:` implicitly via `max-w-[400px]`)
**Decision D-13:** Use `lg:` (1024px) as the column-switch breakpoint — closest Tailwind standard to the existing `@media (max-width: 1000px)`.

Pattern for the two-column switch:
```jsx
// Mobile-first: column stack, then row at lg
className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)]"
```

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| — | — | — | All patterns have close codebase analogs |

The only genuinely new element is combining `useRef` with a third-party DOM library (`ityped`). The `useRef` pattern exists in `paceCalculator.jsx` (lines 121–122) and the `useEffect` mount-once pattern exists in `NBA-Ladder.jsx` (lines 14–46). The composition of both for `ityped` is straightforward and the CONTEXT.md specifies the exact call signature to preserve.

---

## Metadata

**Analog search scope:** `src/` (all `.jsx` files)
**Files scanned:** 26 JSX files + `src/index.css` + `src/App.jsx`
**Pattern extraction date:** 2026-05-15
