# Phase 5: Projects Index - Pattern Map

**Mapped:** 2026-05-15
**Files analyzed:** 2 (1 rewrite + 1 new)
**Analogs found:** 2 / 2

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/components/Projects/projects.jsx` | component (page) | request-response (pure render) | `src/components/About/about.jsx` | exact — same class-to-functional conversion pattern, same mt-14 toolbar-clearance pattern |
| `src/components/Projects/ProjectCard.jsx` | component (card) | request-response (pure render) | `src/components/Shared/card.jsx` | role-match — same white bg-white + black text card shell; layout differs (image-top vs image-left) |

## Pattern Assignments

---

### `src/components/Projects/projects.jsx` (component, pure render)

**Analog:** `src/components/About/about.jsx`

**Imports pattern** (`src/components/About/about.jsx` lines 1–2):
```jsx
import React from 'react';
import SharedCard from '../Shared/card';
```

Apply to `projects.jsx`:
```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from './ProjectCard';
```

Notes:
- No `react-bootstrap` import — remove entirely.
- No `./projects.css` import — remove entirely.
- `Link` import from `react-router-dom` follows the SideDrawer pattern (see below).

**Functional component shell** (`src/components/About/about.jsx` lines 4–88):
```jsx
const About = () => (
  <div>
    ...
  </div>
);

