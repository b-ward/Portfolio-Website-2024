# Phase 4: About & CV Pages - Pattern Map

**Mapped:** 2026-05-15
**Files analyzed:** 3 JSX files to rewrite, 3 CSS files to delete
**Analogs found:** 3 / 3

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/components/Shared/card.jsx` | component | request-response (props-in/JSX-out) | `src/components/SideDrawer/SideDrawer.jsx` | role-match (props-driven functional) |
| `src/components/About/about.jsx` | component | request-response (static render) | `src/components/Landing/landingpage.jsx` | exact (image + layout, static functional) |
| `src/components/CV/cv.jsx` | component | request-response (static render) | `src/components/Landing/landingpage.jsx` | role-match (static functional, image render) |
| `src/components/Shared/card.css` | config | — | deleted in Phase 2 (SideDrawer.css) | exact |
| `src/components/About/about.css` | config | — | deleted in Phase 2 (SideDrawer.css) | exact |
| `src/components/CV/cv.css` | config | — | deleted in Phase 2 (SideDrawer.css) | exact |

---

## Pattern Assignments

### `src/components/Shared/card.jsx` (component, props-driven)

**Analog:** `src/components/SideDrawer/SideDrawer.jsx`

**Imports pattern** (`SideDrawer.jsx` lines 1-2):
```jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
```
Apply to card.jsx — drop `Component`, `Card`, `Row`, `Col`, `react-bootstrap`, and `./card.css`:
```jsx
import React from 'react';
```

**Functional component with destructured props** (`SideDrawer.jsx` lines 13-14):
```jsx
const SideDrawer = ({ show, closeDrawer }) => (
  <nav ...>
```
Apply to card.jsx:
```jsx
const SharedCard = ({ cardTitle, cardBody, imageSrc }) => (
  <div ...>
```

**Core pattern — conditional image left, body right** (`card.jsx` lines 11-24, to be rewritten):

Replace Bootstrap `Row`/`Col` with a Tailwind flex row. The image is conditionally rendered to the left:
```jsx
const SharedCard = ({ cardTitle, cardBody, imageSrc }) => (
  <div className="bg-surface rounded-lg mb-8 flex flex-row">
    {imageSrc && (
      <img
        src={imageSrc}
        alt=""
        className="max-h-[100px] w-auto pr-4 self-start"
      />
    )}
    <div className="p-5">
      {cardTitle && <h5 className="font-semibold mb-2">{cardTitle}</h5>}
      <div>{cardBody}</div>
    </div>
  </div>
);
```

**Link styling inside cardBody** (`card.css` line 2-4 → Tailwind inline on `<a>` tags in consumers):

The `.about-link` rule was defined but never applied. From Phase 4 decision D-21, inline links inside JSX cardBody props should use:
```jsx
<a href="..." target="_blank" rel="noreferrer" className="text-accent no-underline hover:underline">
```
This is the same pattern as `SideDrawer.jsx` line 30:
```jsx
className={({ isActive }) =>
  `block text-xl no-underline hover:text-accent ${isActive ? 'text-accent' : 'text-white'}`
}
```

**Export pattern** (`SideDrawer.jsx` line 41):
```jsx
export default SideDrawer;
```
Apply verbatim:
```jsx
export default SharedCard;
```

---

### `src/components/About/about.jsx` (component, static render)

**Analog:** `src/components/Landing/landingpage.jsx`

**Imports pattern** (`landingpage.jsx` lines 3-4):
```jsx
import React, { useRef, useEffect } from 'react';
import { init } from 'ityped';
```
Apply to about.jsx — no hooks needed (D-02), so simpler:
```jsx
import React from 'react';
import SharedCard from '../Shared/card';
```
Drop `Component`, `CardGroup`, `react-bootstrap`, and `./about.css`.

**Functional component signature** (`landingpage.jsx` line 6):
```jsx
const Landing = () => {
```
Apply (no props needed):
```jsx
const About = () => (
```
Or with explicit return if multi-line logic is preferred (consistent with Landing's pattern).

**Image render with Tailwind** (`landingpage.jsx` lines 22-26):
```jsx
<img
  src="/BrendonWard.png"
  alt="Brendon Ward"
  className="absolute bottom-0 h-[80%] lg:static lg:h-[70%]"
/>
```
Apply to about.jsx with the `.about-img` measurements from `about.css` (D-20):
```jsx
<img
  src="/BrendonWard.png"
  alt="Brendon Ward"
  className="mt-14 w-[40vw] h-[40vw] max-w-[300px] max-h-[300px] mx-auto block"
/>
```
Note: Path fix from `../BrendonWard.png` to `/BrendonWard.png` — same fix already applied in `landingpage.jsx` and `SideDrawer.jsx`.

**Container replacing CardGroup** (D-05):

Replace `<CardGroup style={{margin: '2rem 8vw 2rem 8vw'}}>` with:
```jsx
<div className="mx-[8vw] my-8">
  <SharedCard ... />
  <SharedCard ... />
  <SharedCard ... />
</div>
```

**Link content inside cardBody prop** — inline JSX links inside About's cardBody strings (D-21):
```jsx
cardBody={
  <div>
    Email: brendon.c.ward@gmail.com <br />
    LinkedIn: <a href="https://www.linkedin.com/in/brendon-c-ward/" target="_blank" rel="noreferrer" className="text-accent no-underline hover:underline">
      https://www.linkedin.com/in/brendon-c-ward/
    </a>
  </div>
}
```

**Export pattern** (`landingpage.jsx` line 42):
```jsx
export default Landing;
```
Apply:
```jsx
export default About;
```

---

### `src/components/CV/cv.jsx` (component, static render)

**Analog:** `src/components/Landing/landingpage.jsx` (structure) + `about.jsx` (same phase, same pattern)

**Imports pattern** — same as about.jsx, no hooks, drop Bootstrap:
```jsx
import React from 'react';
import SharedCard from '../Shared/card';
```

**Functional component signature** — same arrow function pattern:
```jsx
const CV = () => (
  <div>
    ...
  </div>
);
```

**Image render** — same as about.jsx (D-18, D-20):
```jsx
<img
  src="/BrendonWard.png"
  alt="Brendon Ward"
  className="mt-14 w-[40vw] h-[40vw] max-w-[300px] max-h-[300px] mx-auto block"
/>
```

**CV title (h1)** — from `cv.css` `.cv-title.main` + D-08:
```jsx
<h1 className="text-center">CV</h1>
```

**Section headers (h3)** — from `cv.css` `.cv-title` rule + D-07, replacing `<div className="col-sm-12 col-lg-12">` wrappers (D-09):
```jsx
<h3 className="text-accent mt-5">Career Summary</h3>
```
Not:
```jsx
{/* OLD — remove Bootstrap wrapper */}
<div className="col-sm-12 col-lg-12">
  <h3 className="cv-title">Career Summary</h3>
</div>
```

**Company logo image paths** — D-19, same public-root fix pattern as profile image:
```jsx
imageSrc="/CV/WTG.jpg"
```
Not `"../CV/WTG.jpg"`.

**Container replacing CardGroup** — same pattern as about.jsx (D-06):
```jsx
<div className="mx-[8vw] my-8">
  <h3 className="text-accent mt-5">Career Summary</h3>
  <SharedCard cardBody="..." />
  <h3 className="text-accent mt-5">Experience</h3>
  <SharedCard imageSrc="/CV/WTG.jpg" cardTitle="..." cardBody={[...]} />
  {/* ... remaining cards ... */}
</div>
```

**cardBody array with `<br/>` elements** — preserved verbatim, no change needed (D per CONTEXT.md specifics):
```jsx
cardBody={["- Line one.", <br/>, "- Line two.", <br/>, "- Line three."]}
```

**Export pattern:**
```jsx
export default CV;
```

---

## Shared Patterns

### Class-to-Functional Conversion
**Source:** `src/components/Toolbar/Toolbar.jsx`, `src/components/Backdrop/Backdrop.jsx`, `src/components/SideDrawer/SideDrawer.jsx`, `src/components/Landing/landingpage.jsx`
**Apply to:** All three JSX rewrites in this phase

The established conversion recipe:
1. Remove `import React, {Component} from 'react'` — replace with `import React from 'react'`
2. Remove CSS file import (e.g., `import './about.css'`)
3. Remove Bootstrap import (`import { CardGroup } from 'react-bootstrap'`)
4. Change `class X extends Component { render() { return( ... ) } }` to `const X = () => ( ... )`
5. Change `this.props.x` to destructured `{ x }` in function params
6. Keep `export default X` unchanged

Minimal functional form (`Toolbar.jsx` lines 4-9):
```jsx
const Toolbar = ({ drawerClickHandler }) => (
  <header className="w-full fixed top-0 left-0 h-14 bg-transparent z-[1]">
    <nav className="flex h-full items-center px-4">
      <DrawerToggleButton click={drawerClickHandler} />
    </nav>
  </header>
);
```

### Tailwind Colour Tokens
**Source:** `src/index.css` lines 3-8
**Apply to:** All three JSX rewrites

Available tokens (Tailwind v4 `@theme`, no `tailwind.config.js`):
```css
--color-bg: #242424      → bg-bg, text-bg
--color-surface: #333134 → bg-surface, text-surface
--color-accent: #ffc200  → bg-accent, text-accent
--color-text: #ffffff    → text-text
```
Usage pattern from `SideDrawer.jsx` lines 15, 21-22, 31-32:
```jsx
className="bg-surface ..."
className="text-white ..."
className="text-accent ..."
className="no-underline hover:text-accent ..."
```

### CSS File Deletion Pattern
**Established in Phase 2** for `SideDrawer.css`, `Toolbar.css`, `Backdrop.css`.
**Apply to:** `card.css`, `about.css`, `cv.css`

Steps:
1. Remove the `import './X.css'` line from the JSX file
2. Delete the `.css` file from disk
3. Verify no other file imports the deleted CSS

### Image Path Convention
**Source:** `src/components/Landing/landingpage.jsx` line 23, `src/components/SideDrawer/SideDrawer.jsx` line 20
**Apply to:** All image `src` attributes in this phase

Correct pattern — absolute root path:
```jsx
src="/BrendonWard.png"
src="/CV/WTG.jpg"
```
Wrong pattern — relative path (must not be used):
```jsx
src="../BrendonWard.png"   // broken
src="../CV/WTG.jpg"        // broken
```

---

## No Analog Found

All three JSX files have strong analogs from Phases 2-3. No files require RESEARCH.md fallback.

---

## Metadata

**Analog search scope:** `src/components/` (all `.jsx` files)
**Files scanned:** 25 JSX files, 3 CSS source files, `src/index.css`
**Pattern extraction date:** 2026-05-15