export default About;
```

Apply to `projects.jsx` — no state, no effects, arrow function, implicit return:
```jsx
const Projects = () => {
  const cards = [ /* data array */ ];
  return (
    <div className="mt-14 py-8 px-4 sm:px-8 lg:px-20">
      <h1 className="text-accent text-center mb-6">Personal Projects</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <ProjectCard key={card.route} {...card} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
```

**mt-14 toolbar-clearance pattern** (`src/components/CV/cv.jsx` lines 4–12):
```jsx
const CV = () => (
  <div>
    <img
      src="/BrendonWard.png"
      ...
      className="mt-8 ..."
    />
```

The toolbar is `h-14` (56 px). Use `mt-14` on the outer wrapper of `projects.jsx` — replicates `.projects-wrapper { margin-top: 56px }`. CV and About use `mt-8` on the first child element (image); Projects must use `mt-14` on the wrapper because there is no image header.

**text-accent for page title** (`src/components/CV/cv.jsx` line 13):
```jsx
<h3 className="text-accent text-xl font-bold mt-5">Career Summary</h3>
```

Apply to the "Personal Projects" `<h1>` in `projects.jsx`:
```jsx
<h1 className="text-accent text-center mb-6">Personal Projects</h1>
```

**Image path pattern — absolute `/X.jpg`** (`src/components/About/about.jsx` line 7, `src/components/CV/cv.jsx` lines 7, 19):
```jsx
src="/BrendonWard.png"
src="/CV/WTG.jpg"
```

All project card images follow the same pattern. Original `../X.jpg` → `/X.jpg`:
```
/train_numbers.jpg
/arbitrage.jpg
/card-games.jpg
/runner.jpg
/500.jpg
/nba.png
/pin.png
```

**Card data array — maps to ProjectCard** (pattern from `src/components/SideDrawer/SideDrawer.jsx` lines 4–11):
```jsx
const navLinks = [
  { to: '/About', label: 'About Me' },
  { to: '/CV', label: 'CV' },
  ...
];
```

Apply same array-of-objects pattern to projects data:
```jsx
const PROJECTS = [
  { src: '/train_numbers.jpg', title: 'Train Game',            description: 'A program that takes four digits and uses different operations to make ten.',                        route: '/Projects/TrainGame' },
  { src: '/arbitrage.jpg',     title: 'Arbitrage Betting',     description: 'A program that aggregates betting odds from different sites to find profitable arbitrage bets.',     route: '/Projects/Arbitrage' },
  { src: '/card-games.jpg',    title: 'Trio',                  description: 'A virtual version of the card game Trio',                                                            route: '/Projects/TrioGame' },
  { src: '/runner.jpg',        title: 'Pace Calculator',       description: 'Calculate your running pace as you go',                                                              route: '/Projects/PaceCalculator' },
  { src: '/500.jpg',           title: '500 Scorer',            description: 'A scoring assistant for the 500 card game',                                                          route: '/Projects/FiveHundred' },
  { src: '/nba.png',           title: 'NBA Ladder',            description: 'Live NBA standings using the Sportradar API',                                                        route: '/Projects/NBA-Ladder' },
  { src: '/pin.png',           title: 'Top Artists World Map', description: 'Spotify top artists visualized by origin country on an interactive world map.',                     route: '/Projects/TopArtistsMap' },
];
```

Routes verified against `src/components/main.jsx` lines 27–35. Note: `/Projects/TrioGame` is a valid route (line 29); the original used `/Projects/TrioGame` in the `<a href>` — no change needed.

**Commented-out entries** (`src/components/Projects/projects.jsx` lines 37–75): Keep the three commented blocks (Alexa Spotify, Noisy Detector, Facebook Analytics) as JSX comments inside the `PROJECTS` array or as a JSX comment block below the array — preserve verbatim per D-01/content-preservation constraint.

---

### `src/components/Projects/ProjectCard.jsx` (component, pure render)

**Analog:** `src/components/Shared/card.jsx`

**Imports and shell** (`src/components/Shared/card.jsx` lines 1–21):
```jsx
import React from 'react';

const SharedCard = ({ cardTitle, cardBody, imageSrc }) => (
  <div className="bg-white text-black rounded-lg mb-8">
    ...
  </div>
);

export default SharedCard;
```

Apply to `ProjectCard.jsx`:
```jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ src, title, description, route }) => (
  <Link to={route} className="no-underline text-black">
    <div className="bg-white text-black rounded-lg overflow-hidden hover:shadow-lg hover:scale-105 transition-transform duration-150">
      <img src={src} alt={title} className="h-[150px] w-full object-cover" />
      <div className="p-4">
        <h5 className="font-semibold mb-2">{title}</h5>
        <p className="h-[80px] overflow-hidden text-sm">{description}</p>
      </div>
    </div>
  </Link>
);

export default ProjectCard;
```

**bg-white + text-black card shell** (`src/components/Shared/card.jsx` line 4):
```jsx
<div className="bg-white text-black rounded-lg mb-8">
```

Shared card uses `mb-8` for spacing; in `ProjectCard` grid spacing is handled by the parent `gap-4`, so `mb-8` is omitted.

**rounded-lg + overflow-hidden** (`src/components/Shared/card.jsx` line 4, CONTEXT D-11/D-12):
```jsx
className="bg-white text-black rounded-lg ..."
```

Add `overflow-hidden` alongside `rounded-lg` so the top image corners clip correctly at the card boundary.

**Link wrapping the whole card** (`src/components/SideDrawer/SideDrawer.jsx` lines 19–22):
```jsx
<NavLink to="/" onClick={closeDrawer} className="flex flex-col items-center gap-3 no-underline">
  <img src="/BrendonWard.png" alt="Brendon Ward" className="w-24 h-auto" />
  <span className="text-white text-base font-medium">Brendon Ward</span>
</NavLink>
```

`ProjectCard` wraps the entire card `<div>` in a `<Link>` rather than `<NavLink>` (no active state needed). `no-underline` and `text-black` on the `<Link>` itself replicates `.project-card a { color: black; text-decoration: none; }` from `projects.css`.

**Image pattern** (`src/components/Shared/card.jsx` lines 7–11):
```jsx
<img
  src={imageSrc}
  alt=""
  className="max-h-[100px] w-auto pr-4 self-start mt-6 ml-6 mb-6"
/>
```

SharedCard uses image-left layout with constrained height. `ProjectCard` uses image-top layout with fixed height and full-width cover — `h-[150px] w-full object-cover` — matching the original Bootstrap `Card.Img` with `style={{height: '150px'}}`.

**Hover effect** (CONTEXT D-09, no direct codebase analog — project-specific):
```jsx
hover:shadow-lg hover:scale-105 transition-transform duration-150
```

No existing component uses this pattern yet. Apply to the inner `<div>`, not the `<Link>`, so the shadow and scale effect targets the visible card boundary.

---

## Shared Patterns

### React Router Link import
**Source:** `src/components/SideDrawer/SideDrawer.jsx` line 2
**Apply to:** `projects.jsx` (unused — card rendering delegated to ProjectCard), `ProjectCard.jsx`
```jsx
import { Link } from 'react-router-dom';
```

Note: `SideDrawer` uses `NavLink` for active-state styling; project cards have no active state so use plain `Link`.

### Absolute image paths (`/X.jpg`)
**Source:** `src/components/About/about.jsx` line 7, `src/components/CV/cv.jsx` lines 7, 19
**Apply to:** `ProjectCard.jsx` `src` prop values in the `PROJECTS` array in `projects.jsx`
```jsx
src="/BrendonWard.png"   // About — image in public root
src="/CV/WTG.jpg"        // CV — image in public subdirectory
```
All project images are in the `public/` root — use `/X.jpg` not `../X.jpg`.

### text-accent token for page titles
**Source:** `src/components/CV/cv.jsx` line 13, `src/index.css` line 5
**Apply to:** `projects.jsx` page title `<h1>`
```css
/* src/index.css */
--color-accent: #ffc200;
```
```jsx
className="text-accent ..."
```

### Functional component pattern (no class, no default export ceremony)
**Source:** `src/components/About/about.jsx` lines 4, 88; `src/components/CV/cv.jsx` lines 4, 87
**Apply to:** Both `projects.jsx` and `ProjectCard.jsx`
```jsx
const ComponentName = () => ( ... );
export default ComponentName;
```

### mt-14 toolbar clearance
**Source:** CONTEXT D-21; toolbar height confirmed as `h-14` in `src/components/Toolbar/Toolbar.jsx` line 5
**Apply to:** `projects.jsx` outermost wrapper `<div>`
```jsx
// Toolbar.jsx line 5 — establishes h-14 = 56px toolbar height
<header className="w-full fixed top-0 left-0 h-14 bg-transparent z-[1]">
```
```jsx
// projects.jsx outer wrapper
<div className="mt-14 ...">
```

---

## No Analog Found

| File | Role | Data Flow | Reason |
|---|---|---|---|
| — | — | — | All files have adequate analogs |

The hover card effect (`hover:shadow-lg hover:scale-105 transition-transform duration-150`) has no existing analog in the codebase, but it is a standard Tailwind utility pattern requiring no analog — apply directly per CONTEXT D-09.

---

## Metadata

**Analog search scope:** `src/components/About/`, `src/components/CV/`, `src/components/Landing/`, `src/components/Shared/`, `src/components/SideDrawer/`, `src/components/Toolbar/`, `src/components/Projects/`
**Files scanned:** 8
**Pattern extraction date:** 2026-05-15
